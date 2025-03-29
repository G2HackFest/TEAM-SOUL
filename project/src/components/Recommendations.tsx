import React from 'react';
import { useStore } from '../store';
import { Stethoscope } from 'lucide-react';

export default function Recommendations() {
  const { currentUser } = useStore();

  // Dummy recommendations (replace with real data or API calls)
  const recommendations = [
    { id: 1, title: 'Stay Hydrated', description: 'Drink at least 8 glasses of water daily.' },
    { id: 2, title: 'Exercise Regularly', description: 'Aim for 30 minutes of moderate exercise 5 days a week.' },
    { id: 3, title: 'Healthy Diet', description: 'Incorporate more fruits and vegetables into your meals.' },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-2xl shadow-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Health Recommendations</h2>
          <Stethoscope className="h-8 w-8 text-indigo-600" />
        </div>

        <div className="space-y-4">
          {recommendations.length > 0 ? (
            recommendations.map((rec) => (
              <div
                key={rec.id}
                className="p-4 bg-gray-50 rounded-lg border border-gray-200"
              >
                <h3 className="font-medium text-gray-900">{rec.title}</h3>
                <p className="text-sm text-gray-600">{rec.description}</p>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-center py-8">
              No recommendations available at this time.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}