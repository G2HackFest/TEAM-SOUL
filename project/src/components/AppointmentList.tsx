import React from 'react';
import { format } from 'date-fns';
import { Calendar, Clock, Video, Phone, User, X } from 'lucide-react';
import { useStore } from '../store';
import { toast } from 'sonner';

export default function AppointmentList() {
  const { currentUser, appointments, doctors, hospitals, updateAppointment } = useStore();

  if (!currentUser) return null;

  const userAppointments = appointments.filter(
    (apt) => apt.patient_id === currentUser.id && apt.status !== 'cancelled'
  );

  const handleCancelAppointment = (appointmentId: string) => {
    if (window.confirm('Are you sure you want to cancel this appointment?')) {
      updateAppointment(appointmentId, { status: 'cancelled' });
      toast.success('Appointment cancelled successfully');
    }
  };

  const getAppointmentTypeIcon = (type: string) => {
    switch (type) {
      case 'video':
        return <Video className="h-5 w-5" />;
      case 'call':
        return <Phone className="h-5 w-5" />;
      default:
        return <User className="h-5 w-5" />;
    }
  };

  if (userAppointments.length === 0) {
    return (
      <div className="text-center py-8">
        <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900">No Appointments</h3>
        <p className="mt-2 text-gray-500">
          You don't have any upcoming appointments.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {userAppointments.map((appointment) => {
        const doctor = doctors.find((d) => d.id === appointment.doctor_id);
        const hospital = hospitals.find((h) => h.id === appointment.hospital_id);

        if (!doctor || !hospital) return null;

        return (
          <div
            key={appointment.id}
            className="bg-white rounded-lg border border-gray-200 p-4"
          >
            <div className="flex justify-between items-start">
              <div className="flex items-center space-x-4">
                <img
                  src={doctor.image_url}
                  alt={doctor.name}
                  className="h-12 w-12 rounded-full object-cover"
                />
                <div>
                  <h3 className="font-semibold text-gray-900">{doctor.name}</h3>
                  <p className="text-sm text-indigo-600">{doctor.specialization}</p>
                  <p className="text-sm text-gray-500">{hospital.name}</p>
                </div>
              </div>
              <button
                onClick={() => handleCancelAppointment(appointment.id)}
                className="text-red-500 hover:text-red-600"
                title="Cancel Appointment"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-4">
              <div className="flex items-center text-gray-600">
                <Calendar className="h-5 w-5 mr-2" />
                <span>{format(new Date(appointment.date), 'PPP')}</span>
              </div>
              <div className="flex items-center text-gray-600">
                <Clock className="h-5 w-5 mr-2" />
                <span>{format(new Date(appointment.time), 'p')}</span>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between">
              <div className="flex items-center text-gray-600">
                {getAppointmentTypeIcon(appointment.type)}
                <span className="ml-2 capitalize">{appointment.type} Consultation</span>
              </div>
              <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                {appointment.status}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}