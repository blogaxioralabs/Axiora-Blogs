// app/auth/callback/route.ts
import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';
import { cookies } from 'next/headers';

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') ?? '/'; // Default redirect to home

  if (code) {
    const cookieStore = cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) { return cookieStore.get(name)?.value; },
          set(name: string, value: string, options) { cookieStore.set({ name, value, ...options }); },
          remove(name: string, options) { cookieStore.delete({ name, ...options }); },
        },
      }
    );

    const { error, data } = await supabase.auth.exchangeCodeForSession(code);

    if (!error && data.user) {
      // --- Check if user needs metadata update (e.g., avatar from Google) ---
      const provider = data.user.app_metadata.provider;
      const identities = data.user.identities; // Get identities array

      // Try to get avatar and full name from identity data if it exists
      let avatarUrl = data.user.user_metadata?.avatar_url;
      let fullName = data.user.user_metadata?.full_name;

      if (identities && identities.length > 0) {
        const primaryIdentity = identities.find(id => id.provider === provider);
        if (primaryIdentity && primaryIdentity.identity_data) {
           // Common keys for OAuth providers (adjust if needed)
           const identityData = primaryIdentity.identity_data as any; // Type assertion needed
           if (!avatarUrl && identityData.avatar_url) {
                avatarUrl = identityData.avatar_url;
           }
            if (!fullName && identityData.full_name) {
                 fullName = identityData.full_name;
            } else if (!fullName && identityData.name) { // Fallback for name key
                 fullName = identityData.name;
            }
        }
      }

       // Update user metadata if new info was found
       if (avatarUrl !== data.user.user_metadata?.avatar_url || fullName !== data.user.user_metadata?.full_name) {
           const { error: updateError } = await supabase.auth.updateUser({
               data: {
                   avatar_url: avatarUrl,
                   full_name: fullName
               }
           });
           if (updateError) {
               console.error("Error updating user metadata:", updateError);
               // Non-critical, proceed with redirect
           }
       }
      // --- End metadata check ---

      // Redirect to dashboard after successful login/signup
      return NextResponse.redirect(`${origin}/dashboard`); // <-- Redirect directly to dashboard
    }

     // Log the specific error if exchange fails
     if (error) {
       console.error("Auth callback error:", error.message);
     }
  }

  // Fallback redirect to an error page or login page with error message
  console.error("Auth callback: Invalid code or other error.");
  return NextResponse.redirect(`${origin}/login?message=Authentication failed. Please try again.`);
}