import { Heart, Sparkles, ShoppingBag, ArrowLeft, Trash2 } from 'lucide-react';
import { MenuItem } from '../types';
import ItemCard from './ItemCard';

interface FavoritesViewProps {
  favoriteItems: MenuItem[];
  onToggleFavorite: (itemId: string, e: any) => void;
  onSelect: (item: MenuItem) => void;
  onBrowseMenu: () => void;
  onClearAll: () => void;
}

export default function FavoritesView({
  favoriteItems,
  onToggleFavorite,
  onSelect,
  onBrowseMenu,
  onClearAll
}: FavoritesViewProps) {
  const hasFavorites = favoriteItems.length > 0;

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 md:py-10 animate-fade-in text-white font-sans">
      
      {/* Title block */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-black tracking-tight flex items-center gap-2">
            <Heart className="w-7 h-7 text-red-500 fill-current animate-pulse" />
            Saved Desires
          </h1>
          <p className="text-[#BDBDBD] text-xs mt-1">Your curated selection of Bole’s premium treats.</p>
        </div>

        {hasFavorites && (
          <button
            id="clear-all-favorites-btn"
            onClick={onClearAll}
            className="flex items-center gap-1 text-xs hover:text-[#FF6B00] text-red-400 bg-[#1E1E1E] hover:bg-[#2A2A2A] border border-[#2A2A2A] px-3.5 py-2 rounded-xl transition"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Clear Saved Collection
          </button>
        )}
      </div>

      {hasFavorites ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {favoriteItems.map(item => (
            <ItemCard 
              key={item.id}
              item={item}
              isFavorite={true}
              onToggleFavorite={onToggleFavorite}
              onSelect={onSelect}
            />
          ))}
        </div>
      ) : (
        /* Premium Empty-state */
        <div className="max-w-md mx-auto text-center py-16 px-4 bg-[#1E1E1E] border border-[#2A2A2A] rounded-3xl space-y-6 shadow-xl">
          <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center text-red-500 mx-auto border border-red-500/20">
            <Heart className="w-7 h-7" />
          </div>

          <div className="space-y-2">
            <h2 className="text-white font-sans font-extrabold text-base">Your Platter is Empty</h2>
            <p className="text-[#BDBDBD] text-xs max-w-sm mx-auto leading-relaxed">
              Browse classes of juicy burgers, spicy fries, and cold master milkshakes in Bole to save your favorited choices.
            </p>
          </div>

          <button
            id="fav-browse-menu-actions"
            onClick={onBrowseMenu}
            className="inline-flex items-center gap-1 bg-[#FF6B00] text-white hover:bg-[#FF6B00]/95 font-sans font-bold text-xs px-5 py-2.5 rounded-xl shadow-lg transition duration-200 active:scale-95"
          >
            <ShoppingBag className="w-4 h-4" />
            Explore Live Menu
          </button>
        </div>
      )}
    </div>
  );
}
