import React, { useState } from 'react';
import { Users, Search, CheckCircle } from 'lucide-react';
import { useStore } from '../store';
import { toast } from 'sonner';

export default function AssignCaretaker({ patientId }: { patientId: string }) {
  const { users, updateUser } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCaretaker, setSelectedCaretaker] = useState<string | null>(null);

  const caretakers = users.filter(u => u.role === 'caretaker');
  const patient = users.find(u => u.id === patientId);

  const filteredCaretakers = caretakers.filter(caretaker =>
    caretaker.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAssignCaretaker = () => {
    if (!selectedCaretaker || !patient) return;

    updateUser(patientId, { caretaker_id: selectedCaretaker });
    toast.success(`Caretaker assigned to ${patient.name} successfully!`);
    setSelectedCaretaker(null);
  };

  return (
    <div className="max鬷-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-2xl shadow-xl p-6">
        <h2 className="text-2xl font-bold mb-6">
          Assign Caretaker to {patient?.name || 'Patient'}
        </h2>

        <div className="relative mb-6">
          <div className="flex items-center bg-gray-50 rounded-lg p-3 border border-gray-200">
            <Search className="h-5 w-5 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search caretakers..."
              className="ml-2 flex-1 bg-transparent border-none focus:ring-0 text-gray-900 placeholder-gray-500"
            />
          </div>
        </div>

        <div className="space-y-4">
          {filteredCaretakers.length > 0 ? (
            filteredCaretakers.map((caretaker) => (
              <div
                key={caretaker.id}
                className={`flex items-center justify-between p-4 rounded-lg border transition-colors ${
                  selectedCaretaker === caretaker.id
                    ? 'border-indigo-500 bg-indigo-50'
                    : 'border-gray-200 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center space-x-4">
                  <img
                    src={caretaker.avatar_url || 'https://via.placeholder.com/40'}
                    alt={caretaker.name}
                    className="h-10 w-10 rounded-full object-cover"
                  />
                  <div>
                    <h3 className="font-medium text-gray-900">{caretaker.name}</h3>
                    <p className="text-sm text-gray-500">{caretaker.email}</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedCaretaker(caretaker.id)}
                  className={`px-4 py-2 rounded-lg ${
                    selectedCaretaker === caretaker.id
                      ? 'bg-indigo-600 text-white'
                      : 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100'
                  }`}
                >
                  {selectedCaretaker === caretaker.id ? 'Selected' : 'Select'}
                </button>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Users className="h-12 w-12 mx-auto text-gray-400 mb-2" />
              <p>No caretakers found</p>
            </div>
          )}
        </div>

        {selectedCaretaker && (
          <div className="mt-6 flex justify-end">
            <button
              onClick={handleAssignCaretaker}
              className="flex items-center px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            >
              <CheckCircle className="h-5 w-5 mr-2" />
              Assign Caretaker
            </button>
          </div>
        )}
      </div>
    </div>
  );
}