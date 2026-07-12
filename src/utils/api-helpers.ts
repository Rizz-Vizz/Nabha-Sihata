

export interface FetchWithTimeoutOptions extends RequestInit {
  timeout?: number;
}

export const fetchWithTimeout = async (
  url: string, 
  options: FetchWithTimeoutOptions = {}
): Promise<Response> => {
  const { timeout = 15000, ...fetchOptions } = options;
  
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      ...fetchOptions,
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    return response;
  } catch (error: any) {
    clearTimeout(timeoutId);
    
    if (error.name === 'AbortError') {
      throw new Error(`Request timed out after ${timeout}ms`);
    }
    
    throw error;
  }
};

export const checkDemoUserStatusWithTimeout = async (
  timeout: number = 15000
): Promise<{ patient: boolean; doctor: boolean; checked: boolean }> => {
  try {
    const response = await fetchWithTimeout(
      `https://wafdbaovtordgegrndhc.supabase.co/functions/v1/check-demo-users`,
      {
        headers: {
          'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndhZmRiYW92dG9yZGdlZ3JuZGhjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTczMjgzNjAsImV4cCI6MjA3MjkwNDM2MH0.pso7UhUWd1P4qcJZlRuyOav8AMzQJKDpsLbNMyJvtOg`,
        },
        timeout
      }
    );

    if (response.ok) {
      const result = await response.json();
      return {
        patient: result.status?.patient === 'exists',
        doctor: result.status?.doctor === 'exists',
        checked: true
      };
    } else {
      console.log('Demo user status check returned non-ok response:', response.status);
      return { patient: false, doctor: false, checked: true };
    }
  } catch (error: any) {
    if (error.message.includes('timed out')) {
      console.log('Demo user status check timed out (this is normal on slow connections)');
    } else {
      console.log('Could not check demo user status (this is normal if demo users don\'t exist yet):', error.message);
    }
    return { patient: false, doctor: false, checked: true };
  }
};

export const repairUserProfileWithTimeout = async (
  email: string,
  timeout: number = 15000
): Promise<{ success: boolean; error?: string }> => {
  try {
    const response = await fetchWithTimeout(
      `https://wafdbaovtordgegrndhc.supabase.co/functions/v1/create-demo-users`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndhZmRiYW92dG9yZGdlZ3JuZGhjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTczMjgzNjAsImV4cCI6MjA3MjkwNDM2MH0.pso7UhUWd1P4qcJZlRuyOav8AMzQJKDpsLbNMyJvtOg`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'repair_profile',
          email
        }),
        timeout
      }
    );

    if (response.ok) {
      const result = await response.json();
      return { success: true };
    } else {
      const errorText = await response.text();
      return { success: false, error: errorText || 'Profile repair failed' };
    }
  } catch (error: any) {
    if (error.message.includes('timed out')) {
      return { success: false, error: 'Profile repair timed out. Please try again.' };
    }
    return { success: false, error: error.message };
  }
};