import { createFileRoute, Link, notFound, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { CalendarDays, MapPin, Users, Minus, Plus, Share2 } from "lucide-react";
import { Nav, Footer } from "@/components/site";
import { getEvent, formatDate, formatPrice } from "@/lib/events";
import { useStore, bookTickets } from "@/lib/store";

export const Route = createFileRoute("/events/$id")({
  loader: ({ params }) => {
    const e = getEvent(params.id);
    if (!e) throw notFound();
    return e;
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: `${loaderData?.title ?? "Event"} — EventConnect` },
      { name: "description", content: loaderData?.description ?? "" },
      { property: "og:title", content: loaderData?.title ?? "Event" },
      { property: "og:description", content: loaderData?.description ?? "" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  notFoundComponent: () => <div className="p-20 text-center">Event not found. <Link to="/explore" className="text-accent">Back to explore</Link></div>,
  component: EventPage,
});

function EventPage() {
  const e = Route.useLoaderData();
  const { user, bookings } = useStore();
  const nav = useNavigate();
  const [qty, setQty] = useState(1);
  const [err, setErr] = useState("");
  const mine = bookings.filter((b) => b.eventId === e.id).reduce((s, b) => s + b.qty, 0);
  const left = e.capacity - e.booked - mine;

  const book = () => {
    if (!user) {
      nav({ to: "/login", search: { redirect: `/events/${e.id}` } });
      return;
    }
    try { bookTickets(e.id, qty); nav({ to: "/tickets" }); } catch (x) { setErr((x as Error).message); }
  };
  const share = async () => {
    const url = window.location.href;
    if (navigator.share) await navigator.share({ title: e.title, url }).catch(() => {});
    else { await navigator.clipboard.writeText(url); setErr("Link copied!"); }
  };

  return (
    <div>
      <Nav />
      <div className="relative h-[55vh] overflow-hidden">
        <img src={e.image} alt={e.title} className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
      </div>
      <main className="relative mx-auto -mt-40 grid max-w-6xl gap-10 px-6 lg:grid-cols-[1fr_380px]">
        <div>
          <span className="glass rounded-full px-3 py-1 text-xs">{e.category}</span>
          <h1 className="mt-4 font-display text-4xl font-extrabold md:text-6xl">{e.title}</h1>
          <p className="mt-2 text-muted-foreground">Hosted by {e.host}</p>
          <div className="mt-8 space-y-3 text-muted-foreground">
            <p className="flex items-center gap-3"><CalendarDays className="h-5 w-5 text-primary" />{formatDate(e.date)} at {e.time}</p>
            <p className="flex items-center gap-3"><MapPin className="h-5 w-5 text-primary" />{e.venue}, {e.city}</p>
            <p className="flex items-center gap-3"><Users className="h-5 w-5 text-primary" />{e.booked + mine} attending</p>
          </div>
          <p className="mt-8 max-w-2xl text-lg leading-relaxed">{e.description}</p>
        </div>
        <aside className="glass h-fit rounded-3xl p-6 shadow-glow">
          <p className="text-sm text-muted-foreground">Price per ticket</p>
          <p className="font-display text-4xl font-bold">{formatPrice(e.price)}</p>
          <p className={`mt-1 text-sm ${left <= 0 ? "text-coral" : "text-accent"}`}>{left <= 0 ? "Sold out" : `${left} seats left`}</p>
          {left > 0 && (
            <>
              <div className="mt-6 flex items-center justify-between rounded-full border border-border p-1">
                <button aria-label="Fewer" onClick={() => setQty(Math.max(1, qty - 1))} className="rounded-full p-2 hover:bg-secondary"><Minus className="h-4 w-4" /></button>
                <span className="font-semibold">{qty} ticket{qty > 1 && "s"}</span>
                <button aria-label="More" onClick={() => setQty(Math.min(10, left, qty + 1))} className="rounded-full p-2 hover:bg-secondary"><Plus className="h-4 w-4" /></button>
              </div>
              <button onClick={book} className="mt-4 w-full rounded-full bg-gradient-brand py-3.5 font-semibold text-primary-foreground">
                {user ? `Book · ${formatPrice(e.price * qty)}` : "Sign in to book"}
              </button>
            </>
          )}
          <button onClick={share} className="mt-3 flex w-full items-center justify-center gap-2 rounded-full border border-border py-3 text-sm"><Share2 className="h-4 w-4" />Share</button>
          {err && <p className="mt-3 text-center text-sm text-coral">{err}</p>}
        </aside>
      </main>
      <Footer />
    </div>
  );
}
