import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCms } from "@/lib/content";

export const dynamic = "force-dynamic";
type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const page = (await getCms()).pages.find(p => p.slug === slug);
  return { title: page?.title ?? "Page" };
}

export default async function CmsPage({ params }: Props) {
  const { slug } = await params;
  const page = (await getCms()).pages.find(p => p.slug === slug);
  if (!page) notFound();
  const blocks = page.body.split(/\n{2,}/).map(b => b.trim()).filter(Boolean);
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-14">
      <h1 className="font-serif text-3xl lg:text-4xl font-bold text-dark-900 mb-8">{page.title}</h1>
      <div className="space-y-4">
        {blocks.flatMap((b, i) =>
          b.split("\n").map((line, j) =>
            line.startsWith("# ")
              ? <h2 key={`${i}-${j}`} className="font-serif text-xl font-bold text-dark-800 pt-3">{line.slice(2)}</h2>
              : <p key={`${i}-${j}`} className="text-dark-600 leading-relaxed whitespace-pre-line">{line}</p>
          )
        )}
      </div>
    </div>
  );
}
