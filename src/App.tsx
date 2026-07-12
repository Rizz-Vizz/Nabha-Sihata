import React, { useState } from 'react';
import { Button } from './components/ui/button';
import { Card } from './components/ui/card';
import { PatientDashboard } from './components/patient-dashboard';
import { DoctorDashboard } from './components/doctor-dashboard';
import { PregnancyDashboard } from './components/pregnancy-dashboard';
import { PatientRecords } from './components/patient-records';
import { PrescriptionPad } from './components/prescription-pad';
import { SurveyResultsDoctor } from './components/survey-results-doctor';
import { AuthScreen } from './components/auth-screen';
import { WelcomeScreen } from './components/welcome-screen';
import { MedCoins } from './components/med-coins';
import { LanguageProvider, useLanguage } from './components/language-context';
import { LanguageSwitcher } from './components/language-switcher';
import { OfflineProvider } from './components/offline-context';
import { AuthProvider, useAuth } from './components/auth-context';
import { DemoProvider } from './components/demo-context';
import { SpeechRecognitionProvider } from './components/speech-recognition-context';
import { SafeSpeechProvider } from './components/safe-speech-wrapper';
import { VoiceStatus } from './components/voice-indicator';
import { AddMember, FamilyMember } from './components/add-member';
import { ErrorBoundary } from './components/error-boundary';
import { UserCheck, Globe, Wifi, WifiOff, LogOut, AlertCircle, CheckCircle } from 'lucide-react';
import patientIcon from '@/assets/01ec76020cd14434a23c1ff4857f1dbfbcc6ad1a.png';
import doctorIcon from '@/assets/50846eb64745974d321291b8a21b1450610141c3.png';
import newLogo from '@/assets/aa40833ff2e7677dd47ad2ece6ec0264a9ed8be6.png';
import { toast, Toaster } from 'sonner@2.0.3';
import { testConnectionWithSetup, supabase } from './utils/supabase/client';
import { checkAndSetupApp, SetupResult } from './utils/supabase/auto-setup';
import { checkDemoUserStatusWithTimeout, repairUserProfileWithTimeout } from './utils/api-helpers';

