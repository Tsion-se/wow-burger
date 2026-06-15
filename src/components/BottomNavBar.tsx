import { BookOpen, Heart, ShieldAlert } from 'lucide-react';
import { ViewState } from '../types';

interface BottomNavBarProps {
  currentView: ViewState;
  onViewChange: (view: ViewState) => void;
  favoritesCount: number;
}

export default function BottomNavBar({
  currentView,
  onViewChange,
  favoritesCount
}: BottomNavBarProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[#121212]/95 backdrop-blur-md border-t border-[#2A2A2A] px-4 py-2 md:hidden flex items-center justify-around shadow-2xl safe-bottom">
      
      {/* Menu / Explore */}
      <button
        id="mobile-nav-menu"
        onClick={() => onViewChange('menu')}
        className={`flex flex-col items-center justify-center gap-1 py-1 px-3 rounded-xl transition-all duration-300 ${
          currentView === 'menu' || currentView === 'details'
            ? 'text-[#FF6B00]' 
            : 'text-[#BDBDBD] hover:text-white'
        }`}
      >
        <BookOpen className="w-5 h-5" />
        <span className="text-[10px] font-sans font-medium">Bole Menu</span>
      </button>

      {/* Saved Favorites */}
      <button
        id="mobile-nav-favorites"
        onClick={() => onViewChange('favorites')}
        className={`flex flex-col items-center justify-center gap-1 py-1 px-3 rounded-xl transition-all duration-300 relative ${
          currentView === 'favorites' 
            ? 'text-[#FF6B00]' 
            : 'text-[#BDBDBD] hover:text-white'
        }`}
      >
        <div className="relative">
          <Heart className={`w-5 h-5 ${currentView === 'favorites' ? 'fill-current' : ''}`} />
          {favoritesCount > 0 && (
            <span className="absolute -top-1.5 -right-1.5 bg-[#FF6B00] text-white text-[9px] font-sans font-bold w-4 h-4 rounded-full flex items-center justify-center">
              {favoritesCount}
            </span>
          )}
        </div>
        <span className="text-[10px] font-sans font-medium">Favorites</span>
      </button>

      {/* Admin Panel */}
      <button
        id="mobile-nav-admin"
        onClick={() => onViewChange(localStorage.getItem('admin_session') ? 'admin' : 'login')}
        className={`flex flex-col items-center justify-center gap-1 py-1 px-3 rounded-xl transition-all duration-300 ${
          currentView === 'admin' || currentView === 'login'
            ? 'text-[#FF6B00]' 
            : 'text-[#BDBDBD] hover:text-white'
        }`}
      >
        <ShieldAlert className="w-5 h-5" />
        <span className="text-[10px] font-sans font-medium">Admin</span>
      </button>

    </nav>
  );
}
