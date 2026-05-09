import { createClient } from '@supabase/supabase-js'

// Pull environment variables using Vite's import.meta.env
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Initialize the Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey)
