
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { fetchProfileById } from '@/services/profileService';
import { User } from '@/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Star, MapPin, Award } from 'lucide-react';

const PublicProfile = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProfile = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const fetchedProfile = await fetchProfileById(id);
        
        if (fetchedProfile) {
          // Convert Profile to User type
          const userProfile: User = {
            id: fetchedProfile.id,
            name: fetchedProfile.name,
            email: fetchedProfile.email,
            role: fetchedProfile.role,
            description: fetchedProfile.description,
            location: fetchedProfile.location,
            speciality: fetchedProfile.speciality,
            imageUrl: fetchedProfile.avatarUrl,
            rating: fetchedProfile.rating,
            verified: fetchedProfile.verified,
            createdAt: fetchedProfile.createdAt,
          };
          
          setProfile(userProfile);
        }
      } catch (error) {
        console.error('Error loading profile:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadProfile();
  }, [id]);

  if (loading) {
    return (
      <MainLayout>
        <div className="container flex items-center justify-center py-12">
          <div className="text-center">
            <h1 className="text-2xl font-semibold">Loading profile...</h1>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (!profile) {
    return (
      <MainLayout>
        <div className="container flex items-center justify-center py-12">
          <div className="text-center">
            <h1 className="text-2xl font-semibold">Profile not found</h1>
            <p className="mt-2 text-muted-foreground">The requested profile could not be found</p>
            <Button className="mt-4" onClick={() => navigate(-1)}>
              Go Back
            </Button>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container py-6">
        <Card>
          <CardHeader>
            <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
              <div>
                <CardTitle className="text-2xl">{profile.name}</CardTitle>
                <CardDescription className="flex items-center gap-2">
                  <span className="capitalize">{profile.role}</span>
                  {profile.verified && (
                    <Badge variant="outline" className="bg-green-50 text-green-700">
                      <Award className="mr-1 h-3 w-3" /> Verified
                    </Badge>
                  )}
                </CardDescription>
              </div>
              <Button variant="outline" onClick={() => navigate(-1)}>
                Go Back
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-6 md:flex-row">
              <div className="text-center md:w-1/3">
                <Avatar className="mx-auto h-40 w-40">
                  <AvatarImage src={profile.imageUrl} alt={profile.name} />
                  <AvatarFallback className="text-3xl">
                    {profile.name ? profile.name.charAt(0).toUpperCase() : 'U'}
                  </AvatarFallback>
                </Avatar>
                
                {profile.rating !== undefined && profile.rating > 0 && (
                  <div className="mt-4 flex items-center justify-center gap-1">
                    <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium">{profile.rating.toFixed(1)}</span>
                    <span className="text-muted-foreground">/5</span>
                  </div>
                )}
                
                {profile.location && (
                  <div className="mt-2 flex items-center justify-center gap-1 text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span>{profile.location}</span>
                  </div>
                )}
              </div>
              
              <div className="md:w-2/3">
                <div className="mb-6">
                  <h3 className="mb-2 text-lg font-medium">About</h3>
                  <p className="text-muted-foreground">
                    {profile.description || 'No description provided'}
                  </p>
                </div>
                
                {profile.role === 'farmer' && profile.speciality && (
                  <div className="mb-6">
                    <h3 className="mb-2 text-lg font-medium">Speciality</h3>
                    <p className="text-muted-foreground">{profile.speciality}</p>
                  </div>
                )}
                
                <div className="mb-6">
                  <h3 className="mb-2 text-lg font-medium">Member Since</h3>
                  <p className="text-muted-foreground">
                    {new Date(profile.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default PublicProfile;
