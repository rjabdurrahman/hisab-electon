import { useState, useEffect, ReactNode } from 'react';
import Appointment from './pages/Appointment';
import Doctor from './pages/Doctor';
import Client from './pages/Client';
import Sidebar from './components/Sidebar';

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
          <h3 className="text-[13px] font-black uppercase tracking-widest text-[#333333] font-exo2">{title}</h3>
          <button 
            onClick={onClose} 
            className="text-[#94a3b8] hover:text-[#333333] transition-colors text-2xl leading-none"
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
  const [currentPage, setCurrentPage] = useState<'dashboard' | 'appointment' | 'doctor' | 'client'>('dashboard');
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

 
  const renderContent = () => {
    switch (currentPage) {
      case 'appointment':
        return <Appointment />;
      case 'doctor':
        return <Doctor />;
      case 'client':
        return <Client />;
      default:
        return (
          <div className="max-w-7xl w-full mx-auto animate-in fade-in duration-300">
          hello
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen flex bg-canvas transition-colors duration-300">
      <Sidebar currentPage={currentPage} setCurrentPage={setCurrentPage} />
      
      <div className="flex-1 min-h-screen overflow-auto">
        <main className="px-6 py-8 md:px-10">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}

export default App;