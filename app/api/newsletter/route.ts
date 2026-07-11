// app/api/newsletter/route.ts
// Newsletter subscription endpoint
// POST: { email: string }

import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Valid email is required' }, { status: 400 });
    }

    const supabase = await createClient();

    const { error } = await supabase
      .from('newsletter_subscribers')
      .upsert(
        { email: email.toLowerCase().trim(), subscribed_at: new Date().toISOString() },
        { onConflict: 'email' }
      );

    if (error) {
      console.error('Newsletter subscription error:', error);
      return NextResponse.json({ error: 'Subscription failed. Please try again.' }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: 'Subscribed successfully!' });
  } catch (err) {
    console.error('Newsletter API error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
