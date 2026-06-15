export interface Category {
  id: string;
  name: string;
  icon: string; // Lucide icon name
}

export interface MenuItem {
  id: string;
  name: string;
  category: string; // Category.id or Category.name
  description: string;
  ingredients: string[];
  calories?: string;
  protein?: string;
  carbs?: string;
  fat?: string;
  price: number; // in ETB
  image: string;
  available: boolean;
  featured: boolean;
}

export interface RestaurantSettings {
  name: string;
  logo: string;
  address: string;
  phone: string;
  facebook: string;
  instagram: string;
  telegram: string;
  tiktok: string;
}

export type ViewState = 'menu' | 'details' | 'favorites' | 'login' | 'admin';

export type AdminTab = 'dashboard' | 'categories' | 'items' | 'settings';
