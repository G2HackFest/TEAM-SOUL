import React, { useState } from 'react';
import { 
  Pill, 
  Clock, 
  Calendar, 
  Bell, 
  Plus,
  CheckCircle,
  XCircle,
  AlertTriangle
} from 'lucide-react';
import { format } from 'date-fns';

interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  timeOfDay: string[];
  startDate: string;
  endDate?: string;
  instructions?: string;
  taken: boolean[];
  lastTaken?: string;
}

const MedicationTracker: React.FC = () => {
  const [medications, setMedications] = useState<Medication[]>([
    {
      id: '1',
      name: 'Lisinopril',
      dosage: '10mg',
      frequency: 'Daily',
      timeOfDay: ['08:00', '20:00'],
      startDate: '2024-03-01',
      endDate: '2024-06-01',
      instructions: 'Take with food',
      taken: [false, false],
    },
    {
      id: '2',
      name: 'Metformin',
      dosage: '500mg',
      frequency: 'Twice daily',
      timeOfDay: ['09:00', '21:00'],
      startDate: '2024-02-15',
      instructions: 'Take with meals',
      taken: [true, false],
      lastTaken: '2024-03-26 09:00',
    },
  ]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [newMedication, setNewMedication] = useState<Partial<Medication>>({
    timeOfDay: ['08:00'],
    taken: [false],
  });

  const handleAddMedication = () => {
    if (newMedication.name && newMedication.dosage && newMedication.frequency) {
      setMedications([
        ...medications,
        {
          ...newMedication,
          id: Date.now().toString(),
          taken: new Array(newMedication.timeOfDay?.length || 1).fill(false),
        } as Medication,
      ]);
      setShowAddForm(false);
      setNewMedication({
        timeOfDay: ['08:00'],
        taken: [false],
      });
    }
  };

  const handleTakeMedication = (medicationId: string, doseIndex: number) => {
    setMedications(medications.map(med => {
      if (med.id === medicationId) {
        const newTaken = [...med.taken];
        newTaken[doseIndex] = true;
        return {
          ...med,
          taken: newTaken,
          lastTaken: format(new Date(), "yyyy-MM-dd HH:mm"),
        };
      }
      return med;
    }));
  };

  const calculateAdherence = (medication: Medication) => {
    const takenCount = medication.taken.filter(t => t).length;
    const totalDoses = medication.taken.length;
    return (takenCount / totalDoses) * 100;
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Medication Tracker</h1>
        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Plus size={20} className="mr-2" />
          Add Medication
        </button>
      </div>

      {/* Medication List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {medications.map((medication) => (
          <div
            key={medication.id}
            className="bg-white rounded-xl shadow-sm p-6 border border-gray-200"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold">{medication.name}</h3>
                <p className="text-gray-600">{medication.dosage}</p>
              </div>
              <div className="flex items-center">
                <Bell className="text-blue-500 mr-2" size={20} />
                <span className="text-sm text-gray-600">{medication.frequency}</span>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center text-sm text-gray-600">
                <Calendar className="mr-2" size={16} />
                <span>
                  Started: {format(new Date(medication.startDate), 'MMM d, yyyy')}
                  {medication.endDate && ` - Ends: ${format(new Date(medication.endDate), 'MMM d, yyyy')}`}
                </span>
              </div>

              <div className="border-t border-gray-200 pt-4">
                <h4 className="font-medium mb-2">Today's Doses</h4>
                <div className="space-y-2">
                  {medication.timeOfDay.map((time, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between bg-gray-50 p-3 rounded-lg"
                    >
                      <div className="flex items-center">
                        <Clock className="mr-2 text-gray-500" size={16} />
                        <span>{time}</span>
                      </div>
                      {medication.taken[index] ? (
                        <div className="flex items-center text-green-600">
                          <CheckCircle size={20} className="mr-1" />
                          <span className="text-sm">Taken</span>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleTakeMedication(medication.id, index)}
                          className="px-3 py-1 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700"
                        >
                          Mark as Taken
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t border-gray-200 pt-4">
                <h4 className="font-medium mb-2">Adherence Rate</h4>
                <div className="relative pt-1">
                  <div className="flex mb-2 items-center justify-between">
                    <div>
                      <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-blue-600 bg-blue-200">
                        {Math.round(calculateAdherence(medication))}%
                      </span>
                    </div>
                  </div>
                  <div className="flex h-2 mb-4 overflow-hidden bg-gray-200 rounded">
                    <div
                      style={{ width: `${calculateAdherence(medication)}%` }}
                      className="flex flex-col justify-center overflow-hidden bg-blue-500"
                    ></div>
                  </div>
                </div>
              </div>

              {medication.instructions && (
                <div className="flex items-start text-sm text-gray-600">
                  <AlertTriangle className="mr-2 text-yellow-500 flex-shrink-0" size={16} />
                  <p>{medication.instructions}</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Add Medication Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Add New Medication</h2>
              <button onClick={() => setShowAddForm(false)}>
                <XCircle size={24} className="text-gray-500" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Medication Name
                </label>
                <input
                  type="text"
                  value={newMedication.name || ''}
                  onChange={(e) => setNewMedication({ ...newMedication, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter medication name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Dosage
                </label>
                <input
                  type="text"
                  value={newMedication.dosage || ''}
                  onChange={(e) => setNewMedication({ ...newMedication, dosage: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., 10mg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Frequency
                </label>
                <select
                  value={newMedication.frequency || ''}
                  onChange={(e) => setNewMedication({ ...newMedication, frequency: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select frequency</option>
                  <option value="Daily">Daily</option>
                  <option value="Twice daily">Twice daily</option>
                  <option value="Three times daily">Three times daily</option>
                  <option value="As needed">As needed</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Start Date
                </label>
                <input
                  type="date"
                  value={newMedication.startDate || ''}
                  onChange={(e) => setNewMedication({ ...newMedication, startDate: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Instructions (Optional)
                </label>
                <textarea
                  value={newMedication.instructions || ''}
                  onChange={(e) => setNewMedication({ ...newMedication, instructions: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  rows={3}
                  placeholder="Enter any special instructions"
                ></textarea>
              </div>
            </div>

            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => setShowAddForm(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleAddMedication}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Add Medication
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MedicationTracker;