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
  
  
  const [showQuickReorder, setShowQuickReorder] = useState(false);
  const [showRecommended, setShowRecommended] = useState(false);

  
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest('.floating-panel') && !target.closest('.floating-button')) {
        setShowQuickReorder(false);
        setShowRecommended(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  
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
      name: 'Diclofenac Sodium',
      genericName: 'Diclofenac Sodium',
      price: 75,
      dosage: '50mg',
      manufacturer: 'Novartis',
      category: 'pain-relief',
      stock: 65,
      expiryDate: '2025-08-22',
      prescriptionRequired: true,
      description: 'Powerful anti-inflammatory for severe pain',
      discount: 8,
      rating: 4.4,
      reviews: 1678
    },
    {
      id: 'med005',
      name: 'Tramadol',
      genericName: 'Tramadol Hydrochloride',
      price: 120,
      dosage: '50mg',
      manufacturer: 'Zydus Cadila',
      category: 'pain-relief',
      stock: 45,
      expiryDate: '2025-09-10',
      prescriptionRequired: true,
      description: 'For moderate to severe pain management',
      rating: 4.1,
      reviews: 987
    },
    
    {
      id: 'med006',
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
    },
    {
      id: 'med007',
      name: 'Benadryl Cough Syrup',
      genericName: 'Diphenhydramine + Ammonium Chloride',
      price: 120,
      dosage: '100ml',
      manufacturer: 'Johnson & Johnson',
      category: 'cold-cough',
      stock: 45,
      expiryDate: '2025-11-08',
      prescriptionRequired: false,
      description: 'Effective relief from dry and wet cough',
      discount: 12,
      rating: 4.3,
      reviews: 1456
    },
    {
      id: 'med008',
      name: 'Cetirizine',
      genericName: 'Cetirizine Hydrochloride',
      price: 55,
      dosage: '10mg',
      manufacturer: 'Dr. Reddy\'s',
      category: 'cold-cough',
      stock: 95,
      expiryDate: '2025-12-05',
      prescriptionRequired: false,
      description: 'Antihistamine for allergies and cold symptoms',
      discount: 10,
      rating: 4.6,
      reviews: 2156
    },
    {
      id: 'med009',
      name: 'Sinarest',
      genericName: 'Chlorpheniramine + Paracetamol + Phenylephrine',
      price: 95,
      dosage: '10 tablets',
      manufacturer: 'Centaur Pharma',
      category: 'cold-cough',
      stock: 78,
      expiryDate: '2025-10-18',
      prescriptionRequired: false,
      description: 'Complete relief from cold, cough and fever',
      discount: 18,
      rating: 4.5,
      reviews: 1789
    },
    {
      id: 'med010',
      name: 'Vicks VapoRub',
      genericName: 'Menthol + Camphor + Eucalyptus Oil',
      price: 135,
      dosage: '50g',
      manufacturer: 'P&G',
      category: 'cold-cough',
      stock: 120,
      expiryDate: '2026-03-22',
      prescriptionRequired: false,
      description: 'Topical relief for chest congestion and cough',
      rating: 4.7,
      reviews: 3245
    },
    
    {
      id: 'med011',
      name: 'Amoxicillin',
      genericName: 'Amoxicillin',
      price: 145,
      dosage: '500mg',
      manufacturer: 'Cipla',
      category: 'antibiotics',
      stock: 65,
      expiryDate: '2025-07-15',
      prescriptionRequired: true,
      description: 'Broad-spectrum antibiotic for bacterial infections',
      discount: 12,
      rating: 4.3,
      reviews: 1456
    },
    {
      id: 'med012',
      name: 'Azithromycin',
      genericName: 'Azithromycin',
      price: 185,
      dosage: '500mg',
      manufacturer: 'Pfizer',
      category: 'antibiotics',
      stock: 45,
      expiryDate: '2025-08-20',
      prescriptionRequired: true,
      description: 'Macrolide antibiotic for respiratory infections',
      discount: 15,
      rating: 4.4,
      reviews: 1287
    },
    {
      id: 'med013',
      name: 'Ciprofloxacin',
      genericName: 'Ciprofloxacin',
      price: 165,
      dosage: '500mg',
      manufacturer: 'Ranbaxy',
      category: 'antibiotics',
      stock: 38,
      expiryDate: '2025-09-12',
      prescriptionRequired: true,
      description: 'Fluoroquinolone antibiotic for UTI and other infections',
      rating: 4.2,
      reviews: 987
    },
    {
      id: 'med014',
      name: 'Doxycycline',
      genericName: 'Doxycycline Hyclate',
      price: 125,
      dosage: '100mg',
      manufacturer: 'Sun Pharma',
      category: 'antibiotics',
      stock: 52,
      expiryDate: '2025-06-25',
      prescriptionRequired: true,
      description: 'Tetracycline antibiotic for various bacterial infections',
      discount: 8,
      rating: 4.1,
      reviews: 765
    },
    
    {
      id: 'med015',
      name: 'Digene Gel',
      genericName: 'Aluminium Hydroxide + Magnesium Hydroxide',
      price: 85,
      dosage: '200ml',
      manufacturer: 'Abbott',
      category: 'digestive',
      stock: 95,
      expiryDate: '2025-11-30',
      prescriptionRequired: false,
      description: 'Fast relief from acidity and gas',
      discount: 10,
      rating: 4.5,
      reviews: 2345
    },
    {
      id: 'med016',
      name: 'Pantoprazole',
      genericName: 'Pantoprazole Sodium',
      price: 125,
      dosage: '40mg',
      manufacturer: 'Dr. Reddy\'s',
      category: 'digestive',
      stock: 78,
      expiryDate: '2025-10-15',
      prescriptionRequired: true,
      description: 'Proton pump inhibitor for acid reflux and GERD',
      discount: 15,
      rating: 4.6,
      reviews: 1876
    },
    {
      id: 'med017',
      name: 'ORS Powder',
      genericName: 'Oral Rehydration Salts',
      price: 25,
      dosage: '21.8g sachet',
      manufacturer: 'Cipla',
      category: 'digestive',
      stock: 150,
      expiryDate: '2026-02-28',
      prescriptionRequired: false,
      description: 'Instant relief from dehydration due to diarrhea',
      rating: 4.4,
      reviews: 1987
    },
    {
      id: 'med018',
      name: 'Loperamide',
      genericName: 'Loperamide Hydrochloride',
      price: 65,
      dosage: '2mg',
      manufacturer: 'Johnson & Johnson',
      category: 'digestive',
      stock: 67,
      expiryDate: '2025-09-20',
      prescriptionRequired: false,
      description: 'Anti-diarrheal medication for quick relief',
      discount: 8,
      rating: 4.2,
      reviews: 1234
    },
    {
      id: 'med019',
      name: 'Probiotic Capsules',
      genericName: 'Lactobacillus + Bifidobacterium',
      price: 195,
      dosage: '10 billion CFU',
      manufacturer: 'Himalaya',
      category: 'digestive',
      stock: 85,
      expiryDate: '2025-08-10',
      prescriptionRequired: false,
      description: 'Restores healthy gut bacteria and improves digestion',
      discount: 20,
      rating: 4.7,
      reviews: 1567
    },
    
    {
      id: 'med020',
      name: 'Vitamin D3 60K IU',
      genericName: 'Cholecalciferol',
      price: 195,
      dosage: '60,000 IU',
      manufacturer: 'Sun Pharma',
      category: 'vitamins',
      stock: 120,
      expiryDate: '2025-12-25',
      prescriptionRequired: false,
      description: 'High potency vitamin D for bone health',
      discount: 25,
      rating: 4.8,
      reviews: 3456
    },
    {
      id: 'med021',
      name: 'B-Complex Tablets',
      genericName: 'Vitamin B Complex',
      price: 145,
      dosage: '30 tablets',
      manufacturer: 'Revital',
      category: 'vitamins',
      stock: 95,
      expiryDate: '2025-11-15',
      prescriptionRequired: false,
      description: 'Complete B vitamin complex for energy and metabolism',
      discount: 15,
      rating: 4.5,
      reviews: 2134
    },
    {
      id: 'med022',
      name: 'Calcium + Magnesium',
      genericName: 'Calcium Carbonate + Magnesium Oxide',
      price: 165,
      dosage: '60 tablets',
      manufacturer: 'Shelcal',
      category: 'vitamins',
      stock: 78,
      expiryDate: '2025-10-08',
      prescriptionRequired: false,
      description: 'Essential minerals for bone and muscle health',
      rating: 4.4,
      reviews: 1789
    },
    {
      id: 'med023',
      name: 'Iron + Folic Acid',
      genericName: 'Ferrous Sulfate + Folic Acid',
      price: 85,
      dosage: '30 tablets',
      manufacturer: 'Ranbaxy',
      category: 'vitamins',
      stock: 125,
      expiryDate: '2025-09-30',
      prescriptionRequired: false,
      description: 'Prevents and treats iron deficiency anemia',
      discount: 12,
      rating: 4.3,
      reviews: 1654
    },
    {
      id: 'med024',
      name: 'Multivitamin Tablets',
      genericName: 'Multivitamin + Multimineral',
      price: 285,
      dosage: '30 tablets',
      manufacturer: 'Centrum',
      category: 'vitamins',
      stock: 65,
      expiryDate: '2025-08-18',
      prescriptionRequired: false,
      description: 'Complete daily nutrition in one tablet',
      discount: 18,
      rating: 4.6,
      reviews: 2987
    },
    
    {
      id: 'med025',
      name: 'Betnovate Cream',
      genericName: 'Betamethasone Valerate',
      price: 125,
      dosage: '20g',
      manufacturer: 'GSK',
      category: 'skincare',
      stock: 45,
      expiryDate: '2025-07-22',
      prescriptionRequired: true,
      description: 'Topical corticosteroid for skin inflammation',
      discount: 10,
      rating: 4.2,
      reviews: 987
    },
    {
      id: 'med026',
      name: 'Clotrimazole Cream',
      genericName: 'Clotrimazole',
      price: 85,
      dosage: '15g',
      manufacturer: 'Cipla',
      category: 'skincare',
      stock: 78,
      expiryDate: '2025-09-15',
      prescriptionRequired: false,
      description: 'Antifungal cream for skin infections',
      rating: 4.4,
      reviews: 1456
    },
    {
      id: 'med027',
      name: 'Calamine Lotion',
      genericName: 'Calamine + Zinc Oxide',
      price: 65,
      dosage: '100ml',
      manufacturer: 'Lacto',
      category: 'skincare',
      stock: 95,
      expiryDate: '2025-12-10',
      prescriptionRequired: false,
      description: 'Soothing lotion for itchy and irritated skin',
      discount: 8,
      rating: 4.5,
      reviews: 1789
    },
    {
      id: 'med028',
      name: 'Tretinoin Cream',
      genericName: 'Tretinoin',
      price: 195,
      dosage: '20g',
      manufacturer: 'Johnson & Johnson',
      category: 'skincare',
      stock: 35,
      expiryDate: '2025-06-30',
      prescriptionRequired: true,
      description: 'Topical retinoid for acne and skin renewal',
      discount: 15,
      rating: 4.3,
      reviews: 1234
    },
    {
      id: 'med029',
      name: 'Aloe Vera Gel',
      genericName: 'Aloe Barbadensis Leaf Extract',
      price: 145,
      dosage: '150g',
      manufacturer: 'Himalaya',
      category: 'skincare',
      stock: 125,
      expiryDate: '2025-11-20',
      prescriptionRequired: false,
      description: 'Natural soothing gel for burns and skin irritation',
      discount: 20,
      rating: 4.7,
      reviews: 2456
    },
    
    {
      id: 'med030',
      name: 'Metformin',
      genericName: 'Metformin Hydrochloride',
      price: 185,
      dosage: '500mg',
      manufacturer: 'Cipla',
      category: 'diabetes',
      stock: 95,
      expiryDate: '2025-10-15',
      prescriptionRequired: true,
      description: 'First-line medication for type 2 diabetes',
      discount: 12,
      rating: 4.4,
      reviews: 2134
    },
    {
      id: 'med031',
      name: 'Glimepiride',
      genericName: 'Glimepiride',
      price: 165,
      dosage: '2mg',
      manufacturer: 'Sun Pharma',
      category: 'diabetes',
      stock: 67,
      expiryDate: '2025-08-25',
      prescriptionRequired: true,
      description: 'Sulfonylurea for blood sugar control',
      rating: 4.2,
      reviews: 1567
    },
    {
      id: 'med032',
      name: 'Insulin Pen',
      genericName: 'Human Insulin',
      price: 850,
      dosage: '3ml cartridge',
      manufacturer: 'Novo Nordisk',
      category: 'diabetes',
      stock: 25,
      expiryDate: '2025-05-20',
      prescriptionRequired: true,
      description: 'Pre-filled insulin pen for diabetes management',
      discount: 8,
      rating: 4.6,
      reviews: 987
    },
    {
      id: 'med033',
      name: 'Glucometer Kit',
      genericName: 'Blood Glucose Monitor',
      price: 1250,
      dosage: '1 kit',
      manufacturer: 'Accu-Chek',
      category: 'diabetes',
      stock: 35,
      expiryDate: '2027-12-31',
      prescriptionRequired: false,
      description: 'Digital glucometer with 25 test strips',
      discount: 25,
      rating: 4.5,
      reviews: 1234
    },
    {
      id: 'med034',
      name: 'Glucometer Strips',
      genericName: 'Blood Glucose Test Strips',
      price: 450,
      dosage: '50 strips',
      manufacturer: 'Accu-Chek',
      category: 'diabetes',
      stock: 78,
      expiryDate: '2025-09-30',
      prescriptionRequired: false,
      description: 'Accurate blood glucose test strips',
      rating: 4.3,
      reviews: 1876
    },
    
    {
      id: 'med035',
      name: 'Atorvastatin',
      genericName: 'Atorvastatin Calcium',
      price: 285,
      dosage: '20mg',
      manufacturer: 'Pfizer',
      category: 'heart',
      stock: 65,
      expiryDate: '2025-07-18',
      prescriptionRequired: true,
      description: 'Statin for cholesterol management and heart health',
      discount: 15,
      rating: 4.4,
      reviews: 1789
    },
    {
      id: 'med036',
      name: 'Amlodipine',
      genericName: 'Amlodipine Besylate',
      price: 145,
      dosage: '5mg',
      manufacturer: 'Cipla',
      category: 'heart',
      stock: 85,
      expiryDate: '2025-11-12',
      prescriptionRequired: true,
      description: 'Calcium channel blocker for high blood pressure',
      discount: 10,
      rating: 4.3,
      reviews: 1456
    },
    {
      id: 'med037',
      name: 'Clopidogrel',
      genericName: 'Clopidogrel Bisulfate',
      price: 195,
      dosage: '75mg',
      manufacturer: 'Sun Pharma',
      category: 'heart',
      stock: 45,
      expiryDate: '2025-06-08',
      prescriptionRequired: true,
      description: 'Antiplatelet medication to prevent blood clots',
      rating: 4.2,
      reviews: 987
    },
    {
      id: 'med038',
      name: 'Omega-3 Capsules',
      genericName: 'Omega-3 Fatty Acids',
      price: 395,
      dosage: '1000mg',
      manufacturer: 'Seven Seas',
      category: 'heart',
      stock: 95,
      expiryDate: '2025-12-20',
      prescriptionRequired: false,
      description: 'Essential fatty acids for heart and brain health',
      discount: 20,
      rating: 4.6,
      reviews: 2345
    },
    {
      id: 'med039',
      name: 'Coenzyme Q10',
      genericName: 'Ubiquinone',
      price: 565,
      dosage: '100mg',
      manufacturer: 'HealthKart',
      category: 'heart',
      stock: 55,
      expiryDate: '2025-10-25',
      prescriptionRequired: false,
      description: 'Antioxidant supplement for heart health',
      discount: 18,
      rating: 4.4,
      reviews: 1234
    },
    
    {
      id: 'period001',
      name: 'Mefenamic Acid',
      genericName: 'Mefenamic Acid',
      price: 45,
      dosage: '250mg',
      manufacturer: 'Cipla',
      category: 'periods',
      stock: 120,
      expiryDate: '2025-11-15',
      prescriptionRequired: false,
      description: 'Specifically formulated for menstrual cramps and period pain relief',
      discount: 12,
      rating: 4.7,
      reviews: 3456
    },
    {
      id: 'period002',
      name: 'Stayfree Ultra Thin Pads',
      genericName: 'Sanitary Pads - Ultra Thin',
      price: 89,
      dosage: '20 pieces',
      manufacturer: 'Johnson & Johnson',
      category: 'periods',
      stock: 200,
      expiryDate: '2026-06-30',
      prescriptionRequired: false,
      description: 'Ultra-soft, ultra-thin pads with wings for maximum comfort and protection',
      discount: 15,
      rating: 4.5,
      reviews: 5234
    },
    {
      id: 'period003',
      name: 'Whisper Ultra Clean Pads',
      genericName: 'Sanitary Pads - Heavy Flow',
      price: 95,
      dosage: '15 pieces',
      manufacturer: 'P&G',
      category: 'periods',
      stock: 180,
      expiryDate: '2026-08-20',
      prescriptionRequired: false,
      description: 'Extra-long pads for heavy flow days with 5-layer protection',
      discount: 10,
      rating: 4.6,
      reviews: 4567
    },
    {
      id: 'period004',
      name: 'Iron + Folic Acid (Period Support)',
      genericName: 'Iron + Folic Acid + Vitamin B12',
      price: 85,
      dosage: '30 tablets',
      manufacturer: 'Himalaya',
      category: 'periods',
      stock: 95,
      expiryDate: '2025-10-12',
      prescriptionRequired: false,
      description: 'Specially formulated to combat period-related iron deficiency and fatigue',
      discount: 20,
      rating: 4.4,
      reviews: 2345
    },
    {
      id: 'period005',
      name: 'Magnesium Supplement',
      genericName: 'Magnesium Oxide',
      price: 125,
      dosage: '60 capsules',
      manufacturer: 'HealthKart',
      category: 'periods',
      stock: 75,
      expiryDate: '2025-12-08',
      prescriptionRequired: false,
      description: 'Natural muscle relaxant to ease menstrual cramps and mood swings',
      rating: 4.3,
      reviews: 1876
    },
    {
      id: 'period006',
      name: 'Menstrual Cup - DivaCup',
      genericName: 'Medical Grade Silicone Cup',
      price: 450,
      dosage: '1 piece',
      manufacturer: 'DivaCup',
      category: 'periods',
      stock: 45,
      expiryDate: '2030-01-01',
      prescriptionRequired: false,
      description: 'Eco-friendly, reusable menstrual cup for up to 12 hours protection',
      discount: 25,
      rating: 4.8,
      reviews: 987
    },
    {
      id: 'period007',
      name: 'Heat Therapy Patch',
      genericName: 'Disposable Heat Patches',
      price: 65,
      dosage: '5 patches',
      manufacturer: 'ThermaCare',
      category: 'periods',
      stock: 88,
      expiryDate: '2026-03-15',
      prescriptionRequired: false,
      description: 'Self-heating patches for natural period pain relief - up to 8 hours warmth',
      discount: 8,
      rating: 4.6,
      reviews: 2134
    },
    {
      id: 'period008',
      name: 'Chamomile Tea (Period Comfort)',
      genericName: 'Chamomile Herbal Tea',
      price: 35,
      dosage: '25 tea bags',
      manufacturer: 'Organic India',
      category: 'periods',
      stock: 125,
      expiryDate: '2025-09-30',
      prescriptionRequired: false,
      description: 'Soothing herbal tea to ease period cramps and promote relaxation',
      rating: 4.2,
      reviews: 1543
    },
    {
      id: 'period009',
      name: 'Cranberry Tablets',
      genericName: 'Cranberry Extract',
      price: 195,
      dosage: '60 tablets',
      manufacturer: 'NOW Foods',
      category: 'periods',
      stock: 65,
      expiryDate: '2025-11-22',
      prescriptionRequired: false,
      description: 'Supports urinary health and reduces period-related UTI risk',
      discount: 18,
      rating: 4.4,
      reviews: 876
    },
    {
      id: 'period010',
      name: 'Dark Chocolate (Period Comfort)',
      genericName: '70% Dark Chocolate',
      price: 85,
      dosage: '100g bar',
      manufacturer: 'Amul',
      category: 'periods',
      stock: 150,
      expiryDate: '2025-08-15',
      prescriptionRequired: false,
      description: 'Rich dark chocolate to boost mood and satisfy period cravings naturally',
      discount: 5,
      rating: 4.7,
      reviews: 3421
    },
    
    {
      id: 'preg001',
      name: 'Prenatal Multivitamin',
      genericName: 'Folic Acid + Iron + DHA + Vitamins',
      price: 285,
      dosage: '30 tablets',
      manufacturer: 'MomsCare',
      category: 'pregnancy',
      stock: 95,
      expiryDate: '2025-12-20',
      prescriptionRequired: false,
      description: 'Complete prenatal nutrition for healthy pregnancy and baby development',
      discount: 20,
      rating: 4.8,
      reviews: 4567
    },
    {
      id: 'preg002',
      name: 'Folic Acid 5mg',
      genericName: 'Folic Acid',
      price: 45,
      dosage: '30 tablets',
      manufacturer: 'Sun Pharma',
      category: 'pregnancy',
      stock: 150,
      expiryDate: '2025-10-15',
      prescriptionRequired: false,
      description: 'Essential for preventing birth defects and supporting healthy pregnancy',
      rating: 4.6,
      reviews: 3245
    },
    {
      id: 'preg003',
      name: 'Ginger Capsules (Nausea Relief)',
      genericName: 'Ginger Root Extract',
      price: 125,
      dosage: '60 capsules',
      manufacturer: 'Himalaya',
      category: 'pregnancy',
      stock: 88,
      expiryDate: '2025-11-08',
      prescriptionRequired: false,
      description: 'Natural remedy for morning sickness and pregnancy-related nausea',
      discount: 15,
      rating: 4.5,
      reviews: 2876
    },
    {
      id: 'preg004',
      name: 'Calcium + Vitamin D3 (Pregnancy)',
      genericName: 'Calcium Carbonate + Vitamin D3',
      price: 165,
      dosage: '60 tablets',
      manufacturer: 'Shelcal',
      category: 'pregnancy',
      stock: 120,
      expiryDate: '2025-09-25',
      prescriptionRequired: false,
      description: 'Essential for baby\'s bone development and mother\'s bone health',
      discount: 12,
      rating: 4.7,
      reviews: 1987
    },
    {
      id: 'preg005',
      name: 'DHA Omega-3 (Pregnancy)',
      genericName: 'Docosahexaenoic Acid',
      price: 395,
      dosage: '30 softgels',
      manufacturer: 'Nordic Naturals',
      category: 'pregnancy',
      stock: 65,
      expiryDate: '2025-08-30',
      prescriptionRequired: false,
      description: 'Supports baby\'s brain and eye development during pregnancy',
      discount: 25,
      rating: 4.9,
      reviews: 1234
    },
    {
      id: 'preg006',
      name: 'Pregnancy Pillow Support',
      genericName: 'Maternity Support Pillow',
      price: 850,
      dosage: '1 piece',
      manufacturer: 'ComfortMax',
      category: 'pregnancy',
      stock: 25,
      expiryDate: '2030-01-01',
      prescriptionRequired: false,
      description: 'U-shaped pregnancy pillow for comfortable sleep and body support',
      discount: 30,
      rating: 4.6,
      reviews: 789
    },
    {
      id: 'preg007',
      name: 'Stretch Mark Prevention Cream',
      genericName: 'Cocoa Butter + Vitamin E Cream',
      price: 195,
      dosage: '200ml',
      manufacturer: 'Palmer\'s',
      category: 'pregnancy',
      stock: 75,
      expiryDate: '2025-12-15',
      prescriptionRequired: false,
      description: 'Nourishing cream to prevent and reduce pregnancy stretch marks',
      discount: 18,
      rating: 4.4,
      reviews: 2345
    },
    {
      id: 'preg008',
      name: 'Pregnancy Tea (Raspberry Leaf)',
      genericName: 'Red Raspberry Leaf Tea',
      price: 95,
      dosage: '30 tea bags',
      manufacturer: 'Traditional Medicinals',
      category: 'pregnancy',
      stock: 95,
      expiryDate: '2025-10-20',
      prescriptionRequired: false,
      description: 'Traditional herbal tea to support uterine health in 2nd & 3rd trimester',
      rating: 4.3,
      reviews: 1456
    },
    {
      id: 'preg009',
      name: 'Compression Socks (Pregnancy)',
      genericName: 'Maternity Compression Socks',
      price: 125,
      dosage: '1 pair',
      manufacturer: 'Preggers',
      category: 'pregnancy',
      stock: 55,
      expiryDate: '2030-01-01',
      prescriptionRequired: false,
      description: 'Reduce swelling and improve circulation during pregnancy',
      discount: 10,
      rating: 4.5,
      reviews: 987
    },
    {
      id: 'preg010',
      name: 'Prenatal Yoga DVD',
      genericName: 'Exercise Guide for Pregnancy',
      price: 85,
      dosage: '1 DVD set',
      manufacturer: 'FitPregnancy',
      category: 'pregnancy',
      stock: 45,
      expiryDate: '2030-01-01',
      prescriptionRequired: false,
      description: 'Safe and gentle yoga exercises for all stages of pregnancy',
      rating: 4.2,
      reviews: 654
    },
    {
      id: 'preg011',
      name: 'Belly Butter (Organic)',
      genericName: 'Organic Shea + Cocoa Butter',
      price: 145,
      dosage: '150ml',
      manufacturer: 'Earth Mama',
      category: 'pregnancy',
      stock: 68,
      expiryDate: '2025-11-30',
      prescriptionRequired: false,
      description: 'Organic, chemical-free belly butter for skin nourishment during pregnancy',
      discount: 15,
      rating: 4.7,
      reviews: 1789
    },
    {
      id: 'preg012',
      name: 'Iron Supplement (Gentle)',
      genericName: 'Iron Bisglycinate',
      price: 155,
      dosage: '60 capsules',
      manufacturer: 'Gentle Iron',
      category: 'pregnancy',
      stock: 88,
      expiryDate: '2025-09-18',
      prescriptionRequired: false,
      description: 'Gentle iron supplement that won\'t cause stomach upset during pregnancy',
      rating: 4.4,
      reviews: 2134
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
      medicineId: 'med006',
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
    },
    {
      id: 'txn003',
      medicineId: 'med020',
      medicineName: 'Vitamin D3 60K IU',
      quantity: 1,
      price: 195,
      totalAmount: 195,
      date: '2024-01-10',
      time: '09:15',
      category: 'vitamins',
      status: 'delivered',
      paymentMethod: 'wallet',
      savings: 29,
      deliveryStatus: 'delivered',
      orderId: 'ORD003',
      transactionId: 'TXN1234567892'
    },
    {
      id: 'txn004',
      medicineId: 'med015',
      medicineName: 'Digene Gel 200ml',
      quantity: 1,
      price: 85,
      totalAmount: 85,
      date: '2024-01-08',
      time: '11:45',
      category: 'digestive',
      status: 'delivered',
      paymentMethod: 'upi',
      savings: 9,
      deliveryStatus: 'delivered',
      orderId: 'ORD004',
      transactionId: 'TXN1234567893'
    },
    {
      id: 'txn005',
      medicineId: 'med002',
      medicineName: 'Ibuprofen 400mg',
      quantity: 2,
      price: 65,
      totalAmount: 130,
      date: '2024-01-05',
      time: '16:30',
      category: 'pain-relief',
      status: 'delivered',
      paymentMethod: 'card',
      savings: 0,
      deliveryStatus: 'delivered',
      orderId: 'ORD005',
      transactionId: 'TXN1234567894'
    },
    {
      id: 'txn006',
      medicineId: 'med021',
      medicineName: 'B-Complex Tablets',
      quantity: 1,
      price: 145,
      totalAmount: 145,
      date: '2024-01-03',
      time: '10:20',
      category: 'vitamins',
      status: 'delivered',
      paymentMethod: 'wallet',
      savings: 22,
      deliveryStatus: 'delivered',
      orderId: 'ORD006',
      transactionId: 'TXN1234567895'
    },
    {
      id: 'txn007',
      medicineId: 'med008',
      medicineName: 'Cetirizine 10mg',
      quantity: 1,
      price: 55,
      totalAmount: 55,
      date: '2023-12-28',
      time: '14:15',
      category: 'cold-cough',
      status: 'delivered',
      paymentMethod: 'upi',
      savings: 6,
      deliveryStatus: 'delivered',
      orderId: 'ORD007',
      transactionId: 'TXN1234567896'
    },
    {
      id: 'txn008',
      medicineId: 'med030',
      medicineName: 'Metformin 500mg',
      quantity: 1,
      price: 185,
      totalAmount: 185,
      date: '2023-12-25',
      time: '09:45',
      category: 'diabetes',
      status: 'delivered',
      paymentMethod: 'card',
      savings: 22,
      deliveryStatus: 'delivered',
      orderId: 'ORD008',
      transactionId: 'TXN1234567897'
    },
    {
      id: 'txn009',
      medicineId: 'med026',
      medicineName: 'Clotrimazole Cream',
      quantity: 1,
      price: 85,
      totalAmount: 85,
      date: '2023-12-23',
      time: '15:10',
      category: 'skincare',
      status: 'delivered',
      paymentMethod: 'wallet',
      savings: 0,
      deliveryStatus: 'delivered',
      orderId: 'ORD009',
      transactionId: 'TXN1234567898'
    },
    {
      id: 'txn010',
      medicineId: 'med035',
      medicineName: 'Atorvastatin 20mg',
      quantity: 1,
      price: 285,
      totalAmount: 285,
      date: '2023-12-20',
      time: '12:30',
      category: 'heart',
      status: 'delivered',
      paymentMethod: 'netbanking',
      savings: 43,
      deliveryStatus: 'delivered',
      orderId: 'ORD010',
      transactionId: 'TXN1234567899'
    },
    {
      id: 'txn011',
      medicineId: 'med033',
      medicineName: 'Glucometer Kit',
      quantity: 1,
      price: 1250,
      totalAmount: 1250,
      date: '2023-12-18',
      time: '11:20',
      category: 'diabetes',
      status: 'delivered',
      paymentMethod: 'card',
      savings: 312,
      deliveryStatus: 'delivered',
      orderId: 'ORD011',
      transactionId: 'TXN1234567800'
    },
    {
      id: 'txn012',
      medicineId: 'med034',
      medicineName: 'Glucometer Strips',
      quantity: 1,
      price: 450,
      totalAmount: 450,
      date: '2023-12-22',
      time: '13:45',
      category: 'diabetes',
      status: 'delivered',
      paymentMethod: 'netbanking',
      savings: 45,
      deliveryStatus: 'delivered',
      orderId: 'ORD012',
      transactionId: 'TXN1234567801'
    },
    {
      id: 'txn013',
      medicineId: 'period001',
      medicineName: 'Mefenamic Acid 250mg',
      quantity: 2,
      price: 45,
      totalAmount: 90,
      date: '2023-12-18',
      time: '15:30',
      category: 'periods',
      status: 'delivered',
      paymentMethod: 'wallet',
      savings: 11,
      deliveryStatus: 'delivered',
      orderId: 'ORD013',
      transactionId: 'TXN1234567802'
    },
    {
      id: 'txn014',
      medicineId: 'period002',
      medicineName: 'Stayfree Ultra Thin Pads',
      quantity: 1,
      price: 89,
      totalAmount: 89,
      date: '2023-12-15',
      time: '12:15',
      category: 'periods',
      status: 'delivered',
      paymentMethod: 'upi',
      savings: 13,
      deliveryStatus: 'delivered',
      orderId: 'ORD014',
      transactionId: 'TXN1234567803'
    },
    {
      id: 'txn015',
      medicineId: 'preg001',
      medicineName: 'Prenatal Multivitamin',
      quantity: 1,
      price: 285,
      totalAmount: 285,
      date: '2023-12-10',
      time: '10:45',
      category: 'pregnancy',
      status: 'delivered',
      paymentMethod: 'card',
      savings: 57,
      deliveryStatus: 'delivered',
      orderId: 'ORD015',
      transactionId: 'TXN1234567804'
    },
    {
      id: 'txn016',
      medicineId: 'period007',
      medicineName: 'Heat Therapy Patch',
      quantity: 2,
      price: 65,
      totalAmount: 130,
      date: '2023-12-08',
      time: '14:20',
      category: 'periods',
      status: 'delivered',
      paymentMethod: 'wallet',
      savings: 10,
      deliveryStatus: 'delivered',
      orderId: 'ORD016',
      transactionId: 'TXN1234567805'
    },
    {
      id: 'txn017',
      medicineId: 'preg003',
      medicineName: 'Ginger Capsules (Nausea Relief)',
      quantity: 1,
      price: 125,
      totalAmount: 125,
      date: '2023-12-05',
      time: '16:10',
      category: 'pregnancy',
      status: 'delivered',
      paymentMethod: 'upi',
      savings: 19,
      deliveryStatus: 'delivered',
      orderId: 'ORD017',
      transactionId: 'TXN1234567806'
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
          return transaction.totalAmount < 100;
        case 'medium':
          return transaction.totalAmount >= 100 && transaction.totalAmount < 500;
        case 'high':
          return transaction.totalAmount >= 500;
        default:
          return true;
      }
    })();

    const matchesStatusFilter = statusFilter === 'all' || transaction.status === statusFilter;
    const matchesSearch = transaction.medicineName.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesDateFilter && matchesAmountFilter && matchesStatusFilter && matchesSearch;
  });

  
  if (showCheckout) {
    return (
      <EnhancedPharmacyCheckout
        cartItems={cart}
        onBack={() => setShowCheckout(false)}
        onOrderSuccess={(orderId: string) => {
          const orderAmount = cart.reduce((sum, item) => sum + (item.medicine.price * item.quantity), 0);
          setCheckoutOrder({
            orderId,
            amount: orderAmount,
            items: cart
          });
          setShowCheckout(false);
          setShowPaymentGateway(true);
        }}
        walletBalance={walletBalance}
      />
    );
  }

  if (showPaymentGateway && checkoutOrder) {
    return (
      <PaymentGateway
        amount={checkoutOrder.amount}
        orderId={checkoutOrder.orderId}
        onBack={() => setShowPaymentGateway(false)}
        onPaymentSuccess={(transactionId: string, paymentMethod: string) => {
          
          const newTransaction: Transaction = {
            id: `txn_${Date.now()}`,
            medicineId: checkoutOrder.items[0].medicine.id,
            medicineName: checkoutOrder.items.map(item => item.medicine.name).join(', '),
            quantity: checkoutOrder.items.reduce((sum, item) => sum + item.quantity, 0),
            price: checkoutOrder.amount,
            totalAmount: checkoutOrder.amount,
            date: new Date().toISOString().split('T')[0],
            time: new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' }),
            category: checkoutOrder.items[0].medicine.category,
            status: 'processing',
            paymentMethod: paymentMethod as any,
            deliveryStatus: 'pending',
            orderId: checkoutOrder.orderId,
            transactionId
          };

          setTransactions(prev => [newTransaction, ...prev]);

          
          if (paymentMethod === 'wallet') {
            setWalletBalance(prev => prev - checkoutOrder.amount);
          }

          
          setCart([]);

          
          toast.success('🎉 Order placed successfully!');
          setShowPaymentGateway(false);
          setCheckoutOrder(null);
          setTrackingOrderId(checkoutOrder.orderId);
          setShowDeliveryTracking(true);
        }}
        walletBalance={walletBalance}
      />
    );
  }

  if (showDeliveryTracking && trackingOrderId) {
    return (
      <DeliveryTracking
        orderId={trackingOrderId}
        onBack={() => {
          setShowDeliveryTracking(false);
          setTrackingOrderId(null);
        }}
      />
    );
  }

  if (showPrescriptionUpload) {
    return (
      <PrescriptionUpload
        onBack={() => setShowPrescriptionUpload(false)}
        onPrescriptionVerified={(prescriptionId, medicines) => {
          toast.success('Prescription verified! You can now order these medicines.');
          setShowPrescriptionUpload(false);
        }}
      />
    );
  }

  
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50/50 via-blue-50/30 to-purple-50/20 backdrop-blur-sm">
      {}
      <AnimatePresence>
        {showCelebration && (
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none"
          >
            <div className="text-6xl animate-bounce">🎉✨💰</div>
            {}
            <div className="absolute inset-0">
              {[...Array(50)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-2 h-2 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full"
                  initial={{
                    x: typeof window !== 'undefined' ? Math.random() * window.innerWidth : Math.random() * 1200,
                    y: -10,
                    opacity: 1,
                    scale: Math.random() * 0.5 + 0.5
                  }}
                  animate={{
                    y: typeof window !== 'undefined' ? window.innerHeight + 10 : 800,
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
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-lg"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-white/95 backdrop-blur-xl rounded-3xl p-8 max-w-md w-full mx-4 shadow-2xl border border-white/50"
            >
              <div className="text-center mb-8">
                <motion.div 
                  className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-2xl"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                >
                  <motion.div
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  >
                    <Wallet className="w-10 h-10 text-white" />
                  </motion.div>
                </motion.div>
                <h3 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-2">Add Money to Wallet</h3>
                <p className="text-gray-600">Current Balance: ₹{walletBalance.toLocaleString()}</p>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Enter Amount
                  </label>
                  <Input
                    type="number"
                    placeholder="Enter amount (min ₹100)"
                    value={addAmount}
                    onChange={(e) => setAddAmount(e.target.value)}
                    className="text-center text-lg h-14 border-2 border-emerald-200 focus:border-emerald-400 rounded-2xl"
                  />
                </div>

                {}
                <div className="grid grid-cols-3 gap-3">
                  {[500, 1000, 2000, 5000, 10000, 15000].map(amount => (
                    <motion.div key={amount} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button
                        variant="outline"
                        onClick={() => setAddAmount(amount.toString())}
                        className="py-3 hover:bg-emerald-50 border-emerald-200 rounded-2xl transition-all duration-200"
                      >
                        ₹{amount.toLocaleString()}
                      </Button>
                    </motion.div>
                  ))}
                </div>

                {}
                <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl p-6 border border-emerald-200">
                  <h4 className="font-semibold text-emerald-800 mb-4 flex items-center">
                    <Sparkles className="w-5 h-5 mr-2" />
                    Wallet Benefits
                  </h4>
                  <div className="space-y-3 text-sm text-emerald-700">
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="w-4 h-4" />
                      <span>Instant payments during checkout</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="w-4 h-4" />
                      <span>Extra 2% cashback on all purchases</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="w-4 h-4" />
                      <span>Priority customer support</span>
                    </div>
                  </div>
                </div>

                {}
                <div className="flex space-x-4">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowAddMoney(false);
                      setAddAmount('');
                    }}
                    className="flex-1 h-12 rounded-2xl"
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
                    className="flex-1 h-12 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 rounded-2xl"
                  >
                    <DollarSign className="w-4 h-4 mr-2" />
                    Add Money
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {}
      <div className="bg-white/80 backdrop-blur-xl shadow-xl border-b border-emerald-100/50">
        <div className="flex items-center justify-between max-w-7xl mx-auto p-6">
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              size="sm"
              onClick={onBack}
              className="flex items-center space-x-2 hover:bg-emerald-50 border-emerald-200 rounded-2xl"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{t('back')}</span>
            </Button>
            <div className="flex items-center space-x-4">
              <motion.div 
                className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-3xl flex items-center justify-center shadow-2xl"
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
                  <Wallet className="w-8 h-8 text-white" />
                </motion.div>
              </motion.div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                  {t('pharmacyWallet')}
                </h1>
                <div className="flex items-center space-x-3">
                  <p className="text-gray-600">{t('availableBalance')}: ₹{walletBalance.toLocaleString()}</p>
                  <Badge className="bg-emerald-100 text-emerald-700 border border-emerald-200">
                    <Star className="w-3 h-3 mr-1" />
                    {loyaltyPoints} points
                  </Badge>
                </div>
              </div>
            </div>
          </div>
          
          {}
          <div className="flex items-center space-x-4">
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                onClick={() => setShowAddMoney(true)}
                className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white rounded-2xl px-6 py-3 shadow-lg"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Money
              </Button>
            </motion.div>
            
            <Button
              onClick={() => setShowPrescriptionUpload(true)}
              variant="outline"
              className="border-purple-200 hover:bg-purple-50 rounded-2xl px-6 py-3"
            >
              <Upload className="w-4 h-4 mr-2" />
              Upload Prescription
            </Button>
            
            <Button
              onClick={() => setActiveTab('cart')}
              variant="outline"
              className="border-emerald-200 hover:bg-emerald-50 relative rounded-2xl px-6 py-3"
            >
              <ShoppingCart className="w-4 h-4 mr-2" />
              Cart
              {cart.length > 0 && (
                <Badge className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-6 h-6 rounded-full flex items-center justify-center">
                  {cart.length}
                </Badge>
              )}
            </Button>
          </div>
        </div>
      </div>

      <div className="p-6 max-w-7xl mx-auto space-y-8">
        {}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative overflow-hidden"
        >
          <Card className="relative p-10 bg-gradient-to-br from-white/90 via-emerald-50/70 to-teal-50/70 backdrop-blur-2xl border border-white/60 shadow-2xl rounded-3xl">
            {}
            <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-br from-emerald-300/20 to-teal-300/20 rounded-full -translate-y-40 translate-x-40"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-blue-300/20 to-purple-300/20 rounded-full translate-y-32 -translate-x-32"></div>
            <div className="absolute top-1/2 left-1/2 w-32 h-32 bg-gradient-to-r from-emerald-200/10 to-teal-200/10 rounded-full animate-pulse"></div>
            
            <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between space-y-8 lg:space-y-0">
              {}
              <div className="flex items-center space-x-8">
                <motion.div
                  className="relative"
                  whileHover={{ scale: 1.15, rotate: 10 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  <div className="w-28 h-28 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-3xl flex items-center justify-center shadow-2xl">
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
                      <Wallet className="w-14 h-14 text-white" />
                    </motion.div>
                  </div>
                  {}
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-3xl opacity-40 blur-2xl animate-pulse"></div>
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-300 to-teal-400 rounded-3xl opacity-20 blur-3xl"></div>
                </motion.div>
                
                <div className="space-y-3">
                  <p className="text-lg font-semibold text-gray-700">Available Balance</p>
                  <motion.div 
                    className="flex items-center space-x-3"
                    animate={balanceAnimation ? { scale: [1, 1.15, 1] } : {}}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                  >
                    <h2 className="text-5xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                      ₹{walletBalance.toLocaleString()}
                    </h2>
                    <motion.div
                      animate={{ 
                        scale: [1, 1.3, 1],
                        rotate: [0, 180, 360]
                      }}
                      transition={{ duration: 3, repeat: Infinity }}
                    >
                      <Sparkles className="w-8 h-8 text-emerald-500" />
                    </motion.div>
                  </motion.div>
                  <div className="flex items-center space-x-4">
                    <Badge className="bg-emerald-100 text-emerald-700 border border-emerald-300 px-3 py-1 rounded-2xl">
                      <Star className="w-4 h-4 mr-1" />
                      {loyaltyPoints} points
                    </Badge>
                    <Badge className="bg-blue-100 text-blue-700 border border-blue-300 px-3 py-1 rounded-2xl">
                      <Target className="w-4 h-4 mr-1" />
                      {currentStreak} day streak
                    </Badge>
                    <Badge className="bg-purple-100 text-purple-700 border border-purple-300 px-3 py-1 rounded-2xl">
                      <Award className="w-4 h-4 mr-1" />
                      Premium
                    </Badge>
                  </div>
                </div>
              </div>

              {}
              <div className="flex flex-col space-y-6">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    onClick={() => setShowAddMoney(true)}
                    className="relative overflow-hidden bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white px-10 py-5 rounded-3xl shadow-2xl font-bold text-xl transition-all duration-300 group"
                  >
                    {}
                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-teal-500 opacity-0 group-hover:opacity-40 transition-opacity duration-300 rounded-3xl blur-2xl"></div>
                    <div className="relative flex items-center space-x-3">
                      <motion.div
                        animate={{ rotate: [0, 360] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                      >
                        <Plus className="w-6 h-6" />
                      </motion.div>
                      <span>Add Money</span>
                      <Sparkles className="w-5 h-5" />
                    </div>
                    {}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                  </Button>
                </motion.div>

                {}
                <div className="grid grid-cols-2 gap-6">
                  <motion.div 
                    className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 border border-white/60 shadow-xl"
                    whileHover={{ scale: 1.05, y: -5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <div className="flex items-center space-x-3 mb-2">
                      <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-emerald-500 rounded-2xl flex items-center justify-center">
                        <TrendingUp className="w-5 h-5 text-white" />
                      </div>
                      <span className="text-sm font-medium text-gray-600">This Month</span>
                    </div>
                    <p className="text-2xl font-bold text-gray-800">₹{transactions.filter(t => new Date(t.date).getMonth() === new Date().getMonth()).reduce((sum, t) => sum + t.totalAmount, 0).toLocaleString()}</p>
                  </motion.div>
                  <motion.div 
                    className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 border border-white/60 shadow-xl"
                    whileHover={{ scale: 1.05, y: -5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <div className="flex items-center space-x-3 mb-2">
                      <div className="w-10 h-10 bg-gradient-to-r from-purple-400 to-pink-500 rounded-2xl flex items-center justify-center">
                        <Gift className="w-5 h-5 text-white" />
                      </div>
                      <span className="text-sm font-medium text-gray-600">Total Saved</span>
                    </div>
                    <p className="text-2xl font-bold text-gray-800">₹{transactions.reduce((sum, t) => sum + (t.savings || 0), 0).toLocaleString()}</p>
                  </motion.div>
                </div>
              </div>
            </div>

            {}
            <div className="relative z-10 mt-8 pt-8 border-t border-white/40">
              <div className="flex items-center justify-between mb-4">
                <span className="text-lg font-semibold text-gray-700">Monthly Spending Goal</span>
                <span className="text-lg text-gray-600 font-medium">
                  ₹{transactions.filter(t => new Date(t.date).getMonth() === new Date().getMonth()).reduce((sum, t) => sum + t.totalAmount, 0).toLocaleString()} / ₹{monthlySpendingGoal.toLocaleString()}
                </span>
              </div>
              <div className="relative h-4 bg-white/60 rounded-full overflow-hidden shadow-inner">
                <motion.div
                  className="h-full bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 rounded-full shadow-lg"
                  initial={{ width: 0 }}
                  animate={{ 
                    width: `${Math.min((transactions.filter(t => new Date(t.date).getMonth() === new Date().getMonth()).reduce((sum, t) => sum + t.totalAmount, 0) / monthlySpendingGoal) * 100, 100)}%` 
                  }}
                  transition={{ duration: 2, ease: "easeOut" }}
                />
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-300/40 to-teal-300/40 animate-pulse"></div>
                {}
                <motion.div
                  className="absolute top-1/2 transform -translate-y-1/2 w-4 h-4 bg-white rounded-full shadow-lg border-2 border-emerald-500"
                  initial={{ left: '0%' }}
                  animate={{ 
                    left: `${Math.min((transactions.filter(t => new Date(t.date).getMonth() === new Date().getMonth()).reduce((sum, t) => sum + t.totalAmount, 0) / monthlySpendingGoal) * 100, 100)}%` 
                  }}
                  transition={{ duration: 2, ease: "easeOut" }}
                  style={{ marginLeft: '-8px' }}
                />
              </div>
              <div className="flex justify-between mt-2 text-sm text-gray-600">
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
          className="bg-white/90 backdrop-blur-2xl rounded-3xl p-3 shadow-2xl border border-white/60"
        >
          <div className="grid grid-cols-5 gap-3">
            {[
              { id: 'medicines', icon: Pill, label: t('medicines'), badge: filteredAndSortedMedicines.length },
              { id: 'cart', icon: ShoppingCart, label: 'Cart', badge: cart.length },
              { id: 'history', icon: History, label: t('purchaseHistory'), badge: transactions.length },
              { id: 'statement', icon: Download, label: t('monthlyStatement'), badge: null },
              { id: 'prescriptions', icon: FileText, label: 'Prescriptions', badge: null }
            ].map((tab) => (
              <motion.div key={tab.id} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <Button
                  variant="ghost"
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`w-full h-20 rounded-2xl transition-all duration-300 ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-xl'
                      : 'hover:bg-emerald-50 text-gray-600 hover:shadow-lg'
                  }`}
                >
                  <div className="flex flex-col items-center space-y-2">
                    <div className="flex items-center space-x-2">
                      <tab.icon className="w-6 h-6" />
                      {tab.badge !== null && tab.badge > 0 && (
                        <Badge className={`text-xs ${
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

        {}
        {activeTab === 'medicines' && (
          <div className="space-y-8">
            {}
            <Card className="p-6 bg-gradient-to-r from-white/90 via-blue-50/20 to-purple-50/20 backdrop-blur-xl border border-blue-200/30 shadow-2xl rounded-3xl">
              <div className="flex flex-col lg:flex-row gap-6">
                {}
                <div className="flex-1 relative">
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2 flex items-center space-x-2">
                    <Search className="w-5 h-5 text-emerald-500" />
                    <div className="w-px h-6 bg-gray-300"></div>
                  </div>
                  <Input
                    placeholder="Search medicines, brands, or generic names..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-16 h-14 text-base border-2 border-gray-200 focus:border-emerald-400 focus:ring-emerald-400/20 bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm transition-all duration-200"
                  />
                  {searchTerm && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSearchTerm('')}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  )}
                </div>

                {/* Filter Controls */}
                <div className="flex items-center space-x-4">
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button
                      variant="outline"
                      onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                      className={`h-14 px-6 border-2 rounded-2xl transition-all duration-300 ${
                        showAdvancedFilters
                          ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white border-transparent shadow-xl'
                          : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50 bg-white/80 backdrop-blur-sm'
                      }`}
                    >
                      <Filter className="w-5 h-5 mr-2" />
                      <span className="font-medium">Filters</span>
                      {(selectedBrands.length > 0 || showPrescriptionOnly || showInStockOnly || priceRange[0] > 0 || priceRange[1] < 1000) && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="ml-2"
                        >
                          <Badge className={`${
                            showAdvancedFilters 
                              ? 'bg-white/20 text-white' 
                              : 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white'
                          } font-semibold`}>
                            {
                              selectedBrands.length + 
                              (showPrescriptionOnly ? 1 : 0) + 
                              (showInStockOnly ? 1 : 0) + 
                              (priceRange[0] > 0 || priceRange[1] < 1000 ? 1 : 0)
                            }
                          </Badge>
                        </motion.div>
                      )}
                    </Button>
                  </motion.div>
                  
                  {}
                  <div className="relative">
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as any)}
                      className="h-14 px-4 pr-10 bg-white/80 backdrop-blur-sm border-2 border-gray-200 rounded-2xl focus:border-emerald-400 focus:outline-none transition-all duration-200 appearance-none cursor-pointer"
                    >
                      <option value="popularity">Most Popular</option>
                      <option value="name">Name A-Z</option>
                      <option value="price-low">Price: Low to High</option>
                      <option value="price-high">Price: High to Low</option>
                      <option value="rating">Highest Rated</option>
                    </select>
                    <ChevronRight className="absolute right-3 top-1/2 transform -translate-y-1/2 rotate-90 w-4 h-4 text-gray-400 pointer-events-none" />
                  </div>

                  {}
                  <div className="flex items-center bg-white/80 backdrop-blur-sm border-2 border-gray-200 rounded-2xl overflow-hidden shadow-sm">
                    {[
                      { 
                        mode: 'grid', 
                        icon: (
                          <div className="grid grid-cols-2 gap-0.5 w-4 h-4">
                            <div className="bg-current w-1.5 h-1.5 rounded-sm"></div>
                            <div className="bg-current w-1.5 h-1.5 rounded-sm"></div>
                            <div className="bg-current w-1.5 h-1.5 rounded-sm"></div>
                            <div className="bg-current w-1.5 h-1.5 rounded-sm"></div>
                          </div>
                        )
                      },
                      { 
                        mode: 'list', 
                        icon: (
                          <div className="space-y-1 w-4 h-4">
                            <div className="bg-current w-4 h-0.5 rounded"></div>
                            <div className="bg-current w-4 h-0.5 rounded"></div>
                            <div className="bg-current w-4 h-0.5 rounded"></div>
                            <div className="bg-current w-4 h-0.5 rounded"></div>
                          </div>
                        )
                      },
                      { 
                        mode: 'compact', 
                        icon: (
                          <div className="space-y-0.5 w-4 h-4">
                            <div className="bg-current w-4 h-0.5 rounded"></div>
                            <div className="bg-current w-4 h-0.5 rounded"></div>
                            <div className="bg-current w-4 h-0.5 rounded"></div>
                            <div className="bg-current w-4 h-0.5 rounded"></div>
                            <div className="bg-current w-4 h-0.5 rounded"></div>
                            <div className="bg-current w-4 h-0.5 rounded"></div>
                          </div>
                        )
                      }
                    ].map((view) => (
                      <motion.div key={view.mode} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setViewMode(view.mode as any)}
                          className={`h-12 w-12 p-0 rounded-none transition-all duration-200 ${
                            viewMode === view.mode
                              ? 'bg-emerald-500 text-white'
                              : 'hover:bg-emerald-50 text-gray-600'
                          }`}
                        >
                          {view.icon}
                        </Button>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>

              {}
              <div className="mt-6">
                <div className="flex items-center space-x-3 flex-wrap gap-2">
                  {categories.map((category) => (
                    <motion.div key={category.id} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedCategory(category.id)}
                        className={`rounded-2xl px-4 py-2 border-2 transition-all duration-300 ${
                          selectedCategory === category.id
                            ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white border-transparent shadow-lg'
                            : 'border-gray-200 hover:border-emerald-300 hover:bg-emerald-50 bg-white/60'
                        }`}
                      >
                        <span className="text-lg mr-2">{category.icon}</span>
                        <span className="font-medium">{category.name}</span>
                        {selectedCategory === category.id && (
                          <Badge className="ml-2 bg-white/20 text-white">
                            {filteredAndSortedMedicines.length}
                          </Badge>
                        )}
                      </Button>
                    </motion.div>
                  ))}
                </div>
              </div>
            </Card>

            {}
            <AnimatePresence>
              {showAdvancedFilters && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.4, ease: "easeInOut" }}
                  className="overflow-hidden"
                >
                  <Card className="p-8 bg-gradient-to-br from-white/95 via-purple-50/60 to-blue-50/60 backdrop-blur-2xl border border-purple-200/40 shadow-2xl rounded-3xl">
                    <div className="flex items-center justify-between mb-8">
                      <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Advanced Filters</h3>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setPriceRange([0, 1000]);
                          setSelectedBrands([]);
                          setShowPrescriptionOnly(false);
                          setShowInStockOnly(false);
                        }}
                        className="border-red-200 text-red-600 hover:bg-red-50 rounded-2xl"
                      >
                        <FilterX className="w-4 h-4 mr-1" />
                        Clear All
                      </Button>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                      {}
                      <div className="space-y-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-emerald-500 rounded-2xl flex items-center justify-center">
                            <DollarSign className="w-5 h-5 text-white" />
                          </div>
                          <h4 className="text-lg font-semibold text-gray-800">Price Range</h4>
                        </div>
                        <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-white/50">
                          <div className="space-y-4">
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium text-gray-600">₹{priceRange[0]}</span>
                              <span className="text-sm font-medium text-gray-600">₹{priceRange[1]}</span>
                            </div>
                            <div className="relative">
                              <input
                                type="range"
                                min="0"
                                max="1000"
                                value={priceRange[0]}
                                onChange={(e) => setPriceRange([parseInt(e.target.value), priceRange[1]])}
                                className="absolute w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                              />
                              <input
                                type="range"
                                min="0"
                                max="1000"
                                value={priceRange[1]}
                                onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                                className="absolute w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                              />
                            </div>
                            <div className="grid grid-cols-4 gap-2 mt-4">
                              {[50, 100, 200, 500].map(price => (
                                <Button
                                  key={price}
                                  variant="outline"
                                  size="sm"
                                  onClick={() => setPriceRange([0, price])}
                                  className="text-xs rounded-xl hover:bg-emerald-50 border-emerald-200"
                                >
                                  ≤₹{price}
                                </Button>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>

                      {}
                      <div className="space-y-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-r from-blue-400 to-purple-500 rounded-2xl flex items-center justify-center">
                            <Award className="w-5 h-5 text-white" />
                          </div>
                          <h4 className="text-lg font-semibold text-gray-800">Brands</h4>
                        </div>
                        <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-white/50 max-h-64 overflow-y-auto scrollbar-hide">
                          <div className="space-y-3">
                            {uniqueBrands.map(brand => (
                              <motion.div key={brand} whileHover={{ scale: 1.02 }}>
                                <label className="flex items-center space-x-3 cursor-pointer p-2 rounded-xl hover:bg-purple-50 transition-colors">
                                  <div className="relative">
                                    <input
                                      type="checkbox"
                                      checked={selectedBrands.includes(brand)}
                                      onChange={(e) => {
                                        if (e.target.checked) {
                                          setSelectedBrands([...selectedBrands, brand]);
                                        } else {
                                          setSelectedBrands(selectedBrands.filter(b => b !== brand));
                                        }
                                      }}
                                      className="sr-only"
                                    />
                                    <div className={`w-5 h-5 rounded-lg border-2 transition-all duration-200 ${
                                      selectedBrands.includes(brand)
                                        ? 'bg-gradient-to-r from-blue-500 to-purple-500 border-transparent'
                                        : 'border-gray-300 bg-white'
                                    }`}>
                                      {selectedBrands.includes(brand) && (
                                        <CheckCircle className="w-5 h-5 text-white" />
                                      )}
                                    </div>
                                  </div>
                                  <span className="text-gray-700 font-medium">{brand}</span>
                                  <Badge variant="outline" className="ml-auto text-xs">
                                    {medicines.filter(m => m.manufacturer === brand).length}
                                  </Badge>
                                </label>
                              </motion.div>
                            ))}
                          </div>
                        </div>
                      </div>

                      {}
                      <div className="space-y-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-r from-purple-400 to-pink-500 rounded-2xl flex items-center justify-center">
                            <Settings className="w-5 h-5 text-white" />
                          </div>
                          <h4 className="text-lg font-semibold text-gray-800">Special Filters</h4>
                        </div>
                        <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-white/50 space-y-6">
                          <motion.div whileHover={{ scale: 1.02 }}>
                            <label className="flex items-center space-x-4 cursor-pointer p-3 rounded-xl hover:bg-pink-50 transition-colors">
                              <div className="relative">
                                <input
                                  type="checkbox"
                                  checked={showPrescriptionOnly}
                                  onChange={(e) => setShowPrescriptionOnly(e.target.checked)}
                                  className="sr-only"
                                />
                                <div className={`w-6 h-6 rounded-xl border-2 transition-all duration-200 ${
                                  showPrescriptionOnly
                                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 border-transparent'
                                    : 'border-gray-300 bg-white'
                                }`}>
                                  {showPrescriptionOnly && (
                                    <Shield className="w-6 h-6 text-white p-1" />
                                  )}
                                </div>
                              </div>
                              <div>
                                <span className="font-semibold text-gray-800">Prescription Required</span>
                                <p className="text-sm text-gray-600">Show only prescription medicines</p>
                              </div>
                            </label>
                          </motion.div>

                          <motion.div whileHover={{ scale: 1.02 }}>
                            <label className="flex items-center space-x-4 cursor-pointer p-3 rounded-xl hover:bg-green-50 transition-colors">
                              <div className="relative">
                                <input
                                  type="checkbox"
                                  checked={showInStockOnly}
                                  onChange={(e) => setShowInStockOnly(e.target.checked)}
                                  className="sr-only"
                                />
                                <div className={`w-6 h-6 rounded-xl border-2 transition-all duration-200 ${
                                  showInStockOnly
                                    ? 'bg-gradient-to-r from-green-500 to-emerald-500 border-transparent'
                                    : 'border-gray-300 bg-white'
                                }`}>
                                  {showInStockOnly && (
                                    <Package className="w-6 h-6 text-white p-1" />
                                  )}
                                </div>
                              </div>
                              <div>
                                <span className="font-semibold text-gray-800">In Stock Only</span>
                                <p className="text-sm text-gray-600">Show only available medicines</p>
                              </div>
                            </label>
                          </motion.div>

                          {}
                          <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl border border-blue-200">
                            <div className="flex items-center justify-between">
                              <span className="font-semibold text-blue-800">Results Found:</span>
                              <Badge className="bg-gradient-to-r from-blue-500 to-purple-500 text-white text-lg px-3 py-1">
                                {filteredAndSortedMedicines.length}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>

            {}
            <div className="floating-button fixed bottom-6 right-6 z-40 flex flex-col space-y-4">
              {}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.8, type: "spring", stiffness: 200 }}
              >
                <Button
                  onClick={() => {
                    setShowQuickReorder(!showQuickReorder);
                    setShowRecommended(false);
                  }}
                  className={`floating-button w-16 h-16 rounded-full shadow-2xl transition-all duration-300 ${
                    showQuickReorder 
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 rotate-45' 
                      : 'bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600'
                  }`}
                >
                  <Repeat className="w-6 h-6 text-white" />
                </Button>
              </motion.div>

              {}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.9, type: "spring", stiffness: 200 }}
              >
                <Button
                  onClick={() => {
                    setShowRecommended(!showRecommended);
                    setShowQuickReorder(false);
                  }}
                  className={`floating-button w-16 h-16 rounded-full shadow-2xl transition-all duration-300 ${
                    showRecommended 
                      ? 'bg-gradient-to-r from-emerald-600 to-green-600 rotate-45' 
                      : 'bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600'
                  }`}
                >
                  <ThumbsUp className="w-6 h-6 text-white" />
                </Button>
              </motion.div>
            </div>

            {}
            <AnimatePresence>
              {showQuickReorder && (
                <motion.div
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 20, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                  className="fixed bottom-24 right-6 z-30 w-96 max-w-[90vw]"
                >
                  <Card className="floating-panel p-6 bg-gradient-to-r from-white/95 via-blue-50/80 to-purple-50/80 backdrop-blur-2xl border border-white/70 shadow-2xl rounded-3xl">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center">
                          <Repeat className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-gray-800">Quick Reorder</h3>
                          <p className="text-xs text-gray-600">One-click reorder</p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowQuickReorder(false)}
                        className="w-8 h-8 p-0 rounded-full hover:bg-white/50"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                    
                    <div className="space-y-3 max-h-64 overflow-y-auto scrollbar-hide">
                      {transactions.slice(0, 4).map((transaction) => (
                        <motion.div
                          key={transaction.id}
                          className="bg-white/70 backdrop-blur-sm rounded-xl p-3 border border-white/50 hover:shadow-md transition-all duration-300"
                          whileHover={{ scale: 1.02 }}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <h4 className="font-semibold text-gray-800 text-sm line-clamp-1">{transaction.medicineName}</h4>
                              <p className="text-xs text-gray-600">₹{transaction.price} • {transaction.date}</p>
                            </div>
                            <Button
                              size="sm"
                              className="ml-3 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white rounded-xl text-xs px-3 py-1"
                              onClick={() => {
                                toast.success('🛒 Added to cart!');
                              }}
                            >
                              <Plus className="w-3 h-3 mr-1" />
                              Reorder
                            </Button>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>

            {}
            <AnimatePresence>
              {showRecommended && (
                <motion.div
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 20, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                  className="fixed bottom-24 right-6 z-30 w-96 max-w-[90vw]"
                >
                  <Card className="floating-panel p-6 bg-gradient-to-r from-white/95 via-green-50/80 to-emerald-50/80 backdrop-blur-2xl border border-white/70 shadow-2xl rounded-3xl">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-green-500 rounded-2xl flex items-center justify-center">
                          <ThumbsUp className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-gray-800">Recommended</h3>
                          <div className="flex items-center space-x-1">
                            <Sparkles className="w-3 h-3 text-emerald-600" />
                            <p className="text-xs text-gray-600">AI Powered</p>
                          </div>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowRecommended(false)}
                        className="w-8 h-8 p-0 rounded-full hover:bg-white/50"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                    
                    <div className="space-y-3 max-h-64 overflow-y-auto scrollbar-hide">
                      {medicines.slice(0, 4).map((medicine) => (
                        <motion.div
                          key={medicine.id}
                          className="bg-white/70 backdrop-blur-sm rounded-xl p-3 border border-white/50 hover:shadow-md transition-all duration-300"
                          whileHover={{ scale: 1.02 }}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3 flex-1">
                              <div className="w-10 h-10 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-xl flex items-center justify-center">
                                <Pill className="w-5 h-5 text-emerald-600" />
                              </div>
                              <div className="flex-1">
                                <h4 className="font-semibold text-gray-800 text-sm line-clamp-1">{medicine.name}</h4>
                                <div className="flex items-center space-x-2">
                                  <p className="text-xs text-gray-600">₹{medicine.price}</p>
                                  {medicine.discount && (
                                    <Badge className="bg-red-100 text-red-600 text-xs px-1 py-0">{medicine.discount}% OFF</Badge>
                                  )}
                                </div>
                              </div>
                            </div>
                            <Button
                              size="sm"
                              className="ml-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white rounded-xl text-xs px-3 py-1"
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
                              <Plus className="w-3 h-3 mr-1" />
                              Add
                            </Button>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>

            {}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <h3 className="text-xl font-bold text-gray-800">
                  {selectedCategory === 'all' ? 'All Medicines' : categories.find(c => c.id === selectedCategory)?.name}
                </h3>
                <Badge className="bg-emerald-100 text-emerald-700 px-3 py-1 text-lg">
                  {filteredAndSortedMedicines.length} results
                </Badge>
              </div>
              <div className="text-sm text-gray-600">
                Sorted by: {sortBy === 'popularity' ? 'Most Popular' : sortBy === 'name' ? 'Name A-Z' : sortBy === 'price-low' ? 'Price: Low to High' : sortBy === 'price-high' ? 'Price: High to Low' : 'Highest Rated'}
              </div>
            </div>

            {}
            {viewMode === 'grid' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredAndSortedMedicines.map((medicine, index) => (
                  <motion.div
                    key={medicine.id}
                    className="group"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ 
                      scale: 1.05, 
                      y: -8,
                      transition: { type: "spring", stiffness: 300, damping: 20 }
                    }}
                  >
                    <Card className="relative p-6 bg-white/90 backdrop-blur-xl border border-white/60 shadow-xl rounded-3xl overflow-hidden transition-all duration-300 group-hover:shadow-2xl">
                      {}
                      <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-3xl blur-xl"></div>
                      
                      <div className="relative z-10">
                        {}
                        {medicine.discount && (
                          <div className="absolute -top-2 -right-2 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                            {medicine.discount}% OFF
                          </div>
                        )}

                        {}
                        <div className="w-16 h-16 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                          <Pill className="w-8 h-8 text-emerald-600" />
                        </div>

                        {}
                        <div className="text-center mb-4">
                          <h3 className="font-bold text-gray-800 mb-1 line-clamp-2">{medicine.name}</h3>
                          <p className="text-sm text-gray-600 mb-2 line-clamp-1">{medicine.genericName}</p>
                          <p className="text-xs text-gray-500">{medicine.manufacturer}</p>
                        </div>

                        {}
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex flex-col items-start">
                            <span className="text-xl font-bold text-emerald-600">₹{medicine.price}</span>
                            {medicine.discount && (
                              <span className="text-xs text-gray-500 line-through">₹{Math.round(medicine.price / (1 - medicine.discount / 100))}</span>
                            )}
                          </div>
                          {medicine.rating && (
                            <div className="flex items-center space-x-1">
                              <Star className="w-4 h-4 text-yellow-500 fill-current" />
                              <span className="text-sm font-medium">{medicine.rating}</span>
                              <span className="text-xs text-gray-500">({medicine.reviews})</span>
                            </div>
                          )}
                        </div>

                        {}
                        <div className="flex items-center justify-between mb-4">
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
                            <Badge className="bg-blue-100 text-blue-700 text-xs">
                              <Shield className="w-3 h-3 mr-1" />
                              Rx
                            </Badge>
                          )}
                        </div>

                        {}
                        <Button
                          disabled={medicine.stock === 0}
                          className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed"
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
                          <Plus className="w-4 h-4 mr-2" />
                          {medicine.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                        </Button>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}

            {}
            {viewMode === 'list' && (
              <div className="space-y-4">
                {filteredAndSortedMedicines.map((medicine, index) => (
                  <motion.div
                    key={medicine.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.03 }}
                    whileHover={{ scale: 1.02 }}
                  >
                    <Card className="p-6 bg-white/90 backdrop-blur-xl border border-white/60 shadow-lg rounded-2xl hover:shadow-xl transition-all duration-300">
                      <div className="flex items-center space-x-6">
                        {}
                        <div className="w-20 h-20 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-2xl flex items-center justify-center flex-shrink-0">
                          <Pill className="w-10 h-10 text-emerald-600" />
                        </div>

                        {}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h3 className="text-lg font-bold text-gray-800 mb-1">{medicine.name}</h3>
                              <p className="text-gray-600 mb-2">{medicine.genericName}</p>
                              <p className="text-sm text-gray-500 mb-3">{medicine.manufacturer} • {medicine.dosage}</p>
                              
                              <div className="flex items-center space-x-4">
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
                                  <Badge className="bg-blue-100 text-blue-700 text-xs">
                                    <Shield className="w-3 h-3 mr-1" />
                                    Prescription Required
                                  </Badge>
                                )}
                                {medicine.rating && (
                                  <div className="flex items-center space-x-1">
                                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                                    <span className="text-sm font-medium">{medicine.rating}</span>
                                    <span className="text-xs text-gray-500">({medicine.reviews} reviews)</span>
                                  </div>
                                )}
                              </div>
                            </div>

                            {}
                            <div className="text-right flex-shrink-0 ml-4">
                              <div className="mb-4">
                                <span className="text-2xl font-bold text-emerald-600">₹{medicine.price}</span>
                                {medicine.discount && (
                                  <div>
                                    <span className="text-sm text-gray-500 line-through">₹{Math.round(medicine.price / (1 - medicine.discount / 100))}</span>
                                    <Badge className="ml-2 bg-red-100 text-red-700 text-xs">{medicine.discount}% OFF</Badge>
                                  </div>
                                )}
                              </div>
                              
                              <Button
                                disabled={medicine.stock === 0}
                                className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white rounded-2xl px-6 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
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
                                <Plus className="w-4 h-4 mr-2" />
                                {medicine.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}

            {}
            {viewMode === 'compact' && (
              <div className="space-y-2">
                {filteredAndSortedMedicines.map((medicine, index) => (
                  <motion.div
                    key={medicine.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.02 }}
                    whileHover={{ scale: 1.01 }}
                  >
                    <Card className="p-4 bg-white/90 backdrop-blur-xl border border-white/60 shadow-md rounded-xl hover:shadow-lg transition-all duration-200">
                      <div className="flex items-center space-x-4">
                        {}
                        <div className="w-12 h-12 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-xl flex items-center justify-center flex-shrink-0">
                          <Pill className="w-6 h-6 text-emerald-600" />
                        </div>

                        {}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <div className="flex-1 min-w-0">
                              <h4 className="font-bold text-gray-800 truncate">{medicine.name}</h4>
                              <p className="text-sm text-gray-600 truncate">{medicine.manufacturer} • {medicine.dosage}</p>
                            </div>
                            
                            <div className="flex items-center space-x-4 flex-shrink-0">
                              {}
                              <div className={`w-3 h-3 rounded-full ${
                                medicine.stock > 50 
                                  ? 'bg-green-500' 
                                  : medicine.stock > 10 
                                  ? 'bg-yellow-500' 
                                  : 'bg-red-500'
                              }`}></div>
                              
                              {}
                              <div className="text-right">
                                <span className="text-lg font-bold text-emerald-600">₹{medicine.price}</span>
                                {medicine.discount && (
                                  <span className="ml-2 text-xs bg-red-100 text-red-700 px-2 py-1 rounded">{medicine.discount}% OFF</span>
                                )}
                              </div>
                              
                              {}
                              <Button
                                size="sm"
                                disabled={medicine.stock === 0}
                                className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white rounded-xl px-3 py-1 disabled:opacity-50"
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
                                <Plus className="w-3 h-3" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}

            {}
            {filteredAndSortedMedicines.length === 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-12"
              >
                <div className="w-24 h-24 bg-gray-100 rounded-3xl flex items-center justify-center mx-auto mb-6">
                  <Search className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">No medicines found</h3>
                <p className="text-gray-600 mb-6">Try adjusting your search criteria or filters</p>
                <Button
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedCategory('all');
                    setPriceRange([0, 1000]);
                    setSelectedBrands([]);
                    setShowPrescriptionOnly(false);
                    setShowInStockOnly(false);
                  }}
                  className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-2xl"
                >
                  Clear All Filters
                </Button>
              </motion.div>
            )}
          </div>
        )}

        {}
        {activeTab === 'cart' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <Card className="p-8 bg-white/90 backdrop-blur-xl border border-white/60 shadow-xl rounded-3xl">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Shopping Cart</h2>
                <Badge className="bg-emerald-100 text-emerald-700">{cart.length} items</Badge>
              </div>
              
              {cart.length === 0 ? (
                <div className="text-center py-12">
                  <ShoppingCart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 text-lg">Your cart is empty</p>
                  <Button
                    onClick={() => setActiveTab('medicines')}
                    className="mt-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-2xl"
                  >
                    Browse Medicines
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {cart.map((item) => (
                    <motion.div
                      key={item.medicine.id}
                      className="flex items-center justify-between p-4 bg-white/80 backdrop-blur-sm rounded-2xl border border-white/50"
                      whileHover={{ scale: 1.02 }}
                    >
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-xl flex items-center justify-center">
                          <Pill className="w-6 h-6 text-emerald-600" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-800">{item.medicine.name}</h4>
                          <p className="text-sm text-gray-600">{item.medicine.manufacturer}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
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
                            className="w-8 h-8 p-0 rounded-xl"
                          >
                            <Minus className="w-4 h-4" />
                          </Button>
                          <span className="w-8 text-center font-medium">{item.quantity}</span>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setCart(cart.map(cartItem => 
                                cartItem.medicine.id === item.medicine.id 
                                  ? { ...cartItem, quantity: cartItem.quantity + 1 }
                                  : cartItem
                              ));
                            }}
                            className="w-8 h-8 p-0 rounded-xl"
                          >
                            <Plus className="w-4 h-4" />
                          </Button>
                        </div>
                        
                        <div className="text-right">
                          <p className="font-bold text-emerald-600">₹{(item.medicine.price * item.quantity).toLocaleString()}</p>
                          {item.medicine.discount && (
                            <p className="text-sm text-gray-500">Save ₹{Math.round(item.medicine.price * item.medicine.discount / 100 * item.quantity)}</p>
                          )}
                        </div>
                        
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => {
                            setCart(cart.filter(cartItem => cartItem.medicine.id !== item.medicine.id));
                          }}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50 rounded-xl"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    </motion.div>
                  ))}
                  
                  {}
                  <div className="mt-8 p-6 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl border border-emerald-200">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-lg font-semibold">Total Amount:</span>
                      <span className="text-2xl font-bold text-emerald-600">
                        ₹{cart.reduce((sum, item) => sum + (item.medicine.price * item.quantity), 0).toLocaleString()}
                      </span>
                    </div>
                    <Button
                      className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white rounded-2xl py-4 text-lg font-semibold"
                      onClick={() => {
                        toast.success('🛒 Proceeding to checkout!');
                        setShowCheckout(true);
                      }}
                    >
                      <ShoppingCart className="w-5 h-5 mr-2" />
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
            className="space-y-6"
          >
            <Card className="p-8 bg-white/90 backdrop-blur-xl border border-white/60 shadow-xl rounded-3xl">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-gray-800">Purchase History</h2>
                <div className="flex items-center space-x-4">
                  <Button
                    variant="outline"
                    onClick={() => setShowFilters(!showFilters)}
                    className="border-blue-200 hover:bg-blue-50 rounded-2xl"
                  >
                    <Filter className="w-4 h-4 mr-2" />
                    Filters
                    {(dateFilter !== 'all' || amountFilter !== 'all' || statusFilter !== 'all') && (
                      <Badge className="ml-2 bg-blue-500 text-white">
                        {(dateFilter !== 'all' ? 1 : 0) + (amountFilter !== 'all' ? 1 : 0) + (statusFilter !== 'all' ? 1 : 0)}
                      </Badge>
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    className="border-emerald-200 hover:bg-emerald-50 rounded-2xl"
                    onClick={() => toast.success('📄 PDF downloaded!')}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download PDF
                  </Button>
                </div>
              </div>

              {}
              <AnimatePresence>
                {showFilters && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mb-8 overflow-hidden"
                  >
                    <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 border border-blue-200">
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        {}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
                          <select
                            value={dateFilter}
                            onChange={(e) => setDateFilter(e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none"
                          >
                            <option value="all">All Time</option>
                            <option value="today">Today</option>
                            <option value="week">This Week</option>
                            <option value="month">This Month</option>
                            <option value="year">This Year</option>
                          </select>
                        </div>

                        {}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Amount Range</label>
                          <select
                            value={amountFilter}
                            onChange={(e) => setAmountFilter(e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none"
                          >
                            <option value="all">All Amounts</option>
                            <option value="low">Under ₹100</option>
                            <option value="medium">₹100 - ₹500</option>
                            <option value="high">Above ₹500</option>
                          </select>
                        </div>

                        {}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                          <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none"
                          >
                            <option value="all">All Status</option>
                            <option value="delivered">Delivered</option>
                            <option value="shipped">Shipped</option>
                            <option value="processing">Processing</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        </div>

                        {}
                        <div className="flex items-end">
                          <Button
                            variant="outline"
                            onClick={() => {
                              setDateFilter('all');
                              setAmountFilter('all');
                              setStatusFilter('all');
                            }}
                            className="w-full border-red-200 text-red-600 hover:bg-red-50 rounded-xl"
                          >
                            <FilterX className="w-4 h-4 mr-2" />
                            Clear
                          </Button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {}
              <div className="relative">
                {}
                <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-emerald-500 to-teal-500"></div>
                
                <div className="space-y-8">
                  {filteredTransactions.length === 0 ? (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-center py-12"
                    >
                      <div className="w-24 h-24 bg-gray-100 rounded-3xl flex items-center justify-center mx-auto mb-6">
                        <History className="w-12 h-12 text-gray-400" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-800 mb-2">No transactions found</h3>
                      <p className="text-gray-600 mb-6">Try adjusting your filter criteria</p>
                      <Button
                        onClick={() => {
                          setDateFilter('all');
                          setAmountFilter('all');
                          setStatusFilter('all');
                        }}
                        className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-2xl"
                      >
                        Clear All Filters
                      </Button>
                    </motion.div>
                  ) : (
                    filteredTransactions.map((transaction, index) => (
                    <motion.div
                      key={transaction.id}
                      className="relative flex items-start space-x-6 group cursor-pointer"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ scale: 1.02 }}
                      onClick={() => setSelectedTransaction(transaction)}
                    >
                      {}
                      <div className="relative z-10">
                        <motion.div
                          className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform duration-300"
                          whileHover={{ rotate: 5 }}
                        >
                          {transaction.status === 'delivered' ? (
                            <CheckCircle className="w-8 h-8 text-white" />
                          ) : transaction.status === 'shipped' ? (
                            <Truck className="w-8 h-8 text-white" />
                          ) : transaction.status === 'processing' ? (
                            <Clock className="w-8 h-8 text-white" />
                          ) : (
                            <Package className="w-8 h-8 text-white" />
                          )}
                        </motion.div>
                        {}
                        <div className="absolute inset-0 bg-gradient-to-br from-emerald-400 to-teal-400 rounded-2xl opacity-0 group-hover:opacity-30 blur-xl transition-opacity duration-300"></div>
                      </div>

                      {}
                      <div className="flex-1 bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/50 shadow-lg group-hover:shadow-xl transition-all duration-300">
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <h3 className="text-xl font-bold text-gray-800">{transaction.medicineName}</h3>
                            <p className="text-sm text-gray-600">Order #{transaction.orderId}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-2xl font-bold text-emerald-600">₹{transaction.totalAmount.toLocaleString()}</p>
                            {transaction.savings && transaction.savings > 0 && (
                              <p className="text-sm text-green-600">Saved ₹{transaction.savings}</p>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center space-x-4">
                            <Badge className={`${
                              transaction.status === 'delivered' ? 'bg-green-100 text-green-700' :
                              transaction.status === 'shipped' ? 'bg-blue-100 text-blue-700' :
                              transaction.status === 'processing' ? 'bg-yellow-100 text-yellow-700' :
                              'bg-gray-100 text-gray-700'
                            }`}>
                              {transaction.status}
                            </Badge>
                            <Badge className="bg-purple-100 text-purple-700">
                              {transaction.paymentMethod}
                            </Badge>
                          </div>
                          <div className="text-sm text-gray-600">
                            {transaction.date} at {transaction.time}
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Pill className="w-4 h-4 text-emerald-600" />
                            <span className="text-sm text-gray-600">Quantity: {transaction.quantity}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Button 
                              size="sm" 
                              variant="outline"
                              className="rounded-xl border-emerald-200 hover:bg-emerald-50"
                              onClick={(e) => {
                                e.stopPropagation();
                                toast.success('📄 Receipt downloaded!');
                              }}
                            >
                              <Receipt className="w-4 h-4 mr-1" />
                              Receipt
                            </Button>
                            {transaction.status === 'shipped' && (
                              <Button 
                                size="sm"
                                className="bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setTrackingOrderId(transaction.orderId || '');
                                  setShowDeliveryTracking(true);
                                }}
                              >
                                <Navigation className="w-4 h-4 mr-1" />
                                Track
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))
                  )}
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
                  className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-lg"
                  onClick={() => setSelectedTransaction(null)}
                >
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    className="bg-white/95 backdrop-blur-xl rounded-3xl p-8 max-w-lg w-full mx-4 shadow-2xl border border-white/50"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-2xl font-bold text-gray-800">Order Details</h3>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedTransaction(null)}
                        className="rounded-xl"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>

                    <div className="space-y-6">
                      <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl p-6">
                        <h4 className="font-bold text-lg text-gray-800 mb-2">{selectedTransaction.medicineName}</h4>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-gray-600">Order ID:</span>
                            <p className="font-medium">{selectedTransaction.orderId}</p>
                          </div>
                          <div>
                            <span className="text-gray-600">Transaction ID:</span>
                            <p className="font-medium">{selectedTransaction.transactionId}</p>
                          </div>
                          <div>
                            <span className="text-gray-600">Date & Time:</span>
                            <p className="font-medium">{selectedTransaction.date} {selectedTransaction.time}</p>
                          </div>
                          <div>
                            <span className="text-gray-600">Payment Method:</span>
                            <p className="font-medium capitalize">{selectedTransaction.paymentMethod}</p>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span>Quantity:</span>
                          <span className="font-medium">{selectedTransaction.quantity}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span>Unit Price:</span>
                          <span className="font-medium">₹{selectedTransaction.price}</span>
                        </div>
                        {selectedTransaction.savings && selectedTransaction.savings > 0 && (
                          <div className="flex justify-between items-center text-green-600">
                            <span>Savings:</span>
                            <span className="font-medium">-₹{selectedTransaction.savings}</span>
                          </div>
                        )}
                        <Separator />
                        <div className="flex justify-between items-center text-lg font-bold">
                          <span>Total Amount:</span>
                          <span className="text-emerald-600">₹{selectedTransaction.totalAmount}</span>
                        </div>
                      </div>

                      <div className="flex space-x-4">
                        <Button
                          variant="outline"
                          className="flex-1 rounded-2xl"
                          onClick={() => {
                            toast.success('📄 Receipt downloaded!');
                          }}
                        >
                          <Download className="w-4 h-4 mr-2" />
                          Download Receipt
                        </Button>
                        {selectedTransaction.status === 'delivered' && (
                          <Button
                            className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-2xl"
                            onClick={() => {
                              toast.success('🛒 Added to cart for reorder!');
                              setSelectedTransaction(null);
                            }}
                          >
                            <Repeat className="w-4 h-4 mr-2" />
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
            className="space-y-8"
          >
            {}
            <Card className="p-8 bg-gradient-to-r from-white/90 via-emerald-50/60 to-teal-50/60 backdrop-blur-xl border border-white/60 shadow-xl rounded-3xl">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">Monthly Statement</h2>
                  <p className="text-gray-600 mt-2">Your healthcare spending overview for January 2024</p>
                </div>
                <div className="flex items-center space-x-4">
                  <Badge className="bg-emerald-100 text-emerald-700 px-4 py-2 text-lg">
                    <Calendar className="w-4 h-4 mr-2" />
                    Jan 2024
                  </Badge>
                  <Button
                    className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-2xl px-6 py-3"
                    onClick={() => toast.success('📊 Full statement downloaded!')}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download PDF
                  </Button>
                </div>
              </div>
            </Card>

            {}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <motion.div
                whileHover={{ scale: 1.05, y: -5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Card className="p-8 bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-2xl rounded-3xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-4">
                      <TrendingUp className="w-10 h-10" />
                      <Badge className="bg-white/20 text-white">+12%</Badge>
                    </div>
                    <h3 className="text-lg font-medium mb-2">This Month's Expenses</h3>
                    <p className="text-3xl font-bold">₹{transactions.filter(t => new Date(t.date).getMonth() === new Date().getMonth()).reduce((sum, t) => sum + t.totalAmount, 0).toLocaleString()}</p>
                  </div>
                </Card>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.05, y: -5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Card className="p-8 bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-2xl rounded-3xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-4">
                      <Pill className="w-10 h-10" />
                      <Badge className="bg-white/20 text-white">Top</Badge>
                    </div>
                    <h3 className="text-lg font-medium mb-2">Most Bought Medicine</h3>
                    <p className="text-2xl font-bold">Paracetamol</p>
                  </div>
                </Card>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.05, y: -5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Card className="p-8 bg-gradient-to-br from-purple-500 to-pink-600 text-white shadow-2xl rounded-3xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-4">
                      <Gift className="w-10 h-10" />
                      <Badge className="bg-white/20 text-white">+8%</Badge>
                    </div>
                    <h3 className="text-lg font-medium mb-2">Savings This Month</h3>
                    <p className="text-3xl font-bold">₹{transactions.reduce((sum, t) => sum + (t.savings || 0), 0).toLocaleString()}</p>
                  </div>
                </Card>
              </motion.div>
            </div>

            {}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {}
              <Card className="p-8 bg-white/90 backdrop-blur-xl border border-white/60 shadow-xl rounded-3xl">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-gray-800">Expense Breakdown</h3>
                  <PieChart className="w-6 h-6 text-emerald-600" />
                </div>
                
                {}
                <div className="relative w-64 h-64 mx-auto mb-6">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                    {}
                    <circle
                      cx="50"
                      cy="50"
                      r="30"
                      stroke="#10b981"
                      strokeWidth="15"
                      fill="transparent"
                      strokeDasharray="75.4 188.5"
                      strokeDashoffset="0"
                      className="transition-all duration-1000"
                    />
                    {}
                    <circle
                      cx="50"
                      cy="50"
                      r="30"
                      stroke="#3b82f6"
                      strokeWidth="15"
                      fill="transparent"
                      strokeDasharray="56.5 188.5"
                      strokeDashoffset="-75.4"
                      className="transition-all duration-1000"
                    />
                    {}
                    <circle
                      cx="50"
                      cy="50"
                      r="30"
                      stroke="#8b5cf6"
                      strokeWidth="15"
                      fill="transparent"
                      strokeDasharray="37.7 188.5"
                      strokeDashoffset="-131.9"
                      className="transition-all duration-1000"
                    />
                    {}
                    <circle
                      cx="50"
                      cy="50"
                      r="30"
                      stroke="#f59e0b"
                      strokeWidth="15"
                      fill="transparent"
                      strokeDasharray="18.8 188.5"
                      strokeDashoffset="-169.6"
                      className="transition-all duration-1000"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-gray-800">₹265</p>
                      <p className="text-sm text-gray-600">Total</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  {[
                    { label: 'Pain Relief', value: '34%', amount: '₹90', color: 'bg-emerald-500' },
                    { label: 'Cold & Cough', value: '32%', amount: '₹85', color: 'bg-blue-500' },
                    { label: 'Period Care', value: '34%', amount: '₹90', color: 'bg-purple-500' }
                  ].map((item, index) => (
                    <motion.div
                      key={item.label}
                      className="flex items-center justify-between"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.2 }}
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`w-4 h-4 rounded-full ${item.color}`}></div>
                        <span className="text-gray-700">{item.label}</span>
                      </div>
                      <div className="text-right">
                        <span className="font-semibold text-gray-800">{item.amount}</span>
                        <span className="text-sm text-gray-600 ml-2">{item.value}</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </Card>

              {}
              <Card className="p-8 bg-white/90 backdrop-blur-xl border border-white/60 shadow-xl rounded-3xl">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-gray-800">Monthly Spending Trend</h3>
                  <BarChart3 className="w-6 h-6 text-emerald-600" />
                </div>
                
                {}
                <div className="space-y-4">
                  {[
                    { month: 'Sep', amount: 180, percentage: 60 },
                    { month: 'Oct', amount: 220, percentage: 73 },
                    { month: 'Nov', amount: 195, percentage: 65 },
                    { month: 'Dec', amount: 310, percentage: 100 },
                    { month: 'Jan', amount: 265, percentage: 85 }
                  ].map((item, index) => (
                    <motion.div
                      key={item.month}
                      className="flex items-center space-x-4"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <span className="w-8 text-sm font-medium text-gray-600">{item.month}</span>
                      <div className="flex-1 bg-gray-100 rounded-full h-8 relative overflow-hidden">
                        <motion.div
                          className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full flex items-center justify-end pr-3"
                          initial={{ width: 0 }}
                          animate={{ width: `${item.percentage}%` }}
                          transition={{ duration: 1, delay: index * 0.2 }}
                        >
                          <span className="text-white text-xs font-medium">₹{item.amount}</span>
                        </motion.div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                <div className="mt-6 p-4 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-emerald-800">Average Monthly Spending</span>
                    <span className="text-lg font-bold text-emerald-600">₹234</span>
                  </div>
                </div>
              </Card>
            </div>

            {}
            <Card className="p-8 bg-gradient-to-r from-white/90 via-blue-50/60 to-purple-50/60 backdrop-blur-xl border border-white/60 shadow-xl rounded-3xl">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-800">AI Insights & Recommendations</h3>
                  <p className="text-sm text-gray-600">Personalized suggestions based on your spending patterns</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <motion.div
                  className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/50"
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="flex items-center space-x-3 mb-4">
                    <TrendingUp className="w-6 h-6 text-emerald-600" />
                    <h4 className="font-semibold text-gray-800">Spending Insight</h4>
                  </div>
                  <p className="text-gray-700 mb-4">You've maintained consistent healthcare spending with good focus on preventive care including period and pregnancy health.</p>
                  <Badge className="bg-emerald-100 text-emerald-700">
                    <ArrowUpRight className="w-3 h-3 mr-1" />
                    Excellent
                  </Badge>
                </motion.div>

                <motion.div
                  className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/50"
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="flex items-center space-x-3 mb-4">
                    <Target className="w-6 h-6 text-blue-600" />
                    <h4 className="font-semibold text-gray-800">Recommendation</h4>
                  </div>
                  <p className="text-gray-700 mb-4">Consider setting up subscription orders for regular medicines like pain relief to get better discounts and never run out.</p>
                  <Badge className="bg-blue-100 text-blue-700">
                    <Sparkles className="w-3 h-3 mr-1" />
                    Smart Tip
                  </Badge>
                </motion.div>
              </div>
            </Card>
          </motion.div>
        )}
      </div>

      {}
      {showCheckout && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-lg"
          onClick={() => setShowCheckout(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white/95 backdrop-blur-xl rounded-3xl p-8 max-w-md w-full mx-4 shadow-2xl border border-white/50"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-center">
              <div className="w-16 h-16 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <ShoppingCart className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Confirm Your Order</h3>
              <p className="text-gray-600 mb-6">Review your items before payment</p>
              
              <div className="text-left space-y-2 mb-6">
                {cart.map((item) => (
                  <div key={item.medicine.id} className="flex justify-between text-sm">
                    <span>{item.medicine.name} × {item.quantity}</span>
                    <span>₹{(item.medicine.price * item.quantity).toLocaleString()}</span>
                  </div>
                ))}
                <div className="border-t pt-2 flex justify-between font-bold">
                  <span>Total:</span>
                  <span className="text-emerald-600">
                    ₹{cart.reduce((sum, item) => sum + (item.medicine.price * item.quantity), 0).toLocaleString()}
                  </span>
                </div>
              </div>
              
              <div className="space-y-3">
                <Button
                  onClick={() => {
                    const totalAmount = cart.reduce((sum, item) => sum + (item.medicine.price * item.quantity), 0);
                    const orderId = `ORD${Date.now()}`;
                    const orderItems = cart.map(item => ({
                      name: item.medicine.name,
                      quantity: item.quantity,
                      price: item.medicine.price,
                      medicine: item.medicine
                    }));
                    
                    setCheckoutOrder({
                      orderId,
                      amount: totalAmount,
                      items: orderItems
                    });
                    setShowCheckout(false);
                    setShowPaymentGateway(true);
                  }}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl"
                >
                  Proceed to Payment
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowCheckout(false)}
                  className="w-full border-gray-300 rounded-2xl"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );

  
  if (showPaymentGateway && checkoutOrder) {
    return (
      <PaymentGateway
        amount={checkoutOrder.amount}
        orderId={checkoutOrder.orderId}
        items={checkoutOrder.items || []}
        onPaymentSuccess={(transactionId, paymentMethod) => {
          toast.success('🎉 Payment successful!');
          setShowPaymentGateway(false);
          setCheckoutOrder(null);
          setCart([]);
          
          const newTransaction: Transaction = {
            id: transactionId,
            medicineId: checkoutOrder.items[0]?.medicine?.id || 'unknown',
            medicineName: checkoutOrder.items[0]?.medicine?.name || 'Multiple Items',
            quantity: checkoutOrder.items.reduce((sum, item) => sum + item.quantity, 0),
            price: checkoutOrder.amount,
            totalAmount: checkoutOrder.amount,
            date: new Date().toISOString().split('T')[0],
            time: new Date().toTimeString().split(' ')[0].substring(0, 5),
            category: checkoutOrder.items[0]?.medicine?.category || 'general',
            status: 'processing',
            paymentMethod: paymentMethod,
            savings: 0,
            deliveryStatus: 'processing',
            orderId: checkoutOrder.orderId,
            transactionId: transactionId
          };
          setTransactions(prev => [newTransaction, ...prev]);
          
          
          if (paymentMethod === 'wallet') {
            setWalletBalance(prev => prev - checkoutOrder.amount);
          }
        }}
        onPaymentFailed={(error) => {
          toast.error('❌ Payment failed: ' + error);
        }}
        onBack={() => {
          setShowPaymentGateway(false);
        }}
        walletBalance={walletBalance}
      />
    );
  }
}