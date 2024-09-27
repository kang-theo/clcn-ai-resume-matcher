import { z } from "zod";

const EMAIL_REGEX =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

export const UserSchema = z.object({
  email: z
    .string()
    .regex(
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
      "Invalid email"
    )
    .optional(),
  username: z.string().regex(/^[a-z0-9_-]{3,15}$/g, "Invalid username"),
  password: z.string().min(6, "Password should be minimum 6 characters"),
});

export const newUserSchema = z.object({
  username: z.string().min(1, "Username is required"),
  email: z.string().regex(EMAIL_REGEX, "Invalid email"),
  password: z.string().min(6, "Password should be minimum 6 characters"),
  roles: z.array(z.string()),
  status: z.string(),
  linkedin: z.string().optional(),
});
