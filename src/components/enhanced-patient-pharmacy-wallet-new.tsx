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
  Wallet, 
  Plus, 
  ShoppingCart, 
  History, 
  Download,
  AlertCircle,
  CheckCircle,
  Search,
  Filter,
  Calendar,
  TrendingUp,
  TrendingDown,
  Star,
  Gift,
  Bell,
  Heart,
  Sparkles,
  Target,
  Award,
  PieChart,
  BarChart3,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  RefreshCw,
  Pill,
  Activity,
  CreditCard,
  Receipt,
  Eye,
  DollarSign,
  Banknote,
  CircleDot,
  ChevronRight,
  Shield,
  Zap,
  MapPin,
  Users,
  Package,
  Truck,
  FileText,
  Settings,
  Info,
  X,
  FilterX,
  Upload,
  Camera,
  Minus,
  Repeat,
  ThumbsUp,
  Phone,
  Navigation,
  Play,
  Pause,
  RotateCcw
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { EnhancedPharmacyCheckout } from './enhanced-pharmacy-checkout';
import { DeliveryTracking } from './delivery-tracking';
import { PrescriptionUpload } from './prescription-upload';
import { PaymentGateway } from './payment-gateway';

interface Medicine {
  id: string;
  name: string;
  genericName: string;
  price: number;
  dosage: string;
  manufacturer: string;
  category: string;
  stock: number;
  expiryDate: string;
  prescriptionRequired: boolean;
  description: string;
  discount?: number;
  rating?: number;
  reviews?: number;
}

interface CartItem {
  medicine: Medicine;
  quantity: number;
}

interface Transaction {
  id: string;
  medicineId: string;
  medicineName: string;
  quantity: number;
  price: number;
  totalAmount: number;
  date: string;
  time: string;
  category: string;
  status: 'completed' | 'processing' | 'cancelled' | 'delivered' | 'shipped';
  paymentMethod: 'wallet' | 'card' | 'upi' | 'netbanking';
  prescriptionId?: string;
  savings?: number;
  deliveryStatus?: 'delivered' | 'in-transit' | 'pending' | 'out-for-delivery';
  orderId?: string;
  transactionId?: string;
}

interface EnhancedPatientPharmacyWalletProps {
  onBack: () => void;
}

