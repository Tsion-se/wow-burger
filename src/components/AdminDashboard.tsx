import { useState } from 'react';
import { 
  Sparkles, Beef, BookOpen, Layers, CheckSquare, Droplet, Cake, Plus, 
  Edit, Trash2, Settings, LogOut, Search, Check, X, Shield, PlusCircle,
  AlertCircle, LayoutDashboard, Utensils, RefreshCw, Star, Info, Menu, ChevronRight
} from 'lucide-react';
import { Category, MenuItem, RestaurantSettings, AdminTab } from '../types';

interface AdminDashboardProps {
  categories: Category[];
  menuItems: MenuItem[];
  settings: RestaurantSettings;
  onUpdateMenu: (updated: MenuItem[]) => void;
  onUpdateCategories: (updated: Category[]) => void;
  onUpdateSettings: (updated: RestaurantSettings) => void;
  onLogout: () => void;
}

export default function AdminDashboard({
  categories,
  menuItems,
  settings,
  onUpdateMenu,
  onUpdateCategories,
  onUpdateSettings,
  onLogout
}: AdminDashboardProps) {
  // Navigation tabs
  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Search filters
  const [categorySearchQuery, setCategorySearchQuery] = useState('');
  const [itemSearchQuery, setItemSearchQuery] = useState('');
  const [itemCategoryFilter, setItemCategoryFilter] = useState('all');

  // Modal / Form state for Category management
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [categoryFormOpen, setCategoryFormOpen] = useState(false);
  const [categoryNewName, setCategoryNewName] = useState('');
  const [categoryNewIcon, setCategoryNewIcon] = useState('Utensils');

  // Modal / Form state for Menu Item management
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [itemFormOpen, setItemFormOpen] = useState(false);
  const [itemFormValues, setItemFormValues] = useState({
    name: '',
    category: '',
    description: '',
    ingredientsStr: '', // comma-separated
    price: 0,
    image: '',
    available: true,
    featured: false,
    calories: '',
    protein: '',
    carbs: '',
    fat: ''
  });

  // Settings local overrides
  const [localSettings, setLocalSettings] = useState<RestaurantSettings>({ ...settings });
  const [settingsSuccessMsg, setSettingsSuccessMsg] = useState('');

  // Pre-configured premium food backgrounds for fast item creation selection
  const PHOTO_PRESETS = [
    { name: 'Burger Classic', url: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=800' },
    { name: 'Double Cheese', url: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?auto=format&fit=crop&q=80&w=800' },
    { name: 'Chicken Burger', url: 'https://images.unsplash.com/photo-1625813506062-0aeb1d7a094b?auto=format&fit=crop&q=80&w=800' },
    { name: 'French Fries', url: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&q=80&w=800' },
    { name: 'Dessert Sweet', url: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&q=80&w=800' },
    { name: 'Chocolate Shake', url: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&q=80&w=800' }
  ];

  // =====================================
  // CATEGORY ACTIONS
  // =====================================
  const handleOpenCategoryForm = (category: Category | null) => {
    if (category) {
      setEditingCategory(category);
      setCategoryNewName(category.name);
      setCategoryNewIcon(category.icon);
    } else {
      setEditingCategory(null);
      setCategoryNewName('');
      setCategoryNewIcon('Utensils');
    }
    setCategoryFormOpen(true);
  };

  const handleSaveCategory = (e: any) => {
    e.preventDefault();
    if (!categoryNewName.trim()) return;

    if (editingCategory) {
      // Edit existing
      const updated = categories.map(cat => 
        cat.id === editingCategory.id 
          ? { ...cat, name: categoryNewName.trim(), icon: categoryNewIcon }
          : cat
      );
      onUpdateCategories(updated);
    } else {
      // Create new
      const id = categoryNewName.trim().toLowerCase().replace(/\s+/g, '-');
      const newCat: Category = {
        id,
        name: categoryNewName.trim(),
        icon: categoryNewIcon
      };
      
      // Prevent duplicates
      if (categories.some(c => c.id === id)) {
        alert('A category with this name already exists.');
        return;
      }
      onUpdateCategories([...categories, newCat]);
    }
    
    setCategoryFormOpen(false);
    setEditingCategory(null);
  };

  const handleDeleteCategory = (categoryId: string) => {
    if (categoryId === 'all') {
      alert('Cannot delete the root category aggregator.');
      return;
    }
    if (window.confirm(`Are you sure you want to delete this category? Any items belonging to it will lose their category association.`)) {
      const updatedCategories = categories.filter(cat => cat.id !== categoryId);
      // Update items category if they point to the deleted one, set to 'all' or empty
      const updatedItems = menuItems.map(item => 
        item.category === categoryId ? { ...item, category: 'all' } : item
      );
      onUpdateCategories(updatedCategories);
      onUpdateMenu(updatedItems);
    }
  };

  // =====================================
  // MENU ITEM ACTIONS
  // =====================================
  const handleOpenItemForm = (item: MenuItem | null) => {
    if (item) {
      setEditingItem(item);
      setItemFormValues({
        name: item.name,
        category: item.category,
        description: item.description,
        ingredientsStr: (item.ingredients || []).join(', '),
        price: item.price,
        image: item.image,
        available: item.available,
        featured: item.featured,
        calories: item.calories || '',
        protein: item.protein || '',
        carbs: item.carbs || '',
        fat: item.fat || ''
      });
    } else {
      setEditingItem(null);
      setItemFormValues({
        name: '',
        category: categories[1]?.id || 'burgers', // Fallback
        description: '',
        ingredientsStr: '',
        price: 350,
        image: PHOTO_PRESETS[0].url,
        available: true,
        featured: false,
        calories: '550 kcal',
        protein: '25g',
        carbs: '38g',
        fat: '20g'
      });
    }
    setItemFormOpen(true);
  };

  const handleSaveItem = (e: any) => {
    e.preventDefault();
    const { name, category, description, ingredientsStr, price, image, available, featured, calories, protein, carbs, fat } = itemFormValues;
    if (!name.trim()) return;

    const ingredients = ingredientsStr
      .split(',')
      .map(i => i.trim())
      .filter(i => i !== '');

    const productData = {
      name: name.trim(),
      category,
      description: description.trim() || 'Premium item fresh from Addis kitchen.',
      ingredients,
      price: Number(price) || 0,
      image: image.trim() || PHOTO_PRESETS[0].url,
      available,
      featured,
      calories: calories.trim(),
      protein: protein.trim(),
      carbs: carbs.trim(),
      fat: fat.trim()
    };

    if (editingItem) {
      // Edit mode
      const updatedList = menuItems.map(it => 
        it.id === editingItem.id 
          ? { ...it, ...productData }
          : it
      );
      onUpdateMenu(updatedList);
    } else {
      // Create mode
      const newItem: MenuItem = {
        id: Date.now().toString(),
        ...productData
      };
      onUpdateMenu([...menuItems, newItem]);
    }

    setItemFormOpen(false);
    setEditingItem(null);
  };

  const handleDeleteItem = (itemId: string) => {
    if (window.confirm('Delete this recipe item from the menu permanently?')) {
      const updated = menuItems.filter(i => i.id !== itemId);
      onUpdateMenu(updated);
    }
  };

  const toggleItemAvailability = (itemId: string) => {
    const updated = menuItems.map(item => 
      item.id === itemId ? { ...item, available: !item.available } : item
    );
    onUpdateMenu(updated);
  };

  const toggleItemFeatured = (itemId: string) => {
    const updated = menuItems.map(item => 
      item.id === itemId ? { ...item, featured: !item.featured } : item
    );
    onUpdateMenu(updated);
  };

  // =====================================
  // SETTINGS SAVE
  // =====================================
  const handleSaveSettings = (e: any) => {
    e.preventDefault();
    onUpdateSettings(localSettings);
    setSettingsSuccessMsg('Restaurant configuration written inside LocalStorage successfully!');
    setTimeout(() => setSettingsSuccessMsg(''), 4000);
  };

  // Filter lists based on search controls
  const filteredCategories = categories.filter(cat => 
    cat.name.toLowerCase().includes(categorySearchQuery.toLowerCase())
  );

  const filteredMenuItems = menuItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(itemSearchQuery.toLowerCase()) || 
                          item.description.toLowerCase().includes(itemSearchQuery.toLowerCase());
    const matchesCategory = itemCategoryFilter === 'all' || item.category === itemCategoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 md:py-8 grid grid-cols-1 md:grid-cols-12 gap-8 text-white">
      
      {/* Visual Header Banner for Admin Context */}
      <div className="md:col-span-12 flex items-center justify-between bg-emerald-600/10 border border-emerald-500/20 rounded-2xl p-4 mb-2">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-400">
            <Shield className="w-5.5 h-5.5" />
          </div>
          <div>
            <h1 className="text-sm font-sans font-extrabold uppercase tracking-wide text-white">Management Console</h1>
            <p className="text-[#BDBDBD] text-xs font-sans">Wow Burger Bole Back-office Console • Cloud Connected</p>
          </div>
        </div>

        {/* Mobile menu trigger */}
        <button 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 rounded-lg bg-[#1E1E1E] border border-[#2A2A2A] text-white"
        >
          <Menu className="w-5 h-5" />
        </button>
      </div>

      {/* ========================================================= */}
      {/* SIDEBAR NAVIGATION: Desktop Permanent, Mobile Drawer */}
      {/* ========================================================= */}
      <div className={`${
        mobileMenuOpen ? 'block' : 'hidden'
      } md:block md:col-span-3 space-y-2`}>
        
        <div className="bg-[#1E1E1E] border border-[#2A2A2A] rounded-2xl p-4 space-y-1.5 shadow-lg">
          <p className="text-[10px] text-[#BDBDBD]/60 font-mono uppercase tracking-wider mb-2 px-2">Navigation Panel</p>
          
          <button
            onClick={() => { setActiveTab('dashboard'); setMobileMenuOpen(false); }}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-sans font-bold tracking-wide transition-all ${
              activeTab === 'dashboard' 
                ? 'bg-[#FF6B00] text-white' 
                : 'text-[#BDBDBD] hover:text-white hover:bg-[#2A2A2A]'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Dashboard Stats</span>
          </button>

          <button
            onClick={() => { setActiveTab('categories'); setMobileMenuOpen(false); }}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-sans font-bold tracking-wide transition-all ${
              activeTab === 'categories' 
                ? 'bg-[#FF6B00] text-white' 
                : 'text-[#BDBDBD] hover:text-white hover:bg-[#2A2A2A]'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Categories</span>
          </button>

          <button
            onClick={() => { setActiveTab('items'); setMobileMenuOpen(false); }}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-sans font-bold tracking-wide transition-all ${
              activeTab === 'items' 
                ? 'bg-[#FF6B00] text-white' 
                : 'text-[#BDBDBD] hover:text-white hover:bg-[#2A2A2A]'
            }`}
          >
            <Beef className="w-4 h-4" />
            <span>Menu Items</span>
          </button>

          <button
            onClick={() => { setActiveTab('settings'); setMobileMenuOpen(false); }}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-sans font-bold tracking-wide transition-all ${
              activeTab === 'settings' 
                ? 'bg-[#FF6B00] text-white' 
                : 'text-[#BDBDBD] hover:text-white hover:bg-[#2A2A2A]'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>Store Settings</span>
          </button>
        </div>

        {/* Logout area */}
        <div className="bg-[#1E1E1E] border border-[#2A2A2A] rounded-2xl p-3">
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-2.5 justify-center px-4 py-2 text-xs font-sans font-bold text-red-400 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 rounded-xl transition-all"
          >
            <LogOut className="w-4 h-4" />
            <span>Exit Workspace</span>
          </button>
        </div>
      </div>

      {/* ========================================================= */}
      {/* MAIN ADMIN WORKSPACE WORKFLOW PANELS */}
      {/* ========================================================= */}
      <div className="md:col-span-9 space-y-6">

        {/* 1. DASHBOARD STATS OVERVIEWS */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6 animate-fade-in">
            {/* Upper stats widget grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              
              {/* Stat 1: Categories */}
              <div className="bg-[#1E1E1E] border border-[#2A2A2A] rounded-2xl p-4 relative overflow-hidden">
                <span className="text-[#BDBDBD] text-[10px] font-mono uppercase tracking-widest block mb-1">Categories</span>
                <span className="text-white text-3xl font-sans font-black block">{categories.length - 1}</span>
                <div className="absolute right-3 bottom-3 text-[#BDBDBD]/10">
                  <Layers className="w-12 h-12" />
                </div>
              </div>

              {/* Stat 2: Menu Items */}
              <div className="bg-[#1E1E1E] border border-[#2A2A2A] rounded-2xl p-4 relative overflow-hidden">
                <span className="text-[#BDBDBD] text-[10px] font-mono uppercase tracking-widest block mb-1">Menu Items</span>
                <span className="text-white text-3xl font-sans font-black block">{menuItems.length}</span>
                <div className="absolute right-3 bottom-3 text-[#BDBDBD]/10">
                  <Utensils className="w-12 h-12" />
                </div>
              </div>

              {/* Stat 3: Available Items */}
              <div className="bg-[#1E1E1E] border border-[#2A2A2A] rounded-2xl p-4 relative overflow-hidden">
                <span className="text-[#BDBDBD] text-[10px] font-mono uppercase tracking-widest block mb-1">Available</span>
                <span className="text-emerald-400 text-3xl font-sans font-black block">
                  {menuItems.filter(i => i.available).length}
                </span>
                <div className="absolute right-3 bottom-3 text-[#BDBDBD]/10">
                  <CheckSquare className="w-12 h-12" />
                </div>
              </div>

              {/* Stat 4: Featured Items */}
              <div className="bg-[#1E1E1E] border border-[#2A2A2A] rounded-2xl p-4 relative overflow-hidden">
                <span className="text-[#BDBDBD] text-[10px] font-mono uppercase tracking-widest block mb-1">Featured</span>
                <span className="text-amber-400 text-3xl font-sans font-black block">
                  {menuItems.filter(i => i.featured).length}
                </span>
                <div className="absolute right-3 bottom-3 text-[#BDBDBD]/10">
                  <Star className="w-12 h-12" />
                </div>
              </div>

            </div>

            {/* Quick overview of recipe system list */}
            <div className="bg-[#1E1E1E] border border-[#2A2A2A] rounded-3xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-white font-sans font-extrabold text-base">Quick-Browse Dishes</h2>
                  <p className="text-[#BDBDBD] text-xs">Verify basic parameters and fast availability states.</p>
                </div>
                <button
                  onClick={() => setActiveTab('items')}
                  className="text-xs text-[#FF6B00] hover:underline font-semibold font-sans flex items-center gap-1"
                >
                  Configure All <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-sans">
                  <thead>
                    <tr className="border-b border-[#2A2A2A] text-[#BDBDBD] uppercase font-mono tracking-wider">
                      <th className="pb-3 font-normal">Dish Name</th>
                      <th className="pb-3 font-normal">Category</th>
                      <th className="pb-3 font-normal">Price</th>
                      <th className="pb-3 font-normal">State</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#2A2A2A]/50">
                    {menuItems.slice(0, 6).map(item => (
                      <tr key={item.id} className="hover:bg-[#2A2A2A]/20">
                        <td className="py-2.5 font-semibold text-white">{item.name}</td>
                        <td className="py-2.5 text-[#BDBDBD] font-mono capitalize">{item.category.replace('-', ' ')}</td>
                        <td className="py-2.5 font-semibold text-[#FF6B00] font-mono">{item.price} ETB</td>
                        <td className="py-2.5">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            item.available ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'
                          }`}>
                            {item.available ? 'In Stock' : 'Sold Out'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* 2. CATEGORY MANAGEMENT TABLE */}
        {activeTab === 'categories' && (
          <div className="space-y-4 animate-fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#1E1E1E] border border-[#2A2A2A] rounded-2xl p-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#BDBDBD]" />
                <input
                  type="text"
                  placeholder="Search existing categories..."
                  value={categorySearchQuery}
                  onChange={(e) => setCategorySearchQuery(e.target.value)}
                  className="w-full bg-[#121212] border border-[#2A2A2A] rounded-xl pl-9 pr-4 py-2 text-white placeholder-[#BDBDBD]/50 text-xs focus:border-[#FF6B00] outline-none transition"
                />
              </div>

              <button
                onClick={() => handleOpenCategoryForm(null)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#FF6B00] hover:bg-[#FF6B00]/90 text-white font-sans font-bold text-xs shadow-lg transition-transform active:scale-95 self-start sm:self-auto"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Add Category</span>
              </button>
            </div>

            {/* Main Table card */}
            <div className="bg-[#1E1E1E] border border-[#2A2A2A] rounded-3xl overflow-hidden p-6">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-sans">
                  <thead>
                    <tr className="border-b border-[#2A2A2A] text-[#BDBDBD] uppercase font-mono tracking-wider">
                      <th className="pb-3 text-[10px] font-normal">Ident Code</th>
                      <th className="pb-3 text-[10px] font-normal">Display Title</th>
                      <th className="pb-3 text-[10px] font-normal">Icon Style</th>
                      <th className="pb-3 text-[10px] font-normal text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#2A2A2A]/50">
                    {filteredCategories.map(cat => (
                      <tr key={cat.id} className="hover:bg-[#2A2A2A]/20">
                        <td className="py-3 font-mono text-[#BDBDBD]">{cat.id}</td>
                        <td className="py-3 font-semibold text-white">{cat.name}</td>
                        <td className="py-3 font-mono text-[#FF6B00]">{cat.icon}</td>
                        <td className="py-3 text-right space-x-1.5">
                          {cat.id !== 'all' ? (
                            <>
                              <button
                                onClick={() => handleOpenCategoryForm(cat)}
                                className="p-1.5 rounded-lg bg-[#2A2A2A] text-white hover:text-amber-400 hover:bg-[#2A2A2A]/80 transition"
                                title="Edit Title"
                              >
                                <Edit className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleDeleteCategory(cat.id)}
                                className="p-1.5 rounded-lg bg-[#2A2A2A] text-white hover:text-red-500 hover:bg-red-500/10 transition"
                                title="Delete Category"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </>
                          ) : (
                            <span className="text-[10px] text-[#BDBDBD]/40 font-mono">System Root</span>
                          )}
                        </td>
                      </tr>
                    ))}
                    {filteredCategories.length === 0 && (
                      <tr>
                        <td colSpan={4} className="py-6 text-center text-[#BDBDBD] font-sans">
                          No restaurant categories match your search filters.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Category Edit / Add Modal Form */}
            {categoryFormOpen && (
              <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
                <div className="bg-[#1E1E1E] border border-[#2A2A2A] rounded-2xl max-w-sm w-full p-6 space-y-4 shadow-2xl relative">
                  
                  <button 
                    onClick={() => setCategoryFormOpen(false)}
                    className="absolute top-4 right-4 text-[#BDBDBD] hover:text-white"
                  >
                    <X className="w-5 h-5" />
                  </button>

                  <h3 className="text-white font-sans font-bold text-sm">
                    {editingCategory ? 'Modify Category' : 'Create Custom Category'}
                  </h3>

                  <form onSubmit={handleSaveCategory} className="space-y-4">
                    <div>
                      <label className="block text-[11px] font-mono uppercase tracking-wider text-[#BDBDBD] mb-1">
                        Category Display Name
                      </label>
                      <input
                        type="text"
                        value={categoryNewName}
                        onChange={(e) => setCategoryNewName(e.target.value)}
                        placeholder="e.g. Traditional Bites"
                        className="w-full bg-[#121212] border border-[#2A2A2A] rounded-lg p-2.5 text-white font-sans text-xs focus:border-[#FF6B00] outline-none"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-mono uppercase tracking-wider text-[#BDBDBD] mb-1">
                        Visual Icon Preset
                      </label>
                      <select
                        value={categoryNewIcon}
                        onChange={(e) => setCategoryNewIcon(e.target.value)}
                        className="w-full bg-[#121212] border border-[#2A2A2A] rounded-lg p-2.5 text-white font-sans text-xs focus:border-[#FF6B00] outline-none"
                      >
                        <option value="Beef">Beef (Burger Style)</option>
                        <option value="CheckSquare">CheckSquare (Square style)</option>
                        <option value="Container">Container (Fries layout)</option>
                        <option value="CupSoda">CupSoda (Milkshake)</option>
                        <option value="Droplet">Droplet (Soft Drinks)</option>
                        <option value="Cake">Cake (Dessert)</option>
                        <option value="Sparkles">Sparkles Icon</option>
                        <option value="Utensils">Utensils / Plate</option>
                      </select>
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-[#FF6B00] hover:bg-[#FF6B00]/95 text-white py-2 rounded-lg font-sans font-bold text-xs transition"
                    >
                      {editingCategory ? 'Update Changes' : 'Publish Category'}
                    </button>
                  </form>
                </div>
              </div>
            )}

          </div>
        )}

        {/* 3. MENU ITEM MANAGEMENT PANEL WITH MULTI-FIELD FORMS */}
        {activeTab === 'items' && (
          <div className="space-y-4 animate-fade-in">
            {/* Control Bar: Search, Category Filter, and Add Button */}
            <div className="flex flex-col lg:flex-row gap-3 bg-[#1E1E1E] border border-[#2A2A2A] rounded-2xl p-4">
              <div className="relative flex-1 min-w-[200px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#BDBDBD]" />
                <input
                  type="text"
                  placeholder="Search recipes, ingredients..."
                  value={itemSearchQuery}
                  onChange={(e) => setItemSearchQuery(e.target.value)}
                  className="w-full bg-[#121212] border border-[#2A2A2A] rounded-xl pl-9 pr-4 py-2 text-white placeholder-[#BDBDBD]/50 text-xs focus:border-[#FF6B00] outline-none"
                />
              </div>

              {/* Category Filter selector */}
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-[#BDBDBD] font-mono uppercase">Category:</span>
                <select
                  value={itemCategoryFilter}
                  onChange={(e) => setItemCategoryFilter(e.target.value)}
                  className="bg-[#121212] border border-[#2A2A2A] rounded-xl text-[#BDBDBD] text-xs px-3 py-2 outline-none"
                >
                  <option value="all">Display All Categories</option>
                  {categories.filter(c => c.id !== 'all').map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>

              <button
                onClick={() => handleOpenItemForm(null)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#FF6B00] hover:bg-[#FF6B00]/90 text-white font-sans font-bold text-xs shadow-lg transition duration-200 active:scale-95 lg:ml-auto"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Publish New Dish</span>
              </button>
            </div>

            {/* Menu Items table list representation */}
            <div className="bg-[#1E1E1E] border border-[#2A2A2A] rounded-3xl overflow-hidden p-6">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-sans">
                  <thead>
                    <tr className="border-b border-[#2A2A2A] text-[#BDBDBD] uppercase font-mono tracking-wider">
                      <th className="pb-3 text-[10px] font-normal">Photo</th>
                      <th className="pb-3 text-[10px] font-normal">Dish Name</th>
                      <th className="pb-3 text-[10px] font-normal">Category</th>
                      <th className="pb-3 text-[10px] font-normal text-center">Featured</th>
                      <th className="pb-3 text-[10px] font-normal">Price</th>
                      <th className="pb-3 text-[10px] font-normal">Availability</th>
                      <th className="pb-3 text-[10px] font-normal text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#2A2A2A]/50">
                    {filteredMenuItems.map(item => (
                      <tr key={item.id} className="hover:bg-[#2A2A2A]/20">
                        {/* Thumbnail image */}
                        <td className="py-2.5">
                          <img 
                            src={item.image} 
                            alt={item.name} 
                            className="w-10 h-10 rounded-lg object-cover bg-[#121212]"
                            referrerPolicy="no-referrer"
                            onError={(e) => {
                              e.currentTarget.src = PHOTO_PRESETS[0].url;
                            }}
                          />
                        </td>
                        
                        {/* Title and Ingredients count */}
                        <td className="py-2.5 font-bold text-white">
                          <div className="flex flex-col">
                            <span>{item.name}</span>
                            <span className="text-[9.5px] text-[#BDBDBD] font-mono font-normal">
                              {(item.ingredients || []).length} ingredients listed
                            </span>
                          </div>
                        </td>

                        {/* Category */}
                        <td className="py-2.5 text-[#BDBDBD] font-mono capitalize">
                          {item.category.replace('-', ' ')}
                        </td>

                        {/* Star Featured */}
                        <td className="py-2.5 text-center">
                          <button
                            id={`item-featured-toggle-${item.id}`}
                            type="button"
                            onClick={() => toggleItemFeatured(item.id)}
                            className={`p-1.5 rounded-full transition-colors ${
                              item.featured ? 'text-amber-500 bg-amber-500/10' : 'text-[#BDBDBD]/40 hover:text-amber-400'
                            }`}
                          >
                            <Star className={`w-3.5 h-3.5 ${item.featured ? 'fill-current' : ''}`} />
                          </button>
                        </td>

                        {/* Price formatted */}
                        <td className="py-2.5 font-mono text-[#FF6B00] font-bold">
                          {item.price} ETB
                        </td>

                        {/* Availability Toggle */}
                        <td className="py-2.5">
                          <button
                            id={`item-availability-toggle-${item.id}`}
                            type="button"
                            onClick={() => toggleItemAvailability(item.id)}
                            className={`px-2 py-1 rounded-md text-[10px] font-mono tracking-wide transition-colors ${
                              item.available 
                                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                                : 'bg-red-500/10 text-red-400 border border-red-500/20'
                            }`}
                          >
                            {item.available ? '● In Stock' : '○ Sold Out'}
                          </button>
                        </td>

                        {/* Actions: Edit, Delete */}
                        <td className="py-2.5 text-right space-x-1">
                          <button
                            id={`item-edit-btn-${item.id}`}
                            onClick={() => handleOpenItemForm(item)}
                            className="p-1.5 rounded-lg bg-[#2A2A2A] text-white hover:text-amber-400 hover:bg-[#2A2A2A]/80 transition"
                            title="Edit Recipes"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            id={`item-delete-btn-${item.id}`}
                            onClick={() => handleDeleteItem(item.id)}
                            className="p-1.5 rounded-lg bg-[#2A2A2A] text-white hover:text-red-500 hover:bg-red-500/10 transition"
                            title="Delete Item"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                    {filteredMenuItems.length === 0 && (
                      <tr>
                        <td colSpan={7} className="py-8 text-center text-[#BDBDBD] font-sans">
                          No recipes or beverages fit your current filtered view.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Menu Item Form Modal (Rich Custom Details UI Setup) */}
            {itemFormOpen && (
              <div className="fixed inset-0 z-50 bg-black/85 flex items-center justify-center p-4 overflow-y-auto">
                <div className="bg-[#1E1E1E] border border-[#2A2A2A] rounded-2xl max-w-2xl w-full p-6 md:p-8 space-y-4 shadow-2xl relative my-8">
                  
                  <button 
                    onClick={() => setItemFormOpen(false)}
                    className="absolute top-4 right-4 text-[#BDBDBD] hover:text-white"
                  >
                    <X className="w-5 h-5" />
                  </button>

                  <h3 className="text-white font-sans font-bold text-sm">
                    {editingItem ? `Edit Recipe: ${editingItem.name}` : 'Publish New Dish to Bole Menu'}
                  </h3>

                  <form onSubmit={handleSaveItem} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    
                    {/* Name */}
                    <div className="md:col-span-1">
                      <label className="block text-[10px] font-mono uppercase tracking-wider text-[#BDBDBD] mb-1">
                        Dish/Beverage Title
                      </label>
                      <input
                        type="text"
                        value={itemFormValues.name}
                        onChange={(e) => setItemFormValues({ ...itemFormValues, name: e.target.value })}
                        placeholder="Double Bole Cheesebury"
                        className="w-full bg-[#121212] border border-[#2A2A2A] rounded-lg p-2 text-white font-sans text-xs focus:border-[#FF6B00] outline-none"
                        required
                      />
                    </div>

                    {/* Category Selection */}
                    <div className="md:col-span-1">
                      <label className="block text-[10px] font-mono uppercase tracking-wider text-[#BDBDBD] mb-1">
                        Menu Category
                      </label>
                      <select
                        value={itemFormValues.category}
                        onChange={(e) => setItemFormValues({ ...itemFormValues, category: e.target.value })}
                        className="w-full bg-[#121212] border border-[#2A2A2A] rounded-lg p-2.5 text-[#BDBDBD] font-sans text-xs focus:border-[#FF6B00] outline-none"
                      >
                        {categories.filter(c => c.id !== 'all').map(cat => (
                          <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}
                      </select>
                    </div>

                    {/* Price in ETB */}
                    <div className="md:col-span-1">
                      <label className="block text-[10px] font-mono uppercase tracking-wider text-[#BDBDBD] mb-1">
                        Pricing (ETB)
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={itemFormValues.price}
                        onChange={(e) => setItemFormValues({ ...itemFormValues, price: Number(e.target.value) })}
                        placeholder="450"
                        className="w-full bg-[#121212] border border-[#2A2A2A] rounded-lg p-2 text-white font-mono text-xs focus:border-[#FF6B00] outline-none"
                        required
                      />
                    </div>

                    {/* Photo URL */}
                    <div className="md:col-span-1">
                      <label className="block text-[10px] font-mono uppercase tracking-wider text-[#BDBDBD] mb-1">
                        Food Photo (Unsplash URL)
                      </label>
                      <input
                        type="url"
                        value={itemFormValues.image}
                        onChange={(e) => setItemFormValues({ ...itemFormValues, image: e.target.value })}
                        placeholder="https://images.unsplash.com/..."
                        className="w-full bg-[#121212] border border-[#2A2A2A] rounded-lg p-2 text-white font-sans text-xs focus:border-[#FF6B00] outline-none"
                        required
                      />
                    </div>

                    {/* Quick Preset Image Selectors for convenient prototyping */}
                    <div className="md:col-span-2">
                      <label className="block text-[10px] font-mono uppercase tracking-wider text-[#BDBDBD]/60 mb-1.5">
                        Or Pick High-Quality Photo Preset:
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {PHOTO_PRESETS.map((preset, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => setItemFormValues({ ...itemFormValues, image: preset.url })}
                            className={`px-2 py-1 text-[9.5px] rounded-md font-sans border transition-colors ${
                              itemFormValues.image === preset.url 
                                ? 'bg-[#FF6B00] text-white border-[#FF6B00]' 
                                : 'bg-[#2A2A2A] text-[#BDBDBD] border-[#2A2A2A] hover:bg-[#2A2A2A]/80'
                            }`}
                          >
                            {preset.name}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Description */}
                    <div className="md:col-span-2">
                      <label className="block text-[10px] font-mono uppercase tracking-wider text-[#BDBDBD] mb-1">
                        Item Description (For Digital Menu)
                      </label>
                      <textarea
                        value={itemFormValues.description}
                        onChange={(e) => setItemFormValues({ ...itemFormValues, description: e.target.value })}
                        placeholder="Detailed recipe story to tempt hungry clients..."
                        rows={2}
                        className="w-full bg-[#121212] border border-[#2A2A2A] rounded-lg p-2 text-white font-sans text-xs focus:border-[#FF6B00] outline-none resize-none"
                      />
                    </div>

                    {/* Ingredients Comma-separated list */}
                    <div className="md:col-span-2">
                      <label className="block text-[10px] font-mono uppercase tracking-wider text-[#BDBDBD] mb-1">
                        Ingredients (Comma Separated)
                      </label>
                      <input
                        type="text"
                        value={itemFormValues.ingredientsStr}
                        onChange={(e) => setItemFormValues({ ...itemFormValues, ingredientsStr: e.target.value })}
                        placeholder="Prime Beef, Aged Cheese, Sliced Tomatoes, Pickle spears"
                        className="w-full bg-[#121212] border border-[#2A2A2A] rounded-lg p-2 text-white font-sans text-xs focus:border-[#FF6B00] outline-none"
                      />
                    </div>

                    {/* Nutritional Information variables */}
                    <div className="md:col-span-2 grid grid-cols-4 gap-2 pt-2 border-t border-[#2A2A2A]/45">
                      <div className="col-span-1">
                        <label className="block text-[8.5px] font-mono uppercase tracking-wider text-[#BDBDBD]">Calories</label>
                        <input
                          type="text"
                          value={itemFormValues.calories}
                          onChange={(e) => setItemFormValues({ ...itemFormValues, calories: e.target.value })}
                          placeholder="620 kcal"
                          className="w-full bg-[#121212] border border-[#2A2A2A] rounded-md p-1.5 text-white font-sans text-xs focus:border-[#FF6B00] outline-none"
                        />
                      </div>
                      <div className="col-span-1">
                        <label className="block text-[8.5px] font-mono uppercase tracking-wider text-[#BDBDBD]">Protein</label>
                        <input
                          type="text"
                          value={itemFormValues.protein}
                          onChange={(e) => setItemFormValues({ ...itemFormValues, protein: e.target.value })}
                          placeholder="32g"
                          className="w-full bg-[#121212] border border-[#2A2A2A] rounded-md p-1.5 text-white font-sans text-xs focus:border-[#FF6B00] outline-none"
                        />
                      </div>
                      <div className="col-span-1">
                        <label className="block text-[8.5px] font-mono uppercase tracking-wider text-[#BDBDBD]">Carbs</label>
                        <input
                          type="text"
                          value={itemFormValues.carbs}
                          onChange={(e) => setItemFormValues({ ...itemFormValues, carbs: e.target.value })}
                          placeholder="41g"
                          className="w-full bg-[#121212] border border-[#2A2A2A] rounded-md p-1.5 text-white font-sans text-xs focus:border-[#FF6B00] outline-none"
                        />
                      </div>
                      <div className="col-span-1">
                        <label className="block text-[8.5px] font-mono uppercase tracking-wider text-[#BDBDBD]">Fat</label>
                        <input
                          type="text"
                          value={itemFormValues.fat}
                          onChange={(e) => setItemFormValues({ ...itemFormValues, fat: e.target.value })}
                          placeholder="24g"
                          className="w-full bg-[#121212] border border-[#2A2A2A] rounded-md p-1.5 text-white font-sans text-xs focus:border-[#FF6B00] outline-none"
                        />
                      </div>
                    </div>

                    {/* Boolean States: Available, Featured */}
                    <div className="md:col-span-2 flex items-center justify-between gap-4 pt-2">
                      <label className="inline-flex items-center gap-2 cursor-pointer text-xs">
                        <input
                          type="checkbox"
                          checked={itemFormValues.available}
                          onChange={(e) => setItemFormValues({ ...itemFormValues, available: e.target.checked })}
                          className="accent-[#FF6B00] w-4 h-4 rounded"
                        />
                        <span className="text-[#BDBDBD] font-sans">Available in Bole Kitchen</span>
                      </label>

                      <label className="inline-flex items-center gap-2 cursor-pointer text-xs">
                        <input
                          type="checkbox"
                          checked={itemFormValues.featured}
                          onChange={(e) => setItemFormValues({ ...itemFormValues, featured: e.target.checked })}
                          className="accent-[#FF6B00] w-4 h-4 rounded"
                        />
                        <span className="text-[#BDBDBD] font-sans">Flag as Chef Specialty</span>
                      </label>
                    </div>

                    <div className="md:col-span-2 pt-4">
                      <button
                        type="submit"
                        className="w-full bg-[#FF6B00] hover:bg-[#FF6B00]/95 text-white py-2.5 rounded-lg font-sans font-bold text-xs shadow-md transition"
                      >
                        {editingItem ? 'Publish Updates' : 'Publish Dish Live'}
                      </button>
                    </div>

                  </form>
                </div>
              </div>
            )}

          </div>
        )}

        {/* 4. SETTINGS FORM INTEGRATION */}
        {activeTab === 'settings' && (
          <div className="space-y-4 animate-fade-in">
            <div className="bg-[#1E1E1E] border border-[#2A2A2A] rounded-3xl p-6 md:p-8">
              
              <div className="mb-6 flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-[#FF6B00]/10 border border-[#FF6B00]/20 flex items-center justify-center text-[#FF6B00]">
                  <Settings className="w-5.5 h-5.5" />
                </div>
                <div>
                  <h2 className="text-white font-sans font-extrabold text-base">Store Metadata & Identity</h2>
                  <p className="text-[#BDBDBD] text-xs">Modifies public-facing store attributes, contacts, and delivery handles.</p>
                </div>
              </div>

              {settingsSuccessMsg && (
                <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs p-3.5 rounded-xl mb-6 flex gap-2 items-center">
                  <Check className="w-4 h-4" />
                  <span>{settingsSuccessMsg}</span>
                </div>
              )}

              <form onSubmit={handleSaveSettings} className="space-y-4 font-sans text-xs">
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Brand name */}
                  <div>
                    <label className="block text-[10px] font-mono uppercase tracking-wider text-[#BDBDBD] mb-1">
                      Restaurant Name
                    </label>
                    <input
                      type="text"
                      value={localSettings.name}
                      onChange={(e) => setLocalSettings({ ...localSettings, name: e.target.value })}
                      className="w-full bg-[#121212] border border-[#2A2A2A] rounded-lg p-2.5 text-white focus:border-[#FF6B00] outline-none"
                      required
                    />
                  </div>

                  {/* Logo url string */}
                  <div>
                    <label className="block text-[10px] font-mono uppercase tracking-wider text-[#BDBDBD] mb-1">
                      Logo Vector Image URL
                    </label>
                    <input
                      type="url"
                      value={localSettings.logo}
                      onChange={(e) => setLocalSettings({ ...localSettings, logo: e.target.value })}
                      className="w-full bg-[#121212] border border-[#2A2A2A] rounded-lg p-2.5 text-white focus:border-[#FF6B00] outline-none"
                      required
                    />
                  </div>

                  {/* Contact Number */}
                  <div>
                    <label className="block text-[10px] font-mono uppercase tracking-wider text-[#BDBDBD] mb-1">
                      Bole Hotline phone number
                    </label>
                    <input
                      type="text"
                      value={localSettings.phone}
                      onChange={(e) => setLocalSettings({ ...localSettings, phone: e.target.value })}
                      className="w-full bg-[#121212] border border-[#2A2A2A] rounded-lg p-2.5 text-white focus:border-[#FF6B00] outline-none"
                      required
                    />
                  </div>

                  {/* Physical location */}
                  <div>
                    <label className="block text-[10px] font-mono uppercase tracking-wider text-[#BDBDBD] mb-1">
                      Physical Bole Address
                    </label>
                    <input
                      type="text"
                      value={localSettings.address}
                      onChange={(e) => setLocalSettings({ ...localSettings, address: e.target.value })}
                      className="w-full bg-[#121212] border border-[#2A2A2A] rounded-lg p-2.5 text-white focus:border-[#FF6B00] outline-none"
                      required
                    />
                  </div>
                </div>

                {/* Social media handles */}
                <div className="border-t border-[#2A2A2A]/40 pt-4 mt-2">
                  <h3 className="text-white text-[11px] font-mono uppercase tracking-wider mb-3 text-[#BDBDBD]">
                    Social Media & Messenger Links
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-mono whitespace-nowrap text-[#BDBDBD] mb-1">
                        Telegram Channel link
                      </label>
                      <input
                        type="url"
                        value={localSettings.telegram}
                        onChange={(e) => setLocalSettings({ ...localSettings, telegram: e.target.value })}
                        className="w-full bg-[#121212] border border-[#2A2A2A] rounded-lg p-2.5 text-white focus:border-[#FF6B00] outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-mono whitespace-nowrap text-[#BDBDBD] mb-1">
                        Instagram handle link
                      </label>
                      <input
                        type="url"
                        value={localSettings.instagram}
                        onChange={(e) => setLocalSettings({ ...localSettings, instagram: e.target.value })}
                        className="w-full bg-[#121212] border border-[#2A2A2A] rounded-lg p-2.5 text-white focus:border-[#FF6B00] outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-mono whitespace-nowrap text-[#BDBDBD] mb-1">
                        TikTok link
                      </label>
                      <input
                        type="url"
                        value={localSettings.tiktok}
                        onChange={(e) => setLocalSettings({ ...localSettings, tiktok: e.target.value })}
                        className="w-full bg-[#121212] border border-[#2A2A2A] rounded-lg p-2.5 text-white focus:border-[#FF6B00] outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-mono whitespace-nowrap text-[#BDBDBD] mb-1">
                        Facebook link
                      </label>
                      <input
                        type="url"
                        value={localSettings.facebook}
                        onChange={(e) => setLocalSettings({ ...localSettings, facebook: e.target.value })}
                        className="w-full bg-[#121212] border border-[#2A2A2A] rounded-lg p-2.5 text-white focus:border-[#FF6B00] outline-none"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-4 mt-2">
                  <button
                    type="submit"
                    className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-[#FF6B00] hover:bg-[#FF6B00]/90 text-white font-sans font-bold text-xs shadow-lg transition active:scale-95"
                  >
                    Commit Configuration
                  </button>
                </div>

              </form>

            </div>
          </div>
        )}

      </div>

    </div>
  );
}
