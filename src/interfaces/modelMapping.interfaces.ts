import { Prisma } from "@prisma/client";

export interface IModelMappingsForWhere {
  User: Prisma.UserWhereInput;
  Help_request: Prisma.Help_requestWhereInput;
}