export function EnhancedPatientPharmacyWallet({ onBack }: EnhancedPatientPharmacyWalletProps) {
  const { t } = useLanguage();
  const [walletBalance, setWalletBalance] = useState(1250); 
  const [showAddMoney, setShowAddMoney] = useState(false);
  const [addAmount, setAddAmount] = useState('');
  const [activeTab, setActiveTab] = useState<'medicines' | 'cart' | 'history' | 'statement' | 'prescriptions'>('medicines');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [dateFilter, setDateFilter] = useState('all');
  const [amountFilter, setAmountFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  
  
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'compact'>('grid');
  const [sortBy, setSortBy] = useState<'name' | 'price-low' | 'price-high' | 'rating' | 'popularity'>('popularity');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [showPrescriptionOnly, setShowPrescriptionOnly] = useState(false);
  const [showInStockOnly, setShowInStockOnly] = useState(false);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [loyaltyPoints, setLoyaltyPoints] = useState(245);
  const [currentStreak, setCurrentStreak] = useState(7);
  const [monthlySpendingGoal] = useState(2000);
  
  
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showCheckout, setShowCheckout] = useState(false);
  const [showPaymentGateway, setShowPaymentGateway] = useState(false);
  const [showDeliveryTracking, setShowDeliveryTracking] = useState(false);
  const [showPrescriptionUpload, setShowPrescriptionUpload] = useState(false);
  const [trackingOrderId, setTrackingOrderId] = useState<string | null>(null);
  const [checkoutOrder, setCheckoutOrder] = useState<{orderId: string, amount: number, items: any[]} | null>(null);
  
  
  const [balanceAnimation, setBalanceAnimation] = useState(false);
  const [recentPurchase, setRecentPurchase] = useState<string | null>(null);

  
  const [medicines] = useState<Medicine[]>([
    
    {
      id: 'med001',
      name: 'Paracetamol',
      genericName: 'Acetaminophen',
      price: 45,
      dosage: '500mg',
      manufacturer: 'Cipla',
      category: 'pain-relief',
      stock: 150,
      expiryDate: '2025-12-15',
      prescriptionRequired: false,
      description: 'For fever and mild to moderate pain relief',
      discount: 10,
      rating: 4.5,
      reviews: 2847
    },
    {
      id: 'med002',
      name: 'Ibuprofen',
      genericName: 'Ibuprofen',
      price: 65,
      dosage: '400mg',
      manufacturer: 'Sun Pharma',
      category: 'pain-relief',
      stock: 89,
      expiryDate: '2025-10-20',
      prescriptionRequired: false,
      description: 'Anti-inflammatory pain reliever',
      rating: 4.3,
      reviews: 1523
    },
    {
      id: 'med003',
      name: 'Aspirin',
      genericName: 'Acetylsalicylic Acid',
      price: 35,
      dosage: '325mg',
      manufacturer: 'Bayer',
      category: 'pain-relief',
      stock: 200,
      expiryDate: '2025-11-30',
      prescriptionRequired: false,
      description: 'Pain relief and blood thinner',
      discount: 5,
      rating: 4.2,
      reviews: 986
    },
    
    {
      id: 'med004',
      name: 'Crocin Cold & Flu',
      genericName: 'Paracetamol + Phenylephrine',
      price: 85,
      dosage: '10 tablets',
      manufacturer: 'GSK',
      category: 'cold-cough',
      stock: 75,
      expiryDate: '2025-09-15',
      prescriptionRequired: false,
      description: 'Relief from cold and flu symptoms',
      discount: 15,
      rating: 4.4,
      reviews: 1876
    }
  ]);

  const [transactions, setTransactions] = useState<Transaction[]>([
    {
      id: 'txn001',
      medicineId: 'med001',
      medicineName: 'Paracetamol 500mg',
      quantity: 2,
      price: 45,
      totalAmount: 90,
      date: '2024-01-15',
      time: '14:30',
      category: 'pain-relief',
      status: 'delivered',
      paymentMethod: 'wallet',
      savings: 5,
      deliveryStatus: 'delivered',
      orderId: 'ORD001',
      transactionId: 'TXN1234567890'
    },
    {
      id: 'txn002',
      medicineId: 'med004',
      medicineName: 'Crocin Cold & Flu',
      quantity: 1,
      price: 85,
      totalAmount: 85,
      date: '2024-01-12',
      time: '16:20',
      category: 'cold-cough',
      status: 'shipped',
      paymentMethod: 'card',
      savings: 10,
      deliveryStatus: 'in-transit',
      orderId: 'ORD002',
      transactionId: 'TXN1234567891'
    }
  ]);

  const categories = [
    { id: 'all', name: 'All Medicines', icon: '💊' },
    { id: 'pain-relief', name: 'Pain Relief', icon: '🩹' },
    { id: 'cold-cough', name: 'Cold & Cough', icon: '🤧' },
    { id: 'antibiotics', name: 'Antibiotics', icon: '🦠' },
    { id: 'digestive', name: 'Digestive', icon: '💊' },
    { id: 'vitamins', name: 'Vitamins', icon: '🍃' },
    { id: 'skincare', name: 'Skin Care', icon: '🧴' },
    { id: 'diabetes', name: 'Diabetes', icon: '🩸' },
    { id: 'heart', name: 'Heart Health', icon: '❤️' },
    { id: 'periods', name: 'Period Care', icon: '🌸' },
    { id: 'pregnancy', name: 'Pregnancy Care', icon: '🤱' }
  ];

  
  const uniqueBrands = [...new Set(medicines.map(med => med.manufacturer))].sort();

  
  const filteredAndSortedMedicines = medicines
    .filter(medicine => {
      const matchesSearch = medicine.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           medicine.genericName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           medicine.manufacturer.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCategory = selectedCategory === 'all' || medicine.category === selectedCategory;
      const matchesPrice = medicine.price >= priceRange[0] && medicine.price <= priceRange[1];
      const matchesPrescription = !showPrescriptionOnly || medicine.prescriptionRequired;
      const matchesStock = !showInStockOnly || medicine.stock > 0;
      const matchesBrand = selectedBrands.length === 0 || selectedBrands.includes(medicine.manufacturer);
      
      return matchesSearch && matchesCategory && matchesPrice && matchesPrescription && matchesStock && matchesBrand;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'rating':
          return (b.rating || 0) - (a.rating || 0);
        case 'popularity':
          return (b.reviews || 0) - (a.reviews || 0);
        default:
          return 0;
      }
    });

  
  return (
    <div className=\"min-h-screen bg-gradient-to-br from-emerald-50/50 via-blue-50/30 to-purple-50/20 backdrop-blur-sm\">
      {}
      <AnimatePresence>
        {showCelebration && (
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            className=\"fixed inset-0 z-50 flex items-center justify-center pointer-events-none\"
          >
            <div className=\"text-6xl animate-bounce\">🎉✨💰</div>
            {}
            <div className=\"absolute inset-0\">
              {[...Array(50)].map((_, i) => (
                <motion.div
                  key={i}
                  className=\"absolute w-2 h-2 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full\"
                  initial={{
                    x: Math.random() * window.innerWidth,
                    y: -10,
                    opacity: 1,
                    scale: Math.random() * 0.5 + 0.5
                  }}
                  animate={{
                    y: window.innerHeight + 10,
                    rotate: Math.random() * 360,
                    opacity: 0
                  }}
                  transition={{
                    duration: Math.random() * 2 + 1,
                    ease: "easeOut"
                  }}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {}
      <AnimatePresence>
        {showAddMoney && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className=\"fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-lg\"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className=\"bg-white/95 backdrop-blur-xl rounded-3xl p-8 max-w-md w-full mx-4 shadow-2xl border border-white/50\"
            >
              <div className=\"text-center mb-8\">
                <motion.div 
                  className=\"w-20 h-20 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-2xl\"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                >
                  <motion.div
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  >
                    <Wallet className=\"w-10 h-10 text-white\" />
                  </motion.div>
                </motion.div>
                <h3 className=\"text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-2\">Add Money to Wallet</h3>
                <p className=\"text-gray-600\">Current Balance: ₹{walletBalance.toLocaleString()}</p>
              </div>

              <div className=\"space-y-6\">
                <div>
                  <label className=\"block text-sm font-medium text-gray-700 mb-2\">
                    Enter Amount
                  </label>
                  <Input
                    type=\"number\"
                    placeholder=\"Enter amount (min ₹100)\"
                    value={addAmount}
                    onChange={(e) => setAddAmount(e.target.value)}
                    className=\"text-center text-lg h-14 border-2 border-emerald-200 focus:border-emerald-400 rounded-2xl\"
                  />
                </div>

                {}
                <div className=\"grid grid-cols-3 gap-3\">
                  {[500, 1000, 2000, 5000, 10000, 15000].map(amount => (
                    <motion.div key={amount} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button
                        variant=\"outline\"
                        onClick={() => setAddAmount(amount.toString())}
                        className=\"py-3 hover:bg-emerald-50 border-emerald-200 rounded-2xl transition-all duration-200\"
                      >
                        ₹{amount.toLocaleString()}
                      </Button>
                    </motion.div>
                  ))}
                </div>

                {}
                <div className=\"bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl p-6 border border-emerald-200\">
                  <h4 className=\"font-semibold text-emerald-800 mb-4 flex items-center\">
                    <Sparkles className=\"w-5 h-5 mr-2\" />
                    Wallet Benefits
                  </h4>
                  <div className=\"space-y-3 text-sm text-emerald-700\">
                    <div className=\"flex items-center space-x-3\">
                      <CheckCircle className=\"w-4 h-4\" />
                      <span>Instant payments during checkout</span>
                    </div>
                    <div className=\"flex items-center space-x-3\">
                      <CheckCircle className=\"w-4 h-4\" />
                      <span>Extra 2% cashback on all purchases</span>
                    </div>
                    <div className=\"flex items-center space-x-3\">
                      <CheckCircle className=\"w-4 h-4\" />
                      <span>Priority customer support</span>
                    </div>
                  </div>
                </div>

                {}
                <div className=\"flex space-x-4\">
                  <Button
                    variant=\"outline\"
                    onClick={() => {
                      setShowAddMoney(false);
                      setAddAmount('');
                    }}
                    className=\"flex-1 h-12 rounded-2xl\"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={() => {
                      const amount = parseInt(addAmount);
                      if (amount >= 100) {
                        setWalletBalance(prev => prev + amount);
                        setShowAddMoney(false);
                        setAddAmount('');
                        setShowCelebration(true);
                        setBalanceAnimation(true);
                        setTimeout(() => {
                          setShowCelebration(false);
                          setBalanceAnimation(false);
                        }, 3000);
                        toast.success(`🎉 ₹${amount.toLocaleString()} added to your wallet successfully!`);
                      } else {
                        toast.error('Minimum amount is ₹100');
                      }
                    }}
                    disabled={!addAmount || parseInt(addAmount) < 100}
                    className=\"flex-1 h-12 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 rounded-2xl\"
                  >
                    <DollarSign className=\"w-4 h-4 mr-2\" />
                    Add Money
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {}
      <div className=\"bg-white/80 backdrop-blur-xl shadow-xl border-b border-emerald-100/50\">
        <div className=\"flex items-center justify-between max-w-7xl mx-auto p-6\">
          <div className=\"flex items-center space-x-4\">
            <Button
              variant=\"outline\"
              size=\"sm\"
              onClick={onBack}
              className=\"flex items-center space-x-2 hover:bg-emerald-50 border-emerald-200 rounded-2xl\"
            >
              <ArrowLeft className=\"w-4 h-4\" />
              <span>{t('back')}</span>
            </Button>
            <div className=\"flex items-center space-x-4\">
              <motion.div 
                className=\"w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-3xl flex items-center justify-center shadow-2xl\"
                whileHover={{ scale: 1.05, rotate: 5 }}
                whileTap={{ scale: 0.95 }}
              >
                <motion.div
                  animate={{ 
                    rotate: [0, 5, -5, 0],
                    scale: [1, 1.05, 1]
                  }}
                  transition={{ 
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  <Wallet className=\"w-8 h-8 text-white\" />
                </motion.div>
              </motion.div>
              <div>
                <h1 className=\"text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent\">
                  {t('pharmacyWallet')}
                </h1>
                <div className=\"flex items-center space-x-3\">
                  <p className=\"text-gray-600\">{t('availableBalance')}: ₹{walletBalance.toLocaleString()}</p>
                  <Badge className=\"bg-emerald-100 text-emerald-700 border border-emerald-200\">
                    <Star className=\"w-3 h-3 mr-1\" />
                    {loyaltyPoints} points
                  </Badge>
                </div>
              </div>
            </div>
          </div>
          
          {}
          <div className=\"flex items-center space-x-4\">
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                onClick={() => setShowAddMoney(true)}
                className=\"bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white rounded-2xl px-6 py-3 shadow-lg\"
              >
                <Plus className=\"w-4 h-4 mr-2\" />
                Add Money
              </Button>
            </motion.div>
            
            <Button
              onClick={() => setShowPrescriptionUpload(true)}
              variant=\"outline\"
              className=\"border-purple-200 hover:bg-purple-50 rounded-2xl px-6 py-3\"
            >
              <Upload className=\"w-4 h-4 mr-2\" />
              Upload Prescription
            </Button>
            
            <Button
              onClick={() => setActiveTab('cart')}
              variant=\"outline\"
              className=\"border-emerald-200 hover:bg-emerald-50 relative rounded-2xl px-6 py-3\"
            >
              <ShoppingCart className=\"w-4 h-4 mr-2\" />
              Cart
              {cart.length > 0 && (
                <Badge className=\"absolute -top-2 -right-2 bg-red-500 text-white text-xs w-6 h-6 rounded-full flex items-center justify-center\">
                  {cart.length}
                </Badge>
              )}
            </Button>
          </div>
        </div>
      </div>

      <div className=\"p-6 max-w-7xl mx-auto space-y-8\">
        {}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className=\"relative overflow-hidden\"
        >
          <Card className=\"relative p-10 bg-gradient-to-br from-white/90 via-emerald-50/70 to-teal-50/70 backdrop-blur-2xl border border-white/60 shadow-2xl rounded-3xl\">
            {}
            <div className=\"absolute top-0 right-0 w-80 h-80 bg-gradient-to-br from-emerald-300/20 to-teal-300/20 rounded-full -translate-y-40 translate-x-40\"></div>
            <div className=\"absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-blue-300/20 to-purple-300/20 rounded-full translate-y-32 -translate-x-32\"></div>
            <div className=\"absolute top-1/2 left-1/2 w-32 h-32 bg-gradient-to-r from-emerald-200/10 to-teal-200/10 rounded-full animate-pulse\"></div>
            
            <div className=\"relative z-10 flex flex-col lg:flex-row items-center justify-between space-y-8 lg:space-y-0\">
              {}
              <div className=\"flex items-center space-x-8\">
                <motion.div
                  className=\"relative\"
                  whileHover={{ scale: 1.15, rotate: 10 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  <div className=\"w-28 h-28 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-3xl flex items-center justify-center shadow-2xl\">
                    <motion.div
                      animate={{ 
                        rotate: [0, 8, -8, 0],
                        scale: [1, 1.1, 1]
                      }}
                      transition={{ 
                        duration: 4,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    >
                      <Wallet className=\"w-14 h-14 text-white\" />
                    </motion.div>
                  </div>
                  {}
                  <div className=\"absolute inset-0 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-3xl opacity-40 blur-2xl animate-pulse\"></div>
                  <div className=\"absolute inset-0 bg-gradient-to-br from-emerald-300 to-teal-400 rounded-3xl opacity-20 blur-3xl\"></div>
                </motion.div>
                
                <div className=\"space-y-3\">
                  <p className=\"text-lg font-semibold text-gray-700\">Available Balance</p>
                  <motion.div 
                    className=\"flex items-center space-x-3\"
                    animate={balanceAnimation ? { scale: [1, 1.15, 1] } : {}}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                  >
                    <h2 className=\"text-5xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent\">
                      ₹{walletBalance.toLocaleString()}
                    </h2>
                    <motion.div
                      animate={{ 
                        scale: [1, 1.3, 1],
                        rotate: [0, 180, 360]
                      }}
                      transition={{ duration: 3, repeat: Infinity }}
                    >
                      <Sparkles className=\"w-8 h-8 text-emerald-500\" />
                    </motion.div>
                  </motion.div>
                  <div className=\"flex items-center space-x-4\">
                    <Badge className=\"bg-emerald-100 text-emerald-700 border border-emerald-300 px-3 py-1 rounded-2xl\">
                      <Star className=\"w-4 h-4 mr-1\" />
                      {loyaltyPoints} points
                    </Badge>
                    <Badge className=\"bg-blue-100 text-blue-700 border border-blue-300 px-3 py-1 rounded-2xl\">
                      <Target className=\"w-4 h-4 mr-1\" />
                      {currentStreak} day streak
                    </Badge>
                    <Badge className=\"bg-purple-100 text-purple-700 border border-purple-300 px-3 py-1 rounded-2xl\">
                      <Award className=\"w-4 h-4 mr-1\" />
                      Premium
                    </Badge>
                  </div>
                </div>
              </div>

              {}
              <div className=\"flex flex-col space-y-6\">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    onClick={() => setShowAddMoney(true)}
                    className=\"relative overflow-hidden bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white px-10 py-5 rounded-3xl shadow-2xl font-bold text-xl transition-all duration-300 group\"
                  >
                    {}
                    <div className=\"absolute inset-0 bg-gradient-to-r from-emerald-400 to-teal-500 opacity-0 group-hover:opacity-40 transition-opacity duration-300 rounded-3xl blur-2xl\"></div>
                    <div className=\"relative flex items-center space-x-3\">
                      <motion.div
                        animate={{ rotate: [0, 360] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                      >
                        <Plus className=\"w-6 h-6\" />
                      </motion.div>
                      <span>Add Money</span>
                      <Sparkles className=\"w-5 h-5\" />
                    </div>
                    {}
                    <div className=\"absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000\"></div>
                  </Button>
                </motion.div>

                {}
                <div className=\"grid grid-cols-2 gap-6\">
                  <motion.div 
                    className=\"bg-white/80 backdrop-blur-xl rounded-2xl p-6 border border-white/60 shadow-xl\"
                    whileHover={{ scale: 1.05, y: -5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <div className=\"flex items-center space-x-3 mb-2\">
                      <div className=\"w-10 h-10 bg-gradient-to-r from-green-400 to-emerald-500 rounded-2xl flex items-center justify-center\">
                        <TrendingUp className=\"w-5 h-5 text-white\" />
                      </div>
                      <span className=\"text-sm font-medium text-gray-600\">This Month</span>
                    </div>
                    <p className=\"text-2xl font-bold text-gray-800\">₹{transactions.filter(t => new Date(t.date).getMonth() === new Date().getMonth()).reduce((sum, t) => sum + t.totalAmount, 0).toLocaleString()}</p>
                  </motion.div>
                  <motion.div 
                    className=\"bg-white/80 backdrop-blur-xl rounded-2xl p-6 border border-white/60 shadow-xl\"
                    whileHover={{ scale: 1.05, y: -5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <div className=\"flex items-center space-x-3 mb-2\">
                      <div className=\"w-10 h-10 bg-gradient-to-r from-purple-400 to-pink-500 rounded-2xl flex items-center justify-center\">
                        <Gift className=\"w-5 h-5 text-white\" />
                      </div>
                      <span className=\"text-sm font-medium text-gray-600\">Total Saved</span>
                    </div>
                    <p className=\"text-2xl font-bold text-gray-800\">₹{transactions.reduce((sum, t) => sum + (t.savings || 0), 0).toLocaleString()}</p>
                  </motion.div>
                </div>
              </div>
            </div>

            {}
            <div className=\"relative z-10 mt-8 pt-8 border-t border-white/40\">
              <div className=\"flex items-center justify-between mb-4\">
                <span className=\"text-lg font-semibold text-gray-700\">Monthly Spending Goal</span>
                <span className=\"text-lg text-gray-600 font-medium\">
                  ₹{transactions.filter(t => new Date(t.date).getMonth() === new Date().getMonth()).reduce((sum, t) => sum + t.totalAmount, 0).toLocaleString()} / ₹{monthlySpendingGoal.toLocaleString()}
                </span>
              </div>
              <div className=\"relative h-4 bg-white/60 rounded-full overflow-hidden shadow-inner\">
                <motion.div
                  className=\"h-full bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 rounded-full shadow-lg\"
                  initial={{ width: 0 }}
                  animate={{ 
                    width: `${Math.min((transactions.filter(t => new Date(t.date).getMonth() === new Date().getMonth()).reduce((sum, t) => sum + t.totalAmount, 0) / monthlySpendingGoal) * 100, 100)}%` 
                  }}
                  transition={{ duration: 2, ease: "easeOut" }}
                />
                <div className=\"absolute inset-0 bg-gradient-to-r from-emerald-300/40 to-teal-300/40 animate-pulse\"></div>
                {}
                <motion.div
                  className=\"absolute top-1/2 transform -translate-y-1/2 w-4 h-4 bg-white rounded-full shadow-lg border-2 border-emerald-500\"
                  initial={{ left: '0%' }}
                  animate={{ 
                    left: `${Math.min((transactions.filter(t => new Date(t.date).getMonth() === new Date().getMonth()).reduce((sum, t) => sum + t.totalAmount, 0) / monthlySpendingGoal) * 100, 100)}%` 
                  }}
                  transition={{ duration: 2, ease: "easeOut" }}
                  style={{ marginLeft: '-8px' }}
                />
              </div>
              <div className=\"flex justify-between mt-2 text-sm text-gray-600\">
                <span>₹0</span>
                <span>₹{monthlySpendingGoal.toLocaleString()}</span>
              </div>
            </div>
          </Card>
        </motion.div>

        {}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className=\"bg-white/90 backdrop-blur-2xl rounded-3xl p-3 shadow-2xl border border-white/60\"
        >
          <div className=\"grid grid-cols-5 gap-3\">
            {[
              { id: 'medicines', icon: Pill, label: t('medicines'), badge: filteredAndSortedMedicines.length },
              { id: 'cart', icon: ShoppingCart, label: 'Cart', badge: cart.length },
              { id: 'history', icon: History, label: t('purchaseHistory'), badge: transactions.length },
              { id: 'statement', icon: Download, label: t('monthlyStatement'), badge: null },
              { id: 'prescriptions', icon: FileText, label: 'Prescriptions', badge: null }
            ].map((tab) => (
              <motion.div key={tab.id} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <Button
                  variant=\"ghost\"
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`w-full h-20 rounded-2xl transition-all duration-300 ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-xl'
                      : 'hover:bg-emerald-50 text-gray-600 hover:shadow-lg'
                  }`}
                >
                  <div className=\"flex flex-col items-center space-y-2\">
                    <div className=\"flex items-center space-x-2\">
                      <tab.icon className=\"w-6 h-6\" />
                      {tab.badge !== null && tab.badge > 0 && (
                        <Badge className={`text-xs ${
                          activeTab === tab.id ? 'bg-white/20 text-white' : 'bg-emerald-100 text-emerald-700'
                        }`}>
                          {tab.badge}
                        </Badge>
                      )}
                    </div>
                    <span className=\"text-sm font-medium\">{tab.label}</span>
                  </div>
                </Button>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {}
        {activeTab === 'medicines' && (
          <div className=\"space-y-8\">
            {}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card className=\"p-6 bg-gradient-to-r from-white/90 via-blue-50/60 to-purple-50/60 backdrop-blur-xl border border-white/60 shadow-xl rounded-3xl\">
                <div className=\"flex items-center justify-between mb-6\">
                  <div className=\"flex items-center space-x-3\">
                    <div className=\"w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center\">
                      <Repeat className=\"w-6 h-6 text-white\" />
                    </div>
                    <div>
                      <h3 className=\"text-xl font-bold text-gray-800\">Quick Reorder</h3>
                      <p className=\"text-sm text-gray-600\">Reorder your recent medicines with one click</p>
                    </div>
                  </div>
                  <Button
                    variant=\"outline\"
                    className=\"border-blue-200 hover:bg-blue-50 rounded-2xl\"
                  >
                    View All
                  </Button>
                </div>
                
                <div className=\"grid grid-cols-1 md:grid-cols-3 gap-4\">
                  {transactions.slice(0, 3).map((transaction) => (
                    <motion.div
                      key={transaction.id}
                      className=\"bg-white/80 backdrop-blur-sm rounded-2xl p-4 border border-white/50 hover:shadow-lg transition-all duration-300\"
                      whileHover={{ scale: 1.02, y: -2 }}
                    >
                      <div className=\"flex items-center justify-between mb-3\">
                        <h4 className=\"font-semibold text-gray-800\">{transaction.medicineName}</h4>
                        <Badge className=\"bg-emerald-100 text-emerald-700\">₹{transaction.price}</Badge>
                      </div>
                      <div className=\"flex items-center justify-between\">
                        <span className=\"text-sm text-gray-600\">Last ordered: {transaction.date}</span>
                        <Button
                          size=\"sm\"
                          className=\"bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white rounded-xl\"
                          onClick={() => {
                            toast.success('🛒 Added to cart!');
                          }}
                        >
                          <Plus className=\"w-4 h-4 mr-1\" />
                          Reorder
                        </Button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </Card>
            </motion.div>

            {}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Card className=\"p-6 bg-gradient-to-r from-white/90 via-green-50/60 to-emerald-50/60 backdrop-blur-xl border border-white/60 shadow-xl rounded-3xl\">
                <div className=\"flex items-center justify-between mb-6\">
                  <div className=\"flex items-center space-x-3\">
                    <div className=\"w-12 h-12 bg-gradient-to-r from-emerald-500 to-green-500 rounded-2xl flex items-center justify-center\">
                      <ThumbsUp className=\"w-6 h-6 text-white\" />
                    </div>
                    <div>
                      <h3 className=\"text-xl font-bold text-gray-800\">Recommended for You</h3>
                      <p className=\"text-sm text-gray-600\">AI suggestions based on your purchase history</p>
                    </div>
                  </div>
                  <Badge className=\"bg-emerald-100 text-emerald-700 border border-emerald-200\">
                    <Sparkles className=\"w-3 h-3 mr-1\" />
                    AI Powered
                  </Badge>
                </div>
                
                <div className=\"grid grid-cols-1 md:grid-cols-4 gap-4\">
                  {medicines.slice(0, 4).map((medicine) => (
                    <motion.div
                      key={medicine.id}
                      className=\"bg-white/80 backdrop-blur-sm rounded-2xl p-4 border border-white/50 hover:shadow-lg transition-all duration-300 group\"
                      whileHover={{ scale: 1.03, y: -5 }}
                    >
                      <div className=\"text-center mb-3\">
                        <div className=\"w-16 h-16 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-2xl flex items-center justify-center mx-auto mb-3\">
                          <Pill className=\"w-8 h-8 text-emerald-600\" />
                        </div>
                        <h4 className=\"font-semibold text-gray-800 mb-1\">{medicine.name}</h4>
                        <p className=\"text-xs text-gray-600 mb-2\">{medicine.manufacturer}</p>
                        <div className=\"flex items-center justify-center space-x-2\">
                          <Badge className=\"bg-emerald-100 text-emerald-700 text-xs\">₹{medicine.price}</Badge>
                          {medicine.discount && (
                            <Badge className=\"bg-red-100 text-red-700 text-xs\">{medicine.discount}% OFF</Badge>
                          )}
                        </div>
                      </div>
                      <Button
                        size=\"sm\"
                        className=\"w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-300\"
                        onClick={() => {
                          toast.success('🛒 Added to cart!');
                        }}
                      >
                        <Plus className=\"w-4 h-4 mr-1\" />
                        Add to Cart
                      </Button>
                    </motion.div>
                  ))}
                </div>
              </Card>
            </motion.div>

            {}
            <div className=\"grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6\">
              {filteredAndSortedMedicines.map((medicine) => (
                <motion.div
                  key={medicine.id}
                  className=\"group\"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ 
                    scale: 1.05, 
                    y: -8,
                    transition: { type: "spring", stiffness: 300, damping: 20 }
                  }}
                >
                  <Card className=\"relative p-6 bg-white/90 backdrop-blur-xl border border-white/60 shadow-xl rounded-3xl overflow-hidden transition-all duration-300 group-hover:shadow-2xl\">
                    {}
                    <div className=\"absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-3xl blur-xl\"></div>
                    
                    <div className=\"relative z-10\">
                      {}
                      <div className=\"w-16 h-16 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300\">
                        <Pill className=\"w-8 h-8 text-emerald-600\" />
                      </div>

                      {}
                      <div className=\"text-center mb-4\">
                        <h3 className=\"font-bold text-gray-800 mb-1\">{medicine.name}</h3>
                        <p className=\"text-sm text-gray-600 mb-2\">{medicine.genericName}</p>
                        <p className=\"text-xs text-gray-500\">{medicine.manufacturer}</p>
                      </div>

                      {}
                      <div className=\"flex items-center justify-between mb-4\">
                        <div className=\"flex items-center space-x-2\">
                          <span className=\"text-xl font-bold text-emerald-600\">₹{medicine.price}</span>
                          {medicine.discount && (
                            <Badge className=\"bg-red-100 text-red-700 text-xs\">{medicine.discount}% OFF</Badge>
                          )}
                        </div>
                        {medicine.rating && (
                          <div className=\"flex items-center space-x-1\">
                            <Star className=\"w-4 h-4 text-yellow-500 fill-current\" />
                            <span className=\"text-sm font-medium\">{medicine.rating}</span>
                          </div>
                        )}
                      </div>

                      {}
                      <div className=\"flex items-center justify-between mb-4\">
                        <Badge className={`text-xs ${
                          medicine.stock > 50 
                            ? 'bg-green-100 text-green-700' 
                            : medicine.stock > 10 
                            ? 'bg-yellow-100 text-yellow-700' 
                            : 'bg-red-100 text-red-700'
                        }`}>
                          {medicine.stock > 0 ? `${medicine.stock} in stock` : 'Out of stock'}
                        </Badge>
                        {medicine.prescriptionRequired && (
                          <Badge className=\"bg-blue-100 text-blue-700 text-xs\">
                            <Shield className=\"w-3 h-3 mr-1\" />
                            Rx
                          </Badge>
                        )}
                      </div>

                      {}
                      <Button
                        className=\"w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0\"
                        onClick={() => {
                          const existingItem = cart.find(item => item.medicine.id === medicine.id);
                          if (existingItem) {
                            setCart(cart.map(item => 
                              item.medicine.id === medicine.id 
                                ? { ...item, quantity: item.quantity + 1 }
                                : item
                            ));
                          } else {
                            setCart([...cart, { medicine, quantity: 1 }]);
                          }
                          toast.success('🛒 Added to cart!');
                        }}
                      >
                        <Plus className=\"w-4 h-4 mr-2\" />
                        Add to Cart
                      </Button>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {}
        {activeTab === 'cart' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className=\"space-y-6\"
          >
            <Card className=\"p-8 bg-white/90 backdrop-blur-xl border border-white/60 shadow-xl rounded-3xl\">
              <div className=\"flex items-center justify-between mb-6\">
                <h2 className=\"text-2xl font-bold text-gray-800\">Shopping Cart</h2>
                <Badge className=\"bg-emerald-100 text-emerald-700\">{cart.length} items</Badge>
              </div>
              
              {cart.length === 0 ? (
                <div className=\"text-center py-12\">
                  <ShoppingCart className=\"w-16 h-16 text-gray-300 mx-auto mb-4\" />
                  <p className=\"text-gray-500 text-lg\">Your cart is empty</p>
                  <Button
                    onClick={() => setActiveTab('medicines')}
                    className=\"mt-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-2xl\"
                  >
                    Browse Medicines
                  </Button>
                </div>
              ) : (
                <div className=\"space-y-4\">
                  {cart.map((item) => (
                    <motion.div
                      key={item.medicine.id}
                      className=\"flex items-center justify-between p-4 bg-white/80 backdrop-blur-sm rounded-2xl border border-white/50\"
                      whileHover={{ scale: 1.02 }}
                    >
                      <div className=\"flex items-center space-x-4\">
                        <div className=\"w-12 h-12 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-xl flex items-center justify-center\">
                          <Pill className=\"w-6 h-6 text-emerald-600\" />
                        </div>
                        <div>
                          <h4 className=\"font-semibold text-gray-800\">{item.medicine.name}</h4>
                          <p className=\"text-sm text-gray-600\">{item.medicine.manufacturer}</p>
                        </div>
                      </div>
                      
                      <div className=\"flex items-center space-x-4\">
                        <div className=\"flex items-center space-x-2\">
                          <Button
                            size=\"sm\"
                            variant=\"outline\"
                            onClick={() => {
                              if (item.quantity > 1) {
                                setCart(cart.map(cartItem => 
                                  cartItem.medicine.id === item.medicine.id 
                                    ? { ...cartItem, quantity: cartItem.quantity - 1 }
                                    : cartItem
                                ));
                              } else {
                                setCart(cart.filter(cartItem => cartItem.medicine.id !== item.medicine.id));
                              }
                            }}
                            className=\"w-8 h-8 p-0 rounded-xl\"
                          >
                            <Minus className=\"w-4 h-4\" />
                          </Button>
                          <span className=\"w-8 text-center font-medium\">{item.quantity}</span>
                          <Button
                            size=\"sm\"
                            variant=\"outline\"
                            onClick={() => {
                              setCart(cart.map(cartItem => 
                                cartItem.medicine.id === item.medicine.id 
                                  ? { ...cartItem, quantity: cartItem.quantity + 1 }
                                  : cartItem
                              ));
                            }}
                            className=\"w-8 h-8 p-0 rounded-xl\"
                          >
                            <Plus className=\"w-4 h-4\" />
                          </Button>
                        </div>
                        
                        <div className=\"text-right\">
                          <p className=\"font-bold text-emerald-600\">₹{(item.medicine.price * item.quantity).toLocaleString()}</p>
                          {item.medicine.discount && (
                            <p className=\"text-sm text-gray-500\">Save ₹{Math.round(item.medicine.price * item.medicine.discount / 100 * item.quantity)}</p>
                          )}
                        </div>
                        
                        <Button
                          size=\"sm\"
                          variant=\"ghost\"
                          onClick={() => {
                            setCart(cart.filter(cartItem => cartItem.medicine.id !== item.medicine.id));
                          }}
                          className=\"text-red-500 hover:text-red-700 hover:bg-red-50 rounded-xl\"
                        >
                          <X className=\"w-4 h-4\" />
                        </Button>
                      </div>
                    </motion.div>
                  ))}
                  
                  {}
                  <div className=\"mt-8 p-6 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl border border-emerald-200\">
                    <div className=\"flex items-center justify-between mb-4\">
                      <span className=\"text-lg font-semibold\">Total Amount:</span>
                      <span className=\"text-2xl font-bold text-emerald-600\">
                        ₹{cart.reduce((sum, item) => sum + (item.medicine.price * item.quantity), 0).toLocaleString()}
                      </span>
                    </div>
                    <Button
                      className=\"w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white rounded-2xl py-4 text-lg font-semibold\"
                      onClick={() => {
                        toast.success('🛒 Proceeding to checkout!');
                        setShowCheckout(true);
                      }}
                    >
                      <ShoppingCart className=\"w-5 h-5 mr-2\" />
                      Proceed to Checkout
                    </Button>
                  </div>
                </div>
              )}
            </Card>
          </motion.div>
        )}

        {}
        {activeTab === 'history' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className=\"space-y-6\"
          >
            <Card className=\"p-8 bg-white/90 backdrop-blur-xl border border-white/60 shadow-xl rounded-3xl\">
              <div className=\"flex items-center justify-between mb-8\">
                <h2 className=\"text-2xl font-bold text-gray-800\">Purchase History</h2>
                <div className=\"flex items-center space-x-4\">
                  <Button
                    variant=\"outline\"
                    className=\"border-emerald-200 hover:bg-emerald-50 rounded-2xl\"
                  >
                    <Download className=\"w-4 h-4 mr-2\" />
                    Download PDF
                  </Button>
                  <Button
                    variant=\"outline\"
                    onClick={() => setShowFilters(!showFilters)}
                    className=\"border-blue-200 hover:bg-blue-50 rounded-2xl\"
                  >
                    <Filter className=\"w-4 h-4 mr-2\" />
                    Filters
                  </Button>
                </div>
              </div>

              {}
              <div className=\"relative\">
                {}
                <div className=\"absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-emerald-500 to-teal-500\"></div>
                
                <div className=\"space-y-8\">
                  {transactions.map((transaction, index) => (
                    <motion.div
                      key={transaction.id}
                      className=\"relative flex items-start space-x-6 group cursor-pointer\"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ scale: 1.02 }}
                      onClick={() => setSelectedTransaction(transaction)}
                    >
                      {}
                      <div className=\"relative z-10\">
                        <motion.div
                          className=\"w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform duration-300\"
                          whileHover={{ rotate: 5 }}
                        >
                          {transaction.status === 'delivered' ? (
                            <CheckCircle className=\"w-8 h-8 text-white\" />
                          ) : transaction.status === 'shipped' ? (
                            <Truck className=\"w-8 h-8 text-white\" />
                          ) : transaction.status === 'processing' ? (
                            <Clock className=\"w-8 h-8 text-white\" />
                          ) : (
                            <Package className=\"w-8 h-8 text-white\" />
                          )}
                        </motion.div>
                        {}
                        <div className=\"absolute inset-0 bg-gradient-to-br from-emerald-400 to-teal-400 rounded-2xl opacity-0 group-hover:opacity-30 blur-xl transition-opacity duration-300\"></div>
                      </div>

                      {}
                      <div className=\"flex-1 bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/50 shadow-lg group-hover:shadow-xl transition-all duration-300\">
                        <div className=\"flex items-center justify-between mb-4\">
                          <div>
                            <h3 className=\"text-xl font-bold text-gray-800\">{transaction.medicineName}</h3>
                            <p className=\"text-sm text-gray-600\">Order #{transaction.orderId}</p>
                          </div>
                          <div className=\"text-right\">
                            <p className=\"text-2xl font-bold text-emerald-600\">₹{transaction.totalAmount.toLocaleString()}</p>
                            {transaction.savings && transaction.savings > 0 && (
                              <p className=\"text-sm text-green-600\">Saved ₹{transaction.savings}</p>
                            )}
                          </div>
                        </div>

                        <div className=\"flex items-center justify-between mb-4\">
                          <div className=\"flex items-center space-x-4\">
                            <Badge className={`${
                              transaction.status === 'delivered' ? 'bg-green-100 text-green-700' :
                              transaction.status === 'shipped' ? 'bg-blue-100 text-blue-700' :
                              transaction.status === 'processing' ? 'bg-yellow-100 text-yellow-700' :
                              'bg-gray-100 text-gray-700'
                            }`}>
                              {transaction.status}
                            </Badge>
                            <Badge className=\"bg-purple-100 text-purple-700\">
                              {transaction.paymentMethod}
                            </Badge>
                          </div>
                          <div className=\"text-sm text-gray-600\">
                            {transaction.date} at {transaction.time}
                          </div>
                        </div>

                        <div className=\"flex items-center justify-between\">
                          <div className=\"flex items-center space-x-2\">
                            <Pill className=\"w-4 h-4 text-emerald-600\" />
                            <span className=\"text-sm text-gray-600\">Quantity: {transaction.quantity}</span>
                          </div>
                          <div className=\"flex items-center space-x-2\">
                            <Button 
                              size=\"sm\" 
                              variant=\"outline\"
                              className=\"rounded-xl border-emerald-200 hover:bg-emerald-50\"
                              onClick={(e) => {
                                e.stopPropagation();
                                toast.success('📄 Receipt downloaded!');
                              }}
                            >
                              <Receipt className=\"w-4 h-4 mr-1\" />
                              Receipt
                            </Button>
                            {transaction.status === 'shipped' && (
                              <Button 
                                size=\"sm\"
                                className=\"bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl\"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setTrackingOrderId(transaction.orderId || '');
                                  setShowDeliveryTracking(true);
                                }}
                              >
                                <Navigation className=\"w-4 h-4 mr-1\" />
                                Track
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </Card>

            {/* Transaction Detail Modal */}
            <AnimatePresence>
              {selectedTransaction && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className=\"fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-lg\"
                  onClick={() => setSelectedTransaction(null)}
                >
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    className=\"bg-white/95 backdrop-blur-xl rounded-3xl p-8 max-w-lg w-full mx-4 shadow-2xl border border-white/50\"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className=\"flex items-center justify-between mb-6\">
                      <h3 className=\"text-2xl font-bold text-gray-800\">Order Details</h3>
                      <Button
                        variant=\"ghost\"
                        size=\"sm\"
                        onClick={() => setSelectedTransaction(null)}
                        className=\"rounded-xl\"
                      >
                        <X className=\"w-4 h-4\" />
                      </Button>
                    </div>

                    <div className=\"space-y-6\">
                      <div className=\"bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl p-6\">
                        <h4 className=\"font-bold text-lg text-gray-800 mb-2\">{selectedTransaction.medicineName}</h4>
                        <div className=\"grid grid-cols-2 gap-4 text-sm\">
                          <div>
                            <span className=\"text-gray-600\">Order ID:</span>
                            <p className=\"font-medium\">{selectedTransaction.orderId}</p>
                          </div>
                          <div>
                            <span className=\"text-gray-600\">Transaction ID:</span>
                            <p className=\"font-medium\">{selectedTransaction.transactionId}</p>
                          </div>
                          <div>
                            <span className=\"text-gray-600\">Date & Time:</span>
                            <p className=\"font-medium\">{selectedTransaction.date} {selectedTransaction.time}</p>
                          </div>
                          <div>
                            <span className=\"text-gray-600\">Payment Method:</span>
                            <p className=\"font-medium capitalize\">{selectedTransaction.paymentMethod}</p>
                          </div>
                        </div>
                      </div>

                      <div className=\"space-y-4\">
                        <div className=\"flex justify-between items-center\">
                          <span>Quantity:</span>
                          <span className=\"font-medium\">{selectedTransaction.quantity}</span>
                        </div>
                        <div className=\"flex justify-between items-center\">
                          <span>Unit Price:</span>
                          <span className=\"font-medium\">₹{selectedTransaction.price}</span>
                        </div>
                        {selectedTransaction.savings && selectedTransaction.savings > 0 && (
                          <div className=\"flex justify-between items-center text-green-600\">
                            <span>Savings:</span>
                            <span className=\"font-medium\">-₹{selectedTransaction.savings}</span>
                          </div>
                        )}
                        <Separator />
                        <div className=\"flex justify-between items-center text-lg font-bold\">
                          <span>Total Amount:</span>
                          <span className=\"text-emerald-600\">₹{selectedTransaction.totalAmount}</span>
                        </div>
                      </div>

                      <div className=\"flex space-x-4\">
                        <Button
                          variant=\"outline\"
                          className=\"flex-1 rounded-2xl\"
                          onClick={() => {
                            toast.success('📄 Receipt downloaded!');
                          }}
                        >
                          <Download className=\"w-4 h-4 mr-2\" />
                          Download Receipt
                        </Button>
                        {selectedTransaction.status === 'delivered' && (
                          <Button
                            className=\"flex-1 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-2xl\"
                            onClick={() => {
                              toast.success('🛒 Added to cart for reorder!');
                              setSelectedTransaction(null);
                            }}
                          >
                            <Repeat className=\"w-4 h-4 mr-2\" />
                            Reorder
                          </Button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}

        {}
        {activeTab === 'statement' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className=\"space-y-8\"
          >
            {}
            <Card className=\"p-8 bg-gradient-to-r from-white/90 via-emerald-50/60 to-teal-50/60 backdrop-blur-xl border border-white/60 shadow-xl rounded-3xl\">
              <div className=\"flex items-center justify-between mb-6\">
                <div>
                  <h2 className=\"text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent\">Monthly Statement</h2>
                  <p className=\"text-gray-600 mt-2\">Your healthcare spending overview for January 2024</p>
                </div>
                <div className=\"flex items-center space-x-4\">
                  <Badge className=\"bg-emerald-100 text-emerald-700 px-4 py-2 text-lg\">
                    <Calendar className=\"w-4 h-4 mr-2\" />
                    Jan 2024
                  </Badge>
                  <Button
                    className=\"bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-2xl px-6 py-3\"
                    onClick={() => toast.success('📊 Full statement downloaded!')}
                  >
                    <Download className=\"w-4 h-4 mr-2\" />
                    Download PDF
                  </Button>
                </div>
              </div>
            </Card>

            {}
            <div className=\"grid grid-cols-1 md:grid-cols-3 gap-6\">
              <motion.div
                whileHover={{ scale: 1.05, y: -5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Card className=\"p-8 bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-2xl rounded-3xl relative overflow-hidden\">
                  <div className=\"absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16\"></div>
                  <div className=\"relative z-10\">
                    <div className=\"flex items-center justify-between mb-4\">
                      <TrendingUp className=\"w-10 h-10\" />
                      <Badge className=\"bg-white/20 text-white\">+12%</Badge>
                    </div>
                    <h3 className=\"text-lg font-medium mb-2\">This Month's Expenses</h3>
                    <p className=\"text-3xl font-bold\">₹{transactions.filter(t => new Date(t.date).getMonth() === new Date().getMonth()).reduce((sum, t) => sum + t.totalAmount, 0).toLocaleString()}</p>
                  </div>
                </Card>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.05, y: -5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Card className=\"p-8 bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-2xl rounded-3xl relative overflow-hidden\">
                  <div className=\"absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16\"></div>
                  <div className=\"relative z-10\">
                    <div className=\"flex items-center justify-between mb-4\">
                      <Pill className=\"w-10 h-10\" />
                      <Badge className=\"bg-white/20 text-white\">Top</Badge>
                    </div>
                    <h3 className=\"text-lg font-medium mb-2\">Most Bought Medicine</h3>
                    <p className=\"text-2xl font-bold\">Paracetamol</p>
                  </div>
                </Card>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.05, y: -5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Card className=\"p-8 bg-gradient-to-br from-purple-500 to-pink-600 text-white shadow-2xl rounded-3xl relative overflow-hidden\">
                  <div className=\"absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16\"></div>
                  <div className=\"relative z-10\">
                    <div className=\"flex items-center justify-between mb-4\">
                      <Gift className=\"w-10 h-10\" />
                      <Badge className=\"bg-white/20 text-white\">+8%</Badge>
                    </div>
                    <h3 className=\"text-lg font-medium mb-2\">Savings This Month</h3>
                    <p className=\"text-3xl font-bold\">₹{transactions.reduce((sum, t) => sum + (t.savings || 0), 0).toLocaleString()}</p>
                  </div>
                </Card>
              </motion.div>
            </div>

            {}
            <div className=\"grid grid-cols-1 lg:grid-cols-2 gap-8\">
              {}
              <Card className=\"p-8 bg-white/90 backdrop-blur-xl border border-white/60 shadow-xl rounded-3xl\">
                <div className=\"flex items-center justify-between mb-6\">
                  <h3 className=\"text-xl font-bold text-gray-800\">Expense Breakdown</h3>
                  <PieChart className=\"w-6 h-6 text-emerald-600\" />
                </div>
                
                {}
                <div className=\"relative w-64 h-64 mx-auto mb-6\">
                  <svg className=\"w-full h-full transform -rotate-90\" viewBox=\"0 0 100 100\">
                    {}
                    <circle
                      cx=\"50\"
                      cy=\"50\"
                      r=\"30\"
                      stroke=\"#10b981\"
                      strokeWidth=\"15\"
                      fill=\"transparent\"
                      strokeDasharray=\"75.4 188.5\"
                      strokeDashoffset=\"0\"
                      className=\"transition-all duration-1000\"
                    />
                    {}
                    <circle
                      cx=\"50\"
                      cy=\"50\"
                      r=\"30\"
                      stroke=\"#3b82f6\"
                      strokeWidth=\"15\"
                      fill=\"transparent\"
                      strokeDasharray=\"56.5 188.5\"
                      strokeDashoffset=\"-75.4\"
                      className=\"transition-all duration-1000\"
                    />
                    {}
                    <circle
                      cx=\"50\"
                      cy=\"50\"
                      r=\"30\"
                      stroke=\"#8b5cf6\"
                      strokeWidth=\"15\"
                      fill=\"transparent\"
                      strokeDasharray=\"37.7 188.5\"
                      strokeDashoffset=\"-131.9\"
                      className=\"transition-all duration-1000\"
                    />
                    {}
                    <circle
                      cx=\"50\"
                      cy=\"50\"
                      r=\"30\"
                      stroke=\"#f59e0b\"
                      strokeWidth=\"15\"
                      fill=\"transparent\"
                      strokeDasharray=\"18.8 188.5\"
                      strokeDashoffset=\"-169.6\"
                      className=\"transition-all duration-1000\"
                    />
                  </svg>
                  <div className=\"absolute inset-0 flex items-center justify-center\">
                    <div className=\"text-center\">
                      <p className=\"text-2xl font-bold text-gray-800\">₹1,247</p>
                      <p className=\"text-sm text-gray-600\">Total</p>
                    </div>
                  </div>
                </div>

                <div className=\"space-y-3\">
                  {[
                    { label: 'Pain Relief', value: '40%', amount: '₹498', color: 'bg-emerald-500' },
                    { label: 'Cold & Cough', value: '30%', amount: '₹374', color: 'bg-blue-500' },
                    { label: 'Vitamins', value: '20%', amount: '₹249', color: 'bg-purple-500' },
                    { label: 'Others', value: '10%', amount: '₹126', color: 'bg-yellow-500' }
                  ].map((item, index) => (
                    <motion.div
                      key={item.label}
                      className=\"flex items-center justify-between\"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.2 }}
                    >
                      <div className=\"flex items-center space-x-3\">
                        <div className={`w-4 h-4 rounded-full ${item.color}`}></div>
                        <span className=\"text-gray-700\">{item.label}</span>
                      </div>
                      <div className=\"text-right\">
                        <span className=\"font-semibold text-gray-800\">{item.amount}</span>
                        <span className=\"text-sm text-gray-600 ml-2\">{item.value}</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </Card>

              {}
              <Card className=\"p-8 bg-white/90 backdrop-blur-xl border border-white/60 shadow-xl rounded-3xl\">
                <div className=\"flex items-center justify-between mb-6\">
                  <h3 className=\"text-xl font-bold text-gray-800\">Monthly Spending Trend</h3>
                  <BarChart3 className=\"w-6 h-6 text-emerald-600\" />
                </div>
                
                {}
                <div className=\"space-y-4\">
                  {[
                    { month: 'Sep', amount: 1100, percentage: 85 },
                    { month: 'Oct', amount: 890, percentage: 68 },
                    { month: 'Nov', amount: 1350, percentage: 100 },
                    { month: 'Dec', amount: 980, percentage: 75 },
                    { month: 'Jan', amount: 1247, percentage: 92 }
                  ].map((item, index) => (
                    <motion.div
                      key={item.month}
                      className=\"flex items-center space-x-4\"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <span className=\"w-8 text-sm font-medium text-gray-600\">{item.month}</span>
                      <div className=\"flex-1 bg-gray-100 rounded-full h-8 relative overflow-hidden\">
                        <motion.div
                          className=\"h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full flex items-center justify-end pr-3\"
                          initial={{ width: 0 }}
                          animate={{ width: `${item.percentage}%` }}
                          transition={{ duration: 1, delay: index * 0.2 }}
                        >
                          <span className=\"text-white text-xs font-medium\">₹{item.amount}</span>
                        </motion.div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                <div className=\"mt-6 p-4 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl\">
                  <div className=\"flex items-center justify-between\">
                    <span className=\"text-sm font-medium text-emerald-800\">Average Monthly Spending</span>
                    <span className=\"text-lg font-bold text-emerald-600\">₹1,113</span>
                  </div>
                </div>
              </Card>
            </div>

            {}
            <Card className=\"p-8 bg-gradient-to-r from-white/90 via-blue-50/60 to-purple-50/60 backdrop-blur-xl border border-white/60 shadow-xl rounded-3xl\">
              <div className=\"flex items-center space-x-3 mb-6\">
                <div className=\"w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center\">
                  <Sparkles className=\"w-6 h-6 text-white\" />
                </div>
                <div>
                  <h3 className=\"text-xl font-bold text-gray-800\">AI Insights & Recommendations</h3>
                  <p className=\"text-sm text-gray-600\">Personalized suggestions based on your spending patterns</p>
                </div>
              </div>

              <div className=\"grid grid-cols-1 md:grid-cols-2 gap-6\">
                <motion.div
                  className=\"bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/50\"
                  whileHover={{ scale: 1.02 }}
                >
                  <div className=\"flex items-center space-x-3 mb-4\">
                    <TrendingUp className=\"w-6 h-6 text-emerald-600\" />
                    <h4 className=\"font-semibold text-gray-800\">Spending Insight</h4>
                  </div>
                  <p className=\"text-gray-700 mb-4\">You've saved 15% more this month compared to last month by using wallet payments and discount offers.</p>
                  <Badge className=\"bg-emerald-100 text-emerald-700\">
                    <ArrowUpRight className=\"w-3 h-3 mr-1\" />
                    Excellent
                  </Badge>
                </motion.div>

                <motion.div
                  className=\"bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/50\"
                  whileHover={{ scale: 1.02 }}
                >
                  <div className=\"flex items-center space-x-3 mb-4\">
                    <Target className=\"w-6 h-6 text-blue-600\" />
                    <h4 className=\"font-semibold text-gray-800\">Recommendation</h4>
                  </div>
                  <p className=\"text-gray-700 mb-4\">Consider buying medicines in bulk during discount periods to save more. Your pain relief category has consistent demand.</p>
                  <Badge className=\"bg-blue-100 text-blue-700\">
                    <Sparkles className=\"w-3 h-3 mr-1\" />
                    Smart Tip
                  </Badge>
                </motion.div>
              </div>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
}