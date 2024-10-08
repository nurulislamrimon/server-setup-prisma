import { RequestHandler } from "express";
import { helpRequestService } from "./helpRequest.service";
import { sendResponse } from "../../../utils/sendResponse";
import { catchAsync } from "../../../utils/catchAsync";
import { ApiError } from "../../../utils/ApiError";
import { Help_request } from "@prisma/client";

/**
 *@api{GET}/ GET Request.
 *@apiDescription This is a GET request for / api.
 *@apiPermission Admin
 *@apiHeader accessToken
 *@apiBody none
 *@apiParam none
 *@apiQuery fieldName, limit,sort,page
 *@apiSuccess Array - Array of helpRequests
 *@apiError 401 unauthorized or 401 or 403 forbidden or 404 not found
 */
const getAllhelpRequest: RequestHandler = catchAsync(async (req, res, next) => {
  const result = await helpRequestService.getAllhelpRequest(req);
  sendResponse({
    res,
    success: true,
    message: "helpRequest retrieved successfully!",
    data: result.helpRequests,
    // meta: result.meta,
    statusCode: 200,
  });
});

/**
 *@api{POST}/add POST Request.
 *@apiDescription This is a POST request for /add api.
 *@apiPermission Admin
 *@apiHeader accessToken
 *@apiBody Object - helpRequest data
 *@apiParam none
 *@apiQuery none,
 *@apiSuccess Object - helpRequest data
 *@apiError 401 unauthorized or 401 or 403 forbidden or 404 not found
 */
const addHelpRequest: RequestHandler = catchAsync(async (req, res) => {
  const newHelpRequest = req.body;

  const result = await helpRequestService.addhelpRequest({
    data: newHelpRequest,
  });
  if (!result) {
    throw new ApiError(404, "Something went wrong");
  }
  sendResponse<Partial<Help_request>>({
    res,
    success: true,
    message: "helpRequest added successfully!",
    data: result,
    statusCode: 200,
  });
});

/**
 *@api{POST}/delete/:id DELETE Request.
 *@apiDescription This is a DELETE request for /delete/:id api.
 *@apiPermission Admin
 *@apiHeader accessToken
 *@apiBody Object - helpRequest data
 *@apiParam none
 *@apiQuery none,
 *@apiSuccess Object - helpRequest data
 *@apiError 401 unauthorized or 401 or 403 forbidden or 404 not found
 */
const deleteHelpRequest: RequestHandler = catchAsync(async (req, res) => {
  const id = req.params.id;

  const isExist = await helpRequestService.getAHelpRequest({
    where: { id: parseInt(id) },
  });

  if (!isExist) {
    throw new ApiError(404, "helpRequest not found!");
  }

  const result = await helpRequestService.deletehelpRequest({
    where: { id: parseInt(id) },
  });
  if (!result) {
    throw new ApiError(404, "Something went wrong");
  }
  sendResponse<Partial<Help_request>>({
    res,
    success: true,
    message: "helpRequest added successfully!",
    data: result,
    statusCode: 200,
  });
});

// export helpRequest controller
export const helpRequestController = {
  getAllhelpRequest,
  addHelpRequest,
  deleteHelpRequest,
};
