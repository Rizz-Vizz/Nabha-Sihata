import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Avatar } from './ui/avatar';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { ScrollArea } from './ui/scroll-area';
import { useLanguage } from './language-context';
import { 
  ArrowLeft, 
  Users, 
  User, 
  Heart, 
  Calendar, 
  FileText,
  Phone,
  Mail,
  MapPin,
  Activity,
  Pill,
  AlertCircle
} from 'lucide-react';


interface FamilyMember {
  id: string;
  name: string;
  relation: string;
  age: number;
  gender: 'male' | 'female' | 'other';
  avatar?: string;
  phone?: string;
  email?: string;
  healthCardId?: string;
  bloodGroup?: string;
  allergies?: string[];
  currentMedications?: string[];
  medicalHistory?: string[];
  emergencyContact?: string;
  lastCheckup?: string;
  nextAppointment?: string;
  chronicConditions?: string[];
  recentReports?: {
    date: string;
    type: string;
    result: string;
    status: 'normal' | 'abnormal' | 'follow-up';
  }[];
}


const mockFamilyMembers: FamilyMember[] = [
  {
    id: '1',
    name: 'Gurpreet Singh',
    relation: 'Father',
    age: 52,
    gender: 'male',
    avatar: '👨‍🦳',
    phone: '+91-9876543210',
    email: 'gurpreet@family.com',
    healthCardId: 'NH-FAM-001',
    bloodGroup: 'B+',
    allergies: ['Penicillin', 'Dust'],
    currentMedications: ['Metformin 500mg - Twice daily', 'Lisinopril 10mg - Once daily'],
    medicalHistory: ['Type 2 Diabetes (2018)', 'Hypertension (2020)', 'Knee Surgery (2019)'],
    emergencyContact: '+91-9876543211',
    lastCheckup: '2024-01-15',
    nextAppointment: '2024-02-20',
    chronicConditions: ['Type 2 Diabetes', 'Hypertension'],
    recentReports: [
      { date: '2024-01-15', type: 'Blood Sugar', result: '135 mg/dL', status: 'normal' },
      { date: '2024-01-15', type: 'Blood Pressure', result: '140/85 mmHg', status: 'follow-up' },
      { date: '2024-01-10', type: 'HbA1c', result: '7.2%', status: 'follow-up' }
    ]
  },
  {
    id: '2',
    name: 'Manjeet Kaur',
    relation: 'Mother',
    age: 48,
    gender: 'female',
    avatar: '👩',
    phone: '+91-9876543212',
    email: 'manjeet@family.com',
    healthCardId: 'NH-FAM-002',
    bloodGroup: 'A+',
    allergies: ['Shellfish'],
    currentMedications: ['Calcium + Vitamin D - Once daily', 'Iron supplement - Twice daily'],
    medicalHistory: ['Anemia (2019)', 'Vitamin D Deficiency (2020)'],
    emergencyContact: '+91-9876543210',
    lastCheckup: '2024-01-20',
    nextAppointment: '2024-03-01',
    chronicConditions: ['Mild Anemia'],
    recentReports: [
      { date: '2024-01-20', type: 'Hemoglobin', result: '11.5 g/dL', status: 'normal' },
      { date: '2024-01-20', type: 'Vitamin D', result: '32 ng/mL', status: 'normal' },
      { date: '2024-01-15', type: 'Iron Studies', result: 'Within normal limits', status: 'normal' }
    ]
  },
  {
    id: '3',
    name: 'Simran Kaur',
    relation: 'Sister',
    age: 22,
    gender: 'female',
    avatar: '👧',
    phone: '+91-9876543213',
    email: 'simran@family.com',
    healthCardId: 'NH-FAM-003',
    bloodGroup: 'O+',
    allergies: ['Pollen'],
    currentMedications: ['Multivitamin - Once daily'],
    medicalHistory: ['Seasonal Allergies (ongoing)', 'Wisdom tooth extraction (2023)'],
    emergencyContact: '+91-9876543210',
    lastCheckup: '2024-01-05',
    nextAppointment: '2024-04-10',
    chronicConditions: ['Seasonal Allergies'],
    recentReports: [
      { date: '2024-01-05', type: 'General Health', result: 'All parameters normal', status: 'normal' },
      { date: '2024-01-05', type: 'Vision Test', result: '20/20', status: 'normal' }
    ]
  },
  {
    id: '4',
    name: 'Arjun Singh',
    relation: 'Brother',
    age: 16,
    gender: 'male',
    avatar: '👦',
    phone: '+91-9876543214',
    healthCardId: 'NH-FAM-004',
    bloodGroup: 'AB+',
    allergies: ['None known'],
    currentMedications: ['None'],
    medicalHistory: ['Appendectomy (2022)', 'Broken arm (2021)'],
    emergencyContact: '+91-9876543210',
    lastCheckup: '2024-01-12',
    nextAppointment: '2024-06-15',
    chronicConditions: ['None'],
    recentReports: [
      { date: '2024-01-12', type: 'Growth Assessment', result: 'Normal development', status: 'normal' },
      { date: '2024-01-12', type: 'Vaccination Status', result: 'Up to date', status: 'normal' }
    ]
  }
];

