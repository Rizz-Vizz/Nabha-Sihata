import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { useLanguage } from './language-context';
import { useAuth } from './auth-context';
import { 
  ArrowLeft, 
  Plus, 
  Search, 
  Filter,
  FileText,
  Calendar,
  User,
  Stethoscope,
  Pill,
  TestTube,
  Camera,
  Download,
  Upload,
  Wifi,
  WifiOff,
  Check,
  X,
  Edit,
  Trash2,
  AlertCircle,
  CheckCircle,
  Clock,
  Heart,
  Activity,
  TrendingUp,
  Save,
  RefreshCw
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface MedicalRecord {
  id: string;
  type: 'consultation' | 'prescription' | 'test_result' | 'vaccination' | 'vitals' | 'note';
  title: string;
  description: string;
  doctor?: string;
  date: string;
  attachments?: string[]; 
  data?: any; 
  isLocal: boolean; 
  lastSynced?: string;
  needsSync: boolean;
}

interface VitalSigns {
  bloodPressure?: string;
  heartRate?: number;
  temperature?: number;
  weight?: number;
  height?: number;
  bloodSugar?: number;
}

interface OfflineMedicalRecordsProps {
  onBack: () => void;
}

const recordTypeConfig = {
  'consultation': { 
    color: 'bg-blue-100 text-blue-800', 
    icon: Stethoscope,
    label: 'Consultation'
  },
  'prescription': { 
    color: 'bg-green-100 text-green-800', 
    icon: Pill,
    label: 'Prescription'
  },
  'test_result': { 
    color: 'bg-purple-100 text-purple-800', 
    icon: TestTube,
    label: 'Test Result'
  },
  'vaccination': { 
    color: 'bg-orange-100 text-orange-800', 
    icon: Activity,
    label: 'Vaccination'
  },
  'vitals': { 
    color: 'bg-red-100 text-red-800', 
    icon: Heart,
    label: 'Vital Signs'
  },
  'note': { 
    color: 'bg-gray-100 text-gray-800', 
    icon: FileText,
    label: 'Note'
  }
};

export function OfflineMedicalRecords({ onBack }: OfflineMedicalRecordsProps) {
  const { t } = useLanguage();
  const { userProfile } = useAuth();
  const [records, setRecords] = useState<MedicalRecord[]>([]);
  const [filteredRecords, setFilteredRecords] = useState<MedicalRecord[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'date' | 'type' | 'title'>('date');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingRecord, setEditingRecord] = useState<MedicalRecord | null>(null);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [syncing, setSyncing] = useState(false);

  
  const [formData, setFormData] = useState({
    type: 'consultation' as MedicalRecord['type'],
    title: '',
    description: '',
    doctor: '',
    vitals: {} as VitalSigns
  });

  // Local storage keys
  const STORAGE_KEY = 'nabha_medical_records';
  const SYNC_QUEUE_KEY = 'nabha_sync_queue';

  
  useEffect(() => {
    loadLocalRecords();
    
    
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  
  useEffect(() => {
    let filtered = records.filter(record => {
      const matchesSearch = record.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           record.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           (record.doctor && record.doctor.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesType = selectedType === 'all' || record.type === selectedType;
      return matchesSearch && matchesType;
    });

    
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        case 'type':
          return a.type.localeCompare(b.type);
        case 'title':
          return a.title.localeCompare(b.title);
        default:
          return 0;
      }
    });

    setFilteredRecords(filtered);
  }, [records, searchQuery, selectedType, sortBy]);

  const loadLocalRecords = () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsedRecords = JSON.parse(stored);
        setRecords(parsedRecords);
        console.log(`Loaded ${parsedRecords.length} medical records from local storage`);
      } else {
        
        const sampleRecords = generateSampleRecords();
        setRecords(sampleRecords);
        saveToLocalStorage(sampleRecords);
      }
    } catch (error) {
      console.error('Error loading records from localStorage:', error);
      toast.error('Failed to load medical records');
    }
  };

  const saveToLocalStorage = (recordsToSave: MedicalRecord[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(recordsToSave));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
      toast.error('Failed to save records locally');
    }
  };

  const generateSampleRecords = (): MedicalRecord[] => {
    const currentDate = new Date();
    return [
      {
        id: '1',
        type: 'consultation',
        title: 'General Checkup',
        description: 'Regular health checkup. Blood pressure and basic vitals checked. Overall health is good.',
        doctor: 'Dr. Simran Kaur',
        date: new Date(currentDate.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        isLocal: true,
        needsSync: false,
        data: {
          diagnosis: 'Healthy',
          recommendations: 'Continue regular exercise and balanced diet'
        }
      },
      {
        id: '2',
        type: 'prescription',
        title: 'Fever and Cold Medicine',
        description: 'Prescribed medication for fever and cold symptoms.',
        doctor: 'Dr. Sukhjeet Singh',
        date: new Date(currentDate.getTime() - 14 * 24 * 60 * 60 * 1000).toISOString(),
        isLocal: true,
        needsSync: false,
        data: {
          medications: [
            { name: 'Paracetamol 500mg', dosage: '1 tablet twice daily', duration: '5 days' },
            { name: 'Cetirizine 10mg', dosage: '1 tablet at bedtime', duration: '3 days' }
          ]
        }
      },
      {
        id: '3',
        type: 'vitals',
        title: 'Blood Pressure Check',
        description: 'Regular blood pressure monitoring.',
        date: new Date(currentDate.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        isLocal: true,
        needsSync: false,
        data: {
          vitals: {
            bloodPressure: '120/80',
            heartRate: 72,
            weight: 65
          }
        }
      },
      {
        id: '4',
        type: 'test_result',
        title: 'Blood Sugar Test',
        description: 'Fasting blood glucose test results.',
        doctor: 'Dr. Arshpreet Kaur',
        date: new Date(currentDate.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        isLocal: true,
        needsSync: false,
        data: {
          testName: 'Fasting Blood Glucose',
          result: '95 mg/dL',
          normalRange: '70-100 mg/dL',
          status: 'Normal'
        }
      },
      {
        id: '5',
        type: 'vaccination',
        title: 'COVID-19 Booster',
        description: 'COVID-19 booster vaccination administered.',
        doctor: 'PHC Nabha',
        date: new Date(currentDate.getTime() - 60 * 24 * 60 * 60 * 1000).toISOString(),
        isLocal: true,
        needsSync: false,
        data: {
          vaccine: 'Covishield',
          batchNumber: 'CV123456',
          dose: 'Booster'
        }
      }
    ];
  };

  const addRecord = () => {
    if (!formData.title.trim()) {
      toast.error('Please enter a title for the record');
      return;
    }

    const newRecord: MedicalRecord = {
      id: Date.now().toString(),
      type: formData.type,
      title: formData.title,
      description: formData.description,
      doctor: formData.doctor || undefined,
      date: new Date().toISOString(),
      isLocal: true,
      needsSync: true,
      data: formData.type === 'vitals' ? { vitals: formData.vitals } : undefined
    };

    const updatedRecords = [newRecord, ...records];
    setRecords(updatedRecords);
    saveToLocalStorage(updatedRecords);
    
    
    addToSyncQueue(newRecord);

    
    setFormData({
      type: 'consultation',
      title: '',
      description: '',
      doctor: '',
      vitals: {}
    });
    setShowAddForm(false);
    
    toast.success('Medical record added successfully');
  };

  const updateRecord = (updatedRecord: MedicalRecord) => {
    const updatedRecords = records.map(record => 
      record.id === updatedRecord.id ? { ...updatedRecord, needsSync: true } : record
    );
    setRecords(updatedRecords);
    saveToLocalStorage(updatedRecords);
    addToSyncQueue(updatedRecord);
    setEditingRecord(null);
    toast.success('Record updated successfully');
  };

  const deleteRecord = (recordId: string) => {
    const updatedRecords = records.filter(record => record.id !== recordId);
    setRecords(updatedRecords);
    saveToLocalStorage(updatedRecords);
    toast.success('Record deleted successfully');
  };

  const addToSyncQueue = (record: MedicalRecord) => {
    try {
      const existing = localStorage.getItem(SYNC_QUEUE_KEY);
      const queue = existing ? JSON.parse(existing) : [];
      queue.push(record);
      localStorage.setItem(SYNC_QUEUE_KEY, JSON.stringify(queue));
    } catch (error) {
      console.error('Error adding to sync queue:', error);
    }
  };

  const syncRecords = async () => {
    if (!isOnline) {
      toast.error('Cannot sync while offline');
      return;
    }

    setSyncing(true);
    try {
      
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      
      const syncedRecords = records.map(record => ({
        ...record,
        needsSync: false,
        lastSynced: new Date().toISOString()
      }));
      
      setRecords(syncedRecords);
      saveToLocalStorage(syncedRecords);
      
      
      localStorage.removeItem(SYNC_QUEUE_KEY);
      
      toast.success('Records synced successfully');
    } catch (error) {
      console.error('Sync error:', error);
      toast.error('Failed to sync records');
    } finally {
      setSyncing(false);
    }
  };

  const exportRecords = () => {
    try {
      const dataStr = JSON.stringify(records, null, 2);
      const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
      
      const exportFileDefaultName = `medical_records_${new Date().toISOString().split('T')[0]}.json`;
      
      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileDefaultName);
      linkElement.click();
      
      toast.success('Records exported successfully');
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Failed to export records');
    }
  };

  const importRecords = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedRecords = JSON.parse(e.target?.result as string);
        if (Array.isArray(importedRecords)) {
          const mergedRecords = [...records, ...importedRecords];
          setRecords(mergedRecords);
          saveToLocalStorage(mergedRecords);
          toast.success(`Imported ${importedRecords.length} records successfully`);
        } else {
          toast.error('Invalid file format');
        }
      } catch (error) {
        console.error('Import error:', error);
        toast.error('Failed to import records');
      }
    };
    reader.readAsText(file);
  };

  const recordTypes = ['all', 'consultation', 'prescription', 'test_result', 'vaccination', 'vitals', 'note'];
  const unsyncedCount = records.filter(r => r.needsSync).length;

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {}
      <div className="bg-white shadow-sm p-4 sticky top-0 z-10">
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          <div className="flex items-center space-x-3">
            <Button variant="ghost" size="sm" onClick={onBack}>
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div>
              <h1 className="font-bold text-gray-800">📋 Medical Records</h1>
              <p className="text-sm text-gray-600">
                {records.length} records • {isOnline ? 'Online' : 'Offline'} 
                {unsyncedCount > 0 && ` • ${unsyncedCount} unsynced`}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            {isOnline ? (
              <Wifi className="w-4 h-4 text-green-500" />
            ) : (
              <WifiOff className="w-4 h-4 text-red-500" />
            )}
            
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setShowAddForm(true)}
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="p-4 max-w-4xl mx-auto">
        {}
        <Card className="p-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {isOnline ? (
                <div className="flex items-center space-x-2 text-green-600">
                  <CheckCircle className="w-5 h-5" />
                  <span className="text-sm font-medium">Online - Auto-sync enabled</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2 text-orange-600">
                  <AlertCircle className="w-5 h-5" />
                  <span className="text-sm font-medium">Offline - Changes saved locally</span>
                </div>
              )}
              
              {unsyncedCount > 0 && (
                <Badge className="bg-orange-100 text-orange-800">
                  {unsyncedCount} pending sync
                </Badge>
              )}
            </div>
            
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={exportRecords}
              >
                <Download className="w-4 h-4 mr-1" />
                Export
              </Button>
              
              <label className="cursor-pointer">
                <Button
                  variant="outline"
                  size="sm"
                  asChild
                >
                  <span>
                    <Upload className="w-4 h-4 mr-1" />
                    Import
                  </span>
                </Button>
                <input
                  type="file"
                  accept=".json"
                  onChange={importRecords}
                  className="hidden"
                />
              </label>
              
              {isOnline && unsyncedCount > 0 && (
                <Button
                  size="sm"
                  onClick={syncRecords}
                  disabled={syncing}
                >
                  {syncing ? (
                    <div className="flex items-center space-x-1">
                      <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Syncing...</span>
                    </div>
                  ) : (
                    <>
                      <RefreshCw className="w-4 h-4 mr-1" />
                      Sync
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>
        </Card>

        {}
        <Card className="p-4 mb-6">
          <div className="space-y-4">
            {}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search records, doctors, or descriptions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Record Type
                </label>
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="w-full p-2 border rounded-md text-sm"
                >
                  {recordTypes.map(type => (
                    <option key={type} value={type}>
                      {type === 'all' ? 'All Types' : recordTypeConfig[type]?.label || type}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sort By
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as 'date' | 'type' | 'title')}
                  className="w-full p-2 border rounded-md text-sm"
                >
                  <option value="date">Recent First</option>
                  <option value="type">Record Type</option>
                  <option value="title">Title</option>
                </select>
              </div>
            </div>
          </div>
        </Card>

        {}
        {showAddForm && (
          <Card className="p-4 mb-6">
            <h3 className="font-semibold text-gray-800 mb-4">Add New Medical Record</h3>
            
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Record Type
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({...formData, type: e.target.value as MedicalRecord['type']})}
                    className="w-full p-2 border rounded-md text-sm"
                  >
                    {recordTypes.slice(1).map(type => (
                      <option key={type} value={type}>
                        {recordTypeConfig[type]?.label || type}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Doctor/Provider
                  </label>
                  <Input
                    placeholder="Dr. Name or Institution"
                    value={formData.doctor}
                    onChange={(e) => setFormData({...formData, doctor: e.target.value})}
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title
                </label>
                <Input
                  placeholder="Enter record title"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <Textarea
                  placeholder="Enter detailed description"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  rows={3}
                />
              </div>

              {}
              {formData.type === 'vitals' && (
                <div className="border rounded-lg p-4 bg-red-50">
                  <h4 className="font-medium text-gray-800 mb-3">Vital Signs</h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Blood Pressure
                      </label>
                      <Input
                        placeholder="120/80"
                        value={formData.vitals.bloodPressure || ''}
                        onChange={(e) => setFormData({
                          ...formData, 
                          vitals: {...formData.vitals, bloodPressure: e.target.value}
                        })}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Heart Rate (bpm)
                      </label>
                      <Input
                        type="number"
                        placeholder="72"
                        value={formData.vitals.heartRate || ''}
                        onChange={(e) => setFormData({
                          ...formData, 
                          vitals: {...formData.vitals, heartRate: Number(e.target.value)}
                        })}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Temperature (°F)
                      </label>
                      <Input
                        type="number"
                        step="0.1"
                        placeholder="98.6"
                        value={formData.vitals.temperature || ''}
                        onChange={(e) => setFormData({
                          ...formData, 
                          vitals: {...formData.vitals, temperature: Number(e.target.value)}
                        })}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Weight (kg)
                      </label>
                      <Input
                        type="number"
                        step="0.1"
                        placeholder="65"
                        value={formData.vitals.weight || ''}
                        onChange={(e) => setFormData({
                          ...formData, 
                          vitals: {...formData.vitals, weight: Number(e.target.value)}
                        })}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Height (cm)
                      </label>
                      <Input
                        type="number"
                        placeholder="165"
                        value={formData.vitals.height || ''}
                        onChange={(e) => setFormData({
                          ...formData, 
                          vitals: {...formData.vitals, height: Number(e.target.value)}
                        })}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Blood Sugar (mg/dL)
                      </label>
                      <Input
                        type="number"
                        placeholder="95"
                        value={formData.vitals.bloodSugar || ''}
                        onChange={(e) => setFormData({
                          ...formData, 
                          vitals: {...formData.vitals, bloodSugar: Number(e.target.value)}
                        })}
                      />
                    </div>
                  </div>
                </div>
              )}
              
              <div className="flex space-x-3">
                <Button onClick={addRecord}>
                  <Save className="w-4 h-4 mr-2" />
                  Save Record
                </Button>
                <Button variant="outline" onClick={() => setShowAddForm(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          </Card>
        )}

        {/* Records List */}
        <div className="space-y-4">
          {filteredRecords.map((record) => {
            const config = recordTypeConfig[record.type];
            const IconComponent = config?.icon || FileText;
            
            return (
              <Card key={record.id} className="p-4 hover:shadow-lg transition-shadow">
                <div className="flex items-start space-x-4">
                  {/* Record Icon */}
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <IconComponent className="w-6 h-6 text-blue-600" />
                  </div>

                  {/* Record Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h3 className="font-semibold text-gray-800 truncate">{record.title}</h3>
                          {record.needsSync && (
                            <Badge className="bg-orange-100 text-orange-800 text-xs">
                              Pending Sync
                            </Badge>
                          )}
                          {record.isLocal && (
                            <Badge className="bg-blue-100 text-blue-800 text-xs">
                              Local
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 line-clamp-2">{record.description}</p>
                      </div>
                      
                      <div className="text-right flex-shrink-0 ml-2">
                        <div className="flex items-center text-sm text-gray-500">
                          <Calendar className="w-3 h-3 mr-1" />
                          {new Date(record.date).toLocaleDateString()}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3 mb-3">
                      <Badge className={config?.color || 'bg-gray-100 text-gray-800'}>
                        {config?.label || record.type}
                      </Badge>
                      
                      {record.doctor && (
                        <div className="flex items-center text-sm text-gray-600">
                          <User className="w-3 h-3 mr-1" />
                          <span>{record.doctor}</span>
                        </div>
                      )}
                    </div>

                    {}
                    {record.data && record.type === 'vitals' && record.data.vitals && (
                      <div className="mb-3 p-2 bg-red-50 rounded-lg">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
                          {record.data.vitals.bloodPressure && (
                            <div>
                              <span className="font-medium">BP:</span> {record.data.vitals.bloodPressure}
                            </div>
                          )}
                          {record.data.vitals.heartRate && (
                            <div>
                              <span className="font-medium">HR:</span> {record.data.vitals.heartRate} bpm
                            </div>
                          )}
                          {record.data.vitals.temperature && (
                            <div>
                              <span className="font-medium">Temp:</span> {record.data.vitals.temperature}°F
                            </div>
                          )}
                          {record.data.vitals.weight && (
                            <div>
                              <span className="font-medium">Weight:</span> {record.data.vitals.weight} kg
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {record.data && record.type === 'prescription' && record.data.medications && (
                      <div className="mb-3 p-2 bg-green-50 rounded-lg">
                        <div className="text-xs">
                          <span className="font-medium">Medications:</span>
                          <div className="mt-1 space-y-1">
                            {record.data.medications.slice(0, 2).map((med: any, index: number) => (
                              <div key={index}>• {med.name} - {med.dosage}</div>
                            ))}
                            {record.data.medications.length > 2 && (
                              <div>... and {record.data.medications.length - 2} more</div>
                            )}
                          </div>
                        </div>
                      </div>
                    )}

                    {}
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setEditingRecord(record)}
                      >
                        <Edit className="w-4 h-4 mr-1" />
                        Edit
                      </Button>
                      
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => deleteRecord(record.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4 mr-1" />
                        Delete
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {filteredRecords.length === 0 && (
          <Card className="p-8 text-center">
            <div className="text-gray-400 mb-4">
              <FileText className="w-12 h-12 mx-auto" />
            </div>
            <h3 className="font-semibold text-gray-800 mb-2">No records found</h3>
            <p className="text-gray-600 mb-4">
              {searchQuery || selectedType !== 'all' 
                ? 'Try adjusting your search or filter criteria.' 
                : 'Start by adding your first medical record.'}
            </p>
            {!showAddForm && (
              <Button onClick={() => setShowAddForm(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Add First Record
              </Button>
            )}
          </Card>
        )}

        {}
        <div className="mt-6 text-center text-sm text-gray-500">
          <p className="flex items-center justify-center space-x-2">
            <Clock className="w-4 h-4" />
            <span>Last updated: {new Date().toLocaleString()}</span>
          </p>
          <p className="mt-1">
            {isOnline ? 
              'Records are automatically synced when online' : 
              'Records saved locally - will sync when connection restored'
            }
          </p>
        </div>
      </div>
    </div>
  );
}