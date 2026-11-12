import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Nav, Footer, EventCard } from "@/components/site";
import { EVENTS, CATEGORIES } from "@/lib/events";

type S = { q?: string; category?: string };

export const Route = createFileRoute("/explore")({
  validateSearch: (s: Record<string, unknown>): S => {
    const q = s["q"];
    const category = s["category"];
    return {
      ...(typeof q === "string" ? { q } : {}),
      ...(typeof category === "string" ? { category } : {}),
    };
  },
  head: () => ({
    meta: [
      { title: "Explore Events — EventConnect" },
      { name: "description", content: "Search and filter parties, concerts, fests and meetups." },
      { property: "og:title", content: "Explore Events — EventConnect" },
      { property: "og:description", content: "Search and filter events near you." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Explore,
});

function Explore() {
  const s = Route.useSearch();
  const [q, setQ] = useState(s.q ?? "");
  const [cat, setCat] = useState(s.category ?? "");
  const [maxPrice, setMaxPrice] = useState(5000);
  const [sort, setSort] = useState<"date" | "popular" | "price">("date");

  const list = useMemo(() => {
    const t = q.toLowerCase();
    return EVENTS.filter((e) =>
      (!t || [e.title, e.city, e.venue, e.category].some((f) => f.toLowerCase().includes(t))) &&
      (!cat || e.category === cat) && e.price <= maxPrice,
    ).sort((a, b) => sort === "date" ? a.date.localeCompare(b.date) : sort === "price" ? a.price - b.price : b.booked - a.booked);
  }, [q, cat, maxPrice, sort]);

  const field = "rounded-full border border-input bg-card px-4 py-2.5 text-sm outline-none focus:border-primary";
  return (
    <div>
      <Nav />
      <main className="mx-auto max-w-6xl px-6 pt-32">
        <h1 className="font-display text-4xl font-extrabold md:text-5xl">Explore <span className="text-gradient">events</span></h1>
        <div className="mt-8 flex flex-wrap gap-3">
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search name, city, venue…" className={`${field} min-w-60 flex-1`} />
          <select value={cat} onChange={(e) => setCat(e.target.value)} className={field}>
            <option value="">All categories</option>
            {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
          </select>
          <select value={sort} onChange={(e) => setSort(e.target.value as typeof sort)} className={field}>
            <option value="date">Soonest</option><option value="popular">Most popular</option><option value="price">Lowest price</option>
          </select>
          <label className={`${field} flex items-center gap-3`}>Max ₹{maxPrice}
            <input type="range" min={0} max={5000} step={100} value={maxPrice} onChange={(e) => setMaxPrice(+e.target.value)} className="accent-primary" />
          </label>
        </div>
        <p className="mt-6 text-sm text-muted-foreground">{list.length} events</p>
        <div className="mt-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((e) => <EventCard key={e.id} e={e} />)}
        </div>
        {list.length === 0 && <p className="py-20 text-center text-muted-foreground">No events match your filters.</p>}
      </main>
      <Footer />
    </div>
  );
}
