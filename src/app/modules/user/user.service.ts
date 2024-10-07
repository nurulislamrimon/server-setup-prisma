import { User } from "@prisma/client";
import prisma from "../../../orm";
import { Request } from "express";
import { searchFilterAndPagination } from "../../../utils/searchFilterAndPagination";
import { userFilterableFields, userSearchableFields } from "./user.constants";

// -----------------------------
// get all users
// -----------------------------
const getAllUsers = async (req: Request) => {
  const query = searchFilterAndPagination<"User">({
    req,
    filterableFields: userFilterableFields,
    searchableFields: userSearchableFields,
  });

  const users = await prisma.user.findMany({
    where: query.where,
    skip: query.skip,
    take: query.limit,
    orderBy: {
      [query.sortBy]: query.sortOrder,
    },
  });

  const total = await prisma.user.count({
    where: query.where,
  });

  return {
    users,
    meta: { total, page: query.page, limit: query.limit },
  };
};

// -----------------------------
// add new user
// -----------------------------
const addUsers = async ({ data }: { data: User }) => {
  const users = await prisma.user.create({
    data,
  });
  return users;
};

// export
export const userService = {
  getAllUsers,
  addUsers,
};
