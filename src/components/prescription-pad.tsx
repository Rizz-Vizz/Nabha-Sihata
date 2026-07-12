import React, { useState, useRef } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { 
  ArrowLeft, 
  Plus, 
  Trash2, 
  Save, 
  Download, 
  Printer, 
  Search,
  AlertTriangle,
  Clock,
  User,
  FileText,
  Pill,
  Calendar,
  Shield,
  CheckCircle,
  X,
  Wifi,
  WifiOff
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions: string;
  warningInteractions?: string[];
}

interface Patient {
  id: string;
  name: string;
  age: number;
  gender: string;
  allergies: string[];
  chronicConditions: string[];
}

interface PrescriptionPadProps {
  onBack: () => void;
  patientId?: string;
}

interface DrugInteraction {
  medication: string;
  severity: 'high' | 'medium' | 'low';
  description: string;
}

export function PrescriptionPad({ onBack, patientId }: PrescriptionPadProps) {
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [medications, setMedications] = useState<Medication[]>([]);
  const [newMedication, setNewMedication] = useState<Partial<Medication>>({});
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [followUpDate, setFollowUpDate] = useState('');
  const [doctorSignature, setDoctorSignature] = useState('');
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [savedOffline, setSavedOffline] = useState(false);
  const [drugInteractions, setDrugInteractions] = useState<DrugInteraction[]>([]);
  const [showMedicineSearch, setShowMedicineSearch] = useState(false);
  const [medicineSearchTerm, setMedicineSearchTerm] = useState('');
  const prescriptionRef = useRef<HTMLDivElement>(null);

  // Mock patient data
  const mockPatients: Patient[] = [
    {
      id: '1',
      name: 'Rajinder Singh',
      age: 45,
      gender: 'male',
      allergies: ['Penicillin', 'Peanuts'],
      chronicConditions: ['Diabetes Type 2', 'Hypertension']
    },
    {
      id: '2',
      name: 'Simran Kaur',
      age: 40,
      gender: 'female',
      allergies: ['Aspirin'],
      chronicConditions: ['Pregnancy - 7 months']
    },
    {
      id: '3',
      name: 'Arjun Singh',
      age: 12,
      gender: 'male',
      allergies: [],
      chronicConditions: []
    }
  ];

  
  const commonMedicines = [
    { name: 'Paracetamol', dosages: ['500mg', '650mg', '1000mg'], frequencies: ['Every 6 hours', 'Every 8 hours', 'Twice daily'] },
    { name: 'Metformin', dosages: ['500mg', '850mg', '1000mg'], frequencies: ['Twice daily', 'Three times daily'] },
    { name: 'Amlodipine', dosages: ['2.5mg', '5mg', '10mg'], frequencies: ['Once daily'] },
    { name: 'Atorvastatin', dosages: ['10mg', '20mg', '40mg'], frequencies: ['Once daily at bedtime'] },
    { name: 'Omeprazole', dosages: ['20mg', '40mg'], frequencies: ['Once daily before breakfast'] },
    { name: 'Aspirin', dosages: ['75mg', '100mg', '325mg'], frequencies: ['Once daily'] },
    { name: 'Amoxicillin', dosages: ['250mg', '500mg'], frequencies: ['Three times daily', 'Twice daily'] },
    { name: 'Ciprofloxacin', dosages: ['250mg', '500mg'], frequencies: ['Twice daily'] },
    { name: 'Prednisolone', dosages: ['5mg', '10mg', '20mg'], frequencies: ['Once daily', 'Twice daily'] },
    { name: 'Salbutamol', dosages: ['100mcg/puff'], frequencies: ['2 puffs as needed'] }
  ];

  const frequencyOptions = [
    'Once daily',
    'Twice daily',
    'Three times daily',
    'Four times daily',
    'Every 6 hours',
    'Every 8 hours',
    'Every 12 hours',
    'As needed',
    'Before meals',
    'After meals',
    'At bedtime'
  ];

  const durationOptions = [
    '3 days',
    '5 days',
    '7 days',
    '10 days',
    '14 days',
    '1 month',
    '2 months',
    '3 months',
    'Until next visit',
    'Continue indefinitely'
  ];

  React.useEffect(() => {
    
    if (patientId) {
      const patient = mockPatients.find(p => p.id === patientId);
      if (patient) {
        setSelectedPatient(patient);
      }
    }

    
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [patientId]);

  
  const checkDrugInteractions = (newMedications: Medication[]) => {
    const interactions: DrugInteraction[] = [];
    
    
    const medicineNames = newMedications.map(m => m.name.toLowerCase());
    
    if (medicineNames.includes('aspirin') && medicineNames.includes('warfarin')) {
      interactions.push({
        medication: 'Aspirin + Warfarin',
        severity: 'high',
        description: 'Increased risk of bleeding. Monitor INR closely.'
      });
    }
    
    if (medicineNames.includes('metformin') && selectedPatient?.chronicConditions.some(c => c.toLowerCase().includes('kidney'))) {
      interactions.push({
        medication: 'Metformin',
        severity: 'medium',
        description: 'Avoid in kidney disease. Consider alternative.'
      });
    }
    
    
    selectedPatient?.allergies.forEach(allergy => {
      newMedications.forEach(med => {
        if (med.name.toLowerCase().includes(allergy.toLowerCase()) || 
            (allergy.toLowerCase() === 'penicillin' && med.name.toLowerCase().includes('amoxicillin'))) {
          interactions.push({
            medication: med.name,
            severity: 'high',
            description: `Patient is allergic to ${allergy}. Do not prescribe.`
          });
        }
      });
    });
    
    setDrugInteractions(interactions);
  };

  const addMedication = () => {
    if (!newMedication.name || !newMedication.dosage || !newMedication.frequency || !newMedication.duration) {
      toast.error('Please fill all required medication fields');
      return;
    }

    const medication: Medication = {
      id: Date.now().toString(),
      name: newMedication.name!,
      dosage: newMedication.dosage!,
      frequency: newMedication.frequency!,
      duration: newMedication.duration!,
      instructions: newMedication.instructions || ''
    };

    const updatedMedications = [...medications, medication];
    setMedications(updatedMedications);
    checkDrugInteractions(updatedMedications);
    
    // Reset form
    setNewMedication({});
    setShowMedicineSearch(false);
    toast.success('Medication added to prescription');
  };

  const removeMedication = (id: string) => {
    const updatedMedications = medications.filter(m => m.id !== id);
    setMedications(updatedMedications);
    checkDrugInteractions(updatedMedications);
    toast.success('Medication removed from prescription');
  };

  const selectMedicine = (medicine: any) => {
    setNewMedication({
      ...newMedication,
      name: medicine.name
    });
    setMedicineSearchTerm(medicine.name);
    setShowMedicineSearch(false);
  };

  const savePrescription = async () => {
    if (!selectedPatient) {
      toast.error('Please select a patient');
      return;
    }

    if (medications.length === 0) {
      toast.error('Please add at least one medication');
      return;
    }

    const prescriptionData = {
      patientId: selectedPatient.id,
      patientName: selectedPatient.name,
      medications,
      specialInstructions,
      followUpDate,
      doctorSignature,
      date: new Date().toISOString(),
      interactions: drugInteractions
    };

    try {
      if (isOnline) {
        
        console.log('Saving prescription online:', prescriptionData);
        toast.success('Prescription saved successfully');
      } else {
        
        const offlinePrescriptions = JSON.parse(localStorage.getItem('offlinePrescriptions') || '[]');
        offlinePrescriptions.push(prescriptionData);
        localStorage.setItem('offlinePrescriptions', JSON.stringify(offlinePrescriptions));
        setSavedOffline(true);
        toast.success('Prescription saved offline. Will sync when online.');
      }
    } catch (error) {
      toast.error('Failed to save prescription');
    }
  };

  const downloadPDF = () => {
    
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    
    const prescriptionHTML = prescriptionRef.current?.innerHTML || '';
    printWindow.document.write(`
      <html>
        <head>
          <title>Prescription - ${selectedPatient?.name}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            .header { text-align: center; border-bottom: 2px solid #333; padding-bottom: 20px; margin-bottom: 20px; }
            .patient-info { margin-bottom: 20px; }
            .medications { margin: 20px 0; }
            .medication-item { border: 1px solid #ddd; margin: 10px 0; padding: 10px; }
            .footer { margin-top: 30px; border-top: 1px solid #ddd; padding-top: 20px; }
            .signature { float: right; }
            @media print { .no-print { display: none; } }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>MEDICAL PRESCRIPTION</h1>
            <p>Dr. Demo Singh - General Medicine</p>
            <p>Civil Hospital Nabha, Punjab</p>
            <p>Date: ${new Date().toLocaleDateString()}</p>
          </div>
          ${prescriptionHTML}
          <div class="footer">
            <p>This prescription is valid for 30 days from date of issue.</p>
            <div class="signature">
              <p>_________________________</p>
              <p>Dr. Demo Singh</p>
              <p>Digital Signature</p>
            </div>
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
  };

  const printPrescription = () => {
    downloadPDF();
  };

  const filteredMedicines = commonMedicines.filter(medicine =>
    medicine.name.toLowerCase().includes(medicineSearchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" onClick={onBack}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Prescription Pad</h1>
            <p className="text-gray-600">Write and manage prescriptions</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {isOnline ? (
            <div className="flex items-center space-x-1 text-green-600">
              <Wifi className="w-4 h-4" />
              <span className="text-sm">Online</span>
            </div>
          ) : (
            <div className="flex items-center space-x-1 text-orange-600">
              <WifiOff className="w-4 h-4" />
              <span className="text-sm">Offline</span>
            </div>
          )}
          {savedOffline && (
            <Badge variant="outline" className="text-orange-600">
              Saved Offline
            </Badge>
          )}
        </div>
      </div>

      <div className="max-w-4xl mx-auto space-y-6">
        {/* Patient Selection */}
        {!selectedPatient && (
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Select Patient</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {mockPatients.map((patient) => (
                <div 
                  key={patient.id}
                  className="border rounded-lg p-4 hover:bg-blue-50 cursor-pointer transition-colors"
                  onClick={() => setSelectedPatient(patient)}
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      {patient.gender === 'male' ? '👨' : patient.gender === 'female' ? '👩' : '👤'}
                    </div>
                    <div>
                      <h4 className="font-medium">{patient.name}</h4>
                      <p className="text-sm text-gray-600">{patient.age} years • {patient.gender}</p>
                    </div>
                  </div>
                  {patient.allergies.length > 0 && (
                    <div className="mt-2 flex items-center space-x-1">
                      <AlertTriangle className="w-3 h-3 text-red-500" />
                      <span className="text-xs text-red-600">Has allergies</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </Card>
        )}

        {selectedPatient && (
          <>
            {}
            <Card className="p-6" ref={prescriptionRef}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                    {selectedPatient.gender === 'male' ? '👨' : selectedPatient.gender === 'female' ? '👩' : '👤'}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-800">{selectedPatient.name}</h2>
                    <p className="text-gray-600">{selectedPatient.age} years old • {selectedPatient.gender}</p>
                    <p className="text-sm text-gray-500">Patient ID: {selectedPatient.id}</p>
                  </div>
                </div>
                <Button variant="outline" size="sm" onClick={() => setSelectedPatient(null)}>
                  Change Patient
                </Button>
              </div>

              {}
              {(selectedPatient.allergies.length > 0 || selectedPatient.chronicConditions.length > 0) && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <AlertTriangle className="w-5 h-5 text-red-600" />
                    <h4 className="font-medium text-red-800">Important Patient Information</h4>
                  </div>
                  {selectedPatient.allergies.length > 0 && (
                    <div className="mb-2">
                      <span className="font-medium text-red-700">Allergies: </span>
                      {selectedPatient.allergies.map((allergy, index) => (
                        <Badge key={index} variant="destructive" className="mr-2">
                          {allergy}
                        </Badge>
                      ))}
                    </div>
                  )}
                  {selectedPatient.chronicConditions.length > 0 && (
                    <div>
                      <span className="font-medium text-red-700">Chronic Conditions: </span>
                      {selectedPatient.chronicConditions.map((condition, index) => (
                        <Badge key={index} variant="outline" className="mr-2 border-red-300 text-red-700">
                          {condition}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {}
              {drugInteractions.length > 0 && (
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <Shield className="w-5 h-5 text-orange-600" />
                    <h4 className="font-medium text-orange-800">Drug Interaction Alerts</h4>
                  </div>
                  {drugInteractions.map((interaction, index) => (
                    <div key={index} className="mb-2 last:mb-0">
                      <div className="flex items-center space-x-2">
                        <Badge variant={interaction.severity === 'high' ? 'destructive' : 'secondary'}>
                          {interaction.severity.toUpperCase()}
                        </Badge>
                        <span className="font-medium">{interaction.medication}</span>
                      </div>
                      <p className="text-sm text-orange-700 ml-2">{interaction.description}</p>
                    </div>
                  ))}
                </div>
              )}
            </Card>

            {}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Add Medication</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {}
                <div>
                  <Label>Medicine Name *</Label>
                  <div className="relative">
                    <Input
                      placeholder="Search medicine..."
                      value={medicineSearchTerm}
                      onChange={(e) => {
                        setMedicineSearchTerm(e.target.value);
                        setNewMedication({...newMedication, name: e.target.value});
                        setShowMedicineSearch(e.target.value.length > 0);
                      }}
                      className="pr-10"
                    />
                    <Search className="w-4 h-4 absolute right-3 top-3 text-gray-400" />
                    
                    {showMedicineSearch && filteredMedicines.length > 0 && (
                      <div className="absolute z-10 w-full bg-white border border-gray-200 rounded-md shadow-lg max-h-48 overflow-y-auto mt-1">
                        {filteredMedicines.map((medicine, index) => (
                          <div
                            key={index}
                            className="p-3 hover:bg-blue-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                            onClick={() => selectMedicine(medicine)}
                          >
                            <div className="font-medium">{medicine.name}</div>
                            <div className="text-sm text-gray-600">
                              {medicine.dosages.join(', ')}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {}
                <div>
                  <Label>Dosage *</Label>
                  <Input
                    placeholder="e.g., 500mg, 5ml, 1 tablet"
                    value={newMedication.dosage || ''}
                    onChange={(e) => setNewMedication({...newMedication, dosage: e.target.value})}
                  />
                </div>

                {/* Frequency */}
                <div>
                  <Label>Frequency *</Label>
                  <Select onValueChange={(value) => setNewMedication({...newMedication, frequency: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select frequency" />
                    </SelectTrigger>
                    <SelectContent>
                      {frequencyOptions.map((freq) => (
                        <SelectItem key={freq} value={freq}>{freq}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Duration */}
                <div>
                  <Label>Duration *</Label>
                  <Select onValueChange={(value) => setNewMedication({...newMedication, duration: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select duration" />
                    </SelectTrigger>
                    <SelectContent>
                      {durationOptions.map((duration) => (
                        <SelectItem key={duration} value={duration}>{duration}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="mt-4">
                <Label>Special Instructions</Label>
                <Input
                  placeholder="e.g., Take with food, Before bedtime..."
                  value={newMedication.instructions || ''}
                  onChange={(e) => setNewMedication({...newMedication, instructions: e.target.value})}
                />
              </div>

              <Button onClick={addMedication} className="mt-4">
                <Plus className="w-4 h-4 mr-2" />
                Add Medication
              </Button>
            </Card>

            {}
            {medications.length > 0 && (
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Prescribed Medications</h3>
                <div className="space-y-4">
                  {medications.map((medication) => (
                    <div key={medication.id} className="border rounded-lg p-4 bg-blue-50">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-800">{medication.name}</h4>
                          <div className="text-sm text-gray-600 space-y-1 mt-2">
                            <div>📋 <strong>Dosage:</strong> {medication.dosage}</div>
                            <div>⏰ <strong>Frequency:</strong> {medication.frequency}</div>
                            <div>📅 <strong>Duration:</strong> {medication.duration}</div>
                            {medication.instructions && (
                              <div>💡 <strong>Instructions:</strong> {medication.instructions}</div>
                            )}
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeMedication(medication.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Additional Instructions</h3>
              
              <div className="space-y-4">
                <div>
                  <Label>Special Instructions for Patient</Label>
                  <Textarea
                    placeholder="e.g., Diet recommendations, lifestyle changes, precautions..."
                    value={specialInstructions}
                    onChange={(e) => setSpecialInstructions(e.target.value)}
                    rows={3}
                  />
                </div>

                <div>
                  <Label>Follow-up Date</Label>
                  <Input
                    type="date"
                    value={followUpDate}
                    onChange={(e) => setFollowUpDate(e.target.value)}
                  />
                </div>
              </div>
            </Card>

            {}
            <Card className="p-6">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Digital Signature</h3>
                  <p className="text-sm text-gray-600">
                    This prescription will be digitally signed as Dr. Demo Singh
                  </p>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  <Button variant="outline" onClick={savePrescription}>
                    <Save className="w-4 h-4 mr-2" />
                    Save Prescription
                  </Button>
                  <Button variant="outline" onClick={downloadPDF}>
                    <Download className="w-4 h-4 mr-2" />
                    Download PDF
                  </Button>
                  <Button onClick={printPrescription}>
                    <Printer className="w-4 h-4 mr-2" />
                    Print
                  </Button>
                </div>
              </div>

              {}
              <div className="hidden">
                <div className="patient-info">
                  <h3>Patient Information</h3>
                  <p><strong>Name:</strong> {selectedPatient.name}</p>
                  <p><strong>Age:</strong> {selectedPatient.age} years</p>
                  <p><strong>Gender:</strong> {selectedPatient.gender}</p>
                  <p><strong>Patient ID:</strong> {selectedPatient.id}</p>
                </div>

                <div className="medications">
                  <h3>Prescribed Medications</h3>
                  {medications.map((med, index) => (
                    <div key={med.id} className="medication-item">
                      <p><strong>{index + 1}. {med.name}</strong></p>
                      <p>Dosage: {med.dosage}</p>
                      <p>Frequency: {med.frequency}</p>
                      <p>Duration: {med.duration}</p>
                      {med.instructions && <p>Instructions: {med.instructions}</p>}
                    </div>
                  ))}
                </div>

                {specialInstructions && (
                  <div>
                    <h3>Special Instructions</h3>
                    <p>{specialInstructions}</p>
                  </div>
                )}

                {followUpDate && (
                  <div>
                    <h3>Follow-up</h3>
                    <p>Next appointment: {new Date(followUpDate).toLocaleDateString()}</p>
                  </div>
                )}
              </div>

              {medications.length === 0 && (
                <div className="mt-6 p-4 bg-gray-50 rounded-lg text-center">
                  <Pill className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                  <p className="text-gray-600">No medications added yet</p>
                  <p className="text-sm text-gray-500">Add medications above to create prescription</p>
                </div>
              )}
            </Card>
          </>
        )}
      </div>
    </div>
  );
}