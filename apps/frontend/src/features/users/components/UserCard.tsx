import { Pencil, Trash2 } from "lucide-react";
import { memo, startTransition, useOptimistic, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { useDeleteUserMutation } from "@/api/queries/user.query";
import type { User } from "@/features/users/schemas/user.schema";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { EditUserDialog } from "./EditUserDialog";

interface UserCardProps {
  readonly user: User;
}

export const UserCard = memo(function UserCard({ user }: UserCardProps) {
  const { t } = useTranslation();
  const [editOpen, setEditOpen] = useState(false);
  const deleteUser = useDeleteUserMutation();

  // useOptimistic: hide the card immediately on delete, reverts if the API fails
  const [optimisticDeleted, setOptimisticDeleted] = useOptimistic(
    false,
    (_, deleted: boolean) => deleted,
  );

  const handleDelete = () => {
    startTransition(async () => {
      setOptimisticDeleted(true);
      try {
        await deleteUser.mutateAsync(user.id);
        toast.success(t("users.form.deleteSuccess"));
      } catch {
        toast.error(t("users.form.deleteError"));
      }
    });
  };

  if (optimisticDeleted) return null;

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-start justify-between">
          <CardTitle>{user.name}</CardTitle>
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="icon"
              aria-label={t("users.edit")}
              onClick={() => setEditOpen(true)}
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              aria-label={t("users.delete")}
              onClick={handleDelete}
              disabled={deleteUser.isPending}
            >
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">{user.email}</p>
        </CardContent>
      </Card>

      <EditUserDialog user={user} open={editOpen} onOpenChange={setEditOpen} />
    </>
  );
});
