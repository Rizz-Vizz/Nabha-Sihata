import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { useLanguage } from './language-context';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowLeft, 
  Package,
  Truck,
  CheckCircle,
  Clock,
  MapPin,
  Phone,
  Star,
  RefreshCw,
  MessageCircle,
  Navigation,
  Camera,
  AlertCircle,
  ThumbsUp,
  ThumbsDown,
  Share2,
  Download,
  Calendar,
  User,
  Shield,
  Zap,
  Heart,
  Gift
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface DeliveryStep {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  status: 'completed' | 'current' | 'pending';
  location?: string;
  icon: any;
}

interface DeliveryPartner {
  id: string;
  name: string;
  phone: string;
  rating: number;
  totalDeliveries: number;
  vehicleNumber: string;
  photo: string;
}

interface Order {
  id: string;
  orderNumber: string;
  items: {
    name: string;
    quantity: number;
    price: number;
  }[];
  totalAmount: number;
  orderDate: string;
  estimatedDelivery: string;
  deliveryAddress: {
    name: string;
    address: string;
    phone: string;
  };
  currentStatus: 'confirmed' | 'packed' | 'shipped' | 'out-for-delivery' | 'delivered';
  deliveryPartner?: DeliveryPartner;
  trackingSteps: DeliveryStep[];
  isExpressDelivery: boolean;
  isPrescriptionOrder: boolean;
}

interface DeliveryTrackingProps {
  orderId: string;
  onBack: () => void;
}

