import { createClient } from '@supabase/supabase-js';
import { projectId, publicAnonKey } from './info';
import { isDatabaseReady } from './connection-test';


const supabase = createClient(
  `https://${projectId}.supabase.co`,
  publicAnonKey,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: false 
    }
  }
);

export { supabase };


const API_BASE = `https://${projectId}.supabase.co/functions/v1/make-server-dc6a04cf`;


export const apiCall = async (endpoint: string, options: RequestInit = {}) => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    const accessToken = session?.access_token || publicAnonKey;

    console.log(`Making API call to: ${API_BASE}${endpoint}`);
    console.log('Using access token:', accessToken ? 'Yes' : 'No');

    const response = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
        ...options.headers,
      },
    });

    console.log(`API response status: ${response.status}`);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API error response:', errorText);
      
      let errorData;
      try {
        errorData = JSON.parse(errorText);
      } catch {
        errorData = { error: errorText || 'Network error' };
      }
      
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    console.log('API call successful:', result);
    return result;
  } catch (error) {
    console.error('API call failed:', error);
    throw error;
  }
};


export const testConnection = async () => {
  try {
    
    const { data, error } = await supabase
      .from('profiles')
      .select('id')
      .limit(1);
    
    if (error) {
      
      if (error.code === 'PGRST116' || error.message?.includes('does not exist')) {
        console.log('Database tables not set up yet - this is normal for first setup');
        return false;
      }
      
      
      console.log('Connection test failed:', error.message);
      return false;
    }
    
    console.log('Supabase connection test successful');
    return true;
  } catch (error: any) {
    console.log('Connection test error:', error.message);
    return false;
  }
};


export const testConnectionWithSetup = async () => {
  try {
    console.log('🔍 Testing database connection and setup status...');
    
    
    const { error } = await supabase
      .from('profiles')
      .select('id')
      .limit(1);
    
    if (error) {
      
      if (error.code === 'PGRST116' || error.code === 'PGRST205' || 
          error.message?.includes('does not exist') || 
          error.message?.includes('schema cache') ||
          error.message?.includes('relation') ||
          error.message?.includes('find')) {
        console.log('⚠️ Database tables not found - setup required');
        return {
          connected: true, 
          needsSetup: true,
          error: 'Database schema not initialized'
        };
      }
      
      
      if (error.message?.includes('RLS') || 
          error.message?.includes('policy') || 
          error.message?.includes('insufficient privilege') ||
          error.message?.includes('permission denied') ||
          error.message?.includes('JWT') ||
          error.message?.includes('auth') ||
          error.message?.includes('session') ||
          error.message?.includes('Anonymous') ||
          error.code === 'PGRST301' || 
          error.code === 'PGRST001') {
        console.log('✅ Database appears to be set up (access blocked by security)');
        return {
          connected: true,
          needsSetup: false,
          error: null
        };
      }
      
      
      if (error.message?.includes('fetch') || 
          error.message?.includes('network') || 
          error.message?.includes('timeout') ||
          error.message?.includes('ECONNREFUSED')) {
        console.error('❌ Network connection failed:', error);
        return {
          connected: false,
          needsSetup: false,
          error: 'Network connection failed'
        };
      }
      
      
      console.log('✅ Database connection test completed (assuming setup exists)');
      return {
        connected: true,
        needsSetup: false,
        error: null
      };
    }
    
    
    console.log('✅ Database connection verified successfully');
    return {
      connected: true,
      needsSetup: false,
      error: null
    };
  } catch (error: any) {
    console.error('❌ Connection test failed:', error);
    
    
    if (error.message?.includes('fetch') || error.message?.includes('network') || 
        error.message?.includes('timeout') || error.message?.includes('ECONNREFUSED')) {
      return {
        connected: false,
        needsSetup: false,
        error: 'Network connection failed'
      };
    }
    
    
    return {
      connected: true,
      needsSetup: false,
      error: null
    };
  }
};


