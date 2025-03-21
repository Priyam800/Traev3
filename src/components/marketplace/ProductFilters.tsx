import React, { useState } from 'react';
import { Filter, X } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { useIsMobile } from '@/hooks/use-mobile';

interface ProductFiltersProps {
  onFilterChange: (filters: ProductFilters) => void;
}

export interface ProductFilters {
  categories: string[];
  priceRange: [number, number];
  organic: boolean;
  verified: boolean;
  inStock: boolean;
  rating: number | null;
}

const initialFilters: ProductFilters = {
  categories: [],
  priceRange: [0, 100],
  organic: false,
  verified: false,
  inStock: true,
  rating: null,
};

const ProductFilters: React.FC<ProductFiltersProps> = ({ onFilterChange }) => {
  const [filters, setFilters] = useState<ProductFilters>(initialFilters);
  const [open, setOpen] = useState(false);
  const isMobile = useIsMobile();
  
  const categories = [
    { id: 'vegetables', name: 'Vegetables' },
    { id: 'fruits', name: 'Fruits' },
    { id: 'grains', name: 'Grains' },
    { id: 'dairy', name: 'Dairy' },
    { id: 'other', name: 'Other' },
  ];
  
  const handleCategoryChange = (category: string) => {
    const updatedCategories = filters.categories.includes(category)
      ? filters.categories.filter(c => c !== category)
      : [...filters.categories, category];
      
    const updatedFilters = {
      ...filters,
      categories: updatedCategories,
    };
    
    setFilters(updatedFilters);
    onFilterChange(updatedFilters);
  };
  
  const handlePriceChange = (value: number[]) => {
    const updatedFilters = {
      ...filters,
      priceRange: [value[0], value[1]] as [number, number],
    };
    
    setFilters(updatedFilters);
    onFilterChange(updatedFilters);
  };
  
  const handleBooleanFilterChange = (filterName: keyof ProductFilters, value: boolean) => {
    const updatedFilters = {
      ...filters,
      [filterName]: value,
    };
    
    setFilters(updatedFilters);
    onFilterChange(updatedFilters);
  };
  
  const handleRatingChange = (rating: number) => {
    const updatedFilters = {
      ...filters,
      rating: filters.rating === rating ? null : rating,
    };
    
    setFilters(updatedFilters);
    onFilterChange(updatedFilters);
  };
  
  const clearFilters = () => {
    setFilters(initialFilters);
    onFilterChange(initialFilters);
  };
  
  const activeFilterCount = Object.entries(filters).reduce((count, [key, value]) => {
    if (key === 'categories' && (value as string[]).length > 0) return count + 1;
    if (key === 'priceRange' && (JSON.stringify(value) !== JSON.stringify(initialFilters.priceRange))) return count + 1;
    if (key === 'organic' && value === true) return count + 1;
    if (key === 'verified' && value === true) return count + 1;
    if (key === 'inStock' && value === false) return count + 1;
    if (key === 'rating' && value !== null) return count + 1;
    return count;
  }, 0);
  
  const filtersContent = (
    <>
      {/* Categories */}
      <div className="space-y-4">
        <h3 className="font-medium">Categories</h3>
        <div className="space-y-2">
          {categories.map((category) => (
            <div key={category.id} className="flex items-center space-x-2">
              <Checkbox 
                id={`category-${category.id}`} 
                checked={filters.categories.includes(category.id)}
                onCheckedChange={() => handleCategoryChange(category.id)}
              />
              <label 
                htmlFor={`category-${category.id}`}
                className="text-sm cursor-pointer"
              >
                {category.name}
              </label>
            </div>
          ))}
        </div>
      </div>
      
      {/* Price Range */}
      <div className="space-y-4 mt-6">
        <div className="flex items-center justify-between">
          <h3 className="font-medium">Price Range</h3>
          <div className="text-sm text-muted-foreground">
            ${filters.priceRange[0]} - ${filters.priceRange[1]}
          </div>
        </div>
        <Slider
          min={0}
          max={100}
          step={1}
          value={[filters.priceRange[0], filters.priceRange[1]]}
          onValueChange={handlePriceChange}
          className="py-4"
        />
      </div>
      
      {/* Other Filters */}
      <div className="space-y-4 mt-6">
        <h3 className="font-medium">Product Filters</h3>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="filter-organic" 
              checked={filters.organic}
              onCheckedChange={(checked) => 
                handleBooleanFilterChange('organic', checked as boolean)
              }
            />
            <label 
              htmlFor="filter-organic"
              className="text-sm cursor-pointer"
            >
              Organic Only
            </label>
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="filter-verified" 
              checked={filters.verified}
              onCheckedChange={(checked) => 
                handleBooleanFilterChange('verified', checked as boolean)
              }
            />
            <label 
              htmlFor="filter-verified"
              className="text-sm cursor-pointer"
            >
              Verified Farms Only
            </label>
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="filter-instock" 
              checked={filters.inStock}
              onCheckedChange={(checked) => 
                handleBooleanFilterChange('inStock', checked as boolean)
              }
            />
            <label 
              htmlFor="filter-instock"
              className="text-sm cursor-pointer"
            >
              In Stock Only
            </label>
          </div>
        </div>
      </div>
      
      {/* Rating Filter */}
      <div className="space-y-4 mt-6">
        <h3 className="font-medium">Minimum Rating</h3>
        <div className="flex space-x-2">
          {[5, 4, 3, 2, 1].map((rating) => (
            <button
              key={rating}
              onClick={() => handleRatingChange(rating)}
              className={`flex items-center justify-center w-8 h-8 rounded-full border transition-colors ${
                filters.rating === rating 
                  ? 'bg-primary text-white border-primary' 
                  : 'bg-background hover:bg-muted'
              }`}
            >
              {rating}
            </button>
          ))}
        </div>
      </div>
      
      {/* Clear Filters */}
      {activeFilterCount > 0 && (
        <div className="pt-6">
          <Button 
            variant="outline" 
            className="w-full"
            onClick={clearFilters}
          >
            <X className="mr-2 h-4 w-4" />
            Clear All Filters
          </Button>
        </div>
      )}
    </>
  );
  
  return (
    <>
      {isMobile ? (
        <div className="sticky top-20 z-30 bg-white border-b pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <h2 className="font-medium">Filters</h2>
              {activeFilterCount > 0 && (
                <Badge variant="secondary" className="rounded-full px-2 py-0">
                  {activeFilterCount}
                </Badge>
              )}
            </div>
            
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" size="sm">
                  <Filter className="mr-2 h-4 w-4" />
                  Filter
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-full sm:w-96">
                <SheetHeader className="mb-5">
                  <SheetTitle>Filters</SheetTitle>
                  <SheetDescription>
                    Refine your product search with these filters.
                  </SheetDescription>
                </SheetHeader>
                {filtersContent}
              </SheetContent>
            </Sheet>
          </div>
          
          {/* Active Filters */}
          {activeFilterCount > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {filters.categories.map((category) => (
                <Badge 
                  key={category} 
                  variant="secondary"
                  className="rounded-full"
                >
                  {categories.find(c => c.id === category)?.name}
                  <button 
                    onClick={() => handleCategoryChange(category)}
                    className="ml-1 rounded-full hover:bg-muted-foreground/10 p-0.5"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
              
              {filters.organic && (
                <Badge variant="secondary" className="rounded-full">
                  Organic
                  <button 
                    onClick={() => handleBooleanFilterChange('organic', false)}
                    className="ml-1 rounded-full hover:bg-muted-foreground/10 p-0.5"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              )}
              
              {filters.verified && (
                <Badge variant="secondary" className="rounded-full">
                  Verified
                  <button 
                    onClick={() => handleBooleanFilterChange('verified', false)}
                    className="ml-1 rounded-full hover:bg-muted-foreground/10 p-0.5"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              )}
              
              {!filters.inStock && (
                <Badge variant="secondary" className="rounded-full">
                  Include Out of Stock
                  <button 
                    onClick={() => handleBooleanFilterChange('inStock', true)}
                    className="ml-1 rounded-full hover:bg-muted-foreground/10 p-0.5"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              )}
              
              {filters.rating !== null && (
                <Badge variant="secondary" className="rounded-full">
                  {filters.rating}+ Stars
                  <button 
                    onClick={() => handleRatingChange(filters.rating as number)}
                    className="ml-1 rounded-full hover:bg-muted-foreground/10 p-0.5"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              )}
              
              {JSON.stringify(filters.priceRange) !== JSON.stringify(initialFilters.priceRange) && (
                <Badge variant="secondary" className="rounded-full">
                  ${filters.priceRange[0]} - ${filters.priceRange[1]}
                  <button 
                    onClick={() => handlePriceChange([0, 100])}
                    className="ml-1 rounded-full hover:bg-muted-foreground/10 p-0.5"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              )}
            </div>
          )}
        </div>
      ) : (
        <div className="w-64 shrink-0 pr-8">
          <div className="sticky top-24">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-medium text-lg">Filters</h2>
              {activeFilterCount > 0 && (
                <Button 
                  variant="ghost"
                  size="sm"
                  onClick={clearFilters}
                  className="h-8 px-2 text-muted-foreground"
                >
                  Clear all
                </Button>
              )}
            </div>
            
            {filtersContent}
          </div>
        </div>
      )}
    </>
  );
};

export default ProductFilters;
