
import React, { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import FarmerCard from '@/components/farmers/FarmerCard';
import { User, UserRole } from '@/types';
import { Input } from '@/components/ui/input';
import { Loader2, Search, Edit } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { useAuth } from '@/context/AuthContext';
import FarmerProfileForm from '@/components/farmers/FarmerProfileForm';

const Farmers: React.FC = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [locationFilter, setLocationFilter] = useState('All Locations');
  const [specialityFilter, setSpecialityFilter] = useState('All Specialities');
  const [isProfileDialogOpen, setIsProfileDialogOpen] = useState(false);
  
  // Fetch farmers from Supabase
  const { data, isLoading, refetch } = useQuery({
    queryKey: ['farmers'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('role', 'farmer');
      
      if (error) {
        toast({
          variant: 'destructive',
          title: 'Error fetching farmers',
          description: error.message,
        });
        throw error;
      }
      
      // Map the database response to our User type
      const farmers: User[] = data.map(profile => ({
        id: profile.id,
        name: profile.name,
        email: profile.email,
        role: profile.role as UserRole,
        imageUrl: profile.avatar_url,
        location: profile.location || undefined,
        speciality: profile.speciality || undefined,
        description: profile.description || undefined,
        verified: profile.verified || false,
        rating: profile.rating || undefined,
        createdAt: profile.created_at,
      }));
      
      // Extract unique locations and specialities for filters
      const uniqueLocations = [...new Set(farmers.map(f => f.location).filter(Boolean))];
      const uniqueSpecialities = [...new Set(farmers.map(f => f.speciality).filter(Boolean))];
      
      return {
        farmers,
        locations: ['All Locations', ...uniqueLocations],
        specialities: ['All Specialities', ...uniqueSpecialities]
      };
    },
  });
  
  // Filter farmers based on search and filters
  const filteredFarmers = React.useMemo(() => {
    if (!data?.farmers) return [];
    
    let filtered = [...data.farmers];
    
    // Apply search query
    if (searchQuery) {
      const searchLower = searchQuery.toLowerCase();
      filtered = filtered.filter(
        farmer => 
          farmer.name.toLowerCase().includes(searchLower) ||
          farmer.description?.toLowerCase().includes(searchLower) ||
          farmer.speciality?.toLowerCase().includes(searchLower)
      );
    }
    
    // Apply location filter
    if (locationFilter !== 'All Locations') {
      filtered = filtered.filter(farmer => farmer.location === locationFilter);
    }
    
    // Apply speciality filter
    if (specialityFilter !== 'All Specialities') {
      filtered = filtered.filter(farmer => farmer.speciality === specialityFilter);
    }
    
    return filtered;
  }, [data?.farmers, searchQuery, locationFilter, specialityFilter]);
  
  // Handle search input
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };
  
  const handleProfileUpdated = () => {
    setIsProfileDialogOpen(false);
    refetch();
    toast({
      title: 'Profile updated',
      description: 'Your farmer profile has been updated successfully',
    });
  };
  
  // Check if the current user is a farmer
  const isFarmer = user && user.user_metadata?.role === 'farmer';
  
  // Check if the current user is editing their own profile
  const canEditProfile = (farmerId: string) => {
    return user && user.id === farmerId;
  };
  
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Our Farmers</h1>
            <p className="text-muted-foreground">
              Meet the dedicated farmers who grow your food with sustainable practices
            </p>
          </div>
        </div>
        
        {/* Search and Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="relative col-span-1 md:col-span-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search farmers..."
              className="pl-10"
              value={searchQuery}
              onChange={handleSearch}
            />
          </div>
          
          <div className="col-span-1">
            <Select
              value={locationFilter}
              onValueChange={setLocationFilter}
            >
              <SelectTrigger>
                <SelectValue placeholder="Filter by location" />
              </SelectTrigger>
              <SelectContent>
                {data?.locations.map((location) => (
                  <SelectItem key={location} value={location}>
                    {location}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="col-span-1">
            <Select
              value={specialityFilter}
              onValueChange={setSpecialityFilter}
            >
              <SelectTrigger>
                <SelectValue placeholder="Filter by speciality" />
              </SelectTrigger>
              <SelectContent>
                {data?.specialities.map((speciality) => (
                  <SelectItem key={speciality} value={speciality}>
                    {speciality}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        {/* Farmers Grid */}
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : filteredFarmers.length === 0 ? (
          <div className="text-center py-12 bg-muted/30 rounded-lg">
            <h3 className="text-lg font-medium mb-2">No Farmers Found</h3>
            <p className="text-muted-foreground">
              Try adjusting your filters or search query
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredFarmers.map(farmer => (
              <div key={farmer.id} className="relative">
                <FarmerCard farmer={farmer} />
                {canEditProfile(farmer.id) && (
                  <Button
                    className="absolute top-2 right-2"
                    size="icon"
                    variant="outline"
                    onClick={() => setIsProfileDialogOpen(true)}
                    title="Edit your profile"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
          </div>
        )}
        
        {/* Farmer Profile Edit Dialog - only shown to farmers editing their own profile */}
        {user && (
          <Dialog open={isProfileDialogOpen} onOpenChange={setIsProfileDialogOpen}>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Edit Farmer Profile</DialogTitle>
                <DialogDescription>
                  Update your farmer profile information
                </DialogDescription>
              </DialogHeader>
              <FarmerProfileForm onSuccess={handleProfileUpdated} />
            </DialogContent>
          </Dialog>
        )}
      </div>
    </MainLayout>
  );
};

export default Farmers;
