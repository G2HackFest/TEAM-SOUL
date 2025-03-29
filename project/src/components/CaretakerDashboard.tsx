import React from 'react';
import { Users, MessageSquare, Pill, FileText, AlertTriangle, Calendar } from 'lucide-react';
import { useStore } from '../store';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';

export default function CaretakerDashboard() {
  const { currentUser, patients, medications, adherenceReports } = useStore();

  if (!currentUser || currentUser.role !== 'caretaker') return null;

  const assignedPatients = patients.filter(p => p.caretaker_id === currentUser.id);
  const todaysMedications = medications.filter(med => {
    const today = format(new Date(), 'yyyy-MM-dd');
    return med.schedule.some(s => s.date === today);
  });

  const pendingReports = adherenceReports.filter(r => !r.reviewed);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-2xl shadow-xl p-6">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Welcome, {currentUser.name}!</h1>
            <p className="text-gray-600">Caretaker Dashboard</p>
          </div>
          <img
            src={currentUser.avatar_url}
            alt={currentUser.name}
            className="h-16 w-16 rounded-full object-cover"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-indigo-50 p-6 rounded-xl">
            <Users className="h-8 w-8 text-indigo-600 mb-2" />
            <h3 className="text-lg font-semibold">Assigned Patients</h3>
            <p className="text-3xl font-bold text-indigo-600">{assignedPatients.length}</p>
          </div>
          
          <div className="bg-green-50 p-6 rounded-xl">
            <Pill className="h-8 w-8 text-green-600 mb-2" />
            <h3 className="text-lg font-semibold">Today's Medications</h3>
            <p className="text-3xl font-bold text-green-600">{todaysMedications.length}</p>
          </div>
          
          <div className="bg-yellow-50 p-6 rounded-xl">
            <AlertTriangle className="h-8 w-8 text-yellow-600 mb-2" />
            <h3 className="text-lg font-semibold">Pending Reports</h3>
            <p className="text-3xl font-bold text-yellow-600">{pendingReports.length}</p>
          </div>
          
          <div className="bg-purple-50 p-6 rounded-xl">
            <MessageSquare className="h-8 w-8 text-purple-600 mb-2" />
            <h3 className="text-lg font-semibold">Active Chats</h3>
            <p className="text-3xl font-bold text-purple-600">
              {assignedPatients.filter(p => p.has_unread_messages).length}
            </p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-xl font-semibold mb-4">Today's Patient Schedule</h2>
            {assignedPatients.length > 0 ? (
              <div className="space-y-4">
                {assignedPatients.map(patient => (
                  <div key={patient.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <img
                        src={patient.avatar_url}
                        alt={patient.name}
                        className="h-12 w-12 rounded-full object-cover"
                      />
                      <div>
                        <h3 className="font-medium text-gray-900">{patient.name}</h3>
                        <p className="text-sm text-gray-500">{patient.medications.length} medications</p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Link
                        to={`/chat/${patient.id}`}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                      >
                        Chat
                      </Link>
                      <Link
                        to={`/patient/${patient.id}`}
                        className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                      >
                        View Progress
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Users className="h-12 w-12 mx-auto text-gray-400 mb-2" />
                <p>No patients assigned yet</p>
              </div>
            )}
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-xl font-semibold mb-4">Medication Adherence Reports</h2>
            {pendingReports.length > 0 ? (
              <div className="space-y-4">
                {pendingReports.map(report => (
                  <div key={report.id} className="p-4 border border-gray-200 rounded-lg">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium">{report.patient_name}</h3>
                        <p className="text-sm text-gray-500">
                          {format(new Date(report.date), 'PPP')}
                        </p>
                        <p className="text-sm text-gray-600 mt-2">{report.notes}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm ${
                        report.adherence_rate >= 80 ? 'bg-green-100 text-green-800' :
                        report.adherence_rate >= 50 ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {report.adherence_rate}% Adherence
                      </span>
                    </div>
                    <div className="mt-4 flex justify-end space-x-2">
                      <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
                        Review Report
                      </button>
                      <Link
                        to={`/chat/${report.patient_id}`}
                        className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                      >
                        Contact Patient
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <FileText className="h-12 w-12 mx-auto text-gray-400 mb-2" />
                <p>No pending reports</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}