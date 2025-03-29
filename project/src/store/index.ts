import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  User,
  Doctor,
  Hospital,
  Appointment,
  Notification,
  AppointmentType,
  hospitals as initialHospitals,
  doctors as initialDoctors,
  users as initialUsers,
  initialAppointments,
  initialNotifications,
} from '../lib/data';

interface AppState {
  currentUser: User | null;
  hospitals: Hospital[];
  doctors: Doctor[];
  appointments: Appointment[];
  notifications: Notification[];
  setUser: (user: User | null) => void;
  updateUser: (id: string, updates: Partial<User>) => void;
  addAppointment: (appointment: Appointment) => void;
  updateAppointment: (id: string, updates: Partial<Appointment>) => void;
  addNotification: (notification: Notification) => void;
  markNotificationAsRead: (id: string) => void;
  getDoctor: (id: string) => Doctor | undefined;
  getHospital: (id: string) => Hospital | undefined;
  getDoctorsByHospital: (hospitalId: string) => Doctor[];
  getAvailableSlots: (doctorId: string, date: string) => string[];
  getUserAppointments: (userId: string) => Appointment[];
  getDoctorAppointments: (doctorId: string) => Appointment[];
  getUnreadNotifications: (userId: string) => Notification[];
  logout: () => void;
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      currentUser: null,
      hospitals: initialHospitals,
      doctors: initialDoctors,
      appointments: initialAppointments,
      notifications: initialNotifications,
      
      setUser: (user) => {
        if (user) {
          const completeUser = initialUsers.find(u => u.email === user.email);
          if (completeUser) {
            set({ currentUser: completeUser });
            return;
          }
        }
        set({ currentUser: user });
      },
      
      updateUser: (id, updates) => set((state) => ({
        currentUser: state.currentUser?.id === id
          ? { ...state.currentUser, ...updates }
          : state.currentUser,
        doctors: state.doctors.map(d => 
          d.id === id ? { ...d, ...updates } : d
        ),
      })),

      addAppointment: (appointment) =>
        set((state) => ({
          appointments: [...state.appointments, appointment],
        })),
      
      updateAppointment: (id, updates) =>
        set((state) => ({
          appointments: state.appointments.map((apt) =>
            apt.id === id ? { ...apt, ...updates } : apt
          ),
        })),
      
      addNotification: (notification) =>
        set((state) => ({
          notifications: [notification, ...state.notifications],
        })),
      
      markNotificationAsRead: (id) =>
        set((state) => ({
          notifications: state.notifications.map((n) =>
            n.id === id ? { ...n, read: true } : n
          ),
        })),
      
      getDoctor: (id) => get().doctors.find((d) => d.id === id),
      
      getHospital: (id) => get().hospitals.find((h) => h.id === id),
      
      getDoctorsByHospital: (hospitalId) =>
        get().doctors.filter((d) => d.hospital_id === hospitalId),
      
      getAvailableSlots: (doctorId, date) => {
        const doctor = get().doctors.find((d) => d.id === doctorId);
        const appointments = get().appointments.filter(
          (a) => a.doctor_id === doctorId && a.date === date
        );
        
        if (!doctor) return [];
        
        return doctor.available_slots.filter(
          (slot) => !appointments.some((a) => a.time === slot)
        );
      },
      
      getUserAppointments: (userId) =>
        get().appointments.filter((a) => a.patient_id === userId),
      
      getDoctorAppointments: (doctorId) =>
        get().appointments.filter((a) => a.doctor_id === doctorId),
      
      getUnreadNotifications: (userId) =>
        get().notifications.filter((n) => n.user_id === userId && !n.read),
      
      logout: () =>
        set({
          currentUser: null,
          appointments: initialAppointments,
          notifications: initialNotifications,
        }),
    }),
    {
      name: 'swasthya-storage',
    }
  )
);