import React from 'react';
import { useStore } from '../store';
import { Pill } from 'lucide-react';

export default function MedicationReports() {
  const { medications, users } = useStore();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-2xl shadow-xl p-6">
        <h2 className="text-2xl font-bold mb-6">Medication Reports</h2>

        <div className="space-y-4">
          {medications.length > 0 ? (
            medications.map((med) => {
              const patient = users.find(u => u.id === med.patient_id);
              return (
                <div
                  key={med.id}
                  className="p-4 bg-gray-50 rounded-lg border border-gray-200"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-medium text-gray-900">{med.name}</h3>
                      <p className="text-sm text-gray-600">
                        Patient: {patient?.name || 'Unknown'} | {med.dosage} - {med.frequency}
                      </p>
                    </div>
                    <span className="text-sm text-gray-500">
                      Last Taken: {med.lastTaken || 'Not recorded'}
                    </span>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Pill className="h-12 w-12 mx-auto text-gray-400 mb-2" />
              <p>No medication reports available.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}