import { useState, useEffect } from 'react';
import { 
  Sparkles, Beef, CheckSquare, Container, CupSoda, Droplet, Cake, Utensils, 
  Search, MapPin, Phone, Heart, ShoppingBag, ArrowUpRight, Instagram, Info, ChevronRight 
} from 'lucide-react';

import { Category, MenuItem, RestaurantSettings, ViewState } from './types';
import { DEFAULT_CATEGORIES, DEFAULT_MENU_ITEMS, DEFAULT_SETTINGS } from './data';

import Header from './components/Header';
import ItemCard from './components/ItemCard';
import DetailsView from './components/DetailsView';
import FavoritesView from './components/FavoritesView';
import AdminLogin from './components/AdminLogin';
import AdminDashboard from './components/AdminDashboard';
import BottomNavBar from './components/BottomNavBar';

export default function App() {
  // --------------------------------------------------
  // 1. DATA INITIALIZATION & LOCAL STORAGE PERSISTENCE
  // --------------------------------------------------
  const [categories, setCategories] = useState<Category[]>(() => {
    const raw = localStorage.getItem('wow_burger_categories');
    return raw ? JSON.parse(raw) : DEFAULT_CATEGORIES;
  });

  const [menuItems, setMenuItems] = useState<MenuItem[]>(() => {
    const raw = localStorage.getItem('wow_burger_menu_items');
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        return parsed.map((item: MenuItem) => {
          if (item.id === '5' && item.name === 'Grilled Chicken Club') {
            const freshItem = DEFAULT_MENU_ITEMS.find(d => d.id === '5');
            return freshItem || item;
          }
          // Upgrade images for items 4 and 5 if they are using old placeholder urls
          if (item.id === '4') {
            const freshItem = DEFAULT_MENU_ITEMS.find(d => d.id === '4');
            if (freshItem) {
              return { ...item, image: freshItem.image };
            }
          }
          if (item.id === '5') {
            const freshItem = DEFAULT_MENU_ITEMS.find(d => d.id === '5');
            if (freshItem) {
              return { ...item, name: 'Chicken Burger', image: freshItem.image };
            }
          }
          return item;
        });
      } catch (e) {
        return DEFAULT_MENU_ITEMS;
      }
    }
    return DEFAULT_MENU_ITEMS;
  });

  const [settings, setSettings] = useState<RestaurantSettings>(() => {
    const raw = localStorage.getItem('wow_burger_settings');
    return raw ? JSON.parse(raw) : DEFAULT_SETTINGS;
  });

  const [favorites, setFavorites] = useState<string[]>(() => {
    const raw = localStorage.getItem('wow_burger_favorites');
    return raw ? JSON.parse(raw) : [];
  });

  // Write changes to Local Storage
  useEffect(() => {
    localStorage.setItem('wow_burger_categories', JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem('wow_burger_menu_items', JSON.stringify(menuItems));
  }, [menuItems]);

  useEffect(() => {
    localStorage.setItem('wow_burger_settings', JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem('wow_burger_favorites', JSON.stringify(favorites));
  }, [favorites]);

  const [darkMode, setDarkMode] = useState<boolean>(() => {
    const raw = localStorage.getItem('wow_burger_dark_mode');
    return raw ? raw === 'true' : true;
  });

  useEffect(() => {
    localStorage.setItem('wow_burger_dark_mode', String(darkMode));
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // --------------------------------------------------
  // 2. NAVIGATION & SEARCH STATS
  // --------------------------------------------------
  const [currentView, setCurrentView] = useState<ViewState>('menu');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);

  // Helper mapping component icons dynamically
  const renderCategoryIcon = (iconName: string) => {
    switch (iconName) {
      case 'Sparkles': return <Sparkles className="w-4 h-4" />;
      case 'Beef': return <Beef className="w-4 h-4" />;
      case 'CheckSquare': return <CheckSquare className="w-4 h-4" />;
      case 'Container': return <Container className="w-4 h-4" />;
      case 'CupSoda': return <CupSoda className="w-4 h-4" />;
      case 'Droplet': return <Droplet className="w-4 h-4" />;
      case 'Cake': return <Cake className="w-4 h-4" />;
      default: return <Utensils className="w-4 h-4" />;
    }
  };

  // --------------------------------------------------
  // 3. INTERACTIVE FUNCTIONS
  // --------------------------------------------------
  const handleToggleFavorite = (itemId: string, e: any) => {
    e.stopPropagation(); // Avoid triggering card details click
    setFavorites(prev => {
      if (prev.includes(itemId)) {
        return prev.filter(id => id !== itemId);
      } else {
        return [...prev, itemId];
      }
    });
  };

  const handleSelectItem = (item: MenuItem) => {
    setSelectedItem(item);
    setCurrentView('details');
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleClearFavorites = () => {
    if (window.confirm('Clear all favorited recipes?')) {
      setFavorites([]);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_session');
    setCurrentView('menu');
  };

  const handleAdminSuccess = () => {
    setCurrentView('admin');
  };

  const handleScrollToContact = () => {
    const scrollFn = () => {
      const contactSection = document.getElementById('contact-map-section');
      if (contactSection) {
        contactSection.scrollIntoView({ behavior: 'smooth' });
      }
    };

    if (currentView !== 'menu') {
      setCurrentView('menu');
      setSelectedItem(null);
      setTimeout(scrollFn, 100);
    } else {
      scrollFn();
    }
  };

  // --------------------------------------------------
  // 4. FILTERED CALCULATIONS
  // --------------------------------------------------
  const filteredItems = menuItems.filter(item => {
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (item.ingredients || []).some(ing => ing.toLowerCase().includes(searchQuery.toLowerCase()));
    
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#121212] flex flex-col selection:bg-[#FF6B00] selection:text-white pb-16 md:pb-0">
      
      {/* 1. Header (Sticky) */}
      <Header 
        currentView={currentView}
        onViewChange={(view) => {
          setCurrentView(view);
          if (view === 'menu') {
            setSelectedItem(null);
          }
        }}
        onScrollToContact={handleScrollToContact}
        favoritesCount={favorites.length}
        logoUrl={settings.logo}
        restaurantName={settings.name}
        darkMode={darkMode}
        onToggleTheme={() => setDarkMode(prev => !prev)}
      />

      {/* 2. Primary Layout Swapping Body */}
      <main className="flex-1">
        
        {/* VIEW A: PRIMARY MENU EXPLORER SCREEN (IMMEDIATE MENU ACCESS) */}
        {currentView === 'menu' && (
          <div className="max-w-7xl mx-auto px-4 py-4 md:py-8 space-y-6">
            
            {/* Search Bar section (Strict requirement checklist: Search bar must be first visible screen) */}
            <div className="relative max-w-2xl mx-auto w-full group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-[#BDBDBD] group-focus-within:text-[#FF6B00] transition-colors" />
              <input
                id="menu-search-input"
                type="text"
                placeholder="Search burgers, drinks, fries..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#1E1E1E] border border-[#2A2A2A] rounded-2xl pl-12 pr-10 py-3.5 text-white placeholder-[#BDBDBD]/65 text-sm outline-none focus:border-[#FF6B00] focus:ring-1 focus:ring-[#FF6B00]/40 transition-all font-sans shadow-md"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-[#BDBDBD] hover:text-white font-mono bg-[#2A2A2A] px-2 py-0.5 rounded"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Category horizontal scrolling bar tabs */}
            <div className="relative w-full overflow-hidden py-1 border-b border-[#2A2A2A]/40 pb-4">
              <div className="flex items-center gap-2 overflow-x-auto no-scrollbar scroll-smooth snap-x px-1">
                {categories.map((cat) => {
                  const isActive = selectedCategory === cat.id;
                  return (
                    <button
                      key={cat.id}
                      id={`category-btn-${cat.id}`}
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-sans font-bold tracking-wide transition-all duration-200 snap-start flex-shrink-0 cursor-pointer ${
                        isActive
                          ? 'bg-[#FF6B00] text-white shadow-md shadow-[#FF6B00]/15'
                          : 'bg-[#1E1E1E] text-[#BDBDBD] hover:text-white hover:bg-[#2A2A2A] border border-[#2A2A2A]'
                      }`}
                    >
                      {renderCategoryIcon(cat.icon)}
                      <span>{cat.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Menu Grid (Separate Desktop, Tablet, Mobile layout densities strictly optimized) */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-[#BDBDBD] text-[10px] font-mono uppercase tracking-widest">
                  Showing {filteredItems.length} delicacies in Bole
                </h2>
                
                {selectedCategory !== 'all' && (
                  <button 
                    onClick={() => setSelectedCategory('all')} 
                    className="text-[#FF6B00] text-xs font-sans font-semibold hover:underline"
                  >
                    Display All
                  </button>
                )}
              </div>

              {/* Layout grid containing custom optimized sizing:
                  - Mobile: 2 columns
                  - Tablet: 3 columns
                  - Desktop: 4 columns
               */}
              {filteredItems.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5 lg:gap-6">
                  {filteredItems.map((item) => (
                    <ItemCard 
                      key={item.id}
                      item={item}
                      isFavorite={favorites.includes(item.id)}
                      onToggleFavorite={handleToggleFavorite}
                      onSelect={handleSelectItem}
                    />
                  ))}
                </div>
              ) : (
                /* No Results empty card view */
                <div className="text-center py-16 px-4 bg-[#1E1E1E] border border-[#2A2A2A] rounded-2xl max-w-md mx-auto space-y-4">
                  <div className="text-[#FF6B00] bg-[#FF6B00]/10 w-12 h-12 rounded-full flex items-center justify-center mx-auto border border-[#FF6B00]/20">
                    <Utensils className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-white font-sans font-bold text-sm">No matches found</h3>
                    <p className="text-[#BDBDBD] text-xs mt-1">
                      We couldn’t find anything matching "{searchQuery}" in our Bole kitchen records.
                    </p>
                  </div>
                  <button
                    onClick={() => { setSearchQuery(''); setSelectedCategory('all'); }}
                    className="bg-[#2A2A2A] text-white hover:bg-[#FF6B00] text-xs font-sans font-bold px-4 py-2 rounded-xl transition-all duration-200"
                  >
                    Clear Filter
                  </button>
                </div>
              )}
            </div>

            {/* Bole Bistro location, Contact & Interactive Map block */}
            <div id="contact-map-section" className="mt-12 bg-[#1E1E1E] border border-[#2A2A2A] rounded-3xl p-6 md:p-8 space-y-6">
              <div className="flex flex-col md:flex-row gap-8">
                
                {/* Left Side: Contact Information Cards */}
                <div className="flex-1 space-y-6">
                  <div>
                    <span className="text-[#FF6B00] text-[10px] font-mono uppercase tracking-widest bg-[#FF6B00]/10 px-2.5 py-1 rounded-md">
                      Find Us In Addis Ababa
                    </span>
                    <h3 className="text-white font-sans font-black text-xl md:text-2xl mt-2 tracking-tight">
                      Bole Bistro & Kitchen
                    </h3>
                    <p className="text-[#BDBDBD] text-xs mt-1">
                      Stop by for the freshest flame-grilled burgers or place your premium orders directly.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    
                    {/* Location Info */}
                    <div className="bg-[#121212] border border-[#2A2A2A]/80 rounded-2xl p-4 space-y-2">
                      <div className="flex items-center gap-2 text-[#FF6B00]">
                        <MapPin className="w-5 h-5 flex-shrink-0" />
                        <span className="text-white font-sans font-extrabold uppercase text-[11px] tracking-wide">Bole Location</span>
                      </div>
                      <p className="text-[#BDBDBD] text-xs leading-relaxed font-sans">
                        {settings.address}
                      </p>
                      <a 
                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(settings.address)}`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-[11px] text-[#FF6B00] hover:underline font-bold"
                      >
                        Get Directions <ArrowUpRight className="w-3.5 h-3.5" />
                      </a>
                    </div>

                    {/* Order / Help Line */}
                    <div className="bg-[#121212] border border-[#2A2A2A]/80 rounded-2xl p-4 space-y-2 flex flex-col justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-[#FF6B00]">
                          <Phone className="w-5 h-5 flex-shrink-0" />
                          <span className="text-white font-sans font-extrabold uppercase text-[11px] tracking-wide">Direct Hotline</span>
                        </div>
                        <p className="text-white font-mono font-black text-sm tracking-tight">
                          {settings.phone}
                        </p>
                        <p className="text-[#BDBDBD]/60 text-[10px] leading-snug font-sans">
                          Call for catering, custom baking, and group reservations.
                        </p>
                      </div>
                      <a 
                        href={`tel:${settings.phone.replace(/\s+/g, '')}`} 
                        className="mt-2 inline-block bg-[#FF6B00] hover:bg-[#FF6B00]/90 text-white font-sans font-bold text-[10.5px] px-3 py-1.5 rounded-lg active:scale-95 transition-all text-center w-full"
                      >
                        Call Now
                      </a>
                    </div>

                    {/* Operational Hours */}
                    <div className="bg-[#121212] border border-[#2A2A2A]/80 rounded-2xl p-4 space-y-2">
                      <div className="flex items-center gap-2 text-[#FF6B00]">
                        <Sparkles className="w-5 h-5 flex-shrink-0" />
                        <span className="text-white font-sans font-extrabold uppercase text-[11px] tracking-wide">Baking Hours</span>
                      </div>
                      <p className="text-[#BDBDBD] text-xs font-sans leading-relaxed">
                        Mon - Sun: 8:30 AM - 11:30 PM (Addis UTC+3)
                      </p>
                      <p className="text-[#BDBDBD]/50 text-[10.5px]">
                        Our organic buns are freshly rolled and baked every 2 hours!
                      </p>
                    </div>

                    {/* Online Orders Social channels */}
                    <div className="bg-[#121212] border border-[#2A2A2A]/80 rounded-2xl p-4 space-y-2">
                      <div className="flex items-center gap-2 text-[#FF6B00]">
                        <Instagram className="w-5 h-5 flex-shrink-0" />
                        <span className="text-white font-sans font-extrabold uppercase text-[11px] tracking-wide">Social Hubs</span>
                      </div>
                      <div className="flex flex-col gap-1.5 pt-1">
                        <a 
                          href={settings.telegram} 
                          target="_blank" 
                          rel="noreferrer"
                          className="text-xs text-[#BDBDBD] hover:text-[#FF6B00] flex items-center gap-1.5 transition-colors"
                        >
                          <span className="text-[#FF6B00] text-sm">✈</span> Telegram Channel
                        </a>
                        <a 
                          href={settings.instagram} 
                          target="_blank" 
                          rel="noreferrer"
                          className="text-xs text-[#BDBDBD] hover:text-[#FF6B00] flex items-center gap-1.5 transition-colors"
                        >
                          <span className="text-[#FF6B00] text-sm">📷</span> Instagram Page
                        </a>
                      </div>
                    </div>

                  </div>
                </div>

                {/* Right Side: Beautiful Interactive OpenStreetMap of Bole, Addis Ababa */}
                <div className="w-full md:w-[45%] flex flex-col justify-between">
                  <div className="h-64 md:h-full min-h-[250px] relative rounded-2xl overflow-hidden bg-[#121212] border border-[#2A2A2A]">
                    {/* Premium Dark Map Filtering Wrapper */}
                    <iframe 
                      title="Bole Addis Ababa Wow Burger Map"
                      width="100%" 
                      height="100%" 
                      frameBorder="0" 
                      scrolling="no" 
                      marginHeight={0} 
                      marginWidth={0} 
                      src="https://www.openstreetmap.org/export/embed.html?bbox=38.7845%2C8.9810%2C38.7945%2C8.9910&amp;layer=mapnik&amp;marker=8.9860%2C38.7895"
                      className="grayscale invert opacity-85 contrast-125 focus:outline-none w-full h-full"
                    ></iframe>
                    
                    {/* Map Annotation Overlay */}
                    <div className="absolute bottom-3 left-3 right-3 bg-[#1E1E1E]/95 backdrop-blur-md border border-[#2A2A2A] rounded-xl p-3 flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-[#FF6B00]/15 flex items-center justify-center text-[#FF6B00] flex-shrink-0 animate-pulse">
                        <MapPin className="w-4.5 h-4.5" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-white font-sans font-bold text-xs truncate">Wow Burger Addis</p>
                        <p className="text-[#BDBDBD] text-[10px] truncate">Bole road, behind Edna Mall</p>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </div>

            {/* Static footer for client menu brand signature */}
            <footer className="pt-8 pb-12 border-t border-[#2A2A2A]/40 text-center space-y-2">
              <div className="flex items-center justify-center gap-2.5 text-xs text-[#BDBDBD]">
                <a href={settings.telegram} target="_blank" rel="noopener noreferrer" className="hover:text-[#FF6B00] transition-colors font-sans">Telegram</a>
                <span>•</span>
                <a href={settings.instagram} target="_blank" rel="noopener noreferrer" className="hover:text-[#FF6B00] transition-colors font-sans">Instagram</a>
                <span>•</span>
                <a href={settings.tiktok} target="_blank" rel="noopener noreferrer" className="hover:text-[#FF6B00] transition-colors font-sans font-mono uppercase text-[10px]">TikTok</a>
              </div>
              <p className="text-[10px] text-[#BDBDBD]/40 font-sans">
                © {new Date().getFullYear()} {settings.name} Bole Branch. Powered by Addis Premium Menu Systems.
              </p>
            </footer>

          </div>
        )}

        {/* VIEW B: MENU ITEM DETAILED PAGE EXPLORER */}
        {currentView === 'details' && selectedItem && (
          <DetailsView 
            item={selectedItem}
            allItems={menuItems}
            favorites={favorites}
            onToggleFavorite={handleToggleFavorite}
            onSelect={handleSelectItem}
            onBack={() => {
              setCurrentView('menu');
              setSelectedItem(null);
            }}
          />
        )}

        {/* VIEW C: FAVORITES COLLECTION VIEW */}
        {currentView === 'favorites' && (
          <FavoritesView 
            favoriteItems={menuItems.filter(i => favorites.includes(i.id))}
            onToggleFavorite={handleToggleFavorite}
            onSelect={handleSelectItem}
            onBrowseMenu={() => setCurrentView('menu')}
            onClearAll={handleClearFavorites}
          />
        )}

        {/* VIEW D: SECURE ADMINISTRATIVE SIGN-IN */}
        {currentView === 'login' && (
          <AdminLogin 
            onSuccess={handleAdminSuccess}
            onBack={() => setCurrentView('menu')}
          />
        )}

        {/* VIEW E: MAIN DATABASE ADMINISTRATIVE WORKSPACE */}
        {currentView === 'admin' && (
          <AdminDashboard 
            categories={categories}
            menuItems={menuItems}
            settings={settings}
            onUpdateMenu={setMenuItems}
            onUpdateCategories={setCategories}
            onUpdateSettings={setSettings}
            onLogout={handleLogout}
          />
        )}

      </main>

      {/* 3. Mobile Device Bottom Navigation Bar overlay (Strict Checklist layout mandate) */}
      <BottomNavBar 
        currentView={currentView}
        onViewChange={(view) => {
          setCurrentView(view);
          if (view === 'menu') {
            setSelectedItem(null);
          }
        }}
        favoritesCount={favorites.length}
      />

    </div>
  );
}
