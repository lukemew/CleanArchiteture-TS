import type { Request, Response } from "express";
import UserService from "../services/UserService.js";

const userService = new UserService();
export default class UserController {
  static async create(req: Request, res: Response): Promise<Response> {
    try {
      const { name, email, password } = req.body;

      if (
        typeof name !== "string" ||
        typeof email !== "string" ||
        typeof password !== "string"
      )
        throw new Error("Missing user information!");

      const user = await userService.createUser({ name, email, password });

      return res.status(201).json({ user });
    } catch (err) {
      if (err instanceof Error)
        return res.status(400).json({ error: err.message });

      return res.status(500).json({ Error: "Internal server error!" });
    }
  }

  static async search(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;

      if (!id) throw new Error("Missing user ID");

      const user = await userService.search({ id });

      return res.status(200).json({ user });
    } catch (err) {
      if (err instanceof Error)
        return res.status(400).json({ Error: err.message });

      return res.status(500).json({ Error: "Internal server error!" });
    }
  }

  static async listAll(req: Request, res: Response): Promise<Response> {
    try {
      const users = await userService.findAllUsers();

      if (typeof users === "undefined") throw new Error("No users");

      return res.status(200).json(users);
    } catch (err) {
      if (err instanceof Error)
        return res.status(400).json({ Error: err.message });

      return res.status(500).json({ Error: "Internal server error!" });
    }
  }

  static async delete(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;

      if (!id) throw new Error("Missing user ID");

      await userService.deleteUser({ id });

      return res.status(204).send();
    } catch (err) {
      if (err instanceof Error) {
        if (err.message == "User not found") {
          return res.status(404).json({ Error: err.message });
        }
        return res.status(400).json({ Error: err.message });
      }

      return res.status(500).json({ Error: "Internal server error!" });
    }
  }

  static async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { name, email, password } = req.body;

      if (!id) throw new Error("Missing user ID");

      if (
        typeof name !== "string" ||
        typeof email !== "string" ||
        typeof password !== "string"
      )
        throw new Error("Missing user information");

      const user = await userService.editUser(id, { name, email, password });

      return res.status(200).json(user);
    } catch (err) {
      if (err instanceof Error) {
        if (err.message === "User not found") {
          res.status(404).json({ Error: err.message });
        }
        res.status(400).json({ Error: err.message });
      }

      res.status(500).json({ Error: "Internal server error" });
    }
  }
}
