
import React from 'react';
import { Event } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar, MapPin, Users, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AspectRatio } from '@/components/ui/aspect-ratio';

interface EventCardProps {
  event: Event;
  showDeleteButton?: boolean;
  onDelete?: () => void;
}

const EventCard: React.FC<EventCardProps> = ({ event, showDeleteButton = false, onDelete }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long',
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  const isUpcoming = new Date(event.date) > new Date();
  
  return (
    <Card className="overflow-hidden">
      <div className="relative">
        <AspectRatio ratio={16 / 9}>
          <img 
            src={event.imageUrl || 'https://images.unsplash.com/photo-1526399232581-2ab5608b6336?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'} 
            alt={event.title}
            className="w-full h-full object-cover"
          />
        </AspectRatio>
        {!isUpcoming && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <span className="text-white font-medium px-3 py-1 rounded-full border border-white/50">
              Past Event
            </span>
          </div>
        )}
      </div>
      
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-semibold mb-2">{event.title}</h3>
          
          {showDeleteButton && onDelete && (
            <Button
              variant="ghost"
              size="icon"
              className="text-muted-foreground hover:text-red-500 -mt-1"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onDelete();
              }}
              title="Delete event"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
        
        <p className="text-muted-foreground mb-4 line-clamp-2">{event.description}</p>
        
        <div className="space-y-2 text-sm">
          <div className="flex items-center text-muted-foreground">
            <Calendar className="h-4 w-4 mr-2" />
            <span>{formatDate(event.date)}</span>
          </div>
          
          <div className="flex items-center text-muted-foreground">
            <MapPin className="h-4 w-4 mr-2" />
            <span>{event.location}</span>
          </div>
          
          <div className="flex items-center text-muted-foreground">
            <Users className="h-4 w-4 mr-2" />
            <span>{event.attendees} {event.attendees === 1 ? 'attendee' : 'attendees'}</span>
          </div>
        </div>
        
        <div className="mt-4 text-sm">
          <span className="text-muted-foreground">Organized by: </span>
          <span className="font-medium">{event.organizer}</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default EventCard;
