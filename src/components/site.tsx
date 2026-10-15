import { Link } from "@tanstack/react-router";
import { Ticket, Compass, LogIn, LogOut, CalendarDays, MapPin, Users } from "lucide-react";
import { useStore, logout } from "@/lib/store";
import { type EventItem, formatDate, formatPrice } from "@/lib/events";

export function Nav() {
  const { user } = useStore();
  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div className="glass mx-auto mt-4 flex max-w-6xl items-center justify-between rounded-full px-5 py-3">
        <Link to="/" className="font-display text-lg font-bold">Event<span className="text-gradient">Connect</span></Link>
        <nav className="flex items-center gap-1 text-sm">
          <Link to="/explore" className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-muted-foreground hover:text-foreground" activeProps={{ className: "text-foreground" }}><Compass className="h-4 w-4" /><span className="hidden sm:inline">Explore</span></Link>
          <Link to="/tickets" className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-muted-foreground hover:text-foreground" activeProps={{ className: "text-foreground" }}><Ticket className="h-4 w-4" /><span className="hidden sm:inline">My Tickets</span></Link>
          {user ? (
            <button onClick={logout} className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-muted-foreground hover:text-foreground"><LogOut className="h-4 w-4" /><span className="hidden sm:inline">{user.name.split(" ")[0]}</span></button>
          ) : (
            <Link to="/login" className="flex items-center gap-1.5 rounded-full bg-gradient-brand px-4 py-1.5 font-semibold text-primary-foreground"><LogIn className="h-4 w-4" />Sign in</Link>
          )}
        </nav>
      </div>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="mt-24 border-t border-border">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-6 py-10 text-sm text-muted-foreground md:flex-row md:justify-between">
        <div>
          <p className="font-display text-base font-bold text-foreground">EventConnect</p>
          <p>Find Your Crowd. Feel the Moment.</p>
        </div>
        <div className="flex flex-wrap gap-5">
          {["About", "Contact", "Help", "Privacy", "Terms", "Community Guidelines"].map((l) => <span key={l}>{l}</span>)}
        </div>
      </div>
    </footer>
  );
}

export function EventCard({ e }: { e: EventItem }) {
  const left = e.capacity - e.booked;
  return (
    <Link to="/events/$id" params={{ id: e.id }} className="group block overflow-hidden rounded-3xl border border-border bg-card transition hover:-translate-y-1 hover:shadow-glow">
      <div className="relative aspect-[4/3] overflow-hidden">
        <img src={e.image} alt={e.title} loading="lazy" width={1024} height={768} className="h-full w-full object-cover transition duration-700 group-hover:scale-105" />
        <span className="glass absolute left-3 top-3 rounded-full px-3 py-1 text-xs">{e.category}</span>
        <span className="absolute right-3 top-3 rounded-full bg-background/80 px-3 py-1 text-xs font-semibold">{formatPrice(e.price)}</span>
      </div>
      <div className="space-y-2 p-5">
        <h3 className="font-display text-lg font-bold leading-tight">{e.title}</h3>
        <p className="flex items-center gap-2 text-sm text-muted-foreground"><CalendarDays className="h-4 w-4" />{formatDate(e.date)} · {e.time}</p>
        <p className="flex items-center gap-2 text-sm text-muted-foreground"><MapPin className="h-4 w-4" />{e.venue}, {e.city}</p>
        <div className="flex items-center justify-between pt-1 text-xs">
          <span className="flex items-center gap-1.5 text-muted-foreground"><Users className="h-3.5 w-3.5" />{e.booked} going · by {e.host}</span>
          <span className={left === 0 ? "text-coral" : "text-accent"}>{left === 0 ? "Sold out" : `${left} left`}</span>
        </div>
      </div>
    </Link>
  );
}
