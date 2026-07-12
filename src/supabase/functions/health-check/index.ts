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
    
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    )

    // Test database connectivity
    const { data, error } = await supabaseClient
      .from('system_settings')
      .select('setting_key')
      .eq('setting_key', 'app_version')
      .limit(1)

    const status = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      database: error ? 'error' : 'connected',
      error: error?.message || null,
      version: '1.0.0'
    }

    return new Response(
      JSON.stringify(status),
      {
        status: error ? 500 : 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )

  } catch (error) {
    console.error('Health check failed:', error)
    return new Response(
      JSON.stringify({ 
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        error: error.message 
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }
})