-- Survey Rewards and Med Coins System Schema
-- Extension to basic-schema.sql and environmental-health-schema.sql

-- 1. Add Med Coins to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS medcoins INTEGER DEFAULT 0 CHECK (medcoins >= 0);

-- 2. Create Med Coins Transactions table
CREATE TABLE IF NOT EXISTS public.medcoin_transactions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    
    -- Transaction Details
    transaction_type TEXT NOT NULL CHECK (transaction_type IN ('earned', 'spent', 'bonus', 'penalty')),
    amount INTEGER NOT NULL,
    description TEXT NOT NULL,
    
    -- Source/Reference
    source_type TEXT CHECK (source_type IN ('survey', 'consultation', 'referral', 'admin', 'discount')),
    source_id UUID, -- Reference to survey_id, appointment_id, etc.
    
    -- Balance tracking
    balance_before INTEGER NOT NULL,
    balance_after INTEGER NOT NULL,
    
    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID REFERENCES public.profiles(id) -- Admin who granted/deducted
);

-- 3. Create Survey Tips table
CREATE TABLE IF NOT EXISTS public.survey_tips (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    
    -- Risk-based tips
    risk_level TEXT NOT NULL CHECK (risk_level IN ('low', 'medium', 'high', 'critical')),
    category TEXT NOT NULL CHECK (category IN ('waste', 'water', 'sanitation', 'pest', 'disease', 'general')),
    
    -- Tip content (multilingual)
    tip_en TEXT NOT NULL,
    tip_hi TEXT,
    tip_pa TEXT,
    
    -- Targeting
    applies_to_waste_issues BOOLEAN DEFAULT FALSE,
    applies_to_water_issues BOOLEAN DEFAULT FALSE,
    applies_to_sanitation_issues BOOLEAN DEFAULT FALSE,
    applies_to_pest_issues BOOLEAN DEFAULT FALSE,
    applies_to_disease_issues BOOLEAN DEFAULT FALSE,
    
    -- Priority and status
    priority INTEGER DEFAULT 1 CHECK (priority >= 1 AND priority <= 10),
    is_active BOOLEAN DEFAULT TRUE,
    
    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Create Survey Rewards Configuration table
CREATE TABLE IF NOT EXISTS public.survey_reward_rules (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    
    -- Rule conditions
    rule_name TEXT UNIQUE NOT NULL,
    has_photo BOOLEAN DEFAULT FALSE,
    min_risk_score INTEGER DEFAULT 0,
    max_risk_score INTEGER DEFAULT 100,
    requires_all_fields BOOLEAN DEFAULT TRUE,
    
    -- Rewards
    base_medcoins INTEGER NOT NULL DEFAULT 0,
    bonus_medcoins INTEGER DEFAULT 0,
    bonus_condition TEXT, -- Description of bonus condition
    
    -- Status
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_medcoin_transactions_user_id ON medcoin_transactions(user_id);
CREATE INDEX idx_medcoin_transactions_type ON medcoin_transactions(transaction_type);
CREATE INDEX idx_medcoin_transactions_source ON medcoin_transactions(source_type, source_id);
CREATE INDEX idx_medcoin_transactions_created_at ON medcoin_transactions(created_at);

CREATE INDEX idx_survey_tips_risk_level ON survey_tips(risk_level);
CREATE INDEX idx_survey_tips_category ON survey_tips(category);
CREATE INDEX idx_survey_tips_active ON survey_tips(is_active);

CREATE INDEX idx_survey_reward_rules_active ON survey_reward_rules(is_active);

-- Functions for Survey API

-- 1. Function to calculate survey reward
CREATE OR REPLACE FUNCTION calculate_survey_reward(
    p_has_photo BOOLEAN,
    p_risk_score INTEGER,
    p_all_fields_filled BOOLEAN
) RETURNS INTEGER AS $$
DECLARE
    reward_amount INTEGER := 0;
    rule_record RECORD;
BEGIN
    -- Find applicable reward rule
    FOR rule_record IN 
        SELECT * FROM public.survey_reward_rules 
        WHERE is_active = TRUE
        AND (NOT has_photo OR p_has_photo = has_photo)
        AND p_risk_score >= min_risk_score 
        AND p_risk_score <= max_risk_score
        AND (NOT requires_all_fields OR p_all_fields_filled = requires_all_fields)
        ORDER BY base_medcoins DESC
        LIMIT 1
    LOOP
        reward_amount := rule_record.base_medcoins;
        
        -- Add bonus for high-risk areas
        IF p_risk_score >= 70 AND rule_record.bonus_medcoins > 0 THEN
            reward_amount := reward_amount + rule_record.bonus_medcoins;
        END IF;
        
        EXIT; -- Take first matching rule
    END LOOP;
    
    -- Default reward if no rules match
    IF reward_amount = 0 AND p_has_photo AND p_all_fields_filled THEN
        reward_amount := 10; -- Base reward
    END IF;
    
    RETURN reward_amount;
END;
$$ LANGUAGE plpgsql;

-- 2. Function to award medcoins
CREATE OR REPLACE FUNCTION award_medcoins(
    p_user_id UUID,
    p_amount INTEGER,
    p_description TEXT,
    p_source_type TEXT DEFAULT 'survey',
    p_source_id UUID DEFAULT NULL
) RETURNS TABLE (
    success BOOLEAN,
    new_balance INTEGER,
    transaction_id UUID
) AS $$
DECLARE
    current_balance INTEGER;
    new_balance_val INTEGER;
    transaction_id_val UUID;
BEGIN
    -- Get current balance
    SELECT COALESCE(medcoins, 0) INTO current_balance 
    FROM public.profiles 
    WHERE id = p_user_id;
    
    IF current_balance IS NULL THEN
        RETURN QUERY SELECT FALSE, 0, NULL::UUID;
        RETURN;
    END IF;
    
    -- Calculate new balance
    new_balance_val := current_balance + p_amount;
    
    -- Update user's balance
    UPDATE public.profiles 
    SET medcoins = new_balance_val,
        updated_at = NOW()
    WHERE id = p_user_id;
    
    -- Record transaction
    INSERT INTO public.medcoin_transactions (
        user_id,
        transaction_type,
        amount,
        description,
        source_type,
        source_id,
        balance_before,
        balance_after
    ) VALUES (
        p_user_id,
        'earned',
        p_amount,
        p_description,
        p_source_type,
        p_source_id,
        current_balance,
        new_balance_val
    ) RETURNING id INTO transaction_id_val;
    
    RETURN QUERY SELECT TRUE, new_balance_val, transaction_id_val;
END;
$$ LANGUAGE plpgsql;

-- 3. Function to get relevant tips based on survey responses
CREATE OR REPLACE FUNCTION get_survey_tips(
    p_risk_score INTEGER,
    p_waste_issues BOOLEAN,
    p_water_issues BOOLEAN,
    p_sanitation_issues BOOLEAN,
    p_pest_issues BOOLEAN,
    p_disease_issues BOOLEAN,
    p_language TEXT DEFAULT 'en'
) RETURNS TABLE (
    tip TEXT,
    category TEXT,
    priority INTEGER
) AS $$
DECLARE
    risk_level_val TEXT;
BEGIN
    -- Determine risk level
    IF p_risk_score >= 80 THEN
        risk_level_val := 'critical';
    ELSIF p_risk_score >= 60 THEN
        risk_level_val := 'high';
    ELSIF p_risk_score >= 40 THEN
        risk_level_val := 'medium';
    ELSE
        risk_level_val := 'low';
    END IF;
    
    -- Return relevant tips
    RETURN QUERY
    SELECT 
        CASE 
            WHEN p_language = 'hi' AND tip_hi IS NOT NULL THEN tip_hi
            WHEN p_language = 'pa' AND tip_pa IS NOT NULL THEN tip_pa
            ELSE tip_en
        END as tip,
        st.category,
        st.priority
    FROM public.survey_tips st
    WHERE st.is_active = TRUE
    AND st.risk_level = risk_level_val
    AND (
        NOT st.applies_to_waste_issues OR p_waste_issues = st.applies_to_waste_issues
    )
    AND (
        NOT st.applies_to_water_issues OR p_water_issues = st.applies_to_water_issues
    )
    AND (
        NOT st.applies_to_sanitation_issues OR p_sanitation_issues = st.applies_to_sanitation_issues
    )
    AND (
        NOT st.applies_to_pest_issues OR p_pest_issues = st.applies_to_pest_issues
    )
    AND (
        NOT st.applies_to_disease_issues OR p_disease_issues = st.applies_to_disease_issues
    )
    ORDER BY st.priority DESC, st.created_at DESC
    LIMIT 5;
END;
$$ LANGUAGE plpgsql;

-- 4. Main survey submission function
CREATE OR REPLACE FUNCTION submit_environmental_survey(
    p_user_id UUID,
    p_location_name TEXT,
    p_coordinates POINT DEFAULT NULL,
    p_area_code TEXT DEFAULT NULL,
    p_waste_disposal BOOLEAN,
    p_stagnant_water BOOLEAN,
    p_sanitation_frequency TEXT,
    p_pest_infestation BOOLEAN,
    p_disease_reports BOOLEAN,
    p_disease_details TEXT DEFAULT NULL,
    p_additional_comments TEXT DEFAULT NULL,
    p_photo_url TEXT DEFAULT NULL,
    p_language TEXT DEFAULT 'en'
) RETURNS TABLE (
    success BOOLEAN,
    message TEXT,
    survey_id UUID,
    tips TEXT[],
    medcoins_awarded INTEGER,
    total_medcoins INTEGER,
    risk_score INTEGER
) AS $$
DECLARE
    survey_id_val UUID;
    risk_score_val INTEGER;
    has_photo BOOLEAN;
    all_fields_filled BOOLEAN;
    reward_amount INTEGER;
    award_result RECORD;
    tips_array TEXT[];
    tip_record RECORD;
BEGIN
    -- Validate input
    IF p_user_id IS NULL OR p_location_name IS NULL OR p_location_name = '' THEN
        RETURN QUERY SELECT FALSE, 'Invalid input data'::TEXT, NULL::UUID, NULL::TEXT[], 0, 0, 0;
        RETURN;
    END IF;
    
    -- Check if all fields are filled
    has_photo := p_photo_url IS NOT NULL AND p_photo_url != '';
    all_fields_filled := p_location_name IS NOT NULL AND p_location_name != ''
                        AND p_sanitation_frequency IS NOT NULL 
                        AND p_sanitation_frequency IN ('daily', 'weekly', 'rarely', 'never');
    
    -- Insert survey
    INSERT INTO public.environmental_surveys (
        user_id,
        location_name,
        coordinates,
        area_code,
        waste_disposal,
        stagnant_water,
        sanitation_frequency,
        pest_infestation,
        disease_reports,
        disease_details,
        additional_comments
    ) VALUES (
        p_user_id,
        p_location_name,
        p_coordinates,
        p_area_code,
        p_waste_disposal,
        p_stagnant_water,
        p_sanitation_frequency,
        p_pest_infestation,
        p_disease_reports,
        p_disease_details,
        p_additional_comments
    ) RETURNING id, public.environmental_surveys.risk_score INTO survey_id_val, risk_score_val;
    
    -- Insert photo if provided
    IF has_photo THEN
        INSERT INTO public.survey_photos (survey_id, photo_url)
        VALUES (survey_id_val, p_photo_url);
    END IF;
    
    -- Calculate and award medcoins
    reward_amount := calculate_survey_reward(has_photo, risk_score_val, all_fields_filled);
    
    IF reward_amount > 0 THEN
        SELECT * INTO award_result FROM award_medcoins(
            p_user_id,
            reward_amount,
            'Environmental survey submission - ' || p_location_name,
            'survey',
            survey_id_val
        );
    END IF;
    
    -- Get relevant tips
    FOR tip_record IN 
        SELECT * FROM get_survey_tips(
            risk_score_val,
            NOT p_waste_disposal, -- waste issues if disposal is false
            p_stagnant_water,     -- water issues if stagnant water present
            p_sanitation_frequency IN ('rarely', 'never'), -- sanitation issues
            p_pest_infestation,   -- pest issues
            p_disease_reports,    -- disease issues
            p_language
        )
    LOOP
        tips_array := array_append(tips_array, tip_record.tip);
    END LOOP;
    
    -- Ensure we have at least some basic tips
    IF array_length(tips_array, 1) IS NULL OR array_length(tips_array, 1) = 0 THEN
        CASE p_language
            WHEN 'hi' THEN
                tips_array := ARRAY[
                    'कचरे को निर्दिष्ट डिब्बों में डालें',
                    'पानी के जमाव से बचें',
                    'स्वच्छता बनाए रखें'
                ];
            WHEN 'pa' THEN
                tips_array := ARRAY[
                    'ਕੂੜੇ ਨੂੰ ਨਿਰਧਾਰਤ ਡੱਬਿਆਂ ਵਿੱਚ ਪਾਓ',
                    'ਪਾਣੀ ਦੇ ਇਕੱਠ ਤੋਂ ਬਚੋ',
                    'ਸਫਾਈ ਬਣਾਈ ਰੱਖੋ'
                ];
            ELSE
                tips_array := ARRAY[
                    'Dispose waste in designated bins',
                    'Avoid stagnant water accumulation', 
                    'Maintain cleanliness around your home'
                ];
        END CASE;
    END IF;
    
    RETURN QUERY SELECT 
        TRUE,
        'Survey submitted successfully'::TEXT,
        survey_id_val,
        tips_array,
        COALESCE(reward_amount, 0),
        COALESCE(award_result.new_balance, 0),
        risk_score_val;
END;
$$ LANGUAGE plpgsql;

-- RLS Policies for new tables
ALTER TABLE public.medcoin_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.survey_tips ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.survey_reward_rules ENABLE ROW LEVEL SECURITY;

-- Users can view their own transactions
CREATE POLICY "Users can view own transactions" ON public.medcoin_transactions
    FOR SELECT USING (auth.uid() = user_id);

-- Public read for tips (public health information)
CREATE POLICY "Public read for survey tips" ON public.survey_tips
    FOR SELECT USING (is_active = true);

-- Admins only for reward rules
CREATE POLICY "Admins manage reward rules" ON public.survey_reward_rules
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() 
            AND user_type = 'admin'
        )
    );

