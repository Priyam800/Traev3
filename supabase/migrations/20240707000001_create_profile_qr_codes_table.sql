
-- Create the profile_qr_codes table to store QR codes for profiles
CREATE TABLE IF NOT EXISTS public.profile_qr_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID REFERENCES auth.users(id) NOT NULL,
  qr_data TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  UNIQUE(profile_id)
);

-- Add Row Level Security on profile_qr_codes table
ALTER TABLE public.profile_qr_codes ENABLE ROW LEVEL SECURITY;

-- Create policy for viewing QR codes (only own QR code)
CREATE POLICY "Users can view their own QR codes" 
ON public.profile_qr_codes 
FOR SELECT 
USING (auth.uid() = profile_id);

-- Create policy for inserting QR codes (only own QR code)
CREATE POLICY "Users can create their own QR codes" 
ON public.profile_qr_codes 
FOR INSERT 
WITH CHECK (auth.uid() = profile_id);

-- Create policy for updating QR codes (only own QR code)
CREATE POLICY "Users can update their own QR codes" 
ON public.profile_qr_codes 
FOR UPDATE 
USING (auth.uid() = profile_id);

-- Create trigger for modified time
CREATE TRIGGER update_profile_qr_codes_modtime
BEFORE UPDATE ON public.profile_qr_codes
FOR EACH ROW
EXECUTE FUNCTION update_modified_column();
