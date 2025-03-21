
import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Star, CheckCircle } from 'lucide-react';
import { User } from '@/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface FarmerCardProps {
  farmer: User;
}

const FarmerCard: React.FC<FarmerCardProps> = ({ farmer }) => {
  return (
    <div className="rounded-xl border bg-card text-card-foreground shadow-sm overflow-hidden transition-all hover:shadow-md">
      <div className="relative h-40 overflow-hidden">
        {/* Cover Image - using a gradient background as fallback */}
        <div className="absolute inset-0 bg-gradient-to-r from-agri-green/20 to-agri-green/10"></div>
        
        {/* Verified Badge */}
        {farmer.verified && (
          <div className="absolute top-3 right-3 z-10">
            <Badge className="bg-agri-green border-none text-white">
              <CheckCircle className="h-3 w-3 mr-1" /> Verified
            </Badge>
          </div>
        )}
        
        {/* Farmer Avatar */}
        <div className="absolute -bottom-12 left-4">
          <Avatar className="h-24 w-24 border-4 border-white shadow-sm">
            <AvatarImage src={farmer.imageUrl} alt={farmer.name} />
            <AvatarFallback className="bg-primary text-primary-foreground text-xl">
              {farmer.name.charAt(0)}
            </AvatarFallback>
          </Avatar>
        </div>
      </div>
      
      <div className="p-6 pt-16">
        <div className="space-y-1.5 mb-3">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-lg">{farmer.name}</h3>
            
            {/* Rating */}
            {farmer.rating && (
              <div className="flex items-center">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                <span className="text-sm font-medium">{farmer.rating.toFixed(1)}</span>
              </div>
            )}
          </div>
          
          {/* Location */}
          {farmer.location && (
            <div className="flex items-center text-muted-foreground text-sm">
              <MapPin className="h-3.5 w-3.5 mr-1" />
              <span>{farmer.location}</span>
            </div>
          )}
        </div>
        
        {/* Speciality */}
        {farmer.speciality && (
          <div className="mb-4">
            <Badge variant="outline" className="rounded-full px-2.5">
              {farmer.speciality}
            </Badge>
          </div>
        )}
        
        {/* Description */}
        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
          {farmer.description || "Sustainable farmer committed to organic practices and ethical farming methods."}
        </p>
        
        {/* Action Button */}
        <Button 
          asChild 
          variant="outline" 
          className="w-full mt-2"
        >
          <Link to={`/farmers/${farmer.id}`}>
            View Profile
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default FarmerCard;
