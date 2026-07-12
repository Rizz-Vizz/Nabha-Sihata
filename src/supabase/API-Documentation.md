# Environmental Survey System - Backend API Documentation

## Overview

The Environmental Cleanliness Survey System provides a complete backend solution for collecting environmental health data, validating surveys, awarding rewards, and managing Supercoins. The system is built on Supabase with PostgreSQL and includes automated risk assessment, tip generation, and notification systems.

## Architecture

### Database Schema

1. **Environmental Surveys** (`environmental_surveys`)
   - Stores survey responses with automatic risk scoring
   - Links to user profiles and locations
   - Triggers automatic risk area updates

2. **Supercoins System** (`profiles.supercoins`, `supercoin_transactions`)
   - Tracks user balances and transaction history
   - Supports earning, spending, bonuses, and penalties
   - Full audit trail for all transactions

3. **Survey Tips** (`survey_tips`)
   - Multilingual health tips based on risk assessment
   - Configurable targeting based on survey responses
   - Priority-based tip selection

4. **Reward Rules** (`survey_reward_rules`)
   - Configurable reward calculations
   - Bonus conditions for high-risk areas
   - Admin-manageable reward policies

## API Endpoints

### 1. Survey Submission API

**Endpoint:** `POST /functions/v1/submit-survey`

**Authentication:** Required (Bearer token)

**Request Body:**
```typescript
{
  patientId: string;           // User ID submitting survey
  locationName: string;        // Location/area name
  wasteStatus: boolean;        // true = proper disposal, false = issues
  stagnantWater: boolean;      // Presence of stagnant water
  pestInfestation: boolean;    // Pest infestation reported
  sanitationFrequency: "daily" | "weekly" | "rarely" | "never";
  photoURL?: string;           // Optional photo evidence
  coordinates?: {              // Optional GPS coordinates
    lat: number;
    lng: number;
  };
  areaCode?: string;           // Optional area code
  diseaseReports?: boolean;    // Disease cases reported
  diseaseDetails?: string;     // Details of diseases
  additionalComments?: string; // Additional observations
  language?: "en" | "hi" | "pa"; // Language for tips
}
```

**Response:**
```typescript
{
  message: string;             // Success message
  tips: string[];              // Actionable health tips
  supercoinsAwarded: number;   // Supercoins earned
  totalSupercoins: number;     // User's total balance
  surveyId: string;            // Unique survey identifier
  riskScore: number;           // Calculated risk score (0-100)
}
```

**Validation Rules:**
- Patient ID and location name are required
- Sanitation frequency must be valid enum value
- Photo URL increases reward potential
- Coordinates must be valid lat/lng if provided

**Reward Calculation:**
- Base reward: 10 Supercoins (with photo + complete data)
- High-risk bonus: +5 Supercoins (risk score ≥ 70)
- Partial survey: 3-8 Supercoins (depending on completeness)

### 2. User Supercoins API

**Endpoint:** `GET /functions/v1/user-supercoins`

**Authentication:** Required

**Query Parameters:**
- `userId` (optional): View another user's data (admin/doctor only)

**Response:**
```typescript
{
  userId: string;
  currentBalance: number;
  totalEarned: number;
  totalSpent: number;
  recentTransactions: Array<{
    id: string;
    type: "earned" | "spent" | "bonus" | "penalty";
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
```

### 3. Admin Supercoins Management API

**Endpoint:** `POST/GET /functions/v1/admin-supercoins`

**Authentication:** Required (Admin/Doctor only)

#### Award Supercoins
**POST** with `?action=award`
```typescript
{
  userId: string;
  amount: number;
  description: string;
  type?: "bonus" | "penalty";
}
```

#### Spend Supercoins
**POST** with `?action=spend`
```typescript
{
  userId: string;
  amount: number;
  description: string;
  serviceType?: string;
}
```

#### Get Statistics
**GET** with `?action=stats`

**Response:**
```typescript
{
  totalUsers: number;
  totalSupercoinsInCirculation: number;
  patientUsers: number;
  averageBalance: number;
  transactions: {
    total: number;
    totalEarned: number;
    totalSpent: number;
    surveyRewards: number;
    adminTransactions: number;
  };
  recentActivity: Array<{
    type: string;
    amount: number;
    source: string;
    date: string;
  }>;
}
```

#### Get All Transactions
**GET** with `?action=transactions`

**Query Parameters:**
- `limit` (default: 50): Number of transactions to return
- `offset` (default: 0): Pagination offset
- `userId` (optional): Filter by specific user

## Database Functions

### Core Functions

1. **`submit_environmental_survey()`**
   - Main survey processing function
   - Validates input data
   - Calculates risk score automatically
   - Awards Supercoins based on rules
   - Generates relevant tips

