import AppDataSource from "../config/data-source.js";
import User from "../models/User.js";
import bcrypt from "bcrypt";

interface CreateUserDTO {
  name: string;
  email: string;
  password: string;
}

interface SearchUserDTO {
  id: string;
}

interface UpdateUserDTO {
  name?: string; // O '?' significa que 'name' pode ou não existir
  email?: string;
  password?: string;
}

export default class UserService {
  private repo = () => AppDataSource.getRepository(User);

  async createUser({
    name,
    email,
    password,
  }: CreateUserDTO): Promise<Omit<CreateUserDTO, "password">> {
    const repository = this.repo();

    const existing = await repository.findOneBy({ email });

    if (existing) throw new Error("Email has already in use");

    const hashed = await bcrypt.hash(password, 10);

    const user = repository.create({ name, email, password: hashed });

    await repository.save(user);

    const { password: _password, ...safeUser } = user;

    return safeUser;
  }

  async search({ id }: SearchUserDTO): Promise<SearchUserDTO> {
    const repository = this.repo();

    const existing = await repository.findOneBy({ id });

    if (!existing) throw new Error("User not found");

    const user = existing;

    const { password: _password, ...safeUser } = user;

    return safeUser;
  }

  async findAllUsers() {
    const repository = this.repo();

    const users = await repository.find();

    const safeUsers = users.map((user) => {
      const { password: _password, ...safeUser } = user;
      return safeUser;
    });

    return safeUsers;
  }

  async deleteUser({ id }: SearchUserDTO): Promise<void> {
    const repository = this.repo();

    const existing = await repository.findOneBy({ id });

    if (!existing) throw new Error("User not found");

    await repository.delete({ id });
  }

  async editUser(id: string, dataToUpdate: UpdateUserDTO) {
    const repository = this.repo();

    const user = await repository.findOneBy({ id });

    if (!user) throw new Error();

    if (dataToUpdate.email && dataToUpdate.email !== user.email) {
      const emailExists = await repository.findOneBy({
        email: dataToUpdate.email,
      });
      if (emailExists) throw new Error("Email already in use");
    }

    if (dataToUpdate.password) {
      dataToUpdate.password = await bcrypt.hash(dataToUpdate.password, 10);
    }

    repository.merge(user, dataToUpdate);
    const updatedUser = await repository.save(user);

    const { password: _p, ...safeUser } = updatedUser;

    return safeUser;
  }
}
