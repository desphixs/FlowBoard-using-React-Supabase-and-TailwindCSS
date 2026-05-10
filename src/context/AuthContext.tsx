import React, { createContext, useContext, useEffect, useState } from 'react';
/* We import the User type from Supabase to ensure our TypeScript code 
   knows exactly what properties a 'User' object has (like email, id, etc.) */
import type { User } from '@supabase/supabase-js';
/* We import the pre-configured Supabase client we created in the other file */
import { supabase } from '../lib/supabase';

/**
 * This interface acts as a blueprint for our Context.
 * It tells TypeScript that our authentication state will always 
 * contain a user (which could be null) and a loading boolean.
 */
interface AuthContextType {
  user: User | null;
  isLoading: boolean;
}

/**
 * We initialize the context with default values. 
 * Initially, there is no user (null) and we assume it's loading (true).
 */
const AuthContext = createContext<AuthContextType>({ user: null, isLoading: true });

/**
 * The AuthProvider is a "Wrapper" component. 
 * You wrap your whole App inside this so every component has access to the user's login status.
 */
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  /* This state variable holds the actual user data from Supabase */
  const [user, setUser] = useState<User | null>(null);
  
  /* This state tracks if we are still waiting for Supabase to tell us if a session exists.
     We start this as 'true' so the UI can show a loading spinner instead of a login screen prematurely. */
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    /**
     * This internal function checks if the user has a valid session 
     * saved in their browser (like a cookie or local storage) as soon as the app starts.
     */
    const checkUser = async () => {
      /* We ask Supabase: "Is anyone currently logged in on this browser?" */
      const { data: { session } } = await supabase.auth.getSession();
      
      /* If a session exists, we save the user; otherwise, we set it to null. 
         The '??' syntax is a fallback: if session.user is missing, use null. */
      setUser(session?.user ?? null);
      
      /* Now that the check is finished, we stop the loading state. */
      setIsLoading(false);
    };

    /* Run the check immediately when the component mounts */
    checkUser();

    /**
     * This is a "Listener." It stays active and waits for things to change.
     * If the user logs in, logs out, or their token expires, this function fires automatically.
     */
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      /* Update our 'user' state with whoever is in the current session */
      setUser(session?.user ?? null);
      
      /* Ensure loading is false now that we've received an update */
      setIsLoading(false);
    });

    /**
     * CLEANUP FUNCTION:
     * When this component is destroyed (unmounted), we "unsubscribe" 
     * from the listener to prevent memory leaks or background crashes.
     */
    return () => subscription.unsubscribe();
  }, []);

  return (
    /**
     * We provide the 'user' and 'isLoading' status to the rest of the app.
     * 'children' represents all the components wrapped inside this Provider.
     */
    <AuthContext.Provider value={{ user, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

/**
 * This is a custom "Hook." 
 * Instead of writing 'useContext(AuthContext)' everywhere, 
 * you can just import and use 'useAuth()' in your components.
 */
export const useAuth = () => useContext(AuthContext);