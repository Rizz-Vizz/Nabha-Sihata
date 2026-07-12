import React, { useState, useRef } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { useLanguage } from './language-context';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowLeft, 
  Upload,
  Camera,
  FileText,
  Image,
  CheckCircle,
  AlertCircle,
  Clock,
  X,
  Eye,
  Download,
  RefreshCw,
  Trash2,
  Edit3,
  Plus,
  Zap,
  Shield,
  User,
  Calendar,
  MapPin,
  Phone,
  Stethoscope,
  Pill,
  AlertTriangle,
  Info,
  Star,
  ThumbsUp,
  Award,
  Activity
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface PrescriptionFile {
  id: string;
  fileName: string;
  fileType: 'pdf' | 'image';
  fileSize: number;
  fileUrl: string;
  uploadDate: string;
  status: 'pending' | 'verified' | 'rejected' | 'processing';
  verificationDate?: string;
  rejectionReason?: string;
  extractedMedicines: string[];
  doctorInfo?: {
    name: string;
    registration: string;
    specialization: string;
    hospital: string;
  };
  patientInfo?: {
    name: string;
    age: number;
    gender: string;
  };
  validityDate?: string;
  notes?: string;
}

interface PrescriptionUploadProps {
  onBack: () => void;
  onPrescriptionVerified?: (prescriptionId: string, medicines: string[]) => void;
}

