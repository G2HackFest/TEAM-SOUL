import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Activity, Heart, Scale, TrendingUp } from 'lucide-react';
import { useStore } from '../store';
import { format, subDays } from 'date-fns';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function PatientProgress({ patientId }: { patientId: string }) {
  const { users, medications, healthStats } = useStore();
  const patient = users.find(u => u.id === patientId);

  // Dummy data for charts (replace with real data from your store)
  const generateData = (days: number, min: number, max: number) =>
    Array.from({ length: days }).map((_, i) => ({
      date: format(subDays(new Date(), days - 1 - i), 'MMM dd'),
      value: Math.floor(Math.random() * (max - min + 1)) + min,
    }));

  const vitalsData = {
    heartRate: generateData(7, 60, 100),
    weight: generateData(7, 150, 160),
  };

  const chartData = {
    labels: vitalsData.heartRate.map(d => d.date),
    datasets: [
      {
        label: 'Heart Rate (BPM)',
        data: vitalsData.heartRate.map(d => d.value),
        borderColor: '#EF4444',
        tension: 0.4,
      },
      {
        label: 'Weight (lbs)',
        data: vitalsData.weight.map(d => d.value),
        borderColor: '#10B981',
        tension: 0.4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'top' as const },
    },
    scales: {
      y: { beginAtZero: false },
    },
  };

  const patientMedications = medications.filter(m => m.patient_id === patientId);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-2xl shadow-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">
            {patient?.name || 'Patient'}'s Progress
          </h2>
          <img
            src={patient?.avatar_url || 'https://via.placeholder.com/40'}
            alt={patient?.name}
            className="h-12 w-12 rounded-full object-cover"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-indigo-50 p-6 rounded-xl">
            <Heart className="h-8 w-8 text-indigo-600 mb-2" />
            <h3 className="text-lg font-semibold">Heart Rate</h3>
            <p className="text-3xl font-bold text-indigo-600">{vitalsData.heartRate[6].value} BPM</p>
          </div>
          <div className="bg-green-50 p-6 rounded-xl">
            <Scale className="h-8 w-8 text-green-600 mb-2" />
            <h3 className="text-lg font-semibold">Weight</h3>
            <p className="text-3xl font-bold text-green-600">{vitalsData.weight[6].value} lbs</p>
          </div>
          <div className="bg-purple-50 p-6 rounded-xl">
            <Activity className="h-8 w-8 text-purple-600 mb-2" />
            <h3 className="text-lg font-semibold">Health Score</h3>
            <p className="text-3xl font-bold text-purple-600">85/100</p>
          </div>
        </div>

        <div className="bg-gray-50 rounded-xl p-6 mb-8">
          <h3 className="text-xl font-semibold mb-4">Vitals Trend</h3>
          <div className="h-80">
            <Line data={chartData} options={chartOptions} />
          </div>
        </div>

        <div className="space-y-6">
          <h3 className="text-xl font-semibold">Medication Adherence</h3>
          {patientMedications.length > 0 ? (
            patientMedications.map((med) => (
              <div
                key={med.id}
                className="p-4 bg-gray-50 rounded-lg border border-gray-200"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-medium text-gray-900">{med.name}</h4>
                    <p className="text-sm text-gray-600">{med.dosage} - {med.frequency}</p>
                  </div>
                  <span className="text-sm text-gray-500">
                    Last Taken: {med.lastTaken || 'Not recorded'}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No medications assigned.</p>
          )}
        </div>
      </div>
    </div>
  );
}