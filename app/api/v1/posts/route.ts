// app/api/v1/posts/route.ts
import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*', 
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-api-key',
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function GET(req: NextRequest) {
  // 1. Security Check: API Key එක හරියට තියෙනවාද බලනවා
  const apiKey = req.headers.get('x-api-key') || req.nextUrl.searchParams.get('key');
  
  if (apiKey !== process.env.AXIORA_API_SECRET_KEY) {
    return NextResponse.json(
      { error: 'Unauthorized: Invalid API Key' },
      { status: 401, headers: corsHeaders }
    );
  }

  // 2. Supabase Connection හදාගැනීම
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  // 3. URL එකේ තියෙන parameters කියවීම (Category එක තෝරන්න)
  const { searchParams } = new URL(req.url);
  const categoryFilter = searchParams.get('category'); // උදා: ?category=Technology
  const limit = parseInt(searchParams.get('limit') || '6'); // ලිපි කීයක් ඕනද? (Default 6)

  try {
    // 4. Query එක ගොඩනැගීම
    let query = supabase
      .from('posts')
      .select(`
        id,
        title,
        slug,
        image_url,
        created_at,
        description:content, 
        author_name,
        categories!inner(name, slug),
        sub_categories(name)
      `)
      .order('created_at', { ascending: false })
      .limit(limit);

    // 5. Category Filter එක ක්‍රියාත්මක කිරීම (User ඉල්ලුවොත් විතරක්)
    if (categoryFilter && categoryFilter.toLowerCase() !== 'all') {
      // හරියටම අදාළ Category එකේ නම තියෙන ඒවා විතරක් ෆිල්ටර් කරනවා
      // Note: Supabase Foreign Table Filtering
      query = query.eq('categories.name', categoryFilter);
    }

    const { data: posts, error } = await query;

    if (error) throw error;

    const formattedPosts = posts.map((post) => ({
      id: post.id,
      title: post.title,
      slug: post.slug,
      image: post.image_url,
      date: post.created_at,
      author: post.author_name,
      category: Array.isArray(post.categories) 
        ? post.categories[0]?.name 
        : (post.categories as any)?.name,
      
      excerpt: post.description 
        ? post.description.substring(0, 150).replace(/[#*`]/g, '') + '...'
        : 'Read more about this topic on Axiora Blogs...',
      link: `https://axiorablogs.com/blog/${post.slug}`
    }));
    return NextResponse.json(
      { 
        success: true, 
        source: 'Axiora Blogs API', 
        data: formattedPosts 
      }, 
      { status: 200, headers: corsHeaders }
    );

  } catch (error: any) {
    return NextResponse.json(
      { error: error.message }, 
      { status: 500, headers: corsHeaders }
    );
  }
}