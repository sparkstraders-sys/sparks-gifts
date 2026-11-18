# Sparks Gifts – Complete Package (v3)

Is zip mein DO alag projects hain. Dono ek hi Supabase database use karte hain.

    store/   -> Customer website (sab log dekhte hain)
    admin/   -> Admin panel + CMS (sirf aap)

## Kaun si cheez kahan
| Cheez | Store | Admin |
|---|---|---|
| Home, Shop, Cart, Checkout, Track, About, Contact | YES | |
| Products / Categories / Orders / Customers manage | | YES |
| Website Content (CMS), Settings, Password | | YES |
| Admin login (NextAuth) | | YES |
| Image upload (Supabase service key) | | YES |

## Vercel Environment Variables
STORE project: sirf `DATABASE_URL` chahiye (purani extra variables rehne do, masla nahi).
ADMIN project: DATABASE_URL, AUTH_SECRET, NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY,
SUPABASE_SERVICE_ROLE_KEY, NEXT_PUBLIC_STORE_URL (store ka link).
Dono ke liye Install Command: `npm install --legacy-peer-deps`

## Supabase
Pehle se chal raha hai to bas ek SQL (agar nahi chalayi): drizzle/0003_custom_request_payment.sql  (store/drizzle folder mein)

## Admin ka link
https://<admin-project>.vercel.app/admin/login
