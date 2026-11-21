import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { API, api } from './api';

// Hook : charge les tickets puis reste synchronisé via WebSocket.
export function useQueueSocket(queueId) {
  const [tickets, setTickets] = useState([]);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    if (!queueId) return;
    api.tickets(queueId).then(setTickets);

    const socket = io(API);
    socket.on('connect', () => {
      setConnected(true);
      socket.emit('queue:join', queueId);
    });
    socket.on('disconnect', () => setConnected(false));
    socket.on('queue:update', (p) => p.queueId === queueId && setTickets(p.tickets));

    return () => {
      socket.emit('queue:leave', queueId);
      socket.disconnect();
    };
  }, [queueId]);

  return { tickets, connected };
}
