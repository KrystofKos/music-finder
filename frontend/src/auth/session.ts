import type { User } from "../api/auth";

const KEY = "mf_user";
const EVENT = "mf_user_changed";

function notify() {
  window.dispatchEvent(new Event(EVENT));
}

export function saveUser(user: User) {
  localStorage.setItem(KEY, JSON.stringify(user));
  notify();
}

export function getUser(): User | null {
  const raw = localStorage.getItem(KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as User;
  } catch {
    return null;
  }
}

export function clearUser() {
  localStorage.removeItem(KEY);
  notify();
}

export function onUserChange(cb: () => void) {
  const handler = () => cb();
  window.addEventListener(EVENT, handler);
  return () => window.removeEventListener(EVENT, handler);
}
