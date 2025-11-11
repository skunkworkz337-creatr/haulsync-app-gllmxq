import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Database } from './types';
import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = "https://fkbllrvxgpbnhfiyntuw.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZrYmxscnZ4Z3BibmhmaXludHV3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI4MTAyNzAsImV4cCI6MjA3ODM4NjI3MH0.hLJX2SWUujdoJKhi8YKhxs-oQ4q2DIGd-Dq0XB20cT4";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
})
