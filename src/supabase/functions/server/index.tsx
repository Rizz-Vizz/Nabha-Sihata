import { Hono } from 'npm:hono';
import { cors } from 'npm:hono/cors';
import { logger } from 'npm:hono/logger';
import { createClient } from 'npm:@supabase/supabase-js@2';
import * as kv from './kv_store.tsx';

const app = new Hono();


app.use('*', cors({
  origin: '*',
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
}));

app.use('*', logger(console.log));


const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
);


app.get('/make-server-dc6a04cf/health', (c) => {
  return c.json({ status: 'healthy', service: 'nabha-sihata-backend' });
});


app.post('/make-server-dc6a04cf/create-demo-users', async (c) => {
  try {
    console.log('Creating demo users...');
    
    const demoUsers = [
      {
        type: 'patient',
        email: 'demo.patient@nabhasihata.com',
        password: 'demo123',
        name: 'Demo Patient',
        phone: '+91 9876543210',
        village: 'Nabha',
        age: 35
      },
      {
        type: 'doctor',
        email: 'demo.doctor@nabhasihata.com',
        password: 'demo123',
        name: 'Dr. Demo Singh',
        phone: '+91 9876543211',
        specialty: 'General Medicine',
        license_number: 'DMO12345',
        hospital: 'Civil Hospital Nabha'
      }
    ];

    const results = [];

    for (const user of demoUsers) {
      try {
        console.log(`Creating demo ${user.type}:`, user.email);
        
        
        try {
          const { data: existingUser } = await supabase.auth.admin.getUserByEmail(user.email);
          if (existingUser && existingUser.user) {
            console.log(`Demo ${user.type} already exists:`, user.email);
            results.push({ type: user.type, email: user.email, status: 'already_exists' });
            continue;
          }
        } catch (error) {
          console.log('User does not exist, proceeding with creation');
        }

        
        const { data: authData, error: authError } = await supabase.auth.admin.createUser({
          email: user.email,
          password: user.password,
          user_metadata: { 
            name: user.name,
            user_type: user.type,
            registered_at: new Date().toISOString()
          },
          email_confirm: true
        });

        if (authError) {
          console.log(`Error creating demo ${user.type}:`, authError);
          results.push({ type: user.type, email: user.email, status: 'error', error: authError.message });
          continue;
        }

        
        if (user.type === 'patient') {
          const patientData = {
            user_id: authData.user.id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            village: user.village,
            age: user.age,
            user_type: 'patient',
            health_card_id: `HC-DEMO-${Date.now()}`,
            created_at: new Date().toISOString(),
            emergency_contacts: [],
            appointments: [],
            emergency_alerts: []
          };
          await kv.set(`patient:${authData.user.id}`, patientData);
        } else {
          const doctorData = {
            user_id: authData.user.id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            specialty: user.specialty,
            license_number: user.license_number,
            hospital: user.hospital,
            user_type: 'doctor',
            verification_status: 'verified',
            availability: {
              monday: { start: '09:00', end: '17:00', available: true },
              tuesday: { start: '09:00', end: '17:00', available: true },
              wednesday: { start: '09:00', end: '17:00', available: true },
              thursday: { start: '09:00', end: '17:00', available: true },
              friday: { start: '09:00', end: '17:00', available: true },
              saturday: { start: '09:00', end: '13:00', available: true },
              sunday: { start: '10:00', end: '12:00', available: false }
            },
            appointments: [],
            created_at: new Date().toISOString()
          };
          await kv.set(`doctor:${authData.user.id}`, doctorData);
        }

        results.push({ type: user.type, email: user.email, status: 'created', user_id: authData.user.id });
        console.log(`Demo ${user.type} created successfully:`, user.email);
        
      } catch (error: any) {
        console.log(`Failed to create demo ${user.type}:`, error);
        results.push({ type: user.type, email: user.email, status: 'error', error: error.message });
      }
    }

    return c.json({ 
      message: 'Demo user creation completed',
      results 
    });
  } catch (error: any) {
    console.log('Demo user creation error:', error);
    return c.json({ error: 'Failed to create demo users: ' + error.message }, 500);
  }
});


