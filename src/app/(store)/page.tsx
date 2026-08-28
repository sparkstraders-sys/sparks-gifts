import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Gift, Truck, Shield, Star } from "lucide-react";
import { getActiveCategories, getProductsWithImages } from "@/db/queries";

export default async function HomePage() {
  const [categories, featuredProducts] = await Promise.all([
    getActiveCategories().catch(() => []),
    getProductsWithImages({ isActive: true, limit: 8 }).catch(() => []),
  ]);

  return (
    <div>
      {/* Hero */}
      <section className="relative bg-navy-900 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-navy-900 via-navy-800 to-navy-900" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-gold-500/5 rounded-full translate-x-1/2 -translate-y-1/2" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-36">
          <div className="max-w-2xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-px w-12 bg-gold-500" />
              <span className="text-gold-400 text-xs tracking-[0.4em] uppercase font-medium">Premium Gifting</span>
            </div>
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
              Gift Someone<span className="block text-gold-400">Delivered with Love.</span>
            </h1>
            <p className="text-gray-300 text-lg mb-10 leading-relaxed max-w-xl">
              You choose the gift. You write the message. We deliver the surprise.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/shop" className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gold-500 text-white text-xs font-medium tracking-widest uppercase hover:bg-gold-600 transition-colors">
                Shop Gifts <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href="/categories" className="inline-flex items-center justify-center gap-2 px-8 py-4 border-2 border-white/30 text-white text-xs font-medium tracking-widest uppercase hover:border-gold-400 hover:text-gold-400 transition-colors">
                View Categories
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Gift, title: "Gift Wrapping", desc: "Premium packaging included" },
              { icon: Truck, title: "Nationwide Delivery", desc: "All cities across Pakistan" },
              { icon: Shield, title: "Cash on Delivery", desc: "Pay when you receive" },
              { icon: Star, title: "Premium Quality", desc: "Curated luxury gifts" },
            ].map((f) => (
              <div key={f.title} className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gold-50 flex items-center justify-center flex-shrink-0">
                  <f.icon className="w-5 h-5 text-gold-600" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-navy-800 tracking-wider uppercase">{f.title}</div>
                  <div className="text-xs text-gray-500 mt-0.5">{f.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      {categories.length > 0 && (
        <section className="py-16 lg:py-24 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <div className="flex items-center justify-center gap-3 mb-3">
                <div className="h-px w-8 bg-gold-500" />
                <span className="text-gold-600 text-xs tracking-[0.3em] uppercase font-medium">Collections</span>
                <div className="h-px w-8 bg-gold-500" />
              </div>
              <h2 className="font-serif text-3xl lg:text-4xl font-bold text-navy-900">Shop by Category</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 lg:gap-6">
              {categories.slice(0, 6).map((cat) => (
                <Link key={cat.id} href={`/categories/${cat.slug}`} className="group relative bg-white border border-gray-100 p-6 hover:border-gold-300 hover:shadow-md transition-all duration-300">
                  {cat.imageUrl ? (
                    <div className="aspect-square mb-4 overflow-hidden bg-gray-50">
                      <Image src={cat.imageUrl} alt={cat.name} width={300} height={300} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-400" />
                    </div>
                  ) : (
                    <div className="aspect-square mb-4 bg-gold-50 flex items-center justify-center">
                      <Gift className="w-12 h-12 text-gold-300" />
                    </div>
                  )}
                  <h3 className="font-medium text-navy-800 tracking-wider text-sm uppercase mb-1 group-hover:text-gold-600 transition-colors">{cat.name}</h3>
                  <div className="mt-3 flex items-center gap-1 text-gold-600 text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                    Shop Now <ArrowRight className="w-3 h-3" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Featured Products */}
      {featuredProducts.length > 0 && (
        <section className="py-16 lg:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-end justify-between mb-12">
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="h-px w-8 bg-gold-500" />
                  <span className="text-gold-600 text-xs tracking-[0.3em] uppercase font-medium">New Arrivals</span>
                </div>
                <h2 className="font-serif text-3xl lg:text-4xl font-bold text-navy-900">Featured Gifts</h2>
              </div>
              <Link href="/shop" className="hidden sm:flex items-center gap-2 text-xs font-medium tracking-widest uppercase text-gold-600 hover:text-gold-700 transition-colors">
                View All <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
              {featuredProducts.map((product) => {
                const image = product.images[0];
                const sp = parseFloat(String(product.sellPrice));
                const disc = parseFloat(String(product.discount));
                const finalPrice = disc > 0 ? sp - (sp * disc) / 100 : sp;
                return (
                  <Link key={product.id} href={`/products/${product.slug}`} className="group">
                    <div className="relative aspect-square overflow-hidden bg-gray-50 mb-3">
                      {image ? (
                        <Image src={image.url} alt={product.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center"><Gift className="w-12 h-12 text-gray-300" /></div>
                      )}
                      {disc > 0 && <div className="absolute top-2 left-2 bg-gold-500 text-white text-[10px] font-bold px-2 py-1 tracking-wider">-{disc}%</div>}
                    </div>
                    <div>
                      {product.brand && <div className="text-[10px] tracking-widest text-gray-400 uppercase mb-0.5">{product.brand}</div>}
                      <h3 className="text-sm font-medium text-navy-800 line-clamp-2 group-hover:text-gold-600 transition-colors leading-snug">{product.name}</h3>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-sm font-semibold text-navy-900">Rs. {finalPrice.toLocaleString("en-PK")}</span>
                        {disc > 0 && <span className="text-xs text-gray-400 line-through">Rs. {sp.toLocaleString("en-PK")}</span>}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {featuredProducts.length === 0 && categories.length === 0 && (
        <section className="py-24 text-center">
          <Gift className="w-16 h-16 text-gold-300 mx-auto mb-4" />
          <h2 className="font-serif text-2xl font-bold text-navy-800 mb-3">Store Coming Soon</h2>
          <p className="text-gray-500 text-sm">Our curated collection is being prepared. Check back soon!</p>
        </section>
      )}

      {/* Custom Gift Banner */}
      <section className="py-14 bg-white border-y border-gray-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 p-8 bg-navy-50 border border-navy-100">
            <div className="text-center md:text-left">
              <div className="text-gold-600 text-xs tracking-[0.3em] uppercase font-medium mb-2">✨ Can&apos;t find what you need?</div>
              <h2 className="font-serif text-2xl font-bold text-navy-900 mb-2">Order Any Gift on Demand</h2>
              <p className="text-gray-500 text-sm max-w-md">
                Tell us what you want — perfume, chocolates, a custom hamper, anything — and we&apos;ll source it, wrap it and deliver it for you.
              </p>
            </div>
            <div className="flex-shrink-0">
              <Link href="/custom-gift"
                className="inline-flex items-center gap-2 px-8 py-4 bg-gold-500 text-white text-xs font-medium tracking-widest uppercase hover:bg-gold-600 transition-colors whitespace-nowrap">
                🎁 Request a Custom Gift
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-navy-800 py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <Gift className="w-8 h-8 text-gold-400 mx-auto mb-4" />
          <h2 className="font-serif text-3xl lg:text-4xl font-bold text-white mb-4">Send a Gift Across Pakistan</h2>
          <p className="text-gray-300 mb-8 max-w-xl mx-auto">You choose the gift. You write the message. We deliver the surprise — anywhere in Pakistan.</p>
          <Link href="/shop" className="inline-flex items-center gap-2 px-10 py-4 bg-gold-500 text-white text-xs font-medium tracking-widest uppercase hover:bg-gold-600 transition-colors">
            Start Gifting <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}

// The exports above are fine — the content below is appended to the JSX
