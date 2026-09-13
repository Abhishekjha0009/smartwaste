import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const { user } = useAuth();
  const [socket, setSocket] = useState(null);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    // Connect to Socket.IO server
    const newSocket = io(window.location.origin.replace(':5173', ':5001'), {
      transports: ['websocket', 'polling'],
      autoConnect: true
    });

    newSocket.on('connect', () => {
      console.log('📡 Connected to SmartWaste Real-time Socket Server:', newSocket.id);
      if (user) {
        newSocket.emit('join_rooms', { role: user.role, userId: user.id });
      }
    });

    // Listen for Real-Time Event Notifications
    newSocket.on('complaint:created', (data) => {
      addNotification({ id: Date.now(), type: 'info', title: 'New Waste Report', message: data.message, time: 'Just now' });
    });

    newSocket.on('task:assigned', (data) => {
      addNotification({ id: Date.now(), type: 'warning', title: 'New Task Assigned', message: data.message, time: 'Just now' });
    });

    newSocket.on('complaint:resolved', (data) => {
      addNotification({ id: Date.now(), type: 'success', title: 'Task Resolved!', message: data.message, time: 'Just now' });
    });

    newSocket.on('complaint:updated', (data) => {
      addNotification({ id: Date.now(), type: 'info', title: 'Status Update', message: data.message, time: 'Just now' });
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [user]);

  const addNotification = (notif) => {
    setNotifications((prev) => [notif, ...prev.slice(0, 9)]);
  };

  const removeNotification = (id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  return (
    <SocketContext.Provider value={{ socket, notifications, removeNotification, addNotification }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
