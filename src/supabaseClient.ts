import { createClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL;
const anon = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!url || !anon) {
  // どちらが欠けてるかもログに出す
  console.error("Missing Supabase env", {
    VITE_SUPABASE_URL: !!url,
    VITE_SUPABASE_ANON_KEY: !!anon,
  });
  throw new Error(
    "Missing Supabase env (VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY)"
  );
}

export const supabase = createClient(url, anon);
