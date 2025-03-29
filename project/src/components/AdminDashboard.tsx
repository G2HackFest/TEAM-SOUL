import React from 'react';
import { Users, Building2, Calendar, Activity } from 'lucide-react';
import { useStore } from '../store';

export default function AdminDashboard() {
  const { currentUser, hospitals = [], doctors = [], appointments = [], users = [] } = useStore();

  if (!currentUser || currentUser.role !== 'admin') return null;

  const totalPatients = users ? users.filter((u) => u.role === 'patient').length : 0;
  const totalAppointments = appointments ? appointments.length : 0;
  const activeAppointments = appointments ? appointments.filter(
    (apt) => apt.status !== 'cancelled'
  ).length : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-2xl shadow-xl p-6">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-600">System overview and statistics</p>
          </div>
          <img
            src={currentUser.avatar_url}
            alt={currentUser.name}
            className="h-16 w-16 rounded-full object-cover"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-indigo-50 p-6 rounded-xl">
            <Building2 className="h-8 w-8 text-indigo-600 mb-2" />
            <h3 className="text-lg font-semibold">Total Hospitals</h3>
            <p className="text-3xl font-bold text-indigo-600">{hospitals ? hospitals.length : 0}</p>
          </div>
          
          <div className="bg-green-50 p-6 rounded-xl">
            <Users className="h-8 w-8 text-green-600 mb-2" />
            <h3 className="text-lg font-semibold">Total Doctors</h3>
            <p className="text-3xl font-bold text-green-600">{doctors ? doctors.length : 0}</p>
          </div>
          
          <div className="bg-purple-50 p-6 rounded-xl">
            <Users className="h-8 w-8 text-purple-600 mb-2" />
            <h3 className="text-lg font-semibold">Total Patients</h3>
            <p className="text-3xl font-bold text-purple-600">{totalPatients}</p>
          </div>
          
          <div className="bg-yellow-50 p-6 rounded-xl">
            <Calendar className="h-8 w-8 text-yellow-600 mb-2" />
            <h3 className="text-lg font-semibold">Active Appointments</h3>
            <p className="text-3xl font-bold text-yellow-600">{activeAppointments}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-gray-50 rounded-xl p-6">
            <h2 className="text-xl font-semibold mb-4">Hospital Statistics</h2>
            <div className="space-y-4">
              {hospitals && hospitals.slice(0, 5).map((hospital) => {
                const hospitalDoctors = doctors ? doctors.filter(
                  (d) => d.hospital_id === hospital.id
                ).length : 0;
                const hospitalAppointments = appointments ? appointments.filter(
                  (a) => a.hospital_id === hospital.id
                ).length : 0;

                return (
                  <div key={hospital.id} className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-gray-900">{hospital.name}</h4>
                      <p className="text-sm text-gray-500">{hospital.city}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">{hospitalDoctors} Doctors</p>
                      <p className="text-sm text-gray-600">{hospitalAppointments} Appointments</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-gray-50 rounded-xl p-6">
            <h2 className="text-xl font-semibold mb-4">System Activity</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Total Appointments</span>
                <span className="font-medium">{totalAppointments}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Active Appointments</span>
                <span className="font-medium">{activeAppointments}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Cancelled Appointments</span>
                <span className="font-medium">
                  {totalAppointments - activeAppointments}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Average Rating</span>
                <span className="font-medium">4.5/5</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}