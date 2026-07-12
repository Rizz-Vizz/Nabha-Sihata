import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { useLanguage } from './language-context';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowLeft, 
  MapPin, 
  Plus, 
  Edit3,
  Trash2,
  CreditCard,
  Smartphone,
  Building,
  Wallet,
  Shield,
  CheckCircle,
  AlertCircle,
  Truck,
  Clock,
  Package,
  Star,
  Gift,
  Tag,
  X,
  ChevronRight,
  Home,
  Briefcase,
  Users,

  Camera,
  Upload,
  CheckCircle2,
  AlertTriangle,
  Eye,
  Download
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface Medicine {
  id: string;
  name: string;
  genericName: string;
  price: number;
  dosage: string;
  manufacturer: string;
  category: string;
  stock: number;
  prescriptionRequired: boolean;
  description: string;
  discount?: number;
}

interface CartItem {
  medicine: Medicine;
  quantity: number;
}

interface DeliveryAddress {
  id: string;
  type: 'home' | 'work' | 'other';
  label: string;
  fullName: string;
  phoneNumber: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  pinCode: string;
  landmark?: string;
  isDefault: boolean;
}

interface PrescriptionFile {
  id: string;
  fileName: string;
  fileUrl: string;
  uploadDate: string;
  status: 'pending' | 'verified' | 'rejected';
  medicines: string[];
}

interface EnhancedPharmacyCheckoutProps {
  cartItems: CartItem[];
  onBack: () => void;
  onOrderSuccess: (orderId: string) => void;
  walletBalance: number;
}

