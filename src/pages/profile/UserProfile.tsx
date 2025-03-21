
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { FarmerProfileForm } from '@/components/farmers/FarmerProfileForm';
import { ProfileQRCode } from '@/components/profile/ProfileQRCode';
import { fetchProfileById, updateProfile, getProfileQRCode, ensureProfileHasQRCode } from '@/services/profileService';
import { User } from '@/types';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';

const UserProfile = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [profile, setProfile] = useState<User | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [qrCodeData, setQrCodeData] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProfile = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        const fetchedProfile = await fetchProfileById(user.id);
        
        if (fetchedProfile) {
          // Convert Profile to User type for state
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
          
          // Get QR code data
          const qrCode = await getProfileQRCode(user.id);
          if (qrCode) {
            setQrCodeData(qrCode.qrData);
          } else {
            // Generate QR code if it doesn't exist
            const newQrData = await ensureProfileHasQRCode(user.id);
            setQrCodeData(newQrData);
          }
        } else {
          toast({
            title: 'Error',
            description: 'Failed to load profile',
            variant: 'destructive',
          });
        }
      } catch (error) {
        console.error('Error loading profile:', error);
        toast({
          title: 'Error',
          description: 'Failed to load profile',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };
    
    loadProfile();
  }, [user, toast]);

  const handleProfileUpdate = async (updatedProfile: Partial<User>) => {
    if (!profile) return;
    
    try {
      const success = await updateProfile({
        id: profile.id,
        name: updatedProfile.name || profile.name,
        description: updatedProfile.description || '',
        location: updatedProfile.location || '',
        speciality: updatedProfile.speciality || '',
        avatarUrl: updatedProfile.imageUrl || '',
      });
      
      if (success) {
        // Refresh profile data
        const refreshedProfile = await fetchProfileById(profile.id);
        if (refreshedProfile) {
          setProfile({
            ...profile,
            name: refreshedProfile.name,
            description: refreshedProfile.description,
            location: refreshedProfile.location,
            speciality: refreshedProfile.speciality,
            imageUrl: refreshedProfile.avatarUrl,
          });
        }
        
        setIsEditMode(false);
        toast({
          title: 'Success',
          description: 'Profile updated successfully',
        });
      } else {
        toast({
          title: 'Error',
          description: 'Failed to update profile',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: 'Error',
        description: 'Failed to update profile',
        variant: 'destructive',
      });
    }
  };

  const generateQRCode = async () => {
    if (!profile) return;
    
    try {
      const qrData = await ensureProfileHasQRCode(profile.id);
      if (qrData) {
        setQrCodeData(qrData);
        toast({
          title: 'Success',
          description: 'QR code generated successfully',
        });
      } else {
        toast({
          title: 'Error',
          description: 'Failed to generate QR code',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error generating QR code:', error);
      toast({
        title: 'Error',
        description: 'Failed to generate QR code',
        variant: 'destructive',
      });
    }
  };

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
            <p className="mt-2 text-muted-foreground">Please try again later</p>
            <Button className="mt-4" onClick={() => navigate('/')}>
              Go to Home
            </Button>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container py-6">
        <h1 className="mb-6 text-3xl font-bold">Your Profile</h1>
        
        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="profile">Profile Information</TabsTrigger>
            <TabsTrigger value="qrcode">QR Code</TabsTrigger>
          </TabsList>
          
          <TabsContent value="profile">
            {isEditMode ? (
              <Card>
                <CardHeader>
                  <CardTitle>Edit Profile</CardTitle>
                  <CardDescription>
                    Update your profile information
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <FarmerProfileForm
                    profile={profile}
                    onSubmit={handleProfileUpdate}
                    onCancel={() => setIsEditMode(false)}
                  />
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>{profile.name}</CardTitle>
                    <CardDescription className="capitalize">
                      {profile.role}
                    </CardDescription>
                  </div>
                  <Button onClick={() => setIsEditMode(true)}>
                    Edit Profile
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col gap-6 md:flex-row">
                    <div className="md:w-1/3">
                      <Avatar className="h-40 w-40">
                        <AvatarImage src={profile.imageUrl} alt={profile.name} />
                        <AvatarFallback className="text-3xl">
                          {profile.name ? profile.name.charAt(0).toUpperCase() : 'U'}
                        </AvatarFallback>
                      </Avatar>
                    </div>
                    <div className="md:w-2/3">
                      <div className="mb-4">
                        <h3 className="text-lg font-medium">About</h3>
                        <p className="mt-1 text-muted-foreground">
                          {profile.description || 'No description provided'}
                        </p>
                      </div>
                      <div className="mb-4">
                        <h3 className="text-lg font-medium">Contact</h3>
                        <p className="mt-1 text-muted-foreground">
                          {profile.email}
                        </p>
                      </div>
                      <div className="mb-4">
                        <h3 className="text-lg font-medium">Location</h3>
                        <p className="mt-1 text-muted-foreground">
                          {profile.location || 'No location provided'}
                        </p>
                      </div>
                      {profile.role === 'farmer' && (
                        <div className="mb-4">
                          <h3 className="text-lg font-medium">Speciality</h3>
                          <p className="mt-1 text-muted-foreground">
                            {profile.speciality || 'No speciality provided'}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
          
          <TabsContent value="qrcode">
            <Card>
              <CardHeader>
                <CardTitle>Your Profile QR Code</CardTitle>
                <CardDescription>
                  Share your QR code with others to quickly share your profile information
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center">
                {qrCodeData ? (
                  <div className="flex flex-col items-center">
                    <ProfileQRCode data={qrCodeData} size={250} />
                    <p className="mt-4 text-center text-sm text-muted-foreground">
                      Scan this QR code to view your profile
                    </p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <p className="mb-4 text-center text-muted-foreground">
                      You don't have a QR code yet
                    </p>
                    <Button onClick={generateQRCode}>
                      Generate QR Code
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default UserProfile;
