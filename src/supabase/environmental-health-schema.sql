-- Environmental Health Survey and Notification System Schema
-- Requires basic-schema.sql to be run first

-- 1. Environmental Surveys Table
CREATE TABLE IF NOT EXISTS public.environmental_surveys (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    
    -- Location Information
    location_name TEXT NOT NULL,
    coordinates POINT, -- PostGIS point for lat/lng
    area_code TEXT,
    
    -- Survey Responses
    waste_disposal BOOLEAN NOT NULL, -- true = yes, false = no
    stagnant_water BOOLEAN NOT NULL,
    sanitation_frequency TEXT NOT NULL CHECK (sanitation_frequency IN ('daily', 'weekly', 'rarely', 'never')),
    pest_infestation BOOLEAN NOT NULL,
    disease_reports BOOLEAN NOT NULL,
    
    -- Additional Information
    disease_details TEXT,
    additional_comments TEXT,
    
    -- Risk Assessment
    risk_score INTEGER NOT NULL DEFAULT 0 CHECK (risk_score >= 0 AND risk_score <= 100),
    
    -- Metadata
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Indexes for performance
    CONSTRAINT valid_coordinates CHECK (coordinates IS NULL OR coordinates IS NOT NULL)
);

-- 2. Survey Photos Table
CREATE TABLE IF NOT EXISTS public.survey_photos (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    survey_id UUID REFERENCES environmental_surveys(id) ON DELETE CASCADE,
    
    -- Photo Information
    photo_url TEXT NOT NULL,
    photo_description TEXT,
    file_size INTEGER,
    mime_type TEXT,
    
    -- Metadata
    uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Health Notifications Table
CREATE TABLE IF NOT EXISTS public.health_notifications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    
    -- Notification Content
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('outbreak', 'reminder', 'alert', 'info')),
    severity TEXT NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'critical')),
    
    -- Health Information
    disease_name TEXT,
    actionable_advice TEXT NOT NULL,
    
    -- Targeting
    target_area TEXT NOT NULL,
    target_coordinates POINT, -- Area center point
    target_radius_km DECIMAL(10,2), -- Radius in kilometers
    
    -- Scheduling
    created_by UUID REFERENCES public.profiles(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    scheduled_for TIMESTAMP WITH TIME ZONE,
    expires_at TIMESTAMP WITH TIME ZONE,
    
    -- Status
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'scheduled', 'sent', 'expired')),
    sent_count INTEGER DEFAULT 0,
    
    -- Metadata
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. User Notifications (Many-to-Many relationship)
CREATE TABLE IF NOT EXISTS public.user_notifications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    notification_id UUID REFERENCES public.health_notifications(id) ON DELETE CASCADE,
    
    -- Status
    is_read BOOLEAN DEFAULT FALSE,
    read_at TIMESTAMP WITH TIME ZONE,
    dismissed_at TIMESTAMP WITH TIME ZONE,
    
    -- Delivery
    delivered_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    delivery_method TEXT DEFAULT 'app' CHECK (delivery_method IN ('app', 'sms', 'email')),
    
    -- Constraints
    UNIQUE(user_id, notification_id)
);

-- 5. Risk Areas Table (Auto-generated based on survey data)
CREATE TABLE IF NOT EXISTS public.risk_areas (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    
    -- Area Information
    area_name TEXT NOT NULL,
    center_coordinates POINT NOT NULL,
    radius_km DECIMAL(10,2) NOT NULL,
    
    -- Risk Assessment
    risk_level TEXT NOT NULL CHECK (risk_level IN ('low', 'medium', 'high', 'critical')),
    risk_score DECIMAL(5,2) NOT NULL CHECK (risk_score >= 0 AND risk_score <= 100),
    
    -- Contributing Factors
    total_surveys INTEGER DEFAULT 0,
    waste_disposal_issues INTEGER DEFAULT 0,
    stagnant_water_reports INTEGER DEFAULT 0,
    pest_infestation_reports INTEGER DEFAULT 0,
    disease_reports INTEGER DEFAULT 0,
    
    -- Temporal Information
    last_survey_date TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Status
    is_active BOOLEAN DEFAULT TRUE,
    alert_threshold_exceeded BOOLEAN DEFAULT FALSE
);

