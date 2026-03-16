import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import { FiFilter, FiX, FiGrid, FiList } from 'react-icons/fi';
import { getProducts, getCategories } from '../../utils/api';
import ProductCard from '../../components/shop/ProductCard';
import { useCartStore } from '../../store';
import './ShopPage.css';

const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL'];

export default function ShopPage() {
  const { category } = useParams();
  const [searchParams] = useSearchParams();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [total, setTotal]   = useState(0);
  const [pages, setPages]   = useState(1);
  const [loading, setLoading] = useState(true);
  const [gridView, setGrid] = useState(true);
  const [drawer, setDrawer] = useState(false);

  const [filters, setFilters] = useState({
    sort: searchParams.get('sort') || 'newest',
    page: 1,
    minPrice: '',
    maxPrice: '',
    sizes: [],
  });

  const search    = searchParams.get('search')  || '';
  const isNew     = searchParams.get('new')     === 'true';
  const catParam  = searchParams.get('category') || '';

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = {
        sort: filters.sort,
        page: filters.page,
        limit: 12,
        ...(search    && { search }),
        ...(isNew     && { newArrival: true }),
        ...(filters.minPrice && { minPrice: filters.minPrice }),
        ...(filters.maxPrice && { maxPrice: filters.maxPrice }),
      };

      // Resolve category slug → id
      if (category) {
        const catRes = await getCategories();
        const found = catRes.data?.find((c) => c.slug === category);
        if (found) params.category = found._id;
      } else if (catParam) {
        params.category = catParam;
      }

      const { data } = await getProducts(params);
      setProducts(data.products || []);
      setTotal(data.total || 0);
      setPages(data.pages || 1);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [filters, category, search, isNew, catParam]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  useEffect(() => {
    getCategories().then((r) => setCategories(r.data || [])).catch(() => {});
  }, []);

  const set = (key, val) => setFilters((f) => ({ ...f, [key]: val, ...(key !== 'page' && { page: 1 }) }));

  const toggleSize = (sz) => {
    const sizes = filters.sizes.includes(sz)
      ? filters.sizes.filter((s) => s !== sz)
      : [...filters.sizes, sz];
    set('sizes', sizes);
  };

  const resetFilters = () =>
    setFilters({ sort: 'newest', page: 1, minPrice: '', maxPrice: '', sizes: [] });

  const pageTitle = search
    ? `Results for "${search}"`
    : isNew ? 'New Arrivals'
    : category ? category.charAt(0).toUpperCase() + category.slice(1)
    : 'All Collections';

  const Sidebar = () => (
    <div className="sp-sidebar">
      <div className="sp-filter-group">
        <h4>Categories</h4>
        <Link to="/shop" className={`sp-filter-link${!category ? ' active' : ''}`}>All</Link>
        {categories.map((c) => (
          <Link key={c._id} to={`/shop/${c.slug}`} className={`sp-filter-link${category === c.slug ? ' active' : ''}`}>
            {c.name}
          </Link>
        ))}
      </div>

      <div className="sp-filter-group">
        <h4>Price (PKR)</h4>
        <div className="sp-price-row">
          <input
            type="number"
            className="form-input"
            placeholder="Min"
            value={filters.minPrice}
            onChange={(e) => set('minPrice', e.target.value)}
          />
          <span>—</span>
          <input
            type="number"
            className="form-input"
            placeholder="Max"
            value={filters.maxPrice}
            onChange={(e) => set('maxPrice', e.target.value)}
          />
        </div>
      </div>

      <div className="sp-filter-group">
        <h4>Size</h4>
        <div className="sp-sizes">
          {SIZES.map((sz) => (
            <button
              key={sz}
              className={`sp-size-btn${filters.sizes.includes(sz) ? ' active' : ''}`}
              onClick={() => toggleSize(sz)}
            >
              {sz}
            </button>
          ))}
        </div>
      </div>

      <button className="btn btn-outline btn-sm" onClick={resetFilters} style={{ width: '100%' }}>
        Reset Filters
      </button>
    </div>
  );

  return (
    <div className="sp" style={{ paddingTop: 128 }}>
      <div className="container">
        {/* Header */}
        <div className="sp-header">
          <div>
            <h1 className="sp-title">{pageTitle}</h1>
            <p className="sp-count">{total} items</p>
          </div>
          <div className="sp-toolbar">
            <button className="sp-filter-toggle" onClick={() => setDrawer(true)}>
              <FiFilter size={14} /> Filters
            </button>
            <select
              className="form-select sp-sort"
              value={filters.sort}
              onChange={(e) => set('sort', e.target.value)}
            >
              <option value="newest">Newest First</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="popular">Most Popular</option>
            </select>
            <div className="sp-view-toggle">
              <button className={`sp-view-btn${gridView ? ' active' : ''}`} onClick={() => setGrid(true)}><FiGrid size={16} /></button>
              <button className={`sp-view-btn${!gridView ? ' active' : ''}`} onClick={() => setGrid(false)}><FiList size={16} /></button>
            </div>
          </div>
        </div>

        <div className="sp-layout">
          {/* Desktop sidebar */}
          <aside className="sp-sidebar-wrap">
            <Sidebar />
          </aside>

          {/* Products */}
          <div className="sp-content">
            {loading ? (
              <div className={gridView ? 'products-grid' : 'sp-list'}>
                {Array.from({ length: 12 }).map((_, i) => (
                  <div key={i}>
                    <div className="skeleton" style={{ aspectRatio: '3/4', borderRadius: 8 }} />
                    <div className="skeleton" style={{ height: 13, marginTop: 10, width: '70%' }} />
                    <div className="skeleton" style={{ height: 12, marginTop: 6, width: '40%' }} />
                  </div>
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="sp-empty">
                <div className="sp-empty-icon">◎</div>
                <h3>No Products Found</h3>
                <p>Try adjusting your filters.</p>
                <button className="btn btn-outline btn-sm" onClick={resetFilters}>Clear Filters</button>
              </div>
            ) : (
              <div className={gridView ? 'products-grid' : 'sp-list'}>
                {products.map((p) =>
                  gridView
                    ? <ProductCard key={p._id} product={p} />
                    : <ListItem key={p._id} product={p} />
                )}
              </div>
            )}

            {/* Pagination */}
            {pages > 1 && (
              <div className="pagination" style={{ marginTop: 48 }}>
                {Array.from({ length: pages }).map((_, i) => (
                  <button
                    key={i}
                    className={`pagination__btn${filters.page === i + 1 ? ' active' : ''}`}
                    onClick={() => set('page', i + 1)}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile filter drawer */}
      {drawer && <div className="sp-backdrop" onClick={() => setDrawer(false)} />}
      <div className={`sp-drawer${drawer ? ' sp-drawer--open' : ''}`}>
        <div className="sp-drawer-head">
          <strong>Filters</strong>
          <button onClick={() => setDrawer(false)}><FiX size={20} /></button>
        </div>
        <div className="sp-drawer-body">
          <Sidebar />
        </div>
        <div className="sp-drawer-foot">
          <button className="btn btn-outline" style={{ flex: 1 }} onClick={() => { resetFilters(); setDrawer(false); }}>Reset</button>
          <button className="btn btn-primary" style={{ flex: 1 }} onClick={() => setDrawer(false)}>Apply</button>
        </div>
      </div>
    </div>
  );
}

function ListItem({ product }) {
  const addItem = useCartStore((s) => s.addItem);
  return (
    <div className="sp-list-item">
      <img src={product.images?.[0]?.url} alt={product.name} className="sp-list-img" loading="lazy" />
      <div className="sp-list-info">
        <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--gold-d)' }}>{product.category?.name}</span>
        <h3 style={{ fontFamily: 'var(--serif)', fontSize: 20, fontWeight: 500, margin: '6px 0' }}>{product.name}</h3>
        <p style={{ fontSize: 13, color: 'var(--g5)', lineHeight: 1.6 }}>{product.shortDescription}</p>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto' }}>
          <strong style={{ fontSize: 16 }}>PKR {product.price?.toLocaleString()}</strong>
          <button className="btn btn-primary btn-sm" onClick={() => addItem(product, 1)}>Add to Cart</button>
        </div>
      </div>
    </div>
  );
}
