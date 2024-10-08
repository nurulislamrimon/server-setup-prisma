import { Router } from "express";
import { administratorRoute } from "../modules/administrators/administrators.route";

const router = Router();

const routes = [
  {
    path: "/administrators",
    element: administratorRoute,
  },
];

routes.forEach((route) => router.use(route.path, route.element));

export default router;
