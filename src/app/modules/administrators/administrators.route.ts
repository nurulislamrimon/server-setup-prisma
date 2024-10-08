import { Router } from "express";
import { administratorController } from "./administrators.controller";
import { authentication, authorization } from "../../../middlewares/auth";
import { administratorRoles } from "./administrators.constants";

const router = Router();

router.get(
  "/",
  authorization(
    administratorRoles.SUPER_ADMIN,
    administratorRoles.ADMIN,
    administratorRoles.MANAGER
  ),
  administratorController.getAllAdministrators
);
router.post(
  "/add",
  authorization(administratorRoles.SUPER_ADMIN, administratorRoles.ADMIN),
  administratorController.addAdministrator
);
router.post("/login", administratorController.login);

export const administratorRoute = router;
