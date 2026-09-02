import { useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAppDispatch } from '@/store/hooks';
import { addNotification } from '@/store/slices/notificationSlice';
import { toast } from 'react-toastify';

export const useSocket = () => {
  const dispatch = useAppDispatch();
  const socketRef = useRef<Socket | null>(null);
  
  const authDataStr = typeof window !== 'undefined' ? localStorage.getItem('admin_auth') : null;

  useEffect(() => {
    if (!authDataStr) return;

    try {
      const authData = JSON.parse(authDataStr);
      const token = authData.token;
      
      if (!token) return;

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://pos-backend-qcky.onrender.com/api';
      // const apiUrl = 'http://localhost:5001/api';
      const baseUrl = apiUrl.replace(/\/api\/?$/, '');

      socketRef.current = io(baseUrl, {
        auth: { token },
      });

      const socket = socketRef.current;

      socket.on('connect', () => {
        console.log('Socket connected');
      });

      socket.on('new_notification', (notification) => {
        dispatch(addNotification(notification));
        
        // Play audio for critical notifications
        if (notification.type === 'CRITICAL' || notification.type === 'EMERGENCY' || notification.title.toLowerCase().includes('critical')) {
          try {
            const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
            const oscillator = audioCtx.createOscillator();
            const gainNode = audioCtx.createGain();
            oscillator.connect(gainNode);
            gainNode.connect(audioCtx.destination);
            oscillator.type = 'sine';
            oscillator.frequency.setValueAtTime(800, audioCtx.currentTime);
            gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
            oscillator.start();
            oscillator.stop(audioCtx.currentTime + 0.3);
          } catch (e) {
            console.error('Audio play failed', e);
          }
          toast.error(`CRITICAL: ${notification.title}`, { autoClose: 5000 });
        } else {
          toast.info(`New Notification: ${notification.title}`);
        }
      });

      return () => {
        socket.disconnect();
      };
    } catch (err) {
      console.error('Socket init error:', err);
    }
  }, [dispatch, authDataStr]);

  return socketRef.current;
};
