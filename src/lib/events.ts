import hero from "@/assets/hero.jpg";
import rooftop from "@/assets/rooftop.jpg";
import festival from "@/assets/festival.jpg";
import tech from "@/assets/tech.jpg";

export type EventItem = {
  id: string;
  title: string;
  category: string;
  city: string;
  venue: string;
  date: string; // ISO date
  time: string;
  price: number; // INR, 0 = free
  capacity: number;
  booked: number;
  host: string;
  image: string;
  description: string;
};

export const CATEGORIES = [
  "House Parties", "Music", "Nightlife", "College Festivals", "Tech",
  "Workshops", "Networking", "Sports", "Art", "Food",
];

// Sample data. Mirrors the `events` table in the Java backend (schema.sql).
export const EVENTS: EventItem[] = [
  { id: "neon-nights", title: "Neon Nights Live", category: "Music", city: "Mumbai", venue: "NSCI Dome", date: "2026-11-07", time: "20:00", price: 1499, capacity: 800, booked: 612, host: "Pulse Collective", image: hero, description: "An immersive night of electronic and indie acts under a full-room light show." },
  { id: "skyline-sundowner", title: "Skyline Sundowner", category: "Nightlife", city: "Bengaluru", venue: "High Ultra Lounge", date: "2026-10-24", time: "18:30", price: 999, capacity: 150, booked: 141, host: "Rooftop Society", image: rooftop, description: "Golden-hour DJ sets, city views and good company on one of the highest rooftops in town." },
  { id: "oasis-fest", title: "Oasis College Fest 2026", category: "College Festivals", city: "Pune", venue: "COEP Grounds", date: "2026-12-12", time: "16:00", price: 299, capacity: 3000, booked: 1870, host: "COEP Cultural Council", image: festival, description: "Three stages, battle of bands, food street and a headline act to close the night." },
  { id: "build-connect", title: "Build & Connect Meetup", category: "Tech", city: "Hyderabad", venue: "T-Hub Loft", date: "2026-10-30", time: "19:00", price: 0, capacity: 200, booked: 88, host: "DevCircle", image: tech, description: "Lightning talks, demos and open networking for builders, students and founders." },
  { id: "house-warm", title: "Warehouse House Party", category: "House Parties", city: "Delhi", venue: "Okhla Studio 9", date: "2026-11-14", time: "21:00", price: 799, capacity: 250, booked: 250, host: "Basement Beats", image: hero, description: "Deep house till late in a converted warehouse. Strictly 18+." },
  { id: "startup-mixer", title: "Founders Networking Mixer", category: "Networking", city: "Bengaluru", venue: "WeWork Galaxy", date: "2026-11-02", time: "18:00", price: 199, capacity: 120, booked: 54, host: "DevCircle", image: tech, description: "Meet founders, investors and operators over drinks and quick intros." },
];

export const getEvent = (id: string) => EVENTS.find((e) => e.id === id);
export const formatPrice = (p: number) => (p === 0 ? "Free" : `₹${p.toLocaleString("en-IN")}`);
export const formatDate = (d: string) =>
  new Date(d + "T00:00:00").toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" });
