import { Router } from "express";
import { userRoute } from "../modules/user/user.route";

const router = Router();

const routes = [
  {
    path: "/users",
    element: userRoute,
  },
];

routes.forEach((route) => router.use(route.path, route.element));

export default router;
