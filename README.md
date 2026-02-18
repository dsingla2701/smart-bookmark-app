# Smart Bookmark App

Smart Bookmark App is a real-time bookmark manager built using Next.js (App Router) and Supabase. It allows users to securely sign in with Google, save private bookmarks, edit them inline, and see updates reflected instantly across multiple tabs without refreshing the page.

Live URL:
https://smart-bookmark-app-gamma-seven.vercel.app

Overview:

This application was built as a full-stack SaaS-style project demonstrating authentication, database security, realtime updates, and production deployment. Each user has their own private bookmark space enforced using Supabase Row Level Security (RLS). All CRUD operations (Create, Read, Update, Delete) are implemented with realtime synchronization.

Core Features:

- Google OAuth authentication using Supabase Auth
- Secure per-user data isolation using Row Level Security (RLS)
- Add bookmarks with title and URL
- Automatic URL normalization (adds https:// if missing)
- Inline editing of bookmarks
- Delete functionality with realtime sync
- Copy-to-clipboard feature
- Favicon preview for saved links
- Real-time updates across multiple tabs (INSERT, UPDATE, DELETE)
- Premium dark UI inspired by Notion and Linear
- Smooth animations using Framer Motion
- Toast notifications for user feedback

How Realtime Works:

Supabase Realtime subscriptions listen to INSERT, UPDATE, and DELETE events on the bookmarks table. When any change occurs, the local state updates immediately without refetching the entire list. Replica identity is set to FULL to ensure DELETE events broadcast properly.

Tech Stack:

Frontend:
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Framer Motion
- React Hot Toast

Backend / Infrastructure:
- Supabase PostgreSQL
- Supabase Auth (Google OAuth)
- Supabase Realtime
- Row Level Security (RLS)

Deployment:
- Vercel

Database Schema:

create table bookmarks (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users not null,
  title text not null,
  url text not null,
  created_at timestamp with time zone default now()
);

Security:

Row Level Security is enabled on the bookmarks table. Policies ensure:
- Users can only view their own bookmarks
- Users can only insert their own bookmarks
- Users can only update their own bookmarks
- Users can only delete their own bookmarks

To support realtime DELETE events:
   alter table bookmarks replica identity full;

Local Development Setup:

1. Clone the repository:
   git clone https://github.com/dsingla2701/smart-bookmark-app.git
   cd smart-bookmark-app

2. Install dependencies:
   npm install

3. Create a .env.local file:
   NEXT_PUBLIC_SUPABASE_URL: https://pfwgomuvrpaxzaswzutv.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBmd2dvbXV2cnBheHphc3d6dXR2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEyNTAxMTIsImV4cCI6MjA4NjgyNjExMn0.KZYA3FDFXP43qkaa6y74iusjKyL36g7x0AMQFJqkfUA

4. Start development server:
   npm run dev

Production Deployment Notes:

- Supabase Site URL must match the Vercel domain exactly
- Vercel environment variables must include Supabase keys
- Google Cloud OAuth must include Supabase callback URL
- Browser storage may need clearing during OAuth testing
- Replica identity must be set to FULL for proper DELETE sync

Challenges Faced:

1. OAuth redirect loop in production due to incorrect Supabase Site URL configuration. Fixed by properly configuring authentication settings and using correct redirect URLs.

2. Realtime DELETE events not syncing across tabs because replica identity was not set to FULL. Resolved by updating the database configuration.

3. URL constructor crash when users entered domains without protocol (e.g., google.com). Fixed by normalizing URLs and validating input before saving.

4. Session hydration timing issue with Next.js App Router after OAuth redirect. Resolved by properly handling session detection using getSession().

What This Project Demonstrates:

- Secure OAuth integration
- Fine-grained database security using RLS
- Real-time client state synchronization
- Production debugging and deployment
- Full CRUD implementation
- Clean and modern UI design
- End-to-end SaaS architecture

Author:
Deepak Singla
