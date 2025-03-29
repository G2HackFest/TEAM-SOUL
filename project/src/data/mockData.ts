import { addDays, setHours, setMinutes } from 'date-fns';

export interface Hospital {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  phone: string;
  email: string;
  image_url: string;
  specializations: string[];
  rating: number;
  doctors_count: number;
}

export interface Doctor {
  id: string;
  name: string;
  email: string;
  password: string;
  specialization: string;
  experience: string;
  hospital_id: string;
  rating: number;
  image_url: string;
  available_slots: string[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: 'patient' | 'doctor' | 'admin';
  phone?: string;
  avatar_url?: string;
}

export interface Appointment {
  id: string;
  patient_id: string;
  doctor_id: string;
  hospital_id: string;
  date: string;
  time: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  type: 'video' | 'in-person';
}

// Generate time slots for the next 7 days
function generateTimeSlots(): string[] {
  const slots: string[] = [];
  for (let day = 0; day < 7; day++) {
    const date = addDays(new Date(), day);
    for (let hour = 9; hour <= 17; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const time = setMinutes(setHours(date, hour), minute);
        slots.push(time.toISOString());
      }
    }
  }
  return slots;
}

export const hospitals: Hospital[] = Array.from({ length: 25 }, (_, i) => ({
  id: `h${i + 1}`,
  name: [
    'Arogya Wellness Center',
    'Dhanvantari Hospital',
    'Ayushman Medical Institute',
    'Sanjeevani Healthcare',
    'Krishna Memorial Hospital',
    'Veda Life Care',
    'Ganga Medical Center',
    'Himalaya Multispecialty Hospital',
    'Surya Advanced Care',
    'Lakshmi Health Institute',
  ][i % 10] + ` ${Math.floor(i / 10) + 1}`,
  address: `${Math.floor(Math.random() * 1000) + 1}, ${
    ['MG Road', 'Gandhi Nagar', 'Nehru Street', 'Patel Avenue', 'Tagore Lane'][
      Math.floor(Math.random() * 5)
    ]
  }`,
  city: ['Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Hyderabad'][Math.floor(i / 5)],
  state: ['Maharashtra', 'Delhi', 'Karnataka', 'Tamil Nadu', 'Telangana'][Math.floor(i / 5)],
  phone: `+91 ${Math.floor(Math.random() * 9000000000) + 1000000000}`,
  email: `contact@hospital${i + 1}.com`,
  image_url: `https://images.unsplash.com/photo-${1560000000000 + i}?auto=format&fit=crop&w=800&q=80`,
  specializations: ['Cardiology', 'Neurology', 'Orthopedics', 'Pediatrics', 'Oncology'].sort(
    () => Math.random() - 0.5
  ),
  rating: 3.5 + Math.random() * 1.5,
  doctors_count: 10,
}));

export const doctors: Doctor[] = hospitals.flatMap((hospital) =>
  Array.from({ length: 10 }, (_, i) => ({
    id: `d${hospital.id}${i + 1}`,
    name: [
      'Dr. Rajesh Kumar',
      'Dr. Priya Sharma',
      'Dr. Amit Patel',
      'Dr. Sneha Reddy',
      'Dr. Vikram Singh',
      'Dr. Meera Iyer',
      'Dr. Arjun Nair',
      'Dr. Anjali Gupta',
      'Dr. Suresh Menon',
      'Dr. Lakshmi Rao',
    ][i],
    email: `doctor${i + 1}@hospital${hospital.id}.com`,
    password: 'doctor123',
    specialization: hospital.specializations[i % hospital.specializations.length],
    experience: `${10 + Math.floor(Math.random() * 15)} years`,
    hospital_id: hospital.id,
    rating: 3.5 + Math.random() * 1.5,
    image_url: `https://images.unsplash.com/photo-${1570000000000 + i}?auto=format&fit=crop&w=400&q=80`,
    available_slots: generateTimeSlots(),
  }))
);

export const users: User[] = [
  // Admin users
  {
    id: 'a1',
    name: 'Rahul Verma',
    email: 'admin1@swasthya.com',
    password: 'admin123',
    role: 'admin',
    avatar_url: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36',
  },
  {
    id: 'a2',
    name: 'Neha Sharma',
    email: 'admin2@swasthya.com',
    password: 'admin123',
    role: 'admin',
    avatar_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330',
  },
  {
    id: 'a3',
    name: 'Arun Kumar',
    email: 'admin3@swasthya.com',
    password: 'admin123',
    role: 'admin',
    avatar_url: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61',
  },
  // Regular users
  ...Array.from({ length: 20 }, (_, i) => ({
    id: `u${i + 1}`,
    name: [
      'Aarav Patel',
      'Diya Singh',
      'Aryan Kumar',
      'Zara Reddy',
      'Vihaan Sharma',
      'Ananya Gupta',
      'Advait Nair',
      'Ishaan Iyer',
      'Kavya Menon',
      'Riya Rao',
      'Vivaan Malhotra',
      'Aisha Khan',
      'Reyansh Kumar',
      'Myra Verma',
      'Arjun Reddy',
      'Saanvi Patel',
      'Kabir Singh',
      'Avni Shah',
      'Dhruv Mehta',
      'Tara Kapoor',
    ][i],
    email: `user${i + 1}@example.com`,
    password: 'user123',
    role: 'patient',
    phone: `+91 ${Math.floor(Math.random() * 9000000000) + 1000000000}`,
    avatar_url: `https://images.unsplash.com/photo-${1580000000000 + i}?auto=format&fit=crop&w=400&q=80`,
  })),
];

export const appointments: Appointment[] = [];