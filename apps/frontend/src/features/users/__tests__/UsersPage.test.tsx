import { describe, expect, it } from "vitest";
import UsersPage from "@/features/users/pages/UsersPage";
import { render, screen, waitFor } from "@/tests/test-utils";

describe("UsersPage", () => {
  it("renders the title", () => {
    render(<UsersPage />);

    expect(screen.getByText("Users")).toBeInTheDocument();
  });

  it("displays users fetched from the API", async () => {
    render(<UsersPage />);

    await waitFor(() => {
      expect(screen.getByText("Alice Dupont")).toBeInTheDocument();
    });

    expect(screen.getByText("Bob Martin")).toBeInTheDocument();
  });
});
