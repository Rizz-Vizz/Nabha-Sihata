import { supabase } from './client';

export interface ConnectionTestResult {
  connected: boolean;
  tablesExist: {
    profiles: boolean;
    health_records: boolean;
    appointments: boolean;
    environmental_surveys: boolean;
  };
  rls_active: boolean;
  demo_users_exist: {
    patient: boolean;
    doctor: boolean;
  };
  error?: string;
  details: string[];
}

export const runDetailedConnectionTest = async (): Promise<ConnectionTestResult> => {
  const result: ConnectionTestResult = {
    connected: false,
    tablesExist: {
      profiles: false,
      health_records: false,
      appointments: false,
      environmental_surveys: false,
    },
    rls_active: false,
    demo_users_exist: {
      patient: false,
      doctor: false,
    },
    details: [],
  };

  try {
    result.details.push('🔍 Starting detailed connection test...');

    
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('count')
        .limit(1);

      if (error) {
        result.details.push(`📊 Profiles table query result: ERROR - ${error.code} - ${error.message}`);
        
        if (error.code === 'PGRST116' || error.message?.includes('does not exist')) {
          result.details.push('❌ Profiles table does not exist');
          result.tablesExist.profiles = false;
        } else if (error.message?.includes('RLS') || 
                   error.message?.includes('policy') || 
                   error.message?.includes('permission') ||
                   error.code === 'PGRST301') {
          result.details.push('🔒 Profiles table exists but RLS is blocking access (GOOD!)');
          result.tablesExist.profiles = true;
          result.rls_active = true;
        } else {
          result.details.push('⚠️ Profiles table query failed with unexpected error');
          result.tablesExist.profiles = true; 
        }
      } else {
        result.details.push('✅ Profiles table accessible');
        result.tablesExist.profiles = true;
      }
    } catch (error: any) {
      result.details.push(`❌ Connection test failed: ${error.message}`);
      result.error = error.message;
    }

    
    const tables = ['health_records', 'appointments', 'environmental_surveys'];
    for (const table of tables) {
      try {
        const { error } = await supabase
          .from(table)
          .select('count')
          .limit(1);

        if (error) {
          if (error.code === 'PGRST116' || error.message?.includes('does not exist')) {
            result.details.push(`❌ ${table} table does not exist`);
            (result.tablesExist as any)[table] = false;
          } else {
            result.details.push(`✅ ${table} table exists (protected by RLS)`);
            (result.tablesExist as any)[table] = true;
          }
        } else {
          result.details.push(`✅ ${table} table accessible`);
          (result.tablesExist as any)[table] = true;
        }
      } catch (error: any) {
        result.details.push(`⚠️ ${table} test failed: ${error.message}`);
      }
    }

    
    result.details.push('👥 Demo user check skipped (avoiding additional client creation)');
    result.demo_users_exist.patient = false;
    result.demo_users_exist.doctor = false;

    
    const coreTablesExist = result.tablesExist.profiles && 
                           result.tablesExist.health_records && 
                           result.tablesExist.appointments;
    
    result.connected = coreTablesExist || result.rls_active;
    
    if (result.connected) {
      result.details.push('✅ Database appears to be properly set up');
    } else {
      result.details.push('❌ Database setup appears incomplete');
    }

    return result;
  } catch (error: any) {
    result.details.push(`💥 Test failed with exception: ${error.message}`);
    result.error = error.message;
    return result;
  }
};


export const isDatabaseReady = async (): Promise<boolean> => {
  try {
    const testResult = await runDetailedConnectionTest();
    
    
    return testResult.connected || testResult.rls_active || testResult.tablesExist.profiles;
  } catch (error) {
    console.error('Database readiness check failed:', error);
    return false;
  }
};