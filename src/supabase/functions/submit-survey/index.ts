import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface SurveySubmissionRequest {
  patientId: string;
  localityId?: string;
  wasteStatus: boolean; 
  stagnantWater: boolean;
  pestInfestation: boolean;
  sanitationFrequency: 'daily' | 'weekly' | 'rarely' | 'never';
  photoURL?: string;
  locationName: string;
  coordinates?: { lat: number; lng: number };
  areaCode?: string;
  diseaseReports?: boolean;
  diseaseDetails?: string;
  additionalComments?: string;
  language?: 'en' | 'hi' | 'pa';
}

interface SurveySubmissionResponse {
  message: string;
  tips: string[];
  supercoinsAwarded: number;
  totalSupercoins: number;
  surveyId: string;
  riskScore: number;
}

serve(async (req) => {
  
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    )

    
    const {
      data: { user },
    } = await supabaseClient.auth.getUser()

    if (!user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        {
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    
    if (req.method !== 'POST') {
      return new Response(
        JSON.stringify({ error: 'Method not allowed' }),
        {
          status: 405,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    
    const body: SurveySubmissionRequest = await req.json()

    
    if (!body.patientId || !body.locationName) {
      return new Response(
        JSON.stringify({ 
          error: 'Missing required fields: patientId and locationName are required' 
        }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    
    if (user.id !== body.patientId) {
      
      const { data: profile } = await supabaseClient
        .from('profiles')
        .select('user_type')
        .eq('id', user.id)
        .single()

      if (!profile || !['doctor', 'admin'].includes(profile.user_type)) {
        return new Response(
          JSON.stringify({ error: 'Forbidden: Cannot submit survey for another user' }),
          {
            status: 403,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        )
      }
    }

    
    let coordinatesPoint = null
    if (body.coordinates) {
      coordinatesPoint = `POINT(${body.coordinates.lng} ${body.coordinates.lat})`
    }

    
    const { data: result, error } = await supabaseClient.rpc('submit_environmental_survey', {
      p_user_id: body.patientId,
      p_location_name: body.locationName,
      p_coordinates: coordinatesPoint,
      p_area_code: body.areaCode || null,
      p_waste_disposal: body.wasteStatus, 
      p_stagnant_water: body.stagnantWater,
      p_sanitation_frequency: body.sanitationFrequency,
      p_pest_infestation: body.pestInfestation,
      p_disease_reports: body.diseaseReports || false,
      p_disease_details: body.diseaseDetails || null,
      p_additional_comments: body.additionalComments || null,
      p_photo_url: body.photoURL || null,
      p_language: body.language || 'en'
    })

    if (error) {
      console.error('Survey submission error:', error)
      return new Response(
        JSON.stringify({ 
          error: 'Survey submission failed', 
          details: error.message 
        }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    if (!result || result.length === 0) {
      return new Response(
        JSON.stringify({ error: 'No result returned from survey submission' }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    const surveyResult = result[0]

    if (!surveyResult.success) {
      return new Response(
        JSON.stringify({ 
          error: 'Survey submission failed', 
          details: surveyResult.message 
        }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    
    const response: SurveySubmissionResponse = {
      message: surveyResult.message,
      tips: surveyResult.tips || [],
      supercoinsAwarded: surveyResult.supercoins_awarded || 0,
      totalSupercoins: surveyResult.total_supercoins || 0,
      surveyId: surveyResult.survey_id,
      riskScore: surveyResult.risk_score || 0
    }

    return new Response(
      JSON.stringify(response),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )

  } catch (error) {
    console.error('API Error:', error)
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error', 
        details: error.message 
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }
})