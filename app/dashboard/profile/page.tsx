// app/dashboard/profile/page.tsx
'use client';

import { useState, useEffect, useCallback, ChangeEvent } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { User } from '@supabase/supabase-js';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { LoaderCircle, Upload, User as UserIcon, LogOut } from 'lucide-react';
import { Toaster, toast } from 'sonner';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { cn } from '@/lib/utils'; // <-- *** මෙතන import එක එකතු කළා ***

export default function ProfilePage() {
    const supabase = createClient();
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<User | null>(null);
    const [fullName, setFullName] = useState<string>('');
    const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
    const [uploading, setUploading] = useState(false);
    const [updatingProfile, setUpdatingProfile] = useState(false);

    // Fetch user data and profile data
    const getProfile = useCallback(async (currentUser: User) => {
        try {
            setLoading(true);
            const { data, error, status } = await supabase
                .from('profiles')
                .select(`full_name, avatar_url`)
                .eq('id', currentUser.id)
                .single();

            if (error && status !== 406) { // 406 means no row found
                throw error;
            }

            if (data) {
                setFullName(data.full_name || '');
                setAvatarUrl(data.avatar_url || null);
            } else {
                 setFullName(currentUser.user_metadata?.full_name || '');
                 setAvatarUrl(currentUser.user_metadata?.avatar_url || null);
            }
        } catch (error: any) {
            toast.error('Error loading profile: ' + error.message);
        } finally {
            setLoading(false);
        }
    }, [supabase]);

    useEffect(() => {
        const fetchUserAndProfile = async () => {
            const { data: { user: currentUser } } = await supabase.auth.getUser();
            if (currentUser) {
                setUser(currentUser);
                await getProfile(currentUser);
            } else {
                router.push('/login');
            }
        };
        fetchUserAndProfile();
    }, [supabase, router, getProfile]);

    // Update profile function
    async function updateProfile() {
        if (!user) return;
        setUpdatingProfile(true);
        try {
            const updates = {
                id: user.id,
                full_name: fullName,
                avatar_url: avatarUrl,
                updated_at: new Date().toISOString(),
            };

            const { error } = await supabase.from('profiles').upsert(updates);
             if (error) throw error;

             const { error: metaError } = await supabase.auth.updateUser({
                 data: { full_name: fullName, avatar_url: avatarUrl }
             });
             if (metaError) {
                 console.warn("Could not update user metadata:", metaError.message);
             }

            toast.success('Profile updated successfully!');
        } catch (error: any) {
            toast.error('Error updating profile: ' + error.message);
        } finally {
            setUpdatingProfile(false);
        }
    }

    // Handle avatar upload
    async function uploadAvatar(event: ChangeEvent<HTMLInputElement>) {
        if (!user || !event.target.files || event.target.files.length === 0) {
            return;
        }

        const file = event.target.files[0];
        const fileExt = file.name.split('.').pop();
        const filePath = `${user.id}/${Math.random()}.${fileExt}`;

        setUploading(true);
        try {
            if (avatarUrl) {
                const oldFileName = avatarUrl.split('/').pop();
                if (oldFileName) {
                     const { error: deleteError } = await supabase.storage
                         .from('avatars')
                         .remove([`${user.id}/${oldFileName}`]);
                     if (deleteError) {
                          console.warn("Could not delete old avatar:", deleteError.message);
                     }
                }
            }

            const { error: uploadError } = await supabase.storage
                .from('avatars')
                .upload(filePath, file);
            if (uploadError) throw uploadError;

             const { data: urlData } = supabase.storage.from('avatars').getPublicUrl(filePath);
             const newAvatarUrl = urlData.publicUrl;

            setAvatarUrl(newAvatarUrl);
            await updateProfile(); // Save the new URL

        } catch (error: any) {
            toast.error('Error uploading avatar: ' + error.message);
        } finally {
            setUploading(false);
        }
    }

    // Logout function
    const handleSignOut = async () => {
         await supabase.auth.signOut();
         router.push('/');
         router.refresh();
    };


    return (
        <div className="container max-w-2xl py-12 md:py-16">
            <Toaster richColors position="top-center" />
            <h1 className="text-3xl font-bold mb-8 text-center">Account Settings</h1>

            {loading ? (
                <div className="flex justify-center items-center py-10"><LoaderCircle className="h-8 w-8 animate-spin text-primary" /></div>
            ) : (
                <Card>
                    <CardHeader>
                        <CardTitle>Profile Information</CardTitle>
                        <CardDescription>Update your display name and profile picture.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {/* Avatar Section */}
                        <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start">
                             <Avatar className="h-24 w-24 border">
                                 <AvatarImage src={avatarUrl || undefined} alt={fullName || 'User Avatar'} />
                                 <AvatarFallback>
                                     {fullName ? fullName.split(' ').map(n => n[0]).join('').toUpperCase() : <UserIcon />}
                                 </AvatarFallback>
                             </Avatar>
                             <div className="flex-grow w-full sm:w-auto">
                                 {/* --- මෙතන cn function එක පාවිච්චි කරනවා --- */}
                                 <Label htmlFor="avatar-upload" className={cn(
                                     "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 w-full cursor-pointer",
                                     uploading && "opacity-50 cursor-not-allowed" // conditionally apply classes
                                 )}>
                                     {uploading ? <LoaderCircle className="mr-2 h-4 w-4 animate-spin" /> : <Upload className="mr-2 h-4 w-4" />}
                                     {uploading ? 'Uploading...' : 'Upload New Picture'}
                                 </Label>
                                 {/* ------------------------------------------- */}
                                 <input
                                     id="avatar-upload"
                                     type="file"
                                     accept="image/png, image/jpeg, image/webp"
                                     onChange={uploadAvatar}
                                     disabled={uploading}
                                     className="sr-only"
                                 />
                                  <p className="text-xs text-muted-foreground mt-2 text-center sm:text-left">PNG, JPG, WEBP up to 1MB recommended.</p>
                             </div>
                        </div>

                        {/* Email (Readonly) */}
                        <div className="space-y-1">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" type="email" value={user?.email || ''} disabled />
                        </div>

                        {/* Full Name */}
                        <div className="space-y-1">
                            <Label htmlFor="fullName">Full Name</Label>
                            <Input
                                id="fullName"
                                type="text"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                placeholder="Your display name"
                                disabled={updatingProfile}
                            />
                        </div>
                    </CardContent>
                    <CardFooter className="border-t pt-6 flex flex-col sm:flex-row justify-between gap-4">
                         <Button
                             onClick={updateProfile}
                             disabled={loading || updatingProfile || uploading}
                             className="w-full sm:w-auto"
                         >
                             {updatingProfile ? <LoaderCircle className="mr-2 h-4 w-4 animate-spin" /> : null}
                             Update Profile
                         </Button>
                         <Button
                             variant="outline"
                             onClick={handleSignOut}
                             className="w-full sm:w-auto"
                         >
                             <LogOut className="mr-2 h-4 w-4" /> Sign Out
                         </Button>
                    </CardFooter>
                </Card>
            )}

             {/* Password Reset Link */}
             <div className="mt-8 text-center text-sm">
                 <Link href="/auth/forgot-password" className="text-muted-foreground hover:text-primary underline">
                     Want to change your password?
                 </Link>
             </div>

        </div>
    );
}