import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Select } from './ui/select';
import { Badge } from './ui/badge';
import { useLanguage } from './language-context';
import { HealthTip } from './health-tip';
import { 
  loadHospitals, 
  findNearbyHospitals, 
  getCurrentLocation,
  calculateDistance,
  hospitalTypeConfig,
  emergencyContacts,
  type Hospital,
  type UserLocation
} from '../utils/hospitals';
import { 
  ArrowLeft, 
  MapPin, 
  Navigation, 
  Phone, 
  Star, 
  Search, 
  Filter,
  Clock,
  Shield,
  Route,
  Heart,
  Baby,
  Eye,
  Bone,
  Brain,
  Stethoscope,
  Activity,
  Loader2
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';



interface HospitalFinderProps {
  onBack: () => void;
  prioritizeMaternity?: boolean;
}

const hospitalTypeIcons: Record<string, React.ComponentType<any>> = {
  'General': Stethoscope,
  'Maternity': Baby,
  'Eye': Eye,
  'Orthopedic': Bone,
  'Neurological': Brain,
  'Cardiac': Heart,
  'Emergency': Shield,
  'Dental': Activity,
};

export function HospitalFinder({ onBack, prioritizeMaternity = false }: HospitalFinderProps) {
  const { t } = useLanguage();
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [filteredHospitals, setFilteredHospitals] = useState<Hospital[]>([]);
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'distance' | 'rating' | 'name'>('distance');
  const [selectedHospital, setSelectedHospital] = useState<Hospital | null>(null);

  
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
      
      
      const nearbyHospitals = await findNearbyHospitals(location, 100); 
      setHospitals(nearbyHospitals);
    } catch (error: any) {
      console.error('Location error:', error);
      
      
      if (!error.message || !error.message.includes('permissions policy')) {
        toast.error('Could not get your location. Using default area.');
      }
      
      
      const defaultLocation = { lat: 30.37, lng: 76.15 };
      setUserLocation(defaultLocation);
      
      try {
        const allHospitals = await loadHospitals();
        const hospitalsWithDistance = allHospitals.map(hospital => ({
          ...hospital,
          distance: calculateDistance(
            defaultLocation.lat, 
            defaultLocation.lng, 
            hospital.latitude, 
            hospital.longitude
          )
        }));
        setHospitals(hospitalsWithDistance);
      } catch (hospitalError) {
        console.error('Error loading hospitals:', hospitalError);
        toast.error('Could not load hospital data');
      }
    } finally {
      setLoadingLocation(false);
    }
  };

  
  const initializeHospitals = async () => {
    try {
      setLoading(true);
      const hospitalsData = await loadHospitals();
      setHospitals(hospitalsData);
      
      if (hospitalsData.length === 0) {
        console.log('Using sample hospital data - database table may not be set up yet');
      } else {
        console.log(`Loaded ${hospitalsData.length} hospitals from database`);
      }
    } catch (error: any) {
      console.log('Hospital database access failed, using sample data:', error.message);
      
      
    } finally {
      setLoading(false);
    }
  };

  
  useEffect(() => {
    let filtered = hospitals.filter(hospital => {
      const matchesSearch = hospital.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          hospital.address.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType = selectedType === 'all' || hospital.type === selectedType;
      return matchesSearch && matchesType;
    });

    
    filtered.sort((a, b) => {
      
      if (prioritizeMaternity) {
        const aIsMaternity = a.type === 'Maternity';
        const bIsMaternity = b.type === 'Maternity';
        
        if (aIsMaternity && !bIsMaternity) return -1;
        if (!aIsMaternity && bIsMaternity) return 1;
      }
      
      
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

    setFilteredHospitals(filtered);
  }, [hospitals, searchQuery, selectedType, sortBy]);

  
  useEffect(() => {
    initializeHospitals();
  }, []);

  
  useEffect(() => {
    
    const timer = setTimeout(() => {
      handleGetCurrentLocation();
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  
  useEffect(() => {
    const handleError = (error: ErrorEvent) => {
      console.error('Hospital Finder Error:', error);
      toast.error('An error occurred. Please refresh the page.');
    };

    window.addEventListener('error', handleError);
    return () => window.removeEventListener('error', handleError);
  }, []);

  const openInMaps = (hospital: Hospital) => {
    const destination = `${hospital.latitude},${hospital.longitude}`;
    const url = `https://www.google.com/maps/dir/?api=1&destination=${destination}&travelmode=driving`;
    window.open(url, '_blank');
  };

  const callHospital = (contact: string) => {
    window.open(`tel:${contact}`, '_self');
  };

  const getHospitalTypeColor = (type: string): string => {
    return hospitalTypeConfig[type]?.color || 'bg-gray-100 text-gray-800';
  };

  const hospitalTypes = ['all', 'General', 'Maternity', 'Eye', 'Orthopedic', 'Neurological', 'Cardiac', 'Emergency', 'Dental'];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading hospitals...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {}
      <div className="bg-white shadow-sm p-4 sticky top-0 z-10">
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          <div className="flex items-center space-x-3">
            <Button variant="ghost" size="sm" onClick={onBack}>
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div>
              <h1 className="font-bold text-gray-800">🏥 Hospital Finder</h1>
              <p className="text-sm text-gray-600">
                {loadingLocation ? 
                  'Detecting your location...' : 
                  userLocation ?
                    `${filteredHospitals.length} hospitals found${userLocation.lat === 30.37 && userLocation.lng === 76.15 ? ' (default area)' : ' near you'}` : 
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
                placeholder="Search hospitals or areas..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Hospital Type
                </label>
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="w-full p-2 border rounded-md text-sm"
                >
                  {hospitalTypes.map(type => (
                    <option key={type} value={type}>
                      {type === 'all' ? 'All Types' : type}
                    </option>
                  ))}
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
          </div>
        </Card>

        {}
        <div className="space-y-4">
          {filteredHospitals.map((hospital) => {
            const IconComponent = hospitalTypeIcons[hospital.type] || Stethoscope;
            
            return (
              <Card key={hospital.id} className="p-4 hover:shadow-lg transition-shadow">
                <div className="flex items-start space-x-4">
                  {}
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <IconComponent className="w-6 h-6 text-blue-600" />
                  </div>

                  {}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-800 truncate">{hospital.name}</h3>
                        <p className="text-sm text-gray-600 truncate">{hospital.address}</p>
                      </div>
                      
                      {hospital.distance && hospital.distance > 0 && (
                        <div className="text-right flex-shrink-0 ml-2">
                          <div className="flex items-center text-sm text-blue-600">
                            <MapPin className="w-3 h-3 mr-1" />
                            {hospital.distance.toFixed(1)} km
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center space-x-3 mb-3">
                      <Badge className={getHospitalTypeColor(hospital.type)}>
                        {hospital.type}
                      </Badge>
                      
                      <div className="flex items-center">
                        <Star className="w-4 h-4 text-yellow-500 mr-1" />
                        <span className="text-sm font-medium">{hospital.rating}</span>
                      </div>
                    </div>

                    {}
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        onClick={() => callHospital(hospital.contact)}
                        className="flex-1"
                      >
                        <Phone className="w-4 h-4 mr-2" />
                        Call
                      </Button>
                      
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => openInMaps(hospital)}
                        className="flex-1"
                      >
                        <Route className="w-4 h-4 mr-2" />
                        Directions
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {filteredHospitals.length === 0 && !loading && (
          <Card className="p-8 text-center">
            <div className="text-gray-400 mb-4">
              <MapPin className="w-12 h-12 mx-auto" />
            </div>
            <h3 className="font-semibold text-gray-800 mb-2">No hospitals found</h3>
            <p className="text-gray-600 mb-4">
              {searchQuery || selectedType !== 'all' 
                ? 'Try adjusting your search or filter criteria.' 
                : 'No hospitals available in your area.'}
            </p>
            {(searchQuery || selectedType !== 'all') && (
              <Button 
                variant="outline" 
                onClick={() => {
                  setSearchQuery('');
                  setSelectedType('all');
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
          <h3 className="font-semibold text-gray-800 mb-4">🚨 Emergency Actions</h3>
          <div className="grid grid-cols-2 gap-3">
            <Button
              variant="destructive"
              className="flex items-center justify-center space-x-2"
              onClick={() => window.open(`tel:${emergencyContacts.ambulance}`, '_self')}
            >
              <Shield className="w-4 h-4" />
              <span>Call {emergencyContacts.ambulance}</span>
            </Button>
            
            <Button
              variant="outline"
              className="flex items-center justify-center space-x-2 border-orange-200 text-orange-600 hover:bg-orange-50"
              onClick={() => window.open(`tel:${emergencyContacts.medicalHelpline}`, '_self')}
            >
              <Heart className="w-4 h-4" />
              <span>Call {emergencyContacts.medicalHelpline}</span>
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
            Emergency numbers: {emergencyContacts.ambulance} (Ambulance), {emergencyContacts.medicalHelpline} (Medical Helpline)
          </p>
        </div>

        {}
        <HealthTip featureId="hospitals" />
      </div>
    </div>
  );
}