app.post('/make-server-dc6a04cf/auth/register-patient', async (c) => {
  try {
    const { email, password, name, phone, village, age } = await c.req.json();
    
    if (!email || !password || !name) {
      return c.json({ error: 'Missing required fields: email, password, and name are required' }, 400);
    }

    console.log('Attempting to register patient:', email);

    
    try {
      const { data: existingUser } = await supabase.auth.admin.getUserByEmail(email);
      if (existingUser && existingUser.user) {
        console.log('User already exists:', email);
        return c.json({ error: 'User already registered with this email' }, 409);
      }
    } catch (error) {
      console.log('Error checking existing user (user may not exist, which is fine):', error);
    }

    
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: email.trim().toLowerCase(),
      password,
      user_metadata: { 
        name: name.trim(), 
        phone: phone?.trim() || '', 
        village: village?.trim() || '', 
        age: age || null, 
        user_type: 'patient',
        registered_at: new Date().toISOString()
      },
      
      email_confirm: true
    });

    if (authError) {
      console.log('Patient registration auth error:', authError);
      return c.json({ error: 'Registration failed: ' + authError.message }, 400);
    }

    if (!authData.user) {
      console.log('No user data returned from auth creation');
      return c.json({ error: 'User creation failed - no user data returned' }, 500);
    }

    console.log('Patient auth creation successful, user ID:', authData.user.id);

    
    const patientData = {
      user_id: authData.user.id,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone?.trim() || '',
      village: village?.trim() || '',
      age: age || null,
      user_type: 'patient',
      health_card_id: `HC-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      created_at: new Date().toISOString(),
      emergency_contacts: [],
      appointments: [],
      emergency_alerts: []
    };

    await kv.set(`patient:${authData.user.id}`, patientData);
    console.log('Patient data stored successfully');
    
    return c.json({ 
      message: 'Patient registered successfully', 
      user_id: authData.user.id,
      health_card_id: patientData.health_card_id,
      email: authData.user.email
    });
  } catch (error) {
    console.log('Patient registration error:', error);
    return c.json({ error: 'Registration failed' }, 500);
  }
});


app.post('/make-server-dc6a04cf/auth/register-doctor', async (c) => {
  try {
    const { email, password, name, phone, specialty, license_number, hospital } = await c.req.json();
    
    if (!email || !password || !name || !specialty || !license_number) {
      return c.json({ error: 'Missing required fields: email, password, name, specialty, and license_number are required' }, 400);
    }

    console.log('Attempting to register doctor:', email);

    
    try {
      const { data: existingUser } = await supabase.auth.admin.getUserByEmail(email);
      if (existingUser && existingUser.user) {
        console.log('Doctor already exists:', email);
        return c.json({ error: 'User already registered with this email' }, 409);
      }
    } catch (error) {
      console.log('Error checking existing doctor (user may not exist, which is fine):', error);
    }

    
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: email.trim().toLowerCase(),
      password,
      user_metadata: { 
        name: name.trim(), 
        phone: phone?.trim() || '', 
        specialty: specialty.trim(), 
        license_number: license_number.trim(),
        hospital: hospital?.trim() || '',
        user_type: 'doctor',
        registered_at: new Date().toISOString()
      },
      
      email_confirm: true
    });

    if (authError) {
      console.log('Doctor registration auth error:', authError);
      return c.json({ error: 'Registration failed: ' + authError.message }, 400);
    }

    if (!authData.user) {
      console.log('No user data returned from doctor auth creation');
      return c.json({ error: 'User creation failed - no user data returned' }, 500);
    }

    console.log('Doctor auth creation successful, user ID:', authData.user.id);

    
    const doctorData = {
      user_id: authData.user.id,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone?.trim() || '',
      specialty: specialty.trim(),
      license_number: license_number.trim(),
      hospital: hospital?.trim() || '',
      user_type: 'doctor',
      verification_status: 'verified', 
      availability: {
        monday: { start: '09:00', end: '17:00', available: true },
        tuesday: { start: '09:00', end: '17:00', available: true },
        wednesday: { start: '09:00', end: '17:00', available: true },
        thursday: { start: '09:00', end: '17:00', available: true },
        friday: { start: '09:00', end: '17:00', available: true },
        saturday: { start: '09:00', end: '13:00', available: true },
        sunday: { start: '10:00', end: '12:00', available: false }
      },
      appointments: [],
      created_at: new Date().toISOString()
    };

    await kv.set(`doctor:${authData.user.id}`, doctorData);
    console.log('Doctor data stored successfully');
    
    return c.json({ 
      message: 'Doctor registered successfully', 
      user_id: authData.user.id,
      verification_status: 'verified',
      email: authData.user.email
    });
  } catch (error) {
    console.log('Doctor registration error:', error);
    return c.json({ error: 'Registration failed' }, 500);
  }
});


app.get('/make-server-dc6a04cf/auth/profile', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    if (!accessToken) {
      return c.json({ error: 'No access token provided' }, 401);
    }

    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    if (error || !user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    
    const userType = user.user_metadata?.user_type;
    let userData = null;

    if (userType === 'patient') {
      userData = await kv.get(`patient:${user.id}`);
    } else if (userType === 'doctor') {
      userData = await kv.get(`doctor:${user.id}`);
    }

    if (!userData) {
      return c.json({ error: 'User profile not found' }, 404);
    }

    return c.json({ user: userData });
  } catch (error) {
    console.log('Profile fetch error:', error);
    return c.json({ error: 'Failed to fetch profile' }, 500);
  }
});


app.post('/make-server-dc6a04cf/appointments/book', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    if (!accessToken) {
      return c.json({ error: 'No access token provided' }, 401);
    }

    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    if (error || !user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const { doctor_id, date, time, symptoms, urgency = 'normal' } = await c.req.json();
    
    if (!doctor_id || !date || !time) {
      return c.json({ error: 'Missing required fields' }, 400);
    }

    const appointmentId = `apt-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const appointmentData = {
      id: appointmentId,
      patient_id: user.id,
      doctor_id,
      date,
      time,
      symptoms,
      urgency,
      status: 'scheduled',
      created_at: new Date().toISOString(),
      consultation_type: 'teleconsultation'
    };

    await kv.set(`appointment:${appointmentId}`, appointmentData);
    
    
    const patientData = await kv.get(`patient:${user.id}`);
    if (patientData) {
      if (!patientData.appointments) patientData.appointments = [];
      patientData.appointments.push(appointmentId);
      await kv.set(`patient:${user.id}`, patientData);
    }

    
    const doctorData = await kv.get(`doctor:${doctor_id}`);
    if (doctorData) {
      if (!doctorData.appointments) doctorData.appointments = [];
      doctorData.appointments.push(appointmentId);
      await kv.set(`doctor:${doctor_id}`, doctorData);
    }
    
    return c.json({ 
      message: 'Appointment booked successfully',
      appointment_id: appointmentId,
      appointment: appointmentData
    });
  } catch (error) {
    console.log('Appointment booking error:', error);
    return c.json({ error: 'Failed to book appointment' }, 500);
  }
});


