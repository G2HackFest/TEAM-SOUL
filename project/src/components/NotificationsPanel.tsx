import React, { useEffect, useState } from 'react';
import { Bell } from 'lucide-react';
import { format } from 'date-fns';
import { useStore } from '../store';
import { supabase } from '../lib/supabase';
import VideoCall from './VideoCall';

export default function NotificationsPanel() {
  const { user, notifications, setNotifications, markNotificationAsRead } = useStore();
  const [showVideoCall, setShowVideoCall] = useState(false);
  const [activeAppointmentId, setActiveAppointmentId] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      fetchNotifications();
      subscribeToNotifications();
    }
  }, [user]);

  async function fetchNotifications() {
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', user?.id)
      .order('created_at', { ascending: false });

    if (!error && data) {
      setNotifications(data);
    }
  }

  function subscribeToNotifications() {
    const subscription = supabase
      .channel('notifications')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${user?.id}`,
        },
        (payload) => {
          setNotifications([payload.new, ...notifications]);
          
          // Auto-open video call for appointment notifications
          if (payload.new.type === 'video_call_start') {
            setActiveAppointmentId(payload.new.appointment_id);
            setShowVideoCall(true);
          }
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }

  async function handleNotificationClick(notification: any) {
    if (notification.type === 'video_call_start') {
      setActiveAppointmentId(notification.appointment_id);
      setShowVideoCall(true);
    }
    await handleMarkAsRead(notification.id);
  }

  async function handleMarkAsRead(id: string) {
    const { error } = await supabase
      .from('notifications')
      .update({ read: true })
      .eq('id', id);

    if (!error) {
      markNotificationAsRead(id);
    }
  }

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <>
      <div className="relative">
        <button className="relative p-2 text-gray-600 hover:text-gray-900">
          <Bell className="h-6 w-6" />
          {unreadCount > 0 && (
            <span className="absolute top-0 right-0 block h-5 w-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </button>

        <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg py-1 z-50">
          <div className="px-4 py-2 border-b border-gray-200">
            <h3 className="text-lg font-semibold">Notifications</h3>
          </div>

          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="px-4 py-2 text-gray-500">No notifications</div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`px-4 py-3 hover:bg-gray-50 cursor-pointer ${
                    !notification.read ? 'bg-blue-50' : ''
                  }`}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">
                        {notification.title}
                      </h4>
                      <p className="text-sm text-gray-600">{notification.message}</p>
                    </div>
                    <span className="text-xs text-gray-500">
                      {format(new Date(notification.created_at), 'PPp')}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {showVideoCall && activeAppointmentId && (
        <VideoCall
          appointmentId={activeAppointmentId}
          onEnd={() => {
            setShowVideoCall(false);
            setActiveAppointmentId(null);
          }}
        />
      )}
    </>
  );
}