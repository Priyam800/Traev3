
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Droplets, Truck, TreePine, Thermometer } from 'lucide-react';
import { EcoPassport } from '@/types';

interface ReportingSectionProps {
  ecoData?: Partial<EcoPassport>;
}

const ReportingSection: React.FC<ReportingSectionProps> = ({ ecoData }) => {
  const maxCarbonFootprint = 1000; // Example maximum values for normalization
  const maxWaterUsage = 5000;
  const maxTransportDistance = 200;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TreePine className="h-5 w-5" /> Sustainability Metrics
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Thermometer className="h-4 w-4 text-amber-500" />
              <span>Carbon Footprint</span>
            </div>
            <span className="text-sm font-medium">
              {ecoData?.carbonFootprint || 0} kg CO₂
            </span>
          </div>
          <Progress 
            value={Math.min(((ecoData?.carbonFootprint || 0) / maxCarbonFootprint) * 100, 100)} 
            className="h-2" 
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Droplets className="h-4 w-4 text-blue-500" />
              <span>Water Usage</span>
            </div>
            <span className="text-sm font-medium">
              {ecoData?.waterUsage || 0} liters
            </span>
          </div>
          <Progress 
            value={Math.min(((ecoData?.waterUsage || 0) / maxWaterUsage) * 100, 100)} 
            className="h-2"
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Truck className="h-4 w-4 text-green-500" />
              <span>Transport Distance</span>
            </div>
            <span className="text-sm font-medium">
              {ecoData?.transportDistance || 0} km
            </span>
          </div>
          <Progress 
            value={Math.min(((ecoData?.transportDistance || 0) / maxTransportDistance) * 100, 100)} 
            className="h-2"
          />
        </div>

        <div className="mt-4 rounded-md bg-muted p-3">
          <div className="flex items-center justify-between">
            <span className="font-medium">Overall Sustainability Score</span>
            <span className="text-lg font-bold text-green-600">
              {ecoData?.sustainabilityScore?.toFixed(1) || "N/A"}/10
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ReportingSection;
