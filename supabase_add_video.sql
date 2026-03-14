-- Run this in your Supabase SQL Editor to add video support to the pets table
ALTER TABLE public.pets ADD COLUMN IF NOT EXISTS video_url TEXT;
