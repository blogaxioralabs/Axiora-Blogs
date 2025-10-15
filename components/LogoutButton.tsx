'use client';

import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { Button } from './ui/button';
import { LogOut } from 'lucide-react';

export default function LogoutButton() {
  const router = useRouter();
  const supabase = createClient();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/');
    router.refresh();
  };

  return (
    <Button onClick={handleSignOut} variant="ghost" size="icon" className="rounded-full">
      <LogOut className="h-5 w-5" />
      <span className="sr-only">Logout</span>
    </Button>
  );
}