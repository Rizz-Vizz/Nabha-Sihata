

const SUPABASE_URL = 'your_supabase_url_here';
const SUPABASE_ANON_KEY = 'your_supabase_anon_key_here';
const USER_ACCESS_TOKEN = 'your_user_access_token_here'; 


async function testAPI(endpoint, options = {}) {
  const url = `${SUPABASE_URL}/functions/v1/${endpoint}`;
  
  const response = await fetch(url, {
    method: options.method || 'GET',
    headers: {
      'Authorization': `Bearer ${USER_ACCESS_TOKEN}`,
      'Content-Type': 'application/json',
      'apikey': SUPABASE_ANON_KEY,
      ...options.headers
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  const data = await response.json();
  
  if (!response.ok) {
    console.error(`❌ ${endpoint} failed:`, data);
    return null;
  }

  console.log(`✅ ${endpoint} success:`, data);
  return data;
}


async function testSurveySubmission() {
  console.log('\n📝 Testing Survey Submission...');
  
  const surveyData = {
    patientId: 'user_id_here', 
    locationName: 'Test Location - Nabha Central',
    wasteStatus: false,        
    stagnantWater: true,       
    pestInfestation: true,     
    sanitationFrequency: 'rarely',
    photoURL: 'https://example.com/test-photo.jpg',
    coordinates: {
      lat: 30.3752,
      lng: 76.1463
    },
    areaCode: '140901',
    diseaseReports: false,
    diseaseDetails: null,
    additionalComments: 'Test survey submission from API test',
    language: 'en'
  };

  return await testAPI('submit-survey', {
    method: 'POST',
    body: surveyData
  });
}


async function testUserSupercoins() {
  console.log('\n💰 Testing User Supercoins Fetch...');
  
  return await testAPI('user-supercoins');
}


async function testAdminStats() {
  console.log('\n📊 Testing Admin Stats...');
  
  return await testAPI('admin-supercoins?action=stats');
}


async function testAwardSupercoins() {
  console.log('\n🎁 Testing Award Supercoins...');
  
  const awardData = {
    userId: 'target_user_id_here', 
    amount: 25,
    description: 'Test bonus from API test',
    type: 'bonus'
  };

  return await testAPI('admin-supercoins?action=award', {
    method: 'POST',
    body: awardData
  });
}


async function testGetTransactions() {
  console.log('\n📋 Testing Get Transactions...');
  
  return await testAPI('admin-supercoins?action=transactions&limit=10');
}


async function runAllTests() {
  console.log('🚀 Starting Environmental Survey API Tests...');
  console.log('Make sure to update the configuration variables first!');
  
  try {
    
    const surveyResult = await testSurveySubmission();
    const supercoinsResult = await testUserSupercoins();
    
    
    const statsResult = await testAdminStats();
    const awardResult = await testAwardSupercoins();
    const transactionsResult = await testGetTransactions();
    
    console.log('\n✅ All tests completed! Check results above.');
    
    
    console.log('\n📊 Test Summary:');
    console.log('- Survey Submission:', surveyResult ? '✅ Success' : '❌ Failed');
    console.log('- User Supercoins:', supercoinsResult ? '✅ Success' : '❌ Failed');
    console.log('- Admin Stats:', statsResult ? '✅ Success' : '❌ Failed');
    console.log('- Award Supercoins:', awardResult ? '✅ Success' : '❌ Failed');
    console.log('- Get Transactions:', transactionsResult ? '✅ Success' : '❌ Failed');
    
  } catch (error) {
    console.error('❌ Test execution failed:', error);
  }
}


const databaseTests = `
-- Test 1: Check if reward calculation works
SELECT calculate_survey_reward(true, 85, true) as reward_high_risk;
SELECT calculate_survey_reward(false, 25, true) as reward_low_risk;
SELECT calculate_survey_reward(true, 45, false) as reward_incomplete;

-- Test 2: Check tip generation
SELECT * FROM get_survey_tips(85, true, true, false, true, false, 'en');
SELECT * FROM get_survey_tips(25, false, false, false, false, false, 'hi');

-- Test 3: Test survey submission function
SELECT * FROM submit_environmental_survey(
  'user_id_here'::uuid,
  'Test Location',
  null,
  null,
  false,  -- waste disposal issues
  true,   -- stagnant water
  'rarely',
  true,   -- pest infestation
  false,  -- no disease reports
  null,
  'Test survey from SQL',
  'https://example.com/photo.jpg',
  'en'
);

-- Test 4: Check current Supercoins balances
SELECT 
  name,
  user_type,
  supercoins,
  health_card_id
FROM profiles 
WHERE supercoins > 0 
ORDER BY supercoins DESC 
LIMIT 10;

-- Test 5: Check recent transactions
SELECT 
  st.*,
  p.name,
  p.health_card_id
FROM supercoin_transactions st
JOIN profiles p ON st.user_id = p.id
ORDER BY st.created_at DESC
LIMIT 20;
`;


if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    testAPI,
    testSurveySubmission,
    testUserSupercoins,
    testAdminStats,
    testAwardSupercoins,
    testGetTransactions,
    runAllTests,
    databaseTests
  };
}


if (typeof window !== 'undefined') {
  console.log('Environmental Survey API Test Suite Loaded!');
  console.log('Update the configuration variables and run: runAllTests()');
  console.log('Or run individual tests like: testSurveySubmission()');
}