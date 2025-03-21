
import React, { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { fetchProfileById } from '@/services/profileService';
import { Profile, User } from '@/types';
import { Skeleton } from '@/components/ui/skeleton';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, User as UserIcon, Loader2 } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface EcoPassportQRScannerProps {
  onProfileFound?: (profile: Profile) => void;
}

const EcoPassportQRScanner: React.FC<EcoPassportQRScannerProps> = ({ onProfileFound }) => {
  const { toast } = useToast();
  const [scanning, setScanning] = useState(false);
  const [showScanner, setShowScanner] = useState(false);
  const [scannedProfile, setScannedProfile] = useState<Profile | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const handleScanQRCode = () => {
    setShowScanner(true);
    
    // Simulate QR code scanning with file input
    // In a real implementation, you would use a camera-based QR scanner library
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';
    fileInput.onchange = async (e) => {
      try {
        setScanning(true);
        setError(null);
        
        // Simulate processing time
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Parse the QR code data (in a real app, you would extract the profileId from the scanned QR code)
        // For this demo, we'll prompt the user to enter a profile ID
        const profileId = prompt("Enter the profile ID from the QR code:", "");
        
        if (!profileId) {
          setScanning(false);
          setShowScanner(false);
          return;
        }
        
        // Fetch profile data using the ID from the QR code
        const profile = await fetchProfileById(profileId);
        
        if (!profile) {
          throw new Error('Profile not found');
        }
        
        setScannedProfile(profile);
        if (onProfileFound) {
          onProfileFound(profile);
        }
        
        toast({
          title: 'QR Code Scanned',
          description: `Profile found: ${profile.name}`,
        });
        
      } catch (error) {
        console.error('Error scanning QR code:', error);
        setError('Failed to scan QR code or profile not found');
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Failed to scan QR code. Please try again.',
        });
      } finally {
        setScanning(false);
      }
    };
    
    fileInput.click();
  };
  
  const closeScanner = () => {
    setShowScanner(false);
    setScannedProfile(null);
    setError(null);
  };
  
  return (
    <>
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Scan EcoPassport QR Code</CardTitle>
          <CardDescription>
            Verify farmer or consumer credentials by scanning their QR code
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={handleScanQRCode}>
            Scan QR Code
          </Button>
        </CardContent>
      </Card>
      
      <Dialog open={showScanner} onOpenChange={setShowScanner}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Scan EcoPassport QR Code</DialogTitle>
            <DialogDescription>
              {scanning ? 'Processing QR code...' : 'Scan a QR code to verify credentials'}
            </DialogDescription>
          </DialogHeader>
          
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          {scanning ? (
            <div className="flex flex-col items-center justify-center py-8">
              <Loader2 className="h-16 w-16 animate-spin text-primary" />
              <p className="mt-4 text-center text-muted-foreground">Scanning QR code...</p>
            </div>
          ) : scannedProfile ? (
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={scannedProfile.avatarUrl} alt={scannedProfile.name} />
                  <AvatarFallback>
                    <UserIcon className="h-8 w-8" />
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-lg font-medium flex items-center">
                    {scannedProfile.name}
                    {scannedProfile.verified && (
                      <CheckCircle className="h-4 w-4 ml-1 text-green-500" />
                    )}
                  </h3>
                  <div className="flex items-center mt-1">
                    <Badge variant={scannedProfile.role === 'farmer' ? 'default' : 'outline'}>
                      {scannedProfile.role === 'farmer' ? 'Farmer' : 'Consumer'}
                    </Badge>
                    {scannedProfile.role === 'farmer' && scannedProfile.speciality && (
                      <span className="text-sm text-muted-foreground ml-2">
                        {scannedProfile.speciality}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              
              {scannedProfile.description && (
                <div>
                  <h4 className="text-sm font-medium mb-1">About</h4>
                  <p className="text-sm text-muted-foreground">{scannedProfile.description}</p>
                </div>
              )}
              
              {scannedProfile.location && (
                <div>
                  <h4 className="text-sm font-medium mb-1">Location</h4>
                  <p className="text-sm text-muted-foreground">{scannedProfile.location}</p>
                </div>
              )}
              
              <div className="flex justify-end">
                <Button onClick={closeScanner}>Close</Button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-8">
              <p className="text-center text-muted-foreground">
                Select a QR code image to scan
              </p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default EcoPassportQRScanner;
