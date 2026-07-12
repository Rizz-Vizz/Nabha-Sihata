import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Alert, AlertDescription } from './ui/alert';
import { ArrowLeft, Database, Copy, CheckCircle, ExternalLink, AlertTriangle } from 'lucide-react';
import { useLanguage } from './language-context';
import { toast } from 'sonner@2.0.3';

interface DatabaseSetupProps {
  onBack: () => void;
  onComplete: () => void;
}

export function DatabaseSetup({ onBack, onComplete }: DatabaseSetupProps) {
  const { t } = useLanguage();
  const [copiedSection, setCopiedSection] = useState<string | null>(null);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());

  const copyToClipboard = async (text: string, section: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedSection(section);
      toast.success(`${section} SQL copied to clipboard!`);
      setTimeout(() => setCopiedSection(null), 2000);
    } catch (error) {
      toast.error('Failed to copy to clipboard');
    }
  };

  const markStepComplete = (step: number) => {
    setCompletedSteps(prev => new Set([...prev, step]));
    if (step === 4) {
      
      setTimeout(() => {
        toast.success('Database setup completed! 🎉');
        onComplete();
      }, 1000);
    }
  };

  const basicSchemaSql = `-- Basic Nabha Sihata Database Schema
-- Copy and paste this entire section into your Supabase SQL Editor

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
    profile_complete BOOLEAN DEFAULT FALSE
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

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;
GRANT SELECT ON public.profiles TO anon;`;

  const triggersSql = `-- Database Triggers and Functions
-- Copy and paste this section after the basic schema

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
    EXECUTE FUNCTION generate_health_card_id();`;

  const environmentalSql = `-- Environmental Health and Survey System
-- Copy and paste this section after the triggers

-- Add Supercoins to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS supercoins INTEGER DEFAULT 0 CHECK (supercoins >= 0);

-- Environmental Surveys Table
CREATE TABLE IF NOT EXISTS public.environmental_surveys (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    
    -- Location Information
    location_name TEXT NOT NULL,
    coordinates POINT,
    area_code TEXT,
    
    -- Survey Responses
    waste_disposal BOOLEAN NOT NULL,
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
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Supercoins Transactions table
CREATE TABLE IF NOT EXISTS public.supercoin_transactions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    
    -- Transaction Details
    transaction_type TEXT NOT NULL CHECK (transaction_type IN ('earned', 'spent', 'bonus', 'penalty')),
    amount INTEGER NOT NULL,
    description TEXT NOT NULL,
    
    -- Source/Reference
    source_type TEXT CHECK (source_type IN ('survey', 'consultation', 'referral', 'admin', 'discount')),
    source_id UUID,
    
    -- Balance tracking
    balance_before INTEGER NOT NULL,
    balance_after INTEGER NOT NULL,
    
    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID REFERENCES public.profiles(id)
);

-- Survey Photos Table
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

-- Risk calculation function
CREATE OR REPLACE FUNCTION calculate_risk_score(
    waste_disposal BOOLEAN,
    stagnant_water BOOLEAN,
    sanitation_frequency TEXT,
    pest_infestation BOOLEAN,
    disease_reports BOOLEAN
) RETURNS INTEGER AS $
DECLARE
    score INTEGER := 0;
BEGIN
    IF waste_disposal = FALSE THEN score := score + 20; END IF;
    IF stagnant_water = TRUE THEN score := score + 25; END IF;
    
    CASE sanitation_frequency
        WHEN 'never' THEN score := score + 30;
        WHEN 'rarely' THEN score := score + 20;
        WHEN 'weekly' THEN score := score + 10;
        WHEN 'daily' THEN score := score + 0;
    END CASE;
    
    IF pest_infestation = TRUE THEN score := score + 15; END IF;
    IF disease_reports = TRUE THEN score := score + 30; END IF;
    
    IF score > 100 THEN score := 100; END IF;
    
    RETURN score;
END;
$ LANGUAGE plpgsql;

-- Auto-calculate risk score trigger
CREATE OR REPLACE FUNCTION update_survey_risk_score()
RETURNS TRIGGER AS $
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
$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_survey_risk_score
    BEFORE INSERT OR UPDATE ON environmental_surveys
    FOR EACH ROW
    EXECUTE FUNCTION update_survey_risk_score();`;

  const securitySql = `-- Row Level Security Policies
-- Copy and paste this section last

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.health_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.emergency_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.environmental_surveys ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.survey_photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.supercoin_transactions ENABLE ROW LEVEL SECURITY;

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

-- Appointments policies
CREATE POLICY "Patients can view own appointments" ON public.appointments
    FOR SELECT USING (auth.uid() = patient_id);

CREATE POLICY "Doctors can view own appointments" ON public.appointments
    FOR SELECT USING (auth.uid() = doctor_id);

CREATE POLICY "Patients can create appointments" ON public.appointments
    FOR INSERT WITH CHECK (auth.uid() = patient_id);

-- Emergency alerts policies
CREATE POLICY "Users can view own alerts" ON public.emergency_alerts
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own alerts" ON public.emergency_alerts
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Environmental surveys policies
CREATE POLICY "Users can view own surveys" ON public.environmental_surveys
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own surveys" ON public.environmental_surveys
    FOR INSERT WITH CHECK (auth.uid() = user_id);

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

-- Supercoin transactions policies
CREATE POLICY "Users can view own transactions" ON public.supercoin_transactions
    FOR SELECT USING (auth.uid() = user_id);

-- Insert demo data and create indexes
CREATE INDEX IF NOT EXISTS idx_profiles_user_type ON public.profiles(user_type);
CREATE INDEX IF NOT EXISTS idx_environmental_surveys_user_id ON environmental_surveys(user_id);
CREATE INDEX IF NOT EXISTS idx_supercoin_transactions_user_id ON supercoin_transactions(user_id);

INSERT INTO public.system_settings (setting_key, setting_value, description)
VALUES 
    ('app_version', '"1.0.0"', 'Current app version'),
    ('maintenance_mode', 'false', 'Whether the app is in maintenance mode'),
    ('emergency_contacts', '{"phc": "+91-1765-123456", "ambulance": "108", "police": "100"}', 'Emergency contact numbers'),
    ('supported_languages', '["en", "hi", "pa"]', 'Supported language codes')
ON CONFLICT (setting_key) DO NOTHING;`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 p-4">
      {}
      <div className="flex items-center mb-6">
        <Button variant="ghost" onClick={onBack} className="mr-4">
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-blue-600 flex items-center space-x-2">
            <Database className="w-6 h-6" />
            <span>Database Setup</span>
          </h1>
          <p className="text-gray-600">Set up your Supabase database for Nabha Sihata</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto space-y-6">
        {}
        <Alert className="border-orange-200 bg-orange-50">
          <AlertTriangle className="h-4 w-4 text-orange-600" />
          <AlertDescription className="text-orange-800">
            <strong>First-time setup required:</strong> Your Supabase database needs to be configured before you can use the app. 
            Follow these steps to set up the required tables and security policies.
          </AlertDescription>
        </Alert>

        {}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                completedSteps.has(1) ? 'bg-green-500 text-white' : 'bg-blue-100 text-blue-600'
              }`}>
                {completedSteps.has(1) ? <CheckCircle className="w-5 h-5" /> : '1'}
              </div>
              <div>
                <h3 className="text-lg font-semibold">Create Basic Tables</h3>
                <p className="text-sm text-gray-600">Set up the core database structure</p>
              </div>
            </div>
            <Button
              variant="outline"
              onClick={() => copyToClipboard(basicSchemaSql, 'Basic Schema')}
              className="flex items-center space-x-2"
            >
              {copiedSection === 'Basic Schema' ? (
                <>
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Copy SQL</span>
                </>
              )}
            </Button>
          </div>

          <div className="bg-gray-900 rounded-lg p-4 mb-4 text-sm font-mono text-gray-100 max-h-60 overflow-y-auto">
            <pre>{basicSchemaSql.split('\n').slice(0, 15).join('\n')}...</pre>
          </div>

          <div className="space-y-2">
            <p className="text-sm text-gray-700">
              1. Go to your <a href="https://supabase.com/dashboard" target="_blank" rel="noopener noreferrer" 
                 className="text-blue-600 hover:underline inline-flex items-center">
                Supabase Dashboard <ExternalLink className="w-3 h-3 ml-1" />
              </a>
            </p>
            <p className="text-sm text-gray-700">2. Navigate to SQL Editor</p>
            <p className="text-sm text-gray-700">3. Paste the copied SQL and click "Run"</p>
            <div className="pt-2">
              <Button 
                size="sm" 
                onClick={() => markStepComplete(1)}
                disabled={completedSteps.has(1)}
              >
                {completedSteps.has(1) ? 'Completed ✓' : 'Mark as Complete'}
              </Button>
            </div>
          </div>
        </Card>

        {}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                completedSteps.has(2) ? 'bg-green-500 text-white' : 'bg-blue-100 text-blue-600'
              }`}>
                {completedSteps.has(2) ? <CheckCircle className="w-5 h-5" /> : '2'}
              </div>
              <div>
                <h3 className="text-lg font-semibold">Add Functions & Triggers</h3>
                <p className="text-sm text-gray-600">Set up automated functions</p>
              </div>
            </div>
            <Button
              variant="outline"
              onClick={() => copyToClipboard(triggersSql, 'Triggers & Functions')}
              className="flex items-center space-x-2"
            >
              {copiedSection === 'Triggers & Functions' ? (
                <>
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Copy SQL</span>
                </>
              )}
            </Button>
          </div>

          <div className="bg-gray-900 rounded-lg p-4 mb-4 text-sm font-mono text-gray-100 max-h-60 overflow-y-auto">
            <pre>{triggersSql.split('\n').slice(0, 12).join('\n')}...</pre>
          </div>

          <div className="space-y-2">
            <p className="text-sm text-gray-700">1. Run this SQL in the same editor</p>
            <p className="text-sm text-gray-700">2. This adds automatic ID generation and timestamp updates</p>
            <div className="pt-2">
              <Button 
                size="sm" 
                onClick={() => markStepComplete(2)}
                disabled={completedSteps.has(2)}
              >
                {completedSteps.has(2) ? 'Completed ✓' : 'Mark as Complete'}
              </Button>
            </div>
          </div>
        </Card>

        {}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                completedSteps.has(3) ? 'bg-green-500 text-white' : 'bg-blue-100 text-blue-600'
              }`}>
                {completedSteps.has(3) ? <CheckCircle className="w-5 h-5" /> : '3'}
              </div>
              <div>
                <h3 className="text-lg font-semibold">Environmental Health System</h3>
                <p className="text-sm text-gray-600">Survey tables and Supercoins system</p>
              </div>
            </div>
            <Button
              variant="outline"
              onClick={() => copyToClipboard(environmentalSql, 'Environmental Schema')}
              className="flex items-center space-x-2"
            >
              {copiedSection === 'Environmental Schema' ? (
                <>
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Copy SQL</span>
                </>
              )}
            </Button>
          </div>

          <div className="bg-gray-900 rounded-lg p-4 mb-4 text-sm font-mono text-gray-100 max-h-60 overflow-y-auto">
            <pre>{environmentalSql.split('\n').slice(0, 15).join('\n')}...</pre>
          </div>

          <div className="space-y-2">
            <p className="text-sm text-gray-700">1. Run this SQL to add environmental survey features</p>
            <p className="text-sm text-gray-700">2. This includes Supercoins rewards and risk assessment</p>
            <div className="pt-2">
              <Button 
                size="sm" 
                onClick={() => markStepComplete(3)}
                disabled={completedSteps.has(3)}
              >
                {completedSteps.has(3) ? 'Completed ✓' : 'Mark as Complete'}
              </Button>
            </div>
          </div>
        </Card>

        {}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                completedSteps.has(4) ? 'bg-green-500 text-white' : 'bg-blue-100 text-blue-600'
              }`}>
                {completedSteps.has(4) ? <CheckCircle className="w-5 h-5" /> : '4'}
              </div>
              <div>
                <h3 className="text-lg font-semibold">Enable Security</h3>
                <p className="text-sm text-gray-600">Set up Row Level Security policies</p>
              </div>
            </div>
            <Button
              variant="outline"
              onClick={() => copyToClipboard(securitySql, 'Security Policies')}
              className="flex items-center space-x-2"
            >
              {copiedSection === 'Security Policies' ? (
                <>
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Copy SQL</span>
                </>
              )}
            </Button>
          </div>

          <div className="bg-gray-900 rounded-lg p-4 mb-4 text-sm font-mono text-gray-100 max-h-60 overflow-y-auto">
            <pre>{securitySql.split('\n').slice(0, 10).join('\n')}...</pre>
          </div>

          <div className="space-y-2">
            <p className="text-sm text-gray-700">1. Run this final SQL section</p>
            <p className="text-sm text-gray-700">2. This ensures users can only access their own data</p>
            <div className="pt-2">
              <Button 
                size="sm" 
                onClick={() => markStepComplete(4)}
                disabled={completedSteps.has(4)}
              >
                {completedSteps.has(4) ? 'Completed ✓' : 'Mark as Complete'}
              </Button>
            </div>
          </div>
        </Card>

        {}
        {completedSteps.size > 0 && (
          <Card className="p-6 bg-green-50 border-green-200">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-green-800">
                  Progress: {completedSteps.size}/4 steps completed
                </h3>
                <p className="text-sm text-green-700">
                  {completedSteps.size === 4 
                    ? '🎉 Setup complete! Your app is ready to use.' 
                    : 'Keep going! Your app will be ready soon.'}
                </p>
              </div>
            </div>
            
            {completedSteps.size === 4 && (
              <div className="mt-4">
                <Button onClick={onComplete} className="bg-green-600 hover:bg-green-700">
                  Continue to App
                </Button>
              </div>
            )}
          </Card>
        )}

        {}
        <Card className="p-6 bg-blue-50 border-blue-200">
          <h3 className="font-semibold text-blue-800 mb-2">Need Help?</h3>
          <div className="space-y-2 text-sm text-blue-700">
            <p>• Make sure you're logged into the correct Supabase project</p>
            <p>• If you get permission errors, check your Supabase project settings</p>
            <p>• The SQL commands are safe to run multiple times</p>
            <p>• Contact support if you encounter issues</p>
          </div>
        </Card>
      </div>
    </div>
  );
}