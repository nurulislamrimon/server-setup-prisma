import { Router } from "express";
import { userController } from "./user.controller";

const router = Router();

router.get("/", userController.getAllUsers);
router.post("/add", userController.addUser);

export const userRoute = router;
