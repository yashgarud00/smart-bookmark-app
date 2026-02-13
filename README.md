# Smart Bookmark App

A clean, realtime personal bookmark manager built with **Next.js 14+ (App Router)**, **Supabase** (Auth + PostgreSQL + Realtime), and **Tailwind CSS**.  
Logged-in users can add, view, and delete their own bookmarks — with instant sync across browser tabs.

**Live demo** (if deployed): https://smart-bookmark-app.vercel.app (replace with your actual Vercel URL after deployment)

## Features

- Google OAuth login only (via Supabase Auth)
- Add new bookmark (title + URL)
- List only your own bookmarks
- Delete bookmarks
- **Realtime updates** across multiple open tabs/windows
- Responsive, minimal UI with loading states & error handling
- Row Level Security (users can only see/modify their own data)
- Deploy-ready for Vercel

## Tech Stack

- **Framework**: Next.js 16 (App Router) + TypeScript
- **Styling**: Tailwind CSS
- **Backend & Auth**: Supabase (PostgreSQL + Realtime + Google OAuth)
- **Deployment**: Vercel

## Project Structure
<img width="314" height="500" alt="image" src="https://github.com/user-attachments/assets/d0ba55b4-329c-4c10-a5fc-9894ec8a28fc" />

## Quick Start (Local)

1. Clone the repo
   ```bash
   git clone https://github.com/YOUR-GITHUB-USERNAME/smart-bookmark-app.git
   cd smart-bookmark-app
   
2. Install dependencies
     ```bash
     npm install
     or yarn install / pnpm install
   
3. Create .env.local in the root and fill your Supabase values:
   ```bash
   NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-public-key
   
4. Start development server
   npm run dev

→ Open http://localhost:3000


Supabase Setup (Do once)

1. Create new Supabase project
2. Enable Google provider → Authentication → Providers → Google
3. Run this SQL in Supabase → SQL Editor:
   -- Enable UUID extension
    CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
    
    -- Table
    CREATE TABLE bookmarks (
        id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        title       TEXT NOT NULL,
        url         TEXT NOT NULL,
        user_id     UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
        created_at  TIMESTAMPTZ DEFAULT NOW()
    );
    
    -- Security
    ALTER TABLE bookmarks ENABLE ROW LEVEL SECURITY;
    
    CREATE POLICY "Users can view own bookmarks"    ON bookmarks FOR SELECT   USING (auth.uid() = user_id);
    CREATE POLICY "Users can insert own bookmarks"  ON bookmarks FOR INSERT  WITH CHECK (auth.uid() = user_id);
    CREATE POLICY "Users can delete own bookmarks"  ON bookmarks FOR DELETE  USING (auth.uid() = user_id);
4. Enable Realtime → Database → Replication → Publications → Add bookmarks table
5. Add redirect URLs (Authentication → URL Configuration):
    http://localhost:3000/**
    https://*.vercel.app/** (or your specific domain later)

Deployment to Vercel

1. Push code to GitHub
2. https://vercel.com → New Project → Import Git Repository
3. Add Environment Variables:
    NEXT_PUBLIC_SUPABASE_URL
    NEXT_PUBLIC_SUPABASE_ANON_KEY
4. Deploy

After deployment → update Supabase redirect URLs with your real Vercel domain(s).

Challenges Faced & How I Solved Them
<img width="840" height="381" alt="image" src="https://github.com/user-attachments/assets/61bb8fda-61e9-42a7-b672-207fc3b4523b" />

Future Ideas

    Bookmark categories / tags
    Edit bookmark functionality
    Dark mode support
    Search/filter bookmarks
    Import from browser bookmarks (JSON)
    Export option


