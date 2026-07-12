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

    // Only allow POST requests
    if (req.method !== 'POST') {
      return new Response(
        JSON.stringify({ error: 'Method not allowed' }),
        {
          status: 405,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    
    const requestBody = await req.json().catch(() => ({}))
    
    
    if (requestBody.action === 'repair_profile' && requestBody.email) {
      try {
        console.log(`Attempting to repair profile for: ${requestBody.email}`)
        
        
        const { data: existingUsers } = await supabaseAdmin.auth.admin.listUsers()
        const user = existingUsers?.users?.find(u => u.email === requestBody.email)
        
        if (!user) {
          return new Response(
            JSON.stringify({ error: 'User not found' }),
            {
              status: 404,
              headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            }
          )
        }

        
        let profileData: any = {
          id: user.id,
          name: user.user_metadata?.name || user.email?.split('@')[0] || 'User',
          phone: user.user_metadata?.phone || '',
          is_active: true,
          profile_complete: true
        }

        // Set user type and type-specific fields
        if (requestBody.email.includes('patient')) {
          profileData.user_type = 'patient'
          profileData.village = 'Nabha Village'
          profileData.age = 30
        } else if (requestBody.email.includes('doctor')) {
          profileData.user_type = 'doctor'
          profileData.specialty = 'General Medicine'
          profileData.license_number = 'DEMO123'
          profileData.hospital = 'Nabha PHC'
        } else {
          profileData.user_type = user.user_metadata?.user_type || 'patient'
        }

        
        const { error: profileError } = await supabaseAdmin
          .from('profiles')
          .upsert(profileData, { onConflict: 'id' })

        if (profileError) {
          console.error('Profile repair failed:', profileError)
          return new Response(
            JSON.stringify({ 
              error: 'Profile repair failed', 
              details: profileError.message 
            }),
            {
              status: 500,
              headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            }
          )
        }

        console.log(`Profile repaired successfully for: ${requestBody.email}`)
        
        return new Response(
          JSON.stringify({
            message: 'Profile repaired successfully',
            email: requestBody.email,
            profile: profileData
          }),
          {
            status: 200,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        )

      } catch (repairError: any) {
        console.error('Profile repair error:', repairError)
        return new Response(
          JSON.stringify({ 
            error: 'Profile repair failed', 
            details: repairError.message 
          }),
          {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        )
      }
    }

    const results = []

    
    const demoUsers = [
      {
        type: 'patient',
        email: 'demo.patient@nabhasihata.com',
        password: 'demo123',
        name: 'Demo Patient',
        phone: '+91 9876543210',
        village: 'Nabha',
        age: 35,
        user_type: 'patient'
      },
      {
        type: 'doctor', 
        email: 'demo.doctor@nabhasihata.com',
        password: 'demo123',
        name: 'Dr. Demo Singh',
        phone: '+91 9876543211',
        specialty: 'General Medicine',
        license_number: 'DMO12345',
        hospital: 'Civil Hospital Nabha',
        user_type: 'doctor'
      }
    ]

    
    for (const userData of demoUsers) {
      try {
        
        const { data: existingUsers } = await supabaseAdmin.auth.admin.listUsers()
        const userExists = existingUsers?.users?.find(u => u.email === userData.email)

        if (userExists) {
          console.log(`Demo ${userData.type} already exists`)
          results.push({
            type: userData.type,
            email: userData.email,
            status: 'already_exists',
            message: `Demo ${userData.type} already exists`
          })
          continue
        }

        
        const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
          email: userData.email,
          password: userData.password,
          email_confirm: true, 
          user_metadata: {
            name: userData.name,
            user_type: userData.user_type
          }
        })

        if (authError) {
          console.error(`Failed to create demo ${userData.type}:`, authError)
          results.push({
            type: userData.type,
            email: userData.email,
            status: 'error',
            message: authError.message
          })
          continue
        }

        console.log(`Demo ${userData.type} created successfully`)

        
        try {
          const profileData: any = {
            id: authData.user.id,
            user_type: userData.user_type,
            name: userData.name,
            phone: userData.phone,
            is_active: true,
            profile_complete: true
          }

          
          if (userData.type === 'patient') {
            profileData.village = userData.village
            profileData.age = userData.age
          } else if (userData.type === 'doctor') {
            profileData.specialty = userData.specialty
            profileData.license_number = userData.license_number
            profileData.hospital = userData.hospital
          }

          const { error: profileError } = await supabaseAdmin
            .from('profiles')
            .insert(profileData)

          if (profileError) {
            console.log(`Profile creation failed for ${userData.type}:`, profileError.message)
            
          } else {
            console.log(`Profile created for demo ${userData.type}`)
          }
        } catch (profileError) {
          console.log(`Profile creation skipped for ${userData.type} (table may not exist)`)
        }

        results.push({
          type: userData.type,
          email: userData.email,
          status: 'created',
          message: `Demo ${userData.type} created successfully`
        })

      } catch (error: any) {
        console.error(`Error creating demo ${userData.type}:`, error)
        results.push({
          type: userData.type,
          email: userData.email,
          status: 'error',
          message: error.message
        })
      }
    }

    return new Response(
      JSON.stringify({
        message: 'Demo user creation completed',
        results: results,
        success_count: results.filter(r => r.status === 'created' || r.status === 'already_exists').length
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )

  } catch (error) {
    console.error('Demo user creation failed:', error)
    return new Response(
      JSON.stringify({ 
        error: 'Failed to create demo users', 
        details: error.message 
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }
})