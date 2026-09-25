import { createFileRoute } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { ArrowRight, Check, ChevronDown, CircleCheck, Clipboard, Clock3, LogOut, MapPin, Package, PackageCheck, Plus, Search, ShieldCheck, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  head: () => ({ meta: [
    { title: "Track your parcel | KAI" },
    { name: "description", content: "Follow every step of your KAI parcel's journey, from booking to collection." },
    { property: "og:title", content: "Track your parcel | KAI" },
    { property: "og:description", content: "Follow every step of your KAI parcel's journey, from booking to collection." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: Index,
});

type Status = 0 | 1 | 2;
type Parcel = {
  id: string; sender: string; receiver: string; origin: string; destination: string;
  weight: string; amount: string; status: Status; created: string;
};

const starterParcel: Parcel = {
  id: "KAI-687880639", sender: "Vincents Odhiambo", receiver: "Jacinter Aoko",
  origin: "Nairobi", destination: "Busia", weight: "4.5", amount: "740", status: 2,
  created: "24 Sep 2026 · 2:20 PM",
};

const stages = [
  { title: "Booked & registered", detail: "Parcel received at origin office", icon: Package },
  { title: "On the way", detail: "Your parcel is in transit", icon: Truck },
  { title: "Ready for collection", detail: "Parcel arrived at destination office", icon: PackageCheck },
];

function RouteMap({ parcel }: { parcel: Parcel }) {
  const progress = parcel.status === 0 ? 8 : parcel.status === 1 ? 55 : 100;
  return (
    <div className="map-grid relative h-[260px] overflow-hidden rounded-t-lg md:h-[340px]">
      <div className="absolute left-5 top-5 z-10 flex items-center gap-2 rounded bg-foreground/90 px-3 py-2 text-xs font-semibold text-primary-foreground shadow-sm md:left-7 md:top-7">
        <span className="relative flex size-2"><span className="absolute inline-flex size-full animate-ping rounded-full bg-signal opacity-50"/><span className="relative inline-flex size-2 rounded-full bg-signal"/></span>
        LIVE ROUTE <span className="ml-1 font-mono text-signal">{parcel.id}</span>
      </div>
      <div className="absolute right-5 top-5 z-10 hidden rounded border border-primary-foreground/15 bg-foreground/80 px-3 py-2 text-[10px] font-bold uppercase tracking-widest text-primary-foreground/80 md:block">Kenya network · route view</div>
      <svg viewBox="0 0 800 340" preserveAspectRatio="xMidYMid meet" className="absolute inset-0 size-full" role="img" aria-label={`Route from ${parcel.origin} to ${parcel.destination}`}>
        <path d="M-30 260 C110 238 170 275 290 215 S475 120 610 175 S770 205 830 155" fill="none" stroke="var(--ink-line)" strokeWidth="2" opacity=".8"/>
        <path d="M-20 60 C140 100 220 68 335 108 S500 255 820 300" fill="none" stroke="var(--ink-line)" strokeWidth="1.5" opacity=".55"/>
        <path d="M95 300 C180 205 210 160 320 158 S505 96 770 55" fill="none" stroke="var(--ink-line)" strokeWidth="1.5" opacity=".5"/>
        <path d="M170 235 C250 212 295 110 392 140 S530 216 650 128" fill="none" stroke="var(--primary)" strokeWidth="3" strokeLinecap="round" className="map-route"/>
        <circle cx="170" cy="235" r="17" fill="var(--primary)" opacity=".18"/><circle cx="170" cy="235" r="6" fill="var(--primary)" stroke="var(--primary-foreground)" strokeWidth="2"/>
        <circle cx="650" cy="128" r="20" fill="var(--signal)" opacity=".15"/><circle cx="650" cy="128" r="7" fill="var(--signal)" stroke="var(--ink)" strokeWidth="2"/>
        <circle cx="392" cy="140" r="3" fill="var(--muted-foreground)"/><circle cx="505" cy="189" r="3" fill="var(--muted-foreground)"/>
        <text x="392" y="127" fill="var(--primary-foreground)" opacity=".5" textAnchor="middle" fontSize="11" fontFamily="DM Sans">NAKURU</text>
        <text x="505" y="211" fill="var(--primary-foreground)" opacity=".5" textAnchor="middle" fontSize="11" fontFamily="DM Sans">KISUMU</text>
        <text x="170" y="270" fill="var(--primary-foreground)" textAnchor="middle" fontSize="13" fontWeight="700" fontFamily="Manrope">{parcel.origin.toUpperCase()}</text>
        <text x="650" y="98" fill="var(--signal)" textAnchor="middle" fontSize="13" fontWeight="800" fontFamily="Manrope">{parcel.destination.toUpperCase()}</text>
      </svg>
      <div className="absolute bottom-4 left-5 right-5 flex items-end justify-between gap-3 md:bottom-6 md:left-7 md:right-7">
        <div className="rounded border border-primary-foreground/10 bg-foreground/75 px-3 py-2 text-xs text-primary-foreground/70 backdrop-blur-sm">{parcel.status === 2 ? "Arrived at destination" : parcel.status === 1 ? "Moving towards destination" : "Preparing for dispatch"}</div>
        <div className="font-display text-3xl font-extrabold text-primary-foreground md:text-4xl">{progress}<span className="text-lg text-signal">%</span></div>
      </div>
    </div>
  );
}

function StatusPill({ status }: { status: Status }) {
  return <span className={`inline-flex items-center gap-1.5 rounded px-2.5 py-1 text-xs font-bold ${status === 2 ? "bg-success/10 text-success" : status === 1 ? "bg-primary/10 text-primary" : "bg-signal/30 text-foreground"}`}><span className={`size-1.5 rounded-full ${status === 2 ? "bg-success" : status === 1 ? "bg-primary" : "bg-signal"}`}/>{status === 2 ? "Ready for collection" : status === 1 ? "In transit" : "Booked"}</span>;
}

function Index() {
  const [parcels, setParcels] = useState<Parcel[]>([starterParcel]);
  const [activeId, setActiveId] = useState(starterParcel.id);
  const [query, setQuery] = useState("");
  const [searchError, setSearchError] = useState("");
  const [view, setView] = useState<"customer" | "agent">("customer");
  const [signedIn, setSignedIn] = useState(false);
  const [stationId, setStationId] = useState("");
  const [pin, setPin] = useState("");
  const [agentMessage, setAgentMessage] = useState("");
  const [copied, setCopied] = useState(false);
  const [form, setForm] = useState({ sender: "", receiver: "", origin: "Nairobi", destination: "Busia", weight: "", amount: "" });
  const active = parcels.find((p) => p.id === activeId) ?? starterParcel;

  function track(e: FormEvent) {
    e.preventDefault();
    const found = parcels.find((p) => p.id.toLowerCase() === query.trim().toLowerCase());
    if (found) { setActiveId(found.id); setSearchError(""); setQuery(""); }
    else setSearchError("We couldn't find that tracking number in this demo. Check the number and try again.");
  }

  function createParcel(e: FormEvent) {
    e.preventDefault();
    if (form.origin === form.destination) { setAgentMessage("Choose a different destination office."); return; }
    const parcel: Parcel = { ...form, id: `KAI-${Math.floor(100000000 + Math.random() * 900000000)}`, status: 0, created: new Intl.DateTimeFormat("en-KE", { dateStyle: "medium", timeStyle: "short" }).format(new Date()) };
    setParcels((prev) => [parcel, ...prev]);
    setActiveId(parcel.id);
    setAgentMessage(`${parcel.id} booked. You can find it in the parcel list below.`);
    setForm({ sender: "", receiver: "", origin: "Nairobi", destination: "Busia", weight: "", amount: "" });
  }

  function updateStatus(id: string, status: Status) {
    setParcels((prev) => prev.map((p) => p.id === id ? { ...p, status } : p));
    setAgentMessage(`Status updated for ${id}.`);
  }

  async function copyId() {
    try { await navigator.clipboard.writeText(active.id); setCopied(true); window.setTimeout(() => setCopied(false), 2000); } catch { setCopied(false); }
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-surface">
        <div className="mx-auto flex h-[76px] max-w-[1280px] items-center justify-between px-5 md:px-10">
          <div className="flex items-center gap-3"><span className="flex size-10 items-center justify-center rounded bg-foreground text-signal"><Package className="size-5" strokeWidth={2.3}/></span><span className="font-display text-[25px] font-extrabold leading-none text-foreground">KAI<span className="text-primary">.</span></span><span className="ml-2 hidden border-l border-border pl-5 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground sm:block">Parcel network</span></div>
          <div className="flex items-center gap-3"><span className="hidden items-center gap-2 text-xs font-semibold text-muted-foreground sm:flex"><span className="size-1.5 rounded-full bg-success"/> System operational</span><span className="hidden h-5 w-px bg-border sm:block"/><span className="rounded border border-border bg-muted px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Interactive demo</span></div>
        </div>
      </header>

      <main className="mx-auto max-w-[1280px] px-5 pb-20 pt-9 md:px-10 md:pt-12">
        <div className="mb-8 flex flex-col justify-between gap-5 md:mb-10 md:flex-row md:items-end">
          <div><p className="mb-3 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-primary"><span className="h-px w-5 bg-primary"/> KAI PARCEL SERVICE</p><h1 className="font-display text-3xl font-extrabold text-foreground md:text-[42px]">Your parcel, in full view.</h1><p className="mt-2 text-sm text-muted-foreground md:text-base">From the first handoff to the final hello.</p></div>
          <div className="flex w-full rounded border border-border bg-surface p-1 md:w-auto" role="tablist" aria-label="Portal view">
            <Button role="tab" aria-selected={view === "customer"} variant={view === "customer" ? "default" : "ghost"} className="h-10 flex-1 rounded text-xs font-bold md:flex-none md:px-5" onClick={() => setView("customer")}>Customer tracking</Button>
            <Button role="tab" aria-selected={view === "agent"} variant={view === "agent" ? "default" : "ghost"} className="h-10 flex-1 rounded text-xs font-bold md:flex-none md:px-5" onClick={() => setView("agent")}>Agent desk</Button>
          </div>
        </div>

        {view === "customer" ? <>
          <form onSubmit={track} className="mb-6 flex flex-col gap-3 rounded-lg border border-border bg-surface p-3 shadow-sm sm:flex-row sm:items-center sm:p-2.5">
            <div className="flex min-w-0 flex-1 items-center gap-3 px-2 sm:px-3"><Search className="size-5 shrink-0 text-muted-foreground"/><input aria-label="Tracking number" value={query} onChange={(e) => { setQuery(e.target.value); setSearchError(""); }} placeholder="Enter your KAI tracking number" className="h-11 w-full min-w-0 bg-transparent text-sm font-medium text-foreground outline-none placeholder:text-muted-foreground"/></div>
            <Button type="submit" className="h-11 rounded px-7 font-bold">Track parcel <ArrowRight/></Button>
          </form>
          {searchError && <p role="alert" className="-mt-3 mb-5 text-sm text-destructive">{searchError}</p>}
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1.65fr)_minmax(310px,1fr)]">
            <div className="min-w-0">
              <section className="overflow-hidden rounded-lg border border-border bg-surface shadow-sm" aria-label="Parcel route">
                <RouteMap parcel={active}/>
                <div className="grid grid-cols-2 gap-4 border-b border-border px-5 py-6 md:grid-cols-3 md:px-7">
                  <div><p className="mb-1 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">From</p><p className="flex items-center gap-1.5 font-display text-sm font-extrabold md:text-base"><MapPin className="size-4 text-primary"/>{active.origin}</p></div>
                  <div><p className="mb-1 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">To</p><p className="flex items-center gap-1.5 font-display text-sm font-extrabold md:text-base"><MapPin className="size-4 text-signal"/>{active.destination}</p></div>
                  <div className="col-span-2 border-t border-border pt-4 md:col-span-1 md:border-l md:border-t-0 md:pl-6 md:pt-0"><p className="mb-1 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Current status</p><StatusPill status={active.status}/></div>
                </div>
                <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-4 md:px-7"><div className="flex items-center gap-2 text-xs text-muted-foreground"><ShieldCheck className="size-4 text-primary"/> Tracking ID <strong className="font-mono text-foreground">{active.id}</strong></div><Button variant="ghost" size="sm" onClick={copyId} title="Copy tracking number" className="text-xs text-primary">{copied ? <Check/> : <Clipboard/>}{copied ? "Copied" : "Copy ID"}</Button></div>
              </section>
              <section className="mt-7" aria-label="Tracking timeline"><div className="mb-5 flex items-center justify-between"><h2 className="font-display text-xl font-extrabold">Journey updates</h2><span className="text-xs font-medium text-muted-foreground">{active.created}</span></div><div className="relative border-l border-border pl-6">
                {stages.map((stage, index) => { const Icon = stage.icon; const complete = index <= active.status; return <div key={stage.title} className="relative pb-7 last:pb-0"><span className={`absolute -left-[33px] top-0.5 flex size-[18px] items-center justify-center rounded-full border-2 border-background ${complete ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>{complete && <Check className="size-2.5" strokeWidth={3}/>}</span><div className="flex items-start gap-3"><span className={`mt-0.5 flex size-9 shrink-0 items-center justify-center rounded ${complete ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}><Icon className="size-4"/></span><div><h3 className={`text-sm font-bold ${complete ? "text-foreground" : "text-muted-foreground"}`}>{stage.title}</h3><p className="mt-0.5 text-xs text-muted-foreground">{index === 0 ? `Received in ${active.origin} · ${active.created}` : index === 1 ? (complete ? `Dispatched from ${active.origin}` : stage.detail) : complete ? `Available at ${active.destination} office` : stage.detail}</p></div></div></div>; })}
              </div></section>
            </div>
            <aside className="min-w-0 space-y-6">
              <section className="rounded-lg border border-border bg-surface p-6 shadow-sm md:p-7"><div className="mb-6 flex items-start justify-between gap-3"><div><p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Shipment details</p><h2 className="font-display text-xl font-extrabold">Parcel overview</h2></div><span className="flex size-10 shrink-0 items-center justify-center rounded bg-signal/25 text-foreground"><Package className="size-5"/></span></div><div className="grid grid-cols-2 gap-x-4 gap-y-5 border-y border-border py-5"><div><p className="detail-label">Sender</p><p className="detail-value">{active.sender}</p></div><div><p className="detail-label">Receiver</p><p className="detail-value">{active.receiver}</p></div><div><p className="detail-label">Weight</p><p className="detail-value">{active.weight} kg</p></div><div><p className="detail-label">Amount paid</p><p className="detail-value">KES {active.amount}</p></div></div><div className="mt-5 flex items-center gap-2 text-xs text-muted-foreground"><Clock3 className="size-4 text-primary"/>{active.status === 2 ? "Ready for collection at the destination office" : "Updates appear as your parcel moves"}</div></section>
              <section className="rounded-lg bg-foreground p-6 text-primary-foreground md:p-7"><span className="mb-7 flex size-10 items-center justify-center rounded bg-signal text-foreground"><PackageCheck className="size-5"/></span><p className="text-[10px] font-bold uppercase tracking-[0.18em] text-signal">A BETTER WAY TO FOLLOW ALONG</p><h2 className="mt-3 font-display text-xl font-extrabold leading-snug">No more wondering where it is.</h2><p className="mt-3 text-sm leading-relaxed text-primary-foreground/65">Your parcel's milestones, route and collection details—all in one place.</p><div className="mt-7 h-1 w-full rounded-full bg-primary-foreground/15"><div className="h-full rounded-full bg-signal" style={{ width: `${active.status === 0 ? 8 : active.status === 1 ? 55 : 100}%` }}/></div><div className="mt-2 flex justify-between text-[10px] font-bold uppercase tracking-widest text-primary-foreground/50"><span>Booked</span><span>Collected</span></div></section>
            </aside>
          </div>
        </> : <>
          {!signedIn ? <div className="mx-auto max-w-[470px] border border-border bg-surface p-6 shadow-sm md:p-9"><span className="mb-6 flex size-11 items-center justify-center rounded bg-primary/10 text-primary"><ShieldCheck className="size-6"/></span><p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-primary">Agent desk · simulation</p><h2 className="font-display text-2xl font-extrabold">Sign in to the desk</h2><p className="mt-2 text-sm leading-relaxed text-muted-foreground">Use any station ID and PIN to try the booking workflow. This demo is not connected to a real company.</p><form onSubmit={(e) => { e.preventDefault(); if (stationId.trim() && pin.trim()) { setSignedIn(true); setAgentMessage(""); } }} className="mt-7 space-y-5"><label className="block text-xs font-bold text-foreground">Station ID<input required value={stationId} onChange={(e) => setStationId(e.target.value)} placeholder="e.g. KAI-NBO-04" className="mt-2 h-11 w-full rounded border border-input bg-background px-3 text-sm outline-none focus:border-primary"/></label><label className="block text-xs font-bold text-foreground">Demo PIN<input required type="password" value={pin} onChange={(e) => setPin(e.target.value)} placeholder="Enter any PIN" className="mt-2 h-11 w-full rounded border border-input bg-background px-3 text-sm outline-none focus:border-primary"/></label><Button type="submit" className="h-11 w-full font-bold">Open agent desk <ArrowRight/></Button></form></div> :
          <div className="grid gap-7 lg:grid-cols-[minmax(0,1fr)_minmax(350px,.95fr)]">
            <section className="rounded-lg border border-border bg-surface p-5 shadow-sm md:p-7"><div className="mb-7 flex items-start justify-between gap-3"><div><p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-primary">Station {stationId}</p><h2 className="font-display text-xl font-extrabold">Register a parcel</h2></div><Button variant="ghost" size="icon" onClick={() => { setSignedIn(false); setPin(""); }} title="Sign out"><LogOut/></Button></div><form onSubmit={createParcel} className="space-y-5"><div className="grid gap-5 sm:grid-cols-2"><label className="field-label">Sender name<input required value={form.sender} onChange={(e) => setForm({ ...form, sender: e.target.value })} placeholder="Full name" className="field-input"/></label><label className="field-label">Receiver name<input required value={form.receiver} onChange={(e) => setForm({ ...form, receiver: e.target.value })} placeholder="Full name" className="field-input"/></label><label className="field-label">From office<span className="relative block"><select value={form.origin} onChange={(e) => setForm({ ...form, origin: e.target.value })} className="field-input appearance-none">{["Nairobi", "Nakuru", "Kisumu", "Busia", "Mombasa", "Eldoret"].map((city) => <option key={city}>{city}</option>)}</select><ChevronDown className="pointer-events-none absolute right-3 top-5 size-4 text-muted-foreground"/></span></label><label className="field-label">To office<span className="relative block"><select value={form.destination} onChange={(e) => setForm({ ...form, destination: e.target.value })} className="field-input appearance-none">{["Busia", "Nairobi", "Nakuru", "Kisumu", "Mombasa", "Eldoret"].map((city) => <option key={city}>{city}</option>)}</select><ChevronDown className="pointer-events-none absolute right-3 top-5 size-4 text-muted-foreground"/></span></label><label className="field-label">Weight (kg)<input required type="number" min="0.1" step="0.1" value={form.weight} onChange={(e) => setForm({ ...form, weight: e.target.value })} placeholder="0.0" className="field-input"/></label><label className="field-label">Amount paid (KES)<input required type="number" min="0" step="1" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} placeholder="0" className="field-input"/></label></div><Button type="submit" className="h-11 w-full font-bold"><Plus/> Book parcel</Button></form>{agentMessage && <p role="status" className="mt-4 rounded bg-primary/10 p-3 text-xs font-semibold text-primary">{agentMessage}</p>}</section>
            <section><div className="mb-5 flex items-end justify-between"><div><p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-primary">DESK ACTIVITY</p><h2 className="font-display text-xl font-extrabold">Parcels <span className="text-muted-foreground">({parcels.length})</span></h2></div><span className="text-xs text-muted-foreground">This session</span></div><div className="space-y-3">{parcels.map((parcel) => <div key={parcel.id} className="rounded-lg border border-border bg-surface p-5 shadow-sm"><div className="flex items-start justify-between gap-2"><div><p className="font-mono text-xs font-bold text-primary">{parcel.id}</p><p className="mt-2 font-display text-sm font-extrabold">{parcel.origin} <ArrowRight className="inline size-3.5 text-muted-foreground"/> {parcel.destination}</p></div><StatusPill status={parcel.status}/></div><p className="mt-3 text-xs text-muted-foreground">To {parcel.receiver} · {parcel.weight} kg</p><div className="mt-4 flex flex-wrap items-center gap-2 border-t border-border pt-4">{parcel.status < 2 && <Button size="sm" variant="outline" onClick={() => updateStatus(parcel.id, (parcel.status + 1) as Status)} className="text-xs">{parcel.status === 0 ? <Truck/> : <CircleCheck/>}{parcel.status === 0 ? "Mark in transit" : "Mark arrived"}</Button>}<Button variant="ghost" size="sm" className="ml-auto text-xs text-primary" onClick={() => { setActiveId(parcel.id); setView("customer"); setQuery(""); }}>View tracking <ArrowRight/></Button></div></div>)}</div></section>
          </div>}
        </>}
        <footer className="mt-14 flex flex-col justify-between gap-3 border-t border-border pt-5 text-xs text-muted-foreground sm:flex-row"><span>© KAI Parcel Network</span><span>Interactive concept only · No live parcels or agent accounts</span></footer>
      </main>
    </div>
  );
}