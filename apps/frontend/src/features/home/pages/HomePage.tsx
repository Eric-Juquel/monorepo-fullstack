import { useTranslation } from "react-i18next";
import { Card, CardContent } from "@/shared/components/ui/card";

export default function HomePage() {
  const { t } = useTranslation();

  const features = [
    "react",
    "vite",
    "tailwind",
    "tanstack",
    "zustand",
    "form",
    "router",
    "testing",
    "biome",
  ] as const;

  return (
    <div className="flex flex-col items-center gap-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold tracking-tight">{t("home.title")}</h1>
        <p className="mt-2 text-lg text-muted-foreground">{t("home.subtitle")}</p>
      </div>

      <div className="w-full max-w-3xl">
        <h2 className="mb-4 text-2xl font-semibold">{t("home.features.title")}</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <Card key={feature}>
              <CardContent className="p-4">
                <p className="text-sm font-medium">{t(`home.features.${feature}`)}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
