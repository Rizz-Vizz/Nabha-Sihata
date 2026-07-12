import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { useLanguage } from './language-context';
import { 
  ArrowLeft, 
  Wallet, 
  Plus, 
  ShoppingCart, 
  History, 
  Search,
  Filter,
  Star,
  Pill,
  Upload,
  Truck,
  Clock,
  CheckCircle,
  AlertCircle,
  Minus,
  Eye,
  Download
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
  status: 'completed' | 'pending' | 'cancelled';
  type: 'purchase' | 'refund' | 'wallet_add';
  orderId: string;
  savings?: number;
  pharmacy?: string;
}

interface SimplePharmacyWalletProps {
  onBack: () => void;
}

export function SimplePharmacyWallet({ onBack }: SimplePharmacyWalletProps) {
  const { t } = useLanguage();
  
  
  const [walletBalance, setWalletBalance] = useState(2850);
  const [loyaltyPoints, setLoyaltyPoints] = useState(245);
  const [activeTab, setActiveTab] = useState<'browse' | 'cart' | 'orders' | 'history' | 'wallet'>('browse');
  
  
  const [cart, setCart] = useState<CartItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  
  
  const [showAddMoney, setShowAddMoney] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [showDeliveryTracking, setShowDeliveryTracking] = useState(false);
  const [showPrescriptionUpload, setShowPrescriptionUpload] = useState(false);
  const [trackingOrderId, setTrackingOrderId] = useState<string | null>(null);
  const [checkoutOrder, setCheckoutOrder] = useState<{orderId: string, amount: number, items: any[]} | null>(null);

  
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
      name: 'Crocin Advance',
      genericName: 'Paracetamol',
      price: 35,
      dosage: '650mg',
      manufacturer: 'GSK',
      category: 'pain-relief',
      stock: 200,
      expiryDate: '2025-11-30',
      prescriptionRequired: false,
      description: 'Fast relief from fever and headache',
      discount: 5,
      rating: 4.2,
      reviews: 986
    },
    {
      id: 'med004',
      name: 'Vitamin D3',
      genericName: 'Cholecalciferol',
      price: 120,
      dosage: '60 tablets',
      manufacturer: 'Sun Pharma',
      category: 'vitamins',
      stock: 85,
      expiryDate: '2025-08-22',
      prescriptionRequired: false,
      description: 'Supports bone health and immunity',
      discount: 15,
      rating: 4.6,
      reviews: 1678
    },
    {
      id: 'med005',
      name: 'Omega-3 Capsules',
      genericName: 'Fish Oil Omega-3',
      price: 280,
      dosage: '30 capsules',
      manufacturer: 'HealthKart',
      category: 'vitamins',
      stock: 65,
      expiryDate: '2025-09-15',
      prescriptionRequired: false,
      description: 'Heart and brain health support',
      discount: 20,
      rating: 4.4,
      reviews: 1234
    },
    {
      id: 'med006',
      name: 'Cetirizine',
      genericName: 'Cetirizine HCl',
      price: 55,
      dosage: '10mg',
      manufacturer: 'Cipla',
      category: 'allergy',
      stock: 120,
      expiryDate: '2025-07-30',
      prescriptionRequired: false,
      description: 'For allergy and cold symptoms',
      rating: 4.3,
      reviews: 892
    }
  ]);

  
  const [transactions] = useState<Transaction[]>([
    {
      id: 'txn001',
      medicineId: 'med001',
      medicineName: 'Paracetamol 500mg',
      quantity: 2,
      price: 45,
      totalAmount: 90,
      date: '2024-01-15',
      status: 'completed',
      type: 'purchase',
      orderId: 'ORD-2024-001',
      savings: 10,
      pharmacy: 'Apollo Pharmacy'
    },
    {
      id: 'txn002',
      medicineId: 'wallet',
      medicineName: 'Wallet Top-up',
      quantity: 1,
      price: 500,
      totalAmount: 500,
      date: '2024-01-10',
      status: 'completed',
      type: 'wallet_add',
      orderId: 'ORD-2024-002'
    },
    {
      id: 'txn003',
      medicineId: 'med004',
      medicineName: 'Vitamin D3 60 tablets',
      quantity: 1,
      price: 120,
      totalAmount: 102,
      date: '2024-01-08',
      status: 'completed',
      type: 'purchase',
      orderId: 'ORD-2024-003',
      savings: 18,
      pharmacy: 'MedPlus'
    }
  ]);

  const categories = [
    { id: 'all', name: 'All', icon: '🏷️' },
    { id: 'pain-relief', name: 'Pain Relief', icon: '💊' },
    { id: 'vitamins', name: 'Vitamins', icon: '🍊' },
    { id: 'allergy', name: 'Allergy', icon: '🤧' },
    { id: 'prescription', name: 'Prescription', icon: '📋' }
  ];

  const filteredMedicines = medicines.filter(medicine => {
    const matchesSearch = medicine.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         medicine.genericName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || medicine.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const addToCart = (medicine: Medicine) => {
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
    toast.success(`${medicine.name} added to cart`);
  };

  const removeFromCart = (medicineId: string) => {
    setCart(cart.filter(item => item.medicine.id !== medicineId));
    toast.success('Item removed from cart');
  };

  const updateCartQuantity = (medicineId: string, newQuantity: number) => {
    if (newQuantity === 0) {
      removeFromCart(medicineId);
      return;
    }
    setCart(cart.map(item => 
      item.medicine.id === medicineId 
        ? { ...item, quantity: newQuantity }
        : item
    ));
  };

  const getTotalCartValue = () => {
    return cart.reduce((total, item) => {
      const discountedPrice = item.medicine.discount 
        ? item.medicine.price * (1 - item.medicine.discount / 100)
        : item.medicine.price;
      return total + (discountedPrice * item.quantity);
    }, 0);
  };

  const handleCheckout = () => {
    if (cart.length === 0) {
      toast.error('Your cart is empty');
      return;
    }
    
    const total = getTotalCartValue();
    if (total > walletBalance) {
      toast.error('Insufficient wallet balance. Please add money to your wallet.');
      setShowAddMoney(true);
      return;
    }

    const orderId = `ORD-${Date.now()}`;
    setCheckoutOrder({
      orderId,
      amount: total,
      items: cart.map(item => ({
        name: item.medicine.name,
        quantity: item.quantity,
        price: item.medicine.price,
        discount: item.medicine.discount || 0
      }))
    });
    setShowCheckout(true);
  };

  const handlePaymentSuccess = (orderId: string, amount: number) => {
    setWalletBalance(prev => prev - amount);
    setLoyaltyPoints(prev => prev + Math.floor(amount / 10));
    setCart([]);
    setShowCheckout(false);
    setTrackingOrderId(orderId);
    setShowDeliveryTracking(true);
    toast.success('Order placed successfully!');
  };

  
  const AddMoneyModal = () => {
    const [amount, setAmount] = useState('');

    const handleAddMoney = () => {
      const numAmount = parseFloat(amount);
      if (!numAmount || numAmount <= 0) {
        toast.error('Please enter a valid amount');
        return;
      }
      if (numAmount < 10) {
        toast.error('Minimum amount is ₹10');
        return;
      }
      if (numAmount > 10000) {
        toast.error('Maximum amount is ₹10,000');
        return;
      }

      setWalletBalance(prev => prev + numAmount);
      setShowAddMoney(false);
      setAmount('');
      toast.success(`₹${numAmount} added to your wallet`);
    };

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <Card className="max-w-md w-full p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold">Add Money to Wallet</h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowAddMoney(false)}
            >
              ✕
            </Button>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Enter Amount</label>
              <Input
                type="number"
                placeholder="Amount (₹10 - ₹10,000)"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                min="10"
                max="10000"
              />
            </div>
            
            <div className="grid grid-cols-3 gap-2">
              {[100, 500, 1000].map(preset => (
                <Button
                  key={preset}
                  variant="outline"
                  onClick={() => setAmount(preset.toString())}
                  className="text-sm"
                >
                  ₹{preset}
                </Button>
              ))}
            </div>
            
            <Button
              onClick={handleAddMoney}
              className="w-full bg-green-600 hover:bg-green-700"
            >
              Add Money
            </Button>
          </div>
        </Card>
      </div>
    );
  };

  // Show checkout if requested
  if (showCheckout && checkoutOrder) {
    return (
      <EnhancedPharmacyCheckout
        orderId={checkoutOrder.orderId}
        items={checkoutOrder.items}
        totalAmount={checkoutOrder.amount}
        walletBalance={walletBalance}
        onBack={() => setShowCheckout(false)}
        onPaymentSuccess={handlePaymentSuccess}
      />
    );
  }

  // Show delivery tracking if requested
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

  // Show prescription upload if requested
  if (showPrescriptionUpload) {
    return (
      <PrescriptionUpload
        onBack={() => setShowPrescriptionUpload(false)}
        onUploadSuccess={(medicines) => {
          medicines.forEach(medicine => addToCart(medicine));
          setShowPrescriptionUpload(false);
          setActiveTab('cart');
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {showAddMoney && <AddMoneyModal />}
      
      {}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                onClick={onBack}
                className="flex items-center space-x-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>{t('back')}</span>
              </Button>
              
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
                  <Wallet className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">{t('pharmacyWallet')}</h1>
                  <p className="text-gray-600">Balance: ₹{walletBalance.toLocaleString()}</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Button
                onClick={() => setShowAddMoney(true)}
                className="bg-green-600 hover:bg-green-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Money
              </Button>
              
              <Button
                onClick={() => setShowPrescriptionUpload(true)}
                variant="outline"
              >
                <Upload className="w-4 h-4 mr-2" />
                Upload Prescription
              </Button>
              
              <Button
                onClick={() => setActiveTab('cart')}
                variant="outline"
                className="relative"
              >
                <ShoppingCart className="w-4 h-4 mr-2" />
                Cart
                {cart.length > 0 && (
                  <Badge className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                    {cart.length}
                  </Badge>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        {}
        <Card className="p-6 mb-6 bg-gradient-to-r from-green-600 to-green-700 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold mb-2">Wallet Balance</h3>
              <p className="text-3xl font-bold">₹{walletBalance.toLocaleString()}</p>
              <div className="flex items-center space-x-4 mt-2">
                <Badge className="bg-white/20 text-white">
                  <Star className="w-3 h-3 mr-1" />
                  {loyaltyPoints} points
                </Badge>
                <span className="text-sm">This month: ₹{transactions.filter(t => new Date(t.date).getMonth() === new Date().getMonth()).reduce((sum, t) => sum + (t.type === 'purchase' ? t.totalAmount : 0), 0).toLocaleString()}</span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm opacity-90 mb-1">Quick Actions</div>
              <div className="space-y-2">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setActiveTab('history')}
                >
                  <History className="w-4 h-4 mr-1" />
                  History
                </Button>
              </div>
            </div>
          </div>
        </Card>

        {}
        <div className="flex space-x-1 mb-6 bg-white rounded-lg p-1 shadow-sm">
          {[
            { id: 'browse', label: 'Browse Medicines', icon: Pill },
            { id: 'cart', label: 'Cart', icon: ShoppingCart },
            { id: 'orders', label: 'Orders', icon: Truck },
            { id: 'history', label: 'History', icon: History }
          ].map((tab) => (
            <Button
              key={tab.id}
              variant={activeTab === tab.id ? 'default' : 'ghost'}
              onClick={() => setActiveTab(tab.id as any)}
              className="flex-1"
            >
              <tab.icon className="w-4 h-4 mr-2" />
              {tab.label}
              {tab.id === 'cart' && cart.length > 0 && (
                <Badge className="ml-2 bg-red-500 text-white text-xs">
                  {cart.length}
                </Badge>
              )}
            </Button>
          ))}
        </div>

        {}
        {activeTab === 'browse' && (
          <div className="space-y-6">
            {}
            <Card className="p-4">
              <div className="flex items-center space-x-4">
                <div className="flex-1 relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <Input
                    placeholder="Search medicines..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                
                <div className="flex items-center space-x-2">
                  <Filter className="w-4 h-4 text-gray-500" />
                  <div className="flex space-x-2">
                    {categories.map(category => (
                      <Button
                        key={category.id}
                        variant={selectedCategory === category.id ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setSelectedCategory(category.id)}
                      >
                        <span className="mr-1">{category.icon}</span>
                        {category.name}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </Card>

            {}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredMedicines.map(medicine => (
                <Card key={medicine.id} className="p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-semibold text-lg">{medicine.name}</h4>
                      <p className="text-gray-600 text-sm">{medicine.genericName}</p>
                      <p className="text-gray-500 text-sm">{medicine.manufacturer}</p>
                    </div>
                    {medicine.prescriptionRequired && (
                      <Badge variant="outline" className="text-xs">Rx</Badge>
                    )}
                  </div>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Dosage: {medicine.dosage}</span>
                      <span className="text-sm text-gray-600">Stock: {medicine.stock}</span>
                    </div>
                    
                    {medicine.rating && (
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm">{medicine.rating}</span>
                        <span className="text-xs text-gray-500">({medicine.reviews} reviews)</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center space-x-2">
                        {medicine.discount ? (
                          <>
                            <span className="text-lg font-bold text-green-600">
                              ₹{Math.round(medicine.price * (1 - medicine.discount / 100))}
                            </span>
                            <span className="text-sm text-gray-500 line-through">₹{medicine.price}</span>
                            <Badge className="bg-green-100 text-green-700 text-xs">
                              {medicine.discount}% off
                            </Badge>
                          </>
                        ) : (
                          <span className="text-lg font-bold">₹{medicine.price}</span>
                        )}
                      </div>
                    </div>
                    
                    <Button
                      onClick={() => addToCart(medicine)}
                      disabled={medicine.stock === 0}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      Add to Cart
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'cart' && (
          <div className="space-y-6">
            {cart.length === 0 ? (
              <Card className="p-8 text-center">
                <ShoppingCart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">Your cart is empty</h3>
                <p className="text-gray-500 mb-4">Add some medicines to get started</p>
                <Button onClick={() => setActiveTab('browse')}>
                  Browse Medicines
                </Button>
              </Card>
            ) : (
              <>
                <div className="space-y-4">
                  {cart.map(item => (
                    <Card key={item.medicine.id} className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h4 className="font-semibold">{item.medicine.name}</h4>
                          <p className="text-gray-600 text-sm">{item.medicine.genericName}</p>
                          <p className="text-gray-500 text-sm">{item.medicine.dosage}</p>
                        </div>
                        
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => updateCartQuantity(item.medicine.id, item.quantity - 1)}
                            >
                              <Minus className="w-3 h-3" />
                            </Button>
                            <span className="w-8 text-center">{item.quantity}</span>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => updateCartQuantity(item.medicine.id, item.quantity + 1)}
                            >
                              <Plus className="w-3 h-3" />
                            </Button>
                          </div>
                          
                          <div className="text-right">
                            <div className="font-semibold">
                              ₹{(item.medicine.discount 
                                ? item.medicine.price * (1 - item.medicine.discount / 100)
                                : item.medicine.price
                              ).toFixed(0)} × {item.quantity}
                            </div>
                            <div className="text-lg font-bold text-green-600">
                              ₹{((item.medicine.discount 
                                ? item.medicine.price * (1 - item.medicine.discount / 100)
                                : item.medicine.price
                              ) * item.quantity).toFixed(0)}
                            </div>
                          </div>
                          
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeFromCart(item.medicine.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            ✕
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>

                <Card className="p-6">
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span>Subtotal:</span>
                      <span>₹{getTotalCartValue().toFixed(0)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Delivery:</span>
                      <span className="text-green-600">Free</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total:</span>
                      <span>₹{getTotalCartValue().toFixed(0)}</span>
                    </div>
                    
                    <div className="flex items-center justify-between mt-4">
                      <div className="text-sm text-gray-600">
                        Wallet Balance: ₹{walletBalance.toLocaleString()}
                      </div>
                      <Button
                        onClick={handleCheckout}
                        className="bg-green-600 hover:bg-green-700"
                        disabled={getTotalCartValue() > walletBalance}
                      >
                        {getTotalCartValue() > walletBalance ? 'Insufficient Balance' : 'Proceed to Checkout'}
                      </Button>
                    </div>
                  </div>
                </Card>
              </>
            )}
          </div>
        )}

        {activeTab === 'history' && (
          <div className="space-y-4">
            {transactions.length === 0 ? (
              <Card className="p-8 text-center">
                <History className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">No transactions yet</h3>
                <p className="text-gray-500">Your transaction history will appear here</p>
              </Card>
            ) : (
              transactions.map(transaction => (
                <Card key={transaction.id} className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        transaction.type === 'wallet_add' ? 'bg-blue-100' :
                        transaction.status === 'completed' ? 'bg-green-100' : 'bg-gray-100'
                      }`}>
                        {transaction.type === 'wallet_add' ? (
                          <Plus className="w-5 h-5 text-blue-600" />
                        ) : transaction.status === 'completed' ? (
                          <CheckCircle className="w-5 h-5 text-green-600" />
                        ) : (
                          <Clock className="w-5 h-5 text-gray-600" />
                        )}
                      </div>
                      
                      <div>
                        <h4 className="font-semibold">{transaction.medicineName}</h4>
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <span>{new Date(transaction.date).toLocaleDateString()}</span>
                          <span>•</span>
                          <span>Order #{transaction.orderId}</span>
                          {transaction.pharmacy && (
                            <>
                              <span>•</span>
                              <span>{transaction.pharmacy}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className={`text-lg font-bold ${
                        transaction.type === 'wallet_add' ? 'text-blue-600' : 'text-gray-900'
                      }`}>
                        {transaction.type === 'wallet_add' ? '+' : ''}₹{transaction.totalAmount}
                      </div>
                      {transaction.savings && (
                        <div className="text-sm text-green-600">
                          Saved ₹{transaction.savings}
                        </div>
                      )}
                      <Badge variant={
                        transaction.status === 'completed' ? 'default' :
                        transaction.status === 'pending' ? 'secondary' : 'destructive'
                      }>
                        {transaction.status}
                      </Badge>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>
        )}

        {activeTab === 'orders' && (
          <Card className="p-8 text-center">
            <Truck className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No active orders</h3>
            <p className="text-gray-500">Your current orders will appear here</p>
          </Card>
        )}
      </div>
    </div>
  );
}