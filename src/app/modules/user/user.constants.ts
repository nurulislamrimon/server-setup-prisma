import { User } from "@prisma/client";

export const userFilterableFields: (keyof User)[] = ["full_name"];
export const userSearchableFields: (keyof User)[] = ["full_name", "email"];
