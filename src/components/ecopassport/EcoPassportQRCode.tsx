
import React, { useState } from 'react';
import { QRCode } from 'react-qrcode';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { generateProfileQRCode } from '@/services/profileService';
import { useToast } from '@/hooks/use-toast';
import { Download, RefreshCw, Share2, InfoIcon } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';

interface EcoPassportQRCodeProps {
  userId: string;
  qrData?: string;
  onQRCodeGenerated: (qrData: string) => void;
  userName: string;
}

const EcoPassportQRCode: React.FC<EcoPassportQRCodeProps> = ({ 
  userId, 
  qrData,
  onQRCodeGenerated,
  userName
}) => {
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);
  const [showInfoDialog, setShowInfoDialog] = useState(false);
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  
  const handleGenerateQRCode = async () => {
    setIsGenerating(true);
    try {
      const newQRData = await generateProfileQRCode(userId);
      if (newQRData) {
        onQRCodeGenerated(newQRData);
        toast({
          title: 'QR Code generated',
          description: 'Your EcoPassport QR code has been generated successfully',
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
    link.download = `ecopassport-qr-code-${userId}.png`;
    link.href = url;
    link.click();
  };
  
  const handleShareQRCode = async () => {
    if (!qrData) return;
    
    const qrCodeContent = qrData ? JSON.parse(qrData) : null;
    if (!qrCodeContent) return;
    
    const shareData = {
      title: 'EcoPassport QR Code',
      text: `Check out ${userName}'s EcoPassport on AgriTrust!`,
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
      setShareDialogOpen(true);
    }
  };
  
  const qrCodeContent = qrData ? JSON.parse(qrData) : null;
  
  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>EcoPassport QR Code</CardTitle>
              <CardDescription>
                Scan this QR code to verify farmer sustainability credentials
              </CardDescription>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowInfoDialog(true)}
            >
              <InfoIcon className="h-5 w-5" />
            </Button>
          </div>
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
                  <div>Farmer ID: {qrCodeContent.profileId}</div>
                  <div>Generated: {new Date(qrCodeContent.timestamp).toLocaleString()}</div>
                </div>
              )}
            </>
          ) : (
            <div className="flex flex-col items-center space-y-4">
              <p>No EcoPassport QR code generated yet</p>
              <Button onClick={handleGenerateQRCode} disabled={isGenerating}>
                {isGenerating ? 'Generating...' : 'Generate QR Code'}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* QR Code Info Dialog */}
      <Dialog open={showInfoDialog} onOpenChange={setShowInfoDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>About EcoPassport QR Codes</DialogTitle>
            <DialogDescription>
              EcoPassport QR codes allow consumers to verify the sustainability credentials of farmers and their products.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium mb-1">How it works</h3>
              <p className="text-sm text-muted-foreground">
                Each QR code contains a unique identifier linked to your EcoPassport data. 
                When scanned, it provides verifiable information about your farming practices,
                certifications, and sustainability metrics.
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium mb-1">Benefits</h3>
              <p className="text-sm text-muted-foreground">
                • Builds consumer trust through transparency<br />
                • Verifies your sustainable farming practices<br />
                • Differentiates your products in the marketplace<br />
                • Provides traceability for your agricultural products
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      
      {/* Share Dialog Fallback */}
      <Dialog open={shareDialogOpen} onOpenChange={setShareDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Share EcoPassport</DialogTitle>
            <DialogDescription>
              Copy the link below to share your EcoPassport
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center space-x-2">
            <Input 
              readOnly 
              value={qrCodeContent?.viewUrl || `${window.location.origin}/profile/${userId}`}
              onClick={(e) => (e.target as HTMLInputElement).select()}
            />
            <Button
              onClick={() => {
                navigator.clipboard.writeText(qrCodeContent?.viewUrl || `${window.location.origin}/profile/${userId}`);
                toast({
                  title: 'Copied!',
                  description: 'Link copied to clipboard',
                });
              }}
            >
              Copy
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default EcoPassportQRCode;
