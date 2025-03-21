
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Shield, Medal, Award, Check } from 'lucide-react';

interface CertificationSectionProps {
  certifications?: string[];
}

const CertificationSection: React.FC<CertificationSectionProps> = ({ certifications = [] }) => {
  const getCertificationIcon = (certification: string) => {
    const lowerCert = certification.toLowerCase();
    if (lowerCert.includes('organic')) return <Shield className="h-5 w-5" />;
    if (lowerCert.includes('fair')) return <Medal className="h-5 w-5" />;
    if (lowerCert.includes('eco')) return <Award className="h-5 w-5" />;
    return <Check className="h-5 w-5" />;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Award className="h-5 w-5" /> Certifications
        </CardTitle>
      </CardHeader>
      <CardContent>
        {certifications && certifications.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {certifications.map((cert, index) => (
              <Badge key={index} variant="outline" className="flex items-center gap-1 px-3 py-1">
                {getCertificationIcon(cert)}
                <span>{cert}</span>
              </Badge>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground">No certifications available</p>
        )}
      </CardContent>
    </Card>
  );
};

export default CertificationSection;