export const authService = {
  
  signUpPatient: async (patientData: {
    email: string;
    password: string;
    name: string;
    phone?: string;
    village?: string;
    age?: number;
  }) => {
    try {
      
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: patientData.email,
        password: patientData.password,
        options: {
          data: {
            name: patientData.name,
            user_type: 'patient'
          },
          emailRedirectTo: undefined 
        }
      });

      if (authError) {
        throw new Error(`Registration failed: ${authError.message}`);
      }

      if (!authData.user) {
        throw new Error('Registration failed: No user created');
      }

      
      const { error: profileError } = await supabase
        .from('profiles')
        .upsert({
          id: authData.user.id,
          user_type: 'patient',
          name: patientData.name,
          phone: patientData.phone || '',
          village: patientData.village || '',
          age: patientData.age || null,
          is_active: true,
          profile_complete: true
        }, {
          onConflict: 'id'
        });

      if (profileError) {
        console.error('Profile creation error:', profileError);
        
        if (profileError.code === 'PGRST116' || profileError.message?.includes('does not exist')) {
          console.log('Profiles table not found - database setup required');
        }
        
      }

      return { user: authData.user, session: authData.session };
    } catch (error: any) {
      console.error('Patient signup error:', error);
      throw new Error(error.message || 'Patient registration failed');
    }
  },

  
  signUpDoctor: async (doctorData: {
    email: string;
    password: string;
    name: string;
    phone?: string;
    specialty: string;
    license_number: string;
    hospital?: string;
  }) => {
    try {
      
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: doctorData.email,
        password: doctorData.password,
        options: {
          data: {
            name: doctorData.name,
            user_type: 'doctor'
          },
          emailRedirectTo: undefined 
        }
      });

      if (authError) {
        throw new Error(`Registration failed: ${authError.message}`);
      }

      if (!authData.user) {
        throw new Error('Registration failed: No user created');
      }

      
      const { error: profileError } = await supabase
        .from('profiles')
        .upsert({
          id: authData.user.id,
          user_type: 'doctor',
          name: doctorData.name,
          phone: doctorData.phone || '',
          specialty: doctorData.specialty,
          license_number: doctorData.license_number,
          hospital: doctorData.hospital || '',
          is_active: true,
          profile_complete: true
        }, {
          onConflict: 'id'
        });

      if (profileError) {
        console.error('Profile creation error:', profileError);
        
        if (profileError.code === 'PGRST116' || profileError.message?.includes('does not exist')) {
          console.log('Profiles table not found - database setup required');
        }
        
      }

      return { user: authData.user, session: authData.session };
    } catch (error: any) {
      console.error('Doctor signup error:', error);
      throw new Error(error.message || 'Doctor registration failed');
    }
  },

  
  signIn: async (email: string, password: string) => {
    try {
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        console.error('Supabase sign in error:', error);
        throw new Error(`Authentication failed: ${error.message}`);
      }
      
      if (!data.session) {
        throw new Error('No session created during sign in');
      }
      
      return data;
    } catch (error: any) {
      console.error('Sign in error:', error);
      throw new Error(error.message || 'Sign in failed');
    }
  },

  
  signOut: async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      throw new Error(error.message);
    }
  },

  
  getSession: async () => {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error) {
      throw new Error(error.message);
    }
    return session;
  },

  
  getProfile: async () => {
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      
      if (authError || !user) {
        throw new Error('User not authenticated');
      }

      console.log(`Getting profile for user: ${user.email}`);

      
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (profileError) {
        
        if (profileError.code === 'PGRST116' || 
            profileError.code === 'PGRST205' || 
            profileError.message?.includes('does not exist') ||
            profileError.message?.includes('schema cache') ||
            profileError.message?.includes('relation') ||
            profileError.message?.includes('find')) {
          console.log('Profiles table not found - database needs setup');
          return { user: null, needsSetup: true };
        }
        
        
        if (profileError.code === 'PGRST001' || profileError.message?.includes('No rows found')) {
          console.log(`Profile not found for user ${user.email} - needs profile creation`);
          return { user: null, needsProfile: true };
        }

        
        if (profileError.message?.includes('RLS') || 
            profileError.message?.includes('policy') || 
            profileError.message?.includes('privilege') ||
            profileError.message?.includes('permission denied') ||
            profileError.code === 'PGRST301') {
          console.log(`RLS policy blocked profile access for ${user.email} - profile may not exist or user lacks permission`);
          return { user: null, needsProfile: true };
        }
        
        throw new Error(`Failed to get profile: ${profileError.message}`);
      }

      if (!profile) {
        console.log(`Empty profile for user ${user.email} - needs profile creation`);
        return { user: null, needsProfile: true };
      }

      console.log(`Profile loaded successfully for ${user.email}`);
      return { user: profile, needsSetup: false };
    } catch (error: any) {
      console.log('Get profile error:', error.message);
      
      
      if (error.message?.includes('Database not set up') || 
          error.message?.includes('schema') ||
          error.message?.includes('does not exist') ||
          error.message?.includes('find the table') ||
          error.message?.includes('relation')) {
        return { user: null, needsSetup: true };
      }
      
      throw new Error(error.message || 'Failed to get user profile');
    }
  },
};


