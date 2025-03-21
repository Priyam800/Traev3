
import React from 'react';
import { 
  ShieldCheck, Scan, Link, Leaf, 
  Calendar, Users, Award, Truck 
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description }) => {
  return (
    <Card className="card-hover border border-slate-200 overflow-hidden">
      <CardContent className="p-6 flex flex-col items-start">
        <div className="rounded-lg bg-primary/10 p-3 mb-4">
          {icon}
        </div>
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
};

const FeaturesSection: React.FC = () => {
  const features = [
    {
      icon: <ShieldCheck className="h-6 w-6 text-primary" />,
      title: 'Farmer Verification',
      description: 'Every farmer undergoes a rigorous verification process to ensure adherence to sustainable farming practices.',
    },
    {
      icon: <Scan className="h-6 w-6 text-primary" />,
      title: 'Product Traceability',
      description: 'Every product comes with an EcoPassport—a digital document accessible via QR code showing its journey.',
    },
    {
      icon: <Link className="h-6 w-6 text-primary" />,
      title: 'Direct Market Connection',
      description: 'Farmers list products, set fair prices, and receive payments directly. Consumers buy directly from source.',
    },
    {
      icon: <Leaf className="h-6 w-6 text-primary" />,
      title: 'Zero-Waste Marketplace',
      description: 'Dedicated section for "second chance" produce sold at discounted prices to minimize food waste.',
    },
    {
      icon: <Calendar className="h-6 w-6 text-primary" />,
      title: 'Harvest-to-Home Pre-Orders',
      description: "Consumers can secure future harvests directly from farmers before they're even harvested.",
    },
    {
      icon: <Truck className="h-6 w-6 text-primary" />,
      title: 'Sustainable Delivery',
      description: 'Eco-friendly delivery options optimized for reduced carbon footprint and minimal packaging.',
    },
    {
      icon: <Users className="h-6 w-6 text-primary" />,
      title: 'Farmer-Consumer Collaboration',
      description: 'A social platform where farmers and consumers interact, share stories, and collaborate.',
    },
    {
      icon: <Award className="h-6 w-6 text-primary" />,
      title: 'Quality Guarantee',
      description: 'We stand behind the quality of all products with our satisfaction guarantee and consumer protection.',
    },
  ];

  return (
    <section className="py-20 bg-slate-50">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl font-bold mb-4">
            How AgriTrust Transforms Food Systems
          </h2>
          <p className="text-muted-foreground">
            Our platform bridges the gap between sustainable farmers and conscious consumers
            through transparency, technology, and trust.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
