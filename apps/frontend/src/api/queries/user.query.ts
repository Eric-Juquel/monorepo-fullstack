import { queryOptions, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { userService } from "@/api/services/user.service";
import type { CreateUserInput, UpdateUserInput } from "@/features/users/schemas/user.schema";

export const usersQueryOptions = queryOptions({
  queryKey: ["users"],
  queryFn: userService.getAll,
});

export const useUsersQuery = () => useQuery(usersQueryOptions);

export const useCreateUserMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateUserInput) => userService.create(input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["users"] }),
  });
};

export const useUpdateUserMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateUserInput }) =>
      userService.update(id, input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["users"] }),
  });
};

export const useDeleteUserMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => userService.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["users"] }),
  });
};
