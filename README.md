# Smart Bookmark App

Smart Bookmark App is a real-time bookmark manager built using Next.js (App Router) and Supabase. It allows users to sign in with Google, save private bookmarks, edit them inline, and see changes reflected instantly across multiple tabs.

Live URL:
https://smart-bookmark-app-gamma-seven.vercel.app

Features:
Users can sign in using Google OAuth (Supabase Auth).
Each user’s bookmarks are private using Row Level Security (RLS).
Users can add bookmarks with a title and URL.
URLs are automatically normalized (https:// added if missing).
Users can edit bookmarks inline.
Users can delete bookmarks.
Copy-to-clipboard functionality is available.
Favicon preview is displayed for each bookmark.
Real-time updates work for add, edit, and delete across multiple tabs.
The UI uses a premium dark theme inspired by Notion and Linear.

Tech Stack:
Next.js 14 (App Router)
TypeScript
Tailwind CSS
Framer Motion
React Hot Toast
Supabase (PostgreSQL, Auth, Realtime)
Vercel (Deployment)

Database Schema:

create table bookmarks (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users not null,
  title text not null,
  url text not null,
  created_at timestamp with time zone default now()
);

Row Level Security is enabled so users can only access their own bookmarks. Replica identity is set to FULL to ensure realtime DELETE events work properly.

Local Setup:

1. Clone the repository:
   git clone https://github.com/dsingla2701/smart-bookmark-app.git
   cd smart-bookmark-app

2. Install dependencies:
   npm install

3. Create a .env.local file with:
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

4. Run locally:
   npm run dev

Problems Faced:

During production deployment, OAuth initially redirected back to the login page due to incorrect Supabase Site URL configuration. This was fixed by properly setting the Vercel domain in Supabase Authentication settings and clearing browser storage.

Realtime delete did not work initially because replica identity was not set to FULL. This was resolved using:
   alter table bookmarks replica identity full;

This project demonstrates authentication handling, secure database policies, realtime systems integration, production debugging, and UI/UX refinement in a full-stack SaaS-style application.
