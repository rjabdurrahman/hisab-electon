import { useState, useEffect, ReactNode } from 'react';

// --- Types ---
type ProductType = {
  id: number;
  name: string;
  price: number;
  stock: number;
  createdAt: string;
};

type CategoryType = {
  id: number;
  name: string;
  description: string;
};

// --- Modal Component ---
const Modal = ({ isOpen, onClose, title, children }: { 
  isOpen: boolean; 
  onClose: () => void; 
  title: string; 
  children: ReactNode 
}) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-6 border-b border-divider pb-4">
          <h3 className="text-[10px] font-black uppercase tracking-widest text-ink-secondary">{title}</h3>
          <button 
            onClick={onClose} 
            className="text-ink-muted hover:text-ink-primary transition-colors text-2xl leading-none"
          >
            &times;
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};

// --- App ---
function App(): React.JSX.Element {
  const [categories, setCategories] = useState<CategoryType[]>([]);
  const [products, setProducts] = useState<ProductType[]>([]);
  const [loading, setLoading] = useState(true);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  // Modal Visibility
  const [showCatModal, setShowCatModal] = useState(false);
  const [showProdModal, setShowProdModal] = useState(false);

  // Form States
  const [catName, setCatName] = useState('');
  const [prodName, setProdName] = useState('');
  const [prodPrice, setProdPrice] = useState('');
  const [prodStock, setProdStock] = useState('1');
  const [prodCatId, setProdCatId] = useState<string>('');

  const fetchData = async () => {
    try {
      setLoading(true);
      const cats = await window.api.invoke('CATEGORY:LIST');
      setCategories(cats);

      let allProds: ProductType[] = [];
      for (const cat of cats) {
        const catData = await window.api.invoke('INVENTORY:FETCH', { categoryId: cat.id });
        if (catData.products) {
          allProds = [...allProds, ...catData.products];
        }
      }
      setProducts(allProds);

      if (cats.length > 0 && !prodCatId) {
        setProdCatId(cats[0].id.toString());
      }
    } catch (err) {
      console.error('Data Load Error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();

    // Restore saved theme (default: light)
    const savedTheme = localStorage.getItem('app-theme') as 'light' | 'dark' | null;
    const initialTheme = savedTheme || 'light';
    setTheme(initialTheme);
    document.documentElement.classList.toggle('dark', initialTheme === 'dark');
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(nextTheme);
    document.documentElement.classList.toggle('dark', nextTheme === 'dark');
    localStorage.setItem('app-theme', nextTheme);
  };

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!catName.trim()) return;
    await window.api.invoke('CATEGORY:CREATE', { name: catName.trim(), description: 'Added by User' });
    setCatName('');
    setShowCatModal(false);
    await fetchData();
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prodName.trim() || !prodPrice || !prodCatId) return;

    await window.api.invoke('INVENTORY:ADD_PRODUCT', {
      categoryId: parseInt(prodCatId),
      product: { 
        name: prodName.trim(), 
        price: parseFloat(prodPrice), 
        stock: parseInt(prodStock) 
      }
    });

    setProdName(''); 
    setProdPrice(''); 
    setProdStock('1');
    setShowProdModal(false);
    await fetchData();
  };

  const totalValue = products.reduce((acc, p) => acc + (p.price * p.stock), 0);
  const totalStock = products.reduce((acc, p) => acc + p.stock, 0);

  return (
    <div className="min-h-screen px-6 py-10 md:px-16 flex flex-col items-center transition-colors duration-300">
      <div className="w-full max-w-5xl">
        
        {/* Navigation / Header */}
        <nav className="flex items-center justify-between mb-12 border-b border-divider pb-6 w-full">
          <div className="flex items-center">
            <h1 className="font-bold text-2xl text-ink-primary">
              Simple Inventory App
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <button 
              onClick={toggleTheme} 
              className="p-2 border border-divider rounded-md hover:bg-panel transition-all"
            >
              {theme === 'light' ? '🌙' : '☀️'}
            </button>
          </div>
        </nav>

        {/* Statistics Grid */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {[
            { label: 'Inventory Valuation', value: `$${totalValue.toLocaleString()}`, color: 'text-brand' },
            { label: 'Total Stock', value: totalStock.toLocaleString(), color: '' },
            { label: 'Unique Products', value: products.length, color: '' },
            { label: 'Active Categories', value: categories.length, color: '' }
          ].map((stat, i) => (
            <div 
              key={i} 
              className="p-6 border border-divider rounded-lg bg-surface"
            >
              <p className="text-xs font-semibold text-ink-muted mb-2">
                {stat.label}
              </p>
              <p className={`text-2xl font-bold ${stat.color ? stat.color : 'text-ink-primary'}`}>
                {stat.value}
              </p>
            </div>
          ))}
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Categories Section */}
          <aside className="lg:col-span-1 space-y-4">
            <div className="flex items-center justify-between px-2">
              <h2 className="text-lg font-bold text-ink-primary text-sm">Categories</h2>
              <button 
                onClick={() => setShowCatModal(true)}
                className="text-xs font-bold text-brand hover:underline"
              >
                + Add Category
              </button>
            </div>
            
            <div className="border border-divider rounded-xl overflow-hidden bg-surface">
              {categories.length > 0 ? (
                categories.map((cat) => (
                  <div key={cat.id} className="px-5 py-3 border-b border-divider last:border-0 hover:bg-panel transition-colors">
                    <p className="text-sm font-medium text-ink-primary">{cat.name}</p>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center text-xs text-ink-muted italic">No categories</div>
              )}
            </div>
          </aside>

          {/* Products Section */}
          <main className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between px-2">
              <h2 className="text-lg font-bold text-ink-primary text-sm">Inventory Ledger</h2>
              <button 
                onClick={() => setShowProdModal(true)}
                className="btn bg-brand text-white border-transparent hover:bg-brand-hover text-[11px] py-1.5 px-3"
              >
                + Add Product
              </button>
            </div>

            <div className="border border-divider rounded-xl overflow-hidden shadow-sm shadow-slate-200/20 dark:shadow-none bg-surface">
              <div className="px-6 py-3 border-b border-divider bg-panel text-xs font-bold text-ink-secondary">
                Product Details
              </div>

              <div>
                {products.length > 0 ? (
                  products.map((product) => (
                    <div 
                      key={product.id} 
                      className="px-6 py-4 flex items-center justify-between border-b border-divider hover:bg-panel transition-colors last:border-0"
                    >
                      <div className="space-y-0.5">
                        <p className="font-bold text-sm text-ink-primary">{product.name}</p>
                        <p className="text-xs text-ink-muted">
                          Added: {new Date(product.createdAt).toLocaleDateString()}
                        </p>
                      </div>

                      <div className="flex items-center gap-8">
                        <div className="text-right">
                          <p className="text-xs font-bold text-ink-secondary">
                            {product.stock} Units
                          </p>
                          <div className="w-16 h-1 bg-divider rounded mt-1 overflow-hidden">
                            <div 
                              className="h-full bg-brand rounded transition-all"
                              style={{ width: `${Math.min(Math.max(product.stock * 4, 10), 100)}%` }}
                            />
                          </div>
                        </div>

                        <div className="w-16 text-right">
                          <p className="text-sm font-bold text-brand">
                            ${product.price.toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  !loading && (
                    <div className="py-24 text-center text-xs text-ink-muted italic">
                      No products found
                    </div>
                  )
                )}
              </div>
            </div>
          </main>
        </div>

        {/* Footer */}
        <footer className="mt-20 mb-10 text-center pt-8 border-t border-divider">
          <p className="text-xs font-medium text-ink-muted font-mono">
            Powered by Electron • React • Tailwind • SQLite • TypeORM
          </p>
        </footer>
      </div>

      {/* Modals */}
      <Modal isOpen={showCatModal} onClose={() => setShowCatModal(false)} title="New Category">
        <form onSubmit={handleAddCategory} className="space-y-5">
          <div className="space-y-2">
            <label className="block text-[10px] font-black uppercase text-slate-400 ml-1">
              Category Name
            </label>
            <input 
              type="text" 
              placeholder="e.g. Peripherals" 
              value={catName} 
              onChange={(e) => setCatName(e.target.value)}
              className="input" 
              autoFocus 
            />
          </div>
          <button type="submit" className="btn w-full bg-brand hover:bg-brand-hover text-white py-3 text-[11px] border-transparent mt-2">
            Save Category
          </button>
        </form>
      </Modal>

      <Modal isOpen={showProdModal} onClose={() => setShowProdModal(false)} title="New Product">
        <form onSubmit={handleAddProduct} className="space-y-4">
          <div className="space-y-2">
            <label className="block text-[10px] font-black uppercase text-slate-400 ml-1">
              Product Description
            </label>
            <input 
              type="text" 
              placeholder="e.g. MX Master 3S" 
              value={prodName} 
              onChange={(e) => setProdName(e.target.value)}
              className="input" 
              autoFocus 
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-[10px] font-black uppercase text-slate-400 ml-1">
                Price ($)
              </label>
              <input 
                type="number" 
                step="0.01" 
                value={prodPrice} 
                onChange={(e) => setProdPrice(e.target.value)}
                className="input" 
              />
            </div>
            <div className="space-y-2">
              <label className="block text-[10px] font-black uppercase text-slate-400 ml-1">
                Stock
              </label>
              <input 
                type="number" 
                value={prodStock} 
                onChange={(e) => setProdStock(e.target.value)}
                className="input" 
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-[10px] font-black uppercase text-slate-400 ml-1">
              Category
            </label>
            <select 
              value={prodCatId} 
              onChange={(e) => setProdCatId(e.target.value)} 
              className="input"
            >
              {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>

          <button type="submit" className="btn w-full bg-brand hover:bg-brand-hover text-white py-3 text-[11px] border-transparent mt-4">
            Register Product
          </button>
        </form>
      </Modal>
    </div>
  );
}

export default App;