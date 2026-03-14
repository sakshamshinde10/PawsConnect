-- ============================================
-- Enable Realtime for the messages table
-- Run this in your Supabase SQL Editor
-- ============================================

-- Enable realtime on the messages table so chat works in real-time
ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;
