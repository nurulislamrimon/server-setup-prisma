import { Prisma, Help_request } from "@prisma/client";
import prisma from "../../../orm";
import { Request } from "express";
import { searchFilterAndPagination } from "../../../utils/searchFilterAndPagination";
import {
  helpRequestFilterableFields,
  helpRequestSearchableFields,
  helpRequestSelectedFields,
} from "./helpRequest.constants";
import { DefaultArgs } from "@prisma/client/runtime/library";

// -----------------------------
// get all helpRequests
// -----------------------------
const getAllhelpRequest = async (req: Request) => {
  const query = searchFilterAndPagination<"Help_request">({
    req,
    filterableFields: helpRequestFilterableFields,
    searchableFields: helpRequestSearchableFields,
  });

  const helpRequests = await prisma.help_request.findMany({
    where: query.where,
    select: helpRequestSelectedFields,
    skip: query.skip,
    take: query.limit,
    orderBy: {
      [query.sortBy]: query.sortOrder,
    },
  });

  const total = await prisma.help_request.count({
    where: query.where,
  });

  return {
    helpRequests,
    meta: { total, page: query.page, limit: query.limit },
  };
  return {
    helpRequests: query.where,
  };
};

// -----------------------------
// add new helpRequest
// -----------------------------
const addhelpRequest = async ({ data }: { data: Help_request }) => {
  const helpRequests = await prisma.help_request.create({
    data,
  });
  return helpRequests;
};

// ---------------------------------------------
// get a helpRequest by query
// ---------------------------------------------
const getAHelpRequest = async (query: Prisma.Help_requestFindFirstArgs) => {
  const helpRequests = await prisma.help_request.findFirst(query);
  return helpRequests;
};

// -----------------------------
// update an helpRequest
// -----------------------------
const updatehelpRequest = async (
  data: Prisma.Help_requestUpdateArgs<DefaultArgs>
) => {
  const helpRequests = await prisma.help_request.update(data);
  return helpRequests;
};

// -----------------------------
// update an helpRequest
// -----------------------------
const deletehelpRequest = async (
  query: Prisma.Help_requestDeleteArgs<DefaultArgs>
) => {
  const helpRequests = await prisma.help_request.delete(query);
  return helpRequests;
};

// export
export const helpRequestService = {
  getAllhelpRequest,
  addhelpRequest,
  getAHelpRequest,
  updatehelpRequest,
  deletehelpRequest,
};
