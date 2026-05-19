import { apiFetch } from "./http";

export type User = {
  _id: string;
  email: string;
  username?: string;
};

export function register(params: {
  email: string;
  username: string;
  password: string;
}) {
  return apiFetch<User>("/users/register", {
    method: "POST",
    body: JSON.stringify(params),
  });
}

export function login(params: { email: string; password: string }) {
  return apiFetch<User>("/users/login", {
    method: "POST",
    body: JSON.stringify(params),
  });
}