export const healthService = {
  
  updateHealthRecord: async (healthData: any) => {
    return apiCall('/health/update', {
      method: 'POST',
      body: JSON.stringify(healthData),
    });
  },
};


export const appointmentService = {
  
  bookAppointment: async (appointmentData: {
    doctor_id: string;
    date: string;
    time: string;
    symptoms?: string;
    urgency?: string;
  }) => {
    return apiCall('/appointments/book', {
      method: 'POST',
      body: JSON.stringify(appointmentData),
    });
  },

  
  getAppointments: async () => {
    return apiCall('/appointments');
  },

  
  getDoctors: async (specialty?: string) => {
    const query = specialty ? `?specialty=${encodeURIComponent(specialty)}` : '';
    return apiCall(`/doctors${query}`);
  },
};

// Emergency service functions
export const emergencyService = {
  // Send emergency alert
  sendAlert: async (alertData: {
    emergency_type: string;
    location?: string;
    description?: string;
  }) => {
    return apiCall('/emergency/alert', {
      method: 'POST',
      body: JSON.stringify(alertData),
    });
  },
};


export const environmentalService = {
  
  submitSurvey: async (surveyData: {
    wasteDisposal: 'yes' | 'no';
    stagnantWater: 'yes' | 'no';
    sanitationFrequency: 'daily' | 'weekly' | 'rarely' | 'never';
    pestInfestation: 'yes' | 'no';
    diseaseReports: 'yes' | 'no';
    diseaseDetails?: string;
    additionalComments?: string;
    location: string;
    photos?: File[];
  }) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('User not authenticated');
      }

      
      const dbData = {
        user_id: user.id,
        location_name: surveyData.location || 'Location not available',
        coordinates: null, 
        waste_disposal: surveyData.wasteDisposal === 'yes',
        stagnant_water: surveyData.stagnantWater === 'yes',
        sanitation_frequency: surveyData.sanitationFrequency,
        pest_infestation: surveyData.pestInfestation === 'yes',
        disease_reports: surveyData.diseaseReports === 'yes',
        disease_details: surveyData.diseaseDetails || null,
        additional_comments: surveyData.additionalComments || null,
      };

      
      const { data: survey, error: surveyError } = await supabase
        .from('environmental_surveys')
        .insert(dbData)
        .select()
        .single();

      if (surveyError) {
        console.error('Survey submission error:', surveyError);
        
        
        if (surveyError.code === 'PGRST116' || surveyError.message?.includes('does not exist')) {
          throw new Error('Database not set up yet. Please run the database setup first.');
        }
        
        throw new Error(`Failed to submit survey: ${surveyError.message}`);
      }

      
      if (surveyData.photos && surveyData.photos.length > 0) {
        await environmentalService.uploadSurveyPhotos(survey.id, surveyData.photos);
      }

      return survey;
    } catch (error: any) {
      console.error('Environmental survey submission failed:', error);
      throw new Error(error.message || 'Failed to submit environmental survey');
    }
  },

  
  uploadSurveyPhotos: async (surveyId: string, photos: File[]) => {
    try {
      const uploadPromises = photos.map(async (photo, index) => {
        const fileName = `survey-${surveyId}-photo-${index}-${Date.now()}.${photo.name.split('.').pop()}`;
        const filePath = `surveys/${surveyId}/${fileName}`;

        
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('environmental-photos')
          .upload(filePath, photo);

        if (uploadError) {
          console.error('Photo upload error:', uploadError);
          
          
          if (uploadError.message?.includes('Bucket not found') || uploadError.message?.includes('does not exist')) {
            console.warn('Storage bucket not set up yet - photos will not be saved');
            return null; 
          }
          
          throw new Error(`Failed to upload photo: ${uploadError.message}`);
        }

        
        const { data: urlData } = supabase.storage
          .from('environmental-photos')
          .getPublicUrl(filePath);

        
        const { error: dbError } = await supabase
          .from('survey_photos')
          .insert({
            survey_id: surveyId,
            photo_url: urlData.publicUrl,
            file_size: photo.size,
            mime_type: photo.type,
          });

        if (dbError) {
          console.error('Photo metadata save error:', dbError);
          
        }

        return urlData.publicUrl;
      });

      const photoUrls = await Promise.all(uploadPromises);
      return photoUrls.filter(url => url !== null); 
    } catch (error: any) {
      console.error('Photo upload failed:', error);
      
      if (error.message?.includes('Bucket not found') || error.message?.includes('Storage')) {
        console.warn('Photo upload skipped due to storage setup');
        return [];
      }
      throw new Error(error.message || 'Failed to upload photos');
    }
  },

  
  getSurveyHistory: async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('User not authenticated');
      }

      const { data, error } = await supabase
        .from('environmental_surveys')
        .select(`
          *,
          survey_photos (
            photo_url,
            photo_description
          )
        `)
        .eq('user_id', user.id)
        .order('submitted_at', { ascending: false });

      if (error) {
        throw new Error(`Failed to get survey history: ${error.message}`);
      }

      return data;
    } catch (error: any) {
      console.error('Get survey history failed:', error);
      throw new Error(error.message || 'Failed to get survey history');
    }
  },

  
  getHealthNotifications: async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        console.log('No authenticated user - notifications service requires authentication');
        throw new Error('User not authenticated');
      }

      const { data, error } = await supabase
        .from('user_notifications')
        .select(`
          *,
          health_notifications (
            id,
            title,
            message,
            type,
            severity,
            disease_name,
            actionable_advice,
            created_at
          )
        `)
        .eq('user_id', user.id)
        .order('delivered_at', { ascending: false });

      if (error) {
        throw new Error(`Failed to get notifications: ${error.message}`);
      }

      return data;
    } catch (error: any) {
      
      if (error.message && error.message.includes('not authenticated')) {
        console.log('Get notifications failed: User not authenticated (expected for demo users)');
      } else {
        console.error('Get notifications failed:', error);
      }
      throw new Error(error.message || 'Failed to get health notifications');
    }
  },

  
  markNotificationAsRead: async (notificationId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('User not authenticated');
      }

      const { error } = await supabase
        .from('user_notifications')
        .update({
          is_read: true,
          read_at: new Date().toISOString()
        })
        .eq('user_id', user.id)
        .eq('notification_id', notificationId);

      if (error) {
        throw new Error(`Failed to mark notification as read: ${error.message}`);
      }

      return true;
    } catch (error: any) {
      console.error('Mark notification as read failed:', error);
      throw new Error(error.message || 'Failed to mark notification as read');
    }
  },

  
  getRiskAreas: async () => {
    try {
      const { data, error } = await supabase
        .from('risk_areas')
        .select('*')
        .eq('is_active', true)
        .order('risk_score', { ascending: false });

      if (error) {
        throw new Error(`Failed to get risk areas: ${error.message}`);
      }

      return data;
    } catch (error: any) {
      console.error('Get risk areas failed:', error);
      throw new Error(error.message || 'Failed to get risk areas data');
    }
  },

  
  getSurveyStatistics: async () => {
    try {
      const { data, error } = await supabase
        .from('environmental_surveys')
        .select(`
          id,
          location_name,
          waste_disposal,
          stagnant_water,
          sanitation_frequency,
          pest_infestation,
          disease_reports,
          risk_score,
          submitted_at
        `)
        .gte('submitted_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()); 

      if (error) {
        throw new Error(`Failed to get survey statistics: ${error.message}`);
      }

      return data;
    } catch (error: any) {
      console.error('Get survey statistics failed:', error);
      throw new Error(error.message || 'Failed to get survey statistics');
    }
  }
};