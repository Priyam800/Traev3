
import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Loader2, Mail, RefreshCw } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const VerifyOTP: React.FC = () => {
  const { toast } = useToast();
  const location = useLocation();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const email = location.state?.email || '';
  
  // Check if the user arrives from an auth callback with token
  useEffect(() => {
    const handleEmailVerification = async () => {
      const hash = window.location.hash;
      if (hash && hash.includes('access_token')) {
        setIsLoading(true);
        try {
          // Extract the access token from the URL
          const accessToken = hash.split('&')[0].replace('#access_token=', '');
          
          if (accessToken) {
            // Verify the token with Supabase
            const { data, error } = await supabase.auth.getUser(accessToken);
            
            if (error) {
              throw new Error(error.message);
            }
            
            // If successful, show a success message and redirect to login
            toast({
              title: 'Email verified!',
              description: 'Your email has been successfully verified. You can now log in.',
              variant: 'default',
            });
            
            navigate('/login');
          }
        } catch (error: any) {
          console.error('Verification error:', error);
          toast({
            title: 'Verification failed',
            description: error.message || 'An error occurred during verification. Please try again.',
            variant: 'destructive',
          });
        } finally {
          setIsLoading(false);
        }
      }
    };
    
    handleEmailVerification();
  }, [toast, navigate]);
  
  const handleResendEmail = async () => {
    if (!email) {
      toast({
        title: 'Email address required',
        description: 'Please provide an email address to resend the verification.',
        variant: 'destructive',
      });
      return;
    }
    
    setIsResending(true);
    try {
      // Resend the verification email
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth-callback`,
        },
      });
      
      if (error) throw error;
      
      toast({
        title: 'Verification email resent',
        description: 'Please check your inbox for the verification link.',
      });
    } catch (error: any) {
      toast({
        title: 'Failed to resend email',
        description: error.message || 'An error occurred. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsResending(false);
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-6 text-center space-y-4">
        <Loader2 className="h-8 w-8 animate-spin text-agri-green" />
        <h2 className="text-xl font-semibold">Verifying your email...</h2>
        <p className="text-muted-foreground">Please wait while we verify your email address.</p>
      </div>
    );
  }
  
  return (
    <div className="flex flex-col items-center p-6 text-center space-y-6">
      <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
        <Mail className="h-8 w-8 text-primary" />
      </div>
      
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold">Check your email</h2>
        <p className="text-muted-foreground">
          We've sent a verification link to <strong>{email || 'your email address'}</strong>.
        </p>
        <p className="text-muted-foreground">
          Please check your inbox and click the link to verify your email address.
        </p>
      </div>
      
      <div className="space-y-4 pt-4 w-full max-w-xs">
        <Button
          onClick={handleResendEmail}
          variant="outline"
          className="w-full"
          disabled={isResending}
        >
          {isResending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Resending...
            </>
          ) : (
            <>
              <RefreshCw className="mr-2 h-4 w-4" />
              Resend verification email
            </>
          )}
        </Button>
        
        <div className="pt-2">
          <p className="text-sm text-muted-foreground">
            Back to{' '}
            <Link to="/login" className="text-primary hover:underline">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default VerifyOTP;
