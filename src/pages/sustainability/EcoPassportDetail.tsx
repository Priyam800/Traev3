
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Leaf, ChevronLeft, Download, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import MainLayout from '@/components/layout/MainLayout';
import { supabase } from '@/integrations/supabase/client';
import { EcoPassport } from '@/types';
import EcoPassportCard from '@/components/ecopassport/EcoPassportCard';

const EcoPassportDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Fetch eco passport details
  const { data, isLoading, error } = useQuery({
    queryKey: ['ecoPassport', id],
    queryFn: async () => {
      // First fetch the eco passport
      const { data: passport, error: passportError } = await supabase
        .from('eco_passports')
        .select('*')
        .eq('id', id)
        .single();
        
      if (passportError) {
        toast({
          variant: 'destructive',
          title: 'Error fetching eco passport',
          description: passportError.message,
        });
        throw passportError;
      }
      
      // Then fetch related product and farmer info
      const { data: product, error: productError } = await supabase
        .from('products')
        .select('name, farmer_id')
        .eq('eco_passport_id', id)
        .single();
        
      if (productError && productError.code !== 'PGRST116') {
        // PGRST116 is "no rows returned" - which is fine, it might not be linked to a product
        toast({
          variant: 'destructive',
          title: 'Error fetching product details',
          description: productError.message,
        });
      }
      
      // Get farmer name if we have a farmer_id
      let farmerName = 'Unknown Farmer';
      if (product?.farmer_id) {
        const { data: farmer } = await supabase
          .from('profiles')
          .select('name')
          .eq('id', product.farmer_id)
          .single();
          
        if (farmer) {
          farmerName = farmer.name;
        }
      }
      
      // Map the snake_case database fields to camelCase for our TypeScript types
      const mappedPassport: EcoPassport = {
        id: passport.id,
        farmerId: passport.farmer_id,
        productId: passport.product_id,
        certifications: passport.certifications || [],
        sustainabilityScore: passport.sustainability_score,
        carbonFootprint: passport.carbon_footprint,
        waterUsage: passport.water_usage,
        transportDistance: passport.transport_distance,
        harvestDate: passport.harvest_date,
        expiryDate: passport.expiry_date,
        qrCodeUrl: passport.qr_code_url,
      };
      
      return {
        ecoPassport: mappedPassport,
        productName: product?.name || 'Unknown Product',
        farmerId: product?.farmer_id || 'unknown',
        farmerName
      };
    },
    enabled: !!id,
  });

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast({
      title: 'Link copied to clipboard',
      description: 'You can now share this EcoPassport with others',
    });
  };

  const handleDownload = () => {
    // In a real app, you'd generate a PDF or image here
    toast({
      title: 'Download started',
      description: 'Your EcoPassport will be downloaded shortly',
    });
  };

  if (isLoading) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 w-48 bg-muted rounded mb-8"></div>
            <div className="h-96 bg-muted rounded"></div>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (error || !data) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-16">
            <h2 className="text-2xl font-bold mb-2">Eco Passport Not Found</h2>
            <p className="text-muted-foreground mb-6">
              We couldn't find the eco passport you're looking for.
            </p>
            <Button onClick={() => navigate('/sustainability')}>
              Return to Sustainability
            </Button>
          </div>
        </div>
      </MainLayout>
    );
  }

  const { ecoPassport, farmerId, farmerName } = data;

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div className="flex items-center">
            <Button 
              variant="ghost" 
              size="sm" 
              className="mr-2" 
              onClick={() => navigate('/sustainability')}
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Back
            </Button>
            <h1 className="text-2xl font-bold">Eco Passport Details</h1>
          </div>
          <div className="flex space-x-2 mt-4 sm:mt-0">
            <Button variant="outline" size="sm" onClick={handleShare}>
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
            <Button size="sm" onClick={handleDownload}>
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
          </div>
        </div>

        <EcoPassportCard 
          ecoPassport={ecoPassport} 
          farmerId={farmerId} 
          farmerName={farmerName}
        />
        
        <div className="mt-8 bg-card rounded-lg border p-6">
          <h2 className="text-xl font-semibold mb-4">About Eco Passports</h2>
          <p className="text-muted-foreground mb-4">
            Eco Passports provide transparent, verified information about the environmental impact 
            of agricultural products. They track sustainability metrics like carbon footprint, 
            water usage, and transport distances to help consumers make informed choices.
          </p>
          <h3 className="font-medium mt-6 mb-2">How to interpret this data:</h3>
          <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
            <li><span className="font-medium text-foreground">Sustainability Score:</span> A holistic rating from 1-10 combining all environmental factors</li>
            <li><span className="font-medium text-foreground">Carbon Footprint:</span> The total greenhouse gas emissions produced (lower is better)</li>
            <li><span className="font-medium text-foreground">Water Usage:</span> Amount of water used in production (lower is better)</li>
            <li><span className="font-medium text-foreground">Transport Distance:</span> How far the product traveled from farm to market (lower is better)</li>
            <li><span className="font-medium text-foreground">Certifications:</span> Official sustainability and organic certifications the product has received</li>
          </ul>
        </div>
      </div>
    </MainLayout>
  );
};

export default EcoPassportDetail;
