import { createFileRoute, Link } from "@tanstack/react-router";
import QRCode from "react-qr-code";
import { Nav, Footer } from "@/components/site";
import { useStore } from "@/lib/store";
import { getEvent, formatDate, formatPrice } from "@/lib/events";

export const Route = createFileRoute("/tickets")({
  head: () => ({
    meta: [
      { title: "My Tickets — EventConnect" },
      { name: "description", content: "Your booked events and QR entry passes." },
      { property: "og:title", content: "My Tickets — EventConnect" },
      { property: "og:description", content: "Your QR entry passes." },
    ],
  }),
  component: Tickets,
});

function Tickets() {
  const { user, bookings } = useStore();
  return (
    <div>
      <Nav />
      <main className="mx-auto max-w-5xl px-6 pt-32">
        <h1 className="font-display text-4xl font-extrabold md:text-5xl">My <span className="text-gradient">tickets</span></h1>
        {!user ? (
          <p className="mt-10 text-muted-foreground"><Link to="/login" className="text-accent">Sign in</Link> to see your tickets.</p>
        ) : bookings.length === 0 ? (
          <p className="mt-10 text-muted-foreground">No tickets yet. <Link to="/explore" className="text-accent">Find an event</Link></p>
        ) : (
          <div className="mt-10 space-y-6">
            {bookings.map((b) => {
              const e = getEvent(b.eventId);
              if (!e) return null;
              return (
                <div key={b.code} className="flex flex-col overflow-hidden rounded-3xl border border-border bg-card md:flex-row">
                  <img src={e.image} alt={e.title} loading="lazy" className="h-48 w-full object-cover md:h-auto md:w-56" />
                  <div className="flex-1 p-6">
                    <h2 className="font-display text-2xl font-bold">{e.title}</h2>
                    <p className="mt-1 text-muted-foreground">{formatDate(e.date)} · {e.time} · {e.venue}, {e.city}</p>
                    <p className="mt-4 text-sm">{b.qty} ticket{b.qty > 1 && "s"} · {formatPrice(b.total)}</p>
                    <p className="mt-1 font-mono text-sm text-accent">{b.code}</p>
                  </div>
                  <div className="flex items-center justify-center border-t border-dashed border-border bg-foreground p-6 md:border-l md:border-t-0">
                    <QRCode value={b.code} size={128} />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
