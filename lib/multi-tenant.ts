import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

console.log('🔍 Supabase Config:', { 
  url: supabaseUrl ? '✅' : '❌', 
  key: supabaseKey ? '✅' : '❌' 
});

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables');
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Get site by domain
export async function getSiteByDomain(domain: string) {
  try {
    console.log(`📍 Looking up domain: ${domain}`);
    
    const { data, error } = await supabase
      .from('sites')
      .select('*, organizations(*)')
      .eq('domain', domain)
      .single();

    if (error) {
      console.error('❌ getSiteByDomain error:', error.message);
      return null;
    }

    console.log('✅ Site found:', data?.title);
    return data;
  } catch (err) {
    console.error('❌ getSiteByDomain exception:', err);
    return null;
  }
}

// Get content by site_id and type
export async function getContentByType(siteId: string, type: string) {
  try {
    console.log(`📂 Loading ${type} content for site ${siteId.substring(0, 8)}...`);
    
    const { data, error } = await supabase
      .from('content')
      .select('*')
      .eq('site_id', siteId)
      .eq('type', type)
      .order('created_at', { ascending: false });

    if (error) {
      console.error(`❌ getContentByType error for ${type}:`, error.message);
      return [];
    }

    console.log(`✅ Found ${data?.length || 0} ${type} items`);
    return data || [];
  } catch (err) {
    console.error('❌ getContentByType exception:', err);
    return [];
  }
}

// Get all content for a site
export async function getAllContent(siteId: string) {
  try {
    console.log(`📂 Loading all content for site ${siteId.substring(0, 8)}...`);
    
    const { data, error } = await supabase
      .from('content')
      .select('*')
      .eq('site_id', siteId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('❌ getAllContent error:', error.message);
      return [];
    }

    console.log(`✅ Found ${data?.length || 0} content items total`);
    return data || [];
  } catch (err) {
    console.error('❌ getAllContent exception:', err);
    return [];
  }
}
