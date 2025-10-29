// app/auth/update-password/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LoaderCircle, Lock, CheckCircle, AlertCircle } from 'lucide-react';
import { Toaster, toast } from 'sonner';
import Link from 'next/link';
import Image from 'next/image';

export default function UpdatePasswordPage() {
    const supabase = createClient();
    const router = useRouter();
    const searchParams = useSearchParams();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [isPasswordUpdated, setIsPasswordUpdated] = useState(false);

     // Check for session on mount - if user is already logged in,
     // redirecting might make sense, or just show the form anyway.
     useEffect(() => {
         // This page relies on the recovery token from the email link,
         // which creates a temporary session fragment. A full session check isn't strictly needed here.
         // However, you might want to handle cases where the token is invalid or expired.
         const recoveryToken = searchParams.get('token'); // Supabase might use different param names
         const type = searchParams.get('type');

         // Supabase uses hash fragments (#access_token=...) now for recovery
         // We need to listen for the session update after the fragment is processed.
         const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
             // console.log("Auth State Change:", event, session);
             if (event === 'PASSWORD_RECOVERY') {
                // Now the user *might* be in a state to update their password
                // The form submission will use the session context
                setMessage('You can now set your new password.');
             } else if (event === 'SIGNED_IN' && isPasswordUpdated) {
                 // If the user got signed in AFTER a successful password update (sometimes happens)
                 // Redirect them
                 router.push('/dashboard');
             }
             // Handle initial state if token is already expired or invalid?
             // Supabase might handle this implicitly on updateUser call.
         });

          return () => {
             subscription.unsubscribe();
          };

     }, [supabase, searchParams, router, isPasswordUpdated]); // Added isPasswordUpdated

    const handleUpdatePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setMessage('');

        if (password !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }
        if (password.length < 8) {
             setError('Password must be at least 8 characters long.');
             return;
         }

        setLoading(true);

        // Supabase handles the session/token implicitly here
        const { error: updateError } = await supabase.auth.updateUser({
            password: password,
        });

        setLoading(false);

        if (updateError) {
             console.error("Password Update Error:", updateError);
             if (updateError.message.includes("invalid") || updateError.message.includes("expired")) {
                 setError('The password reset link is invalid or has expired. Please request a new one.');
             } else {
                 setError(`Failed to update password: ${updateError.message}`);
             }
            toast.error('Failed to update password.');
        } else {
             setMessage('Your password has been updated successfully! You can now log in with your new password.');
             setIsPasswordUpdated(true); // Set flag
             toast.success('Password updated!');
             // Redirect to login after a delay
             setTimeout(() => {
                 router.push('/login?message=Password updated successfully. Please log in.');
             }, 3000); // 3-second delay
        }
    };

    return (
        <div className="flex min-h-screen w-full items-center justify-center bg-background p-4">
            <Toaster richColors position="top-center" />
            <Card className="w-full max-w-md">
                <CardHeader className="text-center">
                     <Link href="/" className="mb-4 inline-block">
                         <Image src="/axiora-logo.png" alt="Axiora Labs Logo" width={120} height={40} className="mx-auto" />
                     </Link>
                    <CardTitle className="text-2xl font-bold">Set New Password</CardTitle>
                    <CardDescription>Enter and confirm your new password below.</CardDescription>
                </CardHeader>
                <CardContent>
                    {isPasswordUpdated ? (
                        <div className="text-center space-y-4 py-8">
                             <CheckCircle className="h-16 w-16 text-green-500 mx-auto animate-pulse" />
                             <p className="font-medium text-green-600 dark:text-green-400">{message}</p>
                             <p className="text-sm text-muted-foreground">Redirecting you to login...</p>
                             <Button asChild>
                                 <Link href="/login">Login Now</Link>
                             </Button>
                         </div>
                    ) : (
                        <form onSubmit={handleUpdatePassword} className="space-y-4">
                            <div>
                                <Label htmlFor="password">New Password</Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                                    <Input
                                        id="password"
                                        type="password"
                                        placeholder="Enter new password (min. 8)"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        className="pl-10"
                                        disabled={loading}
                                    />
                                </div>
                            </div>
                            <div>
                                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                                    <Input
                                        id="confirmPassword"
                                        type="password"
                                        placeholder="Confirm new password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        required
                                        className="pl-10"
                                        disabled={loading}
                                    />
                                </div>
                            </div>

                            {error && (
                                <div className="text-sm font-medium text-destructive dark:text-red-400 bg-destructive/10 dark:bg-red-900/30 p-3 rounded-md border border-destructive/20 dark:border-red-800 flex items-center gap-2">
                                     <AlertCircle className="h-4 w-4" />
                                     <span>{error}</span>
                                 </div>
                            )}
                             {message && !error && ( // Show initial message if needed
                                 <div className="text-sm font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 p-3 rounded-md border border-blue-200 dark:border-blue-800">
                                     {message}
                                 </div>
                             )}

                            <Button type="submit" className="w-full font-semibold !mt-6" disabled={loading || !password || !confirmPassword}>
                                {loading ? <LoaderCircle className="mr-2 h-4 w-4 animate-spin" /> : null}
                                Update Password
                            </Button>
                        </form>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}