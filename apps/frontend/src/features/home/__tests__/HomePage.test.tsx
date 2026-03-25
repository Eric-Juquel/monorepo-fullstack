import { describe, expect, it } from "vitest";
import HomePage from "@/features/home/pages/HomePage";
import { render, screen } from "@/tests/test-utils";

describe("HomePage", () => {
  it("renders the welcome title", () => {
    render(<HomePage />);

    expect(screen.getByText("Welcome to React 19 Starter Kit")).toBeInTheDocument();
  });

  it("renders the tech stack cards", () => {
    render(<HomePage />);

    expect(screen.getByText("React 19 with TypeScript")).toBeInTheDocument();
    expect(screen.getByText("Vite for blazing fast builds")).toBeInTheDocument();
  });
});
