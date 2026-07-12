import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { useLanguage } from './language-context';
import { HealthTip } from './health-tip';
import { 
  ArrowLeft, 
  MapPin, 
  Navigation, 
  Phone, 
  Star, 
  Search, 
  Clock,
  Route,
  Pill,
  Loader2,
  ShoppingBag,
  AlertCircle,
  CheckCircle,
  Info,
  DollarSign
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface Pharmacy {
  id: string;
  name: string;
  address: string;
  contact: string;
  latitude: number;
  longitude: number;
  type: 'retail' | 'hospital' | 'generic' | '24hour';
  rating: number;
  distance?: number;
  isOpen: boolean;
  hours: string;
  services: string[];
  hasDelivery: boolean;
  deliveryRadius: number; 
  deliveryFee: number;
  accepts: string[]; 
}

interface UserLocation {
  lat: number;
  lng: number;
}

interface PharmacyFinderProps {
  onBack: () => void;
}


const samplePharmacies: Pharmacy[] = [
  {
    id: 'p1',
    name: 'Sharma Medical Store',
    address: 'Main Bazaar, Nabha, Punjab 147201',
    contact: '+91-9876543210',
    latitude: 30.3753,
    longitude: 76.1539,
    type: 'retail',
    rating: 4.2,
    isOpen: true,
    hours: '7:00 AM - 10:00 PM',
    services: ['Prescription Medicines', 'OTC Drugs', 'Health Checkup'],
    hasDelivery: true,
    deliveryRadius: 5,
    deliveryFee: 20,
    accepts: ['Cash', 'UPI', 'ESI', 'CGHS']
  },
  {
    id: 'p2',
    name: 'Apollo Pharmacy',
    address: 'Civil Hospital Road, Nabha, Punjab 147201',
    contact: '+91-9876543211',
    latitude: 30.3734,
    longitude: 76.1522,
    type: 'retail',
    rating: 4.5,
    isOpen: true,
    hours: '8:00 AM - 11:00 PM',
    services: ['Prescription Medicines', 'OTC Drugs', 'Digital Health Services', 'Home Delivery'],
    hasDelivery: true,
    deliveryRadius: 10,
    deliveryFee: 25,
    accepts: ['Cash', 'Card', 'UPI', 'Insurance']
  },
  {
    id: 'p3',
    name: 'Government Medical Store',
    address: 'Primary Health Centre, Nabha, Punjab 147201',
    contact: '+91-9876543212',
    latitude: 30.3712,
    longitude: 76.1567,
    type: 'hospital',
    rating: 3.8,
    isOpen: true,
    hours: '9:00 AM - 5:00 PM',
    services: ['Free Medicines', 'Vaccination', 'Generic Drugs'],
    hasDelivery: false,
    deliveryRadius: 0,
    deliveryFee: 0,
    accepts: ['Free for BPL', 'Ayushman Bharat']
  },
  {
    id: 'p4',
    name: 'Jan Aushadhi Kendra',
    address: 'Bus Stand Road, Nabha, Punjab 147201',
    contact: '+91-9876543213',
    latitude: 30.3789,
    longitude: 76.1512,
    type: 'generic',
    rating: 4.0,
    isOpen: true,
    hours: '9:00 AM - 6:00 PM',
    services: ['Generic Medicines', 'Discounted Prices', 'Government Approved'],
    hasDelivery: false,
    deliveryRadius: 0,
    deliveryFee: 0,
    accepts: ['Cash', 'UPI']
  },
  {
    id: 'p5',
    name: '24/7 Medical Store',
    address: 'GT Road, Near Petrol Pump, Nabha, Punjab 147201',
    contact: '+91-9876543214',
    latitude: 30.3698,
    longitude: 76.1598,
    type: '24hour',
    rating: 4.3,
    isOpen: true,
    hours: '24 Hours',
    services: ['Emergency Medicines', '24x7 Service', 'Home Delivery', 'First Aid'],
    hasDelivery: true,
    deliveryRadius: 8,
    deliveryFee: 30,
    accepts: ['Cash', 'UPI', 'Card']
  },
  {
    id: 'p6',
    name: 'MedPlus Pharmacy',
    address: 'Patiala Road, Nabha, Punjab 147201',
    contact: '+91-9876543215',
    latitude: 30.3801,
    longitude: 76.1456,
    type: 'retail',
    rating: 4.4,
    isOpen: false,
    hours: '8:00 AM - 9:00 PM',
    services: ['Prescription Medicines', 'Health Products', 'Online Ordering'],
    hasDelivery: true,
    deliveryRadius: 7,
    deliveryFee: 15,
    accepts: ['Cash', 'Card', 'UPI', 'Wallets']
  },
  {
    id: 'p7',
    name: 'Baba Deep Singh Medical Store',
    address: 'Gurdwara Road, Nabha, Punjab 147201',
    contact: '+91-9876543216',
    latitude: 30.3723,
    longitude: 76.1589,
    type: 'retail',
    rating: 4.1,
    isOpen: true,
    hours: '7:30 AM - 9:30 PM',
    services: ['Prescription Medicines', 'Ayurvedic Products', 'Blood Pressure Check'],
    hasDelivery: true,
    deliveryRadius: 4,
    deliveryFee: 25,
    accepts: ['Cash', 'UPI']
  }
];

const pharmacyTypeConfig = {
  'retail': { color: 'bg-blue-100 text-blue-800', icon: 'bg-blue-500' },
  'hospital': { color: 'bg-green-100 text-green-800', icon: 'bg-green-500' },
  'generic': { color: 'bg-orange-100 text-orange-800', icon: 'bg-orange-500' },
  '24hour': { color: 'bg-purple-100 text-purple-800', icon: 'bg-purple-500' }
};

const emergencyContacts = {
  ambulance: '108',
  medicalHelpline: '104',
  poisonControl: '1066'
};


const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  const R = 6371; 
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
};


