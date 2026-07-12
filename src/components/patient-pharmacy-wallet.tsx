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
  FilterX
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
  expiryDate: string;
  prescriptionRequired: boolean;
  description: string;
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
  status: 'completed' | 'processing' | 'cancelled';
  paymentMethod: 'wallet' | 'card' | 'upi';
  prescriptionId?: string;
  savings?: number;
  deliveryStatus?: 'delivered' | 'in-transit' | 'pending';
}

interface PatientPharmacyWalletProps {
  onBack: () => void;
}

export function PatientPharmacyWallet({ onBack }: PatientPharmacyWalletProps) {
  const { t } = useLanguage();
  const [walletBalance, setWalletBalance] = useState(1250); 
  const [showAddMoney, setShowAddMoney] = useState(false);
  const [addAmount, setAddAmount] = useState('');
  const [activeTab, setActiveTab] = useState<'medicines' | 'history' | 'statement'>('medicines');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [dateFilter, setDateFilter] = useState('all');
  const [amountFilter, setAmountFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [loyaltyPoints, setLoyaltyPoints] = useState(245);
  const [currentStreak, setCurrentStreak] = useState(7);
  const [monthlySpendingGoal] = useState(2000);
  
  
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
      description: 'For fever and mild to moderate pain relief'
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
      description: 'Anti-inflammatory pain reliever'
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
      description: 'Pain relief and blood thinner'
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
      description: 'Relief from cold and flu symptoms'
    },
    {
      id: 'med005',
      name: 'Benadryl Cough Syrup',
      genericName: 'Diphenhydramine',
      price: 120,
      dosage: '100ml',
      manufacturer: 'Johnson & Johnson',
      category: 'cold-cough',
      stock: 45,
      expiryDate: '2025-08-22',
      prescriptionRequired: false,
      description: 'Cough suppressant syrup'
    },
    
    {
      id: 'med006',
      name: 'Amoxicillin',
      genericName: 'Amoxicillin',
      price: 180,
      dosage: '500mg',
      manufacturer: 'Ranbaxy',
      category: 'antibiotics',
      stock: 60,
      expiryDate: '2025-07-10',
      prescriptionRequired: true,
      description: 'Broad-spectrum antibiotic'
    },
    {
      id: 'med007',
      name: 'Azithromycin',
      genericName: 'Azithromycin',
      price: 220,
      dosage: '250mg',
      manufacturer: 'Pfizer',
      category: 'antibiotics',
      stock: 35,
      expiryDate: '2025-06-18',
      prescriptionRequired: true,
      description: 'Antibiotic for bacterial infections'
    },
    
    {
      id: 'med008',
      name: 'Digene Tablet',
      genericName: 'Simethicone + Magnesium Hydroxide',
      price: 25,
      dosage: '10 tablets',
      manufacturer: 'Abbott',
      category: 'digestive',
      stock: 120,
      expiryDate: '2025-12-05',
      prescriptionRequired: false,
      description: 'Relief from acidity and gas'
    },
    {
      id: 'med009',
      name: 'ORS Powder',
      genericName: 'Oral Rehydration Salt',
      price: 15,
      dosage: '21.8g sachet',
      manufacturer: 'Electral',
      category: 'digestive',
      stock: 200,
      expiryDate: '2026-03-15',
      prescriptionRequired: false,
      description: 'For dehydration treatment'
    },
    
    {
      id: 'med010',
      name: 'Vitamin D3',
      genericName: 'Cholecalciferol',
      price: 150,
      dosage: '60000 IU',
      manufacturer: 'Mankind',
      category: 'vitamins',
      stock: 80,
      expiryDate: '2025-11-25',
      prescriptionRequired: false,
      description: 'Vitamin D supplement'
    },
    {
      id: 'med011',
      name: 'Iron Tablets',
      genericName: 'Ferrous Sulfate',
      price: 95,
      dosage: '200mg',
      manufacturer: 'Zydus',
      category: 'vitamins',
      stock: 65,
      expiryDate: '2025-10-12',
      prescriptionRequired: false,
      description: 'Iron deficiency supplement'
    },
    
    {
      id: 'med012',
      name: 'Betadine Antiseptic',
      genericName: 'Povidone Iodine',
      price: 75,
      dosage: '50ml',
      manufacturer: 'Win-Medicare',
      category: 'skincare',
      stock: 90,
      expiryDate: '2025-09-30',
      prescriptionRequired: false,
      description: 'Antiseptic solution for cuts and wounds'
    },
    {
      id: 'med013',
      name: 'Soframycin Cream',
      genericName: 'Framycetin',
      price: 55,
      dosage: '15g tube',
      manufacturer: 'Sanofi',
      category: 'skincare',
      stock: 70,
      expiryDate: '2025-08-15',
      prescriptionRequired: false,
      description: 'Antibiotic cream for skin infections'
    },
    
    {
      id: 'med014',
      name: 'Metformin',
      genericName: 'Metformin Hydrochloride',
      price: 125,
      dosage: '500mg',
      manufacturer: 'Cipla',
      category: 'diabetes',
      stock: 55,
      expiryDate: '2025-07-20',
      prescriptionRequired: true,
      description: 'Diabetes medication'
    },
    
    {
      id: 'med015',
      name: 'Atorvastatin',
      genericName: 'Atorvastatin Calcium',
      price: 165,
      dosage: '10mg',
      manufacturer: 'Ranbaxy',
      category: 'heart',
      stock: 40,
      expiryDate: '2025-06-25',
      prescriptionRequired: true,
      description: 'Cholesterol-lowering medication'
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
      status: 'completed',
      paymentMethod: 'wallet',
      savings: 5,
      deliveryStatus: 'delivered'
    },
    {
      id: 'txn002',
      medicineId: 'med008',
      medicineName: 'Digene Tablet',
      quantity: 1,
      price: 25,
      totalAmount: 25,
      date: '2024-01-14',
      time: '11:45',
      category: 'digestive',
      status: 'completed',
      paymentMethod: 'wallet',
      savings: 3,
      deliveryStatus: 'delivered'
    },
    {
      id: 'txn003',
      medicineId: 'med004',
      medicineName: 'Crocin Cold & Flu',
      quantity: 1,
      price: 85,
      totalAmount: 85,
      date: '2024-01-12',
      time: '16:20',
      category: 'cold-cough',
      status: 'completed',
      paymentMethod: 'wallet',
      savings: 10,
      deliveryStatus: 'delivered'
    },
    {
      id: 'txn004',
      medicineId: 'med010',
      medicineName: 'Vitamin D3 60000 IU',
      quantity: 1,
      price: 150,
      totalAmount: 150,
      date: '2024-01-10',
      time: '09:15',
      category: 'vitamins',
      status: 'completed',
      paymentMethod: 'wallet',
      savings: 15,
      deliveryStatus: 'delivered'
    },
    {
      id: 'txn005',
      medicineId: 'med009',
      medicineName: 'ORS Powder',
      quantity: 3,
      price: 15,
      totalAmount: 45,
      date: '2024-01-08',
      time: '16:45',
      category: 'digestive',
      status: 'completed',
      paymentMethod: 'wallet',
      savings: 2,
      deliveryStatus: 'delivered'
    },
    {
      id: 'txn006',
      medicineId: 'med012',
      medicineName: 'Betadine Antiseptic 50ml',
      quantity: 1,
      price: 75,
      totalAmount: 75,
      date: '2024-01-05',
      time: '11:20',
      category: 'skincare',
      status: 'completed',
      paymentMethod: 'wallet',
      savings: 8,
      deliveryStatus: 'delivered'
    },
    {
      id: 'txn007',
      medicineId: 'med002',
      medicineName: 'Ibuprofen 400mg',
      quantity: 1,
      price: 65,
      totalAmount: 65,
      date: '2024-01-03',
      time: '13:30',
      category: 'pain-relief',
      status: 'completed',
      paymentMethod: 'wallet',
      savings: 7,
      deliveryStatus: 'delivered'
    },
    {
      id: 'txn008',
      medicineId: 'med005',
      medicineName: 'Benadryl Cough Syrup',
      quantity: 1,
      price: 120,
      totalAmount: 120,
      date: '2023-12-28',
      time: '18:00',
      category: 'cold-cough',
      status: 'completed',
      paymentMethod: 'wallet',
      savings: 12,
      deliveryStatus: 'delivered'
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
    { id: 'heart', name: 'Heart Health', icon: '❤️' }
  ];

  const filteredMedicines = medicines.filter(medicine => {
    const matchesSearch = medicine.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         medicine.genericName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || medicine.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const filteredTransactions = transactions.filter(transaction => {
    const matchesDateFilter = (() => {
      if (dateFilter === 'all') return true;
      const transactionDate = new Date(transaction.date);
      const now = new Date();
      
      switch (dateFilter) {
        case 'today':
          return transactionDate.toDateString() === now.toDateString();
        case 'week':
          const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          return transactionDate >= weekAgo;
        case 'month':
          return transactionDate.getMonth() === now.getMonth() && 
                 transactionDate.getFullYear() === now.getFullYear();
        case 'year':
          return transactionDate.getFullYear() === now.getFullYear();
        default:
          return true;
      }
    })();

    const matchesAmountFilter = (() => {
      if (amountFilter === 'all') return true;
      switch (amountFilter) {
        case 'low':
          return transaction.totalAmount < 50;
        case 'medium':
          return transaction.totalAmount >= 50 && transaction.totalAmount < 200;
        case 'high':
          return transaction.totalAmount >= 200;
        default:
          return true;
      }
    })();

    const matchesStatusFilter = statusFilter === 'all' || transaction.status === statusFilter;
    const matchesSearch = transaction.medicineName.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesDateFilter && matchesAmountFilter && matchesStatusFilter && matchesSearch;
  });

  
  useEffect(() => {
    if (balanceAnimation) {
      const timer = setTimeout(() => setBalanceAnimation(false), 1000);
      return () => clearTimeout(timer);
    }
  }, [balanceAnimation]);

  
  const thisMonthExpenses = transactions
    .filter(txn => txn.date.startsWith('2024-01'))
    .reduce((sum, txn) => sum + txn.totalAmount, 0);

  const totalSavings = transactions.reduce((sum, txn) => sum + (txn.savings || 0), 0);
  const averageOrderValue = transactions.length > 0 ? thisMonthExpenses / transactions.filter(txn => txn.date.startsWith('2024-01')).length : 0;
  const monthlyProgress = (thisMonthExpenses / monthlySpendingGoal) * 100;

  
  const categorySpending = transactions
    .filter(txn => txn.date.startsWith('2024-01'))
    .reduce((acc, txn) => {
      acc[txn.category] = (acc[txn.category] || 0) + txn.totalAmount;
      return acc;
    }, {} as Record<string, number>);

  const topCategories = Object.entries(categorySpending)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 3);

  const handleAddMoney = () => {
    const amount = parseFloat(addAmount);
    if (isNaN(amount) || amount <= 0) {
      toast.error(t('enterValidAmount'));
      return;
    }
    
    setIsLoading(true);
    
    setTimeout(() => {
      setWalletBalance(prev => prev + amount);
      setBalanceAnimation(true);
      setAddAmount('');
      setShowAddMoney(false);
      setIsLoading(false);
      
      // Show celebration for large amounts
      if (amount >= 1000) {
        setShowCelebration(true);
        setTimeout(() => setShowCelebration(false), 3000);
      }
      
      toast.success(`🎉 ₹${amount} ${t('amountAdded')}! Your wallet is charged up!`);
    }, 1500);
  };

  const handleBuyMedicine = (medicine: Medicine, quantity: number = 1) => {
    const totalCost = medicine.price * quantity;
    const savings = Math.floor(totalCost * 0.1); // 10% savings simulation
    
    if (walletBalance < totalCost) {
      toast.error(t('insufficientBalance'));
      return;
    }
    
    if (medicine.stock < quantity) {
      toast.error(t('outOfStock'));
      return;
    }
    
    setIsLoading(true);
    
    setTimeout(() => {
      // Update wallet balance
      setWalletBalance(prev => prev - totalCost);
      setBalanceAnimation(true);
      
      // Add loyalty points
      const pointsEarned = Math.floor(totalCost / 10);
      setLoyaltyPoints(prev => prev + pointsEarned);
      
      // Add transaction
      const newTransaction: Transaction = {
        id: `txn${Date.now()}`,
        medicineId: medicine.id,
        medicineName: `${medicine.name} ${medicine.dosage}`,
        quantity,
        price: medicine.price,
        totalAmount: totalCost,
        date: new Date().toISOString().split('T')[0],
        time: new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' }),
        category: medicine.category,
        status: 'completed',
        paymentMethod: 'wallet',
        savings,
        deliveryStatus: 'delivered'
      };
      
      setTransactions(prev => [newTransaction, ...prev]);
      setRecentPurchase(medicine.name);
      setIsLoading(false);
      
      // Success message with points earned
      toast.success(`🎉 ${t('purchaseSuccessful')}! You earned ${pointsEarned} loyalty points and saved ₹${savings}!`);
      
      // Clear recent purchase highlight after 3 seconds
      setTimeout(() => setRecentPurchase(null), 3000);
    }, 1500);
  };

  const downloadStatement = () => {
    // In a real app, this would generate and download a PDF
    toast.success(t('downloadStatement'));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-blue-50 to-purple-50">
      {/* Celebration Animation */}
      <AnimatePresence>
        {showCelebration && (
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none"
          >
            <div className="text-6xl animate-bounce">🎉✨💰</div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
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
            <div className="flex items-center space-x-4">
              <motion.div 
                className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-lg"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Wallet className="w-7 h-7 text-white" />
              </motion.div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                  {t('pharmacyWallet')}
                </h1>
                <div className="flex items-center space-x-3">
                  <p className="text-gray-600">{t('availableBalance')}: ₹{walletBalance.toLocaleString()}</p>
                  <Badge variant="secondary" className="bg-emerald-100 text-emerald-700">
                    <Star className="w-3 h-3 mr-1" />
                    {loyaltyPoints} points
                  </Badge>
                </div>
              </div>
            </div>
          </div>
          
          {/* Quick Stats */}
          <div className="hidden md:flex items-center space-x-6">
            <div className="text-center">
              <div className="text-xl font-bold text-emerald-600">{currentStreak}</div>
              <div className="text-xs text-gray-500">{t('dayStreak')}</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-purple-600">₹{totalSavings}</div>
              <div className="text-xs text-gray-500">{t('totalSavings')}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 max-w-7xl mx-auto space-y-8">
        {/* Enhanced Wallet Balance Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Card className="relative overflow-hidden">
            <div className="bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500 p-8 text-white">
              {/* Background Pattern */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-4 right-4 w-32 h-32 rounded-full bg-white/20"></div>
                <div className="absolute bottom-4 left-4 w-24 h-24 rounded-full bg-white/10"></div>
                <div className="absolute top-1/2 left-1/2 w-40 h-40 rounded-full bg-white/5 transform -translate-x-1/2 -translate-y-1/2"></div>
              </div>
              
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                      <CreditCard className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-lg font-medium opacity-90">{t('walletBalance')}</h2>
                      <p className="text-sm opacity-75">Primary Balance</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Shield className="w-5 h-5 opacity-75" />
                    <span className="text-sm opacity-75">Secured</span>
                  </div>
                </div>

                <motion.div 
                  className="text-5xl font-bold mb-4"
                  animate={balanceAnimation ? { scale: [1, 1.1, 1] } : {}}
                  transition={{ duration: 0.5 }}
                >
                  ₹{walletBalance.toLocaleString()}
                </motion.div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-6">
                    {walletBalance < 500 ? (
                      <div className="flex items-center space-x-2 bg-red-500/20 px-3 py-1 rounded-full">
                        <AlertCircle className="w-4 h-4" />
                        <span className="text-sm">{t('balanceLow')}</span>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2 bg-green-500/20 px-3 py-1 rounded-full">
                        <CheckCircle className="w-4 h-4" />
                        <span className="text-sm">Healthy Balance</span>
                      </div>
                    )}
                    
                    <div className="flex items-center space-x-2">
                      <Zap className="w-4 h-4" />
                      <span className="text-sm">Instant Payments</span>
                    </div>
                  </div>

                  <Button
                    onClick={() => setShowAddMoney(true)}
                    className="bg-white text-emerald-600 hover:bg-emerald-50 font-medium px-6 py-3 rounded-xl shadow-lg"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <Plus className="w-4 h-4 mr-2" />
                    )}
                    {t('addMoney')}
                  </Button>
                </div>
              </div>
            </div>

            {/* Quick Stats Row */}
            <div className="p-6 bg-white border-t">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-xl mx-auto mb-2">
                    <BarChart3 className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="text-2xl font-bold text-gray-800">₹{thisMonthExpenses}</div>
                  <div className="text-sm text-gray-500">{t('thisMonth')}</div>
                </div>
                
                <div className="text-center">
                  <div className="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-xl mx-auto mb-2">
                    <Gift className="w-6 h-6 text-purple-600" />
                  </div>
                  <div className="text-2xl font-bold text-gray-800">₹{totalSavings}</div>
                  <div className="text-sm text-gray-500">{t('totalSavings')}</div>
                </div>
                
                <div className="text-center">
                  <div className="flex items-center justify-center w-12 h-12 bg-emerald-100 rounded-xl mx-auto mb-2">
                    <Activity className="w-6 h-6 text-emerald-600" />
                  </div>
                  <div className="text-2xl font-bold text-gray-800">{filteredTransactions.length}</div>
                  <div className="text-sm text-gray-500">{t('transactions')}</div>
                </div>
                
                <div className="text-center">
                  <div className="flex items-center justify-center w-12 h-12 bg-orange-100 rounded-xl mx-auto mb-2">
                    <Target className="w-6 h-6 text-orange-600" />
                  </div>
                  <div className="text-2xl font-bold text-gray-800">{Math.round(monthlyProgress)}%</div>
                  <div className="text-sm text-gray-500">{t('monthlyGoal')}</div>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Enhanced Add Money Modal */}
        <AnimatePresence>
          {showAddMoney && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
              onClick={() => !isLoading && setShowAddMoney(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-2xl max-w-md w-full shadow-2xl"
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                        <Banknote className="w-6 h-6 text-emerald-600" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-800">{t('addFunds')}</h3>
                        <p className="text-sm text-gray-500">Add money to your wallet securely</p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowAddMoney(false)}
                      disabled={isLoading}
                      className="w-8 h-8 p-0"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium mb-3 text-gray-700">{t('enterAmount')}</label>
                      <div className="relative">
                        <DollarSign className="w-5 h-5 absolute left-3 top-3 text-gray-400" />
                        <Input
                          type="number"
                          value={addAmount}
                          onChange={(e) => setAddAmount(e.target.value)}
                          placeholder="0"
                          className="text-xl font-medium pl-10 h-12 border-2 focus:border-emerald-500 rounded-xl"
                          disabled={isLoading}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-3 text-gray-700">Quick Amounts</label>
                      <div className="grid grid-cols-3 gap-3">
                        {[100, 500, 1000, 2000, 5000, 10000].map(amount => (
                          <motion.div key={amount} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                            <Button
                              variant="outline"
                              onClick={() => setAddAmount(amount.toString())}
                              className="w-full h-12 text-sm font-medium hover:bg-emerald-50 hover:border-emerald-300 rounded-xl"
                              disabled={isLoading}
                            >
                              ₹{amount.toLocaleString()}
                            </Button>
                          </motion.div>
                        ))}
                      </div>
                    </div>

                    {/* Payment Methods */}
                    <div>
                      <label className="block text-sm font-medium mb-3 text-gray-700">Payment Method</label>
                      <div className="grid grid-cols-3 gap-3">
                        <div className="flex flex-col items-center p-3 border-2 border-emerald-200 rounded-xl bg-emerald-50">
                          <CreditCard className="w-6 h-6 text-emerald-600 mb-1" />
                          <span className="text-xs font-medium">Card</span>
                        </div>
                        <div className="flex flex-col items-center p-3 border-2 border-gray-200 rounded-xl">
                          <Zap className="w-6 h-6 text-gray-400 mb-1" />
                          <span className="text-xs">UPI</span>
                        </div>
                        <div className="flex flex-col items-center p-3 border-2 border-gray-200 rounded-xl">
                          <Banknote className="w-6 h-6 text-gray-400 mb-1" />
                          <span className="text-xs">Net Banking</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex space-x-3 pt-2">
                      <Button
                        onClick={handleAddMoney}
                        className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 h-12 rounded-xl font-medium shadow-lg"
                        disabled={isLoading || !addAmount}
                      >
                        {isLoading ? (
                          <>
                            <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                            Processing...
                          </>
                        ) : (
                          <>
                            <Plus className="w-4 h-4 mr-2" />
                            Add ₹{addAmount ? parseFloat(addAmount).toLocaleString() : '0'}
                          </>
                        )}
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => setShowAddMoney(false)}
                        className="px-6 h-12 rounded-xl"
                        disabled={isLoading}
                      >
                        {t('cancel')}
                      </Button>
                    </div>

                    {/* Security Note */}
                    <div className="flex items-center space-x-2 p-3 bg-blue-50 rounded-xl">
                      <Shield className="w-4 h-4 text-blue-600" />
                      <span className="text-xs text-blue-600">Your payments are secured with 256-bit encryption</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Enhanced Tab Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white rounded-2xl p-2 shadow-lg border border-gray-100"
        >
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'medicines', icon: ShoppingCart, label: t('medicines'), badge: filteredMedicines.length },
              { id: 'history', icon: History, label: t('purchaseHistory'), badge: filteredTransactions.length },
              { id: 'statement', icon: Download, label: t('monthlyStatement'), badge: null }
            ].map((tab) => (
              <motion.div key={tab.id} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button
                  variant="ghost"
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`w-full h-16 rounded-xl transition-all duration-200 ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg'
                      : 'hover:bg-emerald-50 text-gray-600'
                  }`}
                >
                  <div className="flex flex-col items-center space-y-1">
                    <div className="flex items-center space-x-2">
                      <tab.icon className="w-5 h-5" />
                      {tab.badge !== null && (
                        <Badge variant="secondary" className={`text-xs ${
                          activeTab === tab.id ? 'bg-white/20 text-white' : 'bg-emerald-100 text-emerald-700'
                        }`}>
                          {tab.badge}
                        </Badge>
                      )}
                    </div>
                    <span className="text-sm font-medium">{tab.label}</span>
                  </div>
                </Button>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Medicines Tab */}
        {activeTab === 'medicines' && (
          <div>
            {/* Search and Filter */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="flex-1 relative">
                <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                <Input
                  placeholder="Search medicines..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex space-x-2 overflow-x-auto">
                {categories.map(category => (
                  <Button
                    key={category.id}
                    variant={selectedCategory === category.id ? 'default' : 'outline'}
                    onClick={() => setSelectedCategory(category.id)}
                    className="whitespace-nowrap text-xs"
                  >
                    <span className="mr-1">{category.icon}</span>
                    {category.name}
                  </Button>
                ))}
              </div>
            </div>

            {/* Medicine Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredMedicines.map(medicine => (
                <Card key={medicine.id} className="p-4 hover:shadow-lg transition-shadow">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-800">{medicine.name}</h3>
                      <p className="text-sm text-gray-600 mb-1">{medicine.genericName}</p>
                      <p className="text-xs text-gray-500">{medicine.dosage} • {t('manufacturer')}: {medicine.manufacturer}</p>
                    </div>
                    {medicine.prescriptionRequired && (
                      <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded">
                        Rx
                      </span>
                    )}
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-3">{medicine.description}</p>
                  
                  <div className="flex items-center justify-between mb-3">
                    <div className="text-2xl font-bold text-green-600">₹{medicine.price}</div>
                    <div className="text-right">
                      <div className="text-sm text-gray-600">{t('inStock')}: {medicine.stock}</div>
                      <div className="text-xs text-gray-500">{t('expiryDate')}: {medicine.expiryDate}</div>
                    </div>
                  </div>
                  
                  <Button
                    onClick={() => handleBuyMedicine(medicine)}
                    disabled={medicine.stock === 0}
                    className="w-full bg-green-600 hover:bg-green-700 disabled:opacity-50"
                  >
                    {medicine.stock === 0 ? t('outOfStock') : `${t('buyNow')} - ₹${medicine.price}`}
                  </Button>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Enhanced Purchase History Tab */}
        {activeTab === 'history' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="space-y-6"
          >
            {/* Header with Filters */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
              <div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">{t('purchaseHistory')}</h3>
                <p className="text-gray-600">Track all your medicine purchases and manage your health</p>
              </div>
              
              <div className="flex items-center space-x-3">
                <Button
                  variant="outline"
                  onClick={() => setShowFilters(!showFilters)}
                  className="rounded-xl border-emerald-200 hover:bg-emerald-50"
                >
                  <Filter className="w-4 h-4 mr-2" />
                  Filters
                  {(dateFilter !== 'all' || amountFilter !== 'all' || statusFilter !== 'all') && (
                    <Badge variant="secondary" className="ml-2 bg-emerald-100 text-emerald-700">
                      Active
                    </Badge>
                  )}
                </Button>
                
                <Button variant="outline" className="rounded-xl border-purple-200 hover:bg-purple-50">
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
              </div>
            </div>

            {/* Enhanced Filters */}
            <AnimatePresence>
              {showFilters && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <Card className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 border-0">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2 text-gray-700">Date Range</label>
                        <select
                          value={dateFilter}
                          onChange={(e) => setDateFilter(e.target.value)}
                          className="w-full p-2 border border-gray-200 rounded-lg focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
                        >
                          <option value="all">All Time</option>
                          <option value="today">Today</option>
                          <option value="week">This Week</option>
                          <option value="month">This Month</option>
                          <option value="year">This Year</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium mb-2 text-gray-700">Amount Range</label>
                        <select
                          value={amountFilter}
                          onChange={(e) => setAmountFilter(e.target.value)}
                          className="w-full p-2 border border-gray-200 rounded-lg focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
                        >
                          <option value="all">All Amounts</option>
                          <option value="low">Under ₹50</option>
                          <option value="medium">₹50 - ₹200</option>
                          <option value="high">Above ₹200</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium mb-2 text-gray-700">Status</label>
                        <select
                          value={statusFilter}
                          onChange={(e) => setStatusFilter(e.target.value)}
                          className="w-full p-2 border border-gray-200 rounded-lg focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
                        >
                          <option value="all">All Status</option>
                          <option value="completed">Completed</option>
                          <option value="processing">Processing</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </div>
                      
                      <div className="flex items-end">
                        <Button
                          onClick={() => {
                            setDateFilter('all');
                            setAmountFilter('all');
                            setStatusFilter('all');
                            setSearchTerm('');
                          }}
                          variant="outline"
                          className="w-full rounded-lg border-red-200 hover:bg-red-50 text-red-600"
                        >
                          <FilterX className="w-4 h-4 mr-2" />
                          Clear
                        </Button>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Search Bar */}
            <div className="relative">
              <Search className="w-5 h-5 absolute left-3 top-3 text-gray-400" />
              <Input
                placeholder="Search medicine purchases..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-12 border-2 focus:border-emerald-500 rounded-xl"
              />
            </div>

            {/* Transaction List */}
            {filteredTransactions.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-16"
              >
                <Card className="p-8 bg-gradient-to-br from-blue-50 to-purple-50 border-0">
                  <div className="w-20 h-20 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <ShoppingCart className="w-10 h-10 text-white" />
                  </div>
                  <h4 className="text-xl font-bold text-gray-800 mb-2">No transactions found</h4>
                  <p className="text-gray-600 mb-6">Start your health journey by purchasing your first medicine!</p>
                  <Button
                    onClick={() => setActiveTab('medicines')}
                    className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 rounded-xl px-6"
                  >
                    <Pill className="w-4 h-4 mr-2" />
                    Browse Medicines
                  </Button>
                </Card>
              </motion.div>
            ) : (
              <div className="space-y-4">
                {filteredTransactions.map((transaction, index) => (
                  <motion.div
                    key={transaction.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                    onClick={() => setSelectedTransaction(transaction)}
                    className="cursor-pointer"
                  >
                    <Card className={`p-6 hover:shadow-xl transition-all duration-200 border-l-4 ${
                      recentPurchase === transaction.medicineName 
                        ? 'border-l-emerald-500 bg-emerald-50/50' 
                        : 'border-l-transparent hover:border-l-emerald-300'
                    }`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          {/* Status Icon */}
                          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${
                            transaction.status === 'completed' 
                              ? 'bg-emerald-100' 
                              : transaction.status === 'processing'
                              ? 'bg-blue-100'
                              : 'bg-red-100'
                          }`}>
                            {transaction.status === 'completed' ? (
                              <CheckCircle className="w-7 h-7 text-emerald-600" />
                            ) : transaction.status === 'processing' ? (
                              <Clock className="w-7 h-7 text-blue-600" />
                            ) : (
                              <X className="w-7 h-7 text-red-600" />
                            )}
                          </div>

                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                              <h4 className="font-bold text-gray-800">{transaction.medicineName}</h4>
                              {transaction.savings && transaction.savings > 0 && (
                                <Badge variant="secondary" className="bg-green-100 text-green-700">
                                  <Gift className="w-3 h-3 mr-1" />
                                  Saved ₹{transaction.savings}
                                </Badge>
                              )}
                            </div>
                            
                            <div className="flex items-center space-x-4 text-sm text-gray-600 mb-2">
                              <div className="flex items-center space-x-1">
                                <Package className="w-4 h-4" />
                                <span>Qty: {transaction.quantity}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Calendar className="w-4 h-4" />
                                <span>{new Date(transaction.date).toLocaleDateString()}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Clock className="w-4 h-4" />
                                <span>{transaction.time}</span>
                              </div>
                            </div>

                            <div className="flex items-center space-x-4">
                              <Badge variant="outline" className="text-xs">
                                {categories.find(c => c.id === transaction.category)?.icon} {categories.find(c => c.id === transaction.category)?.name}
                              </Badge>
                              
                              {transaction.deliveryStatus && (
                                <Badge variant="secondary" className={`text-xs ${
                                  transaction.deliveryStatus === 'delivered' 
                                    ? 'bg-emerald-100 text-emerald-700'
                                    : transaction.deliveryStatus === 'in-transit'
                                    ? 'bg-blue-100 text-blue-700'
                                    : 'bg-orange-100 text-orange-700'
                                }`}>
                                  <Truck className="w-3 h-3 mr-1" />
                                  {transaction.deliveryStatus}
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Transaction Amount */}
                        <div className="text-right">
                          <div className="text-2xl font-bold text-gray-800 mb-1">₹{transaction.totalAmount}</div>
                          <div className="text-sm text-gray-500">₹{transaction.price} each</div>
                          <div className="flex items-center justify-end mt-2">
                            <div className={`w-2 h-2 rounded-full mr-2 ${
                              transaction.paymentMethod === 'wallet' 
                                ? 'bg-emerald-500' 
                                : transaction.paymentMethod === 'card'
                                ? 'bg-blue-500'
                                : 'bg-purple-500'
                            }`}></div>
                            <span className="text-xs text-gray-500 capitalize">{transaction.paymentMethod}</span>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {/* Enhanced Monthly Statement Tab */}
        {activeTab === 'statement' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="space-y-8"
          >
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
              <div>
                <h3 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-2">
                  {t('monthlyStatement')}
                </h3>
                <p className="text-gray-600">Your complete health spending analysis and insights</p>
              </div>
              
              <div className="flex items-center space-x-3">
                <Button
                  onClick={downloadStatement}
                  variant="outline"
                  className="border-emerald-200 hover:bg-emerald-50 rounded-xl"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download PDF
                </Button>
                
                <Button
                  variant="outline"
                  className="border-purple-200 hover:bg-purple-50 rounded-xl"
                >
                  <FileText className="w-4 h-4 mr-2" />
                  Email Statement
                </Button>
              </div>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="relative overflow-hidden"
              >
                <Card className="p-6 bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                      <Wallet className="w-6 h-6" />
                    </div>
                    <TrendingUp className="w-5 h-5 opacity-75" />
                  </div>
                  <div className="text-3xl font-bold mb-2">₹{walletBalance.toLocaleString()}</div>
                  <div className="text-blue-100 text-sm">{t('availableBalance')}</div>
                  <div className="absolute -right-4 -bottom-4 w-16 h-16 bg-white/10 rounded-full"></div>
                </Card>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.02 }}
                className="relative overflow-hidden"
              >
                <Card className="p-6 bg-gradient-to-br from-emerald-500 to-emerald-600 text-white">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                      <BarChart3 className="w-6 h-6" />
                    </div>
                    <div className="text-green-200 text-xs">↑ 12%</div>
                  </div>
                  <div className="text-3xl font-bold mb-2">₹{thisMonthExpenses.toLocaleString()}</div>
                  <div className="text-emerald-100 text-sm">{t('totalExpenses')} - {t('thisMonth')}</div>
                  <div className="absolute -right-4 -bottom-4 w-16 h-16 bg-white/10 rounded-full"></div>
                </Card>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.02 }}
                className="relative overflow-hidden"
              >
                <Card className="p-6 bg-gradient-to-br from-purple-500 to-purple-600 text-white">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                      <Gift className="w-6 h-6" />
                    </div>
                    <Sparkles className="w-5 h-5 opacity-75" />
                  </div>
                  <div className="text-3xl font-bold mb-2">₹{totalSavings.toLocaleString()}</div>
                  <div className="text-purple-100 text-sm">{t('totalSavings')} Earned</div>
                  <div className="absolute -right-4 -bottom-4 w-16 h-16 bg-white/10 rounded-full"></div>
                </Card>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.02 }}
                className="relative overflow-hidden"
              >
                <Card className="p-6 bg-gradient-to-br from-orange-500 to-orange-600 text-white">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                      <Activity className="w-6 h-6" />
                    </div>
                    <Target className="w-5 h-5 opacity-75" />
                  </div>
                  <div className="text-3xl font-bold mb-2">{filteredTransactions.length}</div>
                  <div className="text-orange-100 text-sm">{t('purchase')}s Completed</div>
                  <div className="absolute -right-4 -bottom-4 w-16 h-16 bg-white/10 rounded-full"></div>
                </Card>
              </motion.div>
            </div>

            {/* Monthly Goal Progress */}
            <Card className="p-6 bg-gradient-to-r from-indigo-50 to-purple-50 border-0">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h4 className="text-xl font-bold text-gray-800">Monthly Spending Goal</h4>
                  <p className="text-gray-600">Track your healthcare budget effectively</p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-indigo-600">{Math.round(monthlyProgress)}%</div>
                  <div className="text-sm text-gray-500">of ₹{monthlySpendingGoal.toLocaleString()}</div>
                </div>
              </div>
              
              <div className="mb-4">
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span>₹{thisMonthExpenses.toLocaleString()}</span>
                  <span>₹{monthlySpendingGoal.toLocaleString()}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(monthlyProgress, 100)}%` }}
                    transition={{ duration: 1, delay: 0.5 }}
                    className={`h-3 rounded-full ${
                      monthlyProgress < 50 
                        ? 'bg-gradient-to-r from-green-400 to-green-500'
                        : monthlyProgress < 80
                        ? 'bg-gradient-to-r from-yellow-400 to-yellow-500'
                        : 'bg-gradient-to-r from-red-400 to-red-500'
                    }`}
                  ></motion.div>
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-lg font-bold text-green-600">₹{(monthlySpendingGoal - thisMonthExpenses).toLocaleString()}</div>
                  <div className="text-xs text-gray-500">Remaining Budget</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-blue-600">₹{Math.round(averageOrderValue)}</div>
                  <div className="text-xs text-gray-500">Avg. Order Value</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-purple-600">{Math.round(thisMonthExpenses / 30)}</div>
                  <div className="text-xs text-gray-500">Daily Avg.</div>
                </div>
              </div>
            </Card>

            {/* Category Breakdown */}
            <div className="grid md:grid-cols-2 gap-8">
              {/* Top Categories */}
              <Card className="p-6">
                <h4 className="text-xl font-bold text-gray-800 mb-6">Top Spending Categories</h4>
                <div className="space-y-4">
                  {topCategories.map(([category, amount], index) => {
                    const categoryInfo = categories.find(c => c.id === category);
                    const percentage = (amount / thisMonthExpenses) * 100;
                    
                    return (
                      <motion.div
                        key={category}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, delay: index * 0.1 }}
                        className="flex items-center justify-between p-4 bg-gray-50 rounded-xl"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="text-2xl">{categoryInfo?.icon}</div>
                          <div>
                            <div className="font-medium text-gray-800">{categoryInfo?.name}</div>
                            <div className="text-sm text-gray-500">{Math.round(percentage)}% of total</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-gray-800">₹{amount.toLocaleString()}</div>
                          <div className="w-20 bg-gray-200 rounded-full h-2 mt-1">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${percentage}%` }}
                              transition={{ duration: 0.8, delay: 0.5 + index * 0.1 }}
                              className="h-2 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full"
                            ></motion.div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </Card>

              {/* Health Insights */}
              <Card className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 border-emerald-200">
                <h4 className="text-xl font-bold text-gray-800 mb-6">Health Insights</h4>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3 p-3 bg-white rounded-lg">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                      <Heart className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-800">Preventive Care Focus</div>
                      <div className="text-sm text-gray-600">65% spending on preventive medicines</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3 p-3 bg-white rounded-lg">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Award className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-800">Smart Savings</div>
                      <div className="text-sm text-gray-600">₹{totalSavings} saved with our offers</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3 p-3 bg-white rounded-lg">
                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                      <Users className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-800">Family Health Score</div>
                      <div className="text-sm text-gray-600">Excellent - Regular medicine care</div>
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            {/* Recent Transactions Summary */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h4 className="text-xl font-bold text-gray-800">Recent Transaction Details</h4>
                <Button
                  onClick={() => setActiveTab('history')}
                  variant="outline"
                  className="border-emerald-200 hover:bg-emerald-50 rounded-xl"
                >
                  View All <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
              
              <div className="space-y-3">
                {transactions.slice(0, 5).map((transaction, index) => (
                  <motion.div
                    key={transaction.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                        <Receipt className="w-5 h-5 text-emerald-600" />
                      </div>
                      <div>
                        <div className="font-medium text-gray-800">{transaction.medicineName}</div>
                        <div className="text-sm text-gray-600">
                          {new Date(transaction.date).toLocaleDateString()} • Qty: {transaction.quantity}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-gray-800">₹{transaction.totalAmount}</div>
                      {transaction.savings && transaction.savings > 0 && (
                        <div className="text-sm text-green-600">Saved ₹{transaction.savings}</div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </Card>
          </motion.div>
        )}

        {/* Transaction Detail Modal */}
        <AnimatePresence>
          {selectedTransaction && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
              onClick={() => setSelectedTransaction(null)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-2xl max-w-lg w-full shadow-2xl"
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                        <Receipt className="w-6 h-6 text-emerald-600" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-800">Transaction Details</h3>
                        <p className="text-sm text-gray-500">ID: {selectedTransaction.id}</p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedTransaction(null)}
                      className="w-8 h-8 p-0"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>

                  <div className="space-y-6">
                    {/* Medicine Info */}
                    <div className="bg-gradient-to-r from-emerald-50 to-teal-50 p-4 rounded-xl">
                      <h4 className="font-bold text-gray-800 mb-2">{selectedTransaction.medicineName}</h4>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-500">Quantity:</span>
                          <span className="font-medium ml-2">{selectedTransaction.quantity}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Unit Price:</span>
                          <span className="font-medium ml-2">₹{selectedTransaction.price}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Category:</span>
                          <span className="font-medium ml-2">{categories.find(c => c.id === selectedTransaction.category)?.name}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Status:</span>
                          <Badge variant="secondary" className="ml-2 bg-emerald-100 text-emerald-700">
                            {selectedTransaction.status}
                          </Badge>
                        </div>
                      </div>
                    </div>

                    {/* Payment Details */}
                    <div>
                      <h5 className="font-bold text-gray-800 mb-3">Payment Information</h5>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Subtotal:</span>
                          <span className="font-medium">₹{selectedTransaction.totalAmount}</span>
                        </div>
                        {selectedTransaction.savings && selectedTransaction.savings > 0 && (
                          <div className="flex justify-between text-green-600">
                            <span>Savings Applied:</span>
                            <span className="font-medium">-₹{selectedTransaction.savings}</span>
                          </div>
                        )}
                        <Separator />
                        <div className="flex justify-between text-lg font-bold">
                          <span>Total Paid:</span>
                          <span>₹{selectedTransaction.totalAmount}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <div className={`w-2 h-2 rounded-full ${
                            selectedTransaction.paymentMethod === 'wallet' ? 'bg-emerald-500' : 'bg-blue-500'
                          }`}></div>
                          <span>Paid via {selectedTransaction.paymentMethod}</span>
                        </div>
                      </div>
                    </div>

                    {}
                    {selectedTransaction.deliveryStatus && (
                      <div>
                        <h5 className="font-bold text-gray-800 mb-3">Delivery Information</h5>
                        <div className="flex items-center space-x-3 p-3 bg-emerald-50 rounded-lg">
                          <Truck className="w-5 h-5 text-emerald-600" />
                          <div>
                            <div className="font-medium text-gray-800">Status: {selectedTransaction.deliveryStatus}</div>
                            <div className="text-sm text-gray-600">
                              Ordered on {new Date(selectedTransaction.date).toLocaleDateString()} at {selectedTransaction.time}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {}
                    <div className="flex space-x-3">
                      <Button
                        variant="outline"
                        className="flex-1 border-emerald-200 hover:bg-emerald-50 rounded-xl"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Download Receipt
                      </Button>
                      <Button
                        className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 rounded-xl"
                      >
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Reorder
                      </Button>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}