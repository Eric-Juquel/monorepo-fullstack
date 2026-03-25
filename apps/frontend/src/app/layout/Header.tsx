import { Globe, Moon, Sun } from "lucide-react";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Link, NavLink } from "react-router-dom";
import { Button } from "@/shared/components/ui/button";
import { cn } from "@/shared/lib/utils";
import { useAppStore } from "@/shared/stores/app.store";
import type { Locale } from "@/shared/types/common";

export function Header() {
  const { t, i18n } = useTranslation();
  const theme = useAppStore((state) => state.theme);
  const toggleTheme = useAppStore((state) => state.toggleTheme);

  const handleLocaleToggle = () => {
    const next: Locale = i18n.language === "en" ? "fr" : "en";
    void i18n.changeLanguage(next);
    localStorage.setItem("app-locale", next);
  };

  const navLinks = useMemo(
    () => [
      { to: "/", label: t("nav.home"), end: true },
      { to: "/users", label: t("nav.users"), end: false },
    ],
    [t],
  );

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="container mx-auto flex h-14 items-center justify-between px-4">
        <nav className="flex items-center gap-6">
          <Link to="/" className="text-lg font-bold text-primary">
            React Starter
          </Link>
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) =>
                cn(
                  "text-sm font-medium transition-colors hover:text-primary",
                  isActive ? "text-foreground" : "text-muted-foreground",
                )
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleLocaleToggle}
            aria-label={t("locale.switch")}
          >
            <Globe className="h-4 w-4" />
            <span className="ml-1 text-xs">{t("locale.switch")}</span>
          </Button>

          <Button variant="ghost" size="icon" onClick={toggleTheme} aria-label={t("theme.toggle")}>
            {theme === "light" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
          </Button>
        </div>
      </div>
    </header>
  );
}
