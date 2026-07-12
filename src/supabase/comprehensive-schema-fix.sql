-- Comprehensive schema fix for Nabha Sihata
-- This script addresses all missing database components causing errors

-- =============================================================================
-- 1. FIX PROFILES TABLE NAMING INCONSISTENCY
-- =============================================================================

-- Create user_profiles view for backward compatibility with hospital functions
CREATE OR REPLACE VIEW user_profiles AS
SELECT 
  id as user_id,
  user_type,
  name as full_name,
  phone,
  age,
  village,
  health_card_id,
  emergency_contact,
  specialty,
  license_number,
  hospital,
  experience_years,
  is_active,
  profile_complete,
  supercoins,
  created_at,
  updated_at
FROM public.profiles;

-- Grant necessary permissions to the view
GRANT SELECT ON user_profiles TO authenticated, anon;

-- =============================================================================
-- 2. HOSPITALS TABLE AND FUNCTIONS
-- =============================================================================

-- Create hospitals table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.hospitals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('General', 'Maternity', 'Eye', 'Orthopedic', 'Neurological', 'Cardiac', 'Emergency', 'Dental')),
  rating NUMERIC(2,1) CHECK (rating >= 0 AND rating <= 5),
  latitude DOUBLE PRECISION NOT NULL,
  longitude DOUBLE PRECISION NOT NULL,
  address TEXT NOT NULL,
  contact TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for geographical queries
CREATE INDEX IF NOT EXISTS idx_hospitals_location ON public.hospitals (latitude, longitude);
CREATE INDEX IF NOT EXISTS idx_hospitals_type ON public.hospitals (type);
CREATE INDEX IF NOT EXISTS idx_hospitals_rating ON public.hospitals (rating DESC);

-- Enable RLS for hospitals
ALTER TABLE public.hospitals ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for hospitals
DROP POLICY IF EXISTS "Allow read access to hospitals" ON public.hospitals;
CREATE POLICY "Allow read access to hospitals" ON public.hospitals
  FOR SELECT
  TO authenticated, anon
  USING (true);

DROP POLICY IF EXISTS "Allow hospital management to doctors" ON public.hospitals;
CREATE POLICY "Allow hospital management to doctors" ON public.hospitals
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.user_type IN ('doctor', 'admin')
    )
  );

-- Create function to calculate distance between coordinates
CREATE OR REPLACE FUNCTION calculate_distance(
  lat1 DOUBLE PRECISION,
  lon1 DOUBLE PRECISION,
  lat2 DOUBLE PRECISION,
  lon2 DOUBLE PRECISION
) RETURNS DOUBLE PRECISION AS $$
BEGIN
  RETURN (
    6371 * acos(
      cos(radians(lat1)) * 
      cos(radians(lat2)) * 
      cos(radians(lon2) - radians(lon1)) + 
      sin(radians(lat1)) * 
      sin(radians(lat2))
    )
  );
END;
$$ LANGUAGE plpgsql;

