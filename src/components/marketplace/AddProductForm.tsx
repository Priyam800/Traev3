
import React, { useState } from 'react';
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
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const formSchema = z.object({
  name: z.string().min(3, { message: 'Product name must be at least 3 characters' }),
  description: z.string().min(10, { message: 'Description must be at least 10 characters' }),
  price: z.string().refine(val => !isNaN(Number(val)) && Number(val) > 0, { 
    message: 'Price must be a positive number' 
  }),
  discountPrice: z.string().optional(),
  category: z.enum(['vegetables', 'fruits', 'grains', 'dairy', 'other']),
  imageUrl: z.string().url({ message: 'Please enter a valid URL' }),
  stock: z.string().refine(val => !isNaN(Number(val)) && Number(val) >= 0, {
    message: 'Stock must be a non-negative number'
  }),
  unit: z.string().min(1, { message: 'Unit is required (e.g., kg, bunch, dozen)' }),
  organic: z.boolean().default(false),
});

type FormValues = z.infer<typeof formSchema>;

interface AddProductFormProps {
  onSuccess: () => void;
}

const AddProductForm: React.FC<AddProductFormProps> = ({ onSuccess }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      organic: false,
      category: 'vegetables',
    }
  });
  
  const watchOrganic = watch('organic');
  const watchCategory = watch('category');
  
  const onSubmit = async (data: FormValues) => {
    if (!user) {
      toast({
        variant: 'destructive',
        title: 'Authentication Error',
        description: 'You must be logged in to add a product',
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const { error } = await supabase.from('products').insert({
        name: data.name,
        description: data.description,
        price: Number(data.price),
        discount_price: data.discountPrice ? Number(data.discountPrice) : null,
        category: data.category,
        farmer_id: user.id,
        image_url: data.imageUrl,
        stock: Number(data.stock),
        unit: data.unit,
        organic: data.organic,
      });
      
      if (error) throw error;
      
      onSuccess();
    } catch (error) {
      console.error('Error adding product:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to add product. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-4">
        <div>
          <Label htmlFor="name">Product Name</Label>
          <Input id="name" {...register('name')} />
          {errors.name && <p className="text-sm text-red-500 mt-1">{errors.name.message}</p>}
        </div>
        
        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea id="description" {...register('description')} rows={3} />
          {errors.description && <p className="text-sm text-red-500 mt-1">{errors.description.message}</p>}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="price">Price</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2">$</span>
              <Input id="price" {...register('price')} className="pl-7" />
            </div>
            {errors.price && <p className="text-sm text-red-500 mt-1">{errors.price.message}</p>}
          </div>
          
          <div>
            <Label htmlFor="discountPrice">Discount Price (Optional)</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2">$</span>
              <Input id="discountPrice" {...register('discountPrice')} className="pl-7" />
            </div>
            {errors.discountPrice && <p className="text-sm text-red-500 mt-1">{errors.discountPrice.message}</p>}
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="category">Category</Label>
            <Select
              value={watchCategory}
              onValueChange={(value) => setValue('category', value as any)}
            >
              <SelectTrigger id="category">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="vegetables">Vegetables</SelectItem>
                <SelectItem value="fruits">Fruits</SelectItem>
                <SelectItem value="grains">Grains</SelectItem>
                <SelectItem value="dairy">Dairy</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
            {errors.category && <p className="text-sm text-red-500 mt-1">{errors.category.message}</p>}
          </div>
          
          <div>
            <Label htmlFor="imageUrl">Image URL</Label>
            <Input id="imageUrl" {...register('imageUrl')} placeholder="https://" />
            {errors.imageUrl && <p className="text-sm text-red-500 mt-1">{errors.imageUrl.message}</p>}
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="stock">Stock</Label>
            <Input id="stock" {...register('stock')} />
            {errors.stock && <p className="text-sm text-red-500 mt-1">{errors.stock.message}</p>}
          </div>
          
          <div>
            <Label htmlFor="unit">Unit</Label>
            <Input id="unit" {...register('unit')} placeholder="kg, bunch, dozen, etc." />
            {errors.unit && <p className="text-sm text-red-500 mt-1">{errors.unit.message}</p>}
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Switch
            id="organic"
            checked={watchOrganic}
            onCheckedChange={(checked) => setValue('organic', checked)}
          />
          <Label htmlFor="organic">Organic Product</Label>
        </div>
      </div>
      
      <div className="flex justify-end space-x-2">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Adding...' : 'Add Product'}
        </Button>
      </div>
    </form>
  );
};

export default AddProductForm;
