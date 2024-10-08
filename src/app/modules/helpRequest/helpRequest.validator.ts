import { z } from "zod";

export const helpRequestValidate = z.object({
  body: z.object({
    platform_name: z.string({
      invalid_type_error: "Invalid platform_name type!",
    }),
    client_name: z.string({ invalid_type_error: "Invalid client_name type!" }),
    phone_number: z.string({
      invalid_type_error: "Invalid phone_number type!",
    }),
    email: z
      .string({ invalid_type_error: "Invalid email type!" })
      .email({ message: "Invalid email address!" }),
    budget_min: z.number({ invalid_type_error: "Invalid budget_min type!" }),
    budget_max: z.number({ invalid_type_error: "Invalid budget_max type!" }),
    project_description: z.string({
      invalid_type_error: "Invalid project_description type!",
    }),
  }),
});
