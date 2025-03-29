import React from 'react';
import { useStore } from '../store';
import { User } from 'lucide-react';

export default function Doctors() {
  const { users } = useStore();

  // Filter users to get doctors
  const doctors = users.filter(u => u.role === 'doctor');

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-2xl shadow-xl p-6">
        <h2 className="text-2xl font-bold mb-6">Available Doctors</h2>

        <div className="space-y-4">
          {doctors.length > 0 ? (
            doctors.map((doctor) => (
              <div
                key={doctor.id}
                className="flex items-center p-4 bg-gray-50 rounded-lg border border-gray-200"
              >
                <img
                  src={doctor.avatar_url || 'https://via.placeholder.com/40'}
                  alt={doctor.name}
                  className="h-10 w-10 rounded-full object-cover mr-4"
                />
                <div>
                  <h3 className="font-medium text-gray-900">{doctor.name}</h3>
                  <p className="text-sm text-gray-600">{doctor.email}</p>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-gray-500">
              <User className="h-12 w-12 mx-auto text-gray-400 mb-2" />
              <p>No doctors available at this time.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}