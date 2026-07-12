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
  CreditCard,
  Smartphone,
  Building,
  Wallet,
  Shield,
  CheckCircle,
  AlertCircle,
  Clock,
  Star,
  Lock,
  Eye,
  EyeOff,
  QrCode,
  RefreshCw,
  X,
  Zap,
  Award,
  Gift,
  DollarSign,
  Receipt,
  Download,
  Share2,
  Heart,
  Users,
  TrendingUp,
  Circle,
  ChevronDown,
  Info
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface PaymentMethod {
  id: string;
  type: 'wallet' | 'card' | 'upi' | 'netbanking';
  name: string;
  icon: any;
  description: string;
  enabled: boolean;
  recommended?: boolean;
  processingTime: string;
  fees: number;
  offers?: string;
}

interface SavedCard {
  id: string;
  cardNumber: string;
  cardType: 'visa' | 'mastercard' | 'rupay';
  expiryMonth: string;
  expiryYear: string;
  holderName: string;
  isDefault: boolean;
}

interface PaymentGatewayProps {
  amount: number;
  orderId: string;
  items: Array<{ name: string; quantity: number; price: number }>;
  onPaymentSuccess: (transactionId: string, paymentMethod: string) => void;
  onPaymentFailed: (error: string) => void;
  onBack: () => void;
  walletBalance: number;
}

