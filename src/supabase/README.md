# Hospital Finder Database Setup

This document explains how to set up the hospital database for the Nabha Sihata telemedicine app.

## Database Schema

The hospital finder uses a `hospitals` table with the following structure:

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Primary key (auto-generated) |
| `name` | TEXT | Hospital name |
| `type` | TEXT | Hospital type (General, Maternity, Eye, etc.) |
| `rating` | NUMERIC(2,1) | Rating from 0.0 to 5.0 |
| `latitude` | DOUBLE PRECISION | GPS latitude coordinate |
| `longitude` | DOUBLE PRECISION | GPS longitude coordinate |
| `address` | TEXT | Full address |
| `contact` | TEXT | Phone number |
| `created_at` | TIMESTAMP | Creation timestamp |
| `updated_at` | TIMESTAMP | Last update timestamp |

## Setup Instructions

### 1. Run the Setup Script

Execute the SQL script in your Supabase dashboard:

```sql
-- Copy and paste the entire content of setup-hospitals.sql
-- into the Supabase SQL Editor and run it
```

### 2. Verify Table Creation

Check that the following were created:
- `hospitals` table with sample data
- Indexes for performance optimization
- RLS (Row Level Security) policies
- Database functions for distance calculations

### 3. Test the Setup

Run these queries to verify everything works:

```sql
-- Check sample data
SELECT COUNT(*) FROM hospitals;

-- Test distance function
SELECT name, calculate_distance(30.37, 76.15, latitude, longitude) as distance 
FROM hospitals 
ORDER BY distance 
LIMIT 5;

-- Test nearby hospitals function
SELECT * FROM find_nearby_hospitals(30.37, 76.15, 50);
```

## Hospital Types

The system supports these hospital types:
- General
- Maternity
- Eye
- Orthopedic
- Neurological
- Cardiac
- Emergency
- Dental

## Security

### Row Level Security (RLS)

- **Read Access**: All authenticated users can view hospital data
- **Write Access**: Only users with `user_type = 'doctor'` can add/edit hospitals

### API Access

The frontend uses these functions:
- `loadHospitals()` - Get all hospitals
- `findNearbyHospitals(lat, lng, radius)` - Get hospitals within radius
- `getHospitalsByType(type)` - Filter by hospital type

## Adding New Hospitals

### Via Database

```sql
INSERT INTO hospitals (name, type, rating, latitude, longitude, address, contact) 
VALUES (
  'New Hospital Name',
  'General',
  4.2,
  30.123456,
  76.123456,
  'Full Address',
  '+91-1234567890'
);
```

### Via Application

Doctors can add hospitals through the app interface (feature to be implemented).

## Sample Data

The setup script includes 20+ sample hospitals around Punjab:
- Nabha area hospitals
- Major hospitals in Patiala, Mohali, Ludhiana
- Specialized care centers

## GPS Coordinates Reference

Common coordinates for Punjab:
- Nabha: 30.37, 76.15
- Patiala: 30.34, 76.38
- Mohali: 30.74, 76.79
- Ludhiana: 30.90, 75.85
- Chandigarh: 30.74, 76.79

## Performance Optimization

The database includes:
- Spatial indexes for location queries
- Type-based indexes for filtering
- Rating indexes for sorting
- Efficient distance calculation function

## Troubleshooting

### Common Issues

1. **Permission Denied**: Ensure RLS policies are set correctly
2. **Function Not Found**: Run the setup script completely
3. **No Data**: Check if sample data was inserted
4. **Slow Queries**: Verify indexes are created

### Debugging Queries

```sql
-- Check RLS policies
SELECT * FROM pg_policies WHERE tablename = 'hospitals';

-- Check indexes
SELECT * FROM pg_indexes WHERE tablename = 'hospitals';

-- Check functions
SELECT * FROM pg_proc WHERE proname LIKE '%hospital%';
```

## Backup and Migration

### Export Data

```sql
COPY hospitals TO '/path/to/hospitals_backup.csv' DELIMITER ',' CSV HEADER;
```

### Import Data

```sql
COPY hospitals FROM '/path/to/hospitals_data.csv' DELIMITER ',' CSV HEADER;
```

## API Integration

The hospital finder integrates with:
- **Google Maps**: For directions and detailed maps
- **Phone System**: Direct calling to hospitals
- **GPS Services**: Location detection
- **Offline Storage**: Local caching for offline access

## Future Enhancements

Planned features:
- Real-time availability status
- Appointment booking integration
- Hospital bed availability
- Doctor availability at hospitals
- Patient reviews and ratings
- Photo uploads for hospitals
- Operating hours tracking
- Services/departments listing