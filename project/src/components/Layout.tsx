import React from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Home, 
  User, 
  Calendar, 
  FileText, 
  Activity, 
  Search, 
  Bell, 
  LogOut, 
  Menu, 
  X,
  Heart,
  Stethoscope,
  Pill
} from 'lucide-react';
import { useStore } from '../store';
import NotificationsPanel from './NotificationsPanel';

const Layout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser, logout } = useStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const [showNotifications, setShowNotifications] = React.useState(false);

  const navItems = [
    { path: '/', icon: <Home size={20} />, label: 'Dashboard' },
    { path: '/profile', icon: <User size={20} />, label: 'My Profile' },
    { path: '/symptom-checker', icon: <Search size={20} />, label: 'Symptom Checker' },
    { path: '/recommendations', icon: <Activity size={20} />, label: 'Recommendations' },
    { path: '/appointments', icon: <Calendar size={20} />, label: 'Appointments' },
    { path: '/prescriptions', icon: <FileText size={20} />, label: 'Prescriptions' },
    { path: '/medications', icon: <Pill size={20} />, label: 'Medications' },
    { path: '/doctors', icon: <Stethoscope size={20} />, label: 'Find Doctors' },
    { path: '/hospitals', icon: <Heart size={20} />, label: 'Hospitals' },
  ];

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center">
            <Heart className="text-blue-600 mr-2" size={24} />
            <h1 className="text-xl font-bold text-blue-600">HealthCare AI</h1>
          </div>
          
          <div className="hidden md:flex items-center space-x-4">
            <div className="relative">
              <button 
                className="p-2 rounded-full hover:bg-gray-100 relative"
                onClick={() => setShowNotifications(!showNotifications)}
              >
                <Bell size={20} />
                <span className="absolute top-1 right-1 bg-red-500 rounded-full w-2 h-2"></span>
              </button>
              {showNotifications && <NotificationsPanel />}
            </div>
            
            <div className="flex items-center">
              <img 
                src={currentUser.avatar_url || 'https://via.placeholder.com/40'} 
                alt="Profile" 
                className="w-8 h-8 rounded-full mr-2 object-cover"
              />
              <span className="font-medium">{currentUser.name}</span>
            </div>
          </div>
          
          <button className="md:hidden" onClick={toggleMobileMenu}>
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </header>

      <div className="flex flex-1">
        {/* Sidebar - Desktop */}
        <aside className="hidden md:block w-64 bg-white border-r border-gray-200 pt-6">
          <nav className="flex flex-col h-full">
            <div className="flex-1 px-4">
              <ul className="space-y-2">
                {navItems.map((item) => (
                  <li key={item.path}>
                    <Link
                      to={item.path}
                      className={`flex items-center px-4 py-3 rounded-lg transition-colors ${
                        location.pathname === item.path
                          ? 'bg-blue-50 text-blue-600'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      {item.icon}
                      <span className="ml-3">{item.label}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="p-4 border-t border-gray-200">
              <button 
                onClick={handleLogout}
                className="flex items-center w-full px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <LogOut size={20} />
                <span className="ml-3">Logout</span>
              </button>
            </div>
          </nav>
        </aside>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden fixed inset-0 z-20 bg-white">
            <div className="flex flex-col h-full">
              <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                <div className="flex items-center">
                  <Heart className="text-blue-600 mr-2" size={24} />
                  <h1 className="text-xl font-bold text-blue-600">HealthCare AI</h1>
                </div>
                <button onClick={toggleMobileMenu}>
                  <X size={24} />
                </button>
              </div>
              
              <div className="p-4 border-b border-gray-200">
                <div className="flex items-center">
                  <img 
                    src={currentUser.avatar_url || 'https://via.placeholder.com/40'} 
                    alt="Profile" 
                    className="w-10 h-10 rounded-full mr-3 object-cover"
                  />
                  <div>
                    <p className="font-medium">{currentUser.name}</p>
                    <p className="text-sm text-gray-500">{currentUser.email}</p>
                  </div>
                </div>
              </div>
              
              <nav className="flex-1 overflow-y-auto p-4">
                <ul className="space-y-2">
                  {navItems.map((item) => (
                    <li key={item.path}>
                      <Link
                        to={item.path}
                        className={`flex items-center px-4 py-3 rounded-lg transition-colors ${
                          location.pathname === item.path
                            ? 'bg-blue-50 text-blue-600'
                            : 'text-gray-700 hover:bg-gray-100'
                        }`}
                        onClick={toggleMobileMenu}
                      >
                        {item.icon}
                        <span className="ml-3">{item.label}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
              
              <div className="p-4 border-t border-gray-200">
                <button 
                  onClick={handleLogout}
                  className="flex items-center w-full px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <LogOut size={20} />
                  <span className="ml-3">Logout</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Main Content */}
        <main className="flex-1 p-6 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;