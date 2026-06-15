import { ArrowLeft, Heart, Sparkles, Flame, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { MenuItem } from '../types';

interface DetailsViewProps {
  item: MenuItem;
  allItems: MenuItem[];
  favorites: string[];
  onToggleFavorite: (itemId: string, e: any) => void;
  onSelect: (item: MenuItem) => void;
  onBack: () => void;
}

export default function DetailsView({
  item,
  allItems,
  favorites,
  onToggleFavorite,
  onSelect,
  onBack
}: DetailsViewProps) {
  const isFavorite = favorites.includes(item.id);

  // Get related menu items belonging to the same category, excluding the current item
  const relatedItems = allItems
    .filter(i => i.category === item.category && i.id !== item.id && i.available)
    .slice(0, 3);

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 md:py-10 animate-fade-in">
      {/* Sticky Back button / top navigation line */}
      <div className="flex items-center justify-between mb-6">
        <button
          id="details-back-button"
          onClick={onBack}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#1E1E1E] border border-[#2A2A2A] text-white hover:text-[#FF6B00] hover:border-[#FF6B00]/40 transition-all duration-200 text-xs font-sans font-bold"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Menu</span>
        </button>

        <span className="text-[#BDBDBD] text-xs font-mono uppercase tracking-widest bg-[#1E1E1E] px-3 py-1.5 rounded-lg border border-[#2A2A2A]/50">
          Chef Selection
        </span>
      </div>

      {/* Main Feature Layout */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-10 bg-[#1E1E1E] border border-[#2A2A2A] rounded-3xl overflow-hidden p-4 md:p-8 shadow-xl">
        
        {/* Left Side - Magnified Food Photography */}
        <div className="md:col-span-6 relative rounded-2xl overflow-hidden bg-[#121212] aspect-[4/3] md:aspect-square">
          <img 
            src={item.image} 
            alt={item.name} 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
            onError={(e) => {
              e.currentTarget.src = 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=800';
            }}
          />

          {/* Quick Favorite Action Badge */}
          <button
            id={`details-favorite-toggle-${item.id}`}
            onClick={(e) => onToggleFavorite(item.id, e)}
            className={`absolute top-4 right-4 p-3 rounded-full shadow-lg transition-all duration-300 ${
              isFavorite 
                ? 'bg-[#FF6B00] text-white hover:scale-105' 
                : 'bg-[#121212]/80 text-white hover:text-[#FF6B00]'
            }`}
            title="Toggle Favorite"
          >
            <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
          </button>

          {!item.available && (
            <div className="absolute inset-0 bg-[#121212]/85 backdrop-blur-[2px] flex flex-col items-center justify-center p-4">
              <ShieldAlert className="w-10 h-10 text-red-500 mb-2" />
              <span className="text-white font-sans font-bold text-lg uppercase tracking-wider">Currently Sold Out</span>
              <p className="text-[#BDBDBD] text-xs text-center font-sans mt-1">Please ask our team for custom baking options.</p>
            </div>
          )}
        </div>

        {/* Right Side - Core Culinary Details */}
        <div className="md:col-span-6 flex flex-col justify-between">
          <div className="space-y-4">
            {/* Category Breadcrumb */}
            <span className="inline-block text-[10px] text-[#FF6B00] font-mono uppercase tracking-widest bg-[#FF6B00]/10 px-2.5 py-1 rounded-md">
              {item.category.replace('-', ' ')}
            </span>

            {/* Recipe Title & Price Line */}
            <div className="flex flex-col gap-1">
              <h1 className="text-white font-sans font-extrabold text-2xl md:text-3xl tracking-tight leading-tight">
                {item.name}
              </h1>
              
              <div className="flex items-baseline gap-2 mt-2">
                <span className="text-[#BDBDBD] text-xs font-sans">Price:</span>
                <span className="text-[#FF6B00] text-2xl font-mono font-black tracking-tight">
                  {item.price} <span className="text-sm font-sans font-medium">ETB</span>
                </span>
                <span className="text-xs text-[#BDBDBD] font-mono italic">(Includes Bole VAT & service charge)</span>
              </div>
            </div>

            {/* Extended Culinary Description */}
            <div className="pt-2">
              <h2 className="text-white text-xs font-mono uppercase tracking-widest mb-1.5 text-[#BDBDBD]/65">Story</h2>
              <p className="text-white font-sans text-sm leading-relaxed antialiased">
                {item.description}
              </p>
            </div>

            {/* Ingredients Section */}
            <div className="pt-2">
              <h2 className="text-white text-xs font-mono uppercase tracking-widest mb-2 text-[#BDBDBD]/65">Ingredients</h2>
              <div className="flex flex-wrap gap-1.5">
                {item.ingredients && item.ingredients.length > 0 ? (
                  item.ingredients.map((ingredient, idx) => (
                    <span 
                      key={idx} 
                      className="text-white font-sans text-xs px-2.5 py-1 rounded-lg bg-[#2A2A2A] border border-[#2A2A2A] hover:border-[#FF6B00]/20 transition-all duration-150"
                    >
                      {ingredient}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-[#BDBDBD] italic">No specialty ingredients specified.</span>
                )}
              </div>
            </div>

            {/* Nutritional Index Dashboard */}
            <div className="pt-3 border-t border-[#2A2A2A]/40">
              <h2 className="text-white text-xs font-mono uppercase tracking-widest mb-2.5 text-[#BDBDBD]/65 flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5 text-amber-500" />
                Nutritional Profile
              </h2>
              <div className="grid grid-cols-4 gap-2">
                <div className="bg-[#2A2A2A]/40 rounded-xl p-2 border border-[#2A2A2A] text-center">
                  <span className="text-[10px] text-[#BDBDBD] block lowercase font-mono">calories</span>
                  <span className="text-white text-xs font-bold font-sans">{item.calories || 'N/A'}</span>
                </div>
                <div className="bg-[#2A2A2A]/40 rounded-xl p-2 border border-[#2A2A2A] text-center">
                  <span className="text-[10px] text-[#BDBDBD] block lowercase font-mono">protein</span>
                  <span className="text-white text-xs font-bold font-sans">{item.protein || 'N/A'}</span>
                </div>
                <div className="bg-[#2A2A2A]/40 rounded-xl p-2 border border-[#2A2A2A] text-center">
                  <span className="text-[10px] text-[#BDBDBD] block lowercase font-mono">carbs</span>
                  <span className="text-white text-xs font-bold font-sans">{item.carbs || 'N/A'}</span>
                </div>
                <div className="bg-[#2A2A2A]/40 rounded-xl p-2 border border-[#2A2A2A] text-center">
                  <span className="text-[10px] text-[#BDBDBD] block lowercase font-mono">fat</span>
                  <span className="text-white text-xs font-bold font-sans">{item.fat || 'N/A'}</span>
                </div>
              </div>
            </div>

          </div>

          {/* Quick Availability Status indicator */}
          <div className="mt-6 pt-3 border-t border-[#2A2A2A] flex items-center justify-between">
            <span className="text-xs text-[#BDBDBD] font-sans flex items-center gap-1.5">
              <span className={`w-2.5 h-2.5 rounded-full ${item.available ? 'bg-emerald-500' : 'bg-red-500'} inline-block`}></span>
              Status: {item.available ? 'Available Now at Bole' : 'Sold Out for the Day'}
            </span>
          </div>
        </div>
      </div>

      {/* Related Menu Items Section */}
      {relatedItems.length > 0 && (
        <div className="mt-12">
          <h3 className="text-white font-sans font-black text-lg md:text-xl tracking-tight mb-4 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#FF6B00]" />
            Complete Your Platter
          </h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {relatedItems.map(relItem => (
              <div 
                key={relItem.id}
                onClick={() => onSelect(relItem)}
                className="bg-[#1E1E1E] border border-[#2A2A2A] rounded-xl overflow-hidden p-2.5 cursor-pointer hover:border-[#FF6B00]/40 transition-all group flex gap-3 h-full items-center"
              >
                <div className="w-16 h-16 rounded-lg overflow-hidden bg-[#121212] flex-shrink-0">
                  <img 
                    src={relItem.image} 
                    alt={relItem.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      e.currentTarget.src = 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=800';
                    }}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-white font-sans font-bold text-xs group-hover:text-[#FF6B00] transition-colors truncate">
                    {relItem.name}
                  </h4>
                  <span className="text-[#FF6B00] font-mono text-xs font-bold">
                    {relItem.price} ETB
                  </span>
                  <p className="text-[10px] text-[#BDBDBD] line-clamp-1 mt-0.5">{relItem.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