-- Create function to find nearby hospitals
CREATE OR REPLACE FUNCTION find_nearby_hospitals(
  user_lat DOUBLE PRECISION,
  user_lon DOUBLE PRECISION,
  radius_km DOUBLE PRECISION DEFAULT 50
) RETURNS TABLE(
  id UUID,
  name TEXT,
  type TEXT,
  rating NUMERIC,
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  address TEXT,
  contact TEXT,
  distance DOUBLE PRECISION
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    h.id,
    h.name,
    h.type,
    h.rating,
    h.latitude,
    h.longitude,
    h.address,
    h.contact,
    calculate_distance(user_lat, user_lon, h.latitude, h.longitude) as distance
  FROM public.hospitals h
  WHERE calculate_distance(user_lat, user_lon, h.latitude, h.longitude) <= radius_km
  ORDER BY distance ASC;
END;
$$ LANGUAGE plpgsql;

-- Grant execute permissions on functions
GRANT EXECUTE ON FUNCTION calculate_distance(DOUBLE PRECISION, DOUBLE PRECISION, DOUBLE PRECISION, DOUBLE PRECISION) TO authenticated, anon;
GRANT EXECUTE ON FUNCTION find_nearby_hospitals(DOUBLE PRECISION, DOUBLE PRECISION, DOUBLE PRECISION) TO authenticated, anon;

-- Insert sample hospital data (only if table is empty)
INSERT INTO public.hospitals (name, type, rating, latitude, longitude, address, contact) 
SELECT * FROM (VALUES
  ('Sawhney Hospital', 'Maternity', 4.2, 30.39354, 76.19093, 'Patiala Gate, Nabha, Punjab', '+91-9876543210'),
  ('Civil Hospital Nabha', 'General', 3.8, 30.37123, 76.15456, 'Hospital Road, Nabha, Punjab', '+91-9876543211'),
  ('Max Super Speciality Hospital', 'Cardiac', 4.7, 30.74123, 76.77890, 'Phase 7, Mohali, Punjab', '+91-9876543212'),
  ('Fortis Hospital', 'Neurological', 4.5, 30.73456, 76.78123, 'Sector 62, Mohali, Punjab', '+91-9876543213'),
  ('Apollo Clinic', 'Eye', 4.1, 30.38789, 76.16234, 'Near Bus Stand, Nabha, Punjab', '+91-9876543214'),
  ('Bone & Joint Hospital', 'Orthopedic', 4.3, 30.36567, 76.17890, 'Medical Road, Nabha, Punjab', '+91-9876543215'),
  ('Nabha Emergency Care', 'Emergency', 4.0, 30.38123, 76.16789, 'Main Market, Nabha, Punjab', '+91-108'),
  ('Smile Dental Clinic', 'Dental', 3.9, 30.37890, 76.15123, 'Mall Road, Nabha, Punjab', '+91-9876543217'),
  ('Rajindra Hospital', 'General', 4.4, 30.33789, 76.40123, 'Patiala, Punjab', '+91-9876543218'),
  ('Christian Medical College', 'General', 4.6, 30.75456, 76.79234, 'Ludhiana, Punjab', '+91-9876543219'),
  ('Dayanand Medical College', 'General', 4.3, 30.90123, 75.85234, 'Ludhiana, Punjab', '+91-9876543220'),
  ('Post Graduate Institute', 'Cardiac', 4.8, 30.76234, 76.77456, 'Chandigarh', '+91-9876543221'),
  ('Government Medical College', 'General', 4.1, 30.33456, 76.38789, 'Patiala, Punjab', '+91-9876543222'),
  ('Ivy Hospital', 'Neurological', 4.4, 30.74789, 76.78567, 'Mohali, Punjab', '+91-9876543223'),
  ('Paras Hospital', 'General', 4.2, 30.69123, 76.73456, 'Panchkula, Haryana', '+91-9876543224'),
  ('Kalpana Chawla Hospital', 'Maternity', 4.0, 30.45678, 76.82345, 'Karnal, Haryana', '+91-9876543225'),
  ('Mata Kaushalya Hospital', 'General', 3.7, 30.23456, 76.12345, 'Patiala, Punjab', '+91-9876543226'),
  ('Satguru Partap Singh Hospital', 'Emergency', 3.9, 30.20123, 76.35678, 'Patiala, Punjab', '+91-9876543227'),
  ('Amandeep Hospital', 'General', 4.3, 30.56789, 76.45123, 'Amritsar, Punjab', '+91-9876543228'),
  ('BJS Dental College', 'Dental', 4.1, 30.78901, 76.89012, 'Ludhiana, Punjab', '+91-9876543229')
) AS hospital_data(name, type, rating, latitude, longitude, address, contact)
WHERE NOT EXISTS (SELECT 1 FROM public.hospitals LIMIT 1);

-- =============================================================================
-- 3. NOTIFICATIONS SYSTEM
-- =============================================================================

-- Create health notifications table
CREATE TABLE IF NOT EXISTS public.health_notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('outbreak', 'alert', 'reminder', 'info')),
  severity TEXT NOT NULL DEFAULT 'medium' CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  disease_name TEXT,
  actionable_advice TEXT,
  location TEXT,
  expires_at TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user notification deliveries table
