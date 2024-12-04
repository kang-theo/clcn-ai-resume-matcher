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
const emailSchema = z
  .string()
  .regex(
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
    "Invalid email"
  )
  .optional();

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

export const registerUserSchema = z.object({
  email: z
    .string()
    .regex(
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
      "Invalid email"
    ),
  username: z
    .string()
    .regex(
      /^[a-z0-9_-]{3,15}$/g,
      "Username should be 3 to 15 characters long and consist only of lowercase letters, digits, underscores, or hyphens."
    ),
  password: z.string().min(6, "Password should be minimum 6 characters"),
});

export const loginUserSchema = z.object({
  username: z.string().optional(),
  email: z
    .string()
    .regex(
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
      "Invalid email"
    )
    .optional(),
  password: z.string().min(6, "Password should be minimum 6 characters"),
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

export const newJobSchema = z.object({
  title: z.string(),
  description: z.string(),
  status: z.string().optional(),
  created_by: z.string(),
});

export const deleteItemsSchema = z.object({
  ids: z.array(z.string()),
});

export const newTagSchema = z.object({
  name: z.string(),
});

export const newApplicationSchema = z.object({
  user_id: z.string(),
  online_resume_id: z.string(),
  job_description_id: z.string(),
  scores: z.number().optional(),
});
