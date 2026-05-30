import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { getProducts } from '@/lib/products';

export async function POST(req: Request) {
  try {
    const { productId } = await req.json();

    if (!productId) {
      return NextResponse.json({ error: 'Product ID is required' }, { status: 400 });
    }

    // 1. Verify User Session
    // Next.js App Router API route needs auth header or cookies, but supabase client in lib/supabase
    // relies on cookies from the client if configured properly, or we can pass the token.
    // For a simpler approach, we'll extract the auth header from the request if provided.
    const authHeader = req.headers.get('Authorization');
    
    let user;
    
    if (authHeader) {
      const token = authHeader.replace('Bearer ', '');
      const { data, error } = await supabase.auth.getUser(token);
      if (data?.user) user = data.user;
    } else {
      // Fallback to cookie-based session if available (depends on setup)
      const { data, error } = await supabase.auth.getUser();
      if (data?.user) user = data.user;
    }

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized. Valid operator signature required.' }, { status: 401 });
    }

    const userId = user.id;

    // 2. Validate Purchase
    const { data: purchaseData, error: purchaseError } = await supabaseAdmin
      .from('purchases')
      .select('id')
      .eq('user_id', userId)
      .eq('product_id', productId)
      .maybeSingle();

    if (purchaseError) {
      console.error('Purchase validation error:', purchaseError);
      return NextResponse.json({ error: 'Database verification failed.' }, { status: 500 });
    }

    if (!purchaseData) {
      return NextResponse.json({ error: 'Access Denied. Product not unlocked.' }, { status: 403 });
    }

    // 3. Fetch Product Details
    const products = await getProducts();
    const product = products.find((p) => p.id === productId);

    if (!product || !product.storage_path) {
      return NextResponse.json({ error: 'Digital asset not found in repository.' }, { status: 404 });
    }

    // 4. Generate Signed URL
    const { data: signedUrlData, error: signedUrlError } = await supabaseAdmin
      .storage
      .from('products')
      .createSignedUrl(product.storage_path, 60); // 60 seconds expiry

    if (signedUrlError || !signedUrlData?.signedUrl) {
      console.error('Signed URL generation failed:', signedUrlError);
      // Fallback for local testing if Supabase Storage isn't fully configured
      if (process.env.NODE_ENV === 'development') {
        console.log('Development mode: Providing mock download URL fallback');
        return NextResponse.json({ 
          signedUrl: product.download_url || '#',
          mocked: true 
        });
      }
      return NextResponse.json({ error: 'Failed to decrypt secure asset link.' }, { status: 500 });
    }

    // 5. Audit Logging (Download Tracking)
    const ipAddress = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown';
    
    // Fire and forget logging (don't block the response)
    supabaseAdmin.from('download_logs').insert({
      user_id: userId,
      product_id: productId,
      ip_address: ipAddress
    }).then(({ error }) => {
      if (error) {
        // If the table doesn't exist yet, it'll fail silently in the background
        console.warn('Download log failed (table may not exist):', error.message);
      }
    });

    return NextResponse.json({ signedUrl: signedUrlData.signedUrl });

  } catch (error: any) {
    console.error('Download delivery system crash:', error);
    return NextResponse.json({ error: 'Internal system failure.' }, { status: 500 });
  }
}
