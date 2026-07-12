import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase, authService } from '../utils/supabase/client';
import { Session, User } from '@supabase/supabase-js';
import { useDemo } from './demo-context';

interface AuthContextType {
  session: Session | null;
  user: User | null;
  userProfile: any | null;
  loading: boolean;
  needsSetup: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (userData: any, userType: 'patient' | 'doctor') => Promise<void>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  
  const demo = useDemo();
  if (demo.isDemoMode && demo.demoProfile && demo.demoUser) {
    return {
      ...context,
      user: demo.demoUser,
      userProfile: demo.demoProfile,
      session: { user: demo.demoUser } as any,
      loading: false,
      needsSetup: false
    };
  }
  
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [needsSetup, setNeedsSetup] = useState(false);

  useEffect(() => {
    
    const getInitialSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        
        if (error) {
          
          if (error.message?.includes('session') || error.message?.includes('Auth')) {
            console.log('No active session - this is normal for new users');
          } else {
            console.error('Auth session error:', error.message);
          }
          setSession(null);
          setUser(null);
          setUserProfile(null);
        } else {
          setSession(session);
          setUser(session?.user ?? null);
          
          if (session?.user) {
            await fetchUserProfile();
          }
        }
      } catch (error: any) {
        
        if (error.message?.includes('Auth session missing') || 
            error.message?.includes('session_not_found')) {
          console.log('No active session found - ready for new login');
        } else if (error.message?.includes('Failed to fetch') || 
                   error.message?.includes('network') ||
                   error.message?.includes('timeout')) {
          console.warn('Network connection issue detected');
        } else {
          console.error('Error getting initial session:', error.message);
        }
        
        
        setSession(null);
        setUser(null);
        setUserProfile(null);
        setNeedsSetup(false);
      } finally {
        setLoading(false);
      }
    };

