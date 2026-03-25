import { HttpResponse, http } from "msw";
import { describe, expect, it } from "vitest";
import { userService } from "@/api/services/user.service";
import { mockUsers } from "@/tests/msw/handlers/users";
import { server } from "@/tests/msw/server";

describe("userService.getAll", () => {
  it("returns a parsed list of users", async () => {
    const users = await userService.getAll();

    expect(users).toHaveLength(mockUsers.length);
    expect(users[0]).toEqual({ id: "1", name: "Alice Dupont", email: "alice@example.com" });
  });

  it("throws when the response is not a valid user array", async () => {
    server.use(
      http.get("http://localhost:3001/users", () => {
        return HttpResponse.json([{ id: "1", name: "A", email: "not-an-email" }]);
      }),
    );

    await expect(userService.getAll()).rejects.toThrow();
  });

  it("throws on network error", async () => {
    server.use(
      http.get("http://localhost:3001/users", () => {
        return HttpResponse.error();
      }),
    );

    await expect(userService.getAll()).rejects.toThrow();
  });
});

describe("userService.create", () => {
  it("creates a user and returns the parsed result", async () => {
    const newUser = await userService.create({ name: "Eve Moreau", email: "eve@example.com" });

    expect(newUser.name).toBe("Eve Moreau");
    expect(newUser.email).toBe("eve@example.com");
    expect(typeof newUser.id).toBe("string");
  });

  it("throws when the server returns an invalid user", async () => {
    server.use(
      http.post("http://localhost:3001/users", () => {
        return HttpResponse.json({ id: "x", name: "", email: "bad" }, { status: 201 });
      }),
    );

    await expect(
      userService.create({ name: "Eve Moreau", email: "eve@example.com" }),
    ).rejects.toThrow();
  });
});
