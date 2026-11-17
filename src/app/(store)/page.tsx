import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Gift, Truck, Shield, Star, Package } from "lucide-react";
import { getActiveCategories, getProductsWithImages } from "@/db/queries";
import HeroScene from "@/components/ui/HeroScene";
import Tilt3D from "@/components/ui/Tilt3D";
import Reveal from "@/components/ui/Reveal";
import { getCms } from "@/lib/content";
import AddToCartButton from "@/components/shop/AddToCartButton";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const cms = await getCms();
  const featureIcons = [Gift, Truck, Shield, Star];
  const [categories, products] = await Promise.all([
    getActiveCategories().catch(() => []),
    getProductsWithImages({ isActive: true, limit: 8 }).catch(() => []),
  ]);

  const CATEGORY_ICONS: Record<string, string> = {
    perfumes: "🌹", chocolates: "🍫", "gift-sets": "🎁", flowers: "💐", "flowers-bouquets": "💐",
    cakes: "🎂", accessories: "💍", birthday: "🎂", anniversary: "💑", watches: "⌚",
    default: "✨"
  };

  return (
    <div>
      {/* ── HERO ── */}
      <section className="relative bg-white overflow-hidden min-h-[85vh] flex items-center">
        {/* BG watermark */}
        <div className="absolute right-0 top-0 bottom-0 w-1/2 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-br from-dark-50 to-white opacity-60" />
          <div className="absolute inset-0 flex items-center justify-center opacity-[0.03]">
            <Image src="/logo.png" alt="" width={600} height={600} className="w-full max-w-lg" />
          </div>
        </div>

        {/* Floating gift decorations */}
        <div className="absolute top-12 right-[10%] text-5xl animate-float opacity-20 select-none pointer-events-none">🎁</div>
        <div className="absolute bottom-16 right-[20%] text-4xl animate-float-delay opacity-15 select-none pointer-events-none">🌹</div>
        <div className="absolute top-1/3 right-[5%] text-3xl animate-float-delay-2 opacity-10 select-none pointer-events-none">✨</div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center w-full">
          {/* Text */}
          <div className="animate-fade-up">
            <div className="inline-flex items-center gap-2 bg-gold-50 border border-gold-200 px-4 py-2 mb-6">
              <span className="w-1.5 h-1.5 bg-gold-500 rounded-full" />
              <span className="text-gold-600 text-[10px] font-bold tracking-[0.3em] uppercase">{cms.hero.badge}</span>
            </div>
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-dark-900 leading-[1.1] mb-5">
              {cms.hero.line1}
              <span className="block text-gold-500">{cms.hero.line2}</span>
            </h1>
            <p className="text-dark-500 text-lg leading-relaxed mb-8 max-w-lg">
              {cms.hero.subtitle}
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href={cms.hero.btn1Link}
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-dark-900 text-white text-[11px] font-bold tracking-widest uppercase hover:bg-gold-500 transition-all duration-300 btn-glow">
                {cms.hero.btn1Text} <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href={cms.hero.btn2Link}
                className="inline-flex items-center justify-center gap-2 px-8 py-4 border-2 border-gold-500 text-gold-600 text-[11px] font-bold tracking-widest uppercase hover:bg-gold-500 hover:text-white transition-all duration-300">
                {cms.hero.btn2Text}
              </Link>
            </div>

            {/* Trust badges */}
            <div className="flex items-center gap-6 mt-10 pt-8 border-t border-dark-100">
              {cms.hero.stats.map((st, i) => (
                <div key={i} className="flex items-center gap-6">
                  {i > 0 && <div className="w-px h-8 bg-dark-100" />}
                  <div className="text-center">
                    <div className="text-xl font-bold text-dark-900">{st.value}</div>
                    <div className="text-xs text-dark-400 tracking-wider">{st.label}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Visual side: 3D floating scene */}
          <div className="flex items-center justify-center animate-fade-up-delay">
            <HeroScene />
          </div>
        </div>
      </section>

      {/* ── FEATURES BAR ── */}
      <section className="bg-dark-900 py-5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {cms.features.map((f, i) => {
              const Icon = featureIcons[i % 4];
              return (
              <div key={i} className="flex items-center gap-3 py-2">
                <div className="w-9 h-9 border border-dark-600 flex items-center justify-center flex-shrink-0">
                  <Icon className="w-4 h-4 text-gold-400" />
                </div>
                <div>
                  <div className="text-white text-[11px] font-semibold tracking-wider">{f.title}</div>
                  <div className="text-dark-400 text-[10px]">{f.desc}</div>
                </div>
              </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── CATEGORIES (circles like Image 2) ── */}
      {cms.show.categories && categories.length > 0 && (
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Reveal className="text-center mb-10">
              <div className="text-gold-500 text-[10px] font-bold tracking-[0.3em] uppercase mb-2">{cms.sections.categoriesEyebrow}</div>
              <h2 className="font-serif text-3xl font-bold text-dark-900">{cms.sections.categoriesTitle}</h2>
            </Reveal>
            <div className="flex flex-wrap justify-center gap-6 lg:gap-8">
              {categories.map(cat => (
                <Link key={cat.id} href={`/categories/${cat.slug}`} className="cat-circle flex flex-col items-center gap-3 group">
                  <div className="w-18 h-18 w-[72px] h-[72px] rounded-full bg-dark-50 border-2 border-transparent group-hover:border-gold-500 group-hover:bg-gold-50 transition-all duration-300 flex items-center justify-center text-3xl shadow-sm">
                    {CATEGORY_ICONS[cat.slug] ?? CATEGORY_ICONS.default}
                  </div>
                  <span className="text-xs font-semibold text-dark-700 group-hover:text-gold-500 transition-colors text-center tracking-wider">{cat.name}</span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── TRENDING PRODUCTS ── */}
      {cms.show.products && products.length > 0 && (
        <section className="py-16 bg-dark-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-end justify-between mb-10">
              <div>
                <div className="text-gold-500 text-[10px] font-bold tracking-[0.3em] uppercase mb-2">{cms.sections.productsEyebrow}</div>
                <h2 className="font-serif text-3xl font-bold text-dark-900">{cms.sections.productsTitle}</h2>
              </div>
              <Link href="/shop" className="text-[11px] font-bold tracking-widest uppercase text-gold-500 flex items-center gap-1 hover:text-gold-600">
                View All <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-5">
              {products.map(product => {
                const img = product.images[0];
                const sp = parseFloat(String(product.sellPrice));
                const disc = parseFloat(String(product.discount));
                const fp = disc > 0 ? sp - (sp * disc) / 100 : sp;
                return (
                  <Tilt3D key={product.id} className="group bg-white border border-dark-100 overflow-hidden">
                    <Link href={`/products/${product.slug}`}>
                      <div className="relative aspect-square bg-dark-50 overflow-hidden">
                        {img ? (
                          <Image src={img.url} alt={product.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-5xl">🎁</div>
                        )}
                        {disc > 0 && (
                          <div className="absolute top-2 left-2 bg-gold-500 text-white text-[10px] font-bold px-2 py-0.5 tracking-wider">
                            {disc}% OFF
                          </div>
                        )}
                        {product.stock <= 5 && product.stock > 0 && (
                          <div className="absolute top-2 right-2 bg-red-500 text-white text-[9px] font-bold px-1.5 py-0.5">{product.stock} left</div>
                        )}
                      </div>
                    </Link>
                    <div className="p-3">
                      {product.brand && <div className="text-[10px] text-dark-400 tracking-widest uppercase mb-0.5">{product.brand}</div>}
                      <Link href={`/products/${product.slug}`}>
                        <h3 className="text-sm font-semibold text-dark-800 line-clamp-2 mb-1 group-hover:text-gold-600 transition-colors leading-snug">{product.name}</h3>
                      </Link>
                      {/* Stars */}
                      <div className="flex items-center gap-1 mb-2">
                        {"★★★★★".split("").map((s, i) => <span key={i} className="text-gold-400 text-[10px]">{s}</span>)}
                        <span className="text-[10px] text-dark-400 ml-1">4.8</span>
                      </div>
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

      {/* ── HOW IT WORKS ── */}
      {cms.show.howItWorks && (
      <section className="py-16 bg-dark-900 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 left-0 w-96 h-96 bg-gold-500 rounded-full -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-gold-500 rounded-full translate-x-1/2 translate-y-1/2" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="text-gold-400 text-[10px] font-bold tracking-[0.3em] uppercase mb-2">{cms.sections.howEyebrow}</div>
            <h2 className="font-serif text-3xl font-bold text-white">{cms.sections.howTitle}</h2>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {cms.howItWorks.map((s, i) => (
              <div key={i} className="text-center group">
                <div className="relative mb-4">
                  <div className="w-16 h-16 bg-white/5 border border-white/10 group-hover:border-gold-500 group-hover:bg-gold-500/10 transition-all duration-300 flex items-center justify-center text-3xl mx-auto">
                    {s.icon}
                  </div>
                  {i < cms.howItWorks.length - 1 && <div className="hidden lg:block absolute top-8 left-full w-full h-px bg-gradient-to-r from-dark-600 to-transparent" />}
                </div>
                <div className="text-gold-400 text-[10px] font-bold tracking-widest uppercase mb-1">Step {i + 1}</div>
                <div className="text-white font-semibold text-sm mb-1">{s.title}</div>
                <div className="text-dark-400 text-xs">{s.desc}</div>
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link href="/shop" className="inline-flex items-center gap-2 px-8 py-4 bg-gold-500 text-white text-[11px] font-bold tracking-widest uppercase hover:bg-gold-400 transition-colors btn-glow">
              Start Gifting <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
      )}

      {/* ── TESTIMONIALS ── */}
      {cms.show.testimonials && cms.testimonials.length > 0 && (
        <section className="py-16 bg-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <Reveal className="text-center mb-10">
              <div className="text-gold-500 text-[10px] font-bold tracking-[0.3em] uppercase mb-2">{cms.sections.testimonialsEyebrow}</div>
              <h2 className="font-serif text-3xl font-bold text-dark-900">{cms.sections.testimonialsTitle}</h2>
            </Reveal>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {cms.testimonials.map((t, i) => (
                <Reveal key={i} delay={i * 100}>
                  <div className="float-card bg-white border border-dark-100 p-6 h-full">
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

      {/* ── CUSTOM GIFT BANNER ── */}
      {cms.show.customBanner && (
      <section className="py-14 bg-white border-b border-dark-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="float-card bg-gradient-to-r from-dark-900 to-dark-800 p-8 lg:p-12 flex flex-col lg:flex-row items-center justify-between gap-6">
            <div>
              <div className="text-gold-400 text-[10px] font-bold tracking-[0.3em] uppercase mb-2">{cms.customBanner.eyebrow}</div>
              <h2 className="font-serif text-2xl lg:text-3xl font-bold text-white mb-2">{cms.customBanner.title}</h2>
              <p className="text-dark-300 text-sm max-w-md">{cms.customBanner.text}</p>
            </div>
            <Link href="/custom-gift"
              className="flex-shrink-0 inline-flex items-center gap-2 px-8 py-4 bg-gold-500 text-white text-[11px] font-bold tracking-widest uppercase hover:bg-gold-400 transition-colors whitespace-nowrap btn-glow">
              {cms.customBanner.button}
            </Link>
          </div>
        </div>
      </section>
      )}
    </div>
  );
}
