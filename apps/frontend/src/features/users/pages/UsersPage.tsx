import { useTranslation } from "react-i18next";
import { useUsersQuery } from "@/api/queries/user.query";
import { UserCard } from "@/features/users/components/UserCard";
import { UserForm } from "@/features/users/components/UserForm";

export default function UsersPage() {
  const { t } = useTranslation();
  const { data: users, isLoading, isError } = useUsersQuery();

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold">{t("users.title")}</h1>
        <p className="mt-1 text-muted-foreground">{t("users.subtitle")}</p>
      </div>

      {isLoading && <p className="text-muted-foreground">{t("users.loading")}</p>}

      {isError && <p className="text-destructive">{t("users.error")}</p>}

      {users?.length === 0 && <p className="text-muted-foreground">{t("users.empty")}</p>}

      {users && users.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {users.map((user) => (
            <UserCard key={user.id} user={user} />
          ))}
        </div>
      )}

      <UserForm />
    </div>
  );
}
