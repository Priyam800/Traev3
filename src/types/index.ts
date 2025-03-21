
export type UserRole = 'farmer' | 'consumer';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  imageUrl?: string;
  location?: string;
  speciality?: string;
  rating?: number;
  description?: string;
  verified?: boolean;
  createdAt: string;
  qrCodeUrl?: string;
}

export interface Profile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  description: string;
  location: string;
  speciality: string;
  avatarUrl: string;
  rating: number;
  verified: boolean;
  createdAt: string; // Now required to match User interface
  qrCodeUrl?: string; // Added to match User interface
}

export interface ProfileQRCode {
  id: string;
  profileId: string;
  qrData: string;
  createdAt: string;
  updatedAt: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  discountPrice?: number;
  category: 'vegetables' | 'fruits' | 'grains' | 'dairy' | 'other';
  farmerId: string;
  farmerName: string;
  imageUrl: string;
  rating: number;
  verified: boolean;
  ecoPassportId: string;
  stock: number;
  unit: string;
  organic: boolean;
  createdAt: string;
}

export interface EcoPassport {
  id: string;
  farmerId: string;
  productId?: string;
  certifications: string[];
  sustainabilityScore: number;
  carbonFootprint: number;
  waterUsage: number;
  transportDistance: number;
  harvestDate: string;
  expiryDate: string;
  qrCodeUrl: string;
}

export interface CartItem {
  productId: string;
  quantity: number;
  product: Product;
}

export interface Post {
  id: string;
  title: string;
  content: string;
  authorId: string;
  authorName: string;
  authorRole: UserRole;
  authorImageUrl?: string;
  createdAt: string;
  likes: number;
  comments: number;
  tags: string[];
}

export interface Event {
  id: string;
  title: string;
  description: string;
  location: string;
  date: string;
  organizer: string;
  imageUrl?: string;
  attendees: number;
}
