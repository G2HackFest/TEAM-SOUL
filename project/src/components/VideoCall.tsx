import React, { useEffect, useRef, useState } from 'react';
import SimplePeer from 'simple-peer';
import { supabase } from '../lib/supabase';
import { useStore } from '../store';
import { Phone, Video, Mic, MicOff, VideoOff, PhoneOff, MessageSquare } from 'lucide-react';

interface VideoCallProps {
  appointmentId: string;
  onEnd: () => void;
}

interface Message {
  id: string;
  sender: string;
  text: string;
  timestamp: Date;
}

export default function VideoCall({ appointmentId, onEnd }: VideoCallProps) {
  const [peer, setPeer] = useState<SimplePeer.Instance | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const { currentUser } = useStore();

  useEffect(() => {
    startCall();
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
      if (peer) {
        peer.destroy();
      }
    };
  }, []);

  async function startCall() {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      });
      setStream(mediaStream);

      if (localVideoRef.current) {
        localVideoRef.current.srcObject = mediaStream;
      }

      const newPeer = new SimplePeer({
        initiator: true,
        stream: mediaStream,
        trickle: false
      });

      newPeer.on('signal', async data => {
        await supabase.from('video_signals').insert({
          appointment_id: appointmentId,
          from_user: currentUser?.id,
          signal: data
        });
      });

      newPeer.on('stream', remoteStream => {
        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = remoteStream;
        }
      });

      setPeer(newPeer);

      // Subscribe to video signals
      const signalSubscription = supabase
        .channel(`video_call_${appointmentId}`)
        .on('postgres_changes', {
          event: 'INSERT',
          schema: 'public',
          table: 'video_signals',
          filter: `appointment_id=eq.${appointmentId}`,
        }, payload => {
          if (payload.new.from_user !== currentUser?.id) {
            newPeer.signal(payload.new.signal);
          }
        })
        .subscribe();

      // Subscribe to chat messages
      const chatSubscription = supabase
        .channel(`chat_${appointmentId}`)
        .on('postgres_changes', {
          event: 'INSERT',
          schema: 'public',
          table: 'chat_messages',
          filter: `appointment_id=eq.${appointmentId}`,
        }, payload => {
          const newMessage = payload.new;
          setMessages(prev => [...prev, {
            id: newMessage.id,
            sender: newMessage.sender_name,
            text: newMessage.message,
            timestamp: new Date(newMessage.created_at)
          }]);
        })
        .subscribe();

      return () => {
        signalSubscription.unsubscribe();
        chatSubscription.unsubscribe();
      };
    } catch (error) {
      console.error('Failed to start video call:', error);
    }
  }

  const toggleAudio = () => {
    if (stream) {
      stream.getAudioTracks().forEach(track => {
        track.enabled = !isAudioEnabled;
      });
      setIsAudioEnabled(!isAudioEnabled);
    }
  };

  const toggleVideo = () => {
    if (stream) {
      stream.getVideoTracks().forEach(track => {
        track.enabled = !isVideoEnabled;
      });
      setIsVideoEnabled(!isVideoEnabled);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !currentUser) return;

    await supabase.from('chat_messages').insert({
      appointment_id: appointmentId,
      sender_id: currentUser.id,
      sender_name: currentUser.name,
      message: newMessage.trim(),
    });

    setNewMessage('');
  };

  const endCall = async () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
    if (peer) {
      peer.destroy();
    }
    
    await supabase
      .from('appointments')
      .update({ status: 'completed' })
      .eq('id', appointmentId);

    onEnd();
  };

  return (
    <div className="fixed inset-0 bg-gray-900 flex">
      <div className="flex-1 flex flex-col">
        <div className="flex-1 grid grid-cols-2 gap-4 p-4">
          <div className="relative">
            <video
              ref={localVideoRef}
              autoPlay
              muted
              playsInline
              className="w-full h-full object-cover rounded-lg"
            />
            <div className="absolute bottom-4 left-4 bg-gray-900 bg-opacity-50 px-3 py-1 rounded-lg">
              <span className="text-white">You</span>
            </div>
          </div>
          <div className="relative">
            <video
              ref={remoteVideoRef}
              autoPlay
              playsInline
              className="w-full h-full object-cover rounded-lg"
            />
            <div className="absolute bottom-4 left-4 bg-gray-900 bg-opacity-50 px-3 py-1 rounded-lg">
              <span className="text-white">Doctor</span>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-800 p-4 flex justify-center space-x-4">
          <button
            onClick={toggleAudio}
            className={`p-4 rounded-full ${
              isAudioEnabled ? 'bg-gray-600' : 'bg-red-500'
            }`}
          >
            {isAudioEnabled ? <Mic className="text-white" /> : <MicOff className="text-white" />}
          </button>
          <button
            onClick={toggleVideo}
            className={`p-4 rounded-full ${
              isVideoEnabled ? 'bg-gray-600' : 'bg-red-500'
            }`}
          >
            {isVideoEnabled ? <Video className="text-white" /> : <VideoOff className="text-white" />}
          </button>
          <button
            onClick={() => setIsChatOpen(!isChatOpen)}
            className="p-4 rounded-full bg-gray-600"
          >
            <MessageSquare className="text-white" />
          </button>
          <button
            onClick={endCall}
            className="p-4 rounded-full bg-red-500"
          >
            <PhoneOff className="text-white" />
          </button>
        </div>
      </div>

      {isChatOpen && (
        <div className="w-80 bg-white border-l border-gray-200 flex flex-col">
          <div className="p-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold">Chat</h3>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex flex-col ${
                  message.sender === currentUser?.name ? 'items-end' : 'items-start'
                }`}
              >
                <div
                  className={`max-w-[80%] rounded-lg px-4 py-2 ${
                    message.sender === currentUser?.name
                      ? 'bg-indigo-500 text-white'
                      : 'bg-gray-100 text-gray-900'
                  }`}
                >
                  <p className="text-sm">{message.text}</p>
                </div>
                <span className="text-xs text-gray-500 mt-1">
                  {message.sender} • {message.timestamp.toLocaleTimeString()}
                </span>
              </div>
            ))}
          </div>
          
          <div className="p-4 border-t border-gray-200">
            <div className="flex space-x-2">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                placeholder="Type a message..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
              <button
                onClick={sendMessage}
                className="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}