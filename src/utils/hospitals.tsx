import { supabase } from './supabase/client';

export interface Hospital {
  id: string;
  name: string;
  type: string;
  rating: number;
  latitude: number;
  longitude: number;
  address: string;
  contact: string;
  distance?: number;
}

export interface UserLocation {
  lat: number;
  lng: number;
}


export const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  const R = 6371; 
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const distance = R * c;
  return Math.round(distance * 10) / 10; 
};


export const getCurrentLocation = (): Promise<UserLocation> => {
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
            console.log('Geolocation failed, using default location (Nabha, Punjab):', errorMessage);
          }
          resolve({ lat: 30.37, lng: 76.15 });
        },
        {
          timeout: 10000,
          enableHighAccuracy: false, 
          maximumAge: 300000 
        }
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


export const loadHospitals = async (): Promise<Hospital[]> => {
  try {
    const { data, error } = await supabase
      .from('hospitals')
      .select('*')
      .order('name');

    if (error) {
      
      if (error.code === 'PGRST205' && error.message.includes("Could not find the table 'public.hospitals'")) {
        console.log('Hospital table not found - using sample data (database may not be set up yet)');
        return getSampleHospitals();
      }
      
      console.log('Database error, falling back to sample data:', error.message);
      return getSampleHospitals();
    }

    return data || [];
  } catch (error) {
    console.log('Database connection issue, using sample data');
    return getSampleHospitals();
  }
};


export const findNearbyHospitals = async (
  userLocation: UserLocation, 
  radiusKm: number = 50
): Promise<Hospital[]> => {
  try {
    const { data, error } = await supabase
      .rpc('find_nearby_hospitals', {
        user_lat: userLocation.lat,
        user_lon: userLocation.lng,
        radius_km: radiusKm
      });

    if (error) {
      
      if (error.code === 'PGRST202' && error.message.includes('find_nearby_hospitals')) {
        console.log('Database function find_nearby_hospitals not found - using fallback method');
        return getFallbackNearbyHospitals(userLocation, radiusKm);
      }
      
      console.log('Database function error, using fallback method:', error.message);
      return getFallbackNearbyHospitals(userLocation, radiusKm);
    }

    return data || [];
  } catch (error) {
    console.log('Database connection issue, using fallback method');
    return getFallbackNearbyHospitals(userLocation, radiusKm);
  }
};


const getSampleHospitals = (): Hospital[] => {
  return [
    {
      id: '1',
      name: 'Sawhney Hospital',
      type: 'Maternity',
      rating: 4.2,
      latitude: 30.39354,
      longitude: 76.19093,
      address: 'Patiala Gate, Nabha, Punjab',
      contact: '+91-9876543210'
    },
    {
      id: '2',
      name: 'Civil Hospital Nabha',
      type: 'General',
      rating: 3.8,
      latitude: 30.37123,
      longitude: 76.15456,
      address: 'Hospital Road, Nabha, Punjab',
      contact: '+91-9876543211'
    },
    {
      id: '3',
      name: 'Max Super Speciality Hospital',
      type: 'Cardiac',
      rating: 4.7,
      latitude: 30.74123,
      longitude: 76.77890,
      address: 'Phase 7, Mohali, Punjab',
      contact: '+91-9876543212'
    },
    {
      id: '4',
      name: 'Fortis Hospital',
      type: 'Neurological',
      rating: 4.5,
      latitude: 30.73456,
      longitude: 76.78123,
      address: 'Sector 62, Mohali, Punjab',
      contact: '+91-9876543213'
    },
    {
      id: '5',
      name: 'Apollo Clinic',
      type: 'Eye',
      rating: 4.1,
      latitude: 30.38789,
      longitude: 76.16234,
      address: 'Near Bus Stand, Nabha, Punjab',
      contact: '+91-9876543214'
    },
    {
      id: '6',
      name: 'Bone & Joint Hospital',
      type: 'Orthopedic',
      rating: 4.3,
      latitude: 30.36567,
      longitude: 76.17890,
      address: 'Medical Road, Nabha, Punjab',
      contact: '+91-9876543215'
    },
    {
      id: '7',
      name: 'Nabha Emergency Care',
      type: 'Emergency',
      rating: 4.0,
      latitude: 30.38123,
      longitude: 76.16789,
      address: 'Main Market, Nabha, Punjab',
      contact: '+91-108'
    },
    {
      id: '8',
      name: 'Smile Dental Clinic',
      type: 'Dental',
      rating: 3.9,
      latitude: 30.37890,
      longitude: 76.15123,
      address: 'Mall Road, Nabha, Punjab',
      contact: '+91-9876543217'
    }
  ];
};