const getCurrentLocation = (): Promise<UserLocation> => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      console.warn('Geolocation not supported by browser, using default location (Nabha, Punjab)');
      resolve({ lat: 30.37, lng: 76.15 });
      return;
    }

    
    if (location.protocol !== 'https:' && location.hostname !== 'localhost' && location.hostname !== '127.0.0.1') {
      console.warn('Geolocation requires HTTPS, using default location (Nabha, Punjab)');
      resolve({ lat: 30.37, lng: 76.15 });
      return;
    }

    const options = {
      enableHighAccuracy: false, 
      timeout: 10000,
      maximumAge: 300000 
    };

    try {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const coords = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          
          
          if (coords.lat < -90 || coords.lat > 90 || coords.lng < -180 || coords.lng > 180) {
            console.warn('Invalid coordinates received, using default location (Nabha, Punjab)');
            resolve({ lat: 30.37, lng: 76.15 });
            return;
          }
          
          resolve(coords);
        },
        (error) => {
          let errorMessage = 'Unknown geolocation error';
          
          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage = 'Location permission denied by user';
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage = 'Location information unavailable';
              break;
            case error.TIMEOUT:
              errorMessage = 'Location request timed out';
              break;
            default:
              errorMessage = error.message || 'Unknown error occurred';
              break;
          }
          
          
          if (error.code === error.PERMISSION_DENIED) {
            console.info('Geolocation failed, using default location (Nabha, Punjab):', errorMessage);
          } else {
            console.warn('Geolocation failed, using default location (Nabha, Punjab):', errorMessage);
          }
          resolve({ lat: 30.37, lng: 76.15 });
        },
        options
      );
    } catch (error: any) {
      
      if (error.message && error.message.includes('permissions policy')) {
        console.warn('Geolocation blocked by permissions policy, using default location (Nabha, Punjab)');
      } else {
        console.warn('Geolocation error:', error.message || 'Unknown error');
      }
      resolve({ lat: 30.37, lng: 76.15 });
    }
  });
};