export function EnhancedPharmacyCheckout({ 
  cartItems, 
  onBack, 
  onOrderSuccess, 
  walletBalance 
}: EnhancedPharmacyCheckoutProps) {
  const { t } = useLanguage();
  const [currentStep, setCurrentStep] = useState<'cart' | 'address' | 'prescription' | 'payment' | 'review'>('cart');
  const [selectedAddress, setSelectedAddress] = useState<string | null>(null);
  const [showAddAddress, setShowAddAddress] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'wallet' | 'card' | 'upi' | 'netbanking'>('wallet');
  const [isLoading, setIsLoading] = useState(false);
  const [showPrescriptionUpload, setShowPrescriptionUpload] = useState(false);
  const [selectedPrescription, setSelectedPrescription] = useState<string | null>(null);
  
  
  const [addressForm, setAddressForm] = useState({
    type: 'home' as 'home' | 'work' | 'other',
    label: '',
    fullName: '',
    phoneNumber: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    pinCode: '',
    landmark: '',
    isDefault: false
  });

  // Prescription upload state
  const [prescriptionFiles, setPrescriptionFiles] = useState<PrescriptionFile[]>([
    {
      id: 'presc001',
      fileName: 'prescription_jan_2024.pdf',
      fileUrl: '/mock-prescription.pdf',
      uploadDate: '2024-01-15',
      status: 'verified',
      medicines: ['Amoxicillin', 'Metformin']
    }
  ]);

  
  const [addresses, setAddresses] = useState<DeliveryAddress[]>([
    {
      id: 'addr001',
      type: 'home',
      label: 'Home',
      fullName: 'Rajinder Singh',
      phoneNumber: '+91 98765 43210',
      addressLine1: 'House No. 123, Sector 45',
      addressLine2: 'Near Gurudwara',
      city: 'Nabha',
      state: 'Punjab',
      pinCode: '147201',
      landmark: 'Opposite City Hospital',
      isDefault: true
    },
    {
      id: 'addr002',
      type: 'work',
      label: 'Office',
      fullName: 'Rajinder Singh',
      phoneNumber: '+91 98765 43210',
      addressLine1: 'Office Complex, Block A',
      addressLine2: 'Industrial Area',
      city: 'Nabha',
      state: 'Punjab',
      pinCode: '147201',
      landmark: 'Near Bus Stand',
      isDefault: false
    }
  ]);

  
  const paymentMethods = [
    {
      id: 'wallet',
      name: 'Pharmacy Wallet',
      icon: Wallet,
      description: `Balance: ₹${walletBalance.toLocaleString()}`,
      enabled: true,
      recommended: walletBalance >= getTotalAmount()
    },
    {
      id: 'card',
      name: 'Credit/Debit Card',
      icon: CreditCard,
      description: 'Visa, Mastercard, RuPay',
      enabled: true,
      recommended: false
    },
    {
      id: 'upi',
      name: 'UPI Payment',
      icon: Smartphone,
      description: 'PhonePe, GPay, Paytm',
      enabled: true,
      recommended: false
    },
    {
      id: 'netbanking',
      name: 'Net Banking',
      icon: Building,
      description: 'All major banks',
      enabled: true,
      recommended: false
    }
  ];

  useEffect(() => {
    if (addresses.length > 0 && !selectedAddress) {
      const defaultAddress = addresses.find(addr => addr.isDefault);
      setSelectedAddress(defaultAddress?.id || addresses[0].id);
    }
  }, [addresses, selectedAddress]);

  function getSubtotal() {
    return cartItems.reduce((sum, item) => sum + (item.medicine.price * item.quantity), 0);
  }

  function getDiscount() {
    return cartItems.reduce((sum, item) => {
      const discount = item.medicine.discount || 0;
      return sum + ((item.medicine.price * discount / 100) * item.quantity);
    }, 0);
  }

  function getDeliveryCharges() {
    const subtotal = getSubtotal();
    return subtotal >= 500 ? 0 : 50; 
  }

  function getTotalAmount() {
    return getSubtotal() - getDiscount() + getDeliveryCharges();
  }

  function requiresPrescription() {
    return cartItems.some(item => item.medicine.prescriptionRequired);
  }

  const handleAddAddress = () => {
    if (!addressForm.fullName || !addressForm.phoneNumber || !addressForm.addressLine1 || 
        !addressForm.city || !addressForm.state || !addressForm.pinCode) {
      toast.error('Please fill all required fields');
      return;
    }

    const newAddress: DeliveryAddress = {
      id: `addr${Date.now()}`,
      ...addressForm,
      label: addressForm.label || `${addressForm.type.charAt(0).toUpperCase() + addressForm.type.slice(1)}`
    };

    if (addressForm.isDefault) {
      setAddresses(prev => prev.map(addr => ({ ...addr, isDefault: false })));
    }

    setAddresses(prev => [...prev, newAddress]);
    setSelectedAddress(newAddress.id);
    setShowAddAddress(false);
    setAddressForm({
      type: 'home',
      label: '',
      fullName: '',
      phoneNumber: '',
      addressLine1: '',
      addressLine2: '',
      city: '',
      state: '',
      pinCode: '',
      landmark: '',
      isDefault: false
    });
    toast.success('Address added successfully!');
  };

  const handlePrescriptionUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Simulate file upload
    const newPrescription: PrescriptionFile = {
      id: `presc${Date.now()}`,
      fileName: file.name,
      fileUrl: URL.createObjectURL(file),
      uploadDate: new Date().toISOString().split('T')[0],
      status: 'pending',
      medicines: cartItems.filter(item => item.medicine.prescriptionRequired).map(item => item.medicine.name)
    };

    setPrescriptionFiles(prev => [...prev, newPrescription]);
    toast.success('Prescription uploaded successfully! Verification in progress...');

    
    setTimeout(() => {
      setPrescriptionFiles(prev => 
        prev.map(presc => 
          presc.id === newPrescription.id 
            ? { ...presc, status: 'verified' }
            : presc
        )
      );
      toast.success('Prescription verified! You can now proceed with your order.');
    }, 3000);
  };

  const handlePlaceOrder = async () => {
    if (!selectedAddress) {
      toast.error('Please select a delivery address');
      return;
    }

    if (requiresPrescription() && !selectedPrescription) {
      toast.error('Please upload prescription for restricted medicines');
      return;
    }

    const totalAmount = getTotalAmount();
    if (paymentMethod === 'wallet' && walletBalance < totalAmount) {
      toast.error('Insufficient wallet balance');
      return;
    }

    setIsLoading(true);

    try {
      
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const orderId = `ORD${Date.now()}`;
      toast.success('Order placed successfully! 🎉');
      onOrderSuccess(orderId);
    } catch (error) {
      toast.error('Payment failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const getStepStatus = (step: string) => {
    const steps = ['cart', 'address', 'prescription', 'payment', 'review'];
    const currentIndex = steps.indexOf(currentStep);
    const stepIndex = steps.indexOf(step);
    
    if (stepIndex < currentIndex) return 'completed';
    if (stepIndex === currentIndex) return 'current';
    return 'pending';
  };

  const canProceedToNext = () => {
    switch (currentStep) {
      case 'cart':
        return cartItems.length > 0;
      case 'address':
        return selectedAddress !== null;
      case 'prescription':
        return !requiresPrescription() || selectedPrescription !== null;
      case 'payment':
        return paymentMethod !== null;
      default:
        return true;
    }
  };

  const getNextStep = () => {
    switch (currentStep) {
      case 'cart':
        return 'address';
      case 'address':
        return requiresPrescription() ? 'prescription' : 'payment';
      case 'prescription':
        return 'payment';
      case 'payment':
        return 'review';
      default:
        return 'review';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-blue-50 to-purple-50">
      {}
      <div className="bg-white/80 backdrop-blur-sm shadow-lg border-b border-emerald-100">
        <div className="flex items-center justify-between max-w-7xl mx-auto p-6">
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
                Secure Checkout
              </h1>
              <p className="text-gray-600">Complete your medicine order safely</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <Badge variant="secondary" className="bg-emerald-100 text-emerald-700">
              {cartItems.length} item{cartItems.length !== 1 ? 's' : ''}
            </Badge>
            <div className="text-right">
              <div className="text-sm text-gray-500">Total Amount</div>
              <div className="text-xl font-bold text-emerald-600">₹{getTotalAmount().toLocaleString()}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 max-w-7xl mx-auto">
        {/* Progress Steps */}
        <Card className="p-6 mb-8">
          <div className="flex items-center justify-between">
            {[
              { key: 'cart', label: 'Cart', icon: Package },
              { key: 'address', label: 'Address', icon: MapPin },
              ...(requiresPrescription() ? [{ key: 'prescription', label: 'Prescription', icon: Upload }] : []),
              { key: 'payment', label: 'Payment', icon: CreditCard },
              { key: 'review', label: 'Review', icon: CheckCircle }
            ].map((step, index, array) => (
              <React.Fragment key={step.key}>
                <div className="flex flex-col items-center">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all ${
                    getStepStatus(step.key) === 'completed' 
                      ? 'bg-emerald-500 border-emerald-500 text-white'
                      : getStepStatus(step.key) === 'current'
                      ? 'bg-emerald-100 border-emerald-500 text-emerald-600'
                      : 'bg-gray-100 border-gray-300 text-gray-400'
                  }`}>
                    {getStepStatus(step.key) === 'completed' ? (
                      <CheckCircle className="w-6 h-6" />
                    ) : (
                      <step.icon className="w-6 h-6" />
                    )}
                  </div>
                  <span className={`text-sm mt-2 font-medium ${
                    getStepStatus(step.key) === 'current' ? 'text-emerald-600' : 'text-gray-500'
                  }`}>
                    {step.label}
                  </span>
                </div>
                {index < array.length - 1 && (
                  <div className={`flex-1 h-0.5 mx-4 ${
                    getStepStatus(array[index + 1].key) === 'completed' ? 'bg-emerald-500' : 'bg-gray-200'
                  }`} />
                )}
              </React.Fragment>
            ))}
          </div>
        </Card>

        <div className="grid lg:grid-cols-3 gap-8">
          {}
          <div className="lg:col-span-2 space-y-8">
            {}
            {currentStep === 'cart' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <Card className="p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-6">Your Cart</h3>
                  <div className="space-y-4">
                    {cartItems.map((item, index) => (
                      <motion.div
                        key={item.medicine.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, delay: index * 0.1 }}
                        className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl"
                      >
                        <div className="w-16 h-16 bg-emerald-100 rounded-lg flex items-center justify-center">
                          <Package className="w-8 h-8 text-emerald-600" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-bold text-gray-800">{item.medicine.name}</h4>
                          <p className="text-sm text-gray-600">{item.medicine.genericName} • {item.medicine.dosage}</p>
                          <div className="flex items-center space-x-2 mt-1">
                            {item.medicine.prescriptionRequired && (
                              <Badge variant="secondary" className="bg-red-100 text-red-700 text-xs">
                                Prescription Required
                              </Badge>
                            )}
                            {item.medicine.discount && (
                              <Badge variant="secondary" className="bg-green-100 text-green-700 text-xs">
                                {item.medicine.discount}% OFF
                              </Badge>
                            )}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-gray-800">₹{(item.medicine.price * item.quantity).toLocaleString()}</div>
                          <div className="text-sm text-gray-500">₹{item.medicine.price} × {item.quantity}</div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </Card>
              </motion.div>
            )}

            {}
            {currentStep === 'address' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <Card className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-gray-800">Delivery Address</h3>
                    <Button
                      onClick={() => setShowAddAddress(true)}
                      variant="outline"
                      className="border-emerald-200 hover:bg-emerald-50"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Address
                    </Button>
                  </div>
                  
                  <div className="space-y-4">
                    {addresses.map((address) => (
                      <motion.div
                        key={address.id}
                        whileHover={{ scale: 1.02 }}
                        className={`p-4 border-2 rounded-xl cursor-pointer transition-all ${
                          selectedAddress === address.id
                            ? 'border-emerald-500 bg-emerald-50'
                            : 'border-gray-200 hover:border-emerald-300'
                        }`}
                        onClick={() => setSelectedAddress(address.id)}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-start space-x-3">
                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                              address.type === 'home' ? 'bg-blue-100 text-blue-600' :
                              address.type === 'work' ? 'bg-purple-100 text-purple-600' :
                              'bg-orange-100 text-orange-600'
                            }`}>
                              {address.type === 'home' ? <Home className="w-5 h-5" /> :
                               address.type === 'work' ? <Briefcase className="w-5 h-5" /> :
                               <MapPin className="w-5 h-5" />}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-1">
                                <h4 className="font-bold text-gray-800">{address.label}</h4>
                                {address.isDefault && (
                                  <Badge variant="secondary" className="bg-emerald-100 text-emerald-700 text-xs">
                                    Default
                                  </Badge>
                                )}
                              </div>
                              <p className="font-medium text-gray-700">{address.fullName}</p>
                              <p className="text-sm text-gray-600">
                                {address.addressLine1}, {address.addressLine2 && `${address.addressLine2}, `}
                                {address.city}, {address.state} - {address.pinCode}
                              </p>
                              <p className="text-sm text-gray-500">{address.phoneNumber}</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Button variant="ghost" size="sm" className="w-8 h-8 p-0">
                              <Edit3 className="w-4 h-4" />
                            </Button>
                            {!address.isDefault && (
                              <Button variant="ghost" size="sm" className="w-8 h-8 p-0 text-red-500 hover:text-red-700">
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </Card>
              </motion.div>
            )}

            {}
            {currentStep === 'prescription' && requiresPrescription() && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <Card className="p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-6">Prescription Upload</h3>
                  
                  {}
                  <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
                    <div className="flex items-center space-x-3">
                      <AlertTriangle className="w-6 h-6 text-amber-600" />
                      <div>
                        <h4 className="font-bold text-amber-800">Prescription Required</h4>
                        <p className="text-sm text-amber-700">
                          Your cart contains medicines that require a valid prescription. Please upload a clear image or PDF of your prescription.
                        </p>
                      </div>
                    </div>
                  </div>

                  {}
                  <div className="mb-6">
                    <label className="block text-sm font-medium mb-3 text-gray-700">Upload New Prescription</label>
                    <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-emerald-400 transition-colors">
                      <input
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={handlePrescriptionUpload}
                        className="hidden"
                        id="prescription-upload"
                      />
                      <label htmlFor="prescription-upload" className="cursor-pointer">
                        <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                          <Upload className="w-8 h-8 text-emerald-600" />
                        </div>
                        <h4 className="font-bold text-gray-800 mb-2">Click to upload prescription</h4>
                        <p className="text-sm text-gray-600">Supports PDF, JPG, PNG files up to 10MB</p>
                      </label>
                    </div>
                  </div>

                  {}
                  <div>
                    <h4 className="font-bold text-gray-800 mb-4">Previous Prescriptions</h4>
                    <div className="space-y-3">
                      {prescriptionFiles.map((prescription) => (
                        <motion.div
                          key={prescription.id}
                          whileHover={{ scale: 1.02 }}
                          className={`p-4 border-2 rounded-xl cursor-pointer transition-all ${
                            selectedPrescription === prescription.id
                              ? 'border-emerald-500 bg-emerald-50'
                              : 'border-gray-200 hover:border-emerald-300'
                          }`}
                          onClick={() => prescription.status === 'verified' && setSelectedPrescription(prescription.id)}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                                prescription.status === 'verified' ? 'bg-green-100 text-green-600' :
                                prescription.status === 'pending' ? 'bg-yellow-100 text-yellow-600' :
                                'bg-red-100 text-red-600'
                              }`}>
                                {prescription.status === 'verified' ? <CheckCircle2 className="w-5 h-5" /> :
                                 prescription.status === 'pending' ? <Clock className="w-5 h-5" /> :
                                 <AlertCircle className="w-5 h-5" />}
                              </div>
                              <div>
                                <h5 className="font-medium text-gray-800">{prescription.fileName}</h5>
                                <p className="text-sm text-gray-600">
                                  Uploaded on {new Date(prescription.uploadDate).toLocaleDateString()}
                                </p>
                                <Badge variant="secondary" className={`text-xs mt-1 ${
                                  prescription.status === 'verified' ? 'bg-green-100 text-green-700' :
                                  prescription.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                                  'bg-red-100 text-red-700'
                                }`}>
                                  {prescription.status.charAt(0).toUpperCase() + prescription.status.slice(1)}
                                </Badge>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Button variant="ghost" size="sm" className="w-8 h-8 p-0">
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button variant="ghost" size="sm" className="w-8 h-8 p-0">
                                <Download className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </Card>
              </motion.div>
            )}

            {}
            {currentStep === 'payment' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <Card className="p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-6">Payment Method</h3>
                  
                  <div className="space-y-4">
                    {paymentMethods.map((method) => (
                      <motion.div
                        key={method.id}
                        whileHover={{ scale: 1.02 }}
                        className={`p-4 border-2 rounded-xl cursor-pointer transition-all ${
                          paymentMethod === method.id
                            ? 'border-emerald-500 bg-emerald-50'
                            : method.enabled
                            ? 'border-gray-200 hover:border-emerald-300'
                            : 'border-gray-100 bg-gray-50 cursor-not-allowed opacity-50'
                        }`}
                        onClick={() => method.enabled && setPaymentMethod(method.id as any)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                              paymentMethod === method.id ? 'bg-emerald-500 text-white' : 'bg-gray-100 text-gray-600'
                            }`}>
                              <method.icon className="w-6 h-6" />
                            </div>
                            <div>
                              <h4 className="font-bold text-gray-800">{method.name}</h4>
                              <p className="text-sm text-gray-600">{method.description}</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            {method.recommended && (
                              <Badge variant="secondary" className="bg-blue-100 text-blue-700 text-xs">
                                Recommended
                              </Badge>
                            )}
                            {paymentMethod === method.id && (
                              <CheckCircle className="w-5 h-5 text-emerald-500" />
                            )}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {}
                  <div className="mt-6 flex items-center space-x-2 p-4 bg-blue-50 rounded-xl">
                    <Shield className="w-5 h-5 text-blue-600" />
                    <span className="text-sm text-blue-700">
                      Your payment information is secured with 256-bit SSL encryption
                    </span>
                  </div>
                </Card>
              </motion.div>
            )}

            {}
            {currentStep === 'review' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="space-y-6"
              >
                {}
                <Card className="p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-6">Order Review</h3>
                  
                  {}
                  <div className="space-y-4 mb-6">
                    {cartItems.map((item) => (
                      <div key={item.medicine.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <h4 className="font-medium text-gray-800">{item.medicine.name}</h4>
                          <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-gray-800">₹{(item.medicine.price * item.quantity).toLocaleString()}</div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {}
                  <div className="mb-6">
                    <h4 className="font-bold text-gray-800 mb-3">Delivery Address</h4>
                    {selectedAddress && (
                      <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200">
                        <p className="font-medium text-gray-800">
                          {addresses.find(addr => addr.id === selectedAddress)?.fullName}
                        </p>
                        <p className="text-sm text-gray-600">
                          {addresses.find(addr => addr.id === selectedAddress)?.addressLine1},
                          {addresses.find(addr => addr.id === selectedAddress)?.city}
                        </p>
                      </div>
                    )}
                  </div>

                  {}
                  <div>
                    <h4 className="font-bold text-gray-800 mb-3">Payment Method</h4>
                    <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                      <p className="font-medium text-gray-800">
                        {paymentMethods.find(method => method.id === paymentMethod)?.name}
                      </p>
                    </div>
                  </div>
                </Card>

                {}
                <Button
                  onClick={handlePlaceOrder}
                  disabled={isLoading || !canProceedToNext()}
                  className="w-full h-14 text-lg font-bold bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 rounded-xl shadow-lg"
                >
                  {isLoading ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Processing Payment...</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-5 h-5" />
                      <span>Place Order - ₹{getTotalAmount().toLocaleString()}</span>
                    </div>
                  )}
                </Button>
              </motion.div>
            )}
          </div>

          {}
          <div className="lg:col-span-1">
            <Card className="p-6 sticky top-6">
              <h3 className="text-lg font-bold text-gray-800 mb-6">Order Summary</h3>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal ({cartItems.length} items)</span>
                  <span className="font-medium">₹{getSubtotal().toLocaleString()}</span>
                </div>
                
                {getDiscount() > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount</span>
                    <span className="font-medium">-₹{getDiscount().toLocaleString()}</span>
                  </div>
                )}
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Delivery Charges</span>
                  <span className="font-medium">
                    {getDeliveryCharges() === 0 ? 'FREE' : `₹${getDeliveryCharges()}`}
                  </span>
                </div>
                
                <Separator />
                
                <div className="flex justify-between text-lg font-bold">
                  <span>Total Amount</span>
                  <span className="text-emerald-600">₹{getTotalAmount().toLocaleString()}</span>
                </div>
              </div>

              {}
              {currentStep !== 'review' && (
                <Button
                  onClick={() => setCurrentStep(getNextStep() as any)}
                  disabled={!canProceedToNext()}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 h-12 rounded-xl font-medium"
                >
                  Continue to {getNextStep().charAt(0).toUpperCase() + getNextStep().slice(1)}
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              )}

              {}
              <div className="mt-6 space-y-3">
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>100% Genuine Medicines</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Truck className="w-4 h-4 text-blue-500" />
                  <span>Fast & Secure Delivery</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Shield className="w-4 h-4 text-purple-500" />
                  <span>Prescription Verified</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>

      {}
      <AnimatePresence>
        {showAddAddress && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setShowAddAddress(false)}
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
                  <h3 className="text-xl font-bold text-gray-800">Add New Address</h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowAddAddress(false)}
                    className="w-8 h-8 p-0"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>

                <div className="space-y-4">
                  {}
                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-700">Address Type</label>
                    <div className="grid grid-cols-3 gap-3">
                      {(['home', 'work', 'other'] as const).map((type) => (
                        <Button
                          key={type}
                          variant={addressForm.type === type ? 'default' : 'outline'}
                          onClick={() => setAddressForm(prev => ({ ...prev, type }))}
                          className="justify-center"
                        >
                          {type === 'home' ? <Home className="w-4 h-4 mr-2" /> :
                           type === 'work' ? <Briefcase className="w-4 h-4 mr-2" /> :
                           <MapPin className="w-4 h-4 mr-2" />}
                          {type.charAt(0).toUpperCase() + type.slice(1)}
                        </Button>
                      ))}
                    </div>
                  </div>

                  {}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-700">Full Name *</label>
                      <Input
                        value={addressForm.fullName}
                        onChange={(e) => setAddressForm(prev => ({ ...prev, fullName: e.target.value }))}
                        placeholder="Enter full name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-700">Phone Number *</label>
                      <Input
                        value={addressForm.phoneNumber}
                        onChange={(e) => setAddressForm(prev => ({ ...prev, phoneNumber: e.target.value }))}
                        placeholder="+91 98765 43210"
                      />
                    </div>
                  </div>

                  {}
                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-700">Address Line 1 *</label>
                    <Input
                      value={addressForm.addressLine1}
                      onChange={(e) => setAddressForm(prev => ({ ...prev, addressLine1: e.target.value }))}
                      placeholder="House no, Building name, Area"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-700">Address Line 2</label>
                    <Input
                      value={addressForm.addressLine2}
                      onChange={(e) => setAddressForm(prev => ({ ...prev, addressLine2: e.target.value }))}
                      placeholder="Street, Locality (Optional)"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-700">City *</label>
                      <Input
                        value={addressForm.city}
                        onChange={(e) => setAddressForm(prev => ({ ...prev, city: e.target.value }))}
                        placeholder="City"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-700">State *</label>
                      <Input
                        value={addressForm.state}
                        onChange={(e) => setAddressForm(prev => ({ ...prev, state: e.target.value }))}
                        placeholder="State"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-700">PIN Code *</label>
                      <Input
                        value={addressForm.pinCode}
                        onChange={(e) => setAddressForm(prev => ({ ...prev, pinCode: e.target.value }))}
                        placeholder="147201"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-700">Landmark</label>
                    <Input
                      value={addressForm.landmark}
                      onChange={(e) => setAddressForm(prev => ({ ...prev, landmark: e.target.value }))}
                      placeholder="Near landmark (Optional)"
                    />
                  </div>

                  {}
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="isDefault"
                      checked={addressForm.isDefault}
                      onChange={(e) => setAddressForm(prev => ({ ...prev, isDefault: e.target.checked }))}
                      className="w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
                    />
                    <label htmlFor="isDefault" className="text-sm text-gray-700">
                      Make this my default address
                    </label>
                  </div>

                  {}
                  <div className="flex space-x-3 pt-4">
                    <Button
                      onClick={handleAddAddress}
                      className="flex-1 bg-emerald-600 hover:bg-emerald-700 h-12 rounded-xl font-medium"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Address
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setShowAddAddress(false)}
                      className="px-6 h-12 rounded-xl"
                    >
                      Cancel
                    </Button>
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