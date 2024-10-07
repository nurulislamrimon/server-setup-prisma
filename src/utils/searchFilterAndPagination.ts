import { Request } from "express";
import { IModelMappingsForWhere } from "../interfaces/modelMapping.interfaces";

// --------------------------------
// Pick the keys from an object
// --------------------------------
const pick = (
  obj: Record<string, unknown>,
  keys: string[]
): Record<string, unknown> => {
  const finalObj: Record<string, unknown> = {};
  for (const key of keys) {
    if (obj && Object.prototype.hasOwnProperty.call(obj, key)) {
      finalObj[key] = obj[key];
    }
  }
  return finalObj;
};

// --------------------------------
// Search filter and pagination
// --------------------------------
export const searchFilterAndPagination = <
  T extends keyof IModelMappingsForWhere
>(
  req: Request,
  searchableFields: Array<keyof IModelMappingsForWhere[T]>,
  filterableFields: Array<keyof IModelMappingsForWhere[T]>
): {
  where: IModelMappingsForWhere[T];
  page: number;
  limit: number;
  skip: number;
  sortBy: keyof IModelMappingsForWhere[T];
  sortOrder: "asc" | "desc";
} => {
  const {
    searchTerm,
    page = 1,
    limit = 10,
    sortBy,
    sortOrder,
    ...filterQuery
  } = req.query;

  // Pick filter fields from query
  const filterFields = pick(filterQuery, filterableFields.map(String));

  const where: IModelMappingsForWhere[T] = {};

  // ------------------------------------
  // Filtering format for searchTerm
  // ------------------------------------
  if (typeof searchTerm === "string") {
    where.OR = searchableFields.map((field) => ({
      [field]: {
        contains: searchTerm, // Use `contains` for search term
        mode: "insensitive",
      },
    }));
  }

  // -----------------------------------
  // Filtering format for filterFields
  // -----------------------------------
  if (Object.keys(filterFields).length > 0) {
    where.AND = Object.entries(filterFields).map(([key, value]) => {
      return {
        [key as keyof IModelMappingsForWhere[T]]: {
          equals: value as string | undefined, // Ensure the value type is correct
        },
      };
    });
  }

  // Validate sortBy
  const validatedSortBy: keyof IModelMappingsForWhere[T] =
    searchableFields.includes(sortBy as keyof IModelMappingsForWhere[T])
      ? (sortBy as keyof IModelMappingsForWhere[T])
      : ("created_at" as keyof IModelMappingsForWhere[T]);

  // Validate sortOrder
  const validatedSortOrder: "asc" | "desc" =
    sortOrder === "asc" || sortOrder === "desc"
      ? (sortOrder as "asc" | "desc")
      : "desc";

  return {
    where,
    page: Number(page),
    limit: Number(limit),
    skip: (Number(page) - 1) * Number(limit),
    sortBy: validatedSortBy,
    sortOrder: validatedSortOrder,
  };
};