export function PharmacyFinder({ onBack }: PharmacyFinderProps) {
  const { t } = useLanguage();
  const [pharmacies, setPharmacies] = useState<Pharmacy[]>([]);
  const [filteredPharmacies, setFilteredPharmacies] = useState<Pharmacy[]>([]);
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'distance' | 'rating' | 'name'>('distance');
  const [showOpenOnly, setShowOpenOnly] = useState(false);
  const [showDeliveryOnly, setShowDeliveryOnly] = useState(false);

  
  const handleGetCurrentLocation = async () => {
    setLoadingLocation(true);
    try {
      const location = await getCurrentLocation();
      setUserLocation(location);
      
      
      if (location.lat === 30.37 && location.lng === 76.15) {
        
        console.log('Using default area (Nabha, Punjab) - location not available');
      } else {
        toast.success('Location detected successfully!');
      }
      
      
      const pharmaciesWithDistance = samplePharmacies.map(pharmacy => ({
        ...pharmacy,
        distance: calculateDistance(location.lat, location.lng, pharmacy.latitude, pharmacy.longitude)
      }));
      
      setPharmacies(pharmaciesWithDistance);
    } catch (error: any) {
      console.error('Location error:', error);
      
      
      if (!error.message || !error.message.includes('permissions policy')) {
        toast.error('Could not get your location. Using default area.');
      }
      
      
      const defaultLocation = { lat: 30.37, lng: 76.15 };
      setUserLocation(defaultLocation);
      
      const pharmaciesWithDistance = samplePharmacies.map(pharmacy => ({
        ...pharmacy,
        distance: calculateDistance(
          defaultLocation.lat, 
          defaultLocation.lng, 
          pharmacy.latitude, 
          pharmacy.longitude
        )
      }));
      setPharmacies(pharmaciesWithDistance);
    } finally {
      setLoadingLocation(false);
    }
  };

  
  useEffect(() => {
    let filtered = pharmacies.filter(pharmacy => {
      const matchesSearch = pharmacy.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          pharmacy.address.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType = selectedType === 'all' || pharmacy.type === selectedType;
      const matchesOpen = !showOpenOnly || pharmacy.isOpen;
      const matchesDelivery = !showDeliveryOnly || pharmacy.hasDelivery;
      
      return matchesSearch && matchesType && matchesOpen && matchesDelivery;
    });

    
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'distance':
          return (a.distance || 0) - (b.distance || 0);
        case 'rating':
          return b.rating - a.rating;
        case 'name':
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });

    setFilteredPharmacies(filtered);
  }, [pharmacies, searchQuery, selectedType, sortBy, showOpenOnly, showDeliveryOnly]);

  
  useEffect(() => {
    setLoading(true);
    
    setTimeout(() => {
      setLoading(false);
    }, 500);
  }, []);

  
  useEffect(() => {
    const timer = setTimeout(() => {
      handleGetCurrentLocation();
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  const openInMaps = (pharmacy: Pharmacy) => {
    const destination = `${pharmacy.latitude},${pharmacy.longitude}`;
    const url = `https://www.google.com/maps/dir/?api=1&destination=${destination}&travelmode=driving`;
    window.open(url, '_blank');
  };

  const callPharmacy = (contact: string) => {
    window.open(`tel:${contact}`, '_self');
  };

  const requestDelivery = (pharmacy: Pharmacy) => {
    const message = `Hello! I would like to request medicine delivery from ${pharmacy.name}. My location: ${userLocation?.lat}, ${userLocation?.lng}`;
    const whatsappUrl = `https://wa.me/${pharmacy.contact.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const getPharmacyTypeColor = (type: string): string => {
    return pharmacyTypeConfig[type]?.color || 'bg-gray-100 text-gray-800';
  };

  const getPharmacyIconColor = (type: string): string => {
    return pharmacyTypeConfig[type]?.icon || 'bg-gray-500';
  };

  const pharmacyTypes = ['all', 'retail', 'hospital', 'generic', '24hour'];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-white flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-green-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading pharmacies...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      {}
      <div className="bg-white shadow-sm p-4 sticky top-0 z-10">
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          <div className="flex items-center space-x-3">
            <Button variant="ghost" size="sm" onClick={onBack}>
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div>
              <h1 className="font-bold text-gray-800">💊 Nearby Pharmacies</h1>
              <p className="text-sm text-gray-600">
                {loadingLocation ? 
                  'Detecting your location...' : 
                  userLocation ?
                    `${filteredPharmacies.length} pharmacies found${userLocation.lat === 30.37 && userLocation.lng === 76.15 ? ' (default area)' : ' near you'}` : 
                    'Location unavailable'
                }
              </p>
            </div>
          </div>
          
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleGetCurrentLocation}
            disabled={loadingLocation}
          >
            {loadingLocation ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Navigation className="w-4 h-4" />
            )}
          </Button>
        </div>
      </div>

      <div className="p-4 max-w-4xl mx-auto">
        {}
        <Card className="p-4 mb-6">
          <div className="space-y-4">
            {}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search pharmacies or areas..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Pharmacy Type
                </label>
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="w-full p-2 border rounded-md text-sm"
                >
                  <option value="all">All Types</option>
                  <option value="retail">Retail Pharmacy</option>
                  <option value="hospital">Hospital Pharmacy</option>
                  <option value="generic">Generic Store</option>
                  <option value="24hour">24-Hour Store</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sort By
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as 'distance' | 'rating' | 'name')}
                  className="w-full p-2 border rounded-md text-sm"
                >
                  <option value="distance">Distance</option>
                  <option value="rating">Rating</option>
                  <option value="name">Name</option>
                </select>
              </div>
            </div>

            {}
            <div className="flex flex-wrap gap-2">
              <Button
                variant={showOpenOnly ? "default" : "outline"}
                size="sm"
                onClick={() => setShowOpenOnly(!showOpenOnly)}
                className="text-xs"
              >
                <CheckCircle className="w-3 h-3 mr-1" />
                Open Now
              </Button>
              <Button
                variant={showDeliveryOnly ? "default" : "outline"}
                size="sm"
                onClick={() => setShowDeliveryOnly(!showDeliveryOnly)}
                className="text-xs"
              >
                <ShoppingBag className="w-3 h-3 mr-1" />
                Home Delivery
              </Button>
            </div>
          </div>
        </Card>

        {}
        <div className="space-y-4">
          {filteredPharmacies.map((pharmacy) => (
            <Card key={pharmacy.id} className="p-4 hover:shadow-lg transition-shadow">
              <div className="flex items-start space-x-4">
                {}
                <div className={`w-12 h-12 ${getPharmacyIconColor(pharmacy.type)} rounded-full flex items-center justify-center flex-shrink-0`}>
                  <Pill className="w-6 h-6 text-white" />
                </div>

                {}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className="font-semibold text-gray-800 truncate">{pharmacy.name}</h3>
                        {pharmacy.isOpen ? (
                          <Badge className="bg-green-100 text-green-800 text-xs">Open</Badge>
                        ) : (
                          <Badge className="bg-red-100 text-red-800 text-xs">Closed</Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 truncate">{pharmacy.address}</p>
                    </div>
                    
                    {pharmacy.distance && pharmacy.distance > 0 && (
                      <div className="text-right flex-shrink-0 ml-2">
                        <div className="flex items-center text-sm text-green-600">
                          <MapPin className="w-3 h-3 mr-1" />
                          {pharmacy.distance.toFixed(1)} km
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center space-x-3 mb-3">
                    <Badge className={getPharmacyTypeColor(pharmacy.type)}>
                      {pharmacy.type.charAt(0).toUpperCase() + pharmacy.type.slice(1)}
                    </Badge>
                    
                    <div className="flex items-center">
                      <Star className="w-4 h-4 text-yellow-500 mr-1" />
                      <span className="text-sm font-medium">{pharmacy.rating}</span>
                    </div>

                    <div className="flex items-center text-xs text-gray-500">
                      <Clock className="w-3 h-3 mr-1" />
                      <span>{pharmacy.hours}</span>
                    </div>
                  </div>

                  {}
                  <div className="mb-3">
                    <div className="flex flex-wrap gap-1">
                      {pharmacy.services.slice(0, 3).map((service, index) => (
                        <span key={index} className="inline-block bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded">
                          {service}
                        </span>
                      ))}
                      {pharmacy.services.length > 3 && (
                        <span className="inline-block bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded">
                          +{pharmacy.services.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>

                  {}
                  {pharmacy.hasDelivery && (
                    <div className="mb-3 p-2 bg-blue-50 rounded-lg">
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center space-x-2">
                          <ShoppingBag className="w-3 h-3 text-blue-600" />
                          <span className="text-blue-800">Home delivery available</span>
                        </div>
                        <div className="flex items-center space-x-2 text-blue-600">
                          <span>₹{pharmacy.deliveryFee}</span>
                          <span>•</span>
                          <span>{pharmacy.deliveryRadius}km radius</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {}
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      onClick={() => callPharmacy(pharmacy.contact)}
                      className="flex-1"
                    >
                      <Phone className="w-4 h-4 mr-2" />
                      Call
                    </Button>
                    
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => openInMaps(pharmacy)}
                      className="flex-1"
                    >
                      <Route className="w-4 h-4 mr-2" />
                      Directions
                    </Button>

                    {pharmacy.hasDelivery && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => requestDelivery(pharmacy)}
                        className="flex-1 text-green-600 border-green-200 hover:bg-green-50"
                      >
                        <ShoppingBag className="w-4 h-4 mr-2" />
                        Delivery
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {filteredPharmacies.length === 0 && !loading && (
          <Card className="p-8 text-center">
            <div className="text-gray-400 mb-4">
              <Pill className="w-12 h-12 mx-auto" />
            </div>
            <h3 className="font-semibold text-gray-800 mb-2">No pharmacies found</h3>
            <p className="text-gray-600 mb-4">
              {searchQuery || selectedType !== 'all' || showOpenOnly || showDeliveryOnly
                ? 'Try adjusting your search or filter criteria.' 
                : 'No pharmacies available in your area.'}
            </p>
            {(searchQuery || selectedType !== 'all' || showOpenOnly || showDeliveryOnly) && (
              <Button 
                variant="outline" 
                onClick={() => {
                  setSearchQuery('');
                  setSelectedType('all');
                  setShowOpenOnly(false);
                  setShowDeliveryOnly(false);
                }}
                className="text-sm"
              >
                Clear Filters
              </Button>
            )}
          </Card>
        )}

        {}
        <Card className="p-4 mt-6">
          <h3 className="font-semibold text-gray-800 mb-4">🚨 Emergency Contacts</h3>
          <div className="grid grid-cols-2 gap-3">
            <Button
              variant="destructive"
              className="flex items-center justify-center space-x-2"
              onClick={() => window.open(`tel:${emergencyContacts.ambulance}`, '_self')}
            >
              <AlertCircle className="w-4 h-4" />
              <span>Ambulance {emergencyContacts.ambulance}</span>
            </Button>
            
            <Button
              variant="outline"
              className="flex items-center justify-center space-x-2 border-blue-200 text-blue-600 hover:bg-blue-50"
              onClick={() => window.open(`tel:${emergencyContacts.poisonControl}`, '_self')}
            >
              <Info className="w-4 h-4" />
              <span>Poison Control {emergencyContacts.poisonControl}</span>
            </Button>
          </div>
        </Card>

        {}
        <div className="mt-6 text-center text-sm text-gray-500">
          <p className="flex items-center justify-center space-x-2">
            <Clock className="w-4 h-4" />
            <span>Updated: {new Date().toLocaleDateString()}</span>
          </p>
          <p className="mt-1">
            Emergency: {emergencyContacts.ambulance} (Ambulance) • {emergencyContacts.poisonControl} (Poison Control)
          </p>
        </div>

        {}
        <HealthTip featureId="pharmacies" />
      </div>
    </div>
  );
}