
import React, { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { EcoPassportQRScanner } from '@/components/ecopassport/EcoPassportQRScanner';
import CertificationSection from '@/components/sustainability/CertificationSection';
import ReportingSection from '@/components/sustainability/ReportingSection';
import { getProfileQRCode, ensureProfileHasQRCode } from '@/services/profileService';
import { fetchEcoPassportByFarmerId } from '@/services/ecopassportService';
import { fetchProfileById } from '@/services/profileService';
import { useAuth } from '@/context/AuthContext';
import { EcoPassport, Profile } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

const Sustainability = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [scanMode, setScanMode] = useState(false);
  const [scannedProfile, setScannedProfile] = useState<Profile | null>(null);
  const [ecoPassport, setEcoPassport] = useState<EcoPassport | null>(null);

  const handleScan = async (data: string) => {
    try {
      const parsedData = JSON.parse(data);
      
      if (!parsedData.profileId) {
        toast({
          title: "Invalid QR Code",
          description: "This QR code doesn't contain valid profile information.",
          variant: "destructive",
        });
        return;
      }
      
      // Fetch profile data
      const profile = await fetchProfileById(parsedData.profileId);
      if (!profile) {
        toast({
          title: "Profile Not Found",
          description: "Could not find the profile associated with this QR code.",
          variant: "destructive",
        });
        return;
      }
      
      setScannedProfile(profile);
      
      // If profile is a farmer, fetch their EcoPassport
      if (profile.role === 'farmer') {
        const passport = await fetchEcoPassportByFarmerId(profile.id);
        setEcoPassport(passport);
      }
      
      setScanMode(false);
      
      toast({
        title: "QR Code Scanned Successfully",
        description: `Viewing profile of ${profile.name}`,
      });
    } catch (error) {
      console.error('Error scanning QR code:', error);
      toast({
        title: "Error Scanning QR Code",
        description: "Please try again with a valid QR code.",
        variant: "destructive",
      });
    }
  };

  const generateQRCode = async () => {
    if (!user) return;
    
    try {
      const qrData = await ensureProfileHasQRCode(user.id);
      
      if (qrData) {
        toast({
          title: "QR Code Generated",
          description: "Your QR code has been generated successfully.",
        });
      }
    } catch (error) {
      console.error('Error generating QR code:', error);
      toast({
        title: "Error Generating QR Code",
        description: "There was an error generating your QR code. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <MainLayout>
      <div className="container py-6">
        <h1 className="mb-6 text-3xl font-bold">Sustainability Center</h1>
        
        {scanMode ? (
          <div className="mb-6">
            <h2 className="mb-4 text-xl font-semibold">Scan QR Code</h2>
            <EcoPassportQRScanner onScan={handleScan} />
            <Button 
              className="mt-4" 
              variant="outline"
              onClick={() => setScanMode(false)}
            >
              Cancel Scan
            </Button>
          </div>
        ) : (
          <div className="mb-6 flex flex-wrap gap-4">
            <Button onClick={() => setScanMode(true)}>
              Scan QR Code
            </Button>
            <Button variant="outline" onClick={generateQRCode}>
              Generate Your QR Code
            </Button>
          </div>
        )}
        
        {scannedProfile && (
          <div className="mb-6">
            <h2 className="mb-4 text-xl font-semibold">Scanned Profile Information</h2>
            <Card>
              <CardContent className="p-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <div>
                    <h3 className="mb-2 text-lg font-medium">{scannedProfile.name}</h3>
                    <p className="mb-1 text-sm text-muted-foreground">
                      Role: <span className="font-medium capitalize">{scannedProfile.role}</span>
                    </p>
                    {scannedProfile.location && (
                      <p className="mb-1 text-sm text-muted-foreground">
                        Location: <span className="font-medium">{scannedProfile.location}</span>
                      </p>
                    )}
                    {scannedProfile.speciality && (
                      <p className="mb-1 text-sm text-muted-foreground">
                        Speciality: <span className="font-medium">{scannedProfile.speciality}</span>
                      </p>
                    )}
                    <p className="mt-4 text-sm">{scannedProfile.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
        
        {ecoPassport && (
          <div className="grid gap-6 md:grid-cols-2">
            <CertificationSection certifications={ecoPassport.certifications} />
            <ReportingSection ecoData={ecoPassport} />
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default Sustainability;
