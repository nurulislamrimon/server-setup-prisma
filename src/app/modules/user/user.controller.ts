import { RequestHandler } from "express";
import { userService } from "./user.service";
import { sendResponse } from "../../../utils/sendResponse";
import { User } from "@prisma/client";
import { catchAsync } from "../../../utils/catchAsync";

/**
 *@api{GET}/ GET Request.
 *@apiDescription This is a GET request for / api.
 *@apiPermission Admin
 *@apiHeader accessToken
 *@apiBody none
 *@apiParam none
 *@apiQuery fieldName, limit,sort,page
 *@apiSuccess Array - Array of users
 *@apiError 401 unauthorized or 401 or 403 forbidden or 404 not found
 */

const getUsers: RequestHandler = catchAsync(async (req, res, next) => {
  const result = await userService.getUsers(req);
  sendResponse<User[]>({
    res,
    success: true,
    message: "Users retrieved successfully!",
    data: result.users,
    meta: result.meta,
    statusCode: 200,
  });
});

/**
 *@api{POST}/add POST Request.
 *@apiDescription This is a POST request for /add api.
 *@apiPermission Admin
 *@apiHeader accessToken
 *@apiBody Object - user data
 *@apiParam none
 *@apiQuery none,
 *@apiSuccess Object - user data
 *@apiError 401 unauthorized or 401 or 403 forbidden or 404 not found
 */

const addUser: RequestHandler = catchAsync(async (req, res) => {
  const newUser = req.body;
  const users = await userService.addUsers({ data: newUser });
  sendResponse<User>({
    res,
    success: true,
    message: "Users added successfully!",
    data: users,
    statusCode: 200,
  });
});

// export user controller
export const userController = {
  getUsers,
  addUser,
};
