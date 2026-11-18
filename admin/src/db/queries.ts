import { db } from "@/db";
import { eq, desc, asc, and, gte, lte, or, ilike, ne, inArray, sql } from "drizzle-orm";
import { products, productImages, categories, orders, orderItems, storeSettings, admins, customRequests } from "@/db/schema";

export async function getActiveCategories() { return db.select().from(categories).where(eq(categories.isActive, true)).orderBy(asc(categories.sortOrder)).catch(() => []); }

export async function getAllCategories() {
  const cats = await db.select().from(categories).orderBy(asc(categories.sortOrder));
  const counts = await db.select({ categoryId: products.categoryId, count: sql<number>`count(*)::int` }).from(products).where(eq(products.isActive, true)).groupBy(products.categoryId);
  const map = Object.fromEntries(counts.map(c => [c.categoryId, c.count]));
  return cats.map(c => ({ ...c, _count: { products: map[c.id] ?? 0 } }));
}

export async function getCategoryBySlug(slug: string) { const [c] = await db.select().from(categories).where(and(eq(categories.slug, slug), eq(categories.isActive, true))); return c ?? null; }

export async function getProductsWithImages(opts?: { isActive?: boolean; categorySlug?: string; limit?: number; sortBy?: string; minPrice?: number; maxPrice?: number; search?: string; featured?: boolean; }) {
  const conds = [];
  if (opts?.isActive !== undefined) conds.push(eq(products.isActive, opts.isActive));
  if (opts?.featured) conds.push(eq(products.isFeatured, true));
  if (opts?.minPrice !== undefined) conds.push(gte(products.sellPrice, String(opts.minPrice)));
  if (opts?.maxPrice !== undefined) conds.push(lte(products.sellPrice, String(opts.maxPrice)));
  if (opts?.search) { const q = `%${opts.search}%`; conds.push(or(ilike(products.name, q), ilike(products.brand, q), ilike(products.description, q))); }
  let prods = await db.select().from(products).leftJoin(categories, eq(products.categoryId, categories.id)).where(conds.length ? and(...conds) : undefined).orderBy(opts?.sortBy === "price-asc" ? asc(products.sellPrice) : opts?.sortBy === "price-desc" ? desc(products.sellPrice) : opts?.sortBy === "name-asc" ? asc(products.name) : desc(products.createdAt)).limit(opts?.limit ?? 1000);
  if (opts?.categorySlug) prods = prods.filter(p => p.categories?.slug === opts.categorySlug);
  const ids = prods.map(p => p.products.id);
  const imgs = ids.length ? await db.select().from(productImages).where(inArray(productImages.productId, ids)).orderBy(asc(productImages.sortOrder)) : [];
  return prods.map(({ products: p, categories: c }) => ({ ...p, category: c, images: imgs.filter(i => i.productId === p.id) }));
}

export async function getProductBySlug(slug: string) {
  const [row] = await db.select().from(products).leftJoin(categories, eq(products.categoryId, categories.id)).where(and(eq(products.slug, slug), eq(products.isActive, true)));
  if (!row) return null;
  const imgs = await db.select().from(productImages).where(eq(productImages.productId, row.products.id)).orderBy(asc(productImages.sortOrder));
  return { ...row.products, category: row.categories, images: imgs };
}

export async function getAdminProducts() {
  const prods = await db.select().from(products).leftJoin(categories, eq(products.categoryId, categories.id)).orderBy(desc(products.createdAt));
  const ids = prods.map(p => p.products.id);
  const imgs = ids.length ? await db.select().from(productImages).where(inArray(productImages.productId, ids)).orderBy(asc(productImages.sortOrder)) : [];
  return prods.map(({ products: p, categories: c }) => ({ ...p, category: c, images: imgs.filter(i => i.productId === p.id) }));
}

export async function getOrderByNumber(orderNumber: string) {
  const [order] = await db.select().from(orders).where(eq(orders.orderNumber, orderNumber));
  if (!order) return null;
  const items = await db.select().from(orderItems).where(eq(orderItems.orderId, order.id));
  return { ...order, items };
}

