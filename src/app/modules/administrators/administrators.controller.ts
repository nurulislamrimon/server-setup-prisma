import bcrypt from "bcrypt";
import { RequestHandler } from "express";
import { administratorService } from "./administrators.service";
import { sendResponse } from "../../../utils/sendResponse";
import { Administrator } from "@prisma/client";
import { catchAsync } from "../../../utils/catchAsync";
import { ApiError } from "../../../utils/ApiError";
import { config } from "../../../config";
import { generateToken } from "../../../helpers/jwt";
import {
  accessTokenExpireTime,
  refreshTokenExpireTime,
} from "../../../constants";

/**
 *@api{GET}/ GET Request.
 *@apiDescription This is a GET request for / api.
 *@apiPermission Admin
 *@apiHeader accessToken
 *@apiBody none
 *@apiParam none
 *@apiQuery fieldName, limit,sort,page
 *@apiSuccess Array - Array of administrators
 *@apiError 401 unauthorized or 401 or 403 forbidden or 404 not found
 */

const getAllAdministrators: RequestHandler = catchAsync(
  async (req, res, next) => {
    const result = await administratorService.getAllAdministrators(req);
    sendResponse<Partial<Administrator>[]>({
      res,
      success: true,
      message: "Administrators retrieved successfully!",
      data: result.administrators,
      meta: result.meta,
      statusCode: 200,
    });
  }
);

/**
 *@api{POST}/add POST Request.
 *@apiDescription This is a POST request for /add api.
 *@apiPermission Admin
 *@apiHeader accessToken
 *@apiBody Object - administrator data
 *@apiParam none
 *@apiQuery none,
 *@apiSuccess Object - administrator data
 *@apiError 401 unauthorized or 401 or 403 forbidden or 404 not found
 */

const addAdministrator: RequestHandler = catchAsync(async (req, res) => {
  const newAdministrator = req.body;

  const isAlreadyExist = await administratorService.getAnAdministrator({
    where: { email: newAdministrator.email },
  });
  if (isAlreadyExist) {
    throw new ApiError(403, "Administrator already exist");
  }
  // hash the password
  newAdministrator.password = await bcrypt.hash(newAdministrator.password, 10);
  const result = await administratorService.addAdministrators({
    data: newAdministrator,
  });
  if (!result) {
    throw new ApiError(404, "Something went wrong");
  }
  const { password, ...rest } = result;
  sendResponse<Partial<Administrator>>({
    res,
    success: true,
    message: "Administrators added successfully!",
    data: rest,
    statusCode: 200,
  });
});

/**
 *@api{POST}/update POST Request.
 *@apiDescription This is a POST request for /update api.
 *@apiPermission Admin
 *@apiHeader accessToken
 *@apiBody Object - administrator data
 *@apiParam none
 *@apiQuery none,
 *@apiSuccess Object - administrator data
 *@apiError 401 unauthorized or 401 or 403 forbidden or 404 not found
 */

const updateAdministrator: RequestHandler = catchAsync(async (req, res) => {
  const user = req.user;
  const newAdministrator = req.body;
  const isAlreadyExist = await administratorService.getAnAdministrator({
    where: { email: user?.email },
  });

  if (!isAlreadyExist) {
    throw new ApiError(404, "User not found!");
  }
  if (newAdministrator?.password) {
    newAdministrator.password = await bcrypt.hash(
      newAdministrator.password,
      10
    );
  }
  // hash the password
  const result = await administratorService.updateAdministrators({
    where: { email: user?.email },
    data: newAdministrator,
  });
  if (!result) {
    throw new ApiError(404, "Something went wrong");
  }
  const { password, ...rest } = result;
  sendResponse<Partial<Administrator>>({
    res,
    success: true,
    message: "Administrators added successfully!",
    data: rest,
    statusCode: 200,
  });
});

/**
 *@api{POST}/login POST Request.
 *@apiDescription This is a POST request for /login api.
 *@apiPermission none
 *@apiHeader none
 *@apiBody Object - {email, password}
 *@apiParam none
 *@apiQuery none
 *@apiSuccess Object - {accessToken, refreshToken, administrator}
 *@apiError 401 unauthorized or 401 or 403 forbidden or 404 not found
 */
const login: RequestHandler = catchAsync(async (req, res) => {
  const { email, password } = req.body;

  const isAdministratorExist = await administratorService.getAnAdministrator({
    where: { email },
  });

  if (!isAdministratorExist) {
    throw new ApiError(404, "Administrator not found");
  }

  const isPasswordMatched = await bcrypt.compare(
    password,
    isAdministratorExist.password
  );
  if (!isPasswordMatched) {
    throw new ApiError(401, "Invalid credentials");
  }

  const { password: pass, ...rest } = isAdministratorExist;
  // generate access token
  const accessToken = generateToken(
    isAdministratorExist,
    config.accessTokenSecret,
    accessTokenExpireTime
  );
  // generate refresh token
  const refreshToken = generateToken(
    isAdministratorExist,
    config.refreshTokenSecret,
    refreshTokenExpireTime
  );

  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: config.env === "production",
  });
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: config.env === "production",
  });

  sendResponse({
    res,
    success: true,
    message: "Administrator logged in successfully!",
    data: { administrator: rest, accessToken, refreshToken },
    statusCode: 200,
  });
});

// export administrator controller
export const administratorController = {
  getAllAdministrators,
  addAdministrator,
  login,
  updateAdministrator,
};
