import { HttpResponse, http } from "msw";

const API_URL = "http://localhost:3001";

export const mockUsers = [
  { id: "1", name: "Alice Dupont", email: "alice@example.com" },
  { id: "2", name: "Bob Martin", email: "bob@example.com" },
];

export const usersHandlers = [
  http.get(`${API_URL}/users`, () => {
    return HttpResponse.json(mockUsers);
  }),

  http.post(`${API_URL}/users`, async ({ request }) => {
    const body = (await request.json()) as Record<string, unknown>;
    return HttpResponse.json({ id: "abc123", ...body }, { status: 201 });
  }),

  http.put(`${API_URL}/users/:id`, async ({ params, request }) => {
    const body = (await request.json()) as Record<string, unknown>;
    return HttpResponse.json({ id: params.id, ...body });
  }),

  http.delete(`${API_URL}/users/:id`, () => {
    return new HttpResponse(null, { status: 204 });
  }),
];
