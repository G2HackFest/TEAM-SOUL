import React, { useState } from 'react';
import { format } from 'date-fns';
import { Search, MapPin, Star, Phone, VideoIcon, User, Calendar } from 'lucide-react';
import { useStore } from '../store';
import { Hospital, Doctor, AppointmentType } from '../lib/data';
import { toast } from 'sonner';
import PaymentConfirmation from './PaymentConfirmation';

export default function BookSlot() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialization, setSelectedSpecialization] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [appointmentType, setAppointmentType] = useState<AppointmentType>('video');
  const [selectedHospital, setSelectedHospital] = useState<Hospital | null>(null);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>(format(new Date(), 'yyyy-MM-dd'));
  const [selectedSlot, setSelectedSlot] = useState<string>('');
  const [showPayment, setShowPayment] = useState(false);

  const { hospitals, doctors, currentUser, addAppointment } = useStore();

  // Filter hospitals based on search criteria
  const filteredHospitals = hospitals.filter((hospital) => {
    const matchesSearch = hospital.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSpecialization = !selectedSpecialization || hospital.specializations.includes(selectedSpecialization);
    const matchesCity = !selectedCity || hospital.city === selectedCity;
    return matchesSearch && matchesSpecialization && matchesCity;
  });

  // Get unique specializations and cities from hospitals
  const specializations = Array.from(
    new Set(hospitals.flatMap((h) => h.specializations))
  ).sort();
  const cities = Array.from(new Set(hospitals.map((h) => h.city))).sort();

  // Get doctors for selected hospital
  const hospitalDoctors = selectedHospital
    ? doctors.filter((d) => d.hospital_id === selectedHospital.id)
    : [];

  const handleBookAppointment = () => {
    if (!currentUser || !selectedHospital || !selectedDoctor || !selectedSlot) return;
    setShowPayment(true);
  };

  const handlePaymentConfirm = () => {
    if (!currentUser || !selectedHospital || !selectedDoctor || !selectedSlot) return;

    const appointment = {
      id: `apt-${Date.now()}`,
      patient_id: currentUser.id,
      doctor_id: selectedDoctor.id,
      hospital_id: selectedHospital.id,
      date: selectedDate,
      time: selectedSlot,
      status: 'scheduled',
      type: appointmentType,
      meeting_url: appointmentType === 'video' ? `https://meet.swasthyasathi.com/${Date.now()}` : undefined,
    };

    addAppointment(appointment);
    toast.success('Appointment booked successfully!');

    // Reset selection
    setSelectedHospital(null);
    setSelectedDoctor(null);
    setSelectedSlot('');
    setShowPayment(false);
  };

  return (
    <div className="space-y-8">
      {/* Search and Filters */}
      <div className="bg-white rounded-2xl shadow-xl p-6">
        <h2 className="text-2xl font-bold mb-6">Find and Book Appointments</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
            {specializations.map((spec) => (
              <option key={spec} value={spec}>{spec}</option>
            ))}
          </select>

          <select
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
            className="rounded-lg border-gray-300"
          >
            <option value="">All Cities</option>
            {cities.map((city) => (
              <option key={city} value={city}>{city}</option>
            ))}
          </select>

          <select
            value={appointmentType}
            onChange={(e) => setAppointmentType(e.target.value as AppointmentType)}
            className="rounded-lg border-gray-300"
          >
            <option value="video">Video Consultation</option>
            <option value="call">Phone Consultation</option>
            <option value="in-person">In-person Visit</option>
          </select>
        </div>
      </div>

      {/* Hospitals Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredHospitals.map((hospital) => (
          <div
            key={hospital.id}
            className={`bg-white rounded-xl shadow-md overflow-hidden border transition-colors ${
              selectedHospital?.id === hospital.id
                ? 'border-indigo-500'
                : 'border-gray-100 hover:border-indigo-200'
            }`}
          >
            <div className="relative h-48">
              <img
                src={hospital.image_url}
                alt={hospital.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 right-4 bg-white px-2 py-1 rounded-full flex items-center">
                <Star className="h-4 w-4 text-yellow-400 fill-current" />
                <span className="ml-1 text-sm font-medium">{hospital.rating.toFixed(1)}</span>
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

              <div className="mt-4 space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Video Consultation:</span>
                  <span className="font-medium">₹{hospital.consultation_fees.video}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Phone Consultation:</span>
                  <span className="font-medium">₹{hospital.consultation_fees.call}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">In-person Visit:</span>
                  <span className="font-medium">₹{hospital.consultation_fees.in_person}</span>
                </div>
              </div>

              <button
                onClick={() => setSelectedHospital(selectedHospital?.id === hospital.id ? null : hospital)}
                className={`mt-4 w-full py-2 px-4 rounded-lg transition-colors ${
                  selectedHospital?.id === hospital.id
                    ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                    : 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100'
                }`}
              >
                {selectedHospital?.id === hospital.id ? 'Selected' : 'Select Hospital'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Doctor Selection */}
      {selectedHospital && (
        <div className="bg-white rounded-2xl shadow-xl p-6">
          <h3 className="text-xl font-semibold mb-4">Select Doctor</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {hospitalDoctors.map((doctor) => (
              <div
                key={doctor.id}
                className={`bg-white rounded-xl shadow-sm border p-4 transition-colors ${
                  selectedDoctor?.id === doctor.id
                    ? 'border-indigo-500'
                    : 'border-gray-200 hover:border-indigo-200'
                }`}
              >
                <div className="flex items-center space-x-4">
                  <img
                    src={doctor.image_url}
                    alt={doctor.name}
                    className="h-16 w-16 rounded-full object-cover"
                  />
                  <div>
                    <h4 className="font-semibold">{doctor.name}</h4>
                    <p className="text-sm text-indigo-600">{doctor.specialization}</p>
                    <p className="text-sm text-gray-500">{doctor.experience}</p>
                  </div>
                </div>

                <div className="mt-4 space-y-2">
                  <div className="flex items-center text-sm text-gray-500">
                    <Star className="h-4 w-4 text-yellow-400 fill-current mr-1" />
                    <span>{doctor.rating.toFixed(1)} Rating</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {doctor.consultation_types.map((type) => (
                      <span
                        key={type}
                        className="flex items-center px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                      >
                        {type === 'video' && <VideoIcon className="h-3 w-3 mr-1" />}
                        {type === 'call' && <Phone className="h-3 w-3 mr-1" />}
                        {type === 'in-person' && <User className="h-3 w-3 mr-1" />}
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                      </span>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => setSelectedDoctor(selectedDoctor?.id === doctor.id ? null : doctor)}
                  className={`mt-4 w-full py-2 px-4 rounded-lg transition-colors ${
                    selectedDoctor?.id === doctor.id
                      ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                      : 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100'
                  }`}
                >
                  {selectedDoctor?.id === doctor.id ? 'Selected' : 'Select Doctor'}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Slot Selection */}
      {selectedDoctor && (
        <div className="bg-white rounded-2xl shadow-xl p-6">
          <h3 className="text-xl font-semibold mb-4">Select Time Slot</h3>
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <Calendar className="h-5 w-5 text-gray-400" />
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                min={format(new Date(), 'yyyy-MM-dd')}
                className="rounded-lg border-gray-300"
              />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {selectedDoctor.available_slots
                .filter((slot) => slot.startsWith(selectedDate))
                .map((slot) => (
                  <button
                    key={slot}
                    onClick={() => setSelectedSlot(selectedSlot === slot ? '' : slot)}
                    className={`py-2 px-4 rounded-lg text-sm transition-colors ${
                      selectedSlot === slot
                        ? 'bg-indigo-600 text-white'
                        : 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100'
                    }`}
                  >
                    {format(new Date(slot), 'hh:mm a')}
                  </button>
                ))}
            </div>
          </div>

          <button
            onClick={handleBookAppointment}
            disabled={!selectedSlot}
            className={`mt-6 w-full py-3 px-4 rounded-lg text-white font-medium ${
              selectedSlot
                ? 'bg-indigo-600 hover:bg-indigo-700'
                : 'bg-gray-300 cursor-not-allowed'
            }`}
          >
            Book Appointment
          </button>
        </div>
      )}

      {showPayment && selectedHospital && (
        <PaymentConfirmation
          amount={selectedHospital.consultation_fees[appointmentType]}
          onConfirm={handlePaymentConfirm}
          onCancel={() => setShowPayment(false)}
        />
      )}
    </div>
  );
}