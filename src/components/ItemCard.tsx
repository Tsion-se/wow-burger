import { Heart, Info, Eye, CheckCircle2, AlertCircle } from 'lucide-react';
import { MenuItem } from '../types';

interface ItemCardProps {
  key?: string;
  item: MenuItem;
  isFavorite: boolean;
  onToggleFavorite: (itemId: string, e: any) => void;
  onSelect: (item: MenuItem) => void;
}

export default function ItemCard({
  item,
  isFavorite,
  onToggleFavorite,
  onSelect
}: ItemCardProps) {
  return (
    <div 
      id={`menu-card-${item.id}`}
      className="group relative flex flex-col bg-[#1E1E1E] border border-[#2A2A2A] rounded-2xl overflow-hidden hover:border-[#FF6B00]/40 hover:shadow-xl hover:shadow-[#FF6B00]/5 transition-all duration-300"
    >
      {/* Visual Header / Food Image Container */}
      <div 
        onClick={() => onSelect(item)}
        className="relative aspect-[4/3] w-full overflow-hidden bg-[#121212] cursor-pointer"
      >
        <img 
          src={item.image} 
          alt={item.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
          referrerPolicy="no-referrer"
          onError={(e) => {
            // Fallback placeholder image if URL fails
            e.currentTarget.src = 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=800';
          }}
        />

        {/* Unavailable overlay */}
        {!item.available && (
          <div className="absolute inset-0 bg-[#121212]/80 backdrop-blur-[2px] flex flex-col items-center justify-center gap-1.5 p-3">
            <AlertCircle className="w-6 h-6 text-red-400" />
            <span className="text-white font-sans font-bold text-xs uppercase tracking-wider">Sold Out</span>
            <span className="text-[#BDBDBD] text-[9.5px] text-center font-mono">Bole Kitchen Refilling</span>
          </div>
        )}

        {/* Featured Badge */}
        {item.featured && item.available && (
          <span className="absolute top-3 left-3 bg-[#FF6B00] text-white text-[10px] font-sans font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider shadow-md">
            Chef Special
          </span>
        )}

        {/* Double-tap to View or Quick Action Overlay */}
        {item.available && (
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <span className="bg-[#1E1E1E]/90 text-white text-[11px] font-sans font-medium px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-lg border border-[#2A2A2A]">
              <Eye className="w-3.5 h-3.5 text-[#FF6B00]" />
              View Secrets
            </span>
          </div>
        )}
      </div>

      {/* Content Area */}
      <div className="flex-1 flex flex-col p-3 md:p-4">
        {/* Title & Favorite Row */}
        <div className="flex items-start justify-between gap-1.5 mb-1.5">
          <h3 
            onClick={() => onSelect(item)}
            className="text-white font-sans font-bold text-sm md:text-base leading-snug cursor-pointer group-hover:text-[#FF6B00] transition-colors line-clamp-1"
          >
            {item.name}
          </h3>
          
          <button
            id={`fav-btn-${item.id}`}
            onClick={(e) => onToggleFavorite(item.id, e)}
            className={`p-1.5 rounded-full transition-all duration-300 ${
              isFavorite 
                ? 'bg-red-500/10 text-red-500' 
                : 'text-[#BDBDBD] hover:text-red-500 hover:bg-[#2A2A2A]/50'
            }`}
            title={isFavorite ? 'Remove Favorite' : 'Add to Favorites'}
          >
            <Heart className={`w-4 h-4 md:w-4.5 md:h-4.5 ${isFavorite ? 'fill-current' : ''}`} />
          </button>
        </div>

        {/* Short Description */}
        <p className="text-[#BDBDBD] text-xs font-sans font-normal line-clamp-2 leading-relaxed mb-4 flex-1">
          {item.description}
        </p>

        {/* Bottom Metadata & Info / Price */}
        <div className="flex items-center justify-between mt-auto pt-2 border-t border-[#2A2A2A]/50">
          <div className="flex flex-col">
            <span className="text-[10px] text-[#BDBDBD]/60 font-mono uppercase tracking-wider">Price</span>
            <span className="text-[#FF6B00] text-sm md:text-base font-mono font-bold">
              {item.price} <span className="text-xs">ETB</span>
            </span>
          </div>

          <button
            id={`info-btn-${item.id}`}
            onClick={() => onSelect(item)}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-[#2A2A2A] text-white hover:bg-[#FF6B00] text-[11px] font-sans font-semibold tracking-wide transition-all duration-200"
          >
            <Info className="w-3.5 h-3.5" />
            <span>Info</span>
          </button>
        </div>
      </div>
    </div>
  );
}
