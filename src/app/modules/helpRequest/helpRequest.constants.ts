import { Help_request, Prisma } from "@prisma/client";

export const helpRequestFilterableFields: (keyof Help_request)[] = [
  "id",
  "platform_name",
  "client_name",
  "email",
  "phone_number",
  "project_description",
  "budget_min",
  "budget_max",
  "created_at",
  "updated_at",
];
export const helpRequestSearchableFields: (keyof Help_request)[] = [
  "platform_name",
  "client_name",
  "email",
  "project_description",
];

// ------------------------------------
// select fields
// ------------------------------------

type Help_requestSelectedFields = {
  [key in keyof Partial<Prisma.Help_requestGetPayload<{}>>]: boolean;
};

export const helpRequestSelectedFields: Help_requestSelectedFields = {
  id: true,
  platform_name: true,
  client_name: true,
  phone_number: true,
  email: true,
  budget_min: true,
  budget_max: true,
  project_description: true,
  created_at: true,
  updated_at: true,
  deleted_at: true,
};
