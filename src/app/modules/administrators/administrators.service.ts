import { Prisma, Administrator } from "@prisma/client";
import prisma from "../../../orm";
import { Request } from "express";
import { searchFilterAndPagination } from "../../../utils/searchFilterAndPagination";
import {
  administratorFilterableFields,
  administratorSearchableFields,
  administratorSelectedFields,
} from "./administrators.constants";

// -----------------------------
// get all administrators
// -----------------------------
const getAllAdministrators = async (req: Request) => {
  const query = searchFilterAndPagination<"Administrator">({
    req,
    filterableFields: administratorFilterableFields,
    searchableFields: administratorSearchableFields,
  });

  const administrators = await prisma.administrator.findMany({
    where: query.where,
    select: administratorSelectedFields,
    skip: query.skip,
    take: query.limit,
    orderBy: {
      [query.sortBy]: query.sortOrder,
    },
  });

  const total = await prisma.administrator.count({
    where: query.where,
  });

  return {
    administrators,
    meta: { total, page: query.page, limit: query.limit },
  };
};

// -----------------------------
// add new administrator
// -----------------------------
const addAdministrators = async ({ data }: { data: Administrator }) => {
  const administrators = await prisma.administrator.create({
    data,
  });
  return administrators;
};

// ---------------------------------------------
// get a administrator by query
// ---------------------------------------------
const getAnAdministrator = async (query: Prisma.AdministratorFindFirstArgs) => {
  const administrators = await prisma.administrator.findFirst(query);
  return administrators;
};

// export
export const administratorService = {
  getAllAdministrators,
  addAdministrators,
  getAnAdministrator,
};
