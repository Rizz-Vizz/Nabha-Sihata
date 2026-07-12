
import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Avatar } from './ui/avatar';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { ScrollArea } from './ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { 
  ArrowLeft, 
  Search, 
  Filter, 
  Plus, 
  Calendar, 
  Phone, 
  Mail, 
  MapPin, 
  AlertCircle,
  Activity,
  FileText,
  Pill,
  Clock,
  User,
  Heart,
  Thermometer,
  Weight,
  Zap,
  TrendingUp,
  Upload,
  Download,
  Edit,
  Save,
  X
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface PatientRecord {
  id: string;
  name: string;
  age: number;
  gender: 'male' | 'female';
  phone: string;
  email: string;
  address: string;
  lastVisit: string;
  profilePhoto?: string;
  medicalHistory: MedicalRecord[];
  vitals: VitalRecord[];
  prescriptions: Prescription[];
  allergies: string[];
  chronicConditions: string[];
}

interface MedicalRecord {
  id: string;
  date: string;
  diagnosis: string;
  treatment: string;
  notes: string;
  doctorName: string;
}

interface VitalRecord {
  id: string;
  date: string;
  bloodPressure: string;
  heartRate: number;
  temperature: number;
  weight: number;
  bloodSugar?: number;
}

interface Prescription {
  id: string;
  date: string;
  medication: string;
  dosage: string;
  frequency: string;
  duration: string;
  status: 'active' | 'completed' | 'refill_needed';
}

interface PatientRecordsProps {
  onBack: () => void;
  onStartConsultation?: (patientId: string) => void;
  onWritePrescription?: (patientId: string) => void;
}