export function DeliveryTracking({ orderId, onBack }: DeliveryTrackingProps) {
  const { t } = useLanguage();
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showPartnerDetails, setShowPartnerDetails] = useState(false);
  const [deliveryRating, setDeliveryRating] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);

  
  useEffect(() => {
    const fetchOrderDetails = () => {
      setIsLoading(true);
      
      
      setTimeout(() => {
        const mockOrder: Order = {
          id: orderId,
          orderNumber: `NBH${orderId.slice(-6).toUpperCase()}`,
          items: [
            { name: 'Paracetamol 500mg', quantity: 2, price: 45 },
            { name: 'Vitamin D3 60000 IU', quantity: 1, price: 150 },
            { name: 'Digene Tablet', quantity: 1, price: 25 }
          ],
          totalAmount: 220,
          orderDate: '2024-01-20T10:30:00Z',
          estimatedDelivery: '2024-01-20T18:00:00Z',
          deliveryAddress: {
            name: 'Rajinder Singh',
            address: 'House No. 123, Sector 45, Nabha, Punjab - 147201',
            phone: '+91 98765 43210'
          },
          currentStatus: 'out-for-delivery',
          isExpressDelivery: true,
          isPrescriptionOrder: false,
          deliveryPartner: {
            id: 'dp001',
            name: 'Harpreet Singh',
            phone: '+91 98765 12345',
            rating: 4.8,
            totalDeliveries: 2847,
            vehicleNumber: 'PB 10 AB 1234',
            photo: '/delivery-partner.jpg'
          },
          trackingSteps: [
            {
              id: 'step1',
              title: 'Order Confirmed',
              description: 'Your order has been confirmed and payment received',
              timestamp: '2024-01-20T10:30:00Z',
              status: 'completed',
              location: 'Nabha Sihata Pharmacy',
              icon: CheckCircle
            },
            {
              id: 'step2',
              title: 'Medicine Verification',
              description: 'Medicines verified for quality and authenticity',
              timestamp: '2024-01-20T11:00:00Z',
              status: 'completed',
              location: 'Quality Check Department',
              icon: Shield
            },
            {
              id: 'step3',
              title: 'Order Packed',
              description: 'Your medicines are securely packed for delivery',
              timestamp: '2024-01-20T12:00:00Z',
              status: 'completed',
              location: 'Packaging Center',
              icon: Package
            },
            {
              id: 'step4',
              title: 'Out for Delivery',
              description: 'Your order is on the way with our delivery partner',
              timestamp: '2024-01-20T14:30:00Z',
              status: 'current',
              location: 'Last location: Near City Hospital, Nabha',
              icon: Truck
            },
            {
              id: 'step5',
              title: 'Delivered',
              description: 'Order delivered successfully',
              timestamp: '',
              status: 'pending',
              location: 'Your Address',
              icon: Gift
            }
          ]
        };

        setOrder(mockOrder);
        setIsLoading(false);
      }, 1500);
    };

    fetchOrderDetails();
  }, [orderId]);

  const refreshTracking = () => {
    setIsRefreshing(true);
    
    
    setTimeout(() => {
      if (order) {
        const updatedOrder = { ...order };
        
        const currentStep = updatedOrder.trackingSteps.find(step => step.status === 'current');
        if (currentStep) {
          currentStep.timestamp = new Date().toISOString();
          currentStep.location = 'Last location: Near Main Market, Nabha (2 min ago)';
        }
        setOrder(updatedOrder);
      }
      setIsRefreshing(false);
      toast.success('Tracking information updated!');
    }, 1000);
  };

  const callDeliveryPartner = () => {
    if (order?.deliveryPartner) {
      toast.success(`Calling ${order.deliveryPartner.name}...`);
      
    }
  };

  const chatWithPartner = () => {
    toast.success('Opening chat with delivery partner...');
    
  };

  const submitFeedback = () => {
    if (deliveryRating === 0) {
      toast.error('Please provide a rating');
      return;
    }
    
    toast.success('Thank you for your feedback! 🙏');
    setShowFeedback(false);
  };

  const shareTracking = () => {
    
    navigator.clipboard?.writeText(`Track your Nabha Sihata order: ${window.location.origin}/track/${orderId}`);
    toast.success('Tracking link copied to clipboard!');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-blue-50 to-purple-50 flex items-center justify-center">
        <Card className="p-8 text-center max-w-md">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-800 mb-2">Order Not Found</h3>
          <p className="text-gray-600 mb-6">We couldn't find an order with this ID.</p>
          <Button onClick={onBack} variant="outline">
            Go Back
          </Button>
        </Card>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-blue-500';
      case 'packed': return 'bg-purple-500';
      case 'shipped': return 'bg-orange-500';
      case 'out-for-delivery': return 'bg-emerald-500';
      case 'delivered': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getEstimatedTime = () => {
    const now = new Date();
    const estimated = new Date(order.estimatedDelivery);
    const diffInMinutes = Math.floor((estimated.getTime() - now.getTime()) / (1000 * 60));
    
    if (diffInMinutes <= 0) return 'Any moment now';
    if (diffInMinutes < 60) return `${diffInMinutes} minutes`;
    return `${Math.floor(diffInMinutes / 60)} hours ${diffInMinutes % 60} minutes`;
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
              className="flex items-center space-x-2 hover:bg-emerald-50 border-emerald-200"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{t('back')}</span>
            </Button>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                Track Your Order
              </h1>
              <p className="text-gray-600">Order #{order.orderNumber}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <Button
              onClick={refreshTracking}
              variant="outline"
              size="sm"
              disabled={isRefreshing}
              className="border-emerald-200 hover:bg-emerald-50"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Button
              onClick={shareTracking}
              variant="outline"
              size="sm"
              className="border-blue-200 hover:bg-blue-50"
            >
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>
          </div>
        </div>
      </div>

      <div className="p-6 max-w-4xl mx-auto space-y-8">
        {}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Card className="p-6 bg-gradient-to-r from-emerald-500 to-teal-500 text-white">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-2xl font-bold mb-2">
                  {order.currentStatus === 'delivered' ? 'Delivered Successfully!' : 'On The Way'}
                </h2>
                <p className="opacity-90">
                  {order.currentStatus === 'delivered' 
                    ? 'Your medicines have been delivered safely'
                    : `Estimated delivery: ${getEstimatedTime()}`
                  }
                </p>
              </div>
              <div className="text-right">
                <div className={`w-16 h-16 ${getStatusColor(order.currentStatus)} rounded-full flex items-center justify-center mb-2`}>
                  {order.currentStatus === 'delivered' ? (
                    <Gift className="w-8 h-8" />
                  ) : (
                    <Truck className="w-8 h-8" />
                  )}
                </div>
                <div className="text-sm opacity-75">
                  {order.isExpressDelivery && <Badge className="bg-yellow-400 text-yellow-900">Express</Badge>}
                </div>
              </div>
            </div>

            {}
            <div className="w-full bg-white/20 rounded-full h-2 mb-4">
              <div 
                className="bg-white h-2 rounded-full transition-all duration-1000"
                style={{ 
                  width: `${(order.trackingSteps.filter(step => step.status === 'completed').length / order.trackingSteps.length) * 100}%` 
                }}
              ></div>
            </div>

            {}
            {order.currentStatus !== 'delivered' && order.deliveryPartner && (
              <div className="flex space-x-3">
                <Button
                  onClick={callDeliveryPartner}
                  variant="secondary"
                  className="bg-white/20 hover:bg-white/30 text-white border-white/30"
                >
                  <Phone className="w-4 h-4 mr-2" />
                  Call Partner
                </Button>
                <Button
                  onClick={chatWithPartner}
                  variant="secondary"
                  className="bg-white/20 hover:bg-white/30 text-white border-white/30"
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Chat
                </Button>
                <Button
                  onClick={() => toast.success('Opening live tracking...')}
                  variant="secondary"
                  className="bg-white/20 hover:bg-white/30 text-white border-white/30"
                >
                  <Navigation className="w-4 h-4 mr-2" />
                  Live Track
                </Button>
              </div>
            )}
          </Card>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Card className="p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-6">Delivery Timeline</h3>
                
                <div className="space-y-6">
                  {order.trackingSteps.map((step, index) => (
                    <motion.div
                      key={step.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                      className="flex items-start space-x-4"
                    >
                      {}
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                        step.status === 'completed' ? 'bg-emerald-500 text-white' :
                        step.status === 'current' ? 'bg-blue-500 text-white' :
                        'bg-gray-200 text-gray-400'
                      }`}>
                        {step.status === 'current' && step.id === 'step4' ? (
                          <motion.div
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ duration: 1, repeat: Infinity }}
                          >
                            <step.icon className="w-6 h-6" />
                          </motion.div>
                        ) : (
                          <step.icon className="w-6 h-6" />
                        )}
                      </div>

                      {}
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="font-bold text-gray-800">{step.title}</h4>
                            <p className="text-gray-600 text-sm mb-1">{step.description}</p>
                            {step.location && (
                              <div className="flex items-center space-x-1 text-xs text-gray-500">
                                <MapPin className="w-3 h-3" />
                                <span>{step.location}</span>
                              </div>
                            )}
                          </div>
                          {step.timestamp && (
                            <div className="text-xs text-gray-500 text-right">
                              {new Date(step.timestamp).toLocaleString()}
                            </div>
                          )}
                        </div>
                      </div>

                      {}
                      {index < order.trackingSteps.length - 1 && (
                        <div className={`absolute left-11 mt-12 w-0.5 h-8 ${
                          step.status === 'completed' ? 'bg-emerald-300' : 'bg-gray-200'
                        }`} style={{ marginLeft: '1.5rem' }} />
                      )}
                    </motion.div>
                  ))}
                </div>
              </Card>
            </motion.div>

            {}
            {order.deliveryPartner && order.currentStatus !== 'delivered' && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="mt-6"
              >
                <Card className="p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-4">Delivery Partner</h3>
                  
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center">
                      <User className="w-8 h-8 text-white" />
                    </div>
                    
                    <div className="flex-1">
                      <h4 className="font-bold text-gray-800">{order.deliveryPartner.name}</h4>
                      <div className="flex items-center space-x-2 mb-1">
                        <div className="flex items-center space-x-1">
                          <Star className="w-4 h-4 text-yellow-400 fill-current" />
                          <span className="text-sm font-medium">{order.deliveryPartner.rating}</span>
                        </div>
                        <span className="text-sm text-gray-500">
                          ({order.deliveryPartner.totalDeliveries.toLocaleString()} deliveries)
                        </span>
                      </div>
                      <div className="text-sm text-gray-600">
                        Vehicle: {order.deliveryPartner.vehicleNumber}
                      </div>
                    </div>
                    
                    <div className="flex space-x-2">
                      <Button
                        onClick={callDeliveryPartner}
                        size="sm"
                        variant="outline"
                        className="border-emerald-200 hover:bg-emerald-50"
                      >
                        <Phone className="w-4 h-4" />
                      </Button>
                      <Button
                        onClick={chatWithPartner}
                        size="sm"
                        variant="outline"
                        className="border-blue-200 hover:bg-blue-50"
                      >
                        <MessageCircle className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            )}
          </div>

          {}
          <div className="space-y-6">
            {}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <Card className="p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4">Order Details</h3>
                
                <div className="space-y-3 mb-4">
                  {order.items.map((item, index) => (
                    <div key={index} className="flex justify-between text-sm">
                      <span className="text-gray-600">{item.name} × {item.quantity}</span>
                      <span className="font-medium">₹{(item.price * item.quantity).toLocaleString()}</span>
                    </div>
                  ))}
                </div>
                
                <div className="border-t pt-3">
                  <div className="flex justify-between font-bold">
                    <span>Total Amount</span>
                    <span className="text-emerald-600">₹{order.totalAmount.toLocaleString()}</span>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t">
                  <div className="flex items-center space-x-2 text-sm text-gray-600 mb-2">
                    <Calendar className="w-4 h-4" />
                    <span>Ordered: {new Date(order.orderDate).toLocaleDateString()}</span>
                  </div>
                  {order.isExpressDelivery && (
                    <div className="flex items-center space-x-2 text-sm text-emerald-600">
                      <Zap className="w-4 h-4" />
                      <span>Express Delivery</span>
                    </div>
                  )}
                  {order.isPrescriptionOrder && (
                    <div className="flex items-center space-x-2 text-sm text-purple-600">
                      <Shield className="w-4 h-4" />
                      <span>Prescription Verified</span>
                    </div>
                  )}
                </div>
              </Card>
            </motion.div>

            {}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Card className="p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4">Delivery Address</h3>
                
                <div className="space-y-2">
                  <div className="font-medium text-gray-800">{order.deliveryAddress.name}</div>
                  <div className="text-sm text-gray-600">{order.deliveryAddress.address}</div>
                  <div className="text-sm text-gray-600">{order.deliveryAddress.phone}</div>
                </div>
              </Card>
            </motion.div>

            {}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <Card className="p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4">Quick Actions</h3>
                
                <div className="space-y-3">
                  <Button
                    onClick={() => toast.success('Downloading invoice...')}
                    variant="outline"
                    className="w-full justify-start border-emerald-200 hover:bg-emerald-50"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download Invoice
                  </Button>
                  
                  {order.currentStatus === 'delivered' ? (
                    <Button
                      onClick={() => setShowFeedback(true)}
                      variant="outline"
                      className="w-full justify-start border-blue-200 hover:bg-blue-50"
                    >
                      <Star className="w-4 h-4 mr-2" />
                      Rate Delivery
                    </Button>
                  ) : (
                    <Button
                      onClick={() => toast.success('Opening help center...')}
                      variant="outline"
                      className="w-full justify-start border-red-200 hover:bg-red-50"
                    >
                      <AlertCircle className="w-4 h-4 mr-2" />
                      Need Help?
                    </Button>
                  )}
                  
                  <Button
                    onClick={() => toast.success('Reordering medicines...')}
                    className="w-full bg-emerald-600 hover:bg-emerald-700"
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Reorder
                  </Button>
                </div>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>

      {}
      <AnimatePresence>
        {showFeedback && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setShowFeedback(false)}
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
                  <h3 className="text-xl font-bold text-gray-800">Rate Your Experience</h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowFeedback(false)}
                    className="w-8 h-8 p-0"
                  >
                    <ArrowLeft className="w-4 h-4" />
                  </Button>
                </div>

                <div className="text-center mb-6">
                  <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Heart className="w-10 h-10 text-emerald-600" />
                  </div>
                  <h4 className="text-lg font-bold text-gray-800 mb-2">How was your delivery?</h4>
                  <p className="text-gray-600">Your feedback helps us improve our service</p>
                </div>

                {}
                <div className="flex justify-center space-x-2 mb-6">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <motion.button
                      key={star}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setDeliveryRating(star)}
                      className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
                        star <= deliveryRating 
                          ? 'bg-yellow-400 text-white' 
                          : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                      }`}
                    >
                      <Star className="w-6 h-6 fill-current" />
                    </motion.button>
                  ))}
                </div>

                {}
                <div className="grid grid-cols-2 gap-3 mb-6">
                  <Button
                    variant="outline"
                    className="h-12 text-sm border-green-200 hover:bg-green-50"
                    onClick={() => {
                      setDeliveryRating(5);
                      toast.success('Thank you for the positive feedback! 😊');
                    }}
                  >
                    <ThumbsUp className="w-4 h-4 mr-2" />
                    Excellent
                  </Button>
                  <Button
                    variant="outline"
                    className="h-12 text-sm border-red-200 hover:bg-red-50"
                    onClick={() => {
                      setDeliveryRating(2);
                      toast.info('We will work on improving our service');
                    }}
                  >
                    <ThumbsDown className="w-4 h-4 mr-2" />
                    Poor
                  </Button>
                </div>

                <div className="space-y-3">
                  <Button
                    onClick={submitFeedback}
                    disabled={deliveryRating === 0}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 h-12 rounded-xl font-medium"
                  >
                    Submit Feedback
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setShowFeedback(false)}
                    className="w-full h-12 rounded-xl"
                  >
                    Skip for Now
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}