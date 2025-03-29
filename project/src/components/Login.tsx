import React, { useState } from 'react';
import { useStore } from '../store';
import { users } from '../lib/data';
import { toast } from 'sonner';
import { User, Lock, Building2, Stethoscope } from 'lucide-react';

type UserRole = 'patient' | 'doctor' | 'admin';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState<UserRole>('patient');
  const { setUser } = useStore();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const user = users.find(
      (u) => u.email === email && u.password === password && u.role === selectedRole
    );

    if (user) {
      setUser(user);
      toast.success(`Welcome back, ${user.name}!`);
    } else {
      toast.error('Invalid email or password');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-8">Login to SwasthyaSathi</h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Role Selection */}
          <div className="grid grid-cols-3 gap-4">
            <button
              type="button"
              onClick={() => setSelectedRole('patient')}
              className={`flex flex-col items-center justify-center p-4 rounded-lg transition-colors ${
                selectedRole === 'patient'
                  ? 'bg-indigo-100 text-indigo-700'
                  : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
              }`}
            >
              <User className="h-6 w-6 mb-2" />
              <span className="text-sm">Patient</span>
            </button>
            <button
              type="button"
              onClick={() => setSelectedRole('doctor')}
              className={`flex flex-col items-center justify-center p-4 rounded-lg transition-colors ${
                selectedRole === 'doctor'
                  ? 'bg-indigo-100 text-indigo-700'
                  : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Stethoscope className="h-6 w-6 mb-2" />
              <span className="text-sm">Doctor</span>
            </button>
            <button
              type="button"
              onClick={() => setSelectedRole('admin')}
              className={`flex flex-col items-center justify-center p-4 rounded-lg transition-colors ${
                selectedRole === 'admin'
                  ? 'bg-indigo-100 text-indigo-700'
                  : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Building2 className="h-6 w-6 mb-2" />
              <span className="text-sm">Admin</span>
            </button>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10 w-full rounded-lg border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                placeholder="Enter your email"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10 w-full rounded-lg border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                placeholder="Enter your password"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Login
          </button>
        </form>

        <div className="mt-6">
          <p className="text-sm text-gray-600 text-center">Demo Accounts:</p>
          <div className="mt-2 space-y-2 text-sm text-gray-500">
            <div className="p-2 bg-gray-50 rounded-lg">
              <p className="font-medium text-gray-700">Admin Login</p>
              <p>Email: admin1@swasthya.com</p>
              <p>Password: admin123</p>
            </div>
            <div className="p-2 bg-gray-50 rounded-lg">
              <p className="font-medium text-gray-700">Doctor Login</p>
              <p>Email: doctor1@hospitalh1.com</p>
              <p>Password: doctor123</p>
            </div>
            <div className="p-2 bg-gray-50 rounded-lg">
              <p className="font-medium text-gray-700">Patient Login</p>
              <p>Email: user1@example.com</p>
              <p>Password: user123</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}