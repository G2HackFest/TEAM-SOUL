import React, { useState } from 'react';
import { Edit2, User, Phone, Mail, Calendar } from 'lucide-react';
import { useStore } from '../store';
import EditProfile from './EditProfile';

export default function Profile() {
  const { currentUser } = useStore();
  const [showEditModal, setShowEditModal] = useState(false);

  if (!currentUser) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-2xl shadow-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <img
              src={currentUser.avatar_url || 'https://via.placeholder.com/150'}
              alt={currentUser.name}
              className="h-20 w-20 rounded-full object-cover"
            />
            <div>
              <h1 className="text-2xl font-bold">{currentUser.name}</h1>
              <p className="text-gray-600">{currentUser.email}</p>
            </div>
          </div>
          <button
            onClick={() => setShowEditModal(true)}
            className="flex items-center px-4 py-2 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100"
          >
            <Edit2 className="h-4 w-4 mr-2" />
            Edit Profile
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Personal Information</h2>
            <div className="space-y-3">
              <div className="flex items-center space-x-2 text-gray-600">
                <User className="h-5 w-5" />
                <span>Full Name:</span>
                <span className="font-medium text-gray-900">{currentUser.name}</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-600">
                <Mail className="h-5 w-5" />
                <span>Email:</span>
                <span className="font-medium text-gray-900">{currentUser.email}</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-600">
                <Phone className="h-5 w-5" />
                <span>Phone:</span>
                <span className="font-medium text-gray-900">{currentUser.phone || 'Not set'}</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-600">
                <Calendar className="h-5 w-5" />
                <span>Member Since:</span>
                <span className="font-medium text-gray-900">
                  {new Date().toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Account Settings</h2>
            <div className="space-y-2">
              <p className="text-gray-600">
                Email notifications are enabled for:
              </p>
              <ul className="list-disc list-inside text-gray-600 ml-4">
                <li>Appointment confirmations</li>
                <li>Appointment reminders</li>
                <li>Video consultation links</li>
                <li>Doctor's prescriptions</li>
              </ul>
            </div>
          </div>

          {currentUser.role === 'doctor' && (
            <div className="col-span-2 space-y-4">
              <h2 className="text-lg font-semibold">Professional Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-medium text-gray-900">Specialization</h3>
                  <p className="text-gray-600">{currentUser.specialization}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-medium text-gray-900">Experience</h3>
                  <p className="text-gray-600">{currentUser.experience}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-medium text-gray-900">Qualifications</h3>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {currentUser.qualifications?.map((qual, index) => (
                      <span key={index} className="px-2 py-1 bg-indigo-50 text-indigo-600 rounded-full text-sm">
                        {qual}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-medium text-gray-900">Languages</h3>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {currentUser.languages?.map((lang, index) => (
                      <span key={index} className="px-2 py-1 bg-green-50 text-green-600 rounded-full text-sm">
                        {lang}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {showEditModal && <EditProfile onClose={() => setShowEditModal(false)} />}
    </div>
  );
}