import { useState, useEffect } from 'react';
import { Mail, MailOpen } from 'lucide-react';
import AdminSidebar from '../../components/admin/AdminSidebar';
import api from '../../utils/api';

export default function AdminMessages() {
  const [messages, setMessages] = useState([]);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    api.get('/contact').then(r => setMessages(r.data));
  }, []);

  const markRead = async (id) => {
    await api.put(`/contact/${id}/read`, {});
    setMessages(m => m.map(msg => msg._id === id ? { ...msg, isRead: true } : msg));
  };

  const handleSelect = (msg) => {
    setSelected(msg);
    if (!msg.isRead) markRead(msg._id);
  };

  return (
    <div className="flex min-h-screen" style={{ background: 'var(--bg-main)' }}>
      <AdminSidebar />
      <main className="flex-1 ml-60 p-8">
        <h1 className="heading-display text-2xl mb-8 flex items-center gap-3">
          Messages
          {messages.filter(m => !m.isRead).length > 0 && (
            <span className="badge-gold">{messages.filter(m => !m.isRead).length} new</span>
          )}
        </h1>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="card-luxury overflow-hidden">
            {messages.length === 0 ? (
              <div className="text-center py-16" style={{ color: 'var(--text-muted)' }}>No messages yet</div>
            ) : (
              <div>
                {messages.map(msg => (
                  <button key={msg._id} onClick={() => handleSelect(msg)}
                    className="w-full text-left p-4 transition-colors block"
                    style={{ borderBottom: '1px solid var(--border-soft)', background: selected?._id === msg._id ? 'var(--bg-soft)' : 'transparent' }}
                  >
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5">
                        {msg.isRead ? <MailOpen size={14} style={{ color: 'var(--text-dim)' }} /> : <Mail size={14} style={{ color: 'var(--accent-gold)' }} />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between">
                          <p className="text-sm font-medium" style={{ color: msg.isRead ? 'var(--text-muted)' : 'var(--text-main)' }}>{msg.name}</p>
                          <span className="text-xs" style={{ color: 'var(--text-dim)' }}>{new Date(msg.createdAt).toLocaleDateString('en-IN')}</span>
                        </div>
                        <p className="text-xs" style={{ color: 'var(--text-dim)' }}>{msg.email}</p>
                        <p className="text-xs line-clamp-1 mt-1" style={{ color: 'var(--text-muted)' }}>{msg.subject || msg.message}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {selected ? (
            <div className="card-luxury p-6">
              <h3 className="font-medium mb-1" style={{ color: 'var(--text-main)' }}>{selected.name}</h3>
              <p className="text-sm mb-1" style={{ color: 'var(--accent-gold)' }}>{selected.email}</p>
              {selected.phone && <p className="text-sm mb-3" style={{ color: 'var(--text-muted)' }}>{selected.phone}</p>}
              {selected.subject && <p className="text-sm font-medium mb-3 pb-3" style={{ color: 'var(--text-main)', borderBottom: '1px solid var(--border-soft)' }}>{selected.subject}</p>}
              <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>{selected.message}</p>
              <p className="text-xs mt-4" style={{ color: 'var(--text-dim)' }}>{new Date(selected.createdAt).toLocaleString('en-IN')}</p>
            </div>
          ) : (
            <div className="card-luxury flex items-center justify-center text-sm" style={{ color: 'var(--text-dim)' }}>
              Select a message to view
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
