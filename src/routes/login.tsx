import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Nav } from "@/components/site";
import { login } from "@/lib/store";

export const Route = createFileRoute("/login")({
  validateSearch: (s: Record<string, unknown>): { redirect: string } => {
    const redirect = s["redirect"];
    return { redirect: typeof redirect === "string" ? redirect : "" };
  },
  head: () => ({
    meta: [
      { title: "Sign in — EventConnect" },
      { name: "description", content: "Sign in to book tickets and see your QR passes." },
      { property: "og:title", content: "Sign in — EventConnect" },
      { property: "og:description", content: "Sign in to EventConnect." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Login,
});

function Login() {
  const { redirect } = Route.useSearch();
  const nav = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [err, setErr] = useState("");
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^\S+@\S+\.\S+$/.test(email)) return setErr("Enter a valid email");
    if (pw.length < 6) return setErr("Password must be at least 6 characters");
    login({ name: name || email.split("@")[0] || "Guest", email });
    nav({ to: redirect || "/explore" });
  };
  const field = "w-full rounded-2xl border border-input bg-card px-4 py-3 outline-none focus:border-primary";
  return (
    <div className="flex min-h-screen items-center justify-center px-6">
      <Nav />
      <form onSubmit={submit} className="glass w-full max-w-md space-y-4 rounded-3xl p-8 shadow-glow">
        <h1 className="font-display text-3xl font-bold">Welcome to <span className="text-gradient">EventConnect</span></h1>
        <p className="text-sm text-muted-foreground">Demo sign-in. With the Java backend running this calls Spring Security.</p>
        <input className={field} placeholder="Your name" value={name} onChange={(e) => setName(e.target.value)} />
        <input className={field} placeholder="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input className={field} placeholder="Password" type="password" value={pw} onChange={(e) => setPw(e.target.value)} />
        {err && <p className="text-sm text-coral">{err}</p>}
        <button className="w-full rounded-full bg-gradient-brand py-3.5 font-semibold text-primary-foreground">Continue</button>
      </form>
    </div>
  );
}
