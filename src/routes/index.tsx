import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Search, Compass, Ticket, QrCode } from "lucide-react";
import { useState } from "react";
import hero from "@/assets/hero.jpg";
import { Nav, Footer, EventCard } from "@/components/site";
import { EVENTS, CATEGORIES } from "@/lib/events";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "EventConnect — Find Your Crowd. Feel the Moment." },
      { name: "description", content: "Discover parties, concerts and college fests, book tickets and get QR entry passes." },
      { property: "og:title", content: "EventConnect — Find Your Crowd" },
      { property: "og:description", content: "Discover events, book tickets, and meet your crowd." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Home,
});

function Home() {
  const [q, setQ] = useState("");
  const nav = useNavigate();
  return (
    <div>
      <Nav />
      <section className="relative flex min-h-[92vh] items-end overflow-hidden">
        <img src={hero} alt="Concert crowd under violet lights" width={1600} height={912} className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-background/10" />
        <div className="relative mx-auto w-full max-w-6xl px-6 pb-20">
          <motion.p initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mb-4 text-sm uppercase tracking-[0.3em] text-accent">Find Your Crowd. Feel the Moment.</motion.p>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="max-w-4xl font-display text-5xl font-extrabold leading-[0.95] md:text-7xl">
            Your Next <span className="text-gradient">Unforgettable</span> Moment Starts Here.
          </motion.h1>
          <p className="mt-6 max-w-xl text-lg text-muted-foreground">Discover events near you, book tickets in seconds, walk in with a QR pass — and meet the people who love what you love.</p>
          <form onSubmit={(e) => { e.preventDefault(); nav({ to: "/explore", search: { q } }); }} className="glass mt-8 flex max-w-xl items-center gap-2 rounded-full p-2">
            <Search className="ml-3 h-5 w-5 text-muted-foreground" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Event, city, venue or category" className="flex-1 bg-transparent py-2 outline-none placeholder:text-muted-foreground" />
            <button className="rounded-full bg-gradient-brand px-5 py-2.5 text-sm font-semibold text-primary-foreground">Explore Events</button>
          </form>
          <Link to="/explore" className="mt-4 inline-block text-sm text-muted-foreground underline-offset-4 hover:underline">or Host an Event →</Link>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pt-16">
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((c) => (
            <Link key={c} to="/explore" search={{ category: c }} className="rounded-full border border-border px-4 py-2 text-sm text-muted-foreground transition hover:border-primary hover:text-foreground">{c}</Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pt-16">
        <div className="mb-8 flex items-end justify-between">
          <h2 className="font-display text-3xl font-bold md:text-4xl">Trending now</h2>
          <Link to="/explore" className="text-sm text-accent">See all</Link>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[...EVENTS].sort((a, b) => b.booked - a.booked).slice(0, 3).map((e) => <EventCard key={e.id} e={e} />)}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pt-24">
        <h2 className="mb-10 font-display text-3xl font-bold md:text-4xl">How it works</h2>
        <div className="grid gap-6 md:grid-cols-3">
          {[
            { i: Compass, t: "Discover", d: "Browse by city, date, category and price." },
            { i: Ticket, t: "Book", d: "Reserve seats instantly with live availability." },
            { i: QrCode, t: "Walk in", d: "Show your unique QR pass at the door." },
          ].map(({ i: I, t, d }) => (
            <div key={t} className="rounded-3xl border border-border bg-card p-8">
              <I className="h-8 w-8 text-primary" />
              <h3 className="mt-6 font-display text-xl font-bold">{t}</h3>
              <p className="mt-2 text-muted-foreground">{d}</p>
            </div>
          ))}
        </div>
      </section>
      <Footer />
    </div>
  );
}
