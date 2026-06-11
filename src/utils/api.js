const BASE = "http://localhost:5000/api";

export const api = {
  get: async (path) => await fetch(`${BASE}${path}`).then((r) => r.json()),
  post: async (path, body) =>
    await fetch(`${BASE}${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }).then((r) => r.json()),
  put: async (path, body) =>
    await fetch(`${BASE}${path}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }).then((r) => r.json()),
};
