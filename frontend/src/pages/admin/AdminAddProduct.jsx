import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FiPlus, FiX, FiTrash2, FiUpload, FiStar } from 'react-icons/fi';
import { createProduct, updateProduct, getProduct, getAllCategories, uploadImage } from '../../utils/api';
import toast from 'react-hot-toast';

const SIZES = ['XS','S','M','L','XL','XXL','3XL','One Size','36','38','40','42','44'];
const COLORS = [
  {n:'Black',c:'#000000'},{n:'White',c:'#FFFFFF'},{n:'Red',c:'#E53E3E'},{n:'Blue',c:'#3182CE'},
  {n:'Green',c:'#38A169'},{n:'Pink',c:'#ED64A6'},{n:'Purple',c:'#805AD5'},{n:'Navy',c:'#2C3E7E'},
  {n:'Maroon',c:'#7B241C'},{n:'Gold',c:'#C9A84C'},{n:'Grey',c:'#718096'},{n:'Beige',c:'#F5DEB3'},
  {n:'Cream',c:'#FFFDD0'},{n:'Orange',c:'#E67E22'},{n:'Teal',c:'#38B2AC'},
];
const emptyV = () => ({ size: '', color: '', colorCode: '#000000', stock: 0, sku: '' });

export default function AdminAddProduct() {
  const { id } = useParams();
  const isEdit = !!id;
  const navigate = useNavigate();
  const [saving, setSaving]     = useState(false);
  const [uploading, setUploading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [tagInput, setTagInput] = useState('');
  const [form, setForm] = useState({
    name: '', description: '', shortDescription: '', price: '', comparePrice: '',
    category: '', fabric: '', careInstructions: '',
    isActive: true, isFeatured: false, isNewArrival: false, isBestseller: false,
    tags: [], images: [], variants: [emptyV()],
  });

  useEffect(() => {
    getAllCategories().then(r => setCategories(r.data || [])).catch(() => {});
    if (isEdit) {
      getProduct(id).then(r => {
        const p = r.data;
        setForm({ ...p, category: p.category?._id || p.category, variants: p.variants?.length ? p.variants : [emptyV()] });
      }).catch(() => toast.error('Failed to load product'));
    }
  }, [id, isEdit]);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleImgUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    setUploading(true);
    try {
      const uploaded = await Promise.all(files.map(async file => {
        const fd = new FormData(); fd.append('image', file);
        const { data } = await uploadImage(fd);
        return { url: data.url, publicId: data.publicId || '', alt: '', isPrimary: false };
      }));
      const newImgs = [...form.images, ...uploaded].map((img, i) => ({ ...img, isPrimary: i === 0 }));
      set('images', newImgs);
      toast.success(`${files.length} image${files.length > 1 ? 's' : ''} uploaded`);
    } catch { toast.error('Upload failed. Check Cloudinary settings.'); }
    finally { setUploading(false); e.target.value = ''; }
  };

  const removeImg = (i) => set('images', form.images.filter((_, idx) => idx !== i).map((img, idx) => ({ ...img, isPrimary: idx === 0 })));
  const setPrimary = (i) => set('images', form.images.map((img, idx) => ({ ...img, isPrimary: idx === i })));
  const addVariant = () => set('variants', [...form.variants, emptyV()]);
  const removeVariant = (i) => set('variants', form.variants.filter((_, idx) => idx !== i));
  const updateVariant = (i, k, v) => {
    const variants = form.variants.map((vr, idx) => {
      if (idx !== i) return vr;
      const updated = { ...vr, [k]: v };
      if (k === 'color') { const m = COLORS.find(c => c.n === v); if (m) updated.colorCode = m.c; }
      return updated;
    });
    set('variants', variants);
  };
  const addTag = (e) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      if (!form.tags.includes(tagInput.trim())) set('tags', [...form.tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.price || !form.category || !form.description) return toast.error('Fill all required fields');
    setSaving(true);
    try {
      const payload = { ...form, price: Number(form.price), comparePrice: form.comparePrice ? Number(form.comparePrice) : null };
      if (isEdit) { await updateProduct(id, payload); toast.success('Product updated!'); }
      else { await createProduct(payload); toast.success('Product created!'); }
      navigate('/admin/products');
    } catch (err) { toast.error(err.response?.data?.message || 'Save failed'); }
    finally { setSaving(false); }
  };

  const Toggle = ({ fieldKey, label }) => (
    <label style={{ display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer' }}>
      <button type="button" className={`adm-toggle${form[fieldKey] ? ' on' : ''}`} onClick={() => set(fieldKey, !form[fieldKey])}>
        <div className="adm-toggle-knob" />
      </button>
      <span style={{ fontSize: 13 }}>{label}</span>
    </label>
  );

  return (
    <div>
      <div className="adm-page-hdr">
        <div><h1 className="adm-page-title">{isEdit ? 'Edit Product' : 'Add New Product'}</h1></div>
      </div>
      <form onSubmit={handleSubmit}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 20, alignItems: 'start' }}>
          {/* Left */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {/* Basic info */}
            <div className="adm-card">
              <div className="adm-card-hdr"><span className="adm-card-title">Basic Information</span></div>
              <div className="adm-card-body" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div className="form-group"><label className="form-label">Product Name *</label><input className="form-input" value={form.name} onChange={e => set('name', e.target.value)} required /></div>
                <div className="form-group"><label className="form-label">Short Description</label><input className="form-input" value={form.shortDescription} onChange={e => set('shortDescription', e.target.value)} placeholder="Brief one-liner" /></div>
                <div className="form-group"><label className="form-label">Full Description *</label><textarea className="form-input" rows={5} value={form.description} onChange={e => set('description', e.target.value)} required /></div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                  <div className="form-group"><label className="form-label">Fabric</label><input className="form-input" value={form.fabric} onChange={e => set('fabric', e.target.value)} placeholder="e.g. Pure Lawn" /></div>
                  <div className="form-group"><label className="form-label">Care Instructions</label><input className="form-input" value={form.careInstructions} onChange={e => set('careInstructions', e.target.value)} placeholder="e.g. Hand wash" /></div>
                </div>
                <div className="form-group">
                  <label className="form-label">Tags (Enter to add)</label>
                  <input className="form-input" placeholder="Add tag…" value={tagInput} onChange={e => setTagInput(e.target.value)} onKeyDown={addTag} />
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 8 }}>
                    {form.tags.map(t => <span key={t} className="badge badge-gray" style={{ cursor: 'pointer' }} onClick={() => set('tags', form.tags.filter(x => x !== t))}>{t} <FiX size={9} /></span>)}
                  </div>
                </div>
              </div>
            </div>

            {/* Images */}
            <div className="adm-card">
              <div className="adm-card-hdr"><span className="adm-card-title">Product Images</span></div>
              <div className="adm-card-body">
                {/* Image grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(110px,1fr))', gap: 10, marginBottom: 12 }}>
                  {form.images.map((img, i) => (
                    <div key={i} style={{ position: 'relative', borderRadius: 6, overflow: 'hidden', border: `2px solid ${img.isPrimary ? 'var(--gold)' : 'var(--g2)'}`, aspectRatio: '3/4' }}>
                      <img src={img.url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      <div style={{ position: 'absolute', top: 5, right: 5, display: 'flex', flexDirection: 'column', gap: 3 }}>
                        <button type="button" onClick={() => setPrimary(i)} style={{ width: 22, height: 22, background: img.isPrimary ? 'var(--gold)' : 'rgba(255,255,255,.9)', border: 'none', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}><FiStar size={10} color={img.isPrimary ? '#000' : '#888'} fill={img.isPrimary ? '#000' : 'none'} /></button>
                        <button type="button" onClick={() => removeImg(i)} style={{ width: 22, height: 22, background: 'var(--red)', border: 'none', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}><FiX size={10} color="white" /></button>
                      </div>
                      {img.isPrimary && <span style={{ position: 'absolute', bottom: 5, left: 5, background: 'var(--gold)', color: '#000', fontSize: 8, fontWeight: 700, padding: '1px 5px', borderRadius: 2 }}>PRIMARY</span>}
                    </div>
                  ))}
                  {/* Upload slot */}
                  {form.images.length < 8 && (
                    <label style={{ border: '2px dashed var(--g3)', borderRadius: 6, aspectRatio: '3/4', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8, cursor: uploading ? 'wait' : 'pointer', color: 'var(--g4)' }}>
                      <input type="file" multiple accept="image/jpeg,image/jpg,image/png,image/webp" onChange={handleImgUpload} style={{ display: 'none' }} disabled={uploading} />
                      {uploading ? <span className="spinner" style={{ width: 22, height: 22 }} /> : <><FiUpload size={18} /><span style={{ fontSize: 11, textAlign: 'center' }}>Upload<br/>from PC</span></>}
                    </label>
                  )}
                </div>
                <p style={{ fontSize: 11, color: 'var(--g4)', marginTop: 6 }}>
                  ★ = primary · JPG/PNG/WEBP · Max 5MB per image · Stored in MongoDB
                </p>
              </div>
            </div>

            {/* Variants */}
            <div className="adm-card">
              <div className="adm-card-hdr">
                <span className="adm-card-title">Variants (Size × Color × Stock)</span>
                <button type="button" className="btn btn-outline btn-sm" onClick={addVariant}><FiPlus size={13} /> Add</button>
              </div>
              <div className="adm-card-body" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {form.variants.map((v, i) => (
                  <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 80px auto', gap: 8, alignItems: 'end', padding: 12, background: 'var(--adm-bg)', borderRadius: 6 }}>
                    {[
                      { label: 'Size', content: <select className="form-select" value={v.size} onChange={e => updateVariant(i, 'size', e.target.value)} style={{ fontSize: 12, padding: '8px 28px 8px 10px' }}><option value="">Select</option>{SIZES.map(s => <option key={s} value={s}>{s}</option>)}</select> },
                      { label: 'Color', content: <select className="form-select" value={v.color} onChange={e => updateVariant(i, 'color', e.target.value)} style={{ fontSize: 12, padding: '8px 28px 8px 10px' }}><option value="">Select</option>{COLORS.map(c => <option key={c.n} value={c.n}>{c.n}</option>)}</select> },
                      { label: 'Color Code', content: <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}><input type="color" value={v.colorCode} onChange={e => updateVariant(i, 'colorCode', e.target.value)} style={{ width: 34, height: 34, padding: 2, border: '1.5px solid var(--g3)', borderRadius: 4, cursor: 'pointer' }} /><input className="form-input" value={v.colorCode} onChange={e => updateVariant(i, 'colorCode', e.target.value)} style={{ fontSize: 11, padding: '8px 10px' }} /></div> },
                      { label: 'Stock', content: <input type="number" min="0" className="form-input" value={v.stock} onChange={e => updateVariant(i, 'stock', Number(e.target.value))} style={{ fontSize: 12, padding: '8px 10px' }} /> },
                    ].map(({ label, content }) => (
                      <div key={label} className="form-group" style={{ gap: 4, margin: 0 }}>
                        <label className="form-label" style={{ fontSize: 9 }}>{label}</label>
                        {content}
                      </div>
                    ))}
                    <button type="button" onClick={() => removeVariant(i)} style={{ width: 34, height: 34, background: '#fde8e6', border: 'none', borderRadius: 6, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--red)' }}><FiTrash2 size={13} /></button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* Pricing */}
            <div className="adm-card">
              <div className="adm-card-hdr"><span className="adm-card-title">Pricing</span></div>
              <div className="adm-card-body" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div className="form-group"><label className="form-label">Sale Price (PKR) *</label><input type="number" min="0" className="form-input" value={form.price} onChange={e => set('price', e.target.value)} required /></div>
                <div className="form-group">
                  <label className="form-label">Compare Price (PKR)</label>
                  <input type="number" min="0" className="form-input" value={form.comparePrice} onChange={e => set('comparePrice', e.target.value)} placeholder="Original price" />
                  {form.price && form.comparePrice && Number(form.comparePrice) > Number(form.price) && <span style={{ fontSize: 12, color: 'var(--green)', marginTop: 4 }}>{Math.round(((form.comparePrice - form.price) / form.comparePrice) * 100)}% discount</span>}
                </div>
              </div>
            </div>

            {/* Category */}
            <div className="adm-card">
              <div className="adm-card-hdr"><span className="adm-card-title">Organization</span></div>
              <div className="adm-card-body">
                <div className="form-group"><label className="form-label">Category *</label>
                  <select className="form-select" value={form.category} onChange={e => set('category', e.target.value)} required>
                    <option value="">Select category</option>
                    {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                  </select>
                </div>
              </div>
            </div>

            {/* Labels */}
            <div className="adm-card">
              <div className="adm-card-hdr"><span className="adm-card-title">Labels</span></div>
              <div className="adm-card-body" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <Toggle fieldKey="isActive"     label="Active (visible in store)" />
                <Toggle fieldKey="isFeatured"   label="Featured on Homepage" />
                <Toggle fieldKey="isNewArrival" label="New Arrival" />
                <Toggle fieldKey="isBestseller" label="Bestseller" />
              </div>
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: 14, fontSize: 13 }} disabled={saving}>
              {saving ? <span className="spinner" style={{ width: 18, height: 18, borderWidth: 2, borderTopColor: '#fff' }} /> : isEdit ? '✓ Update Product' : '✓ Create Product'}
            </button>
            <button type="button" className="btn btn-outline" style={{ width: '100%' }} onClick={() => navigate('/admin/products')}>Cancel</button>
          </div>
        </div>
      </form>
    </div>
  );
}
