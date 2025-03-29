import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import Profile from './components/Profile';
import SymptomChecker from './components/SymptomChecker';
import AppointmentList from './components/AppointmentList'; // Fixed: Renamed from Appointments
import PrescriptionPDF from './components/PrescriptionPDF'; // Fixed: Renamed from Prescriptions
import MedicationTracker from './components/MedicationTracker';
import CaretakerDashboard from './components/CaretakerDashboard';
import CaretakerChat from './components/CaretakerChat';
import PatientProgress from './components/PatientProgress';
import Login from './components/Login';
import AssignCaretaker from './components/AssignCaretaker';
import DoctorDashboard from './components/DoctorDashboard';
import AdminDashboard from './components/AdminDashboard';
import Recommendations from './components/Recommendations'; // New component
import Doctors from './components/Doctors'; // New component
import Hospitals from './components/Hospitals'; // New component
import { useStore } from './store';
import { Toaster } from 'sonner';

function App() {
  const { currentUser } = useStore();

  if (!currentUser) {
    return <Login />;
  }

  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            {/* Common routes for all users */}
            <Route
              index
              element={
                currentUser.role === 'caretaker' ? (
                  <CaretakerDashboard />
                ) : currentUser.role === 'admin' ? (
                  <AdminDashboard />
                ) : currentUser.role === 'doctor' ? (
                  <DoctorDashboard />
                ) : (
                  <Dashboard />
                )
              }
            />
            <Route path="profile" element={<Profile />} />

            {/* Patient-specific routes */}
            {currentUser.role === 'patient' && (
              <>
                <Route path="symptom-checker" element={<SymptomChecker />} />
                <Route path="recommendations" element={<Recommendations />} />
                <Route path="appointments" element={<AppointmentList />} />
                <Route path="prescriptions" element={<PrescriptionPDF />} />
                <Route path="doctors" element={<Doctors />} />
                <Route path="hospitals" element={<Hospitals />} />
                <Route path="medications" element={<MedicationTracker />} />
                <Route path="caretaker-chat" element={<CaretakerChat patientId={currentUser.id} />} />
              </>
            )}

            {/* Caretaker-specific routes */}
            {currentUser.role === 'caretaker' && (
              <>
                {/* PatientList and MedicationReports are missing - placeholders */}
                <Route path="patients" element={<div>PatientList Placeholder</div>} />
                <Route path="patient/:id" element={<PatientProgress />} />
                <Route path="chat/:patientId" element={<CaretakerChat />} />
                <Route path="medication-reports" element={<div>MedicationReports Placeholder</div>} />
              </>
            )}

            {/* Doctor-specific routes */}
            {currentUser.role === 'doctor' && (
              <>
                <Route path="patients" element={<div>PatientList Placeholder</div>} />
                <Route path="assign-caretaker/:patientId" element={<AssignCaretaker />} />
                <Route path="patient-progress/:patientId" element={<PatientProgress />} />
              </>
            )}
          </Route>
        </Routes>
      </Router>
      <Toaster position="top-right" />
    </>
  );
}

export default App;