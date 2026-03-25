import { apiClient } from "@/api/client/axios.client";
import {
  type CreateUserInput,
  type UpdateUserInput,
  type User,
  userSchema,
  usersResponseSchema,
} from "@/features/users/schemas/user.schema";

export const userService = {
  getAll: async (): Promise<User[]> => {
    const { data } = await apiClient.get<unknown>("/users");
    return usersResponseSchema.parse(data);
  },

  create: async (input: CreateUserInput): Promise<User> => {
    const { data } = await apiClient.post<unknown>("/users", input);
    return userSchema.parse(data);
  },

  update: async (id: string, input: UpdateUserInput): Promise<User> => {
    const { data } = await apiClient.put<unknown>(`/users/${id}`, input);
    return userSchema.parse(data);
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/users/${id}`);
  },
};
