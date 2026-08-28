import { db } from "@/db";
import { eq, desc, asc, and, gt, lt, gte, lte, or, ilike, ne, inArray, sql } from "drizzle-orm";
import {
  products, productImages, categories, orders, orderItems, storeSettings, admins
} from "@/db/schema";

// ── CATEGORIES ──────────────────────────────────────────────────────────────

export async function getActiveCategories() {
  return db.select().from(categories).where(eq(categories.isActive, true)).orderBy(asc(categories.sortOrder));
}

export async function getAllCategories() {
  const cats = await db.select().from(categories).orderBy(asc(categories.sortOrder));
  // get product counts
  const counts = await db
    .select({ categoryId: products.categoryId, count: sql<number>`count(*)::int` })
    .from(products)
    .where(eq(products.isActive, true))
    .groupBy(products.categoryId);
  const countMap = Object.fromEntries(counts.map((c) => [c.categoryId, c.count]));
  return cats.map((c) => ({ ...c, _count: { products: countMap[c.id] ?? 0 } }));
}

export async function getCategoryBySlug(slug: string) {
  const [cat] = await db.select().from(categories).where(and(eq(categories.slug, slug), eq(categories.isActive, true)));
  return cat ?? null;
}

export async function getCategoryById(id: string) {
  const [cat] = await db.select().from(categories).where(eq(categories.id, id));
  return cat ?? null;
}

// ── PRODUCTS ─────────────────────────────────────────────────────────────────

export async function getProductsWithImages(opts?: {
  isActive?: boolean; categorySlug?: string; limit?: number;
  sortBy?: string; minPrice?: number; maxPrice?: number; search?: string;
}) {
  const conditions = [];
  if (opts?.isActive !== undefined) conditions.push(eq(products.isActive, opts.isActive));
  if (opts?.minPrice !== undefined) conditions.push(gte(products.sellPrice, String(opts.minPrice)));
  if (opts?.maxPrice !== undefined) conditions.push(lte(products.sellPrice, String(opts.maxPrice)));
  if (opts?.search) {
    const q = `%${opts.search}%`;
    conditions.push(or(ilike(products.name, q), ilike(products.brand, q), ilike(products.description, q)));
  }

  let prods = await db.select().from(products)
    .leftJoin(categories, eq(products.categoryId, categories.id))
    .where(conditions.length ? and(...conditions) : undefined)
    .orderBy(
      opts?.sortBy === "price-asc" ? asc(products.sellPrice) :
      opts?.sortBy === "price-desc" ? desc(products.sellPrice) :
      opts?.sortBy === "name-asc" ? asc(products.name) :
      desc(products.createdAt)
    )
    .limit(opts?.limit ?? 1000);

  if (opts?.categorySlug) {
    prods = prods.filter((p) => p.categories?.slug === opts.categorySlug);
  }

  const productIds = prods.map((p) => p.products.id);
  const images = productIds.length
    ? await db.select().from(productImages).where(inArray(productImages.productId, productIds)).orderBy(asc(productImages.sortOrder))
    : [];

  return prods.map(({ products: p, categories: c }) => ({
    ...p,
    category: c,
    images: images.filter((img) => img.productId === p.id),
  }));
}

export async function getProductBySlug(slug: string) {
  const [row] = await db.select().from(products)
    .leftJoin(categories, eq(products.categoryId, categories.id))
    .where(and(eq(products.slug, slug), eq(products.isActive, true)));
  if (!row) return null;
  const imgs = await db.select().from(productImages)
    .where(eq(productImages.productId, row.products.id)).orderBy(asc(productImages.sortOrder));
  return { ...row.products, category: row.categories, images: imgs };
}

export async function getProductById(id: string) {
  const [row] = await db.select().from(products)
    .leftJoin(categories, eq(products.categoryId, categories.id))
    .where(eq(products.id, id));
  if (!row) return null;
  const imgs = await db.select().from(productImages)
    .where(eq(productImages.productId, id)).orderBy(asc(productImages.sortOrder));
  return { ...row.products, category: row.categories, images: imgs };
}

export async function getAdminProducts() {
  const prods = await db.select().from(products)
    .leftJoin(categories, eq(products.categoryId, categories.id))
    .orderBy(desc(products.createdAt));
  const productIds = prods.map((p) => p.products.id);
  const images = productIds.length
    ? await db.select().from(productImages).where(inArray(productImages.productId, productIds)).orderBy(asc(productImages.sortOrder))
    : [];
  return prods.map(({ products: p, categories: c }) => ({
    ...p, category: c, images: images.filter((img) => img.productId === p.id),
  }));
}

