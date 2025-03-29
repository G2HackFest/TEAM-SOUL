import React from 'react';
import { Line, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Activity, Heart, Thermometer, TrendingUp, Scale, Clock } from 'lucide-react';
import { format, subDays } from 'date-fns';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

interface HealthMetric {
  date: string;
  value: number;
}

interface HealthScore {
  overall: number;
  physical: number;
  mental: number;
  lifestyle: number;
}

const generateDummyData = (days: number, min: number, max: number): HealthMetric[] => {
  return Array.from({ length: days }).map((_, i) => ({
    date: format(subDays(new Date(), days - 1 - i), 'MMM dd'),
    value: Math.floor(Math.random() * (max - min + 1)) + min,
  }));
};

const healthScoreData = {
  overall: 85,
  physical: 88,
  mental: 82,
  lifestyle: 85,
};

const vitalsData = {
  heartRate: generateDummyData(7, 60, 100),
  bloodPressure: generateDummyData(7, 110, 140),
  temperature: generateDummyData(7, 97, 99),
  weight: generateDummyData(7, 150, 155),
};

export default function HealthDashboard() {
  const lineChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
    },
    scales: {
      y: {
        beginAtZero: false,
      },
    },
  };

  const healthScoreChartData = {
    labels: ['Physical', 'Mental', 'Lifestyle'],
    datasets: [
      {
        data: [healthScoreData.physical, healthScoreData.mental, healthScoreData.lifestyle],
        backgroundColor: ['#60A5FA', '#34D399', '#F472B6'],
      },
    ],
  };

  const vitalsChartData = {
    labels: vitalsData.heartRate.map(d => d.date),
    datasets: [
      {
        label: 'Heart Rate',
        data: vitalsData.heartRate.map(d => d.value),
        borderColor: '#EF4444',
        tension: 0.4,
      },
      {
        label: 'Blood Pressure',
        data: vitalsData.bloodPressure.map(d => d.value),
        borderColor: '#3B82F6',
        tension: 0.4,
      },
    ],
  };

  return (
    <div className="space-y-6">
      {/* Health Score Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <Activity className="h-8 w-8" />
            <span className="text-3xl font-bold">{healthScoreData.overall}</span>
          </div>
          <h3 className="mt-4 text-lg font-semibold">Overall Health Score</h3>
          <p className="text-blue-100">Based on your recent activity</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <Heart className="h-8 w-8 text-red-500" />
            <span className="text-2xl font-bold">{vitalsData.heartRate[6].value}</span>
          </div>
          <h3 className="mt-4 text-lg font-semibold">Heart Rate</h3>
          <p className="text-gray-500">BPM</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <TrendingUp className="h-8 w-8 text-blue-500" />
            <span className="text-2xl font-bold">{vitalsData.bloodPressure[6].value}</span>
          </div>
          <h3 className="mt-4 text-lg font-semibold">Blood Pressure</h3>
          <p className="text-gray-500">Systolic (mmHg)</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <Scale className="h-8 w-8 text-green-500" />
            <span className="text-2xl font-bold">{vitalsData.weight[6].value}</span>
          </div>
          <h3 className="mt-4 text-lg font-semibold">Weight</h3>
          <p className="text-gray-500">lbs</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Health Score Breakdown</h3>
          <div className="h-64">
            <Doughnut
              data={healthScoreChartData}
              options={{
                cutout: '70%',
                plugins: {
                  legend: {
                    position: 'bottom',
                  },
                },
              }}
            />
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Vitals Trend</h3>
          <div className="h-64">
            <Line data={vitalsChartData} options={lineChartOptions} />
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <h3 className="text-lg font-semibold mb-4">Recent Health Activity</h3>
        <div className="space-y-4">
          {[
            {
              icon: Heart,
              color: 'text-red-500',
              bg: 'bg-red-100',
              title: 'Cardio Exercise',
              time: '2 hours ago',
              description: '30 minutes of moderate intensity',
            },
            {
              icon: Thermometer,
              color: 'text-yellow-500',
              bg: 'bg-yellow-100',
              title: 'Temperature Check',
              time: '5 hours ago',
              description: '98.6°F - Normal',
            },
            {
              icon: Clock,
              color: 'text-blue-500',
              bg: 'bg-blue-100',
              title: 'Sleep Tracking',
              time: '8 hours ago',
              description: '7.5 hours of sleep recorded',
            },
          ].map((activity, index) => (
            <div key={index} className="flex items-start space-x-4">
              <div className={`p-2 rounded-lg ${activity.bg}`}>
                <activity.icon className={`h-6 w-6 ${activity.color}`} />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">{activity.title}</h4>
                  <span className="text-sm text-gray-500">{activity.time}</span>
                </div>
                <p className="text-gray-600">{activity.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}