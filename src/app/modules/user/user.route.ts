import { Router } from "express";
import { userController } from "./user.controller";

const router = Router();

router.get("/", userController.getUsers);
router.post("/add", userController.addUser);

export const userRoute = router;
