export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  imageUrl?: string | null;
  isActive: boolean;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
  _count?: { products: number };
}

export interface ProductImage {
  id: string;
  productId: string;
  url: string;
  altText?: string | null;
  sortOrder: number;
  createdAt: Date;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  brand?: string | null;
  description?: string | null;
  sku?: string | null;
  costPrice: number;
  sellPrice: number;
  discount: number;
  stock: number;
  isActive: boolean;
  categoryId: string;
  category?: Category;
  images: ProductImage[];
  createdAt: Date;
  updatedAt: Date;
}

export interface CartItem {
  id: string;
  name: string;
  slug: string;
  brand?: string | null;
  sellPrice: number;
  discount: number;
  quantity: number;
  imageUrl?: string;
  stock: number;
}

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  name: string;
  price: number;
  costPrice: number;
  quantity: number;
  imageUrl?: string | null;
  product?: Product;
}

export type OrderStatus =
  | "PENDING"
  | "PROCESSING"
  | "GIFT_WRAPPED"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELLED";

export interface Order {
  id: string;
  orderNumber: string;
  status: OrderStatus;
  senderName: string;
  senderPhone: string;
  senderEmail?: string | null;
  recipientName: string;
  recipientPhone: string;
  recipientCity: string;
  recipientAddress: string;
  giftMessage?: string | null;
  giftWrapping: boolean;
  deliveryCharge: number;
  wrappingCharge: number;
  subtotal: number;
  total: number;
  paymentMethod: string;
  notes?: string | null;
  items: OrderItem[];
  createdAt: Date;
  updatedAt: Date;
}

export interface CheckoutFormData {
  senderName: string;
  senderPhone: string;
  senderEmail?: string;
  recipientName: string;
  recipientPhone: string;
  recipientCity: string;
  recipientAddress: string;
  giftMessage?: string;
  giftWrapping: boolean;
  deliveryOption: string;
}

export interface StoreSettings {
  storeName: string;
  logo?: string;
  tagline?: string;
  email?: string;
  phone?: string;
  whatsapp?: string;
  address?: string;
  facebook?: string;
  instagram?: string;
  twitter?: string;
  deliveryCharge: number;
  wrappingCharge: number;
  codAvailable: boolean;
  checkoutEmailEnabled: boolean;
  checkoutEmailRequired: boolean;
  heroTitle?: string;
  heroSubtitle?: string;
}
