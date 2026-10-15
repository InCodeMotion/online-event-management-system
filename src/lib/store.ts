import { useEffect, useState } from "react";
import { getEvent } from "./events";

// Local demo store. In the full project these calls go to the Java Spring Boot REST API
// (POST /api/auth/login, POST /api/bookings, GET /api/bookings/me).
export type User = { name: string; email: string };
export type Booking = { code: string; eventId: string; qty: number; total: number; createdAt: string };

const USER_KEY = "ec_user";
const BOOK_KEY = "ec_bookings";
const EVT = "ec-store";

function read<T>(k: string, fallback: T): T {
  try { return JSON.parse(localStorage.getItem(k) ?? "") as T; } catch { return fallback; }
}
function write(k: string, v: unknown) {
  localStorage.setItem(k, JSON.stringify(v));
  window.dispatchEvent(new Event(EVT));
}

export function useStore() {
  const [user, setUser] = useState<User | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  useEffect(() => {
    const sync = () => { setUser(read(USER_KEY, null)); setBookings(read(BOOK_KEY, [])); };
    sync();
    window.addEventListener(EVT, sync);
    return () => window.removeEventListener(EVT, sync);
  }, []);
  return { user, bookings };
}

export const login = (u: User) => write(USER_KEY, u);
export const logout = () => write(USER_KEY, null);

export function bookTickets(eventId: string, qty: number): Booking {
  const ev = getEvent(eventId);
  if (!ev) throw new Error("Event not found");
  const list = read<Booking[]>(BOOK_KEY, []);
  const already = list.filter((b) => b.eventId === eventId).reduce((s, b) => s + b.qty, 0);
  if (qty < 1 || qty > 10) throw new Error("You can book 1–10 tickets");
  if (ev.booked + already + qty > ev.capacity) throw new Error("Not enough seats left");
  const b: Booking = {
    code: "EC-" + crypto.randomUUID().slice(0, 8).toUpperCase(),
    eventId, qty, total: ev.price * qty, createdAt: new Date().toISOString(),
  };
  write(BOOK_KEY, [b, ...list]);
  return b;
}
