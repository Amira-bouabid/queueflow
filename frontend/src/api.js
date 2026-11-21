export const API = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const json = (r) => r.json();
const send = (url, method, body) =>
  fetch(API + url, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined,
  }).then((r) => (r.status === 204 ? null : r.json()));

export const api = {
  queues: () => fetch(API + '/queues').then(json),
  createQueue: (name) => send('/queues', 'POST', { name }),
  tickets: (id) => fetch(`${API}/queues/${id}/tickets`).then(json),
  createTicket: (id, customerName) => send(`/queues/${id}/tickets`, 'POST', { customerName }),
  callNext: (id) => send(`/queues/${id}/call-next`, 'POST'),
  setStatus: (id, status) => send(`/tickets/${id}/status`, 'PATCH', { status }),
};
