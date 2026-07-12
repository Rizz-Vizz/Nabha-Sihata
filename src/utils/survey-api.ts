import { supabase } from './supabase/client';


export interface SurveySubmission {
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

export interface SurveySubmissionResponse {
  message: string;
  tips: string[];
  supercoinsAwarded: number;
  totalSupercoins: number;
  surveyId: string;
  riskScore: number;
}

export interface UserSupercoinsData {
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

export interface AdminSupercoinsStats {
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


export class SurveyAPI {
  private static async makeRequest<T>(
    functionName: string,
    options: {
      method?: string;
      body?: any;
      params?: Record<string, string>;
    } = {}
  ): Promise<T> {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      throw new Error('Authentication required');
    }

    
    let url = `/functions/v1/${functionName}`;
    if (options.params) {
      const searchParams = new URLSearchParams(options.params);
      url += `?${searchParams.toString()}`;
    }

    const response = await fetch(`${supabase.supabaseUrl}${url}`, {
      method: options.method || 'GET',
      headers: {
        'Authorization': `Bearer ${session.access_token}`,
        'Content-Type': 'application/json',
        'apikey': supabase.supabaseKey,
      },
      body: options.body ? JSON.stringify(options.body) : undefined,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Network error' }));
      throw new Error(errorData.error || `HTTP ${response.status}`);
    }

    return response.json();
  }

  
  static async submitSurvey(submission: SurveySubmission): Promise<SurveySubmissionResponse> {
    try {
      return await this.makeRequest<SurveySubmissionResponse>('submit-survey', {
        method: 'POST',
        body: submission,
      });
    } catch (error) {
      console.error('Survey submission failed:', error);
      throw error;
    }
  }

  
  static async getUserSupercoins(userId?: string): Promise<UserSupercoinsData> {
    try {
      const params = userId ? { userId } : {};
      return await this.makeRequest<UserSupercoinsData>('user-supercoins', {
        params,
      });
    } catch (error) {
      console.error('Failed to fetch user supercoins:', error);
      throw error;
    }
  }

  
  static async getAdminStats(): Promise<AdminSupercoinsStats> {
    try {
      return await this.makeRequest<AdminSupercoinsStats>('admin-supercoins', {
        params: { action: 'stats' },
      });
    } catch (error) {
      console.error('Failed to fetch admin stats:', error);
      throw error;
    }
  }

  static async awardSupercoins(
    userId: string,
    amount: number,
    description: string,
    type: 'bonus' | 'penalty' = 'bonus'
  ): Promise<{ message: string; newBalance: number; transactionId: string }> {
    try {
      return await this.makeRequest('admin-supercoins', {
        method: 'POST',
        params: { action: 'award' },
        body: { userId, amount, description, type },
      });
    } catch (error) {
      console.error('Failed to award supercoins:', error);
      throw error;
    }
  }

  static async spendSupercoins(
    userId: string,
    amount: number,
    description: string,
    serviceType?: string
  ): Promise<{ message: string; newBalance: number; transactionId: string }> {
    try {
      return await this.makeRequest('admin-supercoins', {
        method: 'POST',
        params: { action: 'spend' },
        body: { userId, amount, description, serviceType },
      });
    } catch (error) {
      console.error('Failed to spend supercoins:', error);
      throw error;
    }
  }

  static async getAllTransactions(options: {
    limit?: number;
    offset?: number;
    userId?: string;
  } = {}): Promise<{
    transactions: Array<any>;
    pagination: { limit: number; offset: number; hasMore: boolean };
  }> {
    try {
      const params: Record<string, string> = { action: 'transactions' };
      if (options.limit) params.limit = options.limit.toString();
      if (options.offset) params.offset = options.offset.toString();
      if (options.userId) params.userId = options.userId;

      return await this.makeRequest('admin-supercoins', { params });
    } catch (error) {
      console.error('Failed to fetch transactions:', error);
      throw error;
    }
  }
}


export const validateSurveySubmission = (submission: SurveySubmission): string[] => {
  const errors: string[] = [];

  if (!submission.patientId) {
    errors.push('Patient ID is required');
  }

  if (!submission.locationName || submission.locationName.trim() === '') {
    errors.push('Location name is required');
  }

  if (!['daily', 'weekly', 'rarely', 'never'].includes(submission.sanitationFrequency)) {
    errors.push('Valid sanitation frequency is required');
  }

  if (submission.coordinates) {
    const { lat, lng } = submission.coordinates;
    if (typeof lat !== 'number' || typeof lng !== 'number' || 
        lat < -90 || lat > 90 || lng < -180 || lng > 180) {
      errors.push('Valid coordinates are required (lat: -90 to 90, lng: -180 to 180)');
    }
  }

  return errors;
};


export const isValidForRewards = (submission: SurveySubmission): boolean => {
  const errors = validateSurveySubmission(submission);
  return errors.length === 0 && !!submission.photoURL;
};


export const estimateReward = (submission: SurveySubmission): number => {
  if (!isValidForRewards(submission)) {
    return 0;
  }

  let baseReward = 10; 
  
  
  let riskScore = 0;
  if (!submission.wasteStatus) riskScore += 20;
  if (submission.stagnantWater) riskScore += 25;
  if (submission.sanitationFrequency === 'never') riskScore += 30;
  else if (submission.sanitationFrequency === 'rarely') riskScore += 20;
  else if (submission.sanitationFrequency === 'weekly') riskScore += 10;
  if (submission.pestInfestation) riskScore += 15;
  if (submission.diseaseReports) riskScore += 30;

  
  if (riskScore >= 70) {
    baseReward += 5;
  }

  return baseReward;
};


export const formatSupercoins = (amount: number): string => {
  if (amount >= 1000000) {
    return `${(amount / 1000000).toFixed(1)}M`;
  } else if (amount >= 1000) {
    return `${(amount / 1000).toFixed(1)}K`;
  }
  return amount.toString();
};


export const getRiskLevel = (score: number): { level: string; color: string; emoji: string } => {
  if (score >= 80) {
    return { level: 'Critical', color: 'red', emoji: '🚨' };
  } else if (score >= 60) {
    return { level: 'High', color: 'orange', emoji: '⚠️' };
  } else if (score >= 40) {
    return { level: 'Medium', color: 'yellow', emoji: '⚡' };
  } else {
    return { level: 'Low', color: 'green', emoji: '✅' };
  }
};


export default SurveyAPI;