app.get('/make-server-dc6a04cf/appointments', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    if (!accessToken) {
      return c.json({ error: 'No access token provided' }, 401);
    }

    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    if (error || !user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const userType = user.user_metadata?.user_type;
    let userData = null;

    if (userType === 'patient') {
      userData = await kv.get(`patient:${user.id}`);
    } else if (userType === 'doctor') {
      userData = await kv.get(`doctor:${user.id}`);
    }

    if (!userData || !userData.appointments) {
      return c.json({ appointments: [] });
    }

    
    const appointments = await Promise.all(
      userData.appointments.map(async (appointmentId: string) => {
        return await kv.get(`appointment:${appointmentId}`);
      })
    );

    
    const validAppointments = appointments
      .filter(apt => apt !== null)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    return c.json({ appointments: validAppointments });
  } catch (error) {
    console.log('Appointments fetch error:', error);
    return c.json({ error: 'Failed to fetch appointments' }, 500);
  }
});


app.get('/make-server-dc6a04cf/doctors', async (c) => {
  try {
    const specialty = c.req.query('specialty');
    
    
    const doctorKeys = await kv.getByPrefix('doctor:');
    
    let doctors = doctorKeys
      .filter(doctor => doctor.verification_status === 'verified' || doctor.verification_status === 'pending')
      .map(doctor => ({
        id: doctor.user_id,
        name: doctor.name,
        specialty: doctor.specialty,
        hospital: doctor.hospital,
        availability: doctor.availability,
        verification_status: doctor.verification_status
      }));

    
    if (specialty) {
      doctors = doctors.filter(doctor => 
        doctor.specialty.toLowerCase().includes(specialty.toLowerCase())
      );
    }

    return c.json({ doctors });
  } catch (error) {
    console.log('Doctors fetch error:', error);
    return c.json({ error: 'Failed to fetch doctors' }, 500);
  }
});


app.post('/make-server-dc6a04cf/emergency/alert', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    if (!accessToken) {
      return c.json({ error: 'No access token provided' }, 401);
    }

    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    if (error || !user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const { emergency_type, location, description } = await c.req.json();
    
    const alertId = `alert-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const alertData = {
      id: alertId,
      patient_id: user.id,
      emergency_type,
      location,
      description,
      status: 'active',
      created_at: new Date().toISOString(),
      priority: 'high'
    };

    await kv.set(`emergency:${alertId}`, alertData);
    
    
    const patientData = await kv.get(`patient:${user.id}`);
    if (patientData) {
      if (!patientData.emergency_alerts) patientData.emergency_alerts = [];
      patientData.emergency_alerts.push(alertId);
      await kv.set(`patient:${user.id}`, patientData);
    }

    
    console.log('EMERGENCY ALERT:', alertData);
    
    return c.json({ 
      message: 'Emergency alert sent successfully',
      alert_id: alertId,
      emergency_contacts: {
        phc: '+91-1765-123456',
        ambulance: '108',
        police: '100'
      }
    });
  } catch (error) {
    console.log('Emergency alert error:', error);
    return c.json({ error: 'Failed to send emergency alert' }, 500);
  }
});


app.post('/make-server-dc6a04cf/health/update', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    if (!accessToken) {
      return c.json({ error: 'No access token provided' }, 401);
    }

    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    if (error || !user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const healthUpdate = await c.req.json();
    
    const patientData = await kv.get(`patient:${user.id}`);
    if (!patientData) {
      return c.json({ error: 'Patient not found' }, 404);
    }

    
    if (!patientData.health_record) patientData.health_record = {};
    patientData.health_record = {
      ...patientData.health_record,
      ...healthUpdate,
      last_updated: new Date().toISOString()
    };

    await kv.set(`patient:${user.id}`, patientData);
    
    return c.json({ 
      message: 'Health record updated successfully',
      health_record: patientData.health_record
    });
  } catch (error) {
    console.log('Health record update error:', error);
    return c.json({ error: 'Failed to update health record' }, 500);
  }
});

Deno.serve(app.fetch);