import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, Send, X } from 'lucide-react';
import { useStore } from '../store';
import { format } from 'date-fns';
import { toast } from 'sonner';

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  text: string;
  timestamp: Date;
}

export default function CaretakerChat({ patientId }: { patientId: string }) {
  const { currentUser, users, addMessage } = useStore();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const patient = users.find(u => u.id === patientId);

  useEffect(() => {
    // Simulate fetching messages (replace with real data fetching if available)
    setMessages([
      {
        id: '1',
        senderId: currentUser?.id || '',
        senderName: currentUser?.name || 'Caretaker',
        text: 'How are you feeling today?',
        timestamp: new Date(),
      },
    ]);
    scrollToBottom();
  }, [currentUser, patientId]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = () => {
    if (!newMessage.trim() || !currentUser || !patient) return;

    const message: Message = {
      id: Date.now().toString(),
      senderId: currentUser.id,
      senderName: currentUser.name,
      text: newMessage.trim(),
      timestamp: new Date(),
    };

    setMessages([...messages, message]);
    // Simulate sending to patient (replace with actual backend logic)
    addMessage?.(message);
    setNewMessage('');
    scrollToBottom();
    toast.success('Message sent!');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-2xl shadow-xl p-6 flex flex-col h-[600px]">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">
            Chat with {patient?.name || 'Patient'}
          </h2>
          <button
            onClick={() => window.history.back()}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 bg-gray-50 rounded-lg">
          {messages.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <MessageSquare className="h-12 w-12 mx-auto text-gray-400 mb-2" />
              <p>No messages yet</p>
            </div>
          ) : (
            messages.map((message) => (
              <div
                key={message.id}
                className={`flex flex-col mb-4 ${
                  message.senderId === currentUser?.id ? 'items-end' : 'items-start'
                }`}
              >
                <div
                  className={`max-w-[70%] rounded-lg px-4 py-2 ${
                    message.senderId === currentUser?.id
                      ? 'bg-indigo-500 text-white'
                      : 'bg-gray-200 text-gray-900'
                  }`}
                >
                  <p>{message.text}</p>
                </div>
                <span className="text-xs text-gray-500 mt-1">
                  {message.senderName} • {format(message.timestamp, 'h:mm a')}
                </span>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="mt-4 flex items-center space-x-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Type a message..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
          <button
            onClick={handleSendMessage}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            <Send className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}