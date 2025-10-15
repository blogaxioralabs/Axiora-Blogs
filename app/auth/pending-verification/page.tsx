// Axiora Blogs/app/auth/pending-verification/page.tsx
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { MailCheck, LoaderCircle } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function PendingVerificationPage() {
    const router = useRouter();
    const supabase = createClient();

    useEffect(() => {
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
            // When the user confirms their email, a session is created and this listener fires.
            if (session) {
                // Redirect to login page with a success message.
                router.push('/login?message=Email confirmed! You can now sign in.');
            }
        });

        // Cleanup the subscription when the component is unmounted
        return () => {
            subscription.unsubscribe();
        };
    }, [router, supabase]);

    return (
        <div className="flex min-h-screen w-full items-center justify-center bg-background p-4">
            <div className="w-full max-w-md space-y-6 rounded-lg border bg-card p-8 text-center">
                <Link href="/" className="mb-4 inline-block">
                    <Image
                        src="/axiora-logo.png"
                        alt="Axiora Labs Logo"
                        width={120}
                        height={40}
                        className="mx-auto"
                    />
                </Link>
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                    <MailCheck className="h-8 w-8 text-primary" />
                </div>
                <h1 className="text-3xl font-bold text-card-foreground">Check Your Email</h1>
                <p className="text-balance text-muted-foreground">
                    We've sent a confirmation link to your email address. Please click the link to complete your registration.
                </p>
                <div className="flex items-center justify-center gap-2 pt-4 text-sm text-muted-foreground">
                    <LoaderCircle className="h-4 w-4 animate-spin" />
                    <span>Waiting for confirmation...</span>
                </div>
            </div>
        </div>
    );
}