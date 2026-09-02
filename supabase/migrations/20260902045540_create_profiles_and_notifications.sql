/*
# Create user profiles and risk notification tables

## Purpose
Supports the TerraGuard AI authentication and notification system.
When a user logs in, the system generates a notification for the
highest-risk zone and stores it so the user can view it in their
notification bell dropdown.

## 1. New Tables

### profiles
- `id` (uuid, primary key — matches auth.users.id)
- `full_name` (text, nullable — user's display name)
- `phone` (text, nullable — user's phone number)
- `role` (text, not null, default 'Citizen' — one of: Citizen, Field Officer, Authority)
- `created_at` (timestamptz, default now)

### notifications
- `id` (uuid, primary key)
- `user_id` (uuid, not null — references auth.users, defaults to auth.uid())
- `title` (text, not null — short alert title)
- `message` (text, not null — full alert message)
- `zone_name` (text, not null — which zone the alert is about)
- `risk_level` (text, not null — LOW / MODERATE / HIGH / CRITICAL)
- `risk_probability` (integer, not null — 0-100)
- `is_read` (boolean, default false — whether user has seen it)
- `created_at` (timestamptz, default now)

## 2. Security

### profiles
- RLS enabled.
- Users can read and update only their own profile (auth.uid() = id).

### notifications
- RLS enabled.
- Users can read only their own notifications (auth.uid() = user_id).
- Users can insert their own notifications (auth.uid() = user_id).
- Users can update their own notifications (mark as read).
- Users can delete their own notifications.

## 3. Important Notes
1. The profiles table uses auth.users.id as its primary key — one profile per auth user.
2. The notifications table has DEFAULT auth.uid() on user_id so inserts from the client work without passing user_id.
3. All policies are scoped TO authenticated — the app requires sign-in.
4. No destructive operations — both tables are new.
*/

-- Profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text,
  phone text,
  role text NOT NULL DEFAULT 'Citizen',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_profile" ON profiles;
CREATE POLICY "select_own_profile" ON profiles FOR SELECT
  TO authenticated USING (auth.uid() = id);

DROP POLICY IF EXISTS "update_own_profile" ON profiles;
CREATE POLICY "update_own_profile" ON profiles FOR UPDATE
  TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

-- Notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL,
  message text NOT NULL,
  zone_name text NOT NULL,
  risk_level text NOT NULL,
  risk_probability integer NOT NULL,
  is_read boolean NOT NULL DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_notifications" ON notifications;
CREATE POLICY "select_own_notifications" ON notifications FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_notifications" ON notifications;
CREATE POLICY "insert_own_notifications" ON notifications FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_notifications" ON notifications;
CREATE POLICY "update_own_notifications" ON notifications FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_notifications" ON notifications;
CREATE POLICY "delete_own_notifications" ON notifications FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

-- Index for efficient querying of a user's notifications
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id DESC);
CREATE INDEX IF NOT EXISTS idx_notifications_unread ON notifications(user_id, is_read) WHERE is_read = false;
