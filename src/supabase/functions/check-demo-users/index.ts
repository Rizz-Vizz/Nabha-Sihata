import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    )

    // Only allow GET requests for checking
    if (req.method !== 'GET') {
      return new Response(
        JSON.stringify({ error: 'Method not allowed' }),
        {
          status: 405,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    
    const { data: existingUsers } = await supabaseAdmin.auth.admin.listUsers()
    
    const demoPatientExists = existingUsers?.users?.find(u => u.email === 'demo.patient@nabhasihata.com')
    const demoDoctorExists = existingUsers?.users?.find(u => u.email === 'demo.doctor@nabhasihata.com')

    const status = {
      patient: demoPatientExists ? 'exists' : 'missing',
      doctor: demoDoctorExists ? 'exists' : 'missing',
      bothExist: demoPatientExists && demoDoctorExists,
      patientId: demoPatientExists?.id || null,
      doctorId: demoDoctorExists?.id || null
    }

    return new Response(
      JSON.stringify({
        message: 'Demo user status checked',
        status: status,
        timestamp: new Date().toISOString()
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )

  } catch (error) {
    console.error('Demo user check failed:', error)
    return new Response(
      JSON.stringify({ 
        error: 'Failed to check demo users', 
        details: error.message 
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }
})