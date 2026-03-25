import { HttpResponse, http } from "msw";
import { act } from "react";
import { describe, expect, it } from "vitest";
import { useCreateUserMutation, useUsersQuery } from "@/api/queries/user.query";
import { server } from "@/tests/msw/server";
import { render, screen, waitFor } from "@/tests/test-utils";

function UsersQueryHarness() {
  const { data, isLoading, isError } = useUsersQuery();

  if (isLoading) return <p>loading</p>;
  if (isError) return <p>error</p>;
  return (
    <ul>
      {data?.map((u) => (
        <li key={u.id}>{u.name}</li>
      ))}
    </ul>
  );
}

function CreateUserHarness() {
  const mutation = useCreateUserMutation();

  return (
    <div>
      <button
        type="button"
        onClick={() => mutation.mutate({ name: "New User", email: "new@example.com" })}
      >
        create
      </button>
      {mutation.isSuccess && <p>success</p>}
      {mutation.isError && <p>mutation error</p>}
    </div>
  );
}

describe("useUsersQuery", () => {
  it("fetches and displays users", async () => {
    render(<UsersQueryHarness />);

    expect(screen.getByText("loading")).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText("Alice Dupont")).toBeInTheDocument();
    });

    expect(screen.getByText("Bob Martin")).toBeInTheDocument();
  });

  it("shows error state when the request fails", async () => {
    server.use(http.get("http://localhost:3001/users", () => HttpResponse.error()));

    render(<UsersQueryHarness />);

    await waitFor(() => {
      expect(screen.getByText("error")).toBeInTheDocument();
    });
  });
});

describe("useCreateUserMutation", () => {
  it("shows success after a valid mutation", async () => {
    render(<CreateUserHarness />);

    act(() => {
      screen.getByRole("button", { name: "create" }).click();
    });

    await waitFor(() => {
      expect(screen.getByText("success")).toBeInTheDocument();
    });
  });
});
