
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const AuthCallback: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Get the URL fragment (everything after the #)
    const hash = window.location.hash;

    const handleCallback = async () => {
      try {
        // Check if we have a session
        const { data, error } = await supabase.auth.getSession();
        
        if (error) throw error;
        
        if (data?.session) {
          // If we have a session, show success message
          toast({
            title: 'Authentication successful',
            description: 'You have been successfully authenticated.',
          });
          // Redirect to the dashboard
          navigate('/', { replace: true });
        } else if (hash && hash.includes('error')) {
          // Extract error message from the URL
          const errorMessage = decodeURIComponent(
            hash.substring(hash.indexOf('error_description=') + 'error_description='.length)
              .split('&')[0]
          );
          setError(errorMessage);
        } else {
          // No session and no error - should redirect to login
          navigate('/login', { replace: true });
        }
      } catch (e: any) {
        console.error('Auth callback error:', e);
        setError(e.message);
        navigate('/login', { replace: true });
      }
    };

    handleCallback();
  }, [navigate, toast]);

  // If there's an error, show it
  if (error) {
    toast({
      title: 'Authentication error',
      description: error,
      variant: 'destructive',
    });
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <Loader2 className="h-8 w-8 animate-spin text-agri-green" />
      <h1 className="mt-4 text-xl">Processing your authentication...</h1>
      <p className="text-muted-foreground mt-2">Please wait while we verify your credentials.</p>
    </div>
  );
};

export default AuthCallback;