2. **`calculate_survey_reward()`**
   - Determines Supercoin amount based on:
     - Photo presence
     - Data completeness
     - Risk score
     - Current reward rules

3. **`award_supercoins()`**
   - Updates user balance
   - Records transaction history
   - Ensures data consistency

4. **`get_survey_tips()`**
   - Returns relevant tips based on:
     - Risk level
     - Specific issues identified
     - User's preferred language

### Risk Assessment

**Automatic Risk Scoring (0-100 scale):**
- Improper waste disposal: +20 points
- Stagnant water present: +25 points
- Poor sanitation frequency:
  - Never: +30 points
  - Rarely: +20 points
  - Weekly: +10 points
  - Daily: +0 points
- Pest infestation: +15 points
- Disease reports: +30 points

**Risk Levels:**
- Low: 0-39 (✅ Green)
- Medium: 40-59 (⚡ Yellow)
- High: 60-79 (⚠️ Orange)
- Critical: 80-100 (🚨 Red)

## Security Features

### Row Level Security (RLS)
- Users can only access their own data
- Doctors can view patient data
- Admins have full access
- Public health information is readable by all

### Input Validation
- SQL injection prevention
- Data type validation
- Range checks for coordinates
- Enum validation for categorical data

### Authentication
- Supabase Auth integration
- JWT token validation
- Role-based access control

## Integration Guide

### Frontend Integration

```typescript
import { SurveyAPI } from '@/utils/survey-api';

// Submit a survey
const result = await SurveyAPI.submitSurvey({
  patientId: user.id,
  locationName: "Village Center",
  wasteStatus: false,      // Issues with waste disposal
  stagnantWater: true,     // Stagnant water present
  pestInfestation: false,
  sanitationFrequency: "weekly",
  photoURL: "https://...",
  coordinates: { lat: 30.123, lng: 76.456 },
  language: "en"
});

console.log(`Earned ${result.supercoinsAwarded} Supercoins!`);
console.log(`Tips: ${result.tips.join(', ')}`);

// Get user's Supercoins data
const supercoinsData = await SurveyAPI.getUserSupercoins();
console.log(`Balance: ${supercoinsData.currentBalance} Supercoins`);
```

### Error Handling

```typescript
try {
  const result = await SurveyAPI.submitSurvey(surveyData);
  // Handle success
} catch (error) {
  if (error.message.includes('Unauthorized')) {
    // Redirect to login
  } else if (error.message.includes('validation')) {
    // Show validation errors
  } else {
    // Show generic error
  }
}
```

## Sample Data

### Survey Submission Example
```json
{
  "patientId": "123e4567-e89b-12d3-a456-426614174000",
  "locationName": "Nabha Central Market",
  "wasteStatus": false,
  "stagnantWater": true,
  "pestInfestation": true,
  "sanitationFrequency": "rarely",
  "photoURL": "https://storage.supabase.co/bucket/photos/abc123.jpg",
  "coordinates": { "lat": 30.3752, "lng": 76.1463 },
  "areaCode": "140901",
  "diseaseReports": false,
  "language": "en"
}
```

### Expected Response
```json
{
  "message": "Survey submitted successfully",
  "tips": [
    "Dispose waste in designated bins immediately",
    "Remove all stagnant water sources around your home",
    "Contact local authorities for pest control immediately"
  ],
  "supercoinsAwarded": 15,
  "totalSupercoins": 145,
  "surveyId": "789e4567-e89b-12d3-a456-426614174999",
  "riskScore": 85
}
```

## Deployment Notes

### Required Environment Variables
```
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Database Setup
1. Run `basic-schema.sql` first
2. Run `environmental-health-schema.sql`
3. Run `survey-rewards-schema.sql`
4. Configure storage bucket for photos
5. Set up scheduled jobs for risk area updates

### Performance Considerations
- Database indexes are included for all query patterns
- Use pagination for large datasets
- Consider caching for frequently accessed tips
- Monitor transaction volumes for scaling

## Monitoring and Analytics

### Key Metrics to Track
- Survey submission rate
- Average risk scores by location
- Supercoins circulation
- User engagement patterns
- Reward effectiveness

### Health Dashboard Integration
The system automatically updates risk areas and generates notifications that can be viewed in the admin health dashboard component.

## Future Enhancements

1. **SMS/Email Notifications:** Extend beyond app notifications
2. **Machine Learning:** Improve risk scoring with ML models
3. **Photo Analysis:** Automated photo validation and analysis
4. **Geofencing:** Location-based automatic surveys
5. **Predictive Analytics:** Disease outbreak prediction
6. **Offline Sync:** Enhanced offline capabilities

---

For technical support or questions about the API, please refer to the individual function documentation or contact the development team.