export function PrescriptionUpload({ onBack, onPrescriptionVerified }: PrescriptionUploadProps) {
  const { t } = useLanguage();
  const [prescriptions, setPrescriptions] = useState<PrescriptionFile[]>([
    {
      id: 'presc001',
      fileName: 'prescription_dr_sharma.pdf',
      fileType: 'pdf',
      fileSize: 2456789,
      fileUrl: '/mock-prescription.pdf',
      uploadDate: '2024-01-18T14:30:00Z',
      status: 'verified',
      verificationDate: '2024-01-18T15:45:00Z',
      extractedMedicines: ['Amoxicillin 500mg', 'Paracetamol 650mg', 'Omeprazole 20mg'],
      doctorInfo: {
        name: 'Dr. Rajesh Sharma',
        registration: 'MCI-12345',
        specialization: 'General Physician',
        hospital: 'City Hospital, Nabha'
      },
      patientInfo: {
        name: 'Rajinder Singh',
        age: 45,
        gender: 'Male'
      },
      validityDate: '2024-02-18',
      notes: 'Take after meals for 7 days'
    },
    {
      id: 'presc002',
      fileName: 'blood_test_prescription.jpg',
      fileType: 'image',
      fileSize: 1234567,
      fileUrl: '/mock-prescription-2.jpg',
      uploadDate: '2024-01-20T10:15:00Z',
      status: 'processing',
      extractedMedicines: [],
      notes: 'Processing OCR and verification'
    }
  ]);

  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [selectedPrescription, setSelectedPrescription] = useState<PrescriptionFile | null>(null);
  const [showUploadGuide, setShowUploadGuide] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleFileUpload = async (file: File) => {
    if (!file) return;

    
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
    if (!allowedTypes.includes(file.type)) {
      toast.error('Please upload only PDF, JPG, or PNG files');
      return;
    }

    
    if (file.size > 10 * 1024 * 1024) {
      toast.error('File size should be less than 10MB');
      return;
    }

    setIsUploading(true);

    try {
      
      const fileUrl = URL.createObjectURL(file);
      const newPrescription: PrescriptionFile = {
        id: `presc_${Date.now()}`,
        fileName: file.name,
        fileType: file.type.includes('pdf') ? 'pdf' : 'image',
        fileSize: file.size,
        fileUrl,
        uploadDate: new Date().toISOString(),
        status: 'processing',
        extractedMedicines: [],
        notes: 'Uploading and processing...'
      };

      setPrescriptions(prev => [newPrescription, ...prev]);
      toast.success('Prescription uploaded successfully! Processing...');

      
      setTimeout(() => {
        setPrescriptions(prev => 
          prev.map(presc => 
            presc.id === newPrescription.id 
              ? {
                  ...presc,
                  status: 'pending',
                  notes: 'Under review by our pharmacy team'
                }
              : presc
          )
        );
      }, 2000);

      
      setTimeout(() => {
        const verifiedPrescription = {
          ...newPrescription,
          status: 'verified' as const,
          verificationDate: new Date().toISOString(),
          extractedMedicines: ['Crocin 650mg', 'Azithromycin 250mg', 'Pantoprazole 40mg'],
          doctorInfo: {
            name: 'Dr. Preet Singh',
            registration: 'MCI-67890',
            specialization: 'General Physician',
            hospital: 'Nabha Medical Center'
          },
          patientInfo: {
            name: 'Rajinder Singh',
            age: 45,
            gender: 'Male'
          },
          validityDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          notes: 'Prescription verified and approved'
        };

        setPrescriptions(prev => 
          prev.map(presc => 
            presc.id === newPrescription.id ? verifiedPrescription : presc
          )
        );

        toast.success('🎉 Prescription verified! You can now order medicines.');
        
        if (onPrescriptionVerified) {
          onPrescriptionVerified(verifiedPrescription.id, verifiedPrescription.extractedMedicines);
        }
      }, 5000);

    } catch (error) {
      toast.error('Failed to upload prescription. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileUpload(e.target.files[0]);
    }
  };

  const deletePrescription = (id: string) => {
    const prescription = prescriptions.find(p => p.id === id);
    if (!prescription) return;

    const confirmed = window.confirm('Are you sure you want to delete this prescription?');
    if (!confirmed) return;

    setPrescriptions(prev => prev.filter(p => p.id !== id));
    toast.success('Prescription deleted successfully');
  };

  const downloadPrescription = (prescription: PrescriptionFile) => {
    
    toast.success(`Downloading ${prescription.fileName}...`);
  };

  const retryVerification = (id: string) => {
    setPrescriptions(prev => 
      prev.map(presc => 
        presc.id === id 
          ? { ...presc, status: 'pending', notes: 'Retrying verification...' }
          : presc
      )
    );
    toast.info('Retrying verification...');

    
    setTimeout(() => {
      setPrescriptions(prev => 
        prev.map(presc => 
          presc.id === id 
            ? { ...presc, status: 'verified', verificationDate: new Date().toISOString() }
            : presc
        )
      );
      toast.success('Prescription verified successfully!');
    }, 3000);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'verified': return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'pending': return <Clock className="w-5 h-5 text-yellow-600" />;
      case 'processing': return <RefreshCw className="w-5 h-5 text-blue-600 animate-spin" />;
      case 'rejected': return <AlertCircle className="w-5 h-5 text-red-600" />;
      default: return <Clock className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'verified': return 'bg-green-100 text-green-700 border-green-200';
      case 'pending': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'processing': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'rejected': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const uploadGuideSteps = [
    {
      icon: Camera,
      title: 'Clear & Bright',
      description: 'Ensure good lighting and focus for clear text'
    },
    {
      icon: FileText,
      title: 'Complete Prescription',
      description: 'Include doctor details, patient info, and medicines'
    },
    {
      icon: Shield,
      title: 'Valid Prescription',
      description: 'Must be recent and from registered doctor'
    },
    {
      icon: Zap,
      title: 'Quick Processing',
      description: 'Usually verified within 10-15 minutes'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-blue-50 to-purple-50">
      {}
      <div className="bg-white/80 backdrop-blur-sm shadow-lg border-b border-emerald-100">
        <div className="flex items-center justify-between max-w-6xl mx-auto p-6">
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              size="sm"
              onClick={onBack}
              className="flex items-center space-x-2 hover:bg-emerald-50 border-emerald-200"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{t('back')}</span>
            </Button>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                Prescription Management
              </h1>
              <p className="text-gray-600">Upload and manage your prescriptions securely</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <Button
              onClick={() => setShowUploadGuide(true)}
              variant="outline"
              size="sm"
              className="border-blue-200 hover:bg-blue-50"
            >
              <Info className="w-4 h-4 mr-2" />
              Upload Guide
            </Button>
            <Badge variant="secondary" className="bg-emerald-100 text-emerald-700">
              {prescriptions.filter(p => p.status === 'verified').length} Verified
            </Badge>
          </div>
        </div>
      </div>

      <div className="p-6 max-w-6xl mx-auto space-y-8">
        {}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Card className="p-8">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Upload New Prescription</h2>
              <p className="text-gray-600">Upload a clear photo or PDF of your prescription for quick verification</p>
            </div>

            {}
            <div
              className={`border-2 border-dashed rounded-2xl p-12 text-center transition-all ${
                dragActive 
                  ? 'border-emerald-400 bg-emerald-50' 
                  : 'border-gray-300 hover:border-emerald-400'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              {isUploading ? (
                <div className="space-y-4">
                  <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto">
                    <RefreshCw className="w-8 h-8 text-emerald-600 animate-spin" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-800">Uploading...</h3>
                    <p className="text-gray-600">Processing your prescription</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto">
                    <Upload className="w-10 h-10 text-emerald-600" />
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">
                      Drag & drop your prescription here
                    </h3>
                    <p className="text-gray-600 mb-6">
                      or choose from the options below
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button
                      onClick={() => fileInputRef.current?.click()}
                      className="bg-emerald-600 hover:bg-emerald-700 px-8 py-3 rounded-xl"
                    >
                      <FileText className="w-5 h-5 mr-2" />
                      Choose File
                    </Button>
                    <Button
                      onClick={() => cameraInputRef.current?.click()}
                      variant="outline"
                      className="border-emerald-200 hover:bg-emerald-50 px-8 py-3 rounded-xl"
                    >
                      <Camera className="w-5 h-5 mr-2" />
                      Take Photo
                    </Button>
                  </div>

                  <div className="text-sm text-gray-500">
                    Supports PDF, JPG, PNG files up to 10MB
                  </div>
                </div>
              )}
            </div>

            {}
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={handleFileInputChange}
              className="hidden"
            />
            <input
              ref={cameraInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handleFileInputChange}
              className="hidden"
            />
          </Card>
        </motion.div>

        {}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6"
        >
          <Card className="p-6 text-center">
            <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mx-auto mb-3">
              <CheckCircle className="w-6 h-6 text-emerald-600" />
            </div>
            <div className="text-2xl font-bold text-gray-800">
              {prescriptions.filter(p => p.status === 'verified').length}
            </div>
            <div className="text-sm text-gray-600">Verified</div>
          </Card>

          <Card className="p-6 text-center">
            <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center mx-auto mb-3">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="text-2xl font-bold text-gray-800">
              {prescriptions.filter(p => p.status === 'pending' || p.status === 'processing').length}
            </div>
            <div className="text-sm text-gray-600">Processing</div>
          </Card>

          <Card className="p-6 text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-3">
              <Activity className="w-6 h-6 text-blue-600" />
            </div>
            <div className="text-2xl font-bold text-gray-800">
              {prescriptions.reduce((sum, p) => sum + p.extractedMedicines.length, 0)}
            </div>
            <div className="text-sm text-gray-600">Medicines</div>
          </Card>

          <Card className="p-6 text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-3">
              <Award className="w-6 h-6 text-purple-600" />
            </div>
            <div className="text-2xl font-bold text-gray-800">98%</div>
            <div className="text-sm text-gray-600">Success Rate</div>
          </Card>
        </motion.div>

        {}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-800">Your Prescriptions</h3>
              <div className="flex items-center space-x-2">
                <Button
                  onClick={() => {}}
                  variant="outline"
                  size="sm"
                  className="border-gray-200 hover:bg-gray-50"
                >
                  All Status
                </Button>
              </div>
            </div>

            {prescriptions.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FileText className="w-8 h-8 text-gray-400" />
                </div>
                <h4 className="text-lg font-bold text-gray-800 mb-2">No prescriptions yet</h4>
                <p className="text-gray-600">Upload your first prescription to get started</p>
              </div>
            ) : (
              <div className="space-y-4">
                {prescriptions.map((prescription, index) => (
                  <motion.div
                    key={prescription.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    className="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4 flex-1">
                        {}
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                          prescription.fileType === 'pdf' ? 'bg-red-100' : 'bg-blue-100'
                        }`}>
                          {prescription.fileType === 'pdf' ? (
                            <FileText className={`w-6 h-6 ${
                              prescription.fileType === 'pdf' ? 'text-red-600' : 'text-blue-600'
                            }`} />
                          ) : (
                            <Image className="w-6 h-6 text-blue-600" />
                          )}
                        </div>

                        {}
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h4 className="font-bold text-gray-800">{prescription.fileName}</h4>
                            <Badge className={`border ${getStatusColor(prescription.status)}`}>
                              {getStatusIcon(prescription.status)}
                              <span className="ml-1 capitalize">{prescription.status}</span>
                            </Badge>
                          </div>

                          <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                            <span>{formatFileSize(prescription.fileSize)}</span>
                            <span>•</span>
                            <span>{new Date(prescription.uploadDate).toLocaleDateString()}</span>
                            {prescription.validityDate && (
                              <>
                                <span>•</span>
                                <span>Valid until {new Date(prescription.validityDate).toLocaleDateString()}</span>
                              </>
                            )}
                          </div>

                          {}
                          {prescription.doctorInfo && (
                            <div className="bg-emerald-50 rounded-lg p-3 mb-3">
                              <div className="flex items-center space-x-2 mb-1">
                                <Stethoscope className="w-4 h-4 text-emerald-600" />
                                <span className="font-medium text-emerald-800">{prescription.doctorInfo.name}</span>
                              </div>
                              <div className="text-sm text-emerald-700">
                                {prescription.doctorInfo.specialization} • {prescription.doctorInfo.hospital}
                              </div>
                              <div className="text-xs text-emerald-600">
                                Registration: {prescription.doctorInfo.registration}
                              </div>
                            </div>
                          )}

                          {}
                          {prescription.extractedMedicines.length > 0 && (
                            <div className="bg-blue-50 rounded-lg p-3 mb-3">
                              <div className="flex items-center space-x-2 mb-2">
                                <Pill className="w-4 h-4 text-blue-600" />
                                <span className="font-medium text-blue-800">Prescribed Medicines</span>
                              </div>
                              <div className="flex flex-wrap gap-2">
                                {prescription.extractedMedicines.map((medicine, idx) => (
                                  <Badge key={idx} variant="secondary" className="bg-blue-100 text-blue-700 text-xs">
                                    {medicine}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}

                          {}
                          {prescription.notes && (
                            <div className="text-sm text-gray-600 italic">
                              {prescription.notes}
                            </div>
                          )}

                          {}
                          {prescription.status === 'rejected' && prescription.rejectionReason && (
                            <div className="bg-red-50 border border-red-200 rounded-lg p-3 mt-3">
                              <div className="flex items-center space-x-2 mb-1">
                                <AlertTriangle className="w-4 h-4 text-red-600" />
                                <span className="font-medium text-red-800">Rejection Reason</span>
                              </div>
                              <div className="text-sm text-red-700">{prescription.rejectionReason}</div>
                            </div>
                          )}
                        </div>
                      </div>

                      {}
                      <div className="flex items-center space-x-2">
                        <Button
                          onClick={() => setSelectedPrescription(prescription)}
                          variant="ghost"
                          size="sm"
                          className="w-8 h-8 p-0"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          onClick={() => downloadPrescription(prescription)}
                          variant="ghost"
                          size="sm"
                          className="w-8 h-8 p-0"
                        >
                          <Download className="w-4 h-4" />
                        </Button>
                        {prescription.status === 'rejected' && (
                          <Button
                            onClick={() => retryVerification(prescription.id)}
                            variant="ghost"
                            size="sm"
                            className="w-8 h-8 p-0 text-blue-600 hover:text-blue-700"
                          >
                            <RefreshCw className="w-4 h-4" />
                          </Button>
                        )}
                        <Button
                          onClick={() => deletePrescription(prescription.id)}
                          variant="ghost"
                          size="sm"
                          className="w-8 h-8 p-0 text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </Card>
        </motion.div>
      </div>

      {}
      <AnimatePresence>
        {showUploadGuide && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setShowUploadGuide(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-gray-800">How to Upload Prescription</h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowUploadGuide(false)}
                    className="w-8 h-8 p-0"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  {uploadGuideSteps.map((step, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                      className="text-center p-4"
                    >
                      <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <step.icon className="w-8 h-8 text-emerald-600" />
                      </div>
                      <h4 className="font-bold text-gray-800 mb-2">{step.title}</h4>
                      <p className="text-sm text-gray-600">{step.description}</p>
                    </motion.div>
                  ))}
                </div>

                <div className="bg-blue-50 rounded-xl p-4 mb-6">
                  <h4 className="font-bold text-blue-800 mb-2">📋 What to Include</h4>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• Doctor's name and registration number</li>
                    <li>• Hospital/clinic name and stamp</li>
                    <li>• Patient name and age</li>
                    <li>• List of prescribed medicines with dosage</li>
                    <li>• Date of prescription (within 30 days)</li>
                    <li>• Doctor's signature</li>
                  </ul>
                </div>

                <div className="bg-green-50 rounded-xl p-4">
                  <h4 className="font-bold text-green-800 mb-2">✅ Tips for Best Results</h4>
                  <ul className="text-sm text-green-700 space-y-1">
                    <li>• Use good lighting (natural light works best)</li>
                    <li>• Ensure the prescription is flat and unfolded</li>
                    <li>• Keep your phone steady while taking the photo</li>
                    <li>• Make sure all text is clearly readable</li>
                    <li>• Crop out unnecessary background</li>
                  </ul>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {}
      <AnimatePresence>
        {selectedPrescription && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setSelectedPrescription(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-gray-800">Prescription Details</h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedPrescription(null)}
                    className="w-8 h-8 p-0"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>

                <div className="space-y-6">
                  {}
                  <div className="bg-gray-50 rounded-xl p-6 text-center">
                    <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      {selectedPrescription.fileType === 'pdf' ? (
                        <FileText className="w-10 h-10 text-red-600" />
                      ) : (
                        <Image className="w-10 h-10 text-blue-600" />
                      )}
                    </div>
                    <h4 className="font-bold text-gray-800 mb-2">{selectedPrescription.fileName}</h4>
                    <p className="text-sm text-gray-600">
                      {formatFileSize(selectedPrescription.fileSize)} • 
                      Uploaded {new Date(selectedPrescription.uploadDate).toLocaleDateString()}
                    </p>
                  </div>

                  {}
                  <div className="flex items-center justify-center">
                    <Badge className={`border text-lg px-4 py-2 ${getStatusColor(selectedPrescription.status)}`}>
                      {getStatusIcon(selectedPrescription.status)}
                      <span className="ml-2 capitalize">{selectedPrescription.status}</span>
                    </Badge>
                  </div>

                  {}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {}
                    {selectedPrescription.doctorInfo && (
                      <Card className="p-4">
                        <h5 className="font-bold text-gray-800 mb-3">Doctor Information</h5>
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center space-x-2">
                            <User className="w-4 h-4 text-gray-400" />
                            <span>{selectedPrescription.doctorInfo.name}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Stethoscope className="w-4 h-4 text-gray-400" />
                            <span>{selectedPrescription.doctorInfo.specialization}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <MapPin className="w-4 h-4 text-gray-400" />
                            <span>{selectedPrescription.doctorInfo.hospital}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Shield className="w-4 h-4 text-gray-400" />
                            <span>{selectedPrescription.doctorInfo.registration}</span>
                          </div>
                        </div>
                      </Card>
                    )}

                    {}
                    {selectedPrescription.patientInfo && (
                      <Card className="p-4">
                        <h5 className="font-bold text-gray-800 mb-3">Patient Information</h5>
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center space-x-2">
                            <User className="w-4 h-4 text-gray-400" />
                            <span>{selectedPrescription.patientInfo.name}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Calendar className="w-4 h-4 text-gray-400" />
                            <span>{selectedPrescription.patientInfo.age} years old</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Users className="w-4 h-4 text-gray-400" />
                            <span>{selectedPrescription.patientInfo.gender}</span>
                          </div>
                        </div>
                      </Card>
                    )}
                  </div>

                  {}
                  {selectedPrescription.extractedMedicines.length > 0 && (
                    <Card className="p-4">
                      <h5 className="font-bold text-gray-800 mb-3">Prescribed Medicines</h5>
                      <div className="space-y-2">
                        {selectedPrescription.extractedMedicines.map((medicine, index) => (
                          <div key={index} className="flex items-center space-x-3 p-2 bg-emerald-50 rounded-lg">
                            <Pill className="w-4 h-4 text-emerald-600" />
                            <span className="font-medium text-emerald-800">{medicine}</span>
                          </div>
                        ))}
                      </div>
                    </Card>
                  )}

                  {}
                  <div className="flex space-x-3">
                    <Button
                      onClick={() => downloadPrescription(selectedPrescription)}
                      variant="outline"
                      className="flex-1 border-emerald-200 hover:bg-emerald-50"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                    {selectedPrescription.extractedMedicines.length > 0 && (
                      <Button
                        onClick={() => {
                          setSelectedPrescription(null);
                          toast.success('Redirecting to order medicines...');
                          if (onPrescriptionVerified) {
                            onPrescriptionVerified(selectedPrescription.id, selectedPrescription.extractedMedicines);
                          }
                        }}
                        className="flex-1 bg-emerald-600 hover:bg-emerald-700"
                      >
                        <Pill className="w-4 h-4 mr-2" />
                        Order Medicines
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}