-- 6. Disease Outbreaks Table
CREATE TABLE IF NOT EXISTS public.disease_outbreaks (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    
    -- Disease Information
    disease_name TEXT NOT NULL,
    disease_code TEXT, -- ICD-10 or local coding
    
    -- Location
    area_name TEXT NOT NULL,
    coordinates POINT,
    affected_radius_km DECIMAL(10,2),
    
    -- Outbreak Data
    confirmed_cases INTEGER DEFAULT 0,
    suspected_cases INTEGER DEFAULT 0,
    fatalities INTEGER DEFAULT 0,
    
    -- Timeline
    first_reported_date DATE,
    last_case_date DATE,
    outbreak_declared_at TIMESTAMP WITH TIME ZONE,
    outbreak_ended_at TIMESTAMP WITH TIME ZONE,
    
    -- Status
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('suspected', 'confirmed', 'active', 'contained', 'ended')),
    severity TEXT NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'critical')),
    
    -- Source
    reported_by UUID REFERENCES public.profiles(id),
    verified_by UUID REFERENCES public.profiles(id),
    
    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create Indexes for Performance
CREATE INDEX idx_environmental_surveys_user_id ON environmental_surveys(user_id);
CREATE INDEX idx_environmental_surveys_submitted_at ON environmental_surveys(submitted_at);
CREATE INDEX idx_environmental_surveys_risk_score ON environmental_surveys(risk_score);
CREATE INDEX idx_environmental_surveys_location ON environmental_surveys USING GIST (coordinates);

CREATE INDEX idx_survey_photos_survey_id ON survey_photos(survey_id);

CREATE INDEX idx_health_notifications_type ON health_notifications(type);
CREATE INDEX idx_health_notifications_severity ON health_notifications(severity);
CREATE INDEX idx_health_notifications_status ON health_notifications(status);
CREATE INDEX idx_health_notifications_target_area ON health_notifications(target_area);
CREATE INDEX idx_health_notifications_created_at ON health_notifications(created_at);

CREATE INDEX idx_user_notifications_user_id ON user_notifications(user_id);
CREATE INDEX idx_user_notifications_notification_id ON user_notifications(notification_id);
CREATE INDEX idx_user_notifications_is_read ON user_notifications(is_read);
CREATE INDEX idx_user_notifications_delivered_at ON user_notifications(delivered_at);

CREATE INDEX idx_risk_areas_risk_level ON risk_areas(risk_level);
CREATE INDEX idx_risk_areas_coordinates ON risk_areas USING GIST (center_coordinates);
CREATE INDEX idx_risk_areas_updated_at ON risk_areas(updated_at);

CREATE INDEX idx_disease_outbreaks_disease_name ON disease_outbreaks(disease_name);
CREATE INDEX idx_disease_outbreaks_status ON disease_outbreaks(status);
CREATE INDEX idx_disease_outbreaks_coordinates ON disease_outbreaks USING GIST (coordinates);

-- Create Functions for Risk Score Calculation
CREATE OR REPLACE FUNCTION calculate_risk_score(
    waste_disposal BOOLEAN,
    stagnant_water BOOLEAN,
    sanitation_frequency TEXT,
    pest_infestation BOOLEAN,
    disease_reports BOOLEAN
) RETURNS INTEGER AS $$
DECLARE
    score INTEGER := 0;
BEGIN
    -- Waste disposal issues (+20 points)
    IF waste_disposal = FALSE THEN
        score := score + 20;
    END IF;
    
    -- Stagnant water presence (+25 points)
    IF stagnant_water = TRUE THEN
        score := score + 25;
    END IF;
    
    -- Sanitation frequency scoring
    CASE sanitation_frequency
        WHEN 'never' THEN score := score + 30;
        WHEN 'rarely' THEN score := score + 20;
        WHEN 'weekly' THEN score := score + 10;
        WHEN 'daily' THEN score := score + 0;
    END CASE;
    
    -- Pest infestation (+15 points)
    IF pest_infestation = TRUE THEN
        score := score + 15;
    END IF;
    
    -- Disease reports (+30 points - highest weight)
    IF disease_reports = TRUE THEN
        score := score + 30;
    END IF;
    
    -- Cap at 100
    IF score > 100 THEN
        score := 100;
    END IF;
    
    RETURN score;
END;
$$ LANGUAGE plpgsql;

-- Trigger to Auto-calculate Risk Score
CREATE OR REPLACE FUNCTION update_survey_risk_score()
RETURNS TRIGGER AS $$
BEGIN
    NEW.risk_score := calculate_risk_score(
        NEW.waste_disposal,
        NEW.stagnant_water,
        NEW.sanitation_frequency,
        NEW.pest_infestation,
        NEW.disease_reports
    );
    NEW.updated_at := NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_survey_risk_score
    BEFORE INSERT OR UPDATE ON environmental_surveys
    FOR EACH ROW
    EXECUTE FUNCTION update_survey_risk_score();