function AppContent() {
  const { t, language, setLanguage } = useLanguage();
  const { user, userProfile, loading, needsSetup, signOut, refreshProfile } = useAuth();
  const [selectedUserType, setSelectedUserType] = useState<'patient' | 'doctor' | 'pregnant' | null>(null);
  const [showAuth, setShowAuth] = useState(false);
  const [demoMode, setDemoMode] = useState(false);
  const [showLogin, setShowLogin] = useState(true);
  const [showMemberSelection, setShowMemberSelection] = useState(false);
  const [selectedDemoProfile, setSelectedDemoProfile] = useState<'patient' | 'doctor' | null>(null);
  const [showAddMember, setShowAddMember] = useState(false);
  const [selectedMember, setSelectedMember] = useState<FamilyMember | null>(null);
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([]);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [fromSignInWithAccount, setFromSignInWithAccount] = useState(false);
  const [showMedCoins, setShowMedCoins] = useState(false);
  const [medCoinsBalance, setMedCoinsBalance] = useState(150); 

  const [supabaseStatus, setSupabaseStatus] = useState<{
    connected: boolean;
    needsSetup: boolean;
    error: string | null;
  } | null>(null);
  const [demoUserStatus, setDemoUserStatus] = useState<{
    patient: boolean;
    doctor: boolean;
    checked: boolean;
  }>({ patient: false, doctor: false, checked: false });
  const [autoSetupStatus, setAutoSetupStatus] = useState<{
    running: boolean;
    completed: boolean;
    result?: SetupResult;
    timedOut?: boolean;
  }>({ running: false, completed: false });
  const [showWelcome, setShowWelcome] = useState(false);
  const [setupCheckRun, setSetupCheckRun] = useState(false);
  const setupInProgress = React.useRef(false);

  React.useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  
  React.useEffect(() => {
    const savedMembers = localStorage.getItem('familyMembers');
    if (savedMembers) {
      try {
        const parsed = JSON.parse(savedMembers);
        if (Array.isArray(parsed)) {
          setFamilyMembers(parsed);
        }
      } catch (error) {
        console.error('Error loading family members:', error);
        localStorage.removeItem('familyMembers'); 
      }
    }
  }, []);

  
  React.useEffect(() => {
    const checkSupabaseConnectionAndSetup = async () => {
      if (setupCheckRun || setupInProgress.current) return;
      
      setupInProgress.current = true;
      
      try {
        setSetupCheckRun(true);
        
        
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Setup timeout')), 15000)
        );
        
        const setupPromise = async () => {
          const status = await testConnectionWithSetup();
          setSupabaseStatus(status);
          
          if (status.connected && !status.needsSetup && !user) {
            setAutoSetupStatus({ running: true, completed: false });
            
            const setupResult = await checkAndSetupApp();
            setAutoSetupStatus({ 
              running: false, 
              completed: true, 
              result: setupResult 
            });
            
            if (setupResult.demoUsersCreated) {
              setDemoUserStatus({
                patient: true,
                doctor: true,
                checked: true
              });
            }
            
            if (setupResult.autoLoginSuccess) {
              setTimeout(() => setShowWelcome(true), 1000);
              toast.success('🎉 Welcome! Auto-setup completed and you\'re logged in as Demo Patient.');
            } else if (setupResult.demoUsersCreated && !setupResult.autoLoginSuccess) {
              toast.success('✅ Demo users created! You can now sign in.');
            }
          } else {
            setAutoSetupStatus({ running: false, completed: true });
          }
          
          
          try {
            const demoStatus = await checkDemoUserStatusWithTimeout(5000);
            setDemoUserStatus(demoStatus);
          } catch (error) {
            setDemoUserStatus({ patient: false, doctor: false, checked: true });
          }
        };
        
        await Promise.race([setupPromise(), timeoutPromise]);
        
      } catch (error: any) {
        console.warn('Setup timeout or error:', error.message);
        const isTimeout = error.message === 'Setup timeout';
        
        setSupabaseStatus({
          connected: false,
          needsSetup: true,
          error: isTimeout ? 'Setup timeout - continuing in offline mode' : 'Setup error - continuing in offline mode'
        });
        setAutoSetupStatus({ 
          running: false, 
          completed: true, 
          timedOut: isTimeout 
        });
        setDemoUserStatus({ patient: false, doctor: false, checked: true });
        
        if (isTimeout) {
          toast.info('Setup took too long - continuing with demo mode');
        } else {
          toast.info('Setup error - continuing with demo mode');
        }
      } finally {
        setupInProgress.current = false;
      }
    };

    if (!setupCheckRun) {
      
      const scheduleSetup = () => {
        if (window.requestIdleCallback) {
          window.requestIdleCallback(() => checkSupabaseConnectionAndSetup());
        } else {
          setTimeout(checkSupabaseConnectionAndSetup, 100);
        }
      };
      scheduleSetup();
    }
  }, [user, setupCheckRun]);

  const checkDemoUserStatus = async () => {
    try {
      const result = await checkDemoUserStatusWithTimeout(5000);
      setDemoUserStatus(result);
    } catch (error) {
      console.warn('Demo user status check failed:', error);
      setDemoUserStatus({ patient: false, doctor: false, checked: true });
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      setSelectedUserType(null);
      setShowAuth(false);
      toast.success(t('signOutSuccessful'));
    } catch (error: any) {
      toast.error(error.message || 'Sign out failed');
    }
  };

  const handleUserTypeSelect = (userType: 'patient' | 'doctor' | 'pregnant') => {
    setSelectedUserType(userType);
    if (demoMode) {
      return;
    } else {
      setShowAuth(true);
    }
  };

  const handleDemoProfileSelect = (profileType: 'patient' | 'doctor') => {
    setDemoMode(true);
    setShowLogin(false);
    setSelectedDemoProfile(profileType);
    
    if (profileType === 'patient') {
      setShowMemberSelection(true);
      toast.success('🎉 ' + t('welcomeDemoPatient'));
    } else {
      setSelectedUserType(profileType);
      toast.success('🎉 ' + t('welcomeDemoDoctor'));
    }
  };

  const handleMemberSelect = (memberType: 'me' | 'wife' | 'child' | 'add' | string) => {
    if (memberType === 'add') {
      setShowAddMember(true);
      return;
    }

    let member: FamilyMember | null = null;

    if (memberType === 'me') {
      member = {
        id: 'me',
        name: 'Rajinder Singh',
        gender: 'male',
        age: 45,
        relationship: 'self',
        emoji: '👨',
        bloodGroup: 'B+',
        showPregnancy: false
      };
    } else if (memberType === 'wife') {
      member = {
        id: 'wife',
        name: 'Simran Kaur',
        gender: 'female',
        age: 40,
        relationship: 'spouse',
        emoji: '👩',
        bloodGroup: 'A+',
        showPregnancy: true
      };
    } else if (memberType === 'child') {
      member = {
        id: 'child',
        name: 'Arjun Singh',
        gender: 'male',
        age: 12,
        relationship: 'child',
        emoji: '👦',
        bloodGroup: 'O+',
        showPregnancy: false
      };
    } else {
      member = familyMembers.find(m => m.id === memberType) || null;
    }

    setSelectedMember(member);
    setShowMemberSelection(false);
    setSelectedUserType('patient');
  };

  const handleRemoveFamilyMember = (memberId: string) => {
    if (memberId === 'me' || memberId === 'wife' || memberId === 'child') {
      return;
    }
    
    const memberToRemove = familyMembers.find(m => m.id === memberId);
    if (!memberToRemove) return;
    
    const confirmed = window.confirm(
      t('confirmRemoveFamilyMember').replace('{name}', memberToRemove.name)
    );
    
    if (!confirmed) return;
    
    const updatedMembers = familyMembers.filter(m => m.id !== memberId);
    setFamilyMembers(updatedMembers);
    localStorage.setItem('familyMembers', JSON.stringify(updatedMembers));
    toast.success(`${memberToRemove.name} ${t('familyMemberRemoved')}`);
  };

  const handleMemberAdded = (newMember: FamilyMember) => {
    const updatedMembers = [...familyMembers, newMember];
    setFamilyMembers(updatedMembers);
    localStorage.setItem('familyMembers', JSON.stringify(updatedMembers));
    setShowAddMember(false);
    setShowMemberSelection(true);
    toast.success(`${newMember.name} ${t('familyMemberAdded')}`);
  };

  
  if (showMedCoins) {
    return (
      <MedCoins 
        onBack={() => setShowMedCoins(false)} 
      />
    );
  }

  
  if (loading || autoSetupStatus.running) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-800 font-medium mb-2">
            {autoSetupStatus.running ? t('settingUpNabhaSihata') : t('loading')}
          </p>
          {autoSetupStatus.running && (
            <div className="text-sm text-gray-600 space-y-1">
              <p>🔍 {t('checkingDatabase')}</p>
              <p>👥 {t('creatingDemoUsers')}</p>
              <p>🔐 {t('loggingYouIn')}</p>
              <div className="mt-4 text-xs text-blue-600">
                {t('onlyHappensOnce')}
              </div>
            </div>
          )}
          
          {}
          <div className="mt-8 space-y-2">
            <Button
              variant="outline"
              onClick={() => {
                setAutoSetupStatus({ running: false, completed: true });
                toast.info('Setup skipped - you can still use demo mode');
              }}
              className="text-sm w-full"
            >
              Skip Setup & Continue
            </Button>
            <p className="text-xs text-gray-500">
              All features work in demo mode without setup
            </p>
          </div>
        </div>
      </div>
    );
  }

  
  if (showWelcome && user && userProfile) {
    return (
      <WelcomeScreen 
        onContinue={() => setShowWelcome(false)} 
      />
    );
  }

  
  if (user && userProfile) {
    const userType = userProfile.user_type;
    
    if (userType === 'patient') {
      return <PatientDashboard onBack={handleSignOut} selectedMember={selectedMember} />;
    }
    
    if (userType === 'doctor') {
      return <DoctorDashboard onBack={handleSignOut} />;
    }
  }

  
  if (demoMode && selectedUserType) {
    const handleDemoSignOut = () => {
      setSelectedUserType(null);
      
      if (selectedDemoProfile === 'patient') {
        setShowMemberSelection(true);
        toast.success(t('returnedToFamilySelection'));
      } else {
        setDemoMode(false);
        setSelectedDemoProfile(null);
        setShowLogin(true);
        toast.success(t('returnedToLoginScreen'));
      }
    };
    
    if (selectedUserType === 'patient') {
      return (
        <DemoProvider userType="patient" isDemoMode={true}>
          <PatientDashboard onBack={handleDemoSignOut} selectedMember={selectedMember} />
        </DemoProvider>
      );
    }
    
    if (selectedUserType === 'doctor') {
      return (
        <DemoProvider userType="doctor" isDemoMode={true}>
          <DoctorDashboard onBack={handleDemoSignOut} />
        </DemoProvider>
      );
    }
    
    if (selectedUserType === 'pregnant') {
      return (
        <DemoProvider userType="pregnant" isDemoMode={true}>
          <PregnancyDashboard onBack={handleDemoSignOut} />
        </DemoProvider>
      );
    } 
  }

  
  if (user && needsSetup && !loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 p-4 flex items-center justify-center">
        {}
        <div className="fixed top-6 right-6 z-50">
          <LanguageSwitcher />
        </div>
        
        <Card className="max-w-md w-full p-6 text-center">
          <div className="w-28 h-28 mx-auto mb-4 flex items-center justify-center">
            <img 
              src={newLogo} 
              alt="Nabha Sihata Logo"
              className="w-28 h-28 object-contain"
            />
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-3">
            {t('databaseSetupRequired')}
          </h3>
          <div className="text-left bg-gray-50 rounded-lg p-4 mb-4">
            <p className="text-sm text-gray-700 mb-2">
              <strong>{t('welcomeUserEmail').replace('{email}', user.email!)}</strong>
            </p>
            <p className="text-sm text-gray-600">
              {t('accountCreatedSuccessfully')}
            </p>
          </div>
          <div className="space-y-3">
            <Button
              onClick={async () => {
                window.location.reload();
              }}
              className="w-full"
            >
              {t('setupDatabaseNow')}
            </Button>
            <Button
              variant="outline"
              onClick={handleSignOut}
              className="w-full"
            >
              <LogOut className="w-4 h-4 mr-2" />
              {t('signOutAndTryLater')}
            </Button>
          </div>
          <div className="mt-4 text-xs text-gray-500">
            💡 {t('databaseSetupOnlyOnce')}
          </div>
        </Card>
      </div>
    );
  }

  
  if (user && !userProfile && !needsSetup && !loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 p-4 flex items-center justify-center">
        {}
        <div className="fixed top-6 right-6 z-50">
          <LanguageSwitcher />
        </div>
        
        <Card className="max-w-md w-full p-6 text-center">
          <div className="w-28 h-28 mx-auto mb-4 flex items-center justify-center">
            <img 
              src={newLogo} 
              alt="Nabha Sihata Logo"
              className="w-28 h-28 object-contain"
            />
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-3">
            {t('profileSetupIssue')}
          </h3>
          <div className="text-left bg-gray-50 rounded-lg p-4 mb-4">
            <p className="text-sm text-gray-700 mb-2">
              <strong>{t('accountLabel').replace('{email}', user.email!)}</strong>
            </p>
            <p className="text-sm text-gray-600">
              {t('profileLoadingIssue')}
            </p>
          </div>
          <div className="space-y-3">
            <Button
              onClick={async () => {
                try {
                  await refreshProfile();
                  toast.success(t('profileRefreshedSuccessfully'));
                } catch (error: any) {
                  toast.error(t('profileRefreshFailed') + ' ' + error.message);
                }
              }}
              variant="outline"
              className="w-full"
            >
              🔄 {t('refreshProfile')}
            </Button>
            <Button
              onClick={handleSignOut}
              className="w-full"
            >
              <LogOut className="w-4 h-4 mr-2" />
              {t('signOutAndTryAgain')}
            </Button>
          </div>
          <div className="mt-4 text-xs text-gray-500">
            💡 {t('persistsContactSupport')}
          </div>
        </Card>
      </div>
    );
  }

  
  if (showAddMember && demoMode && selectedDemoProfile === 'patient') {
    return (
      <AddMember 
        onBack={() => {
          setShowAddMember(false);
          setShowMemberSelection(true);
        }}
        onMemberAdded={handleMemberAdded}
      />
    );
  }

  
  if (showMemberSelection && demoMode && selectedDemoProfile === 'patient') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white p-6">
        {}
        <div className="fixed top-6 left-6 z-40">
          <Button
            variant="outline"
            onClick={() => {
              setShowMemberSelection(false);
              setDemoMode(false);
              setSelectedDemoProfile(null);
              setShowLogin(true);
              toast.info(t('returnedToLoginScreen'));
            }}
            className="flex items-center space-x-2 bg-white shadow-md"
          >
            <span>←</span>
            <span>{t('backToLogin')}</span>
          </Button>
        </div>

        {}
        <div className="fixed top-6 right-6 z-40 flex items-center space-x-3">
          <LanguageSwitcher />
          <div className="bg-green-100 border border-green-300 rounded-lg px-3 py-2 shadow-md">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-green-800">{t('demoMode')}</span>
            </div>
          </div>
        </div>

        {}
        <div className="flex justify-center items-center mb-12 mt-20">
          <div className="flex items-center -space-x-1">
            <div className="w-28 h-28 flex items-center justify-center">
              <img 
                src={newLogo} 
                alt="Nabha Sihata Logo"
                className="w-28 h-28 object-contain"
              />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-green-600">Nabha Sihata</h1>
              <p className="text-gray-600">{t('tagline') || 'Rural Healthcare Made Simple'}</p>
            </div>
          </div>
        </div>

        {}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-800 mb-6">{t('selectFamilyMember') || 'Select Family Member'}</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-6">
            {t('chooseFamilyMemberDesc') || 'Choose which family member needs healthcare services today.'}
          </p>
          <div className="inline-block bg-green-50 border border-green-200 rounded-lg px-6 py-3">
            <p className="text-green-700">
              ✨ {t('personalizedHealthcareFeatures') || 'Each member has personalized healthcare features and records'}
            </p>
          </div>
        </div>

        {}
        <div className="max-w-4xl mx-auto grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {}
          <Card className="p-8 text-center hover:shadow-xl transition-all cursor-pointer border-2 hover:border-blue-200 transform hover:scale-105"
                onClick={() => handleMemberSelect('me')}>
            <div className="w-24 h-24 mx-auto mb-6 text-6xl flex items-center justify-center">
              👨
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-3">{t('me') || 'Me'}</h3>
            <p className="text-gray-600 mb-4">Rajinder Singh</p>
            <div className="text-sm text-blue-600 bg-blue-50 rounded-lg p-3">
              <div className="flex items-center justify-center space-x-2 mb-2">
                <span>📋</span>
                <span>{t('myHealthRecords') || 'My Health Records'}</span>
              </div>
              <div className="flex items-center justify-center space-x-2">
                <span>🤖</span>
                <span>{t('symptomCheck')}</span>
              </div>
            </div>
          </Card>

          {}
          {familyMembers.map((member) => (
            <Card key={member.id} className="relative p-8 text-center hover:shadow-xl transition-all cursor-pointer border-2 hover:border-purple-200 transform hover:scale-105"
                  onClick={() => handleMemberSelect(member.id)}>
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemoveFamilyMember(member.id);
                }}
                className="absolute top-3 right-3 w-8 h-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
              >
                ✕
              </Button>
              
              <div className="w-24 h-24 mx-auto mb-6 text-6xl flex items-center justify-center">
                {member.emoji}
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-3">{member.name}</h3>
              <p className="text-gray-600 mb-4">{member.age} {t('yearsOld') || 'years old'}</p>
              <div className="text-sm text-purple-600 bg-purple-50 rounded-lg p-3">
                <div className="flex items-center justify-center space-x-2 mb-2">
                  <span>📋</span>
                  <span>{t('records')}</span>
                </div>
                <div className="flex items-center justify-center space-x-2">
                  {member.showPregnancy ? (
                    <>
                      <span>🤰</span>
                      <span>{t('pregnancyCare') || 'Pregnancy Care'}</span>
                    </>
                  ) : (
                    <>
                      <span>⚕️</span>
                      <span>{t('healthcare') || 'Healthcare'}</span>
                    </>
                  )}
                </div>
              </div>
            </Card>
          ))}

          {}
          <Card className="p-8 text-center hover:shadow-xl transition-all cursor-pointer border-2 border-dashed border-gray-300 hover:border-blue-300 transform hover:scale-105"
                onClick={() => handleMemberSelect('add')}>
            <div className="w-24 h-24 mx-auto mb-6 text-6xl flex items-center justify-center text-gray-400">
              ➕
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-3">{t('addMember') || 'Add Member'}</h3>
            <p className="text-gray-600 mb-4">{t('addFamilyMember') || 'Add family member'}</p>
            <div className="text-sm text-gray-600 bg-gray-50 rounded-lg p-3">
              <div className="flex items-center justify-center space-x-2 mb-2">
                <span>👨‍👩‍👧‍👦</span>
                <span>{t('newMember') || 'New Member'}</span>
              </div>
              <div className="flex items-center justify-center space-x-2">
                <span>⚕️</span>
                <span>{t('healthSetup') || 'Health Setup'}</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  
  if (showAuth && selectedUserType && !demoMode) {
    return (
      <AuthScreen 
        userType={selectedUserType} 
        onBack={() => {
          setShowAuth(false);
          setSelectedUserType(null);
        }} 
      />
    );
  }

  
  if (showLogin && !demoMode && !user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 p-6 flex items-center justify-center">
        <Card className="max-w-lg w-full p-10 text-center">
          {}
          <div className="flex justify-center items-center mb-10">
            <div className="flex items-center -space-x-1">
              <div className="w-28 h-28 flex items-center justify-center">
                <img 
                  src={newLogo} 
                  alt="Nabha Sihata Logo"
                  className="w-28 h-28 object-contain"
                />
              </div>
              <div className="text-left">
                <h1 className="text-3xl font-bold text-green-600">Nabha Sihata</h1>
                <p className="text-gray-600">{t('tagline')}</p>
              </div>
            </div>
          </div>

          {}
          <div className="mb-10">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">{t('welcome')}</h2>
            <p className="text-lg text-gray-600">{t('loginWelcomeDesc')}</p>
          </div>

          {}
          <div className="flex justify-center items-center space-x-6 mb-10">
            <VoiceStatus />

            <div className="flex items-center space-x-2">
              {isOnline ? (
                <Wifi className="w-5 h-5 text-green-500" />
              ) : (
                <WifiOff className="w-5 h-5 text-red-500" />
              )}
              <span className="text-sm text-gray-600">
                {isOnline ? t('online') : t('offline')}
              </span>
            </div>
            
            <LanguageSwitcher />
          </div>

          {}
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-gray-800 text-center mb-8">{t('chooseLoginMethod') || 'Choose Login Method'}</h3>
            
            <Button 
              onClick={() => {
                setDemoMode(true);
                setShowLogin(false);
              }}
              className="w-full h-16 bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600 text-white text-lg"
            >
              <div className="flex items-center space-x-4">
                <span className="text-3xl">🚀</span>
                <div className="text-left">
                  <div className="font-bold">{t('demoLogin') || 'Demo Login'}</div>
                  <div className="text-sm text-blue-100">{t('instantAccess') || 'Instant access, no setup'}</div>
                </div>
              </div>
            </Button>

            <Button 
              variant="outline"
              onClick={() => {
                setShowLogin(false);
                setFromSignInWithAccount(true);
              }}
              className="w-full h-16 border-2 hover:bg-gray-50"
            >
              <div className="flex items-center space-x-4">
                <span className="text-3xl">🔐</span>
                <div className="text-left text-gray-700">
                  <div className="font-bold">{t('signInWithAccount') || 'Sign In With Account'}</div>
                  <div className="text-sm text-gray-500">{t('forRegisteredUsers') || 'For registered users'}</div>
                </div>
              </div>
            </Button>
          </div>

          {}
          <div className="mt-10 grid grid-cols-2 gap-4">
            <div className="flex items-center justify-center space-x-2 p-3 bg-blue-50 rounded-lg">
              <span>📞</span>
              <span className="text-sm">{t('consultation')}</span>
            </div>
            <div className="flex items-center justify-center space-x-2 p-3 bg-green-50 rounded-lg">
              <span>🤖</span>
              <span className="text-sm">{t('symptomCheck')}</span>
            </div>
            <div className="flex items-center justify-center space-x-2 p-3 bg-purple-50 rounded-lg">
              <span>📋</span>
              <span className="text-sm">{t('records')}</span>
            </div>
            <div className="flex items-center justify-center space-x-2 p-3 bg-red-50 rounded-lg">
              <span>🚨</span>
              <span className="text-sm">{t('emergency')}</span>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  
  if (demoMode && !selectedDemoProfile && !user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 p-6 flex items-center justify-center">
        <div className="fixed top-6 left-6 z-40">
          <Button
            variant="outline"
            onClick={() => {
              setDemoMode(false);
              setShowLogin(true);
            }}
            className="flex items-center space-x-2 bg-white shadow-md"
          >
            <span>←</span>
            <span>{t('backToLogin') || 'Back to Login'}</span>
          </Button>
        </div>

        <Card className="max-w-lg w-full p-10 text-center">
          {}
          <div className="flex justify-center items-center mb-10">
            <div className="flex items-center -space-x-1">
              <div className="w-28 h-28 flex items-center justify-center">
                <img 
                  src={newLogo} 
                  alt="Nabha Sihata Logo"
                  className="w-28 h-28 object-contain"
                />
              </div>
              <div className="text-left">
                <h1 className="text-3xl font-bold text-green-600">Nabha Sihata</h1>
                <p className="text-gray-600">{t('tagline')}</p>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="text-xl font-bold text-gray-800 text-center mb-8">{t('chooseDemoProfile') || 'Choose Demo Profile'}</h3>
            
            <Card className="p-6 hover:shadow-md transition-all cursor-pointer border-2 hover:border-blue-200 transform hover:scale-105"
                  onClick={() => handleDemoProfileSelect('patient')}>
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 flex items-center justify-center">
                  <img 
                    src={patientIcon} 
                    alt="Demo Patient"
                    className="w-16 h-16 object-contain"
                  />
                </div>
                <div className="flex-1 text-left">
                  <h4 className="text-xl font-bold text-gray-800">{t('demoPatient') || 'Demo Patient'}</h4>
                  <p className="text-gray-600 mb-3">{t('familyHealthcareManagement') || 'Family healthcare management'}</p>
                  <div className="flex items-center space-x-2">
                    <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">👨‍👩‍👧‍👦 {t('family') || 'Family'}</span>
                    <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">🏠 {t('patientPortal') || 'Patient Portal'}</span>
                  </div>
                </div>
                <div className="text-blue-500 text-2xl">→</div>
              </div>
            </Card>

            <Card className="p-6 hover:shadow-md transition-all cursor-pointer border-2 hover:border-green-200 transform hover:scale-105"
                  onClick={() => handleDemoProfileSelect('doctor')}>
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 flex items-center justify-center">
                  <img 
                    src={doctorIcon} 
                    alt="Demo Doctor"
                    className="w-16 h-16 object-contain"
                  />
                </div>
                <div className="flex-1 text-left">
                  <h4 className="text-xl font-bold text-gray-800">{t('demoDoctor') || 'Demo Doctor'}</h4>
                  <p className="text-gray-600 mb-3">{t('healthcareProviderDashboard') || 'Healthcare provider dashboard'}</p>
                  <div className="flex items-center space-x-2">
                    <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">👥 {t('patients')}</span>
                    <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">💊 {t('prescriptions')}</span>
                  </div>
                </div>
                <div className="text-green-500 text-2xl">→</div>
              </div>
            </Card>
            
            <div className="text-center mt-8">
              <p className="text-gray-600 mb-4">{t('demoAccountDesc')}</p>
              
              <div className="text-sm text-gray-500 bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-center space-x-2 mb-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>{t('noRegistrationRequired') || 'No registration required'}</span>
                </div>
                <div className="flex items-center justify-center space-x-2 mb-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>{t('fullFeatureAccess') || 'Full feature access'}</span>
                </div>
                <div className="flex items-center justify-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>{t('worksOffline') || 'Works offline'}</span>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white p-6">
      {}
      {fromSignInWithAccount && !demoMode && (
        <div className="fixed top-6 left-6 z-40">
          <Button
            variant="outline"
            onClick={() => {
              setFromSignInWithAccount(false);
              setShowLogin(true);
              toast.info(t('returnedToLoginScreen'));
            }}
            className="flex items-center space-x-2 bg-white shadow-md"
          >
            <span>←</span>
            <span>{t('backToLogin')}</span>
          </Button>
        </div>
      )}

      {}
      {demoMode && (
        <div className="fixed top-6 right-6 z-40">
          <div className="bg-green-100 border border-green-300 rounded-lg px-4 py-2 shadow-md">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="font-medium text-green-800">{t('demoMode')}</span>
            </div>
          </div>
        </div>
      )}

      {}
      <div className="flex justify-between items-center mb-12">
        <div className="flex items-center -space-x-1">
          <div className="w-28 h-28 flex items-center justify-center">
            <img 
              src={newLogo} 
              alt="Nabha Sihata Logo"
              className="w-28 h-28 object-contain"
            />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-green-600">Nabha Sihata</h1>
            <p className="text-gray-600">{t('tagline')}</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            {isOnline ? (
              <Wifi className="w-5 h-5 text-green-500" />
            ) : (
              <WifiOff className="w-5 h-5 text-red-500" />
            )}
            <span className="text-gray-600">
              {isOnline ? t('online') : t('offline')}
            </span>
          </div>
          
          <LanguageSwitcher />
        </div>
      </div>

      {}
      <div className="text-center mb-16">
        <h2 className="text-4xl font-bold text-gray-800 mb-6">
          {demoMode ? (t('chooseYourRole') || 'Choose Your Role') : t('welcome')}
        </h2>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          {demoMode 
            ? (t('selectPatientOrDoctor') || 'Select whether you are a patient seeking care or a doctor providing care.')
            : t('welcomeDesc')
          }
        </p>
        {demoMode && (
          <div className="mt-6 inline-block bg-green-50 border border-green-200 rounded-lg px-6 py-3">
            <p className="text-green-700">
              ✨ {t('demoModeActive') || "You're in demo mode - all features are fully functional without any setup!"}
            </p>
          </div>
        )}
      </div>

      {}
      <div className="max-w-5xl mx-auto grid md:grid-cols-2 lg:grid-cols-3 gap-10">
        {}
        <Card className="relative p-10 text-center hover:shadow-xl transition-all cursor-pointer border-2 hover:border-blue-200 transform hover:scale-105"
              onClick={() => handleUserTypeSelect('patient')}>
          {demoMode && (
            <div className="absolute top-3 right-3 bg-green-100 text-green-800 text-xs px-3 py-1 rounded-full">
              ✨ {t('demoReady')}
            </div>
          )}
          <div className="w-32 h-32 mx-auto mb-8 flex items-center justify-center">
            <img 
              src={patientIcon} 
              alt={t('patient')}
              className="w-32 h-32 object-contain"
            />
          </div>
          <h3 className="text-2xl font-bold text-gray-800 mb-6">
            {demoMode ? t('demoPatient') : t('patient')}
          </h3>
          <p className="text-gray-600 mb-8">
            {demoMode 
              ? (t('experiencePatientJourney') || 'Experience the patient journey with full access to all healthcare features')
              : t('patientDesc')
            }
          </p>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center justify-center space-x-2 p-3 bg-blue-50 rounded-lg">
              <span>📞</span>
              <span className="text-sm">{t('consultation')}</span>
            </div>
            <div className="flex items-center justify-center space-x-2 p-3 bg-blue-50 rounded-lg">
              <span>📋</span>
              <span className="text-sm">{t('records')}</span>
            </div>
            <div className="flex items-center justify-center space-x-2 p-3 bg-blue-50 rounded-lg">
              <span>🤖</span>
              <span className="text-sm">{t('symptomCheck')}</span>
            </div>
            <div className="flex items-center justify-center space-x-2 p-3 bg-red-50 rounded-lg">
              <span>🚨</span>
              <span className="text-sm">{t('emergency')}</span>
            </div>
          </div>
        </Card>

        {}
        <Card className="relative p-10 text-center hover:shadow-xl transition-all cursor-pointer border-2 hover:border-green-200 transform hover:scale-105"
              onClick={() => handleUserTypeSelect('doctor')}>
          {demoMode && (
            <div className="absolute top-3 right-3 bg-green-100 text-green-800 text-xs px-3 py-1 rounded-full">
              ✨ {t('demoReady')}
            </div>
          )}
          <div className="w-32 h-32 mx-auto mb-8 flex items-center justify-center">
            <img 
              src={doctorIcon} 
              alt={t('doctor')}
              className="w-32 h-32 object-contain"
            />
          </div>
          <h3 className="text-2xl font-bold text-gray-800 mb-6">
            {demoMode ? t('demoDoctor') : t('doctor')}
          </h3>
          <p className="text-gray-600 mb-8">
            {demoMode 
              ? (t('exploreDoctorDashboard') || 'Explore the doctor dashboard with patient management and consultation tools')
              : t('doctorDesc')
            }
          </p>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center justify-center space-x-2 p-3 bg-green-50 rounded-lg">
              <span>👥</span>
              <span className="text-sm">{t('patients')}</span>
            </div>
            <div className="flex items-center justify-center space-x-2 p-3 bg-green-50 rounded-lg">
              <span>📊</span>
              <span className="text-sm">{t('analytics')}</span>
            </div>
            <div className="flex items-center justify-center space-x-2 p-3 bg-green-50 rounded-lg">
              <span>💊</span>
              <span className="text-sm">{t('prescriptions')}</span>
            </div>
            <div className="flex items-center justify-center space-x-2 p-3 bg-green-50 rounded-lg">
              <span>📱</span>
              <span className="text-sm">{t('appointments')}</span>
            </div>
          </div>
        </Card>

        {}
        {demoMode && (
          <Card className="relative p-10 text-center hover:shadow-xl transition-all cursor-pointer border-2 hover:border-pink-200 transform hover:scale-105"
                onClick={() => handleUserTypeSelect('pregnant')}>
            <div className="absolute top-3 right-3 bg-green-100 text-green-800 text-xs px-3 py-1 rounded-full">
              ✨ {t('demoReady')}
            </div>
            <div className="w-32 h-32 mx-auto mb-8 flex items-center justify-center">
              <div className="text-8xl">🤰</div>
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-6">
              {t('pregnancy') || 'Pregnancy'}
            </h3>
            <p className="text-gray-600 mb-8">
              {t('specializedPregnancyCare') || 'Specialized pregnancy care with diet plans, doctor appointments, and exercise reminders'}
            </p>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center justify-center space-x-2 p-3 bg-pink-50 rounded-lg">
                <span>👶</span>
                <span className="text-sm">{t('prenatalCare') || 'Prenatal Care'}</span>
              </div>
              <div className="flex items-center justify-center space-x-2 p-3 bg-pink-50 rounded-lg">
                <span>🥗</span>
                <span className="text-sm">{t('dietPlans') || 'Diet Plans'}</span>
              </div>
              <div className="flex items-center justify-center space-x-2 p-3 bg-pink-50 rounded-lg">
                <span>🤸‍♀️</span>
                <span className="text-sm">{t('exercise') || 'Exercise'}</span>
              </div>
              <div className="flex items-center justify-center space-x-2 p-3 bg-pink-50 rounded-lg">
                <span>📅</span>
                <span className="text-sm">{t('checkups') || 'Checkups'}</span>
              </div>
            </div>
          </Card>
        )}
      </div>

      {}
      <div className="text-center mt-20 text-gray-500">
        <p className="flex items-center justify-center space-x-2 mb-6">
          <span>🏥</span>
          <span>{t('poweredBy')}</span>
        </p>
        
        {}
        {autoSetupStatus.completed && autoSetupStatus.result && autoSetupStatus.result.demoUsersCreated && (
          <div className="max-w-md mx-auto bg-green-50 border-green-200 border rounded-lg p-4">
            <div className="flex items-center justify-center mb-2">
              <span className="text-green-600 mr-2">🎉</span>
              <span className="font-medium text-green-800">{t('autoSetupComplete')}</span>
            </div>
            <p className="text-sm text-green-700">
              {t('demoAccountsCreated')}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <LanguageProvider>
        <OfflineProvider>
          <DemoProvider>
            <AuthProvider>
              <SafeSpeechProvider>
                <SpeechRecognitionProvider>
                  <ErrorBoundary>
                    <div className="min-h-screen">
                      <AppContent />
                      <Toaster position="top-center" />
                    </div>
                  </ErrorBoundary>
                </SpeechRecognitionProvider>
              </SafeSpeechProvider>
            </AuthProvider>
          </DemoProvider>
        </OfflineProvider>
      </LanguageProvider>
    </ErrorBoundary>
  );
}