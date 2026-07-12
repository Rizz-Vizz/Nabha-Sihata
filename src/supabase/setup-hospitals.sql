-- Create hospitals table
CREATE TABLE IF NOT EXISTS hospitals (
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

-- Create index for geographical queries
CREATE INDEX IF NOT EXISTS idx_hospitals_location ON hospitals (latitude, longitude);

-- Create index for type filtering
CREATE INDEX IF NOT EXISTS idx_hospitals_type ON hospitals (type);

-- Create index for rating sorting
CREATE INDEX IF NOT EXISTS idx_hospitals_rating ON hospitals (rating DESC);

-- Insert sample hospital data for Nabha and surrounding areas
INSERT INTO hospitals (name, type, rating, latitude, longitude, address, contact) VALUES
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
('BJS Dental College', 'Dental', 4.1, 30.78901, 76.89012, 'Ludhiana, Punjab', '+91-9876543229');

-- Create RLS (Row Level Security) policies
ALTER TABLE hospitals ENABLE ROW LEVEL SECURITY;

-- Allow read access to all authenticated users
CREATE POLICY "Allow read access to hospitals" ON hospitals
  FOR SELECT
  TO authenticated
  USING (true);

-- Allow insert/update only to doctors or admin users
CREATE POLICY "Allow hospital management to doctors" ON hospitals
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE user_profiles.user_id = auth.uid() 
      AND user_profiles.user_type = 'doctor'
    )
  );

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_hospitals_updated_at
  BEFORE UPDATE ON hospitals
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

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
  FROM hospitals h
  WHERE calculate_distance(user_lat, user_lon, h.latitude, h.longitude) <= radius_km
  ORDER BY distance ASC;
END;
$$ LANGUAGE plpgsql;