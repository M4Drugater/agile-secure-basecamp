
-- Add preferred_language column to profiles table
ALTER TABLE public.profiles 
ADD COLUMN preferred_language TEXT DEFAULT 'en';

-- Add a check constraint to ensure only valid language codes
ALTER TABLE public.profiles 
ADD CONSTRAINT valid_preferred_language 
CHECK (preferred_language IN ('en', 'es', 'it'));

-- Update existing users to have a default language
UPDATE public.profiles 
SET preferred_language = 'en' 
WHERE preferred_language IS NULL;
