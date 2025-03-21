
import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { createEvent } from '@/services/communityService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';

const formSchema = z.object({
  title: z.string().min(5, { message: 'Title must be at least 5 characters' }),
  description: z.string().min(10, { message: 'Description must be at least 10 characters' }),
  location: z.string().min(3, { message: 'Location must be at least 3 characters' }),
  date: z.string().refine(value => !isNaN(Date.parse(value)), {
    message: 'Please enter a valid date',
  }),
  imageUrl: z.string().url({ message: 'Please enter a valid URL' }).or(z.string().length(0)),
});

type FormValues = z.infer<typeof formSchema>;

interface NewEventFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

const NewEventForm: React.FC<NewEventFormProps> = ({ onSuccess, onCancel }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
  });
  
  const onSubmit = async (data: FormValues) => {
    if (!user) {
      toast({
        variant: 'destructive',
        title: 'Authentication Error',
        description: 'You must be logged in to create an event',
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const result = await createEvent({
        title: data.title,
        description: data.description,
        location: data.location,
        date: new Date(data.date).toISOString(),
        organizer: user.user_metadata?.name || 'Anonymous',
        imageUrl: data.imageUrl || undefined,
        attendees: 0,
      });
      
      if (result) {
        toast({
          title: 'Success',
          description: 'Your event has been created',
        });
        onSuccess();
      } else {
        throw new Error('Failed to create event');
      }
    } catch (error) {
      console.error('Error creating event:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to create the event. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <Label htmlFor="title">Event Title</Label>
        <Input id="title" {...register('title')} />
        {errors.title && <p className="text-sm text-red-500 mt-1">{errors.title.message}</p>}
      </div>
      
      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea 
          id="description" 
          {...register('description')} 
          rows={4} 
          placeholder="Describe the event, its purpose, and what attendees can expect..."
        />
        {errors.description && <p className="text-sm text-red-500 mt-1">{errors.description.message}</p>}
      </div>
      
      <div>
        <Label htmlFor="location">Location</Label>
        <Input id="location" {...register('location')} placeholder="e.g., Central Park, New York or Virtual Event" />
        {errors.location && <p className="text-sm text-red-500 mt-1">{errors.location.message}</p>}
      </div>
      
      <div>
        <Label htmlFor="date">Date and Time</Label>
        <Input id="date" type="datetime-local" {...register('date')} />
        {errors.date && <p className="text-sm text-red-500 mt-1">{errors.date.message}</p>}
      </div>
      
      <div>
        <Label htmlFor="imageUrl">Event Image URL (Optional)</Label>
        <Input id="imageUrl" {...register('imageUrl')} placeholder="https://" />
        {errors.imageUrl && <p className="text-sm text-red-500 mt-1">{errors.imageUrl.message}</p>}
      </div>
      
      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Submitting...
            </>
          ) : 'Create Event'}
        </Button>
      </div>
    </form>
  );
};

export default NewEventForm;