export function PaymentGateway({ 
  amount, 
  orderId, 
  items = [], 
  onPaymentSuccess, 
  onPaymentFailed, 
  onBack,
  walletBalance 
}: PaymentGatewayProps) {
  const { t } = useLanguage();
  const [selectedMethod, setSelectedMethod] = useState<string>('wallet');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showCardForm, setShowCardForm] = useState(false);
  const [showUPIForm, setShowUPIForm] = useState(false);
  const [showNetBankingForm, setShowNetBankingForm] = useState(false);
  const [showSavedCards, setShowSavedCards] = useState(false);
  const [selectedCard, setSelectedCard] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [processingStage, setProcessingStage] = useState<'initializing' | 'processing' | 'verifying' | 'completing'>('initializing');

  
  const [cardForm, setCardForm] = useState({
    cardNumber: '',
    expiryMonth: '',
    expiryYear: '',
    cvv: '',
    holderName: '',
    saveCard: false
  });

  const [upiForm, setUpiForm] = useState({
    upiId: '',
    method: 'id' 
  });

  const [netBankingForm, setNetBankingForm] = useState({
    bank: '',
    userId: '',
    password: ''
  });

  const paymentMethods: PaymentMethod[] = [
    {
      id: 'wallet',
      type: 'wallet',
      name: 'Pharmacy Wallet',
      icon: Wallet,
      description: `Balance: ₹${walletBalance.toLocaleString()}`,
      enabled: walletBalance >= amount,
      recommended: walletBalance >= amount,
      processingTime: 'Instant',
      fees: 0,
      offers: walletBalance >= amount ? 'No processing fees' : undefined
    },
    {
      id: 'card',
      type: 'card',
      name: 'Credit/Debit Card',
      icon: CreditCard,
      description: 'Visa, Mastercard, RuPay accepted',
      enabled: true,
      processingTime: '2-3 minutes',
      fees: 0,
      offers: 'Get 2% cashback on first transaction'
    },
    {
      id: 'upi',
      type: 'upi',
      name: 'UPI Payment',
      icon: Smartphone,
      description: 'PhonePe, GPay, Paytm, BHIM',
      enabled: true,
      recommended: true,
      processingTime: 'Instant',
      fees: 0,
      offers: 'Zero fees, instant transfer'
    },
    {
      id: 'netbanking',
      type: 'netbanking',
      name: 'Net Banking',
      icon: Building,
      description: 'All major banks supported',
      enabled: true,
      processingTime: '3-5 minutes',
      fees: 0
    }
  ];

  const savedCards: SavedCard[] = [
    {
      id: 'card1',
      cardNumber: '•••• •••• •••• 1234',
      cardType: 'visa',
      expiryMonth: '12',
      expiryYear: '26',
      holderName: 'RAJINDER SINGH',
      isDefault: true
    },
    {
      id: 'card2',
      cardNumber: '•••• •••• •••• 5678',
      cardType: 'mastercard',
      expiryMonth: '09',
      expiryYear: '25',
      holderName: 'RAJINDER SINGH',
      isDefault: false
    }
  ];

  const banks = [
    { id: 'sbi', name: 'State Bank of India', logo: '🏦' },
    { id: 'hdfc', name: 'HDFC Bank', logo: '🏛️' },
    { id: 'icici', name: 'ICICI Bank', logo: '🏦' },
    { id: 'axis', name: 'Axis Bank', logo: '🏛️' },
    { id: 'pnb', name: 'Punjab National Bank', logo: '🏦' },
    { id: 'canara', name: 'Canara Bank', logo: '🏛️' }
  ];

  useEffect(() => {
    if (walletBalance >= amount) {
      setSelectedMethod('wallet');
    } else {
      setSelectedMethod('upi');
    }
  }, [amount, walletBalance]);

  const simulatePaymentProcess = async (method: string) => {
    setIsProcessing(true);
    
    try {
      
      setProcessingStage('initializing');
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      
      setProcessingStage('processing');
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      
      setProcessingStage('verifying');
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      
      setProcessingStage('completing');
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      
      const transactionId = `TXN${Date.now()}${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
      onPaymentSuccess(transactionId, method);
      
    } catch (error) {
      onPaymentFailed('Payment processing failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePayment = async () => {
    
    if (selectedMethod === 'wallet') {
      if (walletBalance < amount) {
        toast.error('Insufficient wallet balance');
        return;
      }
    } else if (selectedMethod === 'card') {
      if (!selectedCard && (!cardForm.cardNumber || !cardForm.cvv || !cardForm.holderName)) {
        toast.error('Please fill all card details');
        return;
      }
    } else if (selectedMethod === 'upi') {
      if (upiForm.method === 'id' && !upiForm.upiId) {
        toast.error('Please enter UPI ID');
        return;
      }
    } else if (selectedMethod === 'netbanking') {
      if (!netBankingForm.bank || !netBankingForm.userId || !netBankingForm.password) {
        toast.error('Please fill all banking details');
        return;
      }
    }

    await simulatePaymentProcess(selectedMethod);
  };

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  const getCardType = (number: string) => {
    const num = number.replace(/\s+/g, '');
    if (num.startsWith('4')) return 'visa';
    if (num.startsWith('5')) return 'mastercard';
    if (num.startsWith('6')) return 'rupay';
    return 'unknown';
  };

  const getProcessingMessage = () => {
    switch (processingStage) {
      case 'initializing': return 'Initializing secure payment...';
      case 'processing': return 'Processing your payment...';
      case 'verifying': return 'Verifying transaction...';
      case 'completing': return 'Completing payment...';
      default: return 'Processing...';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-blue-50 to-purple-50">
      {}
      <div className="bg-white/80 backdrop-blur-sm shadow-lg border-b border-emerald-100">
        <div className="flex items-center justify-between max-w-4xl mx-auto p-6">
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              size="sm"
              onClick={onBack}
              disabled={isProcessing}
              className="flex items-center space-x-2 hover:bg-emerald-50 border-emerald-200"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{t('back')}</span>
            </Button>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                Secure Payment
              </h1>
              <p className="text-gray-600">Order #{orderId}</p>
            </div>
          </div>
          
          <div className="text-right">
            <div className="text-sm text-gray-500">Total Amount</div>
            <div className="text-2xl font-bold text-emerald-600">₹{amount.toLocaleString()}</div>
          </div>
        </div>
      </div>

      <div className="p-6 max-w-4xl mx-auto">
        {}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center space-x-2 bg-green-50 border border-green-200 rounded-full px-6 py-3">
            <Shield className="w-5 h-5 text-green-600" />
            <span className="text-green-700 font-medium">256-bit SSL Encrypted</span>
            <Lock className="w-4 h-4 text-green-600" />
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Card className="p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-6">Choose Payment Method</h3>
                
                <div className="space-y-4 mb-6">
                  {paymentMethods.map((method) => (
                    <motion.div
                      key={method.id}
                      whileHover={{ scale: 1.02 }}
                      className={`p-4 border-2 rounded-xl cursor-pointer transition-all ${
                        selectedMethod === method.id
                          ? 'border-emerald-500 bg-emerald-50'
                          : method.enabled
                          ? 'border-gray-200 hover:border-emerald-300'
                          : 'border-gray-100 bg-gray-50 cursor-not-allowed opacity-50'
                      }`}
                      onClick={() => method.enabled && setSelectedMethod(method.id)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                            selectedMethod === method.id 
                              ? 'bg-emerald-500 text-white' 
                              : 'bg-gray-100 text-gray-600'
                          }`}>
                            <method.icon className="w-6 h-6" />
                          </div>
                          <div>
                            <h4 className="font-bold text-gray-800">{method.name}</h4>
                            <p className="text-sm text-gray-600">{method.description}</p>
                            <div className="flex items-center space-x-4 mt-1">
                              <span className="text-xs text-gray-500">⚡ {method.processingTime}</span>
                              {method.fees === 0 && (
                                <span className="text-xs text-green-600">💸 No fees</span>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          {method.recommended && (
                            <Badge variant="secondary" className="bg-blue-100 text-blue-700 text-xs">
                              Recommended
                            </Badge>
                          )}
                          {method.offers && (
                            <Badge variant="secondary" className="bg-orange-100 text-orange-700 text-xs">
                              Offer
                            </Badge>
                          )}
                          {selectedMethod === method.id && (
                            <CheckCircle className="w-5 h-5 text-emerald-500" />
                          )}
                        </div>
                      </div>
                      
                      {method.offers && selectedMethod === method.id && (
                        <div className="mt-3 p-2 bg-orange-50 border border-orange-200 rounded-lg">
                          <p className="text-xs text-orange-700">🎉 {method.offers}</p>
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>

                {}
                <AnimatePresence mode="wait">
                  {selectedMethod === 'card' && (
                    <motion.div
                      key="card-form"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-6"
                    >
                      {}
                      {savedCards.length > 0 && (
                        <div>
                          <h4 className="font-bold text-gray-800 mb-3">Saved Cards</h4>
                          <div className="grid gap-3">
                            {savedCards.map((card) => (
                              <motion.div
                                key={card.id}
                                whileHover={{ scale: 1.02 }}
                                className={`p-3 border-2 rounded-lg cursor-pointer transition-all ${
                                  selectedCard === card.id
                                    ? 'border-emerald-500 bg-emerald-50'
                                    : 'border-gray-200 hover:border-emerald-300'
                                }`}
                                onClick={() => setSelectedCard(card.id)}
                              >
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center space-x-3">
                                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                                      <CreditCard className="w-4 h-4 text-blue-600" />
                                    </div>
                                    <div>
                                      <div className="font-medium text-gray-800">{card.cardNumber}</div>
                                      <div className="text-sm text-gray-600">
                                        {card.cardType.toUpperCase()} • Expires {card.expiryMonth}/{card.expiryYear}
                                      </div>
                                    </div>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    {card.isDefault && (
                                      <Badge variant="secondary" className="bg-green-100 text-green-700 text-xs">
                                        Default
                                      </Badge>
                                    )}
                                    {selectedCard === card.id && (
                                      <CheckCircle className="w-4 h-4 text-emerald-500" />
                                    )}
                                  </div>
                                </div>
                              </motion.div>
                            ))}
                          </div>
                          
                          <div className="mt-4">
                            <Button
                              onClick={() => setShowCardForm(!showCardForm)}
                              variant="outline"
                              className="w-full border-emerald-200 hover:bg-emerald-50"
                            >
                              <CreditCard className="w-4 h-4 mr-2" />
                              Use New Card
                            </Button>
                          </div>
                        </div>
                      )}

                      {}
                      {(showCardForm || savedCards.length === 0) && (
                        <div className="space-y-4">
                          <h4 className="font-bold text-gray-800">Enter Card Details</h4>
                          
                          <div>
                            <label className="block text-sm font-medium mb-2 text-gray-700">Card Number</label>
                            <Input
                              value={cardForm.cardNumber}
                              onChange={(e) => setCardForm(prev => ({ 
                                ...prev, 
                                cardNumber: formatCardNumber(e.target.value) 
                              }))}
                              placeholder="1234 5678 9012 3456"
                              maxLength={19}
                              className="text-lg"
                            />
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium mb-2 text-gray-700">Expiry</label>
                              <div className="grid grid-cols-2 gap-2">
                                <Input
                                  value={cardForm.expiryMonth}
                                  onChange={(e) => setCardForm(prev => ({ ...prev, expiryMonth: e.target.value }))}
                                  placeholder="MM"
                                  maxLength={2}
                                />
                                <Input
                                  value={cardForm.expiryYear}
                                  onChange={(e) => setCardForm(prev => ({ ...prev, expiryYear: e.target.value }))}
                                  placeholder="YY"
                                  maxLength={2}
                                />
                              </div>
                            </div>
                            <div>
                              <label className="block text-sm font-medium mb-2 text-gray-700">CVV</label>
                              <div className="relative">
                                <Input
                                  type={showPassword ? 'text' : 'password'}
                                  value={cardForm.cvv}
                                  onChange={(e) => setCardForm(prev => ({ ...prev, cvv: e.target.value }))}
                                  placeholder="123"
                                  maxLength={4}
                                  className="pr-10"
                                />
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => setShowPassword(!showPassword)}
                                  className="absolute right-1 top-1 w-8 h-8 p-0"
                                >
                                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </Button>
                              </div>
                            </div>
                          </div>

                          <div>
                            <label className="block text-sm font-medium mb-2 text-gray-700">Cardholder Name</label>
                            <Input
                              value={cardForm.holderName}
                              onChange={(e) => setCardForm(prev => ({ ...prev, holderName: e.target.value.toUpperCase() }))}
                              placeholder="RAJINDER SINGH"
                            />
                          </div>

                          <div className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              id="saveCard"
                              checked={cardForm.saveCard}
                              onChange={(e) => setCardForm(prev => ({ ...prev, saveCard: e.target.checked }))}
                              className="w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
                            />
                            <label htmlFor="saveCard" className="text-sm text-gray-700">
                              Save this card for future purchases
                            </label>
                          </div>
                        </div>
                      )}
                    </motion.div>
                  )}

                  {selectedMethod === 'upi' && (
                    <motion.div
                      key="upi-form"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-6"
                    >
                      <div className="flex space-x-4">
                        <Button
                          variant={upiForm.method === 'id' ? 'default' : 'outline'}
                          onClick={() => setUpiForm(prev => ({ ...prev, method: 'id' }))}
                          className="flex-1"
                        >
                          UPI ID
                        </Button>
                        <Button
                          variant={upiForm.method === 'qr' ? 'default' : 'outline'}
                          onClick={() => setUpiForm(prev => ({ ...prev, method: 'qr' }))}
                          className="flex-1"
                        >
                          <QrCode className="w-4 h-4 mr-2" />
                          QR Code
                        </Button>
                      </div>

                      {upiForm.method === 'id' ? (
                        <div>
                          <label className="block text-sm font-medium mb-2 text-gray-700">UPI ID</label>
                          <Input
                            value={upiForm.upiId}
                            onChange={(e) => setUpiForm(prev => ({ ...prev, upiId: e.target.value }))}
                            placeholder="yourname@paytm"
                            className="text-lg"
                          />
                          <p className="text-xs text-gray-500 mt-1">
                            Enter your UPI ID (e.g., 9876543210@paytm, yourname@phonepe)
                          </p>
                        </div>
                      ) : (
                        <div className="text-center p-8 bg-gray-50 rounded-xl">
                          <div className="w-20 h-20 bg-gray-200 rounded-xl flex items-center justify-center mx-auto mb-4">
                            <QrCode className="w-10 h-10 text-gray-400" />
                          </div>
                          <h4 className="font-bold text-gray-800 mb-2">Scan QR Code</h4>
                          <p className="text-sm text-gray-600">
                            Open any UPI app and scan the QR code to complete payment
                          </p>
                        </div>
                      )}

                      {}
                      <div>
                        <h4 className="font-medium text-gray-700 mb-3">Popular UPI Apps</h4>
                        <div className="grid grid-cols-4 gap-3">
                          {['PhonePe', 'GPay', 'Paytm', 'BHIM'].map((app) => (
                            <div key={app} className="text-center p-3 bg-gray-50 rounded-lg">
                              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-1">
                                <Smartphone className="w-4 h-4 text-purple-600" />
                              </div>
                              <span className="text-xs font-medium text-gray-700">{app}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {selectedMethod === 'netbanking' && (
                    <motion.div
                      key="netbanking-form"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-6"
                    >
                      <div>
                        <label className="block text-sm font-medium mb-2 text-gray-700">Select Your Bank</label>
                        <div className="grid grid-cols-2 gap-3">
                          {banks.map((bank) => (
                            <motion.div
                              key={bank.id}
                              whileHover={{ scale: 1.02 }}
                              className={`p-3 border-2 rounded-lg cursor-pointer transition-all ${
                                netBankingForm.bank === bank.id
                                  ? 'border-emerald-500 bg-emerald-50'
                                  : 'border-gray-200 hover:border-emerald-300'
                              }`}
                              onClick={() => setNetBankingForm(prev => ({ ...prev, bank: bank.id }))}
                            >
                              <div className="flex items-center space-x-3">
                                <span className="text-xl">{bank.logo}</span>
                                <span className="font-medium text-gray-800 text-sm">{bank.name}</span>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </div>

                      {netBankingForm.bank && (
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium mb-2 text-gray-700">User ID</label>
                            <Input
                              value={netBankingForm.userId}
                              onChange={(e) => setNetBankingForm(prev => ({ ...prev, userId: e.target.value }))}
                              placeholder="Enter your user ID"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-2 text-gray-700">Password</label>
                            <div className="relative">
                              <Input
                                type={showPassword ? 'text' : 'password'}
                                value={netBankingForm.password}
                                onChange={(e) => setNetBankingForm(prev => ({ ...prev, password: e.target.value }))}
                                placeholder="Enter your password"
                                className="pr-10"
                              />
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-1 top-1 w-8 h-8 p-0"
                              >
                                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                              </Button>
                            </div>
                          </div>
                        </div>
                      )}
                    </motion.div>
                  )}

                  {selectedMethod === 'wallet' && (
                    <motion.div
                      key="wallet-form"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                      className="text-center p-8 bg-emerald-50 rounded-xl"
                    >
                      <div className="w-16 h-16 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Wallet className="w-8 h-8 text-white" />
                      </div>
                      <h4 className="text-lg font-bold text-gray-800 mb-2">Payment from Wallet</h4>
                      <p className="text-gray-600 mb-4">
                        ₹{amount.toLocaleString()} will be deducted from your wallet balance
                      </p>
                      <div className="text-sm text-emerald-700">
                        Remaining balance: ₹{(walletBalance - amount).toLocaleString()}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Card>
            </motion.div>
          </div>

          {}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="space-y-6"
            >
              {}
              <Card className="p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4">Order Summary</h3>
                
                <div className="space-y-3 mb-4">
                  {items && items.length > 0 ? (
                    items.map((item, index) => (
                      <div key={index} className="flex justify-between text-sm">
                        <span className="text-gray-600">{item.name} × {item.quantity}</span>
                        <span className="font-medium">₹{(item.price * item.quantity).toLocaleString()}</span>
                      </div>
                    ))
                  ) : (
                    <div className="text-center text-gray-500 text-sm py-4">
                      No items to display
                    </div>
                  )}
                </div>
                
                <Separator className="my-4" />
                
                <div className="flex justify-between text-lg font-bold">
                  <span>Total Amount</span>
                  <span className="text-emerald-600">₹{amount.toLocaleString()}</span>
                </div>

                <div className="mt-6">
                  <Button
                    onClick={handlePayment}
                    disabled={isProcessing || (selectedMethod === 'wallet' && walletBalance < amount)}
                    className="w-full h-12 bg-emerald-600 hover:bg-emerald-700 rounded-xl font-medium text-lg"
                  >
                    {isProcessing ? (
                      <div className="flex items-center space-x-2">
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Processing...</span>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <Lock className="w-4 h-4" />
                        <span>Pay ₹{amount.toLocaleString()}</span>
                      </div>
                    )}
                  </Button>
                </div>
              </Card>

              {}
              <Card className="p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4">Security Features</h3>
                
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Shield className="w-5 h-5 text-green-600" />
                    <span className="text-sm text-gray-700">256-bit SSL Encryption</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Lock className="w-5 h-5 text-blue-600" />
                    <span className="text-sm text-gray-700">PCI DSS Compliant</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-emerald-600" />
                    <span className="text-sm text-gray-700">100% Secure Payments</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Award className="w-5 h-5 text-purple-600" />
                    <span className="text-sm text-gray-700">Trusted by 1M+ users</span>
                  </div>
                </div>
              </Card>

              {}
              <Card className="p-6 bg-blue-50 border-blue-200">
                <div className="text-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Users className="w-6 h-6 text-blue-600" />
                  </div>
                  <h4 className="font-bold text-blue-800 mb-2">Need Help?</h4>
                  <p className="text-sm text-blue-700 mb-4">
                    Our support team is available 24/7 to assist you
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-blue-300 text-blue-700 hover:bg-blue-100"
                  >
                    Contact Support
                  </Button>
                </div>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>

      {}
      <AnimatePresence>
        {isProcessing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl max-w-md w-full mx-4 p-8 text-center"
            >
              <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                >
                  <RefreshCw className="w-10 h-10 text-emerald-600" />
                </motion.div>
              </div>
              
              <h3 className="text-xl font-bold text-gray-800 mb-2">Processing Payment</h3>
              <p className="text-gray-600 mb-6">{getProcessingMessage()}</p>
              
              {}
              <div className="space-y-3">
                {['initializing', 'processing', 'verifying', 'completing'].map((stage, index) => (
                  <div key={stage} className="flex items-center space-x-3">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                      processingStage === stage 
                        ? 'bg-emerald-500 text-white' 
                        : index < ['initializing', 'processing', 'verifying', 'completing'].indexOf(processingStage)
                        ? 'bg-emerald-500 text-white'
                        : 'bg-gray-200 text-gray-400'
                    }`}>
                      {processingStage === stage ? (
                        <motion.div
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 1, repeat: Infinity }}
                        >
                          <Circle className="w-3 h-3 fill-current" />
                        </motion.div>
                      ) : (
                        <Circle className="w-3 h-3 fill-current" />
                      )}
                    </div>
                    <span className={`text-sm ${
                      processingStage === stage ? 'text-emerald-600 font-medium' : 'text-gray-500'
                    }`}>
                      {stage.charAt(0).toUpperCase() + stage.slice(1)}
                    </span>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 text-xs text-gray-500">
                Please do not close this window or press back button
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}