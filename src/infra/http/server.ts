import fastify from "fastify";
import { CreateUserUseCase } from "../../app/useCases/create-user.useCase.js";
import { TypeOrmUserRepository } from "../database/typeorm/repositories/user.repository.js";
import { ZodError } from "zod";
import { AuthenticateUserUseCase } from "../../app/useCases/auth-user.useCase.js";
import { env } from "../../config/env.js";

export const app = fastify();
app.post("/users", async (request, reply) => {
  try {
    const userRepository = new TypeOrmUserRepository();
    const createUserUseCase = new CreateUserUseCase(userRepository);

    const body = request.body as {
      name: string;
      email: string;
      password: string;
    };

    const output = await createUserUseCase.execute(body);

    return reply.status(201).send(output);
  } catch (error) {
    if (error instanceof ZodError) {
      return reply.status(500).send({
        message: "Error validating environment variables",
        errors: error.format(),
      });
    }

    if (error instanceof Error) {
      const statusCode = error.message.includes("already registered")
        ? 409
        : 400;
      return reply.status(statusCode).send({
        message: error.message,
      });
    }

    return reply.status(500).send({
      message: "Internal Server Error",
    });
  }
});

const GSignals = ["SIGINT", "SIGTERM"];
GSignals.forEach((signal) => {
  process.on(signal, async () => {
    console.log(`\nRecebido ${signal}. Encerrando o app...`);
    await app.close();
    process.exit(0);
  });
});

app.post("/sessions", async (request, reply) => {
  try {
    const userRepository = new TypeOrmUserRepository();
    const authenticateUserUseCase = new AuthenticateUserUseCase(userRepository);

    const body = request.body as { email: string; password: string };

    const output = await authenticateUserUseCase.execute(body);

    return reply.status(200).send(output);
  } catch (error) {
    if (error instanceof Error && error.message.includes("Invalid")) {
      return reply.status(401).send({
        message: error.message,
      });
    }

    return reply.status(500).send({
      message: "Internal Server Error",
    });
  }
});
