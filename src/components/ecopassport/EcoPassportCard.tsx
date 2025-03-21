
import React from 'react';
import { EcoPassport } from '@/types';
import { Leaf, Droplet, Truck, Calendar, Award } from 'lucide-react';
import { QRCode } from 'react-qrcode';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

interface EcoPassportCardProps {
  ecoPassport: EcoPassport;
  farmerId: string;
  farmerName: string;
}

// Create a component to render the QR code
const QRCodeRenderer: React.FC<{ value: string }> = ({ value }) => {
  return (
    <div className="p-3 bg-white rounded-lg inline-flex">
      <QRCode
        value={value}
        size={120}
        style={{ height: "auto", maxWidth: "100%", width: "100%" }}
      />
    </div>
  );
};

const EcoPassportCard: React.FC<EcoPassportCardProps> = ({ 
  ecoPassport, 
  farmerId,
  farmerName
}) => {
  return (
    <Card className="overflow-hidden border-2">
      <CardHeader className="bg-agri-green/10 pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Leaf className="h-5 w-5 text-agri-green" />
            <CardTitle className="text-lg font-medium">EcoPassport™</CardTitle>
          </div>
          <Badge variant="outline" className="bg-white">
            ID: {ecoPassport.id.slice(0, 8)}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="pt-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left column - Sustainability metrics */}
          <div className="space-y-5 col-span-2">
            <div>
              <h3 className="text-sm font-medium mb-2">Sustainability Score</h3>
              <div className="flex items-center space-x-4">
                <Progress 
                  value={ecoPassport.sustainabilityScore * 10} 
                  className="h-2"
                />
                <span className="text-sm font-medium">
                  {ecoPassport.sustainabilityScore}/10
                </span>
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-muted/30 p-3 rounded-lg">
                <div className="flex items-center space-x-2 mb-1.5">
                  <svg 
                    className="h-4 w-4 text-agri-green" 
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path 
                      d="M21 8L14 15L9 10L3 16M21 8H17M21 8V12"
                      stroke="currentColor" 
                      strokeWidth="2" 
                      strokeLinecap="round" 
                      strokeLinejoin="round"
                    />
                  </svg>
                  <h4 className="text-sm font-medium">Carbon Footprint</h4>
                </div>
                <p className="text-sm text-muted-foreground">
                  {ecoPassport.carbonFootprint} kg CO₂e
                </p>
              </div>
              
              <div className="bg-muted/30 p-3 rounded-lg">
                <div className="flex items-center space-x-2 mb-1.5">
                  <Droplet className="h-4 w-4 text-agri-green" />
                  <h4 className="text-sm font-medium">Water Usage</h4>
                </div>
                <p className="text-sm text-muted-foreground">
                  {ecoPassport.waterUsage} liters
                </p>
              </div>
              
              <div className="bg-muted/30 p-3 rounded-lg">
                <div className="flex items-center space-x-2 mb-1.5">
                  <Truck className="h-4 w-4 text-agri-green" />
                  <h4 className="text-sm font-medium">Transport Distance</h4>
                </div>
                <p className="text-sm text-muted-foreground">
                  {ecoPassport.transportDistance} km
                </p>
              </div>
              
              <div className="bg-muted/30 p-3 rounded-lg">
                <div className="flex items-center space-x-2 mb-1.5">
                  <Calendar className="h-4 w-4 text-agri-green" />
                  <h4 className="text-sm font-medium">Harvest Date</h4>
                </div>
                <p className="text-sm text-muted-foreground">
                  {new Date(ecoPassport.harvestDate).toLocaleDateString()}
                </p>
              </div>
            </div>
            
            <div>
              <h3 className="text-sm font-medium mb-2">Certifications</h3>
              <div className="flex flex-wrap gap-2">
                {ecoPassport.certifications.map((cert, index) => (
                  <Badge key={index} variant="outline" className="bg-muted/30">
                    <Award className="h-3 w-3 mr-1 text-agri-green" />
                    {cert}
                  </Badge>
                ))}
              </div>
            </div>
            
            <div>
              <h3 className="text-sm font-medium mb-2">Produced By</h3>
              <div className="bg-muted/30 p-3 rounded-lg">
                <p className="text-sm">
                  {farmerName} (Farmer ID: {farmerId.slice(0, 8)})
                </p>
              </div>
            </div>
          </div>
          
          {/* Right column - QR Code */}
          <div className="flex flex-col items-center justify-start space-y-3">
            <QRCodeRenderer value={`https://agritrust.com/ecopassport/${ecoPassport.id}`} />
            <div className="text-center">
              <p className="text-xs text-muted-foreground">
                Scan to verify authenticity
              </p>
            </div>
            <div className="text-center mt-4">
              <h4 className="text-sm font-medium">Valid Until</h4>
              <p className="text-sm text-muted-foreground">
                {new Date(ecoPassport.expiryDate).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EcoPassportCard;