CREATE TABLE IF NOT EXISTS public.user_notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  notification_id UUID REFERENCES public.health_notifications(id) ON DELETE CASCADE,
  is_read BOOLEAN DEFAULT FALSE,
  delivered_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  read_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for notifications
CREATE INDEX IF NOT EXISTS idx_health_notifications_type ON public.health_notifications(type);
CREATE INDEX IF NOT EXISTS idx_health_notifications_severity ON public.health_notifications(severity);
CREATE INDEX IF NOT EXISTS idx_health_notifications_active ON public.health_notifications(is_active);
CREATE INDEX IF NOT EXISTS idx_health_notifications_created_at ON public.health_notifications(created_at);

CREATE INDEX IF NOT EXISTS idx_user_notifications_user_id ON public.user_notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_user_notifications_notification_id ON public.user_notifications(notification_id);
CREATE INDEX IF NOT EXISTS idx_user_notifications_is_read ON public.user_notifications(is_read);

-- Enable RLS for notifications
ALTER TABLE public.health_notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_notifications ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for health notifications
DROP POLICY IF EXISTS "Allow read access to health notifications" ON public.health_notifications;
CREATE POLICY "Allow read access to health notifications" ON public.health_notifications
  FOR SELECT
  TO authenticated, anon
  USING (is_active = true);

DROP POLICY IF EXISTS "Allow doctors to manage health notifications" ON public.health_notifications;
CREATE POLICY "Allow doctors to manage health notifications" ON public.health_notifications
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.user_type IN ('doctor', 'admin')
    )
  );

