-- ============================================
-- PawConnect Supabase SQL Schema
-- Run this entire script in your Supabase SQL Editor
-- ============================================

-- 1. PROFILES TABLE (extends Supabase auth.users)
-- Automatically created when a new user signs up
CREATE TABLE IF NOT EXISTS public.profiles (
  id          UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name   TEXT,
  avatar_url  TEXT,
  phone       TEXT,
  location    TEXT,
  bio         TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. PETS TABLE
CREATE TABLE IF NOT EXISTS public.pets (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id     UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  name         TEXT NOT NULL,
  type         TEXT NOT NULL CHECK (type IN ('dog', 'cat', 'other')),
  breed        TEXT NOT NULL,
  age          TEXT NOT NULL,
  gender       TEXT NOT NULL CHECK (gender IN ('male', 'female')),
  vaccinated   BOOLEAN NOT NULL DEFAULT FALSE,
  price        INTEGER NOT NULL DEFAULT 0,  -- in INR/currency units
  location     TEXT NOT NULL,
  description  TEXT NOT NULL,
  images       TEXT[] NOT NULL DEFAULT '{}',
  is_live      BOOLEAN NOT NULL DEFAULT FALSE,
  is_featured  BOOLEAN NOT NULL DEFAULT FALSE,
  is_available BOOLEAN NOT NULL DEFAULT TRUE,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. FAVORITES TABLE
CREATE TABLE IF NOT EXISTS public.favorites (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  pet_id     UUID NOT NULL REFERENCES public.pets(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, pet_id)  -- prevent duplicate favorites
);

-- 4. MESSAGES TABLE (for owner-adopter chat)
CREATE TABLE IF NOT EXISTS public.messages (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id   UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  receiver_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  pet_id      UUID NOT NULL REFERENCES public.pets(id) ON DELETE CASCADE,
  content     TEXT NOT NULL,
  is_read     BOOLEAN NOT NULL DEFAULT FALSE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. ADOPTION REQUESTS TABLE
CREATE TABLE IF NOT EXISTS public.adoption_requests (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pet_id       UUID NOT NULL REFERENCES public.pets(id) ON DELETE CASCADE,
  requester_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  owner_id     UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  status       TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  message      TEXT,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (pet_id, requester_id)  -- one request per person per pet
);


-- ============================================
-- TRIGGERS & FUNCTIONS
-- ============================================

-- Trigger: auto-create a profile row when a user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();


-- Trigger: auto-update `updated_at` on pets row update
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER pets_updated_at
  BEFORE UPDATE ON public.pets
  FOR EACH ROW EXECUTE PROCEDURE public.set_updated_at();

CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE PROCEDURE public.set_updated_at();

CREATE TRIGGER adoption_requests_updated_at
  BEFORE UPDATE ON public.adoption_requests
  FOR EACH ROW EXECUTE PROCEDURE public.set_updated_at();


-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.adoption_requests ENABLE ROW LEVEL SECURITY;

-- PROFILES policies
CREATE POLICY "Public profiles are viewable by everyone"
  ON public.profiles FOR SELECT USING (TRUE);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- PETS policies
CREATE POLICY "Pets are viewable by everyone"
  ON public.pets FOR SELECT USING (TRUE);

CREATE POLICY "Users can insert their own pets"
  ON public.pets FOR INSERT WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Users can update their own pets"
  ON public.pets FOR UPDATE USING (auth.uid() = owner_id);

CREATE POLICY "Users can delete their own pets"
  ON public.pets FOR DELETE USING (auth.uid() = owner_id);

-- FAVORITES policies
CREATE POLICY "Users can view their own favorites"
  ON public.favorites FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can favorite pets"
  ON public.favorites FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can un-favorite pets"
  ON public.favorites FOR DELETE USING (auth.uid() = user_id);

-- MESSAGES policies
CREATE POLICY "Users can view their own messages"
  ON public.messages FOR SELECT USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

CREATE POLICY "Users can send messages"
  ON public.messages FOR INSERT WITH CHECK (auth.uid() = sender_id);

CREATE POLICY "Receivers can mark messages as read"
  ON public.messages FOR UPDATE USING (auth.uid() = receiver_id);

-- ADOPTION REQUESTS policies
CREATE POLICY "Owners can view adoption requests for their pets"
  ON public.adoption_requests FOR SELECT USING (auth.uid() = owner_id OR auth.uid() = requester_id);

CREATE POLICY "Users can create adoption requests"
  ON public.adoption_requests FOR INSERT WITH CHECK (auth.uid() = requester_id);

CREATE POLICY "Owners can update request status"
  ON public.adoption_requests FOR UPDATE USING (auth.uid() = owner_id);


-- ============================================
-- INDEXES (for fast queries)
-- ============================================
CREATE INDEX IF NOT EXISTS pets_owner_idx ON public.pets(owner_id);
CREATE INDEX IF NOT EXISTS pets_type_idx ON public.pets(type);
CREATE INDEX IF NOT EXISTS pets_available_idx ON public.pets(is_available);
CREATE INDEX IF NOT EXISTS favorites_user_idx ON public.favorites(user_id);
CREATE INDEX IF NOT EXISTS messages_pet_idx ON public.messages(pet_id);
CREATE INDEX IF NOT EXISTS adoption_requests_pet_idx ON public.adoption_requests(pet_id);
