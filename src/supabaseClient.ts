import { createClient } from "@supabase/supabase-js";

// vite-env.d.ts で VITE_* を string 型として宣言している
export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);
