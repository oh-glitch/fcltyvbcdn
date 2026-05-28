# Supabase setup (beginner guide)

Follow these steps once to enable PDF uploads.

## Step 1: Create a Supabase project

1. Go to [https://supabase.com](https://supabase.com) and sign in.
2. Click **New project**.
3. Pick a name, password, and region → **Create project**.

## Step 2: Copy API keys to `.env.local`

1. In Supabase: **Project Settings** → **API**.
2. Copy into `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

> **Important:** `SUPABASE_SERVICE_ROLE_KEY` is secret. Never put it in client code or commit it to Git.

## Step 3: Create the database tables

1. Open **SQL Editor** in Supabase.
2. Paste the contents of `supabase/schema.sql` → **Run**.
3. Paste the contents of `supabase/schema-chunks.sql` → **Run** (text chunks).
4. Paste the contents of `supabase/schema-rag.sql` → **Run** (pgvector + semantic search).

## Step 4: Create the Storage bucket

1. Open **Storage** → **New bucket**.
2. Name: `documents`
3. **Public bucket:** OFF (private)
4. Create the bucket.
5. (Optional) Under bucket settings, restrict MIME type to `application/pdf` and max size to 10 MB.

## Step 5: Restart Next.js

```bash
npm run dev
```

Open [http://localhost:3000/documents](http://localhost:3000/documents) and upload a PDF.
