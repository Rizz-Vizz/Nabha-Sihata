import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { useLanguage } from './language-context';
import { 
  Wallet, 
  Plus, 
  ShoppingCart, 
  History, 
  Download, 
  Calendar,
  Receipt,
  Pill,
  IndianRupee,
  AlertCircle,
  CheckCircle,
  Package,
  Clock
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface Medicine {
  id: string;
  name: string;
  dosage: string;
  manufacturer: string;
  price: number;
  inStock: boolean;
  expiryDate: string;
  description?: string;
}

interface Purchase {
  id: string;
  medicineId: string;
  medicineName: string;
  quantity: number;
  price: number;
  totalAmount: number;
  purchaseDate: string;
  transactionId: string;
}

interface AdminPharmacyWalletProps {
  onBack: () => void;
}

export function AdminPharmacyWallet({ onBack }: AdminPharmacyWalletProps) {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState('wallet');
  const [walletBalance, setWalletBalance] = useState(2500);
  const [addMoneyAmount, setAddMoneyAmount] = useState('');
  const [showAddMoney, setShowAddMoney] = useState(false);
  const [selectedMedicine, setSelectedMedicine] = useState<Medicine | null>(null);
  const [selectedQuantity, setSelectedQuantity] = useState(1);
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [loading, setLoading] = useState(false);

  // Mock medicines data
  const medicines: Medicine[] = [
    {
      id: '1',
      name: 'Paracetamol 500mg',
      dosage: '500mg',
      manufacturer: 'Sun Pharma',
      price: 25,
      inStock: true,
      expiryDate: '2025-12-31',
      description: 'Pain relief and fever reducer tablets'
    },
    {
      id: '2',
      name: 'Amoxicillin 250mg',
      dosage: '250mg',
      manufacturer: 'Cipla',
      price: 120,
      inStock: true,
      expiryDate: '2025-06-30',
      description: 'Antibiotic capsules'
    },
    {
      id: '3',
      name: 'Omeprazole 20mg',
      dosage: '20mg',
      manufacturer: 'Dr. Reddy\'s',
      price: 85,
      inStock: true,
      expiryDate: '2025-08-15',
      description: 'Acid reflux medication'
    },
    {
      id: '4',
      name: 'Metformin 500mg',
      dosage: '500mg',
      manufacturer: 'Lupin',
      price: 65,
      inStock: false,
      expiryDate: '2025-10-20',
      description: 'Diabetes management tablets'
    },
    {
      id: '5',
      name: 'Cetirizine 10mg',
      dosage: '10mg',
      manufacturer: 'Glenmark',
      price: 35,
      inStock: true,
      expiryDate: '2025-09-12',
      description: 'Allergy relief tablets'
    },
    {
      id: '6',
      name: 'Ibuprofen 400mg',
      dosage: '400mg',
      manufacturer: 'Abbott',
      price: 45,
      inStock: true,
      expiryDate: '2025-11-08',
      description: 'Anti-inflammatory tablets'
    }
  ];

  
  useEffect(() => {
    const savedPurchases = localStorage.getItem('pharmacyPurchases');
    if (savedPurchases) {
      try {
        setPurchases(JSON.parse(savedPurchases));
      } catch (error) {
        console.error('Error loading purchases:', error);
      }
    }

    const savedBalance = localStorage.getItem('walletBalance');
    if (savedBalance) {
      setWalletBalance(parseFloat(savedBalance));
    }
  }, []);

  
  useEffect(() => {
    localStorage.setItem('pharmacyPurchases', JSON.stringify(purchases));
  }, [purchases]);

  
  useEffect(() => {
    localStorage.setItem('walletBalance', walletBalance.toString());
  }, [walletBalance]);

  const handleAddMoney = () => {
    const amount = parseFloat(addMoneyAmount);
    if (isNaN(amount) || amount <= 0) {
      toast.error(t('enterValidAmount') || 'Please enter a valid amount');
      return;
    }

    setWalletBalance(prev => prev + amount);
    setAddMoneyAmount('');
    setShowAddMoney(false);
    toast.success(`₹${amount} ${t('amountAdded') || 'added successfully'}`);
  };

  const handlePurchase = (medicine: Medicine) => {
    const totalAmount = medicine.price * selectedQuantity;
    
    if (walletBalance < totalAmount) {
      toast.error(t('insufficientBalance') || 'Insufficient balance');
      return;
    }

    if (!medicine.inStock) {
      toast.error(t('outOfStock') || 'Medicine out of stock');
      return;
    }

    setLoading(true);

    // Simulate purchase processing
    setTimeout(() => {
      const purchase: Purchase = {
        id: Date.now().toString(),
        medicineId: medicine.id,
        medicineName: medicine.name,
        quantity: selectedQuantity,
        price: medicine.price,
        totalAmount,
        purchaseDate: new Date().toISOString(),
        transactionId: `TXN${Date.now()}`
      };

      setPurchases(prev => [purchase, ...prev]);
      setWalletBalance(prev => prev - totalAmount);
      setSelectedMedicine(null);
      setSelectedQuantity(1);
      setLoading(false);

      toast.success(`${t('purchaseSuccessful') || 'Purchase successful'} - ₹${totalAmount}`);
    }, 1000);
  };

  const getThisMonthExpenses = () => {
    const thisMonth = new Date().getMonth();
    const thisYear = new Date().getFullYear();
    
    return purchases
      .filter(purchase => {
        const purchaseDate = new Date(purchase.purchaseDate);
        return purchaseDate.getMonth() === thisMonth && purchaseDate.getFullYear() === thisYear;
      })
      .reduce((total, purchase) => total + purchase.totalAmount, 0);
  };

  const getThisYearExpenses = () => {
    const thisYear = new Date().getFullYear();
    
    return purchases
      .filter(purchase => {
        const purchaseDate = new Date(purchase.purchaseDate);
        return purchaseDate.getFullYear() === thisYear;
      })
      .reduce((total, purchase) => total + purchase.totalAmount, 0);
  };

  const generateMonthlyStatement = () => {
    const monthlyExpenses = getThisMonthExpenses();
    const yearlyExpenses = getThisYearExpenses();
    const currentMonth = new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    
    // Create statement text
    const statement = `
NABHA SIHATA PHARMACY WALLET
Monthly Statement - ${currentMonth}

Wallet Balance: ₹${walletBalance}
This Month Expenses: ₹${monthlyExpenses}
This Year Expenses: ₹${yearlyExpenses}

Recent Transactions:
${purchases.slice(0, 10).map(p => 
  `${new Date(p.purchaseDate).toLocaleDateString()} - ${p.medicineName} (${p.quantity}x) - ₹${p.totalAmount}`
).join('\n')}

Generated on: ${new Date().toLocaleDateString()}
    `.trim();

    // Create and download file
    const blob = new Blob([statement], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `pharmacy_statement_${new Date().getFullYear()}_${new Date().getMonth() + 1}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);

    toast.success(t('downloadStatement') || 'Statement downloaded successfully');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 p-4">
      {}
      <div className="flex items-center mb-6">
        <Button variant="ghost" onClick={onBack} className="mr-4">
          ← Back
        </Button>
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
            <Wallet className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-blue-600">
              {t('pharmacyWallet') || 'Pharmacy Wallet'}
            </h1>
            <p className="text-gray-600">Medicine purchase and wallet management</p>
          </div>
        </div>
      </div>

      {}
      <Card className="p-6 mb-6 bg-gradient-to-r from-blue-500 to-green-500 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
              <IndianRupee className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-lg opacity-90">{t('walletBalance') || 'Wallet Balance'}</h2>
              <p className="text-3xl font-bold">₹{walletBalance.toLocaleString()}</p>
              {walletBalance < 500 && (
                <div className="flex items-center space-x-1 mt-2">
                  <AlertCircle className="w-4 h-4" />
                  <span className="text-sm">{t('balanceLow') || 'Balance is low'}</span>
                </div>
              )}
            </div>
          </div>
          <Button 
            onClick={() => setShowAddMoney(true)}
            className="bg-white text-blue-600 hover:bg-gray-100"
          >
            <Plus className="w-4 h-4 mr-2" />
            {t('addMoney') || 'Add Money'}
          </Button>
        </div>
      </Card>

      {}
      {showAddMoney && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold mb-4">{t('addFunds') || 'Add Funds'}</h3>
            <div className="space-y-4">
              <div>
                <Label>{t('enterAmount') || 'Enter Amount'}</Label>
                <Input
                  type="number"
                  value={addMoneyAmount}
                  onChange={(e) => setAddMoneyAmount(e.target.value)}
                  placeholder="Enter amount to add"
                  className="text-lg"
                />
              </div>
              <div className="flex space-x-2">
                <Button onClick={() => setAddMoneyAmount('500')} variant="outline" size="sm">₹500</Button>
                <Button onClick={() => setAddMoneyAmount('1000')} variant="outline" size="sm">₹1000</Button>
                <Button onClick={() => setAddMoneyAmount('2000')} variant="outline" size="sm">₹2000</Button>
                <Button onClick={() => setAddMoneyAmount('5000')} variant="outline" size="sm">₹5000</Button>
              </div>
              <div className="flex space-x-2">
                <Button onClick={handleAddMoney} className="flex-1">
                  {t('addFunds') || 'Add Funds'}
                </Button>
                <Button onClick={() => setShowAddMoney(false)} variant="outline" className="flex-1">
                  Cancel
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}

      {}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="max-w-6xl mx-auto">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="wallet" className="flex items-center space-x-2">
            <ShoppingCart className="w-4 h-4" />
            <span>{t('purchase') || 'Purchase'}</span>
          </TabsTrigger>
          <TabsTrigger value="history" className="flex items-center space-x-2">
            <History className="w-4 h-4" />
            <span>{t('purchaseHistory') || 'Purchase History'}</span>
          </TabsTrigger>
          <TabsTrigger value="statement" className="flex items-center space-x-2">
            <Receipt className="w-4 h-4" />
            <span>{t('monthlyStatement') || 'Monthly Statement'}</span>
          </TabsTrigger>
        </TabsList>

        {}
        <TabsContent value="wallet" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {}
            <div className="lg:col-span-2">
              <h3 className="text-lg font-bold mb-4">{t('medicines') || 'Available Medicines'}</h3>
              <div className="space-y-4">
                {medicines.map((medicine) => (
                  <Card key={medicine.id} className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                          <Pill className="w-6 h-6 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">{medicine.name}</h4>
                          <p className="text-sm text-gray-600 mb-1">{medicine.description}</p>
                          <div className="flex items-center space-x-4 text-xs text-gray-500">
                            <span>{t('dosage') || 'Dosage'}: {medicine.dosage}</span>
                            <span>{t('manufacturer') || 'Mfg'}: {medicine.manufacturer}</span>
                            <span>{t('expiryDate') || 'Exp'}: {new Date(medicine.expiryDate).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="text-right">
                          <p className="text-lg font-bold text-green-600">₹{medicine.price}</p>
                          <Badge 
                            variant={medicine.inStock ? 'default' : 'secondary'}
                            className={medicine.inStock ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}
                          >
                            {medicine.inStock ? (t('inStock') || 'In Stock') : (t('outOfStock') || 'Out of Stock')}
                          </Badge>
                        </div>
                        <Button
                          onClick={() => setSelectedMedicine(medicine)}
                          disabled={!medicine.inStock}
                          size="sm"
                        >
                          {t('buy') || 'Buy'}
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            {}
            <div className="space-y-4">
              <Card className="p-4">
                <h4 className="font-medium mb-3">{t('availableBalance') || 'Available Balance'}</h4>
                <p className="text-2xl font-bold text-green-600">₹{walletBalance.toLocaleString()}</p>
              </Card>

              <Card className="p-4">
                <h4 className="font-medium mb-3">{t('thisMonth') || 'This Month'}</h4>
                <p className="text-xl font-bold text-blue-600">₹{getThisMonthExpenses().toLocaleString()}</p>
                <p className="text-sm text-gray-600">{t('totalExpenses') || 'Total Expenses'}</p>
              </Card>

              <Card className="p-4">
                <h4 className="font-medium mb-3">{t('recentPurchases') || 'Recent Purchases'}</h4>
                <div className="space-y-2">
                  {purchases.slice(0, 3).map((purchase) => (
                    <div key={purchase.id} className="flex justify-between text-sm">
                      <span className="truncate">{purchase.medicineName}</span>
                      <span className="font-medium">₹{purchase.totalAmount}</span>
                    </div>
                  ))}
                  {purchases.length === 0 && (
                    <p className="text-gray-500 text-sm">{t('noTransactions') || 'No recent purchases'}</p>
                  )}
                </div>
              </Card>
            </div>
          </div>
        </TabsContent>

        {}
        <TabsContent value="history" className="space-y-4">
          <h3 className="text-lg font-bold">{t('purchaseHistory') || 'Purchase History'}</h3>
          
          {purchases.length === 0 ? (
            <Card className="p-8 text-center">
              <Package className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <p className="text-gray-500">{t('noTransactions') || 'No transactions found'}</p>
            </Card>
          ) : (
            <div className="space-y-4">
              {purchases.map((purchase) => (
                <Card key={purchase.id} className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <h4 className="font-medium">{purchase.medicineName}</h4>
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <span>{t('quantity') || 'Qty'}: {purchase.quantity}</span>
                          <span>{t('price') || 'Price'}: ₹{purchase.price}</span>
                          <span>{t('transactionId') || 'TXN'}: {purchase.transactionId}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-green-600">₹{purchase.totalAmount}</p>
                      <p className="text-sm text-gray-500 flex items-center">
                        <Clock className="w-3 h-3 mr-1" />
                        {new Date(purchase.purchaseDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {}
        <TabsContent value="statement" className="space-y-4">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold">{t('monthlyStatement') || 'Monthly Statement'}</h3>
            <Button onClick={generateMonthlyStatement}>
              <Download className="w-4 h-4 mr-2" />
              {t('downloadStatement') || 'Download Statement'}
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card className="p-4 text-center">
              <Wallet className="w-8 h-8 mx-auto mb-2 text-blue-600" />
              <p className="text-sm text-gray-600">{t('availableBalance') || 'Current Balance'}</p>
              <p className="text-2xl font-bold text-blue-600">₹{walletBalance.toLocaleString()}</p>
            </Card>

            <Card className="p-4 text-center">
              <Calendar className="w-8 h-8 mx-auto mb-2 text-green-600" />
              <p className="text-sm text-gray-600">{t('thisMonth') || 'This Month'}</p>
              <p className="text-2xl font-bold text-green-600">₹{getThisMonthExpenses().toLocaleString()}</p>
            </Card>

            <Card className="p-4 text-center">
              <Receipt className="w-8 h-8 mx-auto mb-2 text-purple-600" />
              <p className="text-sm text-gray-600">{t('thisYear') || 'This Year'}</p>
              <p className="text-2xl font-bold text-purple-600">₹{getThisYearExpenses().toLocaleString()}</p>
            </Card>
          </div>

          <Card className="p-6">
            <h4 className="font-medium mb-4">Transaction Summary</h4>
            <div className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b">
                <span className="text-gray-600">Total Transactions</span>
                <span className="font-medium">{purchases.length}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b">
                <span className="text-gray-600">Average Transaction</span>
                <span className="font-medium">
                  ₹{purchases.length > 0 ? Math.round(purchases.reduce((sum, p) => sum + p.totalAmount, 0) / purchases.length) : 0}
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-b">
                <span className="text-gray-600">Most Purchased Medicine</span>
                <span className="font-medium">
                  {purchases.length > 0 
                    ? (() => {
                        const medicineQuantities = purchases.reduce((acc, purchase) => {
                          acc[purchase.medicineName] = (acc[purchase.medicineName] || 0) + purchase.quantity;
                          return acc;
                        }, {} as Record<string, number>);
                        const entries = Object.entries(medicineQuantities);
                        const sorted = entries.sort(([,a], [,b]) => b - a);
                        return sorted[0]?.[0] || 'N/A';
                      })()
                    : 'N/A'
                  }
                </span>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>

      {}
      {selectedMedicine && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold mb-4">{t('medicineDetails') || 'Medicine Details'}</h3>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium">{selectedMedicine.name}</h4>
                <p className="text-sm text-gray-600">{selectedMedicine.description}</p>
                <div className="mt-2 text-xs text-gray-500">
                  <p>{t('manufacturer') || 'Manufacturer'}: {selectedMedicine.manufacturer}</p>
                  <p>{t('expiryDate') || 'Expiry'}: {new Date(selectedMedicine.expiryDate).toLocaleDateString()}</p>
                </div>
              </div>
              
              <div>
                <Label>{t('quantity') || 'Quantity'}</Label>
                <Select value={selectedQuantity.toString()} onValueChange={(value) => setSelectedQuantity(parseInt(value))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3, 4, 5, 10].map((qty) => (
                      <SelectItem key={qty} value={qty.toString()}>{qty}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="bg-gray-50 p-3 rounded">
                <div className="flex justify-between text-sm mb-1">
                  <span>{t('price') || 'Price'}</span>
                  <span>₹{selectedMedicine.price}</span>
                </div>
                <div className="flex justify-between text-sm mb-1">
                  <span>{t('quantity') || 'Quantity'}</span>
                  <span>{selectedQuantity}</span>
                </div>
                <div className="flex justify-between font-bold">
                  <span>{t('totalAmount') || 'Total'}</span>
                  <span>₹{selectedMedicine.price * selectedQuantity}</span>
                </div>
              </div>

              <div className="flex space-x-2">
                <Button 
                  onClick={() => handlePurchase(selectedMedicine)} 
                  className="flex-1"
                  disabled={loading}
                >
                  {loading ? 'Processing...' : `${t('buyNow') || 'Buy Now'} - ₹${selectedMedicine.price * selectedQuantity}`}
                </Button>
                <Button onClick={() => setSelectedMedicine(null)} variant="outline" className="flex-1">
                  Cancel
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}