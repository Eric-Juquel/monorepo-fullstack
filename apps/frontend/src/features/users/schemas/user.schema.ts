import { z } from "zod";

export const userSchema = z.object({
  id: z.string(),
  name: z.string().min(2),
  email: z.email(),
});

export type User = z.infer<typeof userSchema>;

export const usersResponseSchema = z.array(userSchema);

export const createUserSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.email("Please enter a valid email address"),
});

export type CreateUserInput = z.infer<typeof createUserSchema>;

export const updateUserSchema = createUserSchema;

export type UpdateUserInput = z.infer<typeof updateUserSchema>;
