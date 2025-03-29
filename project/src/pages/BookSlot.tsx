import React, { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { Calendar, Clock, MapPin, VideoIcon, Star, Phone, Globe, User, Search } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useStore } from '../store';
import { toast } from 'sonner';

interface Hospital {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  image_url: string;
  specializations: string[];
  rating: number;
  doctors_count: number;
}

interface Doctor {
  id: string;
  full_name: string;
  specialization: string;
  hospital_id: string;
  avatar_url: string;
  experience: string;
  rating: number;
  available_slots: number;
}

interface Slot {
  id: string;
  date: string;
  start_time: string;
  end_time: string;
  is_available: boolean;
}

export default function BookSlot() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialization, setSelectedSpecialization] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const { hospitals, setHospitals } = useStore();
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [slots, setSlots] = useState<Slot[]>([]);
  const [selectedHospital, setSelectedHospital] = useState<string>('');
  const [selectedDoctor, setSelectedDoctor] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<string>(
    format(new Date(), 'yyyy-MM-dd')
  );
  const [appointmentType, setAppointmentType] = useState<'video' | 'in-person'>('video');

  const { user } = useStore();

  useEffect(() => {
    fetchHospitals();
  }, [searchTerm, selectedSpecialization, selectedCity]);

  useEffect(() => {
    if (selectedHospital) {
      fetchDoctors(selectedHospital);
    }
  }, [selectedHospital]);

  useEffect(() => {
    if (selectedDoctor && selectedDate) {
      fetchSlots(selectedDoctor, selectedDate);
    }
  }, [selectedDoctor, selectedDate]);

  async function fetchHospitals() {
    let query = supabase.from('hospitals').select('*');

    if (searchTerm) {
      query = query.ilike('name', `%${searchTerm}%`);
    }

    if (selectedSpecialization) {
      query = query.contains('specializations', [selectedSpecialization]);
    }

    if (selectedCity) {
      query = query.eq('city', selectedCity);
    }

    const { data, error } = await query.order('name');

    if (error) {
      toast.error('Failed to fetch hospitals');
      return;
    }

    setHospitals(data);
  }

  async function fetchDoctors(hospitalId: string) {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('role', 'doctor')
      .eq('hospital_id', hospitalId)
      .order('full_name');

    if (error) {
      toast.error('Failed to fetch doctors');
      return;
    }

    setDoctors(data);
  }

  async function fetchSlots(doctorId: string, date: string) {
    const { data, error } = await supabase
      .from('slots')
      .select('*')
      .eq('doctor_id', doctorId)
      .eq('date', date)
      .eq('is_available', true)
      .order('start_time');

    if (error) {
      toast.error('Failed to fetch slots');
      return;
    }

    setSlots(data);
  }

  async function bookAppointment(slotId: string) {
    if (!user) {
      toast.error('Please login to book an appointment');
      return;
    }

    const { error } = await supabase.from('appointments').insert({
      patient_id: user.id,
      doctor_id: selectedDoctor,
      slot_id: slotId,
      status: 'scheduled',
      type: appointmentType,
      meeting_url: appointmentType === 'video' ? generateMeetingUrl() : null,
    });

    if (error) {
      toast.error('Failed to book appointment');
      return;
    }

    // Update slot availability
    await supabase
      .from('slots')
      .update({ is_available: false })
      .eq('id', slotId);

    // Create notification
    await supabase.from('notifications').insert({
      user_id: user.id,
      title: 'Appointment Booked',
      message: `Your appointment has been scheduled for ${format(
        new Date(`${selectedDate} ${slots.find((s) => s.id === slotId)?.start_time}`),
        'PPpp'
      )}`,
    });

    toast.success('Appointment booked successfully');
  }

  function generateMeetingUrl() {
    return `https://meet.yourdomain.com/${Math.random().toString(36).substring(7)}`;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-2xl shadow-xl p-6">
        <h1 className="text-2xl font-bold mb-6">Find and Book Appointments</h1>

        {/* Search and Filters */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search hospitals..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-full rounded-lg border-gray-300"
            />
          </div>
          
          <select
            value={selectedSpecialization}
            onChange={(e) => setSelectedSpecialization(e.target.value)}
            className="rounded-lg border-gray-300"
          >
            <option value="">All Specializations</option>
            <option value="Cardiology">Cardiology</option>
            <option value="Neurology">Neurology</option>
            <option value="Orthopedics">Orthopedics</option>
            <option value="Pediatrics">Pediatrics</option>
          </select>

          <select
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
            className="rounded-lg border-gray-300"
          >
            <option value="">All Cities</option>
            <option value="Mumbai">Mumbai</option>
            <option value="Delhi">Delhi</option>
            <option value="Bangalore">Bangalore</option>
            <option value="Chennai">Chennai</option>
          </select>

          <select
            value={appointmentType}
            onChange={(e) => setAppointmentType(e.target.value as 'video' | 'in-person')}
            className="rounded-lg border-gray-300"
          >
            <option value="video">Video Consultation</option>
            <option value="in-person">In-person Visit</option>
          </select>
        </div>

        {/* Hospitals Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {hospitals.map((hospital) => (
            <div key={hospital.id} className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
              <div className="relative h-48">
                <img
                  src={hospital.image_url}
                  alt={hospital.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 right-4 bg-white px-2 py-1 rounded-full flex items-center">
                  <Star className="h-4 w-4 text-yellow-400 fill-current" />
                  <span className="ml-1 text-sm font-medium">{hospital.rating}</span>
                </div>
              </div>
              
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-900">{hospital.name}</h3>
                
                <div className="mt-2 flex items-center text-sm text-gray-500">
                  <MapPin className="h-4 w-4 mr-1" />
                  {hospital.address}, {hospital.city}
                </div>
                
                <div className="mt-2 flex items-center text-sm text-gray-500">
                  <User className="h-4 w-4 mr-1" />
                  {hospital.doctors_count} Doctors
                </div>

                <div className="mt-2">
                  <h4 className="text-sm font-medium text-gray-700">Specializations:</h4>
                  <div className="mt-1 flex flex-wrap gap-2">
                    {hospital.specializations.map((spec) => (
                      <span
                        key={spec}
                        className="px-2 py-1 bg-indigo-50 text-indigo-700 text-xs rounded-full"
                      >
                        {spec}
                      </span>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => setSelectedHospital(hospital.id)}
                  className="mt-4 w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  Book Appointment
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}