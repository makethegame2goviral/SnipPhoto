import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.4';

export const supabase = createClient(
  'https://xbefkwirfijxglgoogrn.supabase.co',
  'sb_publishable_3hsQ2uEpBBYOQ2rh44J2BQ_6mt9md6T',
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  },
);