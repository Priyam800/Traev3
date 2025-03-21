
import React from 'react';
import { QRCode } from 'react-qrcode';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { generateProfileQRCode } from '@/services/profileService';
import { useToast } from '@/hooks/use-toast';
import { Download, RefreshCw, Share2 } from 'lucide-react';

interface ProfileQRCodeProps {
  userId: string;
  qrData?: string;
  onQRCodeGenerated: (qrData: string) => void;
}

const ProfileQRCode: React.FC<ProfileQRCodeProps> = ({ 
  userId, 
  qrData, 
  onQRCodeGenerated 
}) => {
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = React.useState(false);
  
  const handleGenerateQRCode = async () => {
    setIsGenerating(true);
    try {
      const newQRData = await generateProfileQRCode(userId);
      if (newQRData) {
        onQRCodeGenerated(newQRData);
        toast({
          title: 'QR Code generated',
          description: 'Your profile QR code has been generated successfully',
        });
      } else {
        throw new Error('Failed to generate QR code');
      }
    } catch (error) {
      console.error('Error generating QR code:', error);
      toast({
        title: 'Error',
        description: 'Failed to generate QR code. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsGenerating(false);
    }
  };
  
  const handleDownloadQRCode = () => {
    if (!qrData) return;
    
    const canvas = document.querySelector('.qr-code-container canvas') as HTMLCanvasElement;
    if (!canvas) return;
    
    const url = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.download = `profile-qr-code-${userId}.png`;
    link.href = url;
    link.click();
  };
  
  const handleShareQRCode = async () => {
    if (!qrData) return;
    
    const qrCodeContent = qrData ? JSON.parse(qrData) : null;
    if (!qrCodeContent) return;
    
    const shareData = {
      title: 'Profile QR Code',
      text: 'Check out my profile on AgriTrust!',
      url: qrCodeContent.viewUrl,
    };
    
    if (navigator.share && navigator.canShare(shareData)) {
      try {
        await navigator.share(shareData);
        toast({
          title: 'Shared successfully',
          description: 'Your QR code has been shared',
        });
      } catch (error) {
        console.error('Error sharing:', error);
        // User probably canceled sharing
        if (error instanceof Error && error.name !== 'AbortError') {
          toast({
            title: 'Error',
            description: 'Failed to share QR code',
            variant: 'destructive',
          });
        }
      }
    } else {
      // Fallback for browsers that don't support the Web Share API
      toast({
        title: 'Copy link',
        description: 'This browser doesn\'t support sharing. Please copy the link manually.',
      });
    }
  };
  
  const qrCodeContent = qrData ? JSON.parse(qrData) : null;
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile QR Code</CardTitle>
        <CardDescription>
          Scan this QR code to view your profile information
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center space-y-4">
        {qrData ? (
          <>
            <div className="qr-code-container p-4 bg-white rounded-lg">
              <QRCode 
                value={qrData}
                size={200}
                level="H"
                includeMargin={true}
              />
            </div>
            <div className="flex flex-wrap gap-2 justify-center">
              <Button 
                variant="outline" 
                onClick={handleGenerateQRCode}
                disabled={isGenerating}
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Regenerate
              </Button>
              <Button onClick={handleDownloadQRCode}>
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
              <Button onClick={handleShareQRCode} variant="outline">
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
            </div>
            {qrCodeContent && (
              <div className="text-sm text-muted-foreground">
                <div>Profile ID: {qrCodeContent.profileId}</div>
                <div>Generated: {new Date(qrCodeContent.timestamp).toLocaleString()}</div>
              </div>
            )}
          </>
        ) : (
          <div className="flex flex-col items-center space-y-4">
            <p>No QR code generated yet</p>
            <Button onClick={handleGenerateQRCode} disabled={isGenerating}>
              {isGenerating ? 'Generating...' : 'Generate QR Code'}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ProfileQRCode;
