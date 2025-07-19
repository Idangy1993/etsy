import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.MY_SUPABASE_URL!;
const supabaseKey = process.env.MY_SUPABASE_SERVICE_ROLE_KEY!;

export const supabase = createClient(supabaseUrl, supabaseKey);