interface FamilyCardProps {
  onBack: () => void;
}

export function FamilyCard({ onBack }: FamilyCardProps) {
  const [selectedMember, setSelectedMember] = useState<FamilyMember | null>(null);
  const [showMemberDetails, setShowMemberDetails] = useState(false);
  const { t, language } = useLanguage();

  const handleMemberSelect = (member: FamilyMember) => {
    setSelectedMember(member);
    setShowMemberDetails(true);
  };

  const handleCloseDetails = () => {
    setShowMemberDetails(false);
    setSelectedMember(null);
  };

  const getRelationIcon = (relation: string) => {
    switch (relation.toLowerCase()) {
      case 'father': return '👨‍🦳';
      case 'mother': return '👩';
      case 'sister': return '👧';
      case 'brother': return '👦';
      case 'spouse': return '💑';
      case 'child': return '👶';
      default: return '👤';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'normal': return 'bg-green-100 text-green-800';
      case 'abnormal': return 'bg-red-100 text-red-800';
      case 'follow-up': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {}
      <div className="bg-white shadow-sm p-4">
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          <div className="flex items-center space-x-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={onBack}
              className="flex items-center space-x-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </Button>
            <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-gray-800">
                {language === 'en' ? 'Family Health' : 
                 language === 'hi' ? 'पारिवारिक स्वास्थ्य' : 
                 'ਪਰਿਵਾਰਿਕ ਸਿਹਤ'}
              </h1>
              <p className="text-sm text-gray-600">
                {language === 'en' ? 'Manage your family members\' health' : 
                 language === 'hi' ? 'अपने परिवार के सदस्यों का स्वास्थ्य प्रबंधित करें' : 
                 'ਆਪਣੇ ਪਰਿਵਾਰ ਦੇ ਮੈਂਬਰਾਂ ਦੀ ਸਿਹਤ ਦਾ ਪ੍ਰਬੰਧਨ ਕਰੋ'}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 max-w-4xl mx-auto">
        {}
        <Card className="p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-800 flex items-center">
              <Users className="w-5 h-5 mr-2 text-purple-500" />
              {language === 'en' ? 'Family Members' : 
               language === 'hi' ? 'पारिवारिक सदस्य' : 
               'ਪਰਿਵਾਰਿਕ ਮੈਂਬਰ'}
            </h2>
            <Badge variant="outline" className="bg-purple-50 text-purple-700">
              {mockFamilyMembers.length} {language === 'en' ? 'Members' : 
                                         language === 'hi' ? 'सदस्य' : 
                                         'ਮੈਂਬਰ'}
            </Badge>
          </div>

          {}
          <div className="space-y-3">
            {mockFamilyMembers.map((member) => (
              <div
                key={member.id}
                onClick={() => handleMemberSelect(member)}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center space-x-4">
                  {}
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center text-xl">
                    {member.avatar || getRelationIcon(member.relation)}
                  </div>
                  
                  {}
                  <div>
                    <h3 className="font-semibold text-gray-800">{member.name}</h3>
                    <div className="flex items-center space-x-3 text-sm text-gray-600">
                      <span>{member.relation}</span>
                      <span>•</span>
                      <span>{member.age} years</span>
                      {member.bloodGroup && (
                        <>
                          <span>•</span>
                          <span className="font-medium text-red-600">{member.bloodGroup}</span>
                        </>
                      )}
                    </div>
                    {member.chronicConditions && member.chronicConditions.length > 0 && (
                      <div className="flex items-center space-x-1 mt-1">
                        <AlertCircle className="w-3 h-3 text-yellow-500" />
                        <span className="text-xs text-yellow-700">
                          {member.chronicConditions.join(', ')}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {}
                <div className="flex items-center space-x-2">
                  {member.nextAppointment && (
                    <Badge variant="outline" className="bg-blue-50 text-blue-700 text-xs">
                      {language === 'en' ? 'Next Visit' : 
                       language === 'hi' ? 'अगली मुलाकात' : 
                       'ਅਗਲੀ ਮੁਲਾਕਾਤ'}
                    </Badge>
                  )}
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="p-4 text-center">
            <div className="w-12 h-12 mx-auto mb-2 bg-green-100 rounded-full flex items-center justify-center">
              <Heart className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="font-semibold text-gray-800">
              {mockFamilyMembers.filter(m => !m.chronicConditions || m.chronicConditions.length === 0 || m.chronicConditions[0] === 'None').length}
            </h3>
            <p className="text-sm text-gray-600">
              {language === 'en' ? 'Healthy' : 
               language === 'hi' ? 'स्वस्थ' : 
               'ਸਿਹਤਮੰਦ'}
            </p>
          </Card>

          <Card className="p-4 text-center">
            <div className="w-12 h-12 mx-auto mb-2 bg-yellow-100 rounded-full flex items-center justify-center">
              <Activity className="w-6 h-6 text-yellow-600" />
            </div>
            <h3 className="font-semibold text-gray-800">
              {mockFamilyMembers.filter(m => m.chronicConditions && m.chronicConditions.length > 0 && m.chronicConditions[0] !== 'None').length}
            </h3>
            <p className="text-sm text-gray-600">
              {language === 'en' ? 'Monitoring' : 
               language === 'hi' ? 'निगरानी में' : 
               'ਨਿਗਰਾਨੀ ਵਿੱਚ'}
            </p>
          </Card>

          <Card className="p-4 text-center">
            <div className="w-12 h-12 mx-auto mb-2 bg-blue-100 rounded-full flex items-center justify-center">
              <Calendar className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="font-semibold text-gray-800">
              {mockFamilyMembers.filter(m => m.nextAppointment).length}
            </h3>
            <p className="text-sm text-gray-600">
              {language === 'en' ? 'Upcoming' : 
               language === 'hi' ? 'आगामी' : 
               'ਆਉਣ ਵਾਲੇ'}
            </p>
          </Card>

          <Card className="p-4 text-center">
            <div className="w-12 h-12 mx-auto mb-2 bg-purple-100 rounded-full flex items-center justify-center">
              <Pill className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="font-semibold text-gray-800">
              {mockFamilyMembers.reduce((total, m) => total + (m.currentMedications?.length || 0), 0)}
            </h3>
            <p className="text-sm text-gray-600">
              {language === 'en' ? 'Medications' : 
               language === 'hi' ? 'दवाइयां' : 
               'ਦਵਾਈਆਂ'}
            </p>
          </Card>
        </div>
      </div>

      {}
      <Dialog open={showMemberDetails} onOpenChange={handleCloseDetails}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          {selectedMember && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center text-xl">
                    {selectedMember.avatar || getRelationIcon(selectedMember.relation)}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">{selectedMember.name}</h2>
                    <p className="text-sm text-gray-600 font-normal">
                      {selectedMember.relation} • {selectedMember.age} years • {selectedMember.gender}
                    </p>
                  </div>
                </DialogTitle>
              </DialogHeader>

              <ScrollArea className="max-h-96">
                <div className="space-y-6">
                  {}
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-3 flex items-center">
                      <User className="w-4 h-4 mr-2" />
                      Basic Information
                    </h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Health Card ID:</span>
                        <p className="font-medium">{selectedMember.healthCardId}</p>
                      </div>
                      <div>
                        <span className="text-gray-600">Blood Group:</span>
                        <p className="font-medium text-red-600">{selectedMember.bloodGroup}</p>
                      </div>
                      <div>
                        <span className="text-gray-600">Phone:</span>
                        <p className="font-medium">{selectedMember.phone}</p>
                      </div>
                      <div>
                        <span className="text-gray-600">Emergency Contact:</span>
                        <p className="font-medium">{selectedMember.emergencyContact}</p>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {}
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-3 flex items-center">
                      <FileText className="w-4 h-4 mr-2" />
                      Medical History
                    </h3>
                    <div className="space-y-2">
                      {selectedMember.medicalHistory?.map((condition, index) => (
                        <div key={index} className="p-2 bg-gray-50 rounded text-sm">
                          {condition}
                        </div>
                      ))}
                    </div>
                  </div>

                  <Separator />

                  {}
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-3 flex items-center">
                      <Pill className="w-4 h-4 mr-2" />
                      Current Medications
                    </h3>
                    <div className="space-y-2">
                      {selectedMember.currentMedications?.map((medication, index) => (
                        <div key={index} className="p-2 bg-blue-50 rounded text-sm">
                          {medication}
                        </div>
                      ))}
                    </div>
                  </div>

                  <Separator />

                  {}
                  {selectedMember.allergies && selectedMember.allergies.length > 0 && (
                    <>
                      <div>
                        <h3 className="font-semibold text-gray-800 mb-3 flex items-center">
                          <AlertCircle className="w-4 h-4 mr-2 text-red-500" />
                          Allergies
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {selectedMember.allergies.map((allergy, index) => (
                            <Badge key={index} variant="destructive" className="text-xs">
                              {allergy}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <Separator />
                    </>
                  )}

                  {}
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-3 flex items-center">
                      <Activity className="w-4 h-4 mr-2" />
                      Recent Reports
                    </h3>
                    <div className="space-y-3">
                      {selectedMember.recentReports?.map((report, index) => (
                        <div key={index} className="border rounded-lg p-3">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium text-gray-800">{report.type}</h4>
                            <Badge className={`text-xs ${getStatusColor(report.status)}`}>
                              {report.status}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600 mb-1">{report.result}</p>
                          <p className="text-xs text-gray-500">{report.date}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Separator />

                  {}
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-3 flex items-center">
                      <Calendar className="w-4 h-4 mr-2" />
                      Appointments
                    </h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Last Checkup:</span>
                        <p className="font-medium">{selectedMember.lastCheckup}</p>
                      </div>
                      <div>
                        <span className="text-gray-600">Next Appointment:</span>
                        <p className="font-medium text-blue-600">{selectedMember.nextAppointment}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </ScrollArea>

              {}
              <div className="flex justify-between pt-4 border-t">
                <Button variant="outline" onClick={handleCloseDetails}>
                  Close
                </Button>
                <div className="space-x-2">
                  <Button variant="outline" size="sm">
                    <Phone className="w-4 h-4 mr-2" />
                    Call
                  </Button>
                  <Button size="sm">
                    <Calendar className="w-4 h-4 mr-2" />
                    Book Appointment
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}