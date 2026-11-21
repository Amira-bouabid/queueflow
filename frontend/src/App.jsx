import { useEffect, useState } from 'react';
import { api } from './api';
import { useQueueSocket } from './useQueueSocket';

const LABELS = { waiting: 'En attente', called: 'Appelé', served: 'Servi', cancelled: 'Annulé' };

export default function App() {
  const [queues, setQueues] = useState([]);
  const [queueId, setQueueId] = useState(null);
  const [newQueue, setNewQueue] = useState('');
  const [name, setName] = useState('');
  const { tickets, connected } = useQueueSocket(queueId);

  const loadQueues = () => api.queues().then((q) => {
    setQueues(q);
    if (!queueId && q.length) setQueueId(q[0].id);
  });
  useEffect(() => { loadQueues(); }, []);

  const addQueue = async (e) => {
    e.preventDefault();
    if (!newQueue.trim()) return;
    const q = await api.createQueue(newQueue.trim());
    setNewQueue('');
    await loadQueues();
    setQueueId(q.id);
  };

  const book = async (e) => {
    e.preventDefault();
    if (!name.trim() || !queueId) return;
    await api.createTicket(queueId, name.trim());
    setName('');
  };

  const waiting = tickets.filter((t) => t.status === 'waiting').length;
  const current = tickets.filter((t) => t.status === 'called').at(-1);

  return (
    <div className="app">
      <header>
        <h1>QueueFlow</h1>
        <span className={connected ? 'dot on' : 'dot'}>{connected ? 'Temps réel actif' : 'Hors ligne'}</span>
      </header>

      <section className="card">
        <h2>Files d'attente</h2>
        <div className="tabs">
          {queues.map((q) => (
            <button key={q.id} className={q.id === queueId ? 'tab active' : 'tab'} onClick={() => setQueueId(q.id)}>
              {q.name}
            </button>
          ))}
        </div>
        <form onSubmit={addQueue} className="row">
          <input value={newQueue} onChange={(e) => setNewQueue(e.target.value)} placeholder="Nouvelle file (ex: Guichet 1)" />
          <button>Créer</button>
        </form>
      </section>

      {queueId && (
        <>
          <section className="card stats">
            <div><strong>{current ? `#${current.number}` : '—'}</strong><span>Numéro appelé</span></div>
            <div><strong>{waiting}</strong><span>En attente</span></div>
            <button onClick={() => api.callNext(queueId)}>Appeler le suivant</button>
          </section>

          <section className="card">
            <h2>Réserver une place</h2>
            <form onSubmit={book} className="row">
              <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Votre nom" />
              <button>Prendre un ticket</button>
            </form>
          </section>

          <section className="card">
            <h2>Tickets</h2>
            {tickets.length === 0 && <p className="muted">Aucun ticket pour le moment.</p>}
            <ul className="tickets">
              {tickets.map((t) => (
                <li key={t.id} className={`status-${t.status}`}>
                  <b>#{t.number}</b>
                  <span className="who">{t.customerName}</span>
                  <span className="badge">{LABELS[t.status]}</span>
                  <span className="actions">
                    {t.status === 'called' && <button onClick={() => api.setStatus(t.id, 'served')}>Servi</button>}
                    {(t.status === 'waiting' || t.status === 'called') && (
                      <button className="ghost" onClick={() => api.setStatus(t.id, 'cancelled')}>Annuler</button>
                    )}
                  </span>
                </li>
              ))}
            </ul>
          </section>
        </>
      )}
    </div>
  );
}
