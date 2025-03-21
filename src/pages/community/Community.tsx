import React, { useState, useEffect } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import PostCard from '@/components/community/PostCard';
import EventCard from '@/components/community/EventCard';
import { Post, Event } from '@/types';
import { MessageSquare, Calendar, Book, TrendingUp, Plus, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { fetchDiscussions, fetchEvents, deleteDiscussion, deleteEvent } from '@/services/communityService';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import NewDiscussionForm from '@/components/community/NewDiscussionForm';
import NewEventForm from '@/components/community/NewEventForm';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';

const Community: React.FC = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('forum');
  const [isNewDiscussionDialogOpen, setIsNewDiscussionDialogOpen] = useState(false);
  const [isNewEventDialogOpen, setIsNewEventDialogOpen] = useState(false);
  const [deleteItemId, setDeleteItemId] = useState<string | null>(null);
  const [deleteItemType, setDeleteItemType] = useState<'post' | 'event' | null>(null);
  
  const loadData = async () => {
    setLoading(true);
    try {
      const discussionsData = await fetchDiscussions();
      const eventsData = await fetchEvents();
      
      setPosts(discussionsData);
      setEvents(eventsData);
    } catch (error) {
      console.error('Error loading community data:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to load community data. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    loadData();
  }, []);
  
  const filteredPosts = posts.filter(post => 
    post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.authorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );
  
  const filteredEvents = events.filter(event => 
    event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    event.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
    event.organizer.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };
  
  const upcomingEvents = events.filter(event => new Date(event.date) > new Date());
  
  const handleNewDiscussionSuccess = () => {
    setIsNewDiscussionDialogOpen(false);
    loadData();
    toast({
      title: 'Success',
      description: 'Your discussion has been created',
    });
  };
  
  const handleNewEventSuccess = () => {
    setIsNewEventDialogOpen(false);
    loadData();
    toast({
      title: 'Success',
      description: 'Your event has been created',
    });
  };
  
  const handleDeleteDiscussion = async (postId: string) => {
    setDeleteItemId(postId);
    setDeleteItemType('post');
  };
  
  const handleDeleteEvent = async (eventId: string) => {
    setDeleteItemId(eventId);
    setDeleteItemType('event');
  };
  
  const confirmDelete = async () => {
    if (!deleteItemId || !deleteItemType) return;
    
    try {
      let success = false;
      
      if (deleteItemType === 'post') {
        success = await deleteDiscussion(deleteItemId);
      } else if (deleteItemType === 'event') {
        success = await deleteEvent(deleteItemId);
      }
      
      if (success) {
        toast({
          title: 'Success',
          description: `${deleteItemType === 'post' ? 'Discussion' : 'Event'} has been deleted`,
        });
        loadData();
      } else {
        throw new Error(`Failed to delete ${deleteItemType}`);
      }
    } catch (error) {
      console.error(`Error deleting ${deleteItemType}:`, error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: `Failed to delete ${deleteItemType}. Please try again.`,
      });
    } finally {
      setDeleteItemId(null);
      setDeleteItemType(null);
    }
  };
  
  const cancelDelete = () => {
    setDeleteItemId(null);
    setDeleteItemType(null);
  };
  
  const isAuthor = (authorId: string) => {
    return user && user.id === authorId;
  };
  
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Community</h1>
          <p className="text-muted-foreground">
            Connect with farmers and consumers, share knowledge, and participate in events
          </p>
        </div>
        
        <div className="mb-8">
          <Input
            type="text"
            placeholder="Search discussions, events, and resources..."
            value={searchQuery}
            onChange={handleSearch}
          />
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="forum" className="flex items-center">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Discussion Forum
                </TabsTrigger>
                <TabsTrigger value="events" className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2" />
                  Events
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="forum" className="space-y-4 pt-4">
                <div className="mb-4">
                  <Button 
                    className="w-full bg-agri-green hover:bg-agri-darkGreen"
                    onClick={() => setIsNewDiscussionDialogOpen(true)}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Start a New Discussion
                  </Button>
                </div>
                
                {loading ? (
                  <div className="flex items-center justify-center h-64">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                  </div>
                ) : filteredPosts.length === 0 ? (
                  <div className="text-center py-12 bg-muted/30 rounded-lg">
                    <h3 className="text-lg font-medium mb-2">No Discussions Found</h3>
                    <p className="text-muted-foreground">
                      Try adjusting your search or start a new discussion
                    </p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {filteredPosts.map(post => (
                      <PostCard 
                        key={post.id} 
                        post={post} 
                        showDeleteButton={isAuthor(post.authorId)}
                        onDelete={() => handleDeleteDiscussion(post.id)}
                      />
                    ))}
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="events" className="space-y-4 pt-4">
                <div className="mb-4">
                  <Button 
                    className="w-full bg-agri-green hover:bg-agri-darkGreen"
                    onClick={() => setIsNewEventDialogOpen(true)}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Propose a New Event
                  </Button>
                </div>
                
                {loading ? (
                  <div className="flex items-center justify-center h-64">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                  </div>
                ) : filteredEvents.length === 0 ? (
                  <div className="text-center py-12 bg-muted/30 rounded-lg">
                    <h3 className="text-lg font-medium mb-2">No Events Found</h3>
                    <p className="text-muted-foreground">
                      Try adjusting your search or check back later
                    </p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {filteredEvents.map(event => (
                      <EventCard 
                        key={event.id} 
                        event={event} 
                        showDeleteButton={event.organizer === (user?.user_metadata?.name || "")}
                        onDelete={() => handleDeleteEvent(event.id)}
                      />
                    ))}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
          
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="h-5 w-5 mr-2 text-agri-green" />
                  Upcoming Events
                </CardTitle>
                <CardDescription>
                  Mark your calendar for these community gatherings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {upcomingEvents.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    No upcoming events scheduled
                  </p>
                ) : (
                  upcomingEvents.slice(0, 3).map(event => (
                    <div key={event.id} className="flex gap-3">
                      <div className="min-w-12 text-center">
                        <div className="bg-agri-green/10 text-agri-green font-medium rounded-t-md text-xs py-1">
                          {new Date(event.date).toLocaleDateString('en-US', { month: 'short' })}
                        </div>
                        <div className="border border-t-0 rounded-b-md py-1 text-lg font-bold">
                          {new Date(event.date).getDate()}
                        </div>
                      </div>
                      <div>
                        <h4 className="font-medium text-sm line-clamp-1">{event.title}</h4>
                        <p className="text-xs text-muted-foreground line-clamp-1">{event.location}</p>
                      </div>
                    </div>
                  ))
                )}
                
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full mt-2"
                  onClick={() => setActiveTab('events')}
                >
                  View All Events
                </Button>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2 text-agri-green" />
                  Popular Discussions
                </CardTitle>
                <CardDescription>
                  Join the conversation on these trending topics
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {posts.length === 0 ? (
                    <p className="text-sm text-muted-foreground">
                      No discussions available
                    </p>
                  ) : (
                    posts
                      .sort((a, b) => (b.likes + b.comments) - (a.likes + a.comments))
                      .slice(0, 5)
                      .map(post => (
                        <li key={post.id} className="text-sm">
                          <a href="#" className="hover:text-primary transition-colors line-clamp-1">
                            {post.title}
                          </a>
                        </li>
                      ))
                  )}
                </ul>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Book className="h-5 w-5 mr-2 text-agri-green" />
                  Community Resources
                </CardTitle>
                <CardDescription>
                  Helpful guides, tools, and knowledge
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {['Beginner\'s Guide to Composting', 'Seasonal Planting Calendar', 'Introduction to Permaculture', 'Farm Visit Protocol & Etiquette', 'Understanding Food Labels'].map((resource, index) => (
                    <li key={index} className="flex justify-between text-sm">
                      <a href="#" className="hover:text-primary transition-colors line-clamp-1">
                        {resource}
                      </a>
                      <span className="text-xs bg-muted px-2 py-0.5 rounded-full">
                        {['Guide', 'Tool', 'Course', 'Guide', 'Article'][index]}
                      </span>
                    </li>
                  ))}
                </ul>
                
                <Button variant="outline" size="sm" className="w-full mt-4">
                  Browse All Resources
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      
      <Dialog open={isNewDiscussionDialogOpen} onOpenChange={setIsNewDiscussionDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Start a New Discussion</DialogTitle>
            <DialogDescription>
              Share your thoughts, questions, or ideas with the community
            </DialogDescription>
          </DialogHeader>
          <NewDiscussionForm 
            onSuccess={handleNewDiscussionSuccess} 
            onCancel={() => setIsNewDiscussionDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
      
      <Dialog open={isNewEventDialogOpen} onOpenChange={setIsNewEventDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Propose a New Event</DialogTitle>
            <DialogDescription>
              Create a new event to share with the community
            </DialogDescription>
          </DialogHeader>
          <NewEventForm 
            onSuccess={handleNewEventSuccess} 
            onCancel={() => setIsNewEventDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
      
      <AlertDialog open={!!deleteItemId} onOpenChange={(open) => !open && cancelDelete()}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Are you sure you want to delete this {deleteItemType === 'post' ? 'discussion' : 'event'}?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDelete}
              className="bg-red-500 hover:bg-red-600"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </MainLayout>
  );
};

export default Community;
