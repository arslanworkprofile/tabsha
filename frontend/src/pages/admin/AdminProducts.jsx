import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { FiPlus, FiEdit2, FiTrash2, FiSearch, FiEye } from 'react-icons/fi';
import { getProducts, deleteProduct } from '../../utils/api';
import toast from 'react-hot-toast';

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [total, setTotal]       = useState(0);
  const [loading, setLoading]   = useState(true);
  const [search, setSearch]     = useState('');
  const [page, setPage]         = useState(1);
  const [pages, setPages]       = useState(1);
  const [deleting, setDeleting] = useState(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await getProducts({ page, limit: 15, ...(search && { search }) });
      setProducts(data.products || []);
      setTotal(data.total || 0);
      setPages(data.pages || 1);
    } catch { toast.error('Failed to load products'); }
    finally { setLoading(false); }
  }, [page, search]);

  useEffect(() => { fetch(); }, [fetch]);

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete "${name}"?`)) return;
    setDeleting(id);
    try { await deleteProduct(id); toast.success('Product deleted'); fetch(); }
    catch { toast.error('Delete failed'); }
    finally { setDeleting(null); }
  };

  return (
    <div>
      <div className="adm-page-hdr">
        <div><h1 className="adm-page-title">Products</h1><p className="adm-page-sub">{total} products</p></div>
        <Link to="/admin/products/add" className="btn btn-primary btn-sm"><FiPlus size={14} /> Add Product</Link>
      </div>
      <div className="adm-card">
        <div className="adm-card-hdr">
          <span className="adm-card-title">All Products</span>
          <div className="input-icon-wrap" style={{ width: 240 }}>
            <FiSearch size={14} className="input-icon" />
            <input type="text" className="form-input input-with-icon" style={{ fontSize: 13, padding: '7px 12px 7px 34px' }} placeholder="Search products…" value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} />
          </div>
        </div>
        <div className="adm-tbl-wrap">
          <table className="adm-tbl">
            <thead><tr><th>Product</th><th>Category</th><th>Price</th><th>Stock</th><th>Status</th><th style={{ textAlign: 'right' }}>Actions</th></tr></thead>
            <tbody>
              {loading ? [...Array(8)].map((_, i) => <tr key={i}>{[...Array(6)].map((_, j) => <td key={j}><div className="skeleton" style={{ height: 13 }} /></td>)}</tr>)
                : products.length === 0 ? <tr><td colSpan={6} style={{ textAlign: 'center', padding: 48, color: 'var(--g4)' }}>No products. <Link to="/admin/products/add" style={{ color: 'var(--gold-d)' }}>Add your first one</Link></td></tr>
                : products.map((p) => (
                  <tr key={p._id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div style={{ width: 42, height: 52, borderRadius: 4, overflow: 'hidden', background: 'var(--g2)', flexShrink: 0 }}>
                          {p.images?.[0]?.url && <img src={p.images[0].url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} loading="lazy" />}
                        </div>
                        <div>
                          <div style={{ fontWeight: 600, fontSize: 13 }}>{p.name}</div>
                          <div style={{ fontSize: 11, color: 'var(--g4)' }}>{p.variants?.length || 0} variants</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ fontSize: 12, color: 'var(--adm-muted)' }}>{p.category?.name || '—'}</td>
                    <td>
                      <div style={{ fontWeight: 600, fontSize: 13 }}>PKR {p.price?.toLocaleString()}</div>
                      {p.comparePrice && <div style={{ fontSize: 11, color: 'var(--g4)', textDecoration: 'line-through' }}>PKR {p.comparePrice?.toLocaleString()}</div>}
                    </td>
                    <td style={{ fontWeight: 700, color: p.totalStock === 0 ? 'var(--red)' : p.totalStock < 5 ? 'var(--warn)' : 'var(--green)' }}>{p.totalStock}</td>
                    <td><span className={`status-badge status-badge--${p.isActive ? 'delivered' : 'cancelled'}`}>{p.isActive ? 'Active' : 'Inactive'}</span></td>
                    <td>
                      <div className="adm-tbl-actions">
                        <a href={`/product/${p.slug}`} target="_blank" rel="noreferrer" className="adm-tbl-btn" title="View"><FiEye size={13} /></a>
                        <Link to={`/admin/products/edit/${p._id}`} className="adm-tbl-btn" title="Edit"><FiEdit2 size={13} /></Link>
                        <button className="adm-tbl-btn adm-tbl-btn--danger" title="Delete" onClick={() => handleDelete(p._id, p.name)} disabled={deleting === p._id}>
                          {deleting === p._id ? <span className="spinner" style={{ width: 12, height: 12, borderWidth: 2 }} /> : <FiTrash2 size={13} />}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
        {pages > 1 && (
          <div style={{ padding: '14px 20px', borderTop: '1px solid var(--adm-border)', display: 'flex', justifyContent: 'flex-end' }}>
            <div className="pagination" style={{ marginTop: 0 }}>
              {[...Array(pages)].map((_, i) => <button key={i} className={`pagination__btn${page === i + 1 ? ' active' : ''}`} onClick={() => setPage(i + 1)}>{i + 1}</button>)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
