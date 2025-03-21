
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Leaf, ShieldCheck, BarChart3, Truck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const HeroSection: React.FC = () => {
  return (
    <div className="relative overflow-hidden pt-16 pb-32">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMwMDAwMDAiIGZpbGwtb3BhY2l0eT0iMC4wMSI+PHBhdGggZD0iTTM2IDM0djZoNnYtNmgtNnptNi02aDZ2LTZoLTZ2NnptLTEyIDZoNnYtNmgtNnY2em0xMiAwaDZ2LTZoLTZ2NnptLTZoNnYtNmgtNnY2em0xMiAwaDZ2LTZoLTZ2NnptLTEyIDEyaDZ2LTZoLTZ2NnptMTIgMGg2di02aC02djZ6bS0xMiA2aDZ2LTZoLTZ2NnptMTIgMGg2di02aC02djZ6bS0xMiA2aDZ2LTZoLTZ2NnptMTIgMGg2di02aC02djZ6TTI0IDYwaDZ2LTZoLTZ2NnptMTIgMGg2di02aC02djZ6bS0xMi0xMmg2di02aC02djZ6bTEyIDBoNnYtNmgtNnY2em0tMTIgMTJoNnYtNmgtNnY2em0xMiAwaDZ2LTZoLTZ2NnptLTI0LTEyaDZ2LTZoLTZ2NnptMTIgMGg2di02aC02djZ6bS0xMiAxMmg2di02aC02djZ6bTEyIDBoNnYtNmgtNnY2em0tMTIgNmg2di02aC02djZ6bTEyIDBoNnYtNmgtNnY2eiIvPjwvZz48L2c+PC9zdmc+')] opacity-5"></div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
          {/* Content */}
          <div className="lg:w-1/2 space-y-8">
            <Badge className="px-3 py-1 text-xs bg-agri-green/10 text-agri-green hover:bg-agri-green/20 border-none">
              Sustainable Agriculture Marketplace
            </Badge>
            
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight">
              From Farm to Table,
              <br />
              <span className="text-agri-green">with Transparency</span>
            </h1>
            
            <p className="text-lg text-muted-foreground max-w-xl">
              Connect directly with local farmers, track the origin of your food with
              our unique EcoPassport system, and support sustainable agriculture.
            </p>
            
            <div className="flex flex-wrap gap-4">
              <Button 
                className="bg-agri-green hover:bg-agri-darkGreen text-white px-6"
                size="lg"
                asChild
              >
                <Link to="/marketplace">
                  Explore Marketplace
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              
              <Button 
                variant="outline" 
                size="lg" 
                asChild
              >
                <Link to="/farmers">
                  Meet Our Farmers
                </Link>
              </Button>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6 pt-8">
              <div className="flex items-center space-x-2">
                <ShieldCheck className="w-5 h-5 text-agri-green" />
                <span className="text-sm font-medium">Verified Farmers</span>
              </div>
              <div className="flex items-center space-x-2">
                <Leaf className="w-5 h-5 text-agri-green" />
                <span className="text-sm font-medium">Organic Products</span>
              </div>
              <div className="flex items-center space-x-2">
                <BarChart3 className="w-5 h-5 text-agri-green" />
                <span className="text-sm font-medium">Transparent Pricing</span>
              </div>
              <div className="flex items-center space-x-2">
                <Truck className="w-5 h-5 text-agri-green" />
                <span className="text-sm font-medium">Sustainable Delivery</span>
              </div>
              <div className="flex items-center space-x-2">
                <svg className="w-5 h-5 text-agri-green" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="currentColor" />
                </svg>
                <span className="text-sm font-medium">5-Star Rated</span>
              </div>
              <div className="flex items-center space-x-2">
                <svg className="w-5 h-5 text-agri-green" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20 14H18V10H20V14ZM4 14H6V10H4V14ZM15 15C15 16.66 13.66 18 12 18C10.34 18 9 16.66 9 15V9C9 7.34 10.34 6 12 6C13.66 6 15 7.34 15 9V15Z" fill="currentColor" />
                  <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20Z" fill="currentColor" />
                </svg>
                <span className="text-sm font-medium">Zero Waste</span>
              </div>
            </div>
          </div>
          
          {/* Hero Image */}
          <div className="lg:w-1/2 relative">
            <div className="relative rounded-2xl overflow-hidden shadow-glossy border border-white/20">
              <img 
                src="https://images.unsplash.com/photo-1605000797499-95a51c5269ae?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                alt="Sustainable farming" 
                className="w-full h-[500px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
              
              {/* EcoPassport Badge */}
              <div className="absolute bottom-6 left-6 right-6 glass-card p-4 rounded-xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="bg-agri-green rounded-full p-2">
                      <Leaf className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-medium text-sm">EcoPassport™</h3>
                      <p className="text-xs text-muted-foreground">Track farm to table journey</p>
                    </div>
                  </div>
                  <Button size="sm" className="bg-white text-agri-green hover:bg-agri-green hover:text-white">
                    Learn More
                  </Button>
                </div>
              </div>
            </div>
            
            {/* Stats Card */}
            <div className="absolute -bottom-8 -right-8 glass-card p-5 rounded-xl w-64 shadow-glossy">
              <div className="space-y-4">
                <div className="space-y-1">
                  <div className="text-xs text-muted-foreground">Farmers Onboarded</div>
                  <div className="text-2xl font-bold">2,500+</div>
                </div>
                <div className="space-y-1">
                  <div className="text-xs text-muted-foreground">Products Available</div>
                  <div className="text-2xl font-bold">10,000+</div>
                </div>
                <div className="space-y-1">
                  <div className="text-xs text-muted-foreground">Happy Customers</div>
                  <div className="text-2xl font-bold">15,000+</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