const getFallbackNearbyHospitals = async (
  userLocation: UserLocation, 
  radiusKm: number
): Promise<Hospital[]> => {
  const allHospitals = getSampleHospitals();
  
  return allHospitals
    .map(hospital => ({
      ...hospital,
      distance: calculateDistance(
        userLocation.lat,
        userLocation.lng,
        hospital.latitude,
        hospital.longitude
      )
    }))
    .filter(hospital => (hospital.distance || 0) <= radiusKm)
    .sort((a, b) => (a.distance || 0) - (b.distance || 0));
};


export const getHospitalsByType = async (type: string): Promise<Hospital[]> => {
  try {
    const { data, error } = await supabase
      .from('hospitals')
      .select('*')
      .eq('type', type)
      .order('rating', { ascending: false });

    if (error) {
      
      if (error.code === 'PGRST205' && error.message.includes("Could not find the table 'public.hospitals'")) {
        console.log('Hospital table not found - using sample data filtered by type');
        return getSampleHospitals().filter(hospital => hospital.type === type);
      }
      
      console.log('Database error, using sample data filtered by type:', error.message);
      return getSampleHospitals().filter(hospital => hospital.type === type);
    }

    return data || [];
  } catch (error) {
    console.log('Database connection issue, using sample data filtered by type');
    return getSampleHospitals().filter(hospital => hospital.type === type);
  }
};


export const addHospital = async (hospital: Omit<Hospital, 'id'>): Promise<Hospital | null> => {
  try {
    const { data, error } = await supabase
      .from('hospitals')
      .insert([hospital])
      .select()
      .single();

    if (error) {
      console.error('Error adding hospital:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Failed to add hospital:', error);
    throw error;
  }
};


export const updateHospital = async (id: string, updates: Partial<Hospital>): Promise<Hospital | null> => {
  try {
    const { data, error } = await supabase
      .from('hospitals')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating hospital:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Failed to update hospital:', error);
    throw error;
  }
};


export const deleteHospital = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('hospitals')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting hospital:', error);
      throw error;
    }

    return true;
  } catch (error) {
    console.error('Failed to delete hospital:', error);
    throw error;
  }
};


export const hospitalTypeConfig = {
  'General': { color: 'bg-blue-100 text-blue-800', icon: '🏥' },
  'Maternity': { color: 'bg-pink-100 text-pink-800', icon: '👶' },
  'Eye': { color: 'bg-purple-100 text-purple-800', icon: '👁️' },
  'Orthopedic': { color: 'bg-orange-100 text-orange-800', icon: '🦴' },
  'Neurological': { color: 'bg-red-100 text-red-800', icon: '🧠' },
  'Cardiac': { color: 'bg-green-100 text-green-800', icon: '❤️' },
  'Emergency': { color: 'bg-yellow-100 text-yellow-800', icon: '🚨' },
  'Dental': { color: 'bg-indigo-100 text-indigo-800', icon: '🦷' },
};


export const emergencyContacts = {
  ambulance: '108',
  medicalHelpline: '102',
  police: '100',
  fire: '101',
  womenHelpline: '1091',
  childHelpline: '1098'
};