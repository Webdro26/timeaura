import { useState, useEffect } from 'react';
import { Plus, Trash2, X, Save } from 'lucide-react';
import AdminSidebar from '../../components/admin/AdminSidebar';
import api from '../../utils/api';
import toast from 'react-hot-toast';

const INIT = { code: '', discountType: 'percentage', discountValue: '', minOrderAmount: '', maxDiscount: '', usageLimit: 100, expiresAt: '' };

export default function AdminCoupons() {
  const [coupons, setCoupons] = useState([]);
  const [form, setForm] = useState(INIT);
  const [editId, setEditId] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const fetch = () => api.get('/coupons').then(r => setCoupons(r.data));
  useEffect(() => { fetch(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...form };
      ['discountValue', 'minOrderAmount', 'maxDiscount', 'usageLimit'].forEach(k => {
        if (payload[k] === '') delete payload[k]; else payload[k] = Number(payload[k]);
      });
      if (!payload.expiresAt) delete payload.expiresAt;

      if (editId) {
        await api.put(`/coupons/${editId}`, payload);
        toast.success('Coupon updated');
      } else {
        await api.post('/coupons', payload);
        toast.success('Coupon created');
      }
      setForm(INIT); setEditId(null); setShowForm(false); fetch();
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
  };

  const handleEdit = (c) => {
    setForm({
      code: c.code, discountType: c.discountType, discountValue: c.discountValue,
      minOrderAmount: c.minOrderAmount || '', maxDiscount: c.maxDiscount || '',
      usageLimit: c.usageLimit, expiresAt: c.expiresAt ? c.expiresAt.slice(0, 10) : '',
    });
    setEditId(c._id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete coupon?')) return;
    try { await api.delete(`/coupons/${id}`); toast.success('Deleted'); fetch(); }
    catch { toast.error('Failed'); }
  };

  const toggleActive = async (id, isActive) => {
    await api.put(`/coupons/${id}`, { isActive: !isActive });
    fetch();
  };

  return (
    <div className="flex min-h-screen" style={{ background: 'var(--bg-main)' }}>
      <AdminSidebar />
      <main className="flex-1 ml-60 p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="heading-display text-2xl">Coupons</h1>
          <button onClick={() => { setForm(INIT); setEditId(null); setShowForm(true); }} className="btn-gold flex items-center gap-2">
            <Plus size={16} /> Add Coupon
          </button>
        </div>

        {showForm && (
          <div className="card-luxury p-6 mb-6">
            <h3 className="label-luxury mb-4">{editId ? 'Edit Coupon' : 'New Coupon'}</h3>
            <form onSubmit={handleSubmit} className="grid grid-cols-3 gap-4">
              {[
                ['Code', 'code', 'SAVE20', 'text'],
                ['Discount Value', 'discountValue', '10', 'number'],
                ['Min Order (₹)', 'minOrderAmount', '500', 'number'],
                ['Max Discount (₹)', 'maxDiscount', '200', 'number'],
                ['Usage Limit', 'usageLimit', '100', 'number'],
                ['Expires At', 'expiresAt', '', 'date'],
              ].map(([label, field, placeholder, type]) => (
                <div key={field}>
                  <label className="label-luxury block mb-2" style={{ fontSize: 10 }}>{label}</label>
                  <input type={type} required={['code', 'discountValue'].includes(field)} value={form[field]}
                    onChange={e => setForm(p => ({ ...p, [field]: e.target.value }))}
                    placeholder={placeholder} className="input-luxury text-sm" />
                </div>
              ))}
              <div>
                <label className="label-luxury block mb-2" style={{ fontSize: 10 }}>Type</label>
                <select value={form.discountType} onChange={e => setForm(p => ({ ...p, discountType: e.target.value }))} className="input-luxury text-sm">
                  <option value="percentage">Percentage (%)</option>
                  <option value="flat">Flat (₹)</option>
                </select>
              </div>
              <div className="flex items-end gap-2 col-span-3">
                <button type="submit" className="btn-gold flex items-center gap-2 py-3"><Save size={14} /> {editId ? 'Update' : 'Create'} Coupon</button>
                <button type="button" onClick={() => { setShowForm(false); setEditId(null); setForm(INIT); }} className="btn-ghost py-3 px-3"><X size={14} /></button>
              </div>
            </form>
          </div>
        )}

        <div className="card-luxury overflow-hidden">
          <table className="w-full text-sm">
            <thead style={{ borderBottom: '1px solid var(--border-soft)' }}>
              <tr>
                {['Code', 'Type', 'Value', 'Min Order', 'Used/Limit', 'Expires', 'Status', 'Actions'].map(h => (
                  <th key={h} className="text-left p-4 label-luxury" style={{ fontSize: 9 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {coupons.map(c => (
                <tr key={c._id} style={{ borderBottom: '1px solid var(--border-soft)' }}>
                  <td className="p-4 font-mono font-bold" style={{ color: 'var(--accent-gold)' }}>{c.code}</td>
                  <td className="p-4 capitalize" style={{ color: 'var(--text-muted)' }}>{c.discountType}</td>
                  <td className="p-4 font-medium" style={{ color: 'var(--text-main)' }}>{c.discountType === 'percentage' ? `${c.discountValue}%` : `₹${c.discountValue}`}</td>
                  <td className="p-4" style={{ color: 'var(--text-muted)' }}>₹{c.minOrderAmount || 0}</td>
                  <td className="p-4" style={{ color: 'var(--text-muted)' }}>{c.usedCount}/{c.usageLimit}</td>
                  <td className="p-4 text-xs" style={{ color: 'var(--text-dim)' }}>{c.expiresAt ? new Date(c.expiresAt).toLocaleDateString('en-IN') : 'No expiry'}</td>
                  <td className="p-4">
                    <button onClick={() => toggleActive(c._id, c.isActive)} className="text-xs px-2 py-1" style={{ color: c.isActive ? '#4ade80' : '#e57373', border: `1px solid ${c.isActive ? '#4ade8033' : '#e5737333'}`, borderRadius: 4 }}>
                      {c.isActive ? 'Active' : 'Inactive'}
                    </button>
                  </td>
                  <td className="p-4">
                    <div className="flex gap-2">
                      <button onClick={() => handleEdit(c)} style={{ color: 'var(--accent-silver)' }}>Edit</button>
                      <button onClick={() => handleDelete(c._id)} style={{ color: '#e57373' }}><Trash2 size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {coupons.length === 0 && <div className="text-center py-12" style={{ color: 'var(--text-muted)' }}>No coupons yet</div>}
        </div>
      </main>
    </div>
  );
}