-- Function to Auto-generate Risk Areas
CREATE OR REPLACE FUNCTION update_risk_areas()
RETURNS VOID AS $$
DECLARE
    area_record RECORD;
BEGIN
    -- This is a simplified version - in production you'd use more sophisticated GIS queries
    FOR area_record IN
        SELECT 
            location_name,
            ST_Centroid(ST_Collect(coordinates)) as center,
            AVG(risk_score) as avg_risk,
            COUNT(*) as survey_count,
            SUM(CASE WHEN waste_disposal = FALSE THEN 1 ELSE 0 END) as waste_issues,
            SUM(CASE WHEN stagnant_water = TRUE THEN 1 ELSE 0 END) as water_issues,
            SUM(CASE WHEN pest_infestation = TRUE THEN 1 ELSE 0 END) as pest_issues,
            SUM(CASE WHEN disease_reports = TRUE THEN 1 ELSE 0 END) as disease_issues,
            MAX(submitted_at) as last_survey
        FROM public.environmental_surveys
        WHERE submitted_at > NOW() - INTERVAL '30 days'
        GROUP BY location_name
        HAVING COUNT(*) >= 3 -- Minimum surveys needed
    LOOP
        INSERT INTO public.risk_areas (
            area_name,
            center_coordinates,
            radius_km,
            risk_level,
            risk_score,
            total_surveys,
            waste_disposal_issues,
            stagnant_water_reports,
            pest_infestation_reports,
            disease_reports,
            last_survey_date,
            alert_threshold_exceeded
        ) VALUES (
            area_record.location_name,
            area_record.center,
            2.0, -- 2km radius default
            CASE 
                WHEN area_record.avg_risk >= 80 THEN 'critical'
                WHEN area_record.avg_risk >= 60 THEN 'high'
                WHEN area_record.avg_risk >= 40 THEN 'medium'
                ELSE 'low'
            END,
            area_record.avg_risk,
            area_record.survey_count,
            area_record.waste_issues,
            area_record.water_issues,
            area_record.pest_issues,
            area_record.disease_issues,
            area_record.last_survey,
            area_record.avg_risk >= 70 -- Alert threshold
        )
        ON CONFLICT (area_name) DO UPDATE SET
            center_coordinates = EXCLUDED.center_coordinates,
            risk_score = EXCLUDED.risk_score,
            risk_level = EXCLUDED.risk_level,
            total_surveys = EXCLUDED.total_surveys,
            waste_disposal_issues = EXCLUDED.waste_disposal_issues,
            stagnant_water_reports = EXCLUDED.stagnant_water_reports,
            pest_infestation_reports = EXCLUDED.pest_infestation_reports,
            disease_reports = EXCLUDED.disease_reports,
            last_survey_date = EXCLUDED.last_survey_date,
            alert_threshold_exceeded = EXCLUDED.alert_threshold_exceeded,
            updated_at = NOW();
    END LOOP;
END;
$$ LANGUAGE plpgsql;

-- Function to Auto-send Notifications for High Risk Areas
CREATE OR REPLACE FUNCTION check_and_send_risk_alerts()
RETURNS VOID AS $$
DECLARE
    risk_area RECORD;
    notification_id UUID;
BEGIN
    FOR risk_area IN
        SELECT * FROM public.risk_areas 
        WHERE alert_threshold_exceeded = TRUE 
        AND is_active = TRUE
        AND updated_at > NOW() - INTERVAL '1 hour' -- Only recent updates
    LOOP
        -- Create notification
        INSERT INTO public.health_notifications (
            title,
            message,
            type,
            severity,
            actionable_advice,
            target_area,
            target_coordinates,
            target_radius_km,
            status
        ) VALUES (
            'High Risk Area Alert - ' || risk_area.area_name,
            'Environmental health risks detected in your area based on recent surveys. Risk score: ' || risk_area.risk_score || '%',
            'alert',
            CASE 
                WHEN risk_area.risk_level = 'critical' THEN 'critical'
                WHEN risk_area.risk_level = 'high' THEN 'high'
                ELSE 'medium'
            END,
            'Ensure proper waste disposal, remove stagnant water, maintain cleanliness, and report any health issues immediately.',
            risk_area.area_name,
            risk_area.center_coordinates,
            risk_area.radius_km,
            'sent'
        ) RETURNING id INTO notification_id;
        
        -- Send to all users in the area (simplified - in production use proper GIS queries)
        INSERT INTO public.user_notifications (user_id, notification_id)
        SELECT DISTINCT p.id, notification_id
        FROM public.profiles p
        JOIN public.environmental_surveys es ON p.id = es.user_id
        WHERE es.location_name = risk_area.area_name
        AND es.submitted_at > NOW() - INTERVAL '90 days';
        
    END LOOP;
