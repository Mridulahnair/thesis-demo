# Supabase Integration Setup

This app now uses Supabase as the database instead of hardcoded mock data. Follow these steps to set it up:

## 1. Create a Supabase Project

1. Go to [app.supabase.com](https://app.supabase.com)
2. Create a new account or sign in
3. Click "New project"
4. Choose your organization and fill in project details:
   - **Name**: knit-app (or any name you prefer)
   - **Database Password**: Choose a strong password
   - **Region**: Select closest to your users
5. Click "Create new project"

## 2. Get Your Project Credentials

1. Once your project is created, go to **Settings** > **API**
2. Copy the following values:
   - **Project URL** (looks like: `https://your-project-id.supabase.co`)
   - **Anon/public key** (starts with `eyJ...`)

## 3. Configure Environment Variables

1. In your project root, update the `.env.local` file:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_OR_ANON_KEY=your-anon-key-here
```

## 4. Set Up the Database

### Option A: Using Supabase Dashboard (Recommended)

1. Go to your Supabase project dashboard
2. Click **SQL Editor** in the left sidebar
3. Copy and paste the content from `supabase/migrations/001_initial_schema.sql`
4. Click **Run** to create all tables and policies

### Option B: Using Supabase CLI

1. Install the Supabase CLI: `npm install -g @supabase/cli`
2. Run: `supabase db reset --db-url "your-database-url"`

## 5. Seed Initial Data

1. In the SQL Editor, copy and paste the content from `supabase/seed.sql`
2. Click **Run** to insert the sample communities

## 6. Enable Row Level Security (RLS)

The migration script automatically sets up RLS policies, but verify in the dashboard:

1. Go to **Authentication** > **Policies**
2. Ensure you see policies for:
   - `communities` (publicly readable)
   - `profiles` (publicly readable, users can update own)
   - `posts` (publicly readable, authenticated users can create)
   - `community_members` (publicly readable, authenticated users can join)

## 7. Test the Integration

1. Start your development server: `npm run dev`
2. Visit `http://localhost:3000`
3. Navigate to `/communities` - you should see data loaded from Supabase
4. Check the browser console for any errors

## Features Now Working with Supabase

✅ **Communities Page**: Loads communities from database with real member/post counts  
✅ **Search Page**: Searches through communities and user profiles  
✅ **Individual Community Pages**: Shows real posts and members  
✅ **Post Creation**: Creates new posts in the database  
🔄 **User Profiles**: Requires authentication setup (coming next)  
🔄 **Community Joining**: Requires authentication setup  

## Troubleshooting

### "Failed to load communities" Error
- Check your environment variables are correct
- Verify the Supabase project is active
- Check the browser network tab for API errors

### "Row Level Security" Errors
- Ensure RLS policies are created (run the migration script)
- Check that anon users have read access to the tables

### Empty Data
- Run the seed script to add sample communities
- Check the Supabase dashboard **Table Editor** to see if data was inserted

## Next Steps

To complete the integration:
1. Set up Supabase Auth for user authentication
2. Connect user profiles to the auth system
3. Implement community joining functionality
4. Add real-time updates for posts and members

---

**Note**: Currently using placeholder user IDs for post creation. This will be replaced with real authentication in the next phase.