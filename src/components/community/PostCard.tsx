
import React from 'react';
import { Post } from '@/types';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { MessageSquare, Heart, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PostCardProps {
  post: Post;
  showDeleteButton?: boolean;
  onDelete?: () => void;
}

const PostCard: React.FC<PostCardProps> = ({ post, showDeleteButton = false, onDelete }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };
  
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };
  
  return (
    <Card className="overflow-hidden">
      <CardHeader className="p-4 pb-0">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <Avatar>
              <AvatarImage src={post.authorImageUrl} alt={post.authorName} />
              <AvatarFallback>{getInitials(post.authorName)}</AvatarFallback>
            </Avatar>
            <div>
              <div className="font-medium">{post.authorName}</div>
              <div className="flex items-center text-xs text-muted-foreground">
                <span>{formatDate(post.createdAt)}</span>
                <span className="inline-block mx-1.5">•</span>
                <Badge variant="outline" className="text-xs rounded-full font-normal">
                  {post.authorRole}
                </Badge>
              </div>
            </div>
          </div>
          
          {showDeleteButton && onDelete && (
            <Button
              variant="ghost"
              size="icon"
              className="text-muted-foreground hover:text-red-500"
              onClick={onDelete}
              title="Delete post"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="p-4">
        <h3 className="text-lg font-semibold mb-2">{post.title}</h3>
        <p className="text-muted-foreground mb-4 line-clamp-3">{post.content}</p>
        
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {post.tags.map((tag, index) => (
              <Badge key={index} variant="secondary" className="bg-primary/10">
                {tag}
              </Badge>
            ))}
          </div>
        )}
        
        <div className="flex items-center text-muted-foreground text-sm mt-2">
          <div className="flex items-center mr-4">
            <Heart className="h-4 w-4 mr-1" />
            <span>{post.likes}</span>
          </div>
          <div className="flex items-center">
            <MessageSquare className="h-4 w-4 mr-1" />
            <span>{post.comments}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PostCard;
