import React, { createContext, useContext } from 'react';

interface DemoContextType {
  isDemoMode: boolean;
  demoProfile: any | null;
  demoUser: any | null;
}

const DemoContext = createContext<DemoContextType>({
  isDemoMode: false,
  demoProfile: null,
  demoUser: null
});

export const useDemo = () => {
  return useContext(DemoContext);
};

interface DemoProviderProps {
  children: React.ReactNode;
  userType?: 'patient' | 'doctor' | 'pregnant';
  isDemoMode?: boolean;
}

export const DemoProvider: React.FC<DemoProviderProps> = ({ 
  children, 
  userType,
  isDemoMode = false
}) => {
  const demoProfile = userType ? {
    id: 'demo-' + userType,
    user_type: userType === 'pregnant' ? 'patient' : userType,
    full_name: userType === 'patient' ? 'Demo Patient' : 
               userType === 'pregnant' ? 'Priya Sharma' : 'Dr. Demo Singh',
    phone: '+91-9876543210',
    email: `demo.${userType}@nabhasihata.com`,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    village: 'Demo Village',
    district: 'Nabha',
    state: 'Punjab',
    pregnancy_status: userType === 'pregnant' ? {
      weeks_pregnant: 24,
      due_date: '2025-03-20',
      trimester: 2,
      last_checkup: '2025-01-10',
      next_checkup: '2025-02-14'
    } : null
  } : null;
  
  const demoUser = userType ? {
    id: 'demo-' + userType,
    email: `demo.${userType}@nabhasihata.com`,
    user_metadata: { full_name: demoProfile?.full_name }
  } : null;
  
  const contextValue: DemoContextType = {
    isDemoMode,
    demoProfile,
    demoUser
  };
  
  return (
    <DemoContext.Provider value={contextValue}>
      {children}
    </DemoContext.Provider>
  );
};