-- Insert default reward rules
INSERT INTO public.survey_reward_rules (rule_name, has_photo, requires_all_fields, base_medcoins, bonus_medcoins, bonus_condition)
VALUES 
    ('Complete Survey with Photo', TRUE, TRUE, 10, 5, 'Bonus for high-risk areas (score >= 70)'),
    ('Complete Survey without Photo', FALSE, TRUE, 8, 3, 'Bonus for high-risk areas (score >= 70)'),
    ('Partial Survey with Photo', TRUE, FALSE, 5, 2, 'Bonus for high-risk areas (score >= 70)'),
    ('Basic Survey', FALSE, FALSE, 3, 1, 'Minimal reward for any submission')
ON CONFLICT (rule_name) DO NOTHING;

-- Insert default tips
INSERT INTO public.survey_tips (risk_level, category, tip_en, tip_hi, tip_pa, applies_to_waste_issues, priority)
VALUES 
    ('high', 'waste', 'Dispose waste in designated bins immediately', 'कचरे को तुरंत निर्दिष्ट डिब्बों में डालें', 'ਕੂੜੇ ਨੂੰ ਤੁਰੰਤ ਨਿਰਧਾਰਤ ਡੱਬਿਆਂ ਵਿੱਚ ਪਾਓ', TRUE, 9),
    ('high', 'water', 'Remove all stagnant water sources around your home', 'अपने घर के आसपास के सभी स्थिर पानी के स्रोतों को हटा दें', 'ਆਪਣੇ ਘਰ ਦੇ ਆਲੇ-ਦੁਆਲੇ ਸਾਰੇ ਰੁਕੇ ਹੋਏ ਪਾਣੀ ਦੇ ਸਰੋਤਾਂ ਨੂੰ ਹਟਾਓ', TRUE, 10),
    ('high', 'pest', 'Contact local authorities for pest control immediately', 'कीट नियंत्रण के लिए तुरंत स्थानीय अधिकारियों से संपर्क करें', 'ਕੀਟ ਨਿਯੰਤਰਣ ਲਈ ਤੁਰੰਤ ਸਥਾਨਕ ਅਧਿਕਾਰੀਆਂ ਨਾਲ ਸੰਪਰਕ ਕਰੋ', TRUE, 8),
    ('medium', 'general', 'Maintain regular cleaning schedule', 'नियमित सफाई का कार्यक्रम बनाए रखें', 'ਨਿਯਮਿਤ ਸਫਾਈ ਦਾ ਕਾਰਯਕਰਮ ਬਣਾਈ ਰੱਖੋ', FALSE, 5),
    ('low', 'general', 'Keep up the good work maintaining cleanliness', 'स्वच्छता बनाए रखने का अच्छा काम जारी रखें', 'ਸਫਾਈ ਬਣਾਈ ਰੱਖਣ ਦਾ ਚੰਗਾ ਕੰਮ ਜਾਰੀ ਰੱਖੋ', FALSE, 3)
ON CONFLICT DO NOTHING;