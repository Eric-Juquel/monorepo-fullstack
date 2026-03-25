import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { z } from "zod";
import { useCreateUserMutation } from "@/api/queries/user.query";
import { createUserSchema } from "@/features/users/schemas/user.schema";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";

type FormErrors = {
  name?: string[];
  email?: string[];
};

// useFormStatus must live inside the <form> element — separate component required
function SubmitButton() {
  const { pending } = useFormStatus();
  const { t } = useTranslation();
  return (
    <Button type="submit" disabled={pending}>
      {t("users.form.submit")}
    </Button>
  );
}

export function UserForm() {
  const { t } = useTranslation();
  const createUser = useCreateUserMutation();

  // useActionState: wraps async logic + tracks pending state natively
  // React 19 resets uncontrolled form inputs after the action completes
  const [errors, formAction] = useActionState(
    async (_prev: FormErrors, formData: FormData): Promise<FormErrors> => {
      const result = createUserSchema.safeParse({
        name: formData.get("name"),
        email: formData.get("email"),
      });

      if (!result.success) {
        return z.flattenError(result.error).fieldErrors;
      }

      try {
        await createUser.mutateAsync(result.data);
        toast.success(t("users.form.success"));
        return {};
      } catch {
        toast.error(t("users.error"));
        return {};
      }
    },
    {},
  );

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>{t("users.form.addTitle")}</CardTitle>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="create-name">{t("users.form.name")}</Label>
            <Input id="create-name" name="name" placeholder={t("users.form.namePlaceholder")} />
            {errors.name && <p className="text-sm text-destructive">{t("users.form.nameMin")}</p>}
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="create-email">{t("users.form.email")}</Label>
            <Input
              id="create-email"
              name="email"
              type="email"
              placeholder={t("users.form.emailPlaceholder")}
            />
            {errors.email && (
              <p className="text-sm text-destructive">{t("users.form.emailInvalid")}</p>
            )}
          </div>

          <SubmitButton />
        </form>
      </CardContent>
    </Card>
  );
}
