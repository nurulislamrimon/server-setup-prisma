import { Request } from "express";
import { IModelMappingsForWhere } from "../interfaces/modelMapping.interfaces";
import { dateFields, numberFields } from "../constants";

// =============================================
// Pick the keys from an object
// =============================================
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

// ==========================================
// Search filter and pagination
// ==========================================
export const searchFilterAndPagination = <
  T extends keyof IModelMappingsForWhere
>({
  req,
  searchableFields,
  filterableFields,
}: {
  req: Request;
  searchableFields: Array<keyof IModelMappingsForWhere[T]>;
  filterableFields: Array<keyof IModelMappingsForWhere[T]>;
}): {
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
    function removeNumberFields(
      arr1: (keyof IModelMappingsForWhere[T])[],
      arr2: string[]
    ) {
      return arr1.filter((item) => {
        return typeof item === "string" && !arr2.includes(item);
      });
    }
    where.OR = removeNumberFields(searchableFields, [
      ...numberFields,
      ...dateFields,
    ]).map((field) => ({
      [field]: {
        contains: searchTerm,
      },
    }));
  }
  // -----------------------------------
  // Filtering format for filterFields
  // -----------------------------------
  if (Object.keys(filterFields).length > 0) {
    where.AND = Object.entries(filterFields).map(([key, value]) => {
      // ---------------------------------------- for number fields
      if (numberFields.includes(key)) {
        if (typeof value === "object" && value !== null) {
          const parsedValues: { [key: string]: number } = Object.entries(
            value
          ).reduce((acc, [k, v]) => {
            acc[k] = parseFloat(v as string); // Ensure v is treated as a string for parsing
            return acc;
          }, {} as { [key: string]: number });
          return { [key]: parsedValues };
        }

        return {
          [key as keyof IModelMappingsForWhere[T]]: {
            equals: typeof value === "string" ? parseFloat(value) : value,
          },
        };
      }

      // ------------------------------------------ for date fields
      if (dateFields.includes(key)) {
        if (typeof value === "object" && value !== null) {
          const parsedValues: { [key: string]: Date } = Object.entries(
            value
          ).reduce((acc, [k, v]) => {
            acc[k] = new Date(v as string);
            return acc;
          }, {} as { [key: string]: Date });
          return { [key]: parsedValues };
        }
        const parsedDate = typeof value === "string" ? new Date(value) : value;
        return {
          [key as keyof IModelMappingsForWhere[T]]: {
            equals: parsedDate,
          },
        };
      }

      // ---------------------------------------- without number and date fields
      return {
        [key as keyof IModelMappingsForWhere[T]]: {
          equals: value,
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
