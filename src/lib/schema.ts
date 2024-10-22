import { z } from "zod";

// Username validation
const usernameSchema = z
  .string()
  .min(6, "Username must be at least 6 characters")
  .max(15, "Username cannot exceed 15 characters")
  .regex(
    /^[a-z0-9_-]+$/,
    "Username can only contain lowercase letters, numbers, hyphens, or underscores"
  );

// Email validation
const emailSchema = z.string().email("Invalid email format").optional();

// Password validation
const passwordSchema = z
  .string()
  .min(6, "Password must be at least 6 characters");

// Full user schema that combines username, email, and password
export const userSchema = z.object({
  username: usernameSchema,
  email: emailSchema,
  password: passwordSchema,
});

// Types for validation
export type UserForm = z.infer<typeof userSchema>;

export const newQuestionaireSchema = z.object({
  title: z.string(),
  description: z.string(),
  created_by: z.string(),
  standard_scores: z.number().optional(),
  questionaire_item_ids: z.array(z.string()),
});
