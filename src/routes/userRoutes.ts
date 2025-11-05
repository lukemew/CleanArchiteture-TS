import { Router } from "express";
import UserController from "../controllers/UserController.js";

const userRouter = Router();

userRouter.post("/users", UserController.create);
userRouter.get("/users/:id", UserController.search);
userRouter.get("/users/", UserController.listAll);
userRouter.delete("/users/:id", UserController.delete);
userRouter.patch("/users/:id", UserController.update);

export default userRouter;
