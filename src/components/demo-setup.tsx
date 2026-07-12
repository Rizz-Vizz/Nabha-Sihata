import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { authService } from '../utils/supabase/client';
import { toast } from 'sonner@2.0.3';
import { Loader, CheckCircle, XCircle } from 'lucide-react';

interface DemoSetupProps {
  onComplete?: () => void;
  onStatusChange?: (status: { patient: boolean; doctor: boolean }) => void;
}

export const DemoSetup: React.FC<DemoSetupProps> = ({ onComplete, onStatusChange }) => {
  const [loading, setLoading] = useState(false);
  const [checkingStatus, setCheckingStatus] = useState(true);
  const [status, setStatus] = useState<{
    patient: 'pending' | 'success' | 'error';
    doctor: 'pending' | 'success' | 'error';
  }>({
    patient: 'pending',
    doctor: 'pending'
  });

  const demoUsers = {
    patient: {
      email: 'demo.patient@nabhasihata.com',
      password: 'demo123',
      name: 'Demo Patient',
      phone: '+91 9876543210',
      village: 'Nabha',
      age: 35
    },
    doctor: {
      email: 'demo.doctor@nabhasihata.com',
      password: 'demo123',
      name: 'Dr. Demo Singh',
      phone: '+91 9876543211',
      specialty: 'General Medicine',
      license_number: 'DMO12345',
      hospital: 'Civil Hospital Nabha'
    }
  };

  
  React.useEffect(() => {
    const checkDemoUsers = async () => {
      try {
        
        const response = await fetch(`https://wafdbaovtordgegrndhc.supabase.co/functions/v1/check-demo-users`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndhZmRiYW92dG9yZGdlZ3JuZGhjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTczMjgzNjAsImV4cCI6MjA3MjkwNDM2MH0.pso7UhUWd1P4qcJZlRuyOav8AMzQJKDpsLbNMyJvtOg`,
          },
        });

        if (response.ok) {
          const result = await response.json();
          if (result.status) {
            const newStatus = {
              patient: result.status.patient === 'exists' ? 'success' : 'pending',
              doctor: result.status.doctor === 'exists' ? 'success' : 'pending'
            } as const;
            
            setStatus(prev => ({
              ...prev,
              patient: newStatus.patient,
              doctor: newStatus.doctor
            }));

            
            if (onStatusChange) {
              onStatusChange({
                patient: newStatus.patient === 'success',
                doctor: newStatus.doctor === 'success'
              });
            }
          }
        }
      } catch (error) {
        console.log('Could not check demo user status:', error);
        
      } finally {
        setCheckingStatus(false);
      }
    };

    checkDemoUsers();
  }, []);

  const createDemoUsers = async () => {
    setLoading(true);
    
    try {
      console.log('Creating demo users via admin API...');
      
      
      const response = await fetch(`https://wafdbaovtordgegrndhc.supabase.co/functions/v1/create-demo-users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndhZmRiYW92dG9yZGdlZ3JuZGhjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTczMjgzNjAsImV4cCI6MjA3MjkwNDM2MH0.pso7UhUWd1P4qcJZlRuyOav8AMzQJKDpsLbNMyJvtOg`,
        },
      });

      if (!response.ok) {
        throw new Error(`Demo user creation failed: ${response.status}`);
      }

      const result = await response.json();
      console.log('Demo users creation result:', result);

      
      if (result.results) {
        result.results.forEach((userResult: any) => {
          if (userResult.type === 'patient') {
            setStatus(prev => ({ 
              ...prev, 
              patient: userResult.status === 'created' || userResult.status === 'already_exists' ? 'success' : 'error' 
            }));
          } else if (userResult.type === 'doctor') {
            setStatus(prev => ({ 
              ...prev, 
              doctor: userResult.status === 'created' || userResult.status === 'already_exists' ? 'success' : 'error' 
            }));
          }
        });
      }

      const successCount = result.success_count || 0;
      
      if (successCount > 0) {
        toast.success(`Demo users are ready! (${successCount} users available)`);
        
        
        if (onStatusChange) {
          onStatusChange({
            patient: status.patient === 'success',
            doctor: status.doctor === 'success'
          });
        }
        
        if (onComplete) {
          setTimeout(onComplete, 1000);
        }
      } else {
        throw new Error('Could not create any demo users');
      }
      
    } catch (error: any) {
      console.error('Failed to create demo users:', error);
      toast.error('Failed to create demo users. Please check your internet connection and try again.');
      setStatus({ patient: 'error', doctor: 'error' });
    }

    setLoading(false);
  };

  const testSignIn = async (userType: 'patient' | 'doctor') => {
    try {
      const user = demoUsers[userType];
      await authService.signIn(user.email, user.password);
      toast.success(`${userType} sign-in test successful!`);
    } catch (error: any) {
      toast.error(`${userType} sign-in test failed: ${error.message}`);
    }
  };

  const getStatusIcon = (userStatus: 'pending' | 'success' | 'error') => {
    switch (userStatus) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'error':
        return <XCircle className="w-5 h-5 text-red-600" />;
      default:
        return <div className="w-5 h-5 rounded-full border-2 border-gray-300" />;
    }
  };

  return (
    <Card className="p-6 max-w-md mx-auto">
      <h3 className="text-lg font-semibold mb-4">🧪 Demo Users Setup</h3>
      <p className="text-sm text-gray-600 mb-4">
        Create demo accounts in Supabase Auth to test the telemedicine app. This creates actual 
        user accounts that you can sign in with. This only needs to be done once.
      </p>

      <div className="space-y-3 mb-6">
        <div className="flex items-center justify-between p-3 bg-blue-50 rounded">
          <div>
            <div className="font-medium">Demo Patient</div>
            <div className="text-xs text-gray-600">demo.patient@nabhasihata.com</div>
          </div>
          {getStatusIcon(status.patient)}
        </div>

        <div className="flex items-center justify-between p-3 bg-green-50 rounded">
          <div>
            <div className="font-medium">Demo Doctor</div>
            <div className="text-xs text-gray-600">demo.doctor@nabhasihata.com</div>
          </div>
          {getStatusIcon(status.doctor)}
        </div>
      </div>

      <div className="space-y-2">
        {checkingStatus ? (
          <div className="text-center py-4">
            <Loader className="animate-spin w-6 h-6 mx-auto mb-2 text-blue-600" />
            <p className="text-sm text-gray-600">Checking demo user status...</p>
          </div>
        ) : (
          <>
            {(status.patient === 'success' && status.doctor === 'success') ? (
              <div className="text-center py-4">
                <CheckCircle className="w-12 h-12 mx-auto mb-3 text-green-600" />
                <h4 className="font-semibold text-green-800 mb-2">Demo Users Ready!</h4>
                <p className="text-sm text-green-700 mb-4">
                  Both demo accounts are set up and ready to use.
                </p>
                <Button
                  onClick={onComplete}
                  className="bg-green-600 hover:bg-green-700"
                >
                  Start Using App
                </Button>
              </div>
            ) : (
              <Button
                onClick={createDemoUsers}
                disabled={loading}
                className="w-full"
              >
                {loading ? (
                  <div className="flex items-center">
                    <Loader className="animate-spin w-4 h-4 mr-2" />
                    Creating Demo Users...
                  </div>
                ) : (
                  'Create Demo Users'
                )}
              </Button>
            )}
          </>
        )}

        {(status.patient === 'success' || status.doctor === 'success') && (
          <div className="space-y-1">
            <div className="text-xs text-gray-600 mt-3 mb-2">Test Sign-In:</div>
            {status.patient === 'success' && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => testSignIn('patient')}
                className="w-full"
              >
                Test Patient Sign-In
              </Button>
            )}
            {status.doctor === 'success' && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => testSignIn('doctor')}
                className="w-full"
              >
                Test Doctor Sign-In
              </Button>
            )}
          </div>
        )}
      </div>

      <div className="mt-4 p-3 bg-blue-50 rounded text-xs text-blue-700">
        <strong>Demo Credentials:</strong><br />
        • Patient: demo.patient@nabhasihata.com<br />
        • Doctor: demo.doctor@nabhasihata.com<br />
        • Password for both: <code className="bg-blue-100 px-1 rounded">demo123</code>
        
        {(status.patient === 'success' || status.doctor === 'success') && (
          <div className="mt-2 pt-2 border-t border-blue-200">
            <strong>✅ Ready to use!</strong> Go back and select Patient or Doctor, then sign in with these credentials.
          </div>
        )}
      </div>
    </Card>
  );
};