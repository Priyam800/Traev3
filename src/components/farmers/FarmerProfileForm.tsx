import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

const formSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters' }),
  location: z.string().min(2, { message: 'Location must be at least 2 characters' }),
  speciality: z.string().min(2, { message: 'Speciality must be at least 2 characters' }),
  description: z.string().min(10, { message: 'Description must be at least 10 characters' }),
  avatarUrl: z.string().url({ message: 'Please enter a valid URL' }).or(z.string().length(0)),
});

type FormValues = z.infer<typeof formSchema>;

interface FarmerProfileFormProps {
  onSuccess: () => void;
}

const FarmerProfileForm: React.FC<FarmerProfileFormProps> = ({ onSuccess }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      location: '',
      speciality: '',
      description: '',
      avatarUrl: '',
    }
  });
  
  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;
      
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
        
        if (error) throw error;
        
        setValue('name', data.name || '');
        setValue('location', data.location || '');
        setValue('speciality', data.speciality || '');
        setValue('description', data.description || '');
        setValue('avatarUrl', data.avatar_url || '');
      } catch (error) {
        console.error('Error fetching profile:', error);
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Failed to load your profile. Please try again.',
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProfile();
  }, [user, setValue, toast]);
  
  const onSubmit = async (data: FormValues) => {
    if (!user) {
      toast({
        variant: 'destructive',
        title: 'Authentication Error',
        description: 'You must be logged in to update your profile',
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          name: data.name,
          location: data.location,
          speciality: data.speciality,
          description: data.description,
          avatar_url: data.avatarUrl || null,
        })
        .eq('id', user.id);
      
      if (error) throw error;
      
      onSuccess();
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to update profile. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-6">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }
  
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-4">
        <div>
          <Label htmlFor="name">Farmer/Farm Name</Label>
          <Input id="name" {...register('name')} />
          {errors.name && <p className="text-sm text-red-500 mt-1">{errors.name.message}</p>}
        </div>
        
        <div>
          <Label htmlFor="location">Location</Label>
          <Input id="location" {...register('location')} placeholder="e.g., California, USA" />
          {errors.location && <p className="text-sm text-red-500 mt-1">{errors.location.message}</p>}
        </div>
        
        <div>
          <Label htmlFor="speciality">Speciality</Label>
          <Input id="speciality" {...register('speciality')} placeholder="e.g., Organic Vegetables" />
          {errors.speciality && <p className="text-sm text-red-500 mt-1">{errors.speciality.message}</p>}
        </div>
        
        <div>
          <Label htmlFor="description">About</Label>
          <Textarea 
            id="description" 
            {...register('description')} 
            rows={4} 
            placeholder="Tell customers about your farm, growing practices, and philosophy..."
          />
          {errors.description && <p className="text-sm text-red-500 mt-1">{errors.description.message}</p>}
        </div>
        
        <div>
          <Label htmlFor="avatarUrl">Profile Image URL (Optional)</Label>
          <Input id="avatarUrl" {...register('avatarUrl')} placeholder="https://" />
          {errors.avatarUrl && <p className="text-sm text-red-500 mt-1">{errors.avatarUrl.message}</p>}
        </div>
      </div>
      
      <div className="flex justify-end space-x-2">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>
    </form>
  );
};

export default FarmerProfileForm;
