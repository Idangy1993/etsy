import { createClient } from "@supabase/supabase-js";

console.log("MY_SUPABASE_URL:", process.env.MY_SUPABASE_URL);
console.log(
  "MY_SUPABASE_SERVICE_ROLE_KEY:",
  process.env.MY_SUPABASE_SERVICE_ROLE_KEY ? "set" : "NOT SET"
);

const supabaseUrl = process.env.MY_SUPABASE_URL!;
const supabaseKey = process.env.MY_SUPABASE_SERVICE_ROLE_KEY!;

export const supabase = createClient(supabaseUrl, supabaseKey);
