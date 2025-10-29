// app/auth/forgot-password/page.tsx
'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LoaderCircle, Mail, ArrowLeft } from 'lucide-react';
import { Toaster, toast } from 'sonner';
import Link from 'next/link';
import Image from 'next/image';

export default function ForgotPasswordPage() {
    const supabase = createClient();
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    const handlePasswordReset = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage(''); // Clear previous messages

        // --- Get Redirect URL ---
        // Ensure this matches the page where users can update their password
        // It MUST be listed in your Supabase Auth URL Configuration settings
        let redirectTo = `${window.location.origin}/auth/update-password`;
        // Append '/' if not present, as required by some Supabase versions
         redirectTo = redirectTo.endsWith('/') ? redirectTo : `${redirectTo}/`;
        //------------------------


        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: redirectTo,
        });

        setLoading(false);
        if (error) {
            toast.error(error.message);
        } else {
            setMessage('Password reset instructions sent! Please check your email (including spam folder).');
            toast.success('Password reset email sent!');
            // Optionally clear email field: setEmail('');
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
                    <CardTitle className="text-2xl font-bold">Forgot Your Password?</CardTitle>
                    <CardDescription>Enter your email below and we'll send you instructions to reset it.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handlePasswordReset} className="space-y-4">
                        <div>
                            <Label htmlFor="email" className="sr-only">Email</Label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="your@email.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="pl-10"
                                    disabled={loading}
                                />
                            </div>
                        </div>

                        {message && (
                            <div className="text-sm font-medium text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/30 p-3 rounded-md border border-green-200 dark:border-green-800">
                                {message}
                            </div>
                        )}

                        <Button type="submit" className="w-full font-semibold !mt-6" disabled={loading || !email}>
                            {loading ? <LoaderCircle className="mr-2 h-4 w-4 animate-spin" /> : null}
                            Send Reset Instructions
                        </Button>
                    </form>
                     <div className="mt-6 text-center text-sm">
                         <Link href="/login" className="inline-flex items-center text-muted-foreground hover:text-primary underline">
                             <ArrowLeft className="mr-1 h-4 w-4" /> Back to Login
                         </Link>
                     </div>
                </CardContent>
            </Card>
        </div>
    );
}