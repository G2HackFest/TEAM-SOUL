import React, { useState } from 'react';
import { Edit2, User, Phone, Mail, Calendar } from 'lucide-react';
import { useStore } from '../store';
import EditProfile from '../components/EditProfile';

export default function Profile() {
  const { user, profile } = useStore();
  const [showEditModal, setShowEditModal] = useState(false);

  if (!user || !profile) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-2xl shadow-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <img
              src={profile.avatar_url || 'https://via.placeholder.com/150'}
              alt={profile.full_name}
              className="h-20 w-20 rounded-full object-cover"
            />
            <div>
              <h1 className="text-2xl font-bold">{profile.full_name}</h1>
              <p className="text-gray-600">{user.email}</p>
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
                <span className="font-medium text-gray-900">{profile.full_name}</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-600">
                <Mail className="h-5 w-5" />
                <span>Email:</span>
                <span className="font-medium text-gray-900">{user.email}</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-600">
                <Phone className="h-5 w-5" />
                <span>Phone:</span>
                <span className="font-medium text-gray-900">{profile.phone || 'Not set'}</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-600">
                <Calendar className="h-5 w-5" />
                <span>Member Since:</span>
                <span className="font-medium text-gray-900">
                  {new Date(user.created_at).toLocaleDateString()}
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
        </div>
      </div>

      {showEditModal && <EditProfile onClose={() => setShowEditModal(false)} />}
    </div>
  );
}