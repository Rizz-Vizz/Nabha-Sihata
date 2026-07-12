-- Basic Nabha Sihata Database Schema
-- This creates the essential tables needed for the app to function

-- 1. Profiles table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    
    -- User Type
    user_type TEXT NOT NULL CHECK (user_type IN ('patient', 'doctor', 'admin')),
    
    -- Basic Information
    name TEXT NOT NULL,
    phone TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Patient-specific fields
    age INTEGER,
    village TEXT,
    health_card_id TEXT UNIQUE,
    emergency_contact TEXT,
    
    -- Doctor-specific fields
    specialty TEXT,
    license_number TEXT UNIQUE,
    hospital TEXT,
    experience_years INTEGER,
    
    -- Status
    is_active BOOLEAN DEFAULT TRUE,
    profile_complete BOOLEAN DEFAULT FALSE,
    
    -- Supercoins for rewards system
    supercoins INTEGER DEFAULT 0 CHECK (supercoins >= 0)
);

-- 2. Health Records table
CREATE TABLE IF NOT EXISTS public.health_records (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    
    -- Basic Health Info
    blood_type TEXT,
    allergies TEXT[],
    chronic_conditions TEXT[],
    current_medications TEXT[],
    
    -- Emergency Medical Info
    emergency_medical_info JSONB,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Appointments table
CREATE TABLE IF NOT EXISTS public.appointments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    
    -- Participants
    patient_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    doctor_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    
    -- Appointment Details
    appointment_date DATE NOT NULL,
    appointment_time TIME NOT NULL,
    status TEXT NOT NULL DEFAULT 'scheduled' 
        CHECK (status IN ('scheduled', 'confirmed', 'in_progress', 'completed', 'cancelled', 'no_show')),
    
    -- Consultation Details
    consultation_type TEXT NOT NULL DEFAULT 'general' 
        CHECK (consultation_type IN ('general', 'follow_up', 'emergency', 'specialist')),
    symptoms TEXT,
    urgency TEXT CHECK (urgency IN ('low', 'medium', 'high', 'emergency')),
    
    -- Session Info
    session_duration INTEGER, -- in minutes
    consultation_notes TEXT,
    prescription TEXT,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Emergency Alerts table
CREATE TABLE IF NOT EXISTS public.emergency_alerts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    
    -- Alert Details
    emergency_type TEXT NOT NULL,
    location TEXT,
    description TEXT,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    
    -- Status
    status TEXT NOT NULL DEFAULT 'active' 
        CHECK (status IN ('active', 'responded', 'resolved', 'false_alarm')),
    priority TEXT NOT NULL DEFAULT 'high'
        CHECK (priority IN ('low', 'medium', 'high', 'critical')),
    
    -- Response
    responded_by UUID REFERENCES public.profiles(id),
    response_time TIMESTAMP WITH TIME ZONE,
    response_notes TEXT,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. System Settings table
CREATE TABLE IF NOT EXISTS public.system_settings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    setting_key TEXT UNIQUE NOT NULL,
    setting_value JSONB NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_profiles_user_type ON public.profiles(user_type);
CREATE INDEX IF NOT EXISTS idx_profiles_health_card_id ON public.profiles(health_card_id);
CREATE INDEX IF NOT EXISTS idx_profiles_created_at ON public.profiles(created_at);

CREATE INDEX IF NOT EXISTS idx_health_records_user_id ON public.health_records(user_id);

CREATE INDEX IF NOT EXISTS idx_appointments_patient_id ON public.appointments(patient_id);
CREATE INDEX IF NOT EXISTS idx_appointments_doctor_id ON public.appointments(doctor_id);
CREATE INDEX IF NOT EXISTS idx_appointments_date ON public.appointments(appointment_date);
CREATE INDEX IF NOT EXISTS idx_appointments_status ON public.appointments(status);

CREATE INDEX IF NOT EXISTS idx_emergency_alerts_user_id ON public.emergency_alerts(user_id);
CREATE INDEX IF NOT EXISTS idx_emergency_alerts_status ON public.emergency_alerts(status);
CREATE INDEX IF NOT EXISTS idx_emergency_alerts_created_at ON public.emergency_alerts(created_at);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add updated_at triggers
CREATE TRIGGER update_profiles_updated_at 
    BEFORE UPDATE ON public.profiles 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_health_records_updated_at 
    BEFORE UPDATE ON public.health_records 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_appointments_updated_at 
    BEFORE UPDATE ON public.appointments 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_emergency_alerts_updated_at 
    BEFORE UPDATE ON public.emergency_alerts 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) policies
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.health_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.emergency_alerts ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view own profile" ON public.profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Doctors can view patient profiles" ON public.profiles
    FOR SELECT USING (
        user_type = 'patient' AND EXISTS (
            SELECT 1 FROM public.profiles p 
            WHERE p.id = auth.uid() AND p.user_type = 'doctor'
        )
    );

-- Health records policies
CREATE POLICY "Users can view own health records" ON public.health_records
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own health records" ON public.health_records
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own health records" ON public.health_records
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Doctors can view patient health records" ON public.health_records
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.profiles p 
            WHERE p.id = auth.uid() AND p.user_type = 'doctor'
        )
    );

-- Appointments policies
CREATE POLICY "Patients can view own appointments" ON public.appointments
    FOR SELECT USING (auth.uid() = patient_id);

CREATE POLICY "Doctors can view own appointments" ON public.appointments
    FOR SELECT USING (auth.uid() = doctor_id);

CREATE POLICY "Patients can create appointments" ON public.appointments
    FOR INSERT WITH CHECK (auth.uid() = patient_id);

CREATE POLICY "Doctors can update appointments" ON public.appointments
    FOR UPDATE USING (auth.uid() = doctor_id);

-- Emergency alerts policies
CREATE POLICY "Users can view own alerts" ON public.emergency_alerts
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own alerts" ON public.emergency_alerts
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Doctors can view all alerts" ON public.emergency_alerts
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.profiles p 
            WHERE p.id = auth.uid() AND p.user_type IN ('doctor', 'admin')
        )
    );

CREATE POLICY "Doctors can update alerts" ON public.emergency_alerts
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.profiles p 
            WHERE p.id = auth.uid() AND p.user_type IN ('doctor', 'admin')
        )
    );

-- Function to auto-generate health card ID
CREATE OR REPLACE FUNCTION generate_health_card_id()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.user_type = 'patient' AND NEW.health_card_id IS NULL THEN
        -- Generate health card ID like NS001234
        NEW.health_card_id := 'NS' || LPAD(
            (SELECT COALESCE(MAX(CAST(SUBSTRING(health_card_id FROM 3) AS INTEGER)), 0) + 1
             FROM public.profiles 
             WHERE health_card_id ~ '^NS[0-9]+$')::TEXT, 
            6, '0'
        );
    END IF;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to auto-generate health card ID
CREATE TRIGGER trigger_generate_health_card_id
    BEFORE INSERT ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION generate_health_card_id();

-- Insert some demo data
INSERT INTO public.system_settings (setting_key, setting_value, description)
VALUES 
    ('app_version', '"1.0.0"', 'Current app version'),
    ('maintenance_mode', 'false', 'Whether the app is in maintenance mode'),
    ('emergency_contacts', '{"phc": "+91-1765-123456", "ambulance": "108", "police": "100"}', 'Emergency contact numbers'),
    ('supported_languages', '["en", "hi", "pa"]', 'Supported language codes')
ON CONFLICT (setting_key) DO NOTHING;

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;

-- Grant select on profiles to anon for public doctor listings
GRANT SELECT ON public.profiles TO anon;