export function PatientRecords({ onBack, onStartConsultation, onWritePrescription }: PatientRecordsProps) {
  const [selectedPatient, setSelectedPatient] = useState<PatientRecord | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCondition, setFilterCondition] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editedPatient, setEditedPatient] = useState<PatientRecord | null>(null);
  const [showAddPatient, setShowAddPatient] = useState(false);
  const [newPatient, setNewPatient] = useState<Partial<PatientRecord>>({
    name: '',
    age: 0,
    gender: 'male',
    phone: '',
    email: '',
    address: '',
    allergies: [],
    chronicConditions: [],
    medicalHistory: [],
    vitals: [],
    prescriptions: []
  });

  // Mock patient data
  const [patients, setPatients] = useState<PatientRecord[]>([
    {
      id: '1',
      name: 'Rajinder Singh',
      age: 45,
      gender: 'male',
      phone: '+91 9876543210',
      email: 'rajinder@example.com',
      address: 'Village Nabha, Punjab',
      lastVisit: '2024-01-15',
      profilePhoto: '',
      allergies: ['Penicillin', 'Peanuts'],
      chronicConditions: ['Diabetes Type 2', 'Hypertension'],
      medicalHistory: [
        {
          id: '1',
          date: '2024-01-15',
          diagnosis: 'Hypertension follow-up',
          treatment: 'Medication adjustment',
          notes: 'Blood pressure stable, continue current medication',
          doctorName: 'Dr. Demo Singh'
        },
        {
          id: '2',
          date: '2023-12-10',
          diagnosis: 'Diabetes check-up',
          treatment: 'Blood sugar monitoring',
          notes: 'HbA1c levels improved, diet changes effective',
          doctorName: 'Dr. Demo Singh'
        }
      ],
      vitals: [
        {
          id: '1',
          date: '2024-01-15',
          bloodPressure: '130/85',
          heartRate: 72,
          temperature: 98.6,
          weight: 75,
          bloodSugar: 140
        },
        {
          id: '2',
          date: '2023-12-10',
          bloodPressure: '135/90',
          heartRate: 75,
          temperature: 98.4,
          weight: 76,
          bloodSugar: 155
        }
      ],
      prescriptions: [
        {
          id: '1',
          date: '2024-01-15',
          medication: 'Metformin',
          dosage: '500mg',
          frequency: 'Twice daily',
          duration: '3 months',
          status: 'active'
        },
        {
          id: '2',
          date: '2024-01-15',
          medication: 'Amlodipine',
          dosage: '5mg',
          frequency: 'Once daily',
          duration: '3 months',
          status: 'active'
        }
      ]
    },
    {
      id: '2',
      name: 'Simran Kaur',
      age: 40,
      gender: 'female',
      phone: '+91 9876543211',
      email: 'simran@example.com',
      address: 'Village Nabha, Punjab',
      lastVisit: '2024-01-12',
      profilePhoto: '',
      allergies: ['Aspirin'],
      chronicConditions: ['Pregnancy - 7 months'],
      medicalHistory: [
        {
          id: '1',
          date: '2024-01-12',
          diagnosis: 'Prenatal check-up',
          treatment: 'Routine monitoring',
          notes: 'Baby developing normally, mother healthy',
          doctorName: 'Dr. Demo Singh'
        }
      ],
      vitals: [
        {
          id: '1',
          date: '2024-01-12',
          bloodPressure: '120/80',
          heartRate: 80,
          temperature: 98.4,
          weight: 65
        }
      ],
      prescriptions: [
        {
          id: '1',
          date: '2024-01-12',
          medication: 'Folic Acid',
          dosage: '5mg',
          frequency: 'Once daily',
          duration: 'Until delivery',
          status: 'active'
        },
        {
          id: '2',
          date: '2024-01-12',
          medication: 'Iron tablets',
          dosage: '100mg',
          frequency: 'Twice daily',
          duration: 'Until delivery',
          status: 'active'
        }
      ]
    },
    {
      id: '3',
      name: 'Arjun Singh',
      age: 12,
      gender: 'male',
      phone: '+91 9876543210',
      email: 'rajinder@example.com',
      address: 'Village Nabha, Punjab',
      lastVisit: '2024-01-10',
      profilePhoto: '',
      allergies: [],
      chronicConditions: [],
      medicalHistory: [
        {
          id: '1',
          date: '2024-01-10',
          diagnosis: 'Common cold',
          treatment: 'Symptomatic treatment',
          notes: 'Mild cold symptoms, advised rest and fluids',
          doctorName: 'Dr. Demo Singh'
        }
      ],
      vitals: [
        {
          id: '1',
          date: '2024-01-10',
          bloodPressure: '100/65',
          heartRate: 85,
          temperature: 99.2,
          weight: 35
        }
      ],
      prescriptions: [
        {
          id: '1',
          date: '2024-01-10',
          medication: 'Paracetamol Syrup',
          dosage: '5ml',
          frequency: 'Every 6 hours',
          duration: '5 days',
          status: 'completed'
        }
      ]
    }
  ]);

  const filteredPatients = patients.filter(patient => 
    patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.phone.includes(searchTerm) ||
    (filterCondition && patient.chronicConditions.some(condition => 
      condition.toLowerCase().includes(filterCondition.toLowerCase())
    ))
  );

  const handleEditPatient = (patient: PatientRecord) => {
    setEditedPatient({ ...patient });
    setIsEditing(true);
  };

  const handleSaveEdit = () => {
    if (editedPatient) {
      
      const updatedPatients = patients.map(p => 
        p.id === editedPatient.id ? editedPatient : p
      );
      setPatients(updatedPatients);
      setSelectedPatient(editedPatient);
      setIsEditing(false);
      toast.success('Patient information updated successfully');
    }
  };

  const handleCancelEdit = () => {
    setEditedPatient(null);
    setIsEditing(false);
  };

  const handleAddPatient = () => {
    if (!newPatient.name || !newPatient.age || !newPatient.phone) {
      toast.error('Please fill in all required fields');
      return;
    }

    const patientToAdd: PatientRecord = {
      id: (patients.length + 1).toString(),
      name: newPatient.name!,
      age: newPatient.age!,
      gender: newPatient.gender!,
      phone: newPatient.phone!,
      email: newPatient.email || '',
      address: newPatient.address || '',
      lastVisit: new Date().toISOString().split('T')[0],
      allergies: newPatient.allergies || [],
      chronicConditions: newPatient.chronicConditions || [],
      medicalHistory: [],
      vitals: [],
      prescriptions: []
    };

    setPatients([...patients, patientToAdd]);
    setShowAddPatient(false);
    setNewPatient({
      name: '',
      age: 0,
      gender: 'male',
      phone: '',
      email: '',
      address: '',
      allergies: [],
      chronicConditions: []
    });
    toast.success('New patient added successfully! 🎉');
  };

  const VitalTrend = ({ vitals, field, unit }: { vitals: VitalRecord[], field: keyof VitalRecord, unit: string }) => {
    const values = vitals.map(v => v[field] as number).filter(v => v);
    if (values.length < 2) return <span className="text-gray-400">No trend data</span>;
    
    const latest = values[0];
    const previous = values[1];
    const isIncreasing = latest > previous;
    
    return (
      <div className="flex items-center space-x-1">
        <span>{latest}{unit}</span>
        {isIncreasing ? (
          <TrendingUp className="w-4 h-4 text-red-500" />
        ) : (
          <TrendingUp className="w-4 h-4 text-green-500 rotate-180" />
        )}
      </div>
    );
  };

  // Add New Patient Modal
  if (showAddPatient) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" onClick={() => setShowAddPatient(false)}>
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">Add New Patient</h1>
                <p className="text-gray-600">Enter patient information</p>
              </div>
            </div>
          </div>

          <Card className="p-6">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="newPatientName">Full Name *</Label>
                  <Input
                    id="newPatientName"
                    value={newPatient.name}
                    onChange={(e) => setNewPatient({
                      ...newPatient,
                      name: e.target.value
                    })}
                    placeholder="Enter full name"
                  />
                </div>
                <div>
                  <Label htmlFor="newPatientAge">Age *</Label>
                  <Input
                    id="newPatientAge"
                    type="number"
                    value={newPatient.age}
                    onChange={(e) => setNewPatient({
                      ...newPatient,
                      age: parseInt(e.target.value) || 0
                    })}
                    placeholder="Enter age"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="newPatientGender">Gender</Label>
                  <Select
                    value={newPatient.gender}
                    onValueChange={(value: 'male' | 'female') => setNewPatient({
                      ...newPatient,
                      gender: value
                    })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">
                        <div className="flex items-center space-x-2">
                          <span>👨</span>
                          <span>Male</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="female">
                        <div className="flex items-center space-x-2">
                          <span>👩</span>
                          <span>Female</span>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="newPatientPhone">Phone *</Label>
                  <Input
                    id="newPatientPhone"
                    value={newPatient.phone}
                    onChange={(e) => setNewPatient({
                      ...newPatient,
                      phone: e.target.value
                    })}
                    placeholder="+91 XXXXXXXXXX"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="newPatientEmail">Email</Label>
                <Input
                  id="newPatientEmail"
                  type="email"
                  value={newPatient.email}
                  onChange={(e) => setNewPatient({
                    ...newPatient,
                    email: e.target.value
                  })}
                  placeholder="example@email.com"
                />
              </div>
              
              <div>
                <Label htmlFor="newPatientAddress">Address</Label>
                <Textarea
                  id="newPatientAddress"
                  value={newPatient.address}
                  onChange={(e) => setNewPatient({
                    ...newPatient,
                    address: e.target.value
                  })}
                  placeholder="Enter full address"
                  rows={3}
                />
              </div>
            </div>
            
            <div className="flex justify-end space-x-2 mt-6">
              <Button variant="outline" onClick={() => setShowAddPatient(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddPatient}>
                <Save className="w-4 h-4 mr-2" />
                Add Patient
              </Button>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  if (selectedPatient) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        {}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" onClick={() => setSelectedPatient(null)}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Patient Records</h1>
              <p className="text-gray-600">Viewing {selectedPatient.name}'s medical records</p>
            </div>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" onClick={() => handleEditPatient(selectedPatient)}>
              <Edit className="w-4 h-4 mr-2" />
              Edit Info
            </Button>
            <Button onClick={() => onStartConsultation?.(selectedPatient.id)}>
              <Activity className="w-4 h-4 mr-2" />
              Start Consultation
            </Button>
            <Button onClick={() => onWritePrescription?.(selectedPatient.id)}>
              <Pill className="w-4 h-4 mr-2" />
              Write Prescription
            </Button>
          </div>
        </div>

        {/* Patient Summary Panel */}
        <Card className="p-6 mb-6">
          <div className="flex items-start space-x-6">
            <Avatar className="w-20 h-20 bg-blue-100 flex items-center justify-center">
              <div className="text-2xl">
                {selectedPatient.gender === 'male' ? '👨' : selectedPatient.gender === 'female' ? '👩' : '👤'}
              </div>
            </Avatar>
            
            <div className="flex-1">
              <div className="flex items-center space-x-4 mb-4">
                <h2 className="text-2xl font-bold text-gray-800">{selectedPatient.name}</h2>
                <Badge variant="outline">{selectedPatient.age} years old</Badge>
                <Badge variant="outline" className="capitalize">{selectedPatient.gender}</Badge>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="flex items-center space-x-2">
                  <Phone className="w-4 h-4 text-gray-500" />
                  <span>{selectedPatient.phone}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Mail className="w-4 h-4 text-gray-500" />
                  <span>{selectedPatient.email}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4 text-gray-500" />
                  <span>{selectedPatient.address}</span>
                </div>
              </div>
              
              <div className="mt-4 flex items-center space-x-2">
                <Calendar className="w-4 h-4 text-gray-500" />
                <span className="text-sm">Last visit: {new Date(selectedPatient.lastVisit).toLocaleDateString()}</span>
              </div>
            </div>
          </div>

          {}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{selectedPatient.medicalHistory.length}</div>
              <div className="text-sm text-gray-600">Total Visits</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{selectedPatient.prescriptions.filter(p => p.status === 'active').length}</div>
              <div className="text-sm text-gray-600">Active Medications</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{selectedPatient.allergies.length}</div>
              <div className="text-sm text-gray-600">Known Allergies</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{selectedPatient.chronicConditions.length}</div>
              <div className="text-sm text-gray-600">Chronic Conditions</div>
            </div>
          </div>
        </Card>

        {}
        {isEditing && editedPatient && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <Card className="max-w-2xl w-full max-h-[80vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-bold">Edit Patient Information</h3>
                  <Button variant="ghost" size="sm" onClick={handleCancelEdit}>
                    <X className="w-4 h-4" />
                  </Button>
                </div>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        value={editedPatient.name}
                        onChange={(e) => setEditedPatient({
                          ...editedPatient,
                          name: e.target.value
                        })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="age">Age</Label>
                      <Input
                        id="age"
                        type="number"
                        value={editedPatient.age}
                        onChange={(e) => setEditedPatient({
                          ...editedPatient,
                          age: parseInt(e.target.value)
                        })}
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        value={editedPatient.phone}
                        onChange={(e) => setEditedPatient({
                          ...editedPatient,
                          phone: e.target.value
                        })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={editedPatient.email}
                        onChange={(e) => setEditedPatient({
                          ...editedPatient,
                          email: e.target.value
                        })}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="address">Address</Label>
                    <Textarea
                      id="address"
                      value={editedPatient.address}
                      onChange={(e) => setEditedPatient({
                        ...editedPatient,
                        address: e.target.value
                      })}
                    />
                  </div>
                </div>
                
                <div className="flex justify-end space-x-2 mt-6">
                  <Button variant="outline" onClick={handleCancelEdit}>
                    Cancel
                  </Button>
                  <Button onClick={handleSaveEdit}>
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>
    );
  }

  
  return (
    <div className="min-h-screen bg-gray-50 p-4">
      {}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" onClick={onBack}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Patient Records</h1>
            <p className="text-gray-600">View and manage patient medical records</p>
          </div>
        </div>
        <Button onClick={() => setShowAddPatient(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add New Patient
        </Button>
      </div>

      {}
      <Card className="p-4 mb-6">
        <div className="flex space-x-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
              <Input
                placeholder="Search by name or phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <div className="w-64">
            <Input
              placeholder="Filter by condition..."
              value={filterCondition}
              onChange={(e) => setFilterCondition(e.target.value)}
            />
          </div>
        </div>
      </Card>

      {}
      <div className="grid gap-4">
        {filteredPatients.map((patient) => (
          <Card key={patient.id} className="p-4 hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => setSelectedPatient(patient)}>
            <div className="flex items-center space-x-4">
              <Avatar className="w-12 h-12 bg-blue-100 flex items-center justify-center">
                <div className="text-lg">
                  {patient.gender === 'male' ? '👨' : patient.gender === 'female' ? '👩' : '👤'}
                </div>
              </Avatar>
              
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <h3 className="font-bold text-gray-800">{patient.name}</h3>
                  <Badge variant="outline" className="text-xs">{patient.age}y</Badge>
                  <Badge variant="outline" className="text-xs capitalize">{patient.gender}</Badge>
                </div>
                <div className="text-sm text-gray-600 mb-2">
                  <span>{patient.phone}</span> • <span>Last visit: {new Date(patient.lastVisit).toLocaleDateString()}</span>
                </div>
                <div className="flex space-x-2">
                  {patient.chronicConditions.slice(0, 2).map((condition, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {condition}
                    </Badge>
                  ))}
                  {patient.chronicConditions.length > 2 && (
                    <Badge variant="secondary" className="text-xs">
                      +{patient.chronicConditions.length - 2} more
                    </Badge>
                  )}
                </div>
              </div>
              
              <div className="flex space-x-2">
                <Button variant="outline" size="sm" onClick={(e) => {
                  e.stopPropagation();
                  onStartConsultation?.(patient.id);
                }}>
                  <Activity className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="sm" onClick={(e) => {
                  e.stopPropagation();
                  onWritePrescription?.(patient.id);
                }}>
                  <Pill className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {filteredPatients.length === 0 && (
        <Card className="p-8 text-center">
          <User className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-800 mb-2">No patients found</h3>
          <p className="text-gray-600 mb-4">
            {searchTerm || filterCondition 
              ? 'Try adjusting your search terms or filters'
              : 'Add your first patient to get started'
            }
          </p>
          <Button onClick={() => setShowAddPatient(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add New Patient
          </Button>
        </Card>
      )}
    </div>
  );
}