END;
$$ LANGUAGE plpgsql;

-- Row Level Security Policies
ALTER TABLE public.environmental_surveys ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.survey_photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_notifications ENABLE ROW LEVEL SECURITY;

-- Users can only see their own surveys
CREATE POLICY "Users can view own surveys" ON public.environmental_surveys
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own surveys" ON public.environmental_surveys
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own surveys" ON public.environmental_surveys
    FOR UPDATE USING (auth.uid() = user_id);

-- Users can only see their own survey photos
CREATE POLICY "Users can view own survey photos" ON public.survey_photos
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.environmental_surveys 
            WHERE id = survey_id AND user_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert own survey photos" ON public.survey_photos
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.environmental_surveys 
            WHERE id = survey_id AND user_id = auth.uid()
        )
    );

-- Users can only see their own notifications
CREATE POLICY "Users can view own notifications" ON public.user_notifications
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own notifications" ON public.user_notifications
    FOR UPDATE USING (auth.uid() = user_id);

-- Public read for health notifications (they contain public health info)
CREATE POLICY "Public read for health notifications" ON public.health_notifications
    FOR SELECT USING (true);

-- Public read for risk areas (public health information)
CREATE POLICY "Public read for risk areas" ON public.risk_areas
    FOR SELECT USING (true);

-- Public read for disease outbreaks (public health information)
CREATE POLICY "Public read for disease outbreaks" ON public.disease_outbreaks
    FOR SELECT USING (true);

-- Only doctors/admins can create notifications and manage outbreaks
CREATE POLICY "Doctors can manage notifications" ON public.health_notifications
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() 
            AND user_type = 'doctor'
        )
    );

CREATE POLICY "Doctors can manage outbreaks" ON public.disease_outbreaks
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() 
            AND user_type = 'doctor'
        )
    );

-- Create scheduled job to update risk areas daily (requires pg_cron extension)
-- SELECT cron.schedule('update-risk-areas', '0 6 * * *', 'SELECT update_risk_areas();');
-- SELECT cron.schedule('check-risk-alerts', '0 */6 * * *', 'SELECT check_and_send_risk_alerts();');

-- Storage Bucket for Environmental Photos
-- This needs to be created in the Supabase dashboard or via API
-- CREATE BUCKET environmental-photos WITH (public = false);

-- Storage Policies for Environmental Photos
-- Allow authenticated users to upload their own survey photos
-- CREATE POLICY "Users can upload survey photos" ON storage.objects
--   FOR INSERT WITH CHECK (
--     bucket_id = 'environmental-photos' 
--     AND auth.uid()::text = (storage.foldername(name))[1]
--   );

-- Allow users to view their own photos and public survey photos
-- CREATE POLICY "Users can view survey photos" ON storage.objects
--   FOR SELECT USING (
--     bucket_id = 'environmental-photos'
--   );

-- Allow users to delete their own photos
-- CREATE POLICY "Users can delete own photos" ON storage.objects
--   FOR DELETE USING (
--     bucket_id = 'environmental-photos' 
--     AND auth.uid()::text = (storage.foldername(name))[1]
--   );

-- Sample data for testing
INSERT INTO public.health_notifications (
    title,
    message,
    type,
    severity,
    disease_name,
    actionable_advice,
    target_area,
    status,
    sent_count
) VALUES 
(
    'Dengue Alert - Nabha Central',
    'Health officials have reported 5 cases of dengue fever within 2km of your location.',
    'outbreak',
    'high',
    'Dengue Fever',
    'Remove stagnant water around your home. Use mosquito nets and repellents. Seek medical attention if you develop fever, headache, or body pain.',
    'Nabha Central',
    'sent',
    1250
),
(
    'Water Quality Alert',
    'Contaminated water source detected near your locality. Boil water before drinking.',
    'alert',
    'critical',
    NULL,
    'Boil drinking water for at least 5 minutes. Use bottled water if possible. Avoid street food and raw vegetables.',
    'All Areas',
    'sent',
    3200
),
(
    'Weekly Health Check Reminder',
    'Remember to clean water storage containers and check for mosquito breeding sites.',
    'reminder',
    'medium',
    NULL,
    'Clean water tanks weekly. Check and empty containers that can collect water. Maintain proper waste disposal.',
    'All Areas',
    'sent',
    5000
);