import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { useLanguage } from './language-context';
import { useAuth } from './auth-context';
import { LanguageSwitcher } from './language-switcher';
import { ArrowLeft, Eye, EyeOff, User, Stethoscope } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import patientIcon from '@/assets/01ec76020cd14434a23c1ff4857f1dbfbcc6ad1a.png';
import doctorIcon from '@/assets/50846eb64745974d321291b8a21b1450610141c3.png';

interface AuthScreenProps {
  userType: 'patient' | 'doctor';
  onBack: () => void;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({ userType, onBack }) => {
  const { t } = useLanguage();
  const { signIn, signUp, loading } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    phone: '',
    village: '',
    age: '',
    specialty: '',
    license_number: '',
    hospital: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.email || !formData.password) {
      toast.error('Email and password are required');
      return;
    }

    if (!isLogin && !formData.name) {
      toast.error('Name is required for registration');
      return;
    }

    if (!isLogin && userType === 'doctor' && (!formData.specialty || !formData.license_number)) {
      toast.error('Specialty and license number are required for doctors');
      return;
    }
    
    try {
      if (isLogin) {
        console.log('Attempting login for:', formData.email);
        await signIn(formData.email, formData.password);
        toast.success(t('loginSuccessful') || 'Login successful!');
      } else {
        console.log('Attempting registration for:', formData.email, 'as', userType);
        const userData = {
          email: formData.email.trim(),
          password: formData.password,
          name: formData.name.trim(),
          phone: formData.phone?.trim() || '',
          ...(userType === 'patient' && {
            village: formData.village?.trim() || '',
            age: formData.age ? parseInt(formData.age) : undefined
          }),
          ...(userType === 'doctor' && {
            specialty: formData.specialty.trim(),
            license_number: formData.license_number.trim(),
            hospital: formData.hospital?.trim() || ''
          })
        };
        
        await signUp(userData, userType);
        toast.success(t('registrationSuccessful') || 'Registration and login successful!');
      }
    } catch (error: any) {
      console.error('Auth error in form submit:', error);
      
      
      let errorMessage = 'Authentication failed';
      let shouldSwitchToLogin = false;
      
      if (error.message.includes('Invalid login credentials')) {
        if (isLogin && formData.email.includes('demo.')) {
          errorMessage = 'Demo account not found. Please go back to the home screen and click "Setup Demo Users" first to create the demo accounts, then try signing in again.';
        } else if (isLogin) {
          errorMessage = 'Invalid email or password. Please check your credentials and try again.';
        } else {
          errorMessage = 'Registration failed. This email might already be registered - try signing in instead.';
          shouldSwitchToLogin = true;
        }
      } else if (error.message.includes('Email not confirmed')) {
        if (formData.email.includes('demo.')) {
          errorMessage = 'Demo account email not confirmed. Please create demo users properly using the "Setup Demo Users" button on the home screen.';
        } else {
          errorMessage = 'Please confirm your email address before signing in.';
        }
      } else if (error.message.includes('User already registered') || error.message.includes('already been registered')) {
        if (!isLogin) {
          errorMessage = 'This account already exists! Switching to sign in mode...';
          shouldSwitchToLogin = true;
        } else {
          errorMessage = 'Account exists but credentials are incorrect. Please check your password.';
        }
      } else if (error.message.includes('Registration failed')) {
        if (error.message.includes('already been registered') || error.message.includes('already registered')) {
          errorMessage = 'This account already exists! Please sign in instead.';
          shouldSwitchToLogin = true;
        } else if (error.message.includes('Database not set up') || error.message.includes('schema')) {
          errorMessage = 'Database not set up yet. Please go back and run the database setup first, then try again.';
        } else {
          errorMessage = 'Registration failed. There may have been a server error. Please try again.';
        }
      } else if (error.message.includes('Database not set up') || 
                 error.message.includes('schema') ||
                 error.message.includes('Could not find the table') ||
                 error.message.includes('relation') ||
                 error.message.includes('does not exist')) {
        errorMessage = 'Database schema not ready. Please go back to home and setup the database first.';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      toast.error(errorMessage);
      
      
      if (shouldSwitchToLogin && !isLogin) {
        setTimeout(() => {
          setIsLogin(true);
          toast.info('Switched to sign in mode. Please enter your password to continue.');
        }, 2000);
      }
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 p-4">
      <div className="max-w-md mx-auto">
        {}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <Button
              variant="ghost"
              onClick={onBack}
              className="mr-4 p-2"
            >
              <ArrowLeft className="w-6 h-6" />
            </Button>
            
            <div className="flex items-center">
              <div className="w-12 h-12 mr-3">
                <img 
                  src={userType === 'patient' ? patientIcon : doctorIcon}
                  alt={userType}
                  className="w-12 h-12 object-contain"
                />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-800">
                  {userType === 'patient' ? t('patient') : t('doctor')}
                </h1>
                <p className="text-sm text-gray-600">
                  {isLogin ? t('signIn') || 'Sign In' : t('signUp') || 'Sign Up'}
                </p>
              </div>
            </div>
          </div>
          
          {}
          <LanguageSwitcher />
        </div>

        {}
        <Card className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {}
            <div>
              <Label htmlFor="email">{t('email') || 'Email'}</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                required
                placeholder="your@email.com"
              />
            </div>

            {}
            <div>
              <Label htmlFor="password">{t('password') || 'Password'}</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  required
                  placeholder="••••••••"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </Button>
              </div>
            </div>

            {}
            {!isLogin && (
              <>
                {}
                <div>
                  <Label htmlFor="name">{t('name') || 'Full Name'}</Label>
                  <Input
                    id="name"
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    required
                    placeholder={userType === 'patient' ? 'Your Name' : 'Dr. Your Name'}
                  />
                </div>

                {}
                <div>
                  <Label htmlFor="phone">{t('phone') || 'Phone Number'}</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    placeholder="+91 9876543210"
                  />
                </div>

                {}
                {userType === 'patient' && (
                  <>
                    <div>
                      <Label htmlFor="village">{t('village') || 'Village'}</Label>
                      <Input
                        id="village"
                        type="text"
                        value={formData.village}
                        onChange={(e) => handleInputChange('village', e.target.value)}
                        placeholder="Your Village"
                      />
                    </div>
                    <div>
                      <Label htmlFor="age">{t('age') || 'Age'}</Label>
                      <Input
                        id="age"
                        type="number"
                        value={formData.age}
                        onChange={(e) => handleInputChange('age', e.target.value)}
                        placeholder="25"
                        min="1"
                        max="120"
                      />
                    </div>
                  </>
                )}

                {}
                {userType === 'doctor' && (
                  <>
                    <div>
                      <Label htmlFor="specialty">{t('specialty') || 'Specialty'}</Label>
                      <Input
                        id="specialty"
                        type="text"
                        value={formData.specialty}
                        onChange={(e) => handleInputChange('specialty', e.target.value)}
                        required
                        placeholder="General Medicine, Cardiology, etc."
                      />
                    </div>
                    <div>
                      <Label htmlFor="license_number">{t('licenseNumber') || 'License Number'}</Label>
                      <Input
                        id="license_number"
                        type="text"
                        value={formData.license_number}
                        onChange={(e) => handleInputChange('license_number', e.target.value)}
                        required
                        placeholder="Medical License Number"
                      />
                    </div>
                    <div>
                      <Label htmlFor="hospital">{t('hospital') || 'Hospital/Clinic'}</Label>
                      <Input
                        id="hospital"
                        type="text"
                        value={formData.hospital}
                        onChange={(e) => handleInputChange('hospital', e.target.value)}
                        placeholder="Hospital or Clinic Name"
                      />
                    </div>
                  </>
                )}
              </>
            )}

            {}
            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700"
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  {isLogin ? (t('signingIn') || 'Signing In...') : (t('signingUp') || 'Signing Up...')}
                </div>
              ) : (
                isLogin ? (t('signIn') || 'Sign In') : (t('signUp') || 'Sign Up')
              )}
            </Button>

