import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Providers } from "@/app/providers";
import "@/i18n/config";
import "@/styles/index.css";

const rootElement = document.getElementById("root");
if (!rootElement) throw new Error("Root element not found");

createRoot(rootElement).render(
  <StrictMode>
    <Providers />
  </StrictMode>,
);
