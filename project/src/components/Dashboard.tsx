import React from 'react';
import { 
  Calendar, 
  Activity, 
  FileText, 
  AlertTriangle, 
  Clock, 
  TrendingUp,
  Heart,
  Droplet,
  Search,
  Plus
} from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { Link } from 'react-router-dom';
import { useStore } from '../store';

const Dashboard: React.FC = () => {
  const { currentUser, appointments = [], healthRecommendations = [], prescriptions = [], healthStats = {} } = useStore();

  const upcomingAppointments = appointments.filter(app => app.status === 'scheduled');
  const latestRecommendation = healthRecommendations[healthRecommendations.length - 1];
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Welcome back, {currentUser?.name}!</h1>
        <div className="text-sm text-gray-500">
          {format(new Date(), 'EEEE, MMMM d, yyyy')}
        </div>
      </div>
      
      {/* Health Alert */}
      {latestRecommendation && latestRecommendation.recommendedActions?.some(action => action.urgency === 'high') && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
          <div className="flex items-start">
            <AlertTriangle className="text-red-500 mr-3 mt-0.5" size={20} />
            <div>
              <h3 className="font-medium text-red-800">Health Alert</h3>
              <p className="text-sm text-red-700 mt-1">
                {latestRecommendation.recommendedActions.find(action => action.urgency === 'high')?.description}
              </p>
              <Link to="/recommendations" className="text-sm font-medium text-red-800 hover:text-red-900 mt-2 inline-block">
                View Details
              </Link>
            </div>
          </div>
        </div>
      )}
      
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Appointments</p>
              <p className="text-2xl font-bold">{upcomingAppointments.length}</p>
            </div>
            <div className="bg-blue-50 p-3 rounded-full">
              <Calendar className="text-blue-500" size={20} />
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Next: {upcomingAppointments.length > 0 ? 
              `${format(new Date(upcomingAppointments[0].date), 'MMM d')} at ${upcomingAppointments[0].time}` : 
              'None scheduled'}
          </p>
        </div>
        
        <div className="bg-white rounded-lg shadow p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Active Medications</p>
              <p className="text-2xl font-bold">{prescriptions.length}</p>
            </div>
            <div className="bg-green-50 p-3 rounded-full">
              <Activity className="text-green-500" size={20} />
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Last updated: {prescriptions.length > 0 ? 
              format(new Date(prescriptions[prescriptions.length - 1].issueDate), 'MMM d, yyyy') : 
              'No active medications'}
          </p>
        </div>
        
        <div className="bg-white rounded-lg shadow p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Health Score</p>
              <p className="text-2xl font-bold">85/100</p>
            </div>
            <div className="bg-purple-50 p-3 rounded-full">
              <Heart className="text-purple-500" size={20} />
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            <span className="text-green-500 flex items-center">
              <TrendingUp size={12} className="mr-1" /> 3% improvement
            </span>
          </p>
        </div>
        
        <div className="bg-white rounded-lg shadow p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Next Check-up</p>
              <p className="text-2xl font-bold">7 days</p>
            </div>
            <div className="bg-yellow-50 p-3 rounded-full">
              <Clock className="text-yellow-500" size={20} />
            </div>
          </div>
          <Link to="/appointments" className="text-xs text-blue-600 hover:text-blue-800 mt-2 inline-block">
            Schedule appointment
          </Link>
        </div>
      </div>
      
      {/* Health Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-5">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Quick Actions</h2>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Link
              to="/symptom-checker"
              className="flex flex-col items-center p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
            >
              <Search className="text-blue-600 mb-2" size={24} />
              <span className="text-sm font-medium text-blue-800">Check Symptoms</span>
            </Link>
            <Link
              to="/medications"
              className="flex flex-col items-center p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
            >
              <Plus className="text-green-600 mb-2" size={24} />
              <span className="text-sm font-medium text-green-800">Add Medication</span>
            </Link>
            <Link
              to="/appointments"
              className="flex flex-col items-center p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
            >
              <Calendar className="text-purple-600 mb-2" size={24} />
              <span className="text-sm font-medium text-purple-800">Book Appointment</span>
            </Link>
            <Link
              to="/doctors"
              className="flex flex-col items-center p-4 bg-yellow-50 rounded-lg hover:bg-yellow-100 transition-colors"
            >
              <Heart className="text-yellow-600 mb-2" size={24} />
              <span className="text-sm font-medium text-yellow-800">Find Doctor</span>
            </Link>
          </div>
        </div>
        
        {/* Upcoming Appointments */}
        <div className="bg-white rounded-lg shadow p-5">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Upcoming Appointments</h2>
            <Link to="/appointments" className="text-sm text-blue-600 hover:text-blue-800">View All</Link>
          </div>
          
          {upcomingAppointments.length > 0 ? (
            <div className="space-y-4">
              {upcomingAppointments.slice(0, 3).map((appointment) => (
                <div key={appointment.id} className="flex items-start p-3 border border-gray-100 rounded-lg hover:bg-gray-50">
                  <div className="bg-blue-100 text-blue-800 p-3 rounded-lg text-center min-w-16">
                    <p className="text-sm font-bold">{format(new Date(appointment.date), 'MMM')}</p>
                    <p className="text-xl font-bold">{format(new Date(appointment.date), 'd')}</p>
                  </div>
                  
                  <div className="ml-4 flex-1">
                    <h3 className="font-medium">{appointment.doctorName}</h3>
                    <p className="text-sm text-gray-500">{appointment.specialization}</p>
                    <div className="flex items-center mt-1 text-sm text-gray-500">
                      <Clock size={14} className="mr-1" />
                      <span>{appointment.time}</span>
                    </div>
                  </div>
                  
                  <div>
                    <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium">
                      {appointment.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Calendar className="mx-auto text-gray-300" size={40} />
              <p className="mt-2 text-gray-500">No upcoming appointments</p>
              <Link 
                to="/appointments" 
                className="mt-3 inline-block px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700"
              >
                Schedule Now
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;