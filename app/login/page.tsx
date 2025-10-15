'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { createClient } from '@/lib/supabase/client';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { ArrowRight, Lock, Mail, LoaderCircle } from 'lucide-react';
import { Toaster, toast } from 'sonner';

// The corrected validation schema
const formSchema = z.object({
    email: z.string().email({ message: "Please enter a valid email address." }),
    password: z.string().min(1, { message: "Password is required." }),
});

const GoogleIcon = (props: React.SVGProps<SVGSVGElement>) => ( <svg className="mr-2 h-4 w-4" viewBox="0 0 48 48" {...props}><path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C12.955 4 4 12.955 4 24s8.955 20 20 20s20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"></path><path fill="#FF3D00" d="m6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C16.318 4 9.656 8.337 6.306 14.691z"></path><path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0 1 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z"></path><path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 0 1-4.087 5.571l6.19 5.238C42.012 35.845 44 30.228 44 24c0-1.341-.138-2.65-.389-3.917z"></path></svg>);
const AppleIcon = (props: React.SVGProps<SVGSVGElement>) => (<svg className="mr-2 h-4 w-4" viewBox="0 0 24 24" fill="currentColor" {...props}><path d="M12.01,1.93c-2.45,0-4.23,1.3-5.52,3.17c-1.3,1.87-2.22,4.2-2.22,6.44c0,2.15,0.73,4.64,2.33,6.23 c0.77,0.77,1.63,1.4,2.94,1.4c1.2,0,1.82-0.63,3.46-0.63c1.64,0,2.16,0.63,3.48,0.63c1.31,0,2.1-0.57,2.81-1.31 c0.9-0.92,1.3-1.99,1.31-2.02c-0.01-0.01-1.92-0.74-1.92-3.15c0-2.15,1.57-3.2,1.71-3.32c-1-1.57-2.62-1.8-3.18-1.84 c-1.48-0.12-2.88,0.85-3.6,0.85c-0.72,0-1.83-0.81-3.24-0.81c-0.2,0-0.39,0-0.58,0.02C12.07,7.86,12.04,7.86,12.01,7.86 M14.48,4.59c0.75-0.91,1.28-2.11,1.2-3.32c-1.2,0.06-2.55,0.81-3.33,1.71c-0.69,0.8-1.3,2.04-1.19,3.22 C12.39,6.26,13.72,5.5,14.48,4.59" /></svg>);

export default function LoginPage() {
    const router = useRouter();
    const supabase = createClient();
    const searchParams = useSearchParams();
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema), defaultValues: { email: "", password: "" },
    });

    useEffect(() => { const message = searchParams.get('message'); if (message) { toast.success(message); } }, [searchParams]);

    const getURL = (path: string = '') => `http://localhost:3000/${path}`;

    async function onSubmit(values: z.infer<typeof formSchema>) {
        const { error } = await supabase.auth.signInWithPassword({ email: values.email, password: values.password });
        if (error) { toast.error(error.message); } 
        else { router.push('/admin/create-post'); router.refresh(); }
    }

    const handleOAuthSignIn = async (provider: 'google') => {
        const { error } = await supabase.auth.signInWithOAuth({ provider, options: { redirectTo: getURL('auth/callback') } });
        if (error) toast.error(error.message);
    };

    return (
        <div className="flex min-h-screen w-full items-center justify-center bg-background p-4">
            <Toaster richColors position="top-center" />
            <motion.div className="w-full max-w-md space-y-8 rounded-lg border bg-card p-6 sm:p-8" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
                <div className="text-center">
                    <Link href="/"><Image src="/axiora-logo.png" alt="Axiora Labs Logo" width={120} height={40} className="mx-auto" /></Link>
                    <h1 className="text-3xl font-bold text-card-foreground mt-4">Login to Your Account</h1>
                    <p className="text-balance text-muted-foreground">Enter your email below to access your account</p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div>
                        <Label htmlFor="email" className="sr-only">Email</Label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                            <Input id="email" placeholder="name@example.com" {...register("email")} className="pl-10" />
                        </div>
                        {errors.email && <p className="text-xs text-destructive mt-1.5">{errors.email.message}</p>}
                    </div>
                    <div>
                        <Label htmlFor="password" className="sr-only">Password</Label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                            <Input id="password" type="password" placeholder="Password" {...register("password")} className="pl-10" />
                        </div>
                        {errors.password && <p className="text-xs text-destructive mt-1.5">{errors.password.message}</p>}
                    </div>
                    <Button type="submit" className="w-full font-semibold !mt-6" disabled={isSubmitting}>
                        {isSubmitting ? <LoaderCircle className="mr-2 h-4 w-4 animate-spin" /> : 'Login'} 
                        {!isSubmitting && <ArrowRight className="ml-2 h-4 w-4" />}
                    </Button>
                </form>

                <div className="relative my-6"><div className="absolute inset-0 flex items-center"><span className="w-full border-t" /></div><div className="relative flex justify-center text-xs uppercase"><span className="bg-card px-2 text-muted-foreground">Or continue with</span></div></div>

                <div className="grid grid-cols-2 gap-4">
                    <Button variant="outline" onClick={() => handleOAuthSignIn('google')} disabled={isSubmitting}><GoogleIcon />Google</Button>
                     <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button variant="outline" disabled className="w-full"><AppleIcon />Apple</Button>
                            </TooltipTrigger>
                            <TooltipContent><p>This feature is coming soon!</p></TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </div>
                
                <div className="mt-4 text-center text-sm">Don&apos;t have an account? <Link href="/register" className="underline">Sign up</Link></div>
            </motion.div>
        </div>
    );
}