            {}
            <div className="text-center space-y-2">
              <Button
                type="button"
                variant="ghost"
                onClick={() => {
                  setIsLogin(!isLogin);
                  setFormData({
                    email: '',
                    password: '',
                    name: '',
                    phone: '',
                    village: '',
                    age: '',
                    specialty: '',
                    license_number: '',
                    hospital: ''
                  });
                }}
                className="text-blue-600 hover:text-blue-700"
              >
                {isLogin 
                  ? (t('needAccount') || "Don't have an account? Sign Up") 
                  : (t('haveAccount') || 'Already have an account? Sign In')
                }
              </Button>
              
              {}
              <div className="pt-2 space-y-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    if (userType === 'patient') {
                      setFormData({
                        email: 'demo.patient@nabhasihata.com',
                        password: 'demo123',
                        name: 'Demo Patient',
                        phone: '+91 9876543210',
                        village: 'Nabha',
                        age: '35',
                        specialty: '',
                        license_number: '',
                        hospital: ''
                      });
                    } else {
                      setFormData({
                        email: 'demo.doctor@nabhasihata.com',
                        password: 'demo123',
                        name: 'Dr. Demo Singh',
                        phone: '+91 9876543211',
                        village: '',
                        age: '',
                        specialty: 'General Medicine',
                        license_number: 'DMO12345',
                        hospital: 'Civil Hospital Nabha'
                      });
                    }
                    
                    if (!isLogin) {
                      setIsLogin(true);
                      toast.info('Switched to sign in mode for demo account.');
                    }
                  }}
                  className="text-gray-600 hover:text-gray-700"
                >
                  🎮 Use Demo Account
                </Button>
                
                {(formData.email.includes('demo.') || isLogin) && (
                  <div className="text-xs text-gray-500 text-center">
                    Demo password: <code className="bg-gray-100 px-1 rounded">demo123</code>
                  </div>
                )}
              </div>
            </div>
          </form>
        </Card>

        {}
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <div className="text-sm text-blue-700 text-center">
            {formData.email.includes('demo.') ? (
              <>
                <p><strong>🎮 Demo Account:</strong> Use password <code className="bg-blue-100 px-1 rounded">demo123</code> to sign in.</p>
                {!isLogin && <p className="block mt-1">Demo accounts already exist - please sign in instead of registering.</p>}
                <div className="mt-2 text-xs">
                  <strong>Note:</strong> If sign in fails, demo users may need to be created first. 
                  Go back to home and click "Setup Demo Users".
                </div>
              </>
            ) : (
              <>
                <p>
                  {userType === 'doctor' 
                    ? (t('doctorNote') || 'Doctor accounts require verification before activation')
                    : (t('patientNote') || 'Secure and private healthcare for rural communities')
                  }
                </p>
                <div className="mt-2 text-xs text-blue-600 border-t border-blue-200 pt-2">
                  <strong>💡 Setup Required:</strong> The database must be set up before using this app. 
                  If you get database errors, go back to home and click "Setup Database Schema" first.
                </div>
                <div className="mt-2 text-xs">
                  <strong>First time?</strong> Try using the demo accounts to explore the app features first.
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};