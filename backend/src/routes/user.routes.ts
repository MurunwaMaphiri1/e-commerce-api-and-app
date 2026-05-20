import { Router } from "express";
import { getUsers, signup, login, getUserById, deleteUserById } from "../controllers/user.controller.js";

const router = Router();

router.get("/:id", getUserById);
router.get("/", getUsers);
router.post("/auth/signup", signup);
router.post("/auth/login", login);
router.delete("/:id", deleteUserById);

export default router;