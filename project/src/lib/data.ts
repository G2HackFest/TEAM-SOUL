import { addDays, setHours, setMinutes } from 'date-fns';

export type AppointmentType = 'in-person' | 'call' | 'video';

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
  consultation_types: AppointmentType[];
  consultation_fees: {
    [key in AppointmentType]: number;
  };
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
  consultation_types: AppointmentType[];
  bio: string;
  qualifications: string[];
  languages: string[];
  role: 'doctor';
}

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: 'patient' | 'doctor' | 'admin';
  phone?: string;
  avatar_url?: string;
  medical_history?: {
    allergies: string[];
    conditions: string[];
    medications: string[];
  };
  specialization?: string;
  hospital_id?: string;
  experience?: string;
  qualifications?: string[];
  languages?: string[];
}

export interface Appointment {
  id: string;
  patient_id: string;
  doctor_id: string;
  hospital_id: string;
  date: string;
  time: string;
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  type: AppointmentType;
  meeting_url?: string;
  symptoms?: string;
  diagnosis?: string;
  prescription?: string;
}

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type?: 'appointment' | 'video_call' | 'video_call_start' | 'prescription';
  appointment_id?: string;
  read: boolean;
  created_at: string;
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

const indianCities = [
  { city: 'Mumbai', state: 'Maharashtra' },
  { city: 'Delhi', state: 'Delhi' },
  { city: 'Bangalore', state: 'Karnataka' },
  { city: 'Chennai', state: 'Tamil Nadu' },
  { city: 'Hyderabad', state: 'Telangana' },
];

const hospitalNames = [
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
];

const doctorNames = [
  'Dr. Rajesh Kumar Sharma',
  'Dr. Priya Venkatesh',
  'Dr. Amit Patel',
  'Dr. Sneha Reddy',
  'Dr. Vikram Singh Rathore',
  'Dr. Meera Iyer',
  'Dr. Arjun Nair',
  'Dr. Anjali Gupta',
  'Dr. Suresh Menon',
  'Dr. Lakshmi Rao',
  'Dr. Aditya Kapoor',
  'Dr. Kavita Krishnan',
  'Dr. Rahul Verma',
  'Dr. Pooja Mehta',
  'Dr. Sanjay Deshmukh',
];

const specializations = [
  'Cardiology',
  'Neurology',
  'Orthopedics',
  'Pediatrics',
  'Oncology',
  'Dermatology',
  'ENT',
  'Ophthalmology',
  'Gynecology',
  'General Medicine',
];

const qualifications = [
  'MBBS',
  'MD',
  'MS',
  'DNB',
  'DM',
  'MCh',
  'FRCS',
];

const languages = ['Hindi', 'English', 'Marathi', 'Tamil', 'Telugu', 'Kannada', 'Bengali', 'Gujarati'];

// Hospital images from Unsplash
const hospitalImages = [
  'https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?q=80&w=1000',
  'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=1000',
  'https://images.unsplash.com/photo-1538108149393-fbbd81895907?q=80&w=1000',
  'https://images.unsplash.com/photo-1596541223130-5d31a73fb6c6?q=80&w=1000',
  'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?q=80&w=1000',
];

// Doctor images from Unsplash
const doctorImages = [
  'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=400',
  'https://images.unsplash.com/photo-1594824476967-48c8b964273f?q=80&w=400',
  'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=400',
  'https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=400',
  'https://images.unsplash.com/photo-1612531386530-97286d97c2d2?q=80&w=400',
];

export const hospitals: Hospital[] = Array.from({ length: 25 }, (_, i) => ({
  id: `h${i + 1}`,
  name: `${hospitalNames[i % hospitalNames.length]} ${Math.floor(i / hospitalNames.length) + 1}`,
  address: `${Math.floor(Math.random() * 1000) + 1}, ${
    ['MG Road', 'Gandhi Nagar', 'Nehru Street', 'Patel Avenue', 'Tagore Lane'][
      Math.floor(Math.random() * 5)
    ]
  }`,
  city: indianCities[Math.floor(i / 5)].city,
  state: indianCities[Math.floor(i / 5)].state,
  phone: `+91 ${Math.floor(Math.random() * 9000000000) + 1000000000}`,
  email: `contact@hospital${i + 1}.com`,
  image_url: hospitalImages[i % hospitalImages.length],
  specializations: Array.from({ length: 5 }, () => 
    specializations[Math.floor(Math.random() * specializations.length)]
  ).filter((v, i, a) => a.indexOf(v) === i),
  rating: 3.5 + Math.random() * 1.5,
  doctors_count: 10,
  consultation_types: ['in-person', 'call', 'video'],
  consultation_fees: {
    'in-person': 500 + Math.floor(Math.random() * 1000),
    'call': 300 + Math.floor(Math.random() * 500),
    'video': 400 + Math.floor(Math.random() * 600),
  },
}));

export const doctors: Doctor[] = hospitals.flatMap((hospital) =>
  Array.from({ length: 10 }, (_, i) => ({
    id: `d${hospital.id}${i + 1}`,
    name: doctorNames[Math.floor(Math.random() * doctorNames.length)],
    email: `doctor${i + 1}@hospital${hospital.id}.com`,
    password: 'doctor123',
    specialization: hospital.specializations[i % hospital.specializations.length],
    experience: `${10 + Math.floor(Math.random() * 15)} years`,
    hospital_id: hospital.id,
    rating: 3.5 + Math.random() * 1.5,
    image_url: doctorImages[i % doctorImages.length],
    available_slots: generateTimeSlots(),
    consultation_types: ['in-person', 'call', 'video'],
    bio: `Experienced healthcare professional with expertise in ${
      hospital.specializations[i % hospital.specializations.length]
    }. Committed to providing quality patient care.`,
    qualifications: Array.from(
      { length: 2 + Math.floor(Math.random() * 2) },
      () => qualifications[Math.floor(Math.random() * qualifications.length)]
    ),
    languages: Array.from(
      { length: 2 + Math.floor(Math.random() * 3) },
      () => languages[Math.floor(Math.random() * languages.length)]
    ).filter((v, i, a) => a.indexOf(v) === i),
    role: 'doctor',
  }))
);

const patientNames = [
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
];

export const users: User[] = [
  // Admin users
  {
    id: 'a1',
    name: 'Rajesh Verma',
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
  // Doctor users (adding all doctors as users)
  ...doctors.map(doctor => ({
    id: doctor.id,
    name: doctor.name,
    email: doctor.email,
    password: doctor.password,
    role: 'doctor',
    avatar_url: doctor.image_url,
    phone: `+91 ${Math.floor(Math.random() * 9000000000) + 1000000000}`,
    specialization: doctor.specialization,
    hospital_id: doctor.hospital_id,
    experience: doctor.experience,
    qualifications: doctor.qualifications,
    languages: doctor.languages,
  })),
  // Regular users
  ...Array.from({ length: 20 }, (_, i) => ({
    id: `u${i + 1}`,
    name: patientNames[i],
    email: `user${i + 1}@example.com`,
    password: 'user123',
    role: 'patient',
    phone: `+91 ${Math.floor(Math.random() * 9000000000) + 1000000000}`,
    avatar_url: `https://images.unsplash.com/photo-${1580000000000 + i}?auto=format&fit=crop&w=400&q=80`,
    medical_history: {
      allergies: [],
      conditions: [],
      medications: [],
    },
  })),
];

export const initialAppointments: Appointment[] = [];
export const initialNotifications: Notification[] = [];