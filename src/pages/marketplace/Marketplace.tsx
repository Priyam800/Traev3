
import React, { useState, useEffect } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import ProductCard from '@/components/marketplace/ProductCard';
import ProductFilters, { ProductFilters as FilterTypes } from '@/components/marketplace/ProductFilters';
import { Product } from '@/types';
import { Input } from '@/components/ui/input';
import { Loader2, Search, Plus } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import AddProductForm from '@/components/marketplace/AddProductForm';
import { useAuth } from '@/context/AuthContext';

const Marketplace: React.FC = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const isMobile = useIsMobile();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilters, setActiveFilters] = useState<FilterTypes>({
    categories: [],
    priceRange: [0, 100],
    organic: false,
    verified: false,
    inStock: true,
    rating: null,
  });
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  
  // Helper function to validate category
  const validateCategory = (category: string): 'vegetables' | 'fruits' | 'grains' | 'dairy' | 'other' => {
    const validCategories = ['vegetables', 'fruits', 'grains', 'dairy', 'other'] as const;
    return validCategories.includes(category as any) 
      ? (category as 'vegetables' | 'fruits' | 'grains' | 'dairy' | 'other') 
      : 'other';
  };
  
  // Fetch products from Supabase
  const { data: products = [], isLoading, refetch } = useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*, profiles:farmer_id(name)');
      
      if (error) {
        toast({
          variant: 'destructive',
          title: 'Error fetching products',
          description: error.message,
        });
        throw error;
      }
      
      // Map the database response to our Product type
      return data.map(item => ({
        id: item.id,
        name: item.name,
        description: item.description,
        price: item.price,
        discountPrice: item.discount_price,
        category: validateCategory(item.category),
        farmerId: item.farmer_id,
        farmerName: item.profiles?.name || 'Unknown Farmer',
        imageUrl: item.image_url,
        rating: item.rating || 0,
        verified: item.verified || false,
        ecoPassportId: item.eco_passport_id,
        stock: item.stock,
        unit: item.unit,
        organic: item.organic || false,
        createdAt: item.created_at,
      }));
    },
  });
  
  // Filter products based on search and filters
  const filteredProducts = React.useMemo(() => {
    if (!products) return [];
    
    let filtered = [...products];
    
    // Apply search query
    if (searchQuery) {
      const searchLower = searchQuery.toLowerCase();
      filtered = filtered.filter(
        product => 
          product.name.toLowerCase().includes(searchLower) ||
          product.description.toLowerCase().includes(searchLower) ||
          product.farmerName.toLowerCase().includes(searchLower)
      );
    }
    
    // Apply category filter
    if (activeFilters.categories.length > 0) {
      filtered = filtered.filter(product => 
        activeFilters.categories.includes(product.category)
      );
    }
    
    // Apply price range filter
    filtered = filtered.filter(product => {
      const productPrice = product.discountPrice || product.price;
      return productPrice >= activeFilters.priceRange[0] && productPrice <= activeFilters.priceRange[1];
    });
    
    // Apply organic filter
    if (activeFilters.organic) {
      filtered = filtered.filter(product => product.organic);
    }
    
    // Apply verified filter
    if (activeFilters.verified) {
      filtered = filtered.filter(product => product.verified);
    }
    
    // Apply in stock filter
    if (activeFilters.inStock) {
      filtered = filtered.filter(product => product.stock > 0);
    }
    
    // Apply rating filter
    if (activeFilters.rating !== null) {
      filtered = filtered.filter(product => product.rating >= activeFilters.rating!);
    }
    
    return filtered;
  }, [products, searchQuery, activeFilters]);
  
  // Handle filter changes
  const handleFilterChange = (filters: FilterTypes) => {
    setActiveFilters(filters);
  };
  
  // Handle search
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };
  
  const handleProductAdded = () => {
    setIsAddProductOpen(false);
    refetch();
    toast({
      title: 'Product added',
      description: 'Your product has been added successfully',
    });
  };
  
  const isFarmer = user?.user_metadata?.role === 'farmer';
  
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Marketplace</h1>
            <p className="text-muted-foreground">
              Discover fresh, sustainable produce directly from local farmers
            </p>
          </div>
          
          {isFarmer && (
            <Button
              onClick={() => setIsAddProductOpen(true)}
              className="mt-4 sm:mt-0"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Product
            </Button>
          )}
        </div>
        
        {/* Search Bar */}
        <div className="mb-8 relative">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search for products, farms, or categories..."
              className="pl-10"
              value={searchQuery}
              onChange={handleSearch}
            />
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row">
          {/* Filters */}
          <ProductFilters onFilterChange={handleFilterChange} />
          
          {/* Products Grid */}
          <div className="flex-1">
            {isLoading ? (
              <div className="flex items-center justify-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-12 bg-muted/30 rounded-lg">
                <h3 className="text-lg font-medium mb-2">No Products Found</h3>
                <p className="text-muted-foreground">
                  Try adjusting your filters or search query
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map(product => (
                  <ProductCard key={product.id} product={product} onUpdate={refetch} />
                ))}
              </div>
            )}
          </div>
        </div>
        
        {/* Add Product Dialog */}
        <Dialog open={isAddProductOpen} onOpenChange={setIsAddProductOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Add New Product</DialogTitle>
              <DialogDescription>
                Create a new product to sell in the marketplace
              </DialogDescription>
            </DialogHeader>
            <AddProductForm onSuccess={handleProductAdded} />
          </DialogContent>
        </Dialog>
      </div>
    </MainLayout>
  );
};

export default Marketplace;