export async function getOrderById(id: string) {
  const [order] = await db.select().from(orders).where(eq(orders.id, id));
  if (!order) return null;
  const items = await db.select().from(orderItems).leftJoin(products, eq(orderItems.productId, products.id)).where(eq(orderItems.orderId, id));
  const pids = items.map(i => i.products?.id).filter(Boolean) as string[];
  const imgs = pids.length ? await db.select().from(productImages).where(inArray(productImages.productId, pids)).orderBy(asc(productImages.sortOrder)) : [];
  return { ...order, items: items.map(({ order_items: oi, products: p }) => ({ ...oi, product: p ? { ...p, images: imgs.filter(i => i.productId === p.id) } : null })) };
}

export async function getAdminOrders(opts?: { status?: string; limit?: number; offset?: number }) {
  const where = opts?.status ? eq(orders.status, opts.status as "PENDING") : undefined;
  const [list, total] = await Promise.all([
    db.select().from(orders).where(where).orderBy(desc(orders.createdAt)).limit(opts?.limit ?? 20).offset(opts?.offset ?? 0),
    db.select({ count: sql<number>`count(*)::int` }).from(orders).where(where),
  ]);
  const ids = list.map(o => o.id);
  const items = ids.length ? await db.select().from(orderItems).where(inArray(orderItems.orderId, ids)) : [];
  return { orders: list.map(o => ({ ...o, items: items.filter(i => i.orderId === o.id) })), total: total[0]?.count ?? 0 };
}

export async function getSettingsMap(): Promise<Record<string, string>> { const rows = await db.select().from(storeSettings); return Object.fromEntries(rows.map(r => [r.key, r.value])); }
export async function upsertSetting(key: string, value: string) { await db.insert(storeSettings).values({ key, value, updatedAt: new Date() }).onConflictDoUpdate({ target: storeSettings.key, set: { value, updatedAt: new Date() } }); }
export async function getAdminByEmail(email: string) { const [a] = await db.select().from(admins).where(eq(admins.email, email)); return a ?? null; }

export async function getDashboardStats() {
  const [pc, oc, pend, cc, recent] = await Promise.all([
    db.select({ count: sql<number>`count(*)::int` }).from(products).where(eq(products.isActive, true)),
    db.select({ count: sql<number>`count(*)::int` }).from(orders),
    db.select({ count: sql<number>`count(*)::int` }).from(orders).where(eq(orders.status, "PENDING")),
    db.select({ count: sql<number>`count(*)::int` }).from(categories).where(eq(categories.isActive, true)),
    db.select().from(orders).orderBy(desc(orders.createdAt)).limit(5),
  ]);
  const delivered = await db.select().from(orders).where(or(eq(orders.status, "DELIVERED"), eq(orders.status, "SHIPPED")));
  const dids = delivered.map(o => o.id);
  const ditems = dids.length ? await db.select().from(orderItems).where(inArray(orderItems.orderId, dids)) : [];
  const revenue = delivered.reduce((s, o) => s + parseFloat(String(o.total)), 0);
  const profit = ditems.reduce((s, i) => s + (parseFloat(String(i.price)) - parseFloat(String(i.costPrice))) * i.quantity, 0);
  return { totalProducts: pc[0]?.count ?? 0, totalOrders: oc[0]?.count ?? 0, pendingOrders: pend[0]?.count ?? 0, totalCategories: cc[0]?.count ?? 0, recentOrders: recent, revenue, profit };
}

export async function getCustomers() {
  const rows = await db.select({
    phone: orders.senderPhone,
    name: sql<string>`max(${orders.senderName})`,
    email: sql<string | null>`max(${orders.senderEmail})`,
    orders: sql<number>`count(*)::int`,
    spent: sql<string>`coalesce(sum(case when ${orders.status} <> 'CANCELLED' then ${orders.total} else 0 end),0)`,
    last: sql<string>`max(${orders.createdAt})`,
  }).from(orders).groupBy(orders.senderPhone).orderBy(desc(sql`max(${orders.createdAt})`));
  return rows;
}
