import { useEffect, useState } from 'react';
import io from 'socket.io-client';

const SOCKET_URL = process.env.REACT_APP_SOCKET_URL || 'http://localhost:5000';

export const useSocket = (userId) => {
  const [socket, setSocket] = useState(null);
  const [statusUpdate, setStatusUpdate] = useState(null);

  useEffect(() => {
    if (!userId) return;

    const newSocket = io(SOCKET_URL);

    newSocket.on('connect', () => {
      newSocket.emit('join-notifications', userId);
    });

    newSocket.on('status-updated', (data) => {
      setStatusUpdate(data);
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [userId]);

  return { socket, statusUpdate };
};
