import { Router } from "express";
import { helpRequestController } from "./helpRequest.controller";
import { authorization } from "../../../middlewares/auth";
import { administratorRoles } from "../administrators/administrators.constants";
import { validateRequest } from "../../../middlewares/zodValidator";
import { helpRequestValidate } from "./helpRequest.validator";

const router = Router();

router.get(
  "/",
  authorization(
    administratorRoles.SUPER_ADMIN,
    administratorRoles.ADMIN,
    administratorRoles.MANAGER
  ),
  helpRequestController.getAllhelpRequest
);

router.post(
  "/add",
  validateRequest(helpRequestValidate),
  helpRequestController.addHelpRequest
);
router.delete(
  "/:id",
  authorization(
    administratorRoles.SUPER_ADMIN,
    administratorRoles.ADMIN,
    administratorRoles.MANAGER
  ),
  helpRequestController.deleteHelpRequest
);

export const helpRequestRoute = router;
