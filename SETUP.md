# Sparks Gifts — Setup & Deployment Guide

## What You Need (All Free)
- **Supabase** account → database + image storage (supabase.com)
- **Vercel** account → hosting (vercel.com)
- **GitHub** account → to connect Vercel (github.com)

---

## STEP 1 — Create Supabase Project

1. Go to **supabase.com** → New Project
2. Name it `sparks-gifts`, choose a strong password, pick a region (closest to Pakistan = Asia)
3. Wait ~2 minutes for it to start

---

## STEP 2 — Set Up the Database

1. In Supabase, click **SQL Editor** in the left sidebar
2. Click **New Query**
3. Copy everything from `drizzle/0001_init.sql` → paste → click **Run**
4. Click **New Query** again
5. Copy everything from `drizzle/0002_seed.sql` → paste → click **Run**

This creates all tables and your first admin login.

---

## STEP 3 — Set Up Image Storage (Supabase)

1. In Supabase, click **Storage** in the left sidebar
2. Click **New Bucket**
3. Name it exactly: `product-images`
4. Make it **Public** (toggle ON)
5. Click Create

---

## STEP 4 — Get Your Credentials

In Supabase go to **Settings → API**:

| What you need | Where to find it |
|---|---|
| `DATABASE_URL` | Settings → Database → Connection String → URI (use "Transaction" mode) |
| `NEXT_PUBLIC_SUPABASE_URL` | Settings → API → Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Settings → API → anon / public key |
| `SUPABASE_SERVICE_ROLE_KEY` | Settings → API → service_role key (keep secret!) |

---

## STEP 5 — Push Code to GitHub

On your computer, open a terminal in the `sparks-gifts` folder:

```bash
git init
git add .
git commit -m "Initial commit - Sparks Gifts"
```

Then create a new repo on GitHub and push:

```bash
git remote add origin https://github.com/YOUR_USERNAME/sparks-gifts.git
git push -u origin main
```

---

## STEP 6 — Deploy on Vercel

1. Go to **vercel.com** → New Project
2. Import your GitHub repo
3. Vercel auto-detects Next.js — click **Deploy**
4. Before deploying, click **Environment Variables** and add:

```
DATABASE_URL         = postgresql://postgres:YOUR_PASS@db.XXXX.supabase.co:5432/postgres
AUTH_SECRET          = (any random 32+ character string)
NEXT_PUBLIC_SUPABASE_URL     = https://XXXX.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY = eyJ...
SUPABASE_SERVICE_ROLE_KEY    = eyJ...
NEXT_PUBLIC_APP_URL  = https://your-app.vercel.app
```

5. Click **Deploy** → wait ~2 minutes

---

## STEP 7 — First Login

Once deployed, go to:
```
https://your-app.vercel.app/admin/login
```

**Default credentials:**
- Email: `admin@sparksgifts.pk`
- Password: `admin123`

⚠️ **Change your password immediately** via Settings after first login!

---

## STEP 8 — Add Your First Products

1. Go to Admin → **Categories** → confirm your categories are there
2. Go to Admin → **Products** → click **Add Product**
3. Fill in name, price, cost price, category
4. Upload product images
5. Click **Create Product**

Your product is now live on the store! 🎉

---

## Local Development (Optional)

To run locally on your computer:

```bash
# 1. Install dependencies
npm install

# 2. Create .env.local file with your credentials (copy .env.example)
cp .env.example .env.local
# Then fill in your real values

# 3. Run development server
npm run dev

# 4. Open in browser
# http://localhost:3000        → Customer store
# http://localhost:3000/admin  → Admin panel
```

---

## Important Notes

- **Cost prices** are never shown to customers — only visible in admin
- **Profit** is calculated automatically in the admin dashboard
- **Order numbers** are auto-generated (e.g. SG123456789)
- **Images** are stored on Supabase Storage — no code changes needed to add/remove products
- **WhatsApp** button links to 0300-143-2502 by default — change in Admin → Settings

---

## Support

For any issues during setup, WhatsApp: 0300-143-2502
