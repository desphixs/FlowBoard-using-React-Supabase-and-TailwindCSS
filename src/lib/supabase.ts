import { createClient } from '@supabase/supabase-js'

/**
 * We are pulling your specific project credentials from the environment variables.
 * Using 'import.meta.env' is the standard way to access secret keys in Vite.
 * VITE_SUPABASE_URL: The web address of your Supabase project.
 */
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL

/**
 * VITE_SUPABASE_ANON_KEY: The public "anonymous" key that allows 
 * your app to interact with the database safely using Row Level Security (RLS).
 */
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

/**
 * Here we initialize the official Supabase client.
 * This 'supabase' object is what you will import in other files to 
 * perform actions like: supabase.from('table').select('*')
 */
export const supabase = createClient(supabaseUrl, supabaseAnonKey)