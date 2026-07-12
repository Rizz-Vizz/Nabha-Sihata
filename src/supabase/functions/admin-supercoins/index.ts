import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface AdminAwardRequest {
  userId: string;
  amount: number;
  description: string;
  type?: 'bonus' | 'penalty';
}

interface AdminSpendRequest {
  userId: string;
  amount: number;
  description: string;
  serviceType?: string;
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

    
    const { data: profile } = await supabaseClient
      .from('profiles')
      .select('user_type')
      .eq('id', user.id)
      .single()

    if (!profile || !['admin', 'doctor'].includes(profile.user_type)) {
      return new Response(
        JSON.stringify({ error: 'Forbidden: Admin privileges required' }),
        {
          status: 403,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    const url = new URL(req.url)
    const action = url.searchParams.get('action')

    
    switch (req.method) {
      case 'POST':
        if (action === 'award') {
          return await handleAwardSupercoins(req, supabaseClient, user.id)
        } else if (action === 'spend') {
          return await handleSpendSupercoins(req, supabaseClient, user.id)
        } else {
          return new Response(
            JSON.stringify({ error: 'Invalid action. Use ?action=award or ?action=spend' }),
            {
              status: 400,
              headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            }
          )
        }

      case 'GET':
        if (action === 'stats') {
          return await handleGetStats(supabaseClient)
        } else if (action === 'transactions') {
          return await handleGetAllTransactions(req, supabaseClient)
        } else {
          return new Response(
            JSON.stringify({ error: 'Invalid action. Use ?action=stats or ?action=transactions' }),
            {
              status: 400,
              headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            }
          )
        }

      default:
        return new Response(
          JSON.stringify({ error: 'Method not allowed' }),
          {
            status: 405,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        )
    }

  } catch (error) {
    console.error('Admin API Error:', error)
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

async function handleAwardSupercoins(req: Request, supabaseClient: any, adminId: string) {
  const body: AdminAwardRequest = await req.json()

  if (!body.userId || !body.amount || !body.description) {
    return new Response(
      JSON.stringify({ error: 'Missing required fields: userId, amount, description' }),
      {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }

  if (body.amount <= 0) {
    return new Response(
      JSON.stringify({ error: 'Amount must be positive' }),
      {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }

  
  const { data: result, error } = await supabaseClient.rpc('award_supercoins', {
    p_user_id: body.userId,
    p_amount: body.amount,
    p_description: `Admin ${body.type || 'bonus'}: ${body.description}`,
    p_source_type: 'admin',
    p_source_id: null
  })

  if (error) {
    return new Response(
      JSON.stringify({ error: 'Failed to award supercoins', details: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }

  const awardResult = result[0]

  return new Response(
    JSON.stringify({
      message: 'Supercoins awarded successfully',
      userId: body.userId,
      amountAwarded: body.amount,
      newBalance: awardResult.new_balance,
      transactionId: awardResult.transaction_id
    }),
    {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    }
  )
}

async function handleSpendSupercoins(req: Request, supabaseClient: any, adminId: string) {
  const body: AdminSpendRequest = await req.json()

  if (!body.userId || !body.amount || !body.description) {
    return new Response(
      JSON.stringify({ error: 'Missing required fields: userId, amount, description' }),
      {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }

  if (body.amount <= 0) {
    return new Response(
      JSON.stringify({ error: 'Amount must be positive' }),
      {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }

  
  const { data: userProfile } = await supabaseClient
    .from('profiles')
    .select('supercoins')
    .eq('id', body.userId)
    .single()

  if (!userProfile || userProfile.supercoins < body.amount) {
    return new Response(
      JSON.stringify({ 
        error: 'Insufficient supercoins balance',
        currentBalance: userProfile?.supercoins || 0,
        requested: body.amount
      }),
      {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }

  
  const newBalance = userProfile.supercoins - body.amount

  const { error: updateError } = await supabaseClient
    .from('profiles')
    .update({ supercoins: newBalance })
    .eq('id', body.userId)

  if (updateError) {
    return new Response(
      JSON.stringify({ error: 'Failed to update balance', details: updateError.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }

  
  const { data: transaction, error: transError } = await supabaseClient
    .from('supercoin_transactions')
    .insert({
      user_id: body.userId,
      transaction_type: 'spent',
      amount: body.amount,
      description: `Service: ${body.description}`,
      source_type: body.serviceType || 'discount',
      balance_before: userProfile.supercoins,
      balance_after: newBalance,
      created_by: adminId
    })
    .select()
    .single()

  if (transError) {
    console.error('Transaction recording failed:', transError)
  }

  return new Response(
    JSON.stringify({
      message: 'Supercoins spent successfully',
      userId: body.userId,
      amountSpent: body.amount,
      newBalance: newBalance,
      transactionId: transaction?.id
    }),
    {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    }
  )
}

async function handleGetStats(supabaseClient: any) {
  
  const { data: userStats } = await supabaseClient
    .from('profiles')
    .select('supercoins, user_type')
    .neq('supercoins', null)

  const { data: transactionStats } = await supabaseClient
    .from('supercoin_transactions')
    .select('transaction_type, amount, source_type, created_at')

  const stats = {
    totalUsers: userStats?.length || 0,
    totalSupercoinsInCirculation: userStats?.reduce((sum, u) => sum + (u.supercoins || 0), 0) || 0,
    patientUsers: userStats?.filter(u => u.user_type === 'patient').length || 0,
    averageBalance: userStats?.length > 0 ? 
      Math.round((userStats.reduce((sum, u) => sum + (u.supercoins || 0), 0) / userStats.length) * 100) / 100 : 0,
    
    transactions: {
      total: transactionStats?.length || 0,
      totalEarned: transactionStats?.filter(t => ['earned', 'bonus'].includes(t.transaction_type))
        .reduce((sum, t) => sum + t.amount, 0) || 0,
      totalSpent: transactionStats?.filter(t => ['spent', 'penalty'].includes(t.transaction_type))
        .reduce((sum, t) => sum + t.amount, 0) || 0,
      surveyRewards: transactionStats?.filter(t => t.source_type === 'survey').length || 0,
      adminTransactions: transactionStats?.filter(t => t.source_type === 'admin').length || 0,
    },

    recentActivity: transactionStats?.slice(-10).map(t => ({
      type: t.transaction_type,
      amount: t.amount,
      source: t.source_type,
      date: t.created_at
    })) || []
  }

  return new Response(
    JSON.stringify(stats),
    {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    }
  )
}

async function handleGetAllTransactions(req: Request, supabaseClient: any) {
  const url = new URL(req.url)
  const limit = parseInt(url.searchParams.get('limit') || '50')
  const offset = parseInt(url.searchParams.get('offset') || '0')
  const userId = url.searchParams.get('userId')

  let query = supabaseClient
    .from('supercoin_transactions')
    .select(`
      id,
      user_id,
      transaction_type,
      amount,
      description,
      source_type,
      source_id,
      balance_before,
      balance_after,
      created_at,
      profiles!user_id(name, health_card_id)
    `)
    .range(offset, offset + limit - 1)
    .order('created_at', { ascending: false })

  if (userId) {
    query = query.eq('user_id', userId)
  }

  const { data: transactions, error } = await query

  if (error) {
    return new Response(
      JSON.stringify({ error: 'Failed to fetch transactions', details: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }

  return new Response(
    JSON.stringify({
      transactions: transactions || [],
      pagination: {
        limit,
        offset,
        hasMore: (transactions?.length || 0) === limit
      }
    }),
    {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    }
  )
}