import React from 'react';
import { Calendar, Clock, Users, Activity } from 'lucide-react';
import { useStore } from '../store';
import { format } from 'date-fns';

export default function DoctorDashboard() {
  const { currentUser, appointments, users } = useStore();

  if (!currentUser || currentUser.role !== 'doctor') return null;

  const doctorAppointments = appointments.filter(
    (apt) => apt.doctor_id === currentUser.id && apt.status !== 'cancelled'
  );

  const todayAppointments = doctorAppointments.filter(
    (apt) => apt.date === format(new Date(), 'yyyy-MM-dd')
  );

  const upcomingAppointments = doctorAppointments.filter(
    (apt) => new Date(apt.date) > new Date()
  );

  const totalPatients = new Set(
    doctorAppointments.map((apt) => apt.patient_id)
  ).size;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-2xl shadow-xl p-6">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Welcome, {currentUser.name}!</h1>
            <p className="text-gray-600">Here's your practice overview</p>
          </div>
          <img
            src={currentUser.avatar_url}
            alt={currentUser.name}
            className="h-16 w-16 rounded-full object-cover"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-indigo-50 p-6 rounded-xl">
            <Activity className="h-8 w-8 text-indigo-600 mb-2" />
            <h3 className="text-lg font-semibold">Today's Appointments</h3>
            <p className="text-3xl font-bold text-indigo-600">{todayAppointments.length}</p>
          </div>
          
          <div className="bg-green-50 p-6 rounded-xl">
            <Calendar className="h-8 w-8 text-green-600 mb-2" />
            <h3 className="text-lg font-semibold">Upcoming</h3>
            <p className="text-3xl font-bold text-green-600">{upcomingAppointments.length}</p>
          </div>
          
          <div className="bg-purple-50 p-6 rounded-xl">
            <Users className="h-8 w-8 text-purple-600 mb-2" />
            <h3 className="text-lg font-semibold">Total Patients</h3>
            <p className="text-3xl font-bold text-purple-600">{totalPatients}</p>
          </div>
          
          <div className="bg-yellow-50 p-6 rounded-xl">
            <Clock className="h-8 w-8 text-yellow-600 mb-2" />
            <h3 className="text-lg font-semibold">Consultation Hours</h3>
            <p className="text-3xl font-bold text-yellow-600">9 AM - 5 PM</p>
          </div>
        </div>

        <div className="space-y-6">
          <h2 className="text-xl font-semibold">Today's Schedule</h2>
          {todayAppointments.length === 0 ? (
            <p className="text-gray-500">No appointments scheduled for today.</p>
          ) : (
            <div className="space-y-4">
              {todayAppointments.map((appointment) => {
                const patient = users.find((u) => u.id === appointment.patient_id);
                if (!patient) return null;

                return (
                  <div
                    key={appointment.id}
                    className="flex items-center justify-between bg-gray-50 p-4 rounded-lg"
                  >
                    <div className="flex items-center space-x-4">
                      <img
                        src={patient.avatar_url}
                        alt={patient.name}
                        className="h-10 w-10 rounded-full object-cover"
                      />
                      <div>
                        <h4 className="font-medium text-gray-900">{patient.name}</h4>
                        <p className="text-sm text-gray-500">{patient.phone}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-indigo-600 font-medium">
                        {format(new Date(appointment.time), 'h:mm a')}
                      </p>
                      <p className="text-sm text-gray-500 capitalize">
                        {appointment.type} Consultation
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}