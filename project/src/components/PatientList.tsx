import React from 'react';
import { useStore } from '../store';
import { Link } from 'react-router-dom';
import { User } from 'lucide-react';

export default function PatientList() {
  const { users } = useStore();
  const patients = users.filter(u => u.role === 'patient');

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-2xl shadow-xl p-6">
        <h2 className="text-2xl font-bold mb-6">Patients</h2>

        <div className="space-y-4">
          {patients.length > 0 ? (
            patients.map((patient) => (
              <Link
                to={`/patient/${patient.id}`}
                key={patient.id}
                className="flex items-center p-4 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100"
              >
                <img
                  src={patient.avatar_url || 'https://via.placeholder.com/40'}
                  alt={patient.name}
                  className="h-10 w-10 rounded-full object-cover mr-4"
                />
                <div>
                  <h3 className="font-medium text-gray-900">{patient.name}</h3>
                  <p className="text-sm text-gray-600">{patient.email}</p>
                </div>
              </Link>
            ))
          ) : (
            <div className="text-center py-8 text-gray-500">
              <User className="h-12 w-12 mx-auto text-gray-400 mb-2" />
              <p>No patients found.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}