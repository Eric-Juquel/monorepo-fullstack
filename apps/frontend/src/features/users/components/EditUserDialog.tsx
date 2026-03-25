import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { useUpdateUserMutation } from "@/api/queries/user.query";
import {
  type UpdateUserInput,
  type User,
  updateUserSchema,
} from "@/features/users/schemas/user.schema";
import { Button } from "@/shared/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";

interface EditUserDialogProps {
  readonly user: User;
  readonly open: boolean;
  readonly onOpenChange: (open: boolean) => void;
}

export function EditUserDialog({ user, open, onOpenChange }: EditUserDialogProps) {
  const { t } = useTranslation();
  const updateUser = useUpdateUserMutation();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<UpdateUserInput>({
    resolver: zodResolver(updateUserSchema),
    defaultValues: { name: user.name, email: user.email },
  });

  useEffect(() => {
    if (open) reset({ name: user.name, email: user.email });
  }, [open, user, reset]);

  const onSubmit = async (data: UpdateUserInput) => {
    try {
      await updateUser.mutateAsync({ id: user.id, input: data });
      toast.success(t("users.form.updateSuccess"));
      onOpenChange(false);
    } catch {
      toast.error(t("users.form.updateError"));
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("users.form.editTitle")}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 pt-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="edit-name">{t("users.form.name")}</Label>
            <Input
              id="edit-name"
              placeholder={t("users.form.namePlaceholder")}
              {...register("name")}
            />
            {errors.name && <p className="text-sm text-destructive">{t("users.form.nameMin")}</p>}
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="edit-email">{t("users.form.email")}</Label>
            <Input
              id="edit-email"
              type="email"
              placeholder={t("users.form.emailPlaceholder")}
              {...register("email")}
            />
            {errors.email && (
              <p className="text-sm text-destructive">{t("users.form.emailInvalid")}</p>
            )}
          </div>

          <div className="flex justify-end gap-2">
            <DialogClose asChild>
              <Button type="button" variant="outline">
                {t("users.form.cancel")}
              </Button>
            </DialogClose>
            <Button type="submit" disabled={isSubmitting}>
              {t("users.form.update")}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