// ── ORDERS ───────────────────────────────────────────────────────────────────

export async function getOrderByNumber(orderNumber: string) {
  const [order] = await db.select().from(orders).where(eq(orders.orderNumber, orderNumber));
  if (!order) return null;
  const items = await db.select().from(orderItems).where(eq(orderItems.orderId, order.id));
  return { ...order, items };
}

export async function getOrderById(id: string) {
  const [order] = await db.select().from(orders).where(eq(orders.id, id));
  if (!order) return null;
  const items = await db.select().from(orderItems)
    .leftJoin(products, eq(orderItems.productId, products.id))
    .where(eq(orderItems.orderId, id));
  const imgs = items.length
    ? await db.select().from(productImages)
        .where(inArray(productImages.productId, items.map((i) => i.products?.id).filter(Boolean) as string[]))
        .orderBy(asc(productImages.sortOrder))
    : [];
  return {
    ...order,
    items: items.map(({ order_items: oi, products: p }) => ({
      ...oi,
      product: p ? { ...p, images: imgs.filter((img) => img.productId === p.id) } : null,
    })),
  };
}

export async function getAdminOrders(opts?: { status?: string; limit?: number; offset?: number }) {
  const where = opts?.status ? eq(orders.status, opts.status as "PENDING") : undefined;
  const [orderList, total] = await Promise.all([
    db.select().from(orders).where(where)
      .orderBy(desc(orders.createdAt))
      .limit(opts?.limit ?? 20).offset(opts?.offset ?? 0),
    db.select({ count: sql<number>`count(*)::int` }).from(orders).where(where),
  ]);
  const ids = orderList.map((o) => o.id);
  const items = ids.length ? await db.select().from(orderItems).where(inArray(orderItems.orderId, ids)) : [];
  return {
    orders: orderList.map((o) => ({ ...o, items: items.filter((i) => i.orderId === o.id) })),
    total: total[0]?.count ?? 0,
  };
}

// ── SETTINGS ─────────────────────────────────────────────────────────────────

export async function getSettingsMap(): Promise<Record<string, string>> {
  const rows = await db.select().from(storeSettings);
  return Object.fromEntries(rows.map((r) => [r.key, r.value]));
}

export async function upsertSetting(key: string, value: string) {
  await db.insert(storeSettings).values({ key, value, updatedAt: new Date() })
    .onConflictDoUpdate({ target: storeSettings.key, set: { value, updatedAt: new Date() } });
}

// ── ADMIN ─────────────────────────────────────────────────────────────────────

export async function getAdminByEmail(email: string) {
  const [admin] = await db.select().from(admins).where(eq(admins.email, email));
  return admin ?? null;
}

// ── DASHBOARD ─────────────────────────────────────────────────────────────────

export async function getDashboardStats() {
  const [
    productCount, orderCount, pendingCount, categoryCount, recentOrders,
  ] = await Promise.all([
    db.select({ count: sql<number>`count(*)::int` }).from(products).where(eq(products.isActive, true)),
    db.select({ count: sql<number>`count(*)::int` }).from(orders),
    db.select({ count: sql<number>`count(*)::int` }).from(orders).where(eq(orders.status, "PENDING")),
    db.select({ count: sql<number>`count(*)::int` }).from(categories).where(eq(categories.isActive, true)),
    db.select().from(orders).orderBy(desc(orders.createdAt)).limit(5),
  ]);

  const deliveredOrders = await db.select().from(orders)
    .where(or(eq(orders.status, "DELIVERED"), eq(orders.status, "SHIPPED")));
  const deliveredIds = deliveredOrders.map((o) => o.id);
  const deliveredItems = deliveredIds.length
    ? await db.select().from(orderItems).where(inArray(orderItems.orderId, deliveredIds))
    : [];

  const revenue = deliveredOrders.reduce((s, o) => s + parseFloat(String(o.total)), 0);
  const profit = deliveredItems.reduce((s, i) =>
    s + (parseFloat(String(i.price)) - parseFloat(String(i.costPrice))) * i.quantity, 0);

  return {
    totalProducts: productCount[0]?.count ?? 0,
    totalOrders: orderCount[0]?.count ?? 0,
    pendingOrders: pendingCount[0]?.count ?? 0,
    totalCategories: categoryCount[0]?.count ?? 0,
    recentOrders,
    revenue,
    profit,
  };
}
