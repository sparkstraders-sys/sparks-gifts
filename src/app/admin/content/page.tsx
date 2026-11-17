"use client";
import { useEffect, useState } from "react";
import { Loader2, CheckCircle, Plus, Trash2, ArrowUp, ArrowDown, RotateCcw } from "lucide-react";
import type { Cms } from "@/lib/content";

type Path = (string | number)[];
const TABS = ["Home", "About", "Contact & FAQ", "Pages", "Header & Footer", "SEO"] as const;

function setIn<T>(obj: T, path: Path, value: unknown): T {
  if (path.length === 0) return value as T;
  const [k, ...rest] = path;
  const copy: any = Array.isArray(obj) ? [...(obj as any)] : { ...(obj as any) };
  copy[k] = setIn(copy[k], rest, value);
  return copy;
}
function getIn(obj: any, path: Path) { return path.reduce((o, k) => (o == null ? o : o[k]), obj); }

const inp = "w-full px-3 py-2.5 border border-dark-200 text-sm focus:outline-none focus:border-gold-500 bg-white";
const lab = "block text-[10px] font-bold tracking-wider uppercase text-dark-500 mb-1.5";

export default function ContentPage() {
  const [c, setC] = useState<Cms | null>(null);
  const [tab, setTab] = useState<(typeof TABS)[number]>("Home");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [err, setErr] = useState("");

  useEffect(() => { fetch("/api/admin/content").then(r => r.json()).then(setC).catch(() => setErr("Could not load content")); }, []);
  if (!c) return <div className="flex justify-center py-20"><Loader2 className="w-6 h-6 text-gold-400 animate-spin" /></div>;

  const set = (path: Path, v: unknown) => setC(prev => setIn(prev, path, v));
  const move = (path: Path, i: number, d: number) => {
    const arr = [...getIn(c, path)]; const j = i + d; if (j < 0 || j >= arr.length) return;
    [arr[i], arr[j]] = [arr[j], arr[i]]; set(path, arr);
  };
  const add = (path: Path, item: unknown) => set(path, [...getIn(c, path), item]);
  const remove = (path: Path, i: number) => set(path, getIn(c, path).filter((_: unknown, x: number) => x !== i));

  async function save() {
    setSaving(true); setErr("");
    const r = await fetch("/api/admin/content", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(c) });
    setSaving(false);
    if (r.ok) { setSaved(true); setTimeout(() => setSaved(false), 2500); } else setErr("Save failed. Please try again.");
  }
  async function reset() {
    if (!confirm("Reset ALL website text back to the original defaults? This cannot be undone.")) return;
    await fetch("/api/admin/content", { method: "DELETE" });
    setC(await fetch("/api/admin/content").then(r => r.json()));
  }

  const Field = ({ label, path, area, hint }: { label: string; path: Path; area?: boolean; hint?: string }) => (
    <div>
      <label className={lab}>{label}</label>
      {area
        ? <textarea rows={3} value={getIn(c, path) ?? ""} onChange={e => set(path, e.target.value)} className={inp + " resize-y"} />
        : <input value={getIn(c, path) ?? ""} onChange={e => set(path, e.target.value)} className={inp} />}
      {hint && <p className="text-xs text-dark-400 mt-1">{hint}</p>}
    </div>
  );
  const Toggle = ({ label, path }: { label: string; path: Path }) => (
    <label className="flex items-center gap-2 text-sm text-dark-700 cursor-pointer">
      <input type="checkbox" checked={!!getIn(c, path)} onChange={e => set(path, e.target.checked)} className="w-4 h-4 accent-yellow-600" />{label}
    </label>
  );
  const Card = ({ title, children, hint }: { title: string; children: React.ReactNode; hint?: string }) => (
    <div className="bg-white border border-dark-100 p-5">
      <div className="text-[10px] font-bold tracking-widest uppercase text-dark-400 mb-1">{title}</div>
      {hint && <p className="text-xs text-dark-400 mb-3">{hint}</p>}
      <div className="space-y-4 mt-3">{children}</div>
    </div>
  );
  // A list editor: each item is a row of fields, with up/down/delete
  const List = ({ title, path, fields, empty, addLabel, max, min }: { title: string; path: Path; fields: { k: string; label: string; area?: boolean; small?: boolean }[]; empty: Record<string, unknown>; addLabel: string; max?: number; min?: number }) => {
    const items: Record<string, any>[] = getIn(c, path) ?? [];
    return (
      <Card title={title}>
        {items.map((it, i) => (
          <div key={i} className="border border-dark-100 p-3 bg-dark-50/50">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold text-dark-400">#{i + 1}</span>
              <div className="flex gap-1">
                <button type="button" onClick={() => move(path, i, -1)} className="p-1.5 hover:bg-dark-100" aria-label="Move up"><ArrowUp className="w-3.5 h-3.5" /></button>
                <button type="button" onClick={() => move(path, i, 1)} className="p-1.5 hover:bg-dark-100" aria-label="Move down"><ArrowDown className="w-3.5 h-3.5" /></button>
                {(min === undefined || items.length > min) && <button type="button" onClick={() => remove(path, i)} className="p-1.5 text-red-500 hover:bg-red-50" aria-label="Delete"><Trash2 className="w-3.5 h-3.5" /></button>}
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {fields.map(f => (
                <div key={f.k} className={f.area ? "sm:col-span-2" : ""}>
                  <label className={lab}>{f.label}</label>
                  {f.area
                    ? <textarea rows={3} value={it[f.k] ?? ""} onChange={e => set([...path, i, f.k], e.target.value)} className={inp + " resize-y"} />
                    : <input value={it[f.k] ?? ""} onChange={e => set([...path, i, f.k], e.target.value)} className={inp} />}
                </div>
              ))}
            </div>
          </div>
        ))}
        {(max === undefined || items.length < max) && (
          <button type="button" onClick={() => add(path, empty)} className="flex items-center gap-1.5 text-xs font-bold text-gold-600 hover:text-gold-500"><Plus className="w-3.5 h-3.5" />{addLabel}</button>
        )}
      </Card>
    );
  };

  return (
    <div className="space-y-5 pb-24">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div><h1 className="text-xl font-bold text-dark-900">Website Content</h1><p className="text-sm text-dark-400 mt-0.5">Edit all text on your website. Click Save, then refresh your store to see changes.</p></div>
        <button onClick={reset} className="flex items-center gap-1.5 text-xs text-dark-400 hover:text-red-500"><RotateCcw className="w-3.5 h-3.5" />Reset to defaults</button>
      </div>

      <div className="flex gap-1 overflow-x-auto border-b border-dark-100">
        {TABS.map(t => (
          <button key={t} onClick={() => setTab(t)} className={`px-4 py-2.5 text-xs font-bold tracking-wider uppercase whitespace-nowrap border-b-2 -mb-px ${tab === t ? "border-gold-500 text-gold-600" : "border-transparent text-dark-400 hover:text-dark-700"}`}>{t}</button>
        ))}
      </div>

      {tab === "Home" && (<div className="space-y-5">
        <Card title="Hero (top of home page)">
          <Field label="Small badge text" path={["hero", "badge"]} />
          <div className="grid sm:grid-cols-2 gap-4"><Field label="Heading line 1" path={["hero", "line1"]} /><Field label="Heading line 2 (gold)" path={["hero", "line2"]} /></div>
          <Field label="Subtitle" path={["hero", "subtitle"]} area />
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Button 1 text" path={["hero", "btn1Text"]} /><Field label="Button 1 link" path={["hero", "btn1Link"]} hint="e.g. /shop" />
            <Field label="Button 2 text" path={["hero", "btn2Text"]} /><Field label="Button 2 link" path={["hero", "btn2Link"]} hint="e.g. /custom-gift" />
          </div>
        </Card>
        <List title="Hero numbers (3 items)" path={["hero", "stats"]} fields={[{ k: "value", label: "Number" }, { k: "label", label: "Label" }]} empty={{ value: "", label: "" }} addLabel="Add number" max={4} />
        <List title="Dark feature bar" path={["features"]} fields={[{ k: "title", label: "Title" }, { k: "desc", label: "Description" }]} empty={{ title: "", desc: "" }} addLabel="Add feature" max={4} />
        <Card title="Show / hide sections">
          <div className="grid sm:grid-cols-2 gap-3">
            <Toggle label="Categories circles" path={["show", "categories"]} /><Toggle label="Trending products" path={["show", "products"]} />
            <Toggle label="How it works" path={["show", "howItWorks"]} /><Toggle label="Custom gift banner" path={["show", "customBanner"]} />
            <Toggle label="Customer testimonials" path={["show", "testimonials"]} />
          </div>
        </Card>
        <Card title="Section headings">
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Categories small title" path={["sections", "categoriesEyebrow"]} /><Field label="Categories heading" path={["sections", "categoriesTitle"]} />
            <Field label="Products small title" path={["sections", "productsEyebrow"]} /><Field label="Products heading" path={["sections", "productsTitle"]} />
            <Field label="How it works small title" path={["sections", "howEyebrow"]} /><Field label="How it works heading" path={["sections", "howTitle"]} />
            <Field label="Testimonials small title" path={["sections", "testimonialsEyebrow"]} /><Field label="Testimonials heading" path={["sections", "testimonialsTitle"]} />
          </div>
        </Card>
        <List title="How it works steps" path={["howItWorks"]} fields={[{ k: "icon", label: "Emoji icon" }, { k: "title", label: "Title" }, { k: "desc", label: "Description", area: true }]} empty={{ icon: "✨", title: "", desc: "" }} addLabel="Add step" max={6} />
        <Card title="Custom gift banner">
          <div className="grid sm:grid-cols-2 gap-4"><Field label="Small title" path={["customBanner", "eyebrow"]} /><Field label="Heading" path={["customBanner", "title"]} /></div>
          <Field label="Text" path={["customBanner", "text"]} area /><Field label="Button text" path={["customBanner", "button"]} />
        </Card>
        <List title="Customer testimonials" path={["testimonials"]} fields={[{ k: "name", label: "Name" }, { k: "city", label: "City" }, { k: "text", label: "Review", area: true }]} empty={{ name: "", city: "", text: "" }} addLabel="Add testimonial" max={9} />
        <p className="text-xs text-dark-400">Only add real customer reviews here.</p>
      </div>)}

      {tab === "About" && (<div className="space-y-5">
        <Card title="Top section">
          <Field label="Small title" path={["about", "eyebrow"]} />
          <div className="grid sm:grid-cols-2 gap-4"><Field label="Heading line 1" path={["about", "title1"]} /><Field label="Heading line 2 (gold)" path={["about", "title2"]} /></div>
          <Field label="Intro paragraph" path={["about", "intro"]} area /><Field label="Quote" path={["about", "quote"]} />
        </Card>
        <Card title="Steps heading"><Field label="Heading" path={["about", "stepsTitle"]} /></Card>
        <List title="Steps" path={["about", "steps"]} fields={[{ k: "icon", label: "Emoji icon" }, { k: "title", label: "Title" }, { k: "desc", label: "Description", area: true }]} empty={{ icon: "✨", title: "", desc: "" }} addLabel="Add step" max={6} />
        <Card title="Our promise">
          <div className="grid sm:grid-cols-2 gap-4"><Field label="Small title" path={["about", "promiseEyebrow"]} /><Field label="Heading" path={["about", "promiseTitle"]} /></div>
          <Field label="Text" path={["about", "promiseText"]} area /><Field label="Highlighted line" path={["about", "promiseQuote"]} />
        </Card>
        <List title="Highlights (4 boxes)" path={["about", "highlights"]} fields={[{ k: "title", label: "Title" }, { k: "desc", label: "Description", area: true }]} empty={{ title: "", desc: "" }} addLabel="Add highlight" max={6} />
      </div>)}

      {tab === "Contact & FAQ" && (<div className="space-y-5">
        <Card title="Contact page" hint="Main phone, WhatsApp, email and address are changed in Admin → Settings.">
          <Field label="Intro text" path={["contact", "intro"]} />
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Second phone number" path={["contact", "phone2"]} /><Field label="Second WhatsApp (with 92)" path={["contact", "whatsapp2"]} hint="e.g. 923001432007" />
            <Field label="Working hours" path={["contact", "hours"]} /><Field label="Delivery note" path={["contact", "deliveryNote"]} />
          </div>
        </Card>
        <List title="FAQ" path={["faqs"]} fields={[{ k: "q", label: "Question" }, { k: "a", label: "Answer", area: true }]} empty={{ q: "", a: "" }} addLabel="Add question" max={20} />
      </div>)}

      {tab === "Pages" && (<div className="space-y-5">
        <p className="text-sm text-dark-500">Extra pages such as Privacy Policy. Each page is available at <b>/pages/&lt;slug&gt;</b>. In the text, start a line with <b># </b> to make a heading; leave a blank line between paragraphs.</p>
        <List title="Pages" path={["pages"]} fields={[{ k: "slug", label: "Slug (web address, e.g. privacy)" }, { k: "title", label: "Title" }, { k: "body", label: "Page text", area: true }]} empty={{ slug: "new-page", title: "New page", body: "", showInFooter: true }} addLabel="Add page" max={12} />
        <Card title="Show in footer">
          {(c.pages ?? []).map((p, i) => <Toggle key={i} label={`${p.title || p.slug}`} path={["pages", i, "showInFooter"]} />)}
        </Card>
      </div>)}

      {tab === "Header & Footer" && (<div className="space-y-5">
        <Card title="Top announcement bar">
          <Toggle label="Show announcement bar" path={["announcement", "enabled"]} />
          <Field label="Text" path={["announcement", "text"]} hint="Use this for sales, Eid offers, delivery notices, etc." />
        </Card>
        <Card title="Footer">
          <Field label="Short about text" path={["footer", "about"]} area />
          <Field label="Copyright text (after the year)" path={["footer", "copyright"]} />
          <Toggle label="Show occasions column" path={["footer", "showOccasions"]} />
        </Card>
        <Card title="Footer occasions list">
          {(c.footer.occasions ?? []).map((o, i) => (
            <div key={i} className="flex gap-2">
              <input value={o} onChange={e => set(["footer", "occasions", i], e.target.value)} className={inp} />
              <button type="button" onClick={() => remove(["footer", "occasions"], i)} className="p-2 text-red-500 hover:bg-red-50"><Trash2 className="w-4 h-4" /></button>
            </div>
          ))}
          <button type="button" onClick={() => add(["footer", "occasions"], "")} className="flex items-center gap-1.5 text-xs font-bold text-gold-600"><Plus className="w-3.5 h-3.5" />Add occasion</button>
        </Card>
      </div>)}

      {tab === "SEO" && (<div className="space-y-5">
        <Card title="Search engines (Google)" hint="This is how your website appears in Google search results and when shared on WhatsApp.">
          <Field label="Site name" path={["seo", "siteName"]} />
          <Field label="Home page title" path={["seo", "title"]} hint="Best under 60 characters" />
          <Field label="Description" path={["seo", "description"]} area hint="Best under 160 characters" />
        </Card>
      </div>)}

      <div className="fixed bottom-0 left-0 right-0 lg:left-56 bg-white border-t border-dark-100 px-6 py-3 flex items-center gap-4 z-30">
        <button onClick={save} disabled={saving} className="flex items-center gap-2 px-6 py-3 bg-gold-500 text-white text-[11px] font-bold tracking-widest uppercase hover:bg-gold-400 disabled:opacity-60">
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : saved ? <><CheckCircle className="w-4 h-4" />Saved!</> : "Save all changes"}
        </button>
        {err && <span className="text-sm text-red-600">{err}</span>}
        <a href="/" target="_blank" className="text-xs text-dark-400 hover:text-gold-600 ml-auto">View website ↗</a>
      </div>
    </div>
  );
}
