import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Gift, Truck, Shield, Heart, MessageCircle, CheckCircle2 } from "lucide-react";
import { getActiveCategories, getProductsWithImages } from "@/db/queries";
import HeroScene from "@/components/ui/HeroScene";
import Tilt3D from "@/components/ui/Tilt3D";
import Reveal from "@/components/ui/Reveal";
import TrackBox from "@/components/ui/TrackBox";
import { getCms, getSite } from "@/lib/content";
import AddToCartButton from "@/components/shop/AddToCartButton";

export const dynamic = "force-dynamic";

const CATEGORY_ICONS: Record<string, string> = {
  perfumes: "🌹", chocolates: "🍫", "gift-sets": "🎁", flowers: "💐", "flowers-bouquets": "💐",
  cakes: "🎂", accessories: "💍", birthday: "🎂", anniversary: "💑", watches: "⌚", default: "✨",
};

export default async function HomePage() {
  const [cms, site] = await Promise.all([getCms(), getSite()]);
  const featureIcons = [Gift, Truck, Shield, Heart];
  const [categories, products] = await Promise.all([
    getActiveCategories().catch(() => []),
    getProductsWithImages({ isActive: true, limit: 8 }).catch(() => []),
  ]);
  const wa = site.whatsapp.replace(/\D/g, "");

  return (
    <div>
      {/* ── HERO ── */}
      <section className="relative overflow-hidden">
        <div className="absolute -top-24 -left-24 w-[420px] h-[420px] rounded-full bg-gold-200/30 blur-3xl pointer-events-none" />
        <div className="absolute top-1/3 -right-24 w-[460px] h-[460px] rounded-full bg-gold-100/60 blur-3xl pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-24 lg:pt-14 lg:pb-28 grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-6 items-center">
          <div className="animate-fade-up">
            {cms.hero.notice && (
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-dark-100 float-card mb-6">
                <span className="relative flex w-2 h-2"><span className="absolute inset-0 rounded-full bg-gold-500 animate-ping opacity-60" /><span className="relative w-2 h-2 rounded-full bg-gold-500" /></span>
                <span className="text-[11px] font-medium text-dark-600">{cms.hero.notice}</span>
              </div>
            )}
            <div className="text-gold-500 text-[11px] font-bold tracking-[0.35em] uppercase mb-4">{cms.hero.badge}</div>
            <h1 className="font-serif text-5xl sm:text-6xl lg:text-7xl font-bold text-dark-900 leading-[1.05] mb-5">
              {cms.hero.line1}
              <span className="block text-gold-500">{cms.hero.line2}</span>
            </h1>
            <p className="text-dark-500 text-lg leading-relaxed mb-8 max-w-lg">{cms.hero.subtitle}</p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link href={cms.hero.btn1Link}
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-dark-900 text-white text-[11px] font-bold tracking-widest uppercase hover:bg-gold-500 transition-all duration-300 btn-glow">
                {cms.hero.btn1Text} <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href={cms.hero.btn2Link}
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full border-2 border-gold-500 text-gold-600 text-[11px] font-bold tracking-widest uppercase hover:bg-gold-500 hover:text-white transition-all duration-300">
                {cms.hero.btn2Text}
              </Link>
            </div>
            <div className="flex items-center gap-6 mt-10 pt-8 border-t border-dark-100">
              {cms.hero.stats.map((st, i) => (
                <div key={i} className="flex items-center gap-6">
                  {i > 0 && <div className="w-px h-8 bg-dark-200" />}
                  <div>
                    <div className="text-xl font-bold text-dark-900">{st.value}</div>
                    <div className="text-xs text-dark-400 tracking-wider">{st.label}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-center animate-fade-up-delay">
            <HeroScene imageUrl={cms.hero.imageUrl || undefined} />
          </div>
        </div>
      </section>

      {/* ── FLOATING FEATURE CARD ── */}
      <section className="relative z-10 -mt-14 lg:-mt-16 px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="max-w-6xl mx-auto bg-white rounded-3xl float-card border border-dark-100 px-5 py-6 lg:px-10">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-0 lg:divide-x divide-dark-100">
              {cms.features.map((f, i) => {
                const Icon = featureIcons[i % 4];
                return (
                  <div key={i} className="flex items-center gap-3 lg:px-6 first:lg:pl-0">
                    <div className="w-11 h-11 rounded-full border border-gold-300 bg-gold-50 flex items-center justify-center flex-shrink-0">
                      <Icon className="w-5 h-5 text-gold-600" />
                    </div>
                    <div>
                      <div className="text-[12px] font-bold text-dark-900">{f.title}</div>
                      <div className="text-[11px] text-dark-400 leading-snug">{f.desc}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </Reveal>
      </section>

      {/* ── CATEGORIES ── */}
      {cms.show.categories && categories.length > 0 && (
        <section className="pt-16 pb-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Reveal className="text-center mb-10">
              <div className="text-gold-500 text-[10px] font-bold tracking-[0.3em] uppercase mb-2">{cms.sections.categoriesEyebrow}</div>
              <h2 className="font-serif text-3xl lg:text-4xl font-bold text-dark-900">{cms.sections.categoriesTitle}</h2>
            </Reveal>
            <div className="flex flex-wrap justify-center gap-6 lg:gap-9">
              {categories.map(cat => (
                <Link key={cat.id} href={`/categories/${cat.slug}`} className="cat-circle flex flex-col items-center gap-3 group">
                  <div className="relative w-[84px] h-[84px] rounded-full overflow-hidden bg-gradient-to-b from-white to-gold-50 border border-dark-100 group-hover:border-gold-500 transition-all duration-300 flex items-center justify-center text-3xl">
                    {cat.imageUrl
                      ? <Image src={cat.imageUrl} alt={cat.name} fill sizes="84px" className="object-cover" />
                      : (CATEGORY_ICONS[cat.slug] ?? CATEGORY_ICONS.default)}
                  </div>
                  <span className="text-xs font-semibold text-dark-700 group-hover:text-gold-600 transition-colors text-center tracking-wider">{cat.name}</span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── TRENDING PRODUCTS ── */}
      {cms.show.products && products.length > 0 && (
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-end justify-between mb-10">
              <div>
                <div className="text-gold-500 text-[10px] font-bold tracking-[0.3em] uppercase mb-2">{cms.sections.productsEyebrow}</div>
                <h2 className="font-serif text-3xl lg:text-4xl font-bold text-dark-900">{cms.sections.productsTitle}</h2>
              </div>
              <Link href="/shop" className="text-[11px] font-bold tracking-widest uppercase text-gold-600 flex items-center gap-1 hover:text-gold-500">
                View All <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
              {products.map(product => {
                const img = product.images[0];
                const sp = parseFloat(String(product.sellPrice));
                const disc = parseFloat(String(product.discount));
                const fp = disc > 0 ? sp - (sp * disc) / 100 : sp;
                return (
                  <Tilt3D key={product.id} className="group bg-white border border-dark-100 rounded-3xl overflow-hidden">
                    <Link href={`/products/${product.slug}`}>
                      <div className="relative aspect-square bg-dark-50 overflow-hidden">
                        {img ? (
                          <Image src={img.url} alt={product.name} fill sizes="(max-width:768px) 50vw, 25vw" className="object-cover group-hover:scale-105 transition-transform duration-500" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-5xl">🎁</div>
                        )}
                        {disc > 0 && (
                          <div className="absolute top-3 left-3 bg-gold-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-full tracking-wider">{disc}% OFF</div>
                        )}
                        {product.stock <= 5 && product.stock > 0 && (
                          <div className="absolute top-3 right-3 bg-dark-900 text-white text-[9px] font-bold px-2 py-1 rounded-full">{product.stock} left</div>
                        )}
                      </div>
                    </Link>
                    <div className="p-4">
                      {product.brand && <div className="text-[10px] text-dark-400 tracking-widest uppercase mb-0.5">{product.brand}</div>}
                      <Link href={`/products/${product.slug}`}>
                        <h3 className="text-sm font-semibold text-dark-800 line-clamp-2 mb-3 group-hover:text-gold-600 transition-colors leading-snug">{product.name}</h3>
                      </Link>
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-sm font-bold text-dark-900">Rs. {fp.toLocaleString("en-PK")}</div>
                          {disc > 0 && <div className="text-xs text-dark-300 line-through">Rs. {sp.toLocaleString("en-PK")}</div>}
                        </div>
                        <AddToCartButton product={{ id: product.id, name: product.name, slug: product.slug, brand: product.brand, sellPrice: sp, discount: disc, stock: product.stock, imageUrl: img?.url }} compact />
                      </div>
                    </div>
                  </Tilt3D>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ── HOW IT WORKS (navy panel) ── */}
      {cms.show.howItWorks && (
        <section className="px-4 sm:px-6 lg:px-8 py-8">
          <Reveal>
            <div className="max-w-7xl mx-auto rounded-[2rem] panel-navy float-card relative overflow-hidden px-6 py-12 lg:px-14 lg:py-14">
              <div className="absolute -right-16 -bottom-16 w-72 h-72 rounded-full bg-gold-500/10 blur-3xl" />
              <div className="relative">
                <div className="text-gold-300 text-[10px] font-bold tracking-[0.3em] uppercase mb-2">{cms.sections.howEyebrow}</div>
                <h2 className="font-serif text-3xl lg:text-4xl font-bold text-white mb-10">{cms.sections.howTitle}</h2>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                  {cms.howItWorks.map((st, i) => (
                    <div key={i} className="group">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 group-hover:border-gold-400 group-hover:bg-gold-500/10 transition-all duration-300 flex items-center justify-center text-2xl">{st.icon}</div>
                        <span className="font-serif text-4xl text-white/15 font-bold select-none">{String(i + 1).padStart(2, "0")}</span>
                      </div>
                      <div className="text-white font-semibold text-sm mb-1">{i + 1}. {st.title}</div>
                      <div className="text-dark-300 text-xs leading-relaxed">{st.desc}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Reveal>
        </section>
      )}

      {/* ── CUSTOM GIFT CONCIERGE ── */}
      {cms.show.customBanner && (
        <section className="px-4 sm:px-6 lg:px-8 py-10">
          <Reveal>
            <div className="max-w-7xl mx-auto rounded-[2rem] bg-white border border-dark-100 float-card relative overflow-hidden p-8 lg:p-12">
              <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-gold-200/40 blur-3xl pointer-events-none" />
              <div className="relative flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                <div className="max-w-2xl">
                  <div className="text-gold-500 text-[10px] font-bold tracking-[0.3em] uppercase mb-3">{cms.customBanner.eyebrow}</div>
                  <h2 className="font-serif text-3xl lg:text-4xl font-bold text-dark-900 mb-3">{cms.customBanner.title}</h2>
                  <p className="text-dark-500 text-sm leading-relaxed mb-5">{cms.customBanner.text}</p>
                  <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-dark-600">
                    {[cms.customBanner.point1, cms.customBanner.point2].filter(Boolean).map(pt => (
                      <span key={pt} className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-gold-500" />{pt}</span>
                    ))}
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row lg:flex-col gap-3 flex-shrink-0">
                  <Link href="/custom-gift"
                    className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-dark-900 text-white text-[11px] font-bold tracking-widest uppercase hover:bg-gold-500 transition-all btn-glow whitespace-nowrap">
                    {cms.customBanner.button}
                  </Link>
                  <a href={`https://wa.me/${wa}`} target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full border-2 border-dark-200 text-dark-700 text-[11px] font-bold tracking-widest uppercase hover:border-gold-500 hover:text-gold-600 transition-all whitespace-nowrap">
                    <MessageCircle className="w-4 h-4" /> {cms.customBanner.whatsappButton}
                  </a>
                </div>
              </div>
            </div>
          </Reveal>
        </section>
      )}

      {/* ── TESTIMONIALS ── */}
      {cms.show.testimonials && cms.testimonials.length > 0 && (
        <section className="py-14">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <Reveal className="text-center mb-10">
              <div className="text-gold-500 text-[10px] font-bold tracking-[0.3em] uppercase mb-2">{cms.sections.testimonialsEyebrow}</div>
              <h2 className="font-serif text-3xl lg:text-4xl font-bold text-dark-900">{cms.sections.testimonialsTitle}</h2>
            </Reveal>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {cms.testimonials.map((t, i) => (
                <Reveal key={i} delay={i * 100}>
                  <div className="float-card bg-white border border-dark-100 rounded-3xl p-6 h-full">
                    <div className="text-gold-400 text-sm mb-3">★★★★★</div>
                    <p className="text-sm text-dark-600 leading-relaxed mb-4">&ldquo;{t.text}&rdquo;</p>
                    <div className="text-sm font-bold text-dark-900">{t.name}</div>
                    <div className="text-xs text-dark-400">{t.city}</div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── ORDER TRACKING ── */}
      {cms.show.track && (
        <section className="px-4 sm:px-6 lg:px-8 pb-16">
          <Reveal>
            <div className="max-w-4xl mx-auto rounded-3xl bg-gradient-to-r from-gold-50 to-white border border-gold-100 float-card p-6 lg:p-8 flex flex-col md:flex-row items-center justify-between gap-5">
              <div>
                <div className="font-serif text-2xl font-bold text-dark-900 mb-1">{cms.track.title}</div>
                <div className="text-sm text-dark-500">{cms.track.text}</div>
              </div>
              <TrackBox />
            </div>
          </Reveal>
        </section>
      )}
    </div>
  );
}
