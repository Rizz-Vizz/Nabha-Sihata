import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface UserSupercoinsResponse {
  userId: string;
  currentBalance: number;
  totalEarned: number;
  totalSpent: number;
  recentTransactions: Array<{
    id: string;
    type: 'earned' | 'spent' | 'bonus' | 'penalty';
    amount: number;
    description: string;
    source: string;
    createdAt: string;
    balanceAfter: number;
  }>;
  surveyStats: {
    totalSurveys: number;
    surveysWithRewards: number;
    avgRiskScore: number;
    lastSurveyDate?: string;
  };
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

    
    if (req.method !== 'GET') {
      return new Response(
        JSON.stringify({ error: 'Method not allowed' }),
        {
          status: 405,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    
    const url = new URL(req.url)
    const userId = url.searchParams.get('userId') || user.id

    
    if (user.id !== userId) {
      const { data: profile } = await supabaseClient
        .from('profiles')
        .select('user_type')
        .eq('id', user.id)
        .single()

      if (!profile || !['doctor', 'admin'].includes(profile.user_type)) {
        return new Response(
          JSON.stringify({ error: 'Forbidden: Cannot access another user\'s data' }),
          {
            status: 403,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        )
      }
    }

    
    const { data: userProfile, error: profileError } = await supabaseClient
      .from('profiles')
      .select('supercoins')
      .eq('id', userId)
      .single()

    if (profileError || !userProfile) {
      return new Response(
        JSON.stringify({ error: 'User not found' }),
        {
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    
    const { data: transactions, error: transError } = await supabaseClient
      .from('supercoin_transactions')
      .select(`
        id,
        transaction_type,
        amount,
        description,
        source_type,
        created_at,
        balance_after
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(20)

    if (transError) {
      console.error('Transaction query error:', transError)
    }

    
    const { data: totals, error: totalsError } = await supabaseClient
      .from('supercoin_transactions')
      .select('transaction_type, amount')
      .eq('user_id', userId)

    let totalEarned = 0
    let totalSpent = 0

    if (totals && !totalsError) {
      totals.forEach(t => {
        if (t.transaction_type === 'earned' || t.transaction_type === 'bonus') {
          totalEarned += t.amount
        } else if (t.transaction_type === 'spent' || t.transaction_type === 'penalty') {
          totalSpent += t.amount
        }
      })
    }

    
    const { data: surveyStats, error: surveyError } = await supabaseClient
      .from('environmental_surveys')
      .select('risk_score, submitted_at')
      .eq('user_id', userId)

    let surveyStatsData = {
      totalSurveys: 0,
      surveysWithRewards: 0,
      avgRiskScore: 0,
      lastSurveyDate: undefined as string | undefined
    }

    if (surveyStats && !surveyError && surveyStats.length > 0) {
      surveyStatsData.totalSurveys = surveyStats.length
      surveyStatsData.avgRiskScore = Math.round(
        surveyStats.reduce((sum, s) => sum + (s.risk_score || 0), 0) / surveyStats.length
      )
      surveyStatsData.lastSurveyDate = surveyStats[0]?.submitted_at

      
      const { data: rewardedSurveys } = await supabaseClient
        .from('supercoin_transactions')
        .select('source_id')
        .eq('user_id', userId)
        .eq('source_type', 'survey')

      surveyStatsData.surveysWithRewards = rewardedSurveys?.length || 0
    }

    
    const response: UserSupercoinsResponse = {
      userId,
      currentBalance: userProfile.supercoins || 0,
      totalEarned,
      totalSpent,
      recentTransactions: (transactions || []).map(t => ({
        id: t.id,
        type: t.transaction_type as any,
        amount: t.amount,
        description: t.description,
        source: t.source_type || 'unknown',
        createdAt: t.created_at,
        balanceAfter: t.balance_after
      })),
      surveyStats: surveyStatsData
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