import { z } from "zod";

export const userValidate = z
  .object({
    body: z.object({
      email: z
        .string({ invalid_type_error: "Invalid email type!" })
        .email({ message: "Invalid email address!" }),
      phoneNumber: z.string({
        invalid_type_error: "Invalid Phone number!",
      }),
      password: z.string({
        required_error: "Password is required!",
        invalid_type_error: "Invalid password type!",
      }),
    }),
  })
  .refine((data) => data.body.email || data.body.phoneNumber, {
    message: "Either email or phoneNumber is required!",
  });