    getInitialSession();

    
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email);
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          await fetchUserProfile();
          
          
          if (session.user.email === 'demo.patient@nabhasihata.com' && event === 'SIGNED_IN') {
            console.log('Auto-login detected for demo patient');
          }
        } else {
          setUserProfile(null);
          setNeedsSetup(false);
        }
        
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserProfile = async () => {
    try {
      console.log('Fetching user profile...');
      const profileData = await authService.getProfile();
      console.log('Profile data received:', profileData);
      
      if (profileData.needsSetup) {
        console.log('Database setup required');
        setNeedsSetup(true);
        setUserProfile(null);
      } else if (profileData.needsProfile) {
        console.log('User needs profile creation - will attempt to create profile');
        setNeedsSetup(false);
        setUserProfile(null);
        
        
        try {
          const { data: { user } } = await supabase.auth.getUser();
          if (user?.user_metadata?.name && user?.user_metadata?.user_type) {
            console.log('Attempting to create missing profile for user');
            await createMissingProfile(user);
            
            const retryProfileData = await authService.getProfile();
            if (retryProfileData.user) {
              console.log('Profile created and loaded successfully');
              setUserProfile(retryProfileData.user);
            } else if (retryProfileData.needsSetup) {
              console.log('Profile creation failed - database setup required');
              setNeedsSetup(true);
            }
          } else {
            
            if (user?.email === 'demo.patient@nabhasihata.com' || user?.email === 'demo.doctor@nabhasihata.com') {
              console.log('Attempting to create demo user profile with default data');
              const userType = user.email.includes('patient') ? 'patient' : 'doctor';
              const demoUserData = {
                ...user,
                user_metadata: {
                  name: userType === 'patient' ? 'Demo Patient' : 'Demo Doctor',
                  user_type: userType,
                  ...(userType === 'patient' && {
                    age: 30,
                    village: 'Nabha Village'
                  }),
                  ...(userType === 'doctor' && {
                    specialty: 'General Medicine',
                    license_number: 'DEMO123',
                    hospital: 'Nabha PHC'
                  })
                }
              };
              
              await createMissingProfile(demoUserData);
              const retryProfileData = await authService.getProfile();
              if (retryProfileData.user) {
                console.log('Demo user profile created and loaded successfully');
                setUserProfile(retryProfileData.user);
              } else if (retryProfileData.needsSetup) {
                console.log('Demo profile creation failed - database setup required');
                setNeedsSetup(true);
              }
            }
          }
        } catch (createError: any) {
          console.log('Could not auto-create profile:', createError.message);
          
          if (createError.message?.includes('does not exist') || 
              createError.message?.includes('relation') ||
              createError.message?.includes('schema')) {
            console.log('Profile creation failed due to database setup issues');
            setNeedsSetup(true);
          }
        }
      } else if (profileData.user) {
        console.log('Profile loaded successfully');
        setNeedsSetup(false);
        setUserProfile(profileData.user);
      } else {
        console.log('No profile data available');
        setNeedsSetup(false);
        setUserProfile(null);
      }
    } catch (error: any) {
      console.log('Profile fetch failed:', error.message);
      
      
      if (error.message?.includes('Database not set up') || 
          error.message?.includes('schema') ||
          error.message?.includes('Could not find the table') ||
          error.message?.includes('relation') ||
          error.message?.includes('does not exist')) {
        console.log('Database schema not ready - this is normal for first setup');
        setNeedsSetup(true);
        setUserProfile(null);
      } else if (error.message?.includes('Unauthorized') || error.message?.includes('401')) {
        console.log('Profile fetch unauthorized, signing out user');
        await supabase.auth.signOut();
        setNeedsSetup(false);
        setUserProfile(null);
      } else {
        console.log('Could not fetch profile, continuing without profile data');
        setNeedsSetup(false);
        setUserProfile(null);
      }
    }
  };

  
  const createMissingProfile = async (user: any) => {
    const userType = user.user_metadata?.user_type || 'patient';
    const profileData = {
      id: user.id,
      user_type: userType,
      name: user.user_metadata?.name || user.email?.split('@')[0] || 'User',
      phone: user.user_metadata?.phone || '',
      is_active: true,
      profile_complete: true
    };

    // Add type-specific fields
    if (userType === 'patient') {
      Object.assign(profileData, {
        age: user.user_metadata?.age || null,
        village: user.user_metadata?.village || '',
      });
    } else if (userType === 'doctor') {
      Object.assign(profileData, {
        specialty: user.user_metadata?.specialty || 'General Medicine',
        license_number: user.user_metadata?.license_number || '',
        hospital: user.user_metadata?.hospital || '',
      });
    }

    const { error } = await supabase
      .from('profiles')
      .insert(profileData);

    if (error) {
      throw new Error(`Failed to create profile: ${error.message}`);
    }

    console.log('Profile created successfully for user:', user.email);
  };

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    try {
      console.log('Attempting to sign in user:', email);
      const result = await authService.signIn(email, password);
      console.log('Sign in successful:', result);
      
    } catch (error: any) {
      console.error('Sign in failed in auth context:', error);
      setLoading(false);
      
      
      if (error.message?.includes('Invalid login credentials')) {
        throw new Error('Invalid login credentials');
      } else if (error.message?.includes('Failed to fetch') || 
                 error.message?.includes('network') ||
                 error.message?.includes('timeout')) {
        throw new Error('Connection failed. Please check your internet connection and try again.');
      } else {
        throw error;
      }
    }
  };

  const signUp = async (userData: any, userType: 'patient' | 'doctor') => {
    setLoading(true);
    try {
      console.log('Attempting to register user:', userData.email, 'as', userType);
      
      let registrationResult;
      if (userType === 'patient') {
        registrationResult = await authService.signUpPatient(userData);
      } else {
        registrationResult = await authService.signUpDoctor(userData);
      }
      
      console.log('Registration successful:', registrationResult);
      
      
      console.log('Attempting automatic sign in after registration...');
      await authService.signIn(userData.email, userData.password);
    } catch (error: any) {
      console.error('Registration failed in auth context:', error);
      setLoading(false);
      throw error;
    }
  };

  const signOut = async () => {
    setLoading(true);
    try {
      await authService.signOut();
      setUserProfile(null);
      setNeedsSetup(false);
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  const refreshProfile = async () => {
    if (user) {
      await fetchUserProfile();
    }
  };

  const value = {
    session,
    user,
    userProfile,
    loading,
    needsSetup,
    signIn,
    signUp,
    signOut,
    refreshProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};