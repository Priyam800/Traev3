
-- Function to get a profile QR code
CREATE OR REPLACE FUNCTION get_profile_qr_code(user_id UUID)
RETURNS TABLE (
  id UUID,
  profile_id UUID,
  qr_data TEXT,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ
) LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  RETURN QUERY
  SELECT 
    pqc.id,
    pqc.profile_id,
    pqc.qr_data,
    pqc.created_at,
    pqc.updated_at
  FROM 
    public.profile_qr_codes pqc
  WHERE 
    pqc.profile_id = user_id;
END;
$$;

-- Function to insert or update a profile QR code
CREATE OR REPLACE FUNCTION upsert_profile_qr_code(user_id UUID, qr_code_data TEXT)
RETURNS BOOLEAN LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  existing_record_count INTEGER;
BEGIN
  -- Check if record exists
  SELECT COUNT(*) INTO existing_record_count 
  FROM public.profile_qr_codes
  WHERE profile_id = user_id;
  
  -- Update or insert based on existence
  IF existing_record_count > 0 THEN
    UPDATE public.profile_qr_codes
    SET qr_data = qr_code_data, updated_at = now()
    WHERE profile_id = user_id;
  ELSE
    INSERT INTO public.profile_qr_codes (profile_id, qr_data)
    VALUES (user_id, qr_code_data);
  END IF;
  
  RETURN TRUE;
END;
$$;
