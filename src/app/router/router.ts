import { Router } from "express";
import { administratorRoute } from "../modules/administrators/administrators.route";
import { helpRequestRoute } from "../modules/helpRequest/helpRequest.route";

const router = Router();

const routes = [
  {
    path: "/administrators",
    element: administratorRoute,
  },
  {
    path: "/help-request",
    element: helpRequestRoute,
  },
];

routes.forEach((route) => router.use(route.path, route.element));

export default router;
