import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterAll, afterEach, beforeAll } from "vitest";
import { server } from "./msw/server";

// Uncomment to debug MSW intercepted requests
// server.events.on("request:start", ({ request }) => {
//   console.log("MSW intercepted:", request.method, request.url);
// });

beforeAll(() => server.listen({ onUnhandledRequest: "error" }));

afterEach(() => {
  cleanup();
  server.resetHandlers();
});

afterAll(() => server.close());
