import React, { useEffect, useState } from 'react';
import { FiPlus, FiEdit2, FiTrash2, FiX, FiUpload } from 'react-icons/fi';
import { getAllCategories, createCategory, updateCategory, deleteCategory, uploadImage } from '../../utils/api';
import toast from 'react-hot-toast';

const empty = { name: '', description: '', image: '', isActive: true, sortOrder: 0 };

export default function AdminCategories() {
  const [cats, setCats]         = useState([]);
  const [loading, setLoading]   = useState(true);
  const [open, setOpen]         = useState(false);
  const [edit, setEdit]         = useState(null);
  const [form, setForm]         = useState(empty);
  const [saving, setSaving]     = useState(false);
  const [uploading, setUploading] = useState(false);

  // eslint-disable-next-line
  useEffect(() => { loadCats(); }, []);

  const loadCats = async () => {
    setLoading(true);
    try { const { data } = await getAllCategories(); setCats(data); }
    catch { toast.error('Failed to load categories'); }
    finally { setLoading(false); }
  };

  const openAdd  = () => { setEdit(null); setForm(empty); setOpen(true); };
  const openEdit = (c) => {
    setEdit(c);
    setForm({ name: c.name, description: c.description || '', image: c.image || '', isActive: c.isActive, sortOrder: c.sortOrder || 0 });
    setOpen(true);
  };
  const close = () => { setOpen(false); setEdit(null); setForm(empty); };

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('image', file);
      const { data } = await uploadImage(fd);
      setForm(x => ({ ...x, image: data.url }));
      toast.success('Image uploaded!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Upload failed');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.name) return toast.error('Name is required');
    setSaving(true);
    try {
      if (edit) { await updateCategory(edit._id, form); toast.success('Category updated!'); }
      else { await createCategory(form); toast.success('Category created!'); }
      loadCats(); close();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Save failed');
    } finally { setSaving(false); }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete "${name}"?`)) return;
    try { await deleteCategory(id); toast.success('Deleted'); loadCats(); }
    catch { toast.error('Delete failed'); }
  };

  return (
    <div>
      <div className="adm-page-hdr">
        <div>
          <h1 className="adm-page-title">Categories</h1>
          <p className="adm-page-sub">{cats.length} categories</p>
        </div>
        <button className="btn btn-primary btn-sm" onClick={openAdd}><FiPlus size={14} /> Add Category</button>
      </div>

      <div className="adm-card">
        <div className="adm-tbl-wrap">
          <table className="adm-tbl">
            <thead><tr><th>Category</th><th>Slug</th><th>Sort</th><th>Status</th><th style={{ textAlign: 'right' }}>Actions</th></tr></thead>
            <tbody>
              {loading ? [...Array(4)].map((_, i) => (
                <tr key={i}>{[...Array(5)].map((_, j) => <td key={j}><div className="skeleton" style={{ height: 13 }} /></td>)}</tr>
              )) : cats.length === 0 ? (
                <tr><td colSpan={5} style={{ textAlign: 'center', padding: 40, color: 'var(--g4)' }}>
                  No categories. <button onClick={openAdd} style={{ color: 'var(--gold-d)', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}>Add one</button>
                </td></tr>
              ) : cats.map(c => (
                <tr key={c._id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      {c.image
                        ? <img src={c.image} alt={c.name} style={{ width: 40, height: 40, borderRadius: 4, objectFit: 'cover' }} />
                        : <div style={{ width: 40, height: 40, background: 'var(--g2)', borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>◈</div>
                      }
                      <span style={{ fontWeight: 600 }}>{c.name}</span>
                    </div>
                  </td>
                  <td style={{ fontFamily: 'monospace', fontSize: 12, color: 'var(--g4)' }}>{c.slug}</td>
                  <td>{c.sortOrder}</td>
                  <td><span className={`status-badge status-badge--${c.isActive ? 'delivered' : 'cancelled'}`}>{c.isActive ? 'Active' : 'Inactive'}</span></td>
                  <td>
                    <div className="adm-tbl-actions">
                      <button className="adm-tbl-btn" onClick={() => openEdit(c)} title="Edit"><FiEdit2 size={13} /></button>
                      <button className="adm-tbl-btn adm-tbl-btn--danger" onClick={() => handleDelete(c._id, c.name)} title="Delete"><FiTrash2 size={13} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {open && (
        <>
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.5)', zIndex: 1100 }} onClick={close} />
          <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 500, maxWidth: 'calc(100vw - 32px)', background: 'var(--white)', borderRadius: 10, padding: 28, zIndex: 1200, boxShadow: 'var(--sh4)', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 22 }}>
              <h2 style={{ fontFamily: 'var(--serif)', fontSize: 20, fontWeight: 500 }}>{edit ? 'Edit' : 'Add'} Category</h2>
              <button onClick={close} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--g4)' }}><FiX size={20} /></button>
            </div>

            <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div className="form-group">
                <label className="form-label">Name *</label>
                <input className="form-input" value={form.name} onChange={e => setForm(x => ({ ...x, name: e.target.value }))} required />
              </div>

              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea className="form-input" rows={2} value={form.description} onChange={e => setForm(x => ({ ...x, description: e.target.value }))} />
              </div>

              <div className="form-group">
                <label className="form-label">Image</label>

                {/* Preview */}
                {form.image && (
                  <div style={{ position: 'relative', marginBottom: 10 }}>
                    <img src={form.image} alt="preview" style={{ width: '100%', height: 160, objectFit: 'cover', borderRadius: 6 }} />
                    <button type="button" onClick={() => setForm(x => ({ ...x, image: '' }))} style={{ position: 'absolute', top: 8, right: 8, width: 26, height: 26, background: 'var(--red)', border: 'none', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                      <FiX size={12} color="white" />
                    </button>
                  </div>
                )}

                {/* Upload button */}
                <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, padding: '12px 16px', border: `2px dashed ${uploading ? 'var(--gold)' : 'var(--g3)'}`, borderRadius: 8, cursor: uploading ? 'wait' : 'pointer', fontSize: 13, color: uploading ? 'var(--gold-d)' : 'var(--g5)', background: uploading ? '#fdf8ec' : 'var(--g1)', transition: 'all .2s' }}>
                  <input type="file" accept="image/jpeg,image/jpg,image/png,image/webp" onChange={handleUpload} style={{ display: 'none' }} disabled={uploading} />
                  {uploading
                    ? <><span className="spinner" style={{ width: 16, height: 16, borderWidth: 2 }} /> Uploading to MongoDB…</>
                    : <><FiUpload size={16} /> Click to upload image from your PC</>
                  }
                </label>
                <p style={{ fontSize: 11, color: 'var(--g4)', marginTop: 5, textAlign: 'center' }}>
                  JPG, PNG, WEBP · Max 5MB · Stored directly in MongoDB
                </p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div className="form-group">
                  <label className="form-label">Sort Order</label>
                  <input type="number" className="form-input" value={form.sortOrder} onChange={e => setForm(x => ({ ...x, sortOrder: Number(e.target.value) }))} />
                </div>
                <div className="form-group">
                  <label className="form-label">Status</label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 10, height: 44, cursor: 'pointer' }}>
                    <button type="button" className={`adm-toggle${form.isActive ? ' on' : ''}`} onClick={() => setForm(x => ({ ...x, isActive: !x.isActive }))}>
                      <div className="adm-toggle-knob" />
                    </button>
                    <span style={{ fontSize: 13 }}>{form.isActive ? 'Active' : 'Inactive'}</span>
                  </label>
                </div>
              </div>

              <div style={{ display: 'flex', gap: 10, marginTop: 6 }}>
                <button type="button" className="btn btn-outline" style={{ flex: 1 }} onClick={close}>Cancel</button>
                <button type="submit" className="btn btn-primary" style={{ flex: 2 }} disabled={saving}>
                  {saving ? <span className="spinner" style={{ width: 16, height: 16, borderWidth: 2, borderTopColor: '#fff' }} /> : edit ? 'Update Category' : 'Create Category'}
                </button>
              </div>
            </form>
          </div>
        </>
      )}
    </div>
  );
}