-- Create RLS policies for user notifications
DROP POLICY IF EXISTS "Users can view own notifications" ON public.user_notifications;
CREATE POLICY "Users can view own notifications" ON public.user_notifications
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own notifications" ON public.user_notifications;
CREATE POLICY "Users can update own notifications" ON public.user_notifications
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "System can insert user notifications" ON public.user_notifications;
CREATE POLICY "System can insert user notifications" ON public.user_notifications
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Create function to get user notifications with health notification details
CREATE OR REPLACE FUNCTION get_user_notifications(user_uuid UUID)
RETURNS TABLE(
  notification_id UUID,
  user_notification_id UUID,
  is_read BOOLEAN,
  delivered_at TIMESTAMP WITH TIME ZONE,
  read_at TIMESTAMP WITH TIME ZONE,
  title TEXT,
  message TEXT,
  type TEXT,
  severity TEXT,
  disease_name TEXT,
  actionable_advice TEXT,
  location TEXT,
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    hn.id as notification_id,
    un.id as user_notification_id,
    un.is_read,
    un.delivered_at,
    un.read_at,
    hn.title,
    hn.message,
    hn.type,
    hn.severity,
    hn.disease_name,
    hn.actionable_advice,
    hn.location,
    hn.expires_at,
    hn.created_at
  FROM public.user_notifications un
  JOIN public.health_notifications hn ON un.notification_id = hn.id
  WHERE un.user_id = user_uuid
    AND hn.is_active = true
    AND (hn.expires_at IS NULL OR hn.expires_at > NOW())
  ORDER BY un.delivered_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission on notification function
GRANT EXECUTE ON FUNCTION get_user_notifications(UUID) TO authenticated;

-- Create function to mark notification as read
CREATE OR REPLACE FUNCTION mark_notification_read(user_uuid UUID, notification_uuid UUID)
RETURNS BOOLEAN AS $$
BEGIN
  UPDATE public.user_notifications 
  SET is_read = true, read_at = NOW()
  WHERE user_id = user_uuid AND notification_id = notification_uuid;
  
  RETURN FOUND;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission on mark read function
GRANT EXECUTE ON FUNCTION mark_notification_read(UUID, UUID) TO authenticated;

-- Insert sample health notifications
INSERT INTO public.health_notifications (title, message, type, severity, disease_name, actionable_advice, location) 
SELECT * FROM (VALUES
  ('Dengue Alert in Your Area', 'Health officials have reported 5 cases of dengue fever within 2km of your location.', 'outbreak', 'high', 'Dengue Fever', 'Remove stagnant water around your home. Use mosquito nets and repellents.', 'Nabha, Punjab'),
  ('Weekly Health Check Reminder', 'Remember to clean water storage containers and check for mosquito breeding sites.', 'reminder', 'medium', NULL, 'Clean water tanks, check drains, and maintain proper waste disposal.', 'Your Area'),
  ('Water Quality Alert', 'Contaminated water source detected near your locality. Boil water before drinking.', 'alert', 'critical', NULL, 'Boil drinking water for at least 5 minutes. Use bottled water if possible.', 'Nabha Water Supply'),
  ('Malaria Prevention Campaign', 'Free mosquito nets distribution and spraying in rural areas starting next week.', 'info', 'medium', 'Malaria', 'Contact your local health worker to receive free mosquito nets.', 'Rural Punjab'),
  ('Seasonal Flu Vaccination', 'Annual flu vaccination drive starts at all PHCs and hospitals.', 'info', 'low', 'Influenza', 'Visit your nearest PHC or hospital for free flu vaccination.', 'All Areas')
) AS notification_data(title, message, type, severity, disease_name, actionable_advice, location)
WHERE NOT EXISTS (SELECT 1 FROM public.health_notifications LIMIT 1);

-- =============================================================================
-- 4. GRANT PERMISSIONS
-- =============================================================================

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO authenticated;

-- Grant select permissions to anon for public data
GRANT SELECT ON public.hospitals TO anon;
GRANT SELECT ON public.health_notifications TO anon;
GRANT SELECT ON user_profiles TO anon;

-- Create trigger for updating hospital updated_at
DROP TRIGGER IF EXISTS update_hospitals_updated_at ON public.hospitals;
CREATE TRIGGER update_hospitals_updated_at
  BEFORE UPDATE ON public.hospitals
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create trigger for updating notification updated_at
DROP TRIGGER IF EXISTS update_health_notifications_updated_at ON public.health_notifications;
CREATE TRIGGER update_health_notifications_updated_at
  BEFORE UPDATE ON public.health_notifications
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- =============================================================================
-- 5. SUCCESS MESSAGE
-- =============================================================================

-- Add a system setting to track successful setup
INSERT INTO public.system_settings (setting_key, setting_value, description)
VALUES (
  'comprehensive_schema_fix_applied', 
  '"true"', 
  'Indicates that the comprehensive schema fix has been applied successfully'
)
ON CONFLICT (setting_key) DO UPDATE SET 
  setting_value = '"true"', 
  updated_at = NOW();

-- Log success
DO $$
BEGIN
  RAISE NOTICE 'Comprehensive schema fix applied successfully!';
  RAISE NOTICE 'Added: hospitals table with % records', (SELECT COUNT(*) FROM public.hospitals);
  RAISE NOTICE 'Added: health_notifications table with % records', (SELECT COUNT(*) FROM public.health_notifications);
  RAISE NOTICE 'Added: user_notifications table';
  RAISE NOTICE 'Added: find_nearby_hospitals function';
  RAISE NOTICE 'Added: get_user_notifications function';
  RAISE NOTICE 'Added: mark_notification_read function';
  RAISE NOTICE 'Fixed: user_profiles compatibility view';
END $$;