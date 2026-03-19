
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://xavxdwvmccjjmiicnocy.supabase.co';
const supabaseKey = 'sb_publishable_q9pPFicgEahM_-cSVUy6rw_PCrD8MDp';
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkTables() {
  const { data: danhMucHang, error: dmhError } = await supabase.from('danh_muc_hang').select('*').limit(1);
  console.log('danh_muc_hang:', danhMucHang, dmhError);

  const { data: congNo, error: cnError } = await supabase.from('cong_no').select('*').limit(1);
  console.log('cong_no:', congNo, cnError);
}

checkTables();
