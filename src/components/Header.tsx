import { Search, Heart, Shield, Sparkles, Sun, Moon } from 'lucide-react';
import { ViewState } from '../types';

interface HeaderProps {
  currentView: ViewState;
  onViewChange: (view: ViewState) => void;
  onScrollToContact: () => void;
  favoritesCount: number;
  logoUrl?: string;
  restaurantName?: string;
  darkMode: boolean;
  onToggleTheme: () => void;
}

export default function Header({
  currentView,
  onViewChange,
  onScrollToContact,
  favoritesCount,
  logoUrl,
  restaurantName = 'Wow Burger',
  darkMode,
  onToggleTheme
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 bg-[#121212]/95 backdrop-blur-md border-b border-[#2A2A2A] px-4 py-3 transition-all duration-300">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Brand Logo & Name */}
        <div 
          onClick={() => onViewChange('menu')}
          className="flex items-center gap-3 cursor-pointer group active:scale-95 transition-transform"
        >
          <div className="relative flex items-center justify-center w-9 h-9 md:w-10 md:h-10 rounded-xl bg-gradient-to-br from-[#FF6B00] to-[#FF8C39] p-0.5 shadow-lg shadow-[#FF6B00]/20 group-hover:rotate-12 transition-all duration-300">
            <div className="w-full h-full bg-[#121212] rounded-[10px] flex items-center justify-center overflow-hidden">
              <img 
                src={logoUrl || 'https://img.icons8.com/color/96/burger.png'} 
                alt="Wow Burger Logo" 
                className="w-7 h-7 md:w-8 h-8 object-contain"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).style.display = 'none';
                  const fallback = document.getElementById('header-burger-fallback-svg');
                  if (fallback) fallback.classList.remove('hidden');
                }}
              />
              <svg 
                id="header-burger-fallback-svg"
                className="w-5.5 h-5.5 text-[#FF6B00] hidden" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2.5" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              >
                {/* Top Bun */}
                <path d="M3 11a9 9 0 0 1 18 0" fill="currentColor" fillOpacity="0.2" stroke="#FF6B00" />
                {/* Patty */}
                <path d="M2 14h20" strokeWidth="3.5" stroke="#FF8C39" />
                {/* Bottom Bun */}
                <path d="M21 17a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3" fill="currentColor" fillOpacity="0.1" stroke="#FF6B00" />
              </svg>
            </div>
          </div>
          <div className="flex flex-col">
            <span className="text-white font-sans font-extrabold tracking-tight text-base md:text-lg flex items-center gap-1">
              {restaurantName} <span className="text-[#FF6B00]">Bole</span>
            </span>
            <span className="text-[#BDBDBD] text-[9px] font-mono uppercase tracking-widest -mt-1 hidden xs:block"> Addis Ababa</span>
          </div>
        </div>

        {/* Quick Menu Actions */}
        <div className="flex items-center gap-2 md:gap-4">
          {/* Menu Button */}
          <button
            id="header-nav-menu"
            onClick={() => onViewChange('menu')}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold font-sans tracking-wide transition-all duration-200 ${
              currentView === 'menu'
                ? 'bg-[#FF6B00] text-white shadow-lg shadow-[#FF6B00]/20'
                : 'text-[#BDBDBD] hover:text-white hover:bg-[#1E1E1E]'
            }`}
          >
            Menu
          </button>

          {/* Contact Button */}
          <button
            id="header-nav-contact"
            onClick={onScrollToContact}
            className="px-3 py-1.5 rounded-full text-xs font-semibold font-sans tracking-wide text-[#BDBDBD] hover:text-[#FF6B00] hover:bg-[#1E1E1E] transition-all duration-200 active:scale-95"
            title="Location & Contact"
          >
            Contact
          </button>

          {/* Favorites Action Icon */}
          <button
            id="header-nav-favorites"
            onClick={() => onViewChange('favorites')}
            className={`p-2 rounded-full relative transition-all duration-200 ${
              currentView === 'favorites'
                ? 'bg-[#FF6B00]/15 text-[#FF6B00]'
                : 'text-[#BDBDBD] hover:text-[#FF6B00] hover:bg-[#1E1E1E]'
            }`}
            title="Saves & Favorites"
          >
            <Heart className={`w-5 h-5 ${currentView === 'favorites' ? 'fill-current' : ''}`} />
            {favoritesCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#FF6B00] text-white text-[10px] font-sans font-bold w-4 h-4 rounded-full flex items-center justify-center animate-pulse">
                {favoritesCount}
              </span>
            )}
          </button>

          {/* Admin Dashboard Entry */}
          <button
            id="header-nav-admin"
            onClick={() => onViewChange(localStorage.getItem('admin_session') ? 'admin' : 'login')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium font-mono tracking-wide transition-all duration-200 border ${
              currentView === 'admin' || currentView === 'login'
                ? 'bg-emerald-600/10 border-emerald-500/30 text-emerald-400'
                : 'bg-transparent border-[#2A2A2A] text-[#BDBDBD] hover:text-white hover:border-[#FF6B00]/40'
            }`}
            title="Admin Console"
          >
            <Shield className="w-3.5 h-3.5" />
            <span className="hidden sm:inline-block">Admin</span>
          </button>

          {/* Theme Switcher Button */}
          <button
            id="header-theme-toggle"
            onClick={onToggleTheme}
            className="p-2 rounded-full relative transition-all duration-200 text-[#BDBDBD] hover:text-[#FF6B00] hover:bg-[#1E1E1E] active:scale-95"
            title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            {darkMode ? (
              <Sun className="w-5 h-5 text-amber-400 fill-amber-400/10" />
            ) : (
              <Moon className="w-5 h-5 text-blue-600 fill-blue-600/10" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
