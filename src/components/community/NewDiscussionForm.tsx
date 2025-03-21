
import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { createDiscussion } from '@/services/communityService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';

const formSchema = z.object({
  title: z.string().min(5, { message: 'Title must be at least 5 characters' }),
  content: z.string().min(10, { message: 'Content must be at least 10 characters' }),
  tags: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface NewDiscussionFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

const NewDiscussionForm: React.FC<NewDiscussionFormProps> = ({ onSuccess, onCancel }) => {
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
        description: 'You must be logged in to create a discussion',
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const tags = data.tags ? data.tags.split(',').map(tag => tag.trim()) : [];
      
      const result = await createDiscussion({
        title: data.title,
        content: data.content,
        authorId: user.id,
        tags,
      });
      
      if (result) {
        toast({
          title: 'Success',
          description: 'Your discussion has been created',
        });
        onSuccess();
      } else {
        throw new Error('Failed to create discussion');
      }
    } catch (error) {
      console.error('Error creating discussion:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to create the discussion. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <Label htmlFor="title">Title</Label>
        <Input id="title" {...register('title')} />
        {errors.title && <p className="text-sm text-red-500 mt-1">{errors.title.message}</p>}
      </div>
      
      <div>
        <Label htmlFor="content">Content</Label>
        <Textarea 
          id="content" 
          {...register('content')} 
          rows={6} 
          placeholder="Share your thoughts, ideas, or questions with the community..."
        />
        {errors.content && <p className="text-sm text-red-500 mt-1">{errors.content.message}</p>}
      </div>
      
      <div>
        <Label htmlFor="tags">Tags (comma separated)</Label>
        <Input id="tags" {...register('tags')} placeholder="e.g., Organic Farming, Food Quality, Sustainability" />
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
          ) : 'Create Discussion'}
        </Button>
      </div>
    </form>
  );
};

export default NewDiscussionForm;
