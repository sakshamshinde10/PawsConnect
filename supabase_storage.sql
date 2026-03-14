-- ============================================
-- Supabase Storage Buckets for PawConnect
-- Run this in your Supabase SQL Editor
-- ============================================

-- Create storage buckets for pet images and videos
INSERT INTO storage.buckets (id, name, public)
VALUES ('pet-images', 'pet-images', true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public)
VALUES ('pet-videos', 'pet-videos', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies: Allow authenticated users to upload
CREATE POLICY "Authenticated users can upload pet images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'pet-images');

CREATE POLICY "Anyone can view pet images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'pet-images');

CREATE POLICY "Users can delete their own pet images"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'pet-images' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Authenticated users can upload pet videos"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'pet-videos');

CREATE POLICY "Anyone can view pet videos"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'pet-videos');

CREATE POLICY "Users can delete their own pet videos"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'pet-videos' AND auth.uid()::text = (storage.foldername(name))[1]);
