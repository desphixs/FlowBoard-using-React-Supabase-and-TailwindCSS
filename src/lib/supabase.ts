import { createClient } from '@supabase/supabase-js'

/**
 * We are pulling your specific project credentials from the environment variables.
 * Using 'import.meta.env' is the standard way to access secret keys in Vite.
 * VITE_SUPABASE_URL: The web address of your Supabase project.
 */
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ''
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

/**
 * Check if Supabase is properly configured.
 * This allows us to show a "Static Demo" version of the app if keys are missing.
 */
export const isSupabaseConfigured = 
  Boolean(import.meta.env.VITE_SUPABASE_URL) && 
  Boolean(import.meta.env.VITE_SUPABASE_ANON_KEY)

/**
 * Here we initialize the official Supabase client.
 * If keys are missing, we pass empty strings to prevent the app from crashing.
 */
export const supabase = createClient(supabaseUrl || 'http://localhost:54321', supabaseAnonKey || 'dummy')