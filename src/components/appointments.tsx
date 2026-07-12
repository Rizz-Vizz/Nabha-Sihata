import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { useLanguage } from './language-context';
import { useAuth } from './auth-context';
import { useDemo } from './demo-context';
import { appointmentService } from '../utils/supabase/client';
import { HealthTip } from './health-tip';
import { 
  ArrowLeft, 
  Calendar, 
  Clock, 
  Video, 
  Phone, 
  User,
  Plus,
  Loader,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface AppointmentsProps {
  onBack: () => void;
}

export const Appointments: React.FC<AppointmentsProps> = ({ onBack }) => {
  const { t } = useLanguage();
  const { userProfile } = useAuth();
  const { isDemoMode } = useDemo();
  const [view, setView] = useState<'list' | 'book'>('list');
  const [appointments, setAppointments] = useState<any[]>([]);
  const [doctors, setDoctors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);
  
  const [bookingForm, setBookingForm] = useState({
    doctor_id: '',
    date: '',
    time: '',
    symptoms: '',
    urgency: 'normal'
  });

  useEffect(() => {
    loadAppointments();
    loadDoctors();
  }, []);

  const loadAppointments = async () => {
    try {
      
      if (isDemoMode) {
        const sampleAppointments = [
          {
            id: '1',
            doctor_name: 'Dr. Simran Kaur',
            date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            time: '10:00',
            status: 'scheduled',
            urgency: 'normal',
            symptoms: 'Regular checkup',
            consultation_type: 'teleconsultation'
          },
          {
            id: '2',
            doctor_name: 'Dr. Sukhjeet Singh',
            date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            time: '14:30',
            status: 'completed',
            urgency: 'medium',
            symptoms: 'Fever and cold symptoms',
            consultation_type: 'teleconsultation'
          }
        ];
        setAppointments(sampleAppointments);
        return;
      }

      const response = await appointmentService.getAppointments();
      setAppointments(response.appointments || []);
    } catch (error: any) {
      console.error('Error loading appointments:', error);
      
      if (error.message?.includes('Unauthorized') || error.message?.includes('403') || error.message?.includes('401')) {
        console.log('API authentication issue - showing empty appointments list');
        setAppointments([]);
      } else {
        toast.error('Failed to load appointments');
      }
    } finally {
      setLoading(false);
    }
  };

  const loadDoctors = async () => {
    try {
      
      if (isDemoMode) {
        const sampleDoctors = [
          {
            id: '1',
            name: 'Dr. Simran Kaur',
            specialty: 'General Medicine',
            hospital: 'AIIMS New Delhi'
          },
          {
            id: '2',
            name: 'Dr. Sukhjeet Singh',
            specialty: 'Pediatrics',
            hospital: 'PGIMER Chandigarh'
          },
          {
            id: '3',
            name: 'Dr. Arshpreet Kaur',
            specialty: 'Gynecology & Obstetrics',
            hospital: 'CMC Vellore'
          },
          {
            id: '4',
            name: 'Dr. Rajveer Singh',
            specialty: 'Orthopedics',
            hospital: 'KMC Manipal'
          },
          {
            id: '5',
            name: 'Dr. Amarjeet Singh',
            specialty: 'Cardiology',
            hospital: 'AIIMS New Delhi'
          },
          {
            id: '6',
            name: 'Dr. Anmolpreet Kaur',
            specialty: 'Dermatology',
            hospital: 'JIPMER Puducherry'
          }
        ];
        setDoctors(sampleDoctors);
        return;
      }

      const response = await appointmentService.getDoctors();
      setDoctors(response.doctors || []);
    } catch (error: any) {
      console.error('Error loading doctors:', error);
      
      if (error.message?.includes('Unauthorized') || error.message?.includes('403') || error.message?.includes('401')) {
        console.log('API authentication issue - using sample doctors list');
        setDoctors([]);
      }
    }
  };

  const handleBookAppointment = async (e: React.FormEvent) => {
    e.preventDefault();
    setBookingLoading(true);
    
    try {
      
      if (isDemoMode) {
        
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        const selectedDoctor = doctors.find(d => d.id === bookingForm.doctor_id);
        const newAppointment = {
          id: Date.now().toString(),
          doctor_name: selectedDoctor?.name || 'Demo Doctor',
          date: bookingForm.date,
          time: bookingForm.time,
          status: 'scheduled',
          urgency: bookingForm.urgency,
          symptoms: bookingForm.symptoms,
          consultation_type: 'teleconsultation'
        };
        
        setAppointments(prev => [newAppointment, ...prev]);
        toast.success('Demo appointment booked successfully!');
      } else {
        await appointmentService.bookAppointment(bookingForm);
        toast.success('Appointment booked successfully!');
        await loadAppointments();
      }
      
      setView('list');
      setBookingForm({
        doctor_id: '',
        date: '',
        time: '',
        symptoms: '',
        urgency: 'normal'
      });
    } catch (error: any) {
      if (error.message?.includes('Unauthorized') || error.message?.includes('403') || error.message?.includes('401')) {
        toast.error('Please sign in to book appointments');
      } else {
        toast.error(error.message || 'Failed to book appointment');
      }
    } finally {
      setBookingLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'text-blue-600 bg-blue-50';
      case 'completed': return 'text-green-600 bg-green-50';
      case 'cancelled': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'high': return 'text-red-600 bg-red-50';
      case 'medium': return 'text-orange-600 bg-orange-50';
      default: return 'text-green-600 bg-green-50';
    }
  };

  if (view === 'book') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white p-4">
        <div className="max-w-2xl mx-auto">
          {}
          <div className="flex items-center mb-6">
            <Button
              variant="ghost"
              onClick={() => setView('list')}
              className="mr-4 p-2"
            >
              <ArrowLeft className="w-6 h-6" />
            </Button>
            <h1 className="text-2xl font-bold text-gray-800">
              {t('bookAppointment') || 'Book Appointment'}
            </h1>
          </div>

          {}
          <Card className="p-6">
            <form onSubmit={handleBookAppointment} className="space-y-4">
              {}
              <div>
                <Label htmlFor="doctor">{t('selectDoctor') || 'Select Doctor'}</Label>
                <select
                  id="doctor"
                  className="w-full p-2 border border-gray-300 rounded-md"
                  value={bookingForm.doctor_id}
                  onChange={(e) => setBookingForm(prev => ({ ...prev, doctor_id: e.target.value }))}
                  required
                >
                  <option value="">{t('chooseDoctor') || 'Choose a doctor...'}</option>
                  {doctors.map((doctor) => (
                    <option key={doctor.id} value={doctor.id}>
                      {doctor.name} - {doctor.specialty}
                    </option>
                  ))}
                </select>
              </div>

              {/* Date */}
              <div>
                <Label htmlFor="date">{t('date') || 'Date'}</Label>
                <Input
                  id="date"
                  type="date"
                  value={bookingForm.date}
                  onChange={(e) => setBookingForm(prev => ({ ...prev, date: e.target.value }))}
                  min={new Date().toISOString().split('T')[0]}
                  required
                />
              </div>

              {}
              <div>
                <Label htmlFor="time">{t('time') || 'Time'}</Label>
                <Input
                  id="time"
                  type="time"
                  value={bookingForm.time}
                  onChange={(e) => setBookingForm(prev => ({ ...prev, time: e.target.value }))}
                  required
                />
              </div>

              {}
              <div>
                <Label htmlFor="symptoms">{t('symptoms') || 'Symptoms (Optional)'}</Label>
                <textarea
                  id="symptoms"
                  className="w-full p-2 border border-gray-300 rounded-md"
                  rows={3}
                  value={bookingForm.symptoms}
                  onChange={(e) => setBookingForm(prev => ({ ...prev, symptoms: e.target.value }))}
                  placeholder={t('describeSymptoms') || 'Describe your symptoms...'}
                />
              </div>

              {}
              <div>
                <Label>{t('urgency') || 'Urgency Level'}</Label>
                <div className="flex gap-4 mt-2">
                  {['normal', 'medium', 'high'].map((level) => (
                    <label key={level} className="flex items-center space-x-2">
                      <input
                        type="radio"
                        name="urgency"
                        value={level}
                        checked={bookingForm.urgency === level}
                        onChange={(e) => setBookingForm(prev => ({ ...prev, urgency: e.target.value }))}
                      />
                      <span className="capitalize">{level}</span>
                    </label>
                  ))}
                </div>
              </div>

              {}
              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700"
                disabled={bookingLoading}
              >
                {bookingLoading ? (
                  <div className="flex items-center">
                    <Loader className="animate-spin w-4 h-4 mr-2" />
                    {t('booking') || 'Booking...'}
                  </div>
                ) : (
                  t('bookAppointment') || 'Book Appointment'
                )}
              </Button>
            </form>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white p-4">
      <div className="max-w-4xl mx-auto">
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
            <h1 className="text-2xl font-bold text-gray-800">
              {t('appointments') || 'My Appointments'}
            </h1>
          </div>
          
          <Button
            onClick={() => setView('book')}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            {t('bookNew') || 'Book New'}
          </Button>
        </div>

        {}
        {loading ? (
          <div className="text-center py-12">
            <Loader className="animate-spin w-8 h-8 mx-auto mb-4 text-blue-600" />
            <p className="text-gray-600">{t('loading') || 'Loading appointments...'}</p>
          </div>
        ) : (
          <>
            {}
            {appointments.length === 0 ? (
              <Card className="p-8 text-center">
                <Calendar className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                <h3 className="text-lg font-semibold text-gray-600 mb-2">
                  {t('noAppointments') || 'No appointments found'}
                </h3>
                <p className="text-gray-500 mb-4">
                  {t('noAppointmentsDesc') || 'You haven\'t booked any appointments yet.'}
                </p>
                <Button
                  onClick={() => setView('book')}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  {t('bookFirst') || 'Book Your First Appointment'}
                </Button>
              </Card>
            ) : (
              <div className="space-y-4">
                {appointments.map((appointment) => (
                  <Card key={appointment.id} className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center mb-2">
                          <h3 className="font-semibold text-gray-800 mr-3">
                            Appointment with Doctor
                          </h3>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(appointment.status)}`}>
                            {appointment.status}
                          </span>
                          <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${getUrgencyColor(appointment.urgency)}`}>
                            {appointment.urgency}
                          </span>
                        </div>
                        
                        <div className="flex items-center text-gray-600 mb-2">
                          <Calendar className="w-4 h-4 mr-2" />
                          <span className="mr-4">
                            {new Date(appointment.date).toLocaleDateString()}
                          </span>
                          <Clock className="w-4 h-4 mr-2" />
                          <span>{appointment.time}</span>
                        </div>

                        {appointment.symptoms && (
                          <div className="text-sm text-gray-600 mb-2">
                            <strong>Symptoms:</strong> {appointment.symptoms}
                          </div>
                        )}

                        <div className="flex items-center text-sm text-gray-500">
                          {appointment.consultation_type === 'teleconsultation' ? (
                            <Video className="w-4 h-4 mr-1" />
                          ) : (
                            <Phone className="w-4 h-4 mr-1" />
                          )}
                          <span className="capitalize">{appointment.consultation_type}</span>
                        </div>
                      </div>

                      <div className="ml-4">
                        {appointment.status === 'scheduled' && (
                          <Button size="sm" className="bg-green-600 hover:bg-green-700">
                            <Video className="w-4 h-4 mr-2" />
                            {t('join') || 'Join'}
                          </Button>
                        )}
                        {appointment.status === 'completed' && (
                          <div className="flex items-center text-green-600">
                            <CheckCircle className="w-4 h-4 mr-1" />
                            <span className="text-sm">Completed</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};