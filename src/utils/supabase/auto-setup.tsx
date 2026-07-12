import { supabase } from './client';





export interface SetupResult {
  needsSetup: boolean;
  demoUsersCreated: boolean;
  error?: string;
  autoLoginSuccess?: boolean;
}

export const checkAndSetupApp = async (): Promise<SetupResult> => {
  try {
    console.log('🚀 Starting automatic app setup check...');
    
    
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) {
      console.log('✅ User already authenticated - skipping auto-setup');
      return {
        needsSetup: false,
        demoUsersCreated: true,
        autoLoginSuccess: true
      };
    }

    
    const schemaExists = await checkDatabaseSchema();
    if (!schemaExists) {
      console.log('❌ Database schema not found - manual setup required');
      return {
        needsSetup: true,
        demoUsersCreated: false,
        error: 'Database schema not set up'
      };
    }

    console.log('✅ Database schema verified');

    
    const hasUsers = await checkExistingUsersSimple();
    if (hasUsers) {
      console.log('✅ Users already exist - no setup needed');
      return {
        needsSetup: false,
        demoUsersCreated: true 
      };
    }

    
    console.log('⚠️ Auto-setup disabled to prevent client conflicts - use manual demo setup');
    return {
      needsSetup: false,
      demoUsersCreated: false,
      error: 'Auto-setup disabled. Please use manual demo setup button below.'
    };

  } catch (error: any) {
    console.error('❌ Setup check failed:', error);
    return {
      needsSetup: false,
      demoUsersCreated: false,
      error: `Setup check failed: ${error.message}. Use manual demo setup instead.`
    };
  }
};

const checkDatabaseSchema = async (): Promise<boolean> => {
  try {
    
    const { error } = await supabase
      .from('profiles')
      .select('id')
      .limit(1);

    if (error) {
      
      if (error.code === 'PGRST116' || 
          error.code === 'PGRST205' ||
          error.message?.includes('does not exist') ||
          error.message?.includes('schema cache') ||
          error.message?.includes('relation') ||
          error.message?.includes('find')) {
        console.log('Profiles table not found - schema needs setup');
        return false;
      }
      
      
      if (error.message?.includes('RLS') || 
          error.message?.includes('policy') || 
          error.message?.includes('privilege') ||
          error.message?.includes('permission denied') ||
          error.message?.includes('JWT') ||
          error.message?.includes('auth') ||
          error.message?.includes('session') ||
          error.code === 'PGRST301' || 
          error.code === 'PGRST001') {
        console.log('Database schema exists and is properly secured');
        return true;
      }
      
      
      console.log('Schema check encountered error, assuming schema exists:', error.message);
      return true;
    }

    
    console.log('Database schema verified successfully');
    return true;
  } catch (error) {
    console.log('Schema check failed with exception:', error);
    return false;
  }
};


const checkExistingUsersSimple = async (): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('id')
      .limit(1);

    
    if (!error) {
      const hasUsers = data && data.length > 0;
      console.log('✅ User check (simple):', hasUsers ? 'Users exist' : 'No users found');
      return hasUsers;
    }

    
    if (error.code === 'PGRST116' || error.message?.includes('does not exist')) {
      console.log('📋 Profiles table not found - no users can exist');
      return false;
    }

    
    if (error.message?.includes('RLS') || 
        error.message?.includes('policy') || 
        error.message?.includes('permission') ||
        error.code === 'PGRST301') {
      console.log('🔒 Users might exist but are protected by RLS - assuming users exist');
      return true; 
    }

    console.log('⚠️ Unknown error checking users (assuming users exist):', error.message);
    return true; 
  } catch (error: any) {
    console.log('❌ Failed to check existing users (assuming users exist):', error.message);
    return true; 
  }
};


const checkExistingUsers = async (): Promise<boolean> => {
  return checkExistingUsersSimple();
};


const createDemoUsers = async (): Promise<{ success: boolean; error?: string }> => {
  console.log('⚠️ Demo user auto-creation disabled to prevent client conflicts');
  return { 
    success: false, 
    error: 'Auto-creation disabled. Please use manual demo setup button instead.' 
  };
};


const autoLoginDemoPatient = async (): Promise<{ success: boolean; error?: string }> => {
  console.log('⚠️ Auto-login disabled - demo users must be created manually first');
  return { 
    success: false, 
    error: 'Auto-login disabled. Create demo users manually first.' 
  };
};


export const isFirstTimeSetup = async (): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('id')
      .limit(1);

    if (error) {
      
      if (error.code === 'PGRST116' || error.message?.includes('does not exist')) {
        return true;
      }
      
      return false;
    }

    
    return !data || data.length === 0;
  } catch (error) {
    console.log('Error checking first time setup:', error);
    return false;
  }
};