import React, { useState } from 'react';
/* Importing our pre-configured Supabase client to interact with the Auth database */
import { supabase } from '../lib/supabase';
/* This hook lets us push the user to the home page or dashboard after they log in */
import { useNavigate } from 'react-router-dom';
/* Lucide icons: Mail/Lock for the inputs, and Loader2 for that spinning "thinking" animation */
import { Mail, Lock, Loader2 } from 'lucide-react';
/* Sonner is a toast library; 'toast' triggers the alerts, 'Toaster' is the container component */
import { toast, Toaster } from 'sonner';

const AuthPage = () => {
  /** 
   * STATE MANAGEMENT 
   * isLogin: Boolean to track if we show the "Login" or "Sign Up" version of the form.
   * loading: Tracks network requests so we can disable buttons and show spinners.
   * email/password: Standard controlled inputs to store what the user types.
   */
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  /* Initializing the navigation tool */
  const navigate = useNavigate();

  /**
   * handleAuth: The heavy lifter. 
   * It prevents the page from refreshing and talks to Supabase.
   */
  const handleAuth = async (e: React.FormEvent) => {
    /* Stop the browser's default form submission (which would refresh the page) */
    e.preventDefault();
    /* Turn on the spinner and disable buttons to prevent accidental double-submissions */
    setLoading(true);

    try {
      if (isLogin) {
        /** 
         * LOGIN LOGIC
         * We send the email and password to Supabase. 
         * If they match a record, we get back a session.
         */
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        /* If Supabase hates the password or can't find the user, throw the error to our 'catch' block */
        if (error) throw error;
        toast.success('Welcome back!');
      } else {
        /** 
         * SIGN UP LOGIC
         * Creates a new user in the Supabase 'auth' schema.
         */
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        toast.success('Account created! Welcome to FlowBoard.');
      }
      
      /* If the login/signup was successful, redirect the user to the root path ('/') */
      navigate('/');
    } catch (error: any) {
      /* Catching any errors (like "Invalid login credentials") and showing them to the user */
      toast.error(error.message || 'Something went wrong');
    } finally {
      /* Whether we failed or succeeded, we're done "working," so turn off the loader */
      setLoading(false);
    }
  };

  return (
    /**
     * LAYOUT WRAPPER
     * Uses Flexbox to center the card vertically and horizontally on the screen.
     */
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
      {/* We need the Toaster component here so the popups actually have a place to appear */}
      <Toaster position="top-center" />
      
      {/* THE MAIN CARD */}
      <div className="w-full max-w-md bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-8 border border-slate-100">
        
        {/* HEADER SECTION */}
        <div className="flex flex-col items-center mb-8 text-center">
          <div className="w-14 h-14 mb-4">
            <img src="https://cdn-icons-png.flaticon.com/128/11243/11243780.png" alt="FlowBoard Logo" className="w-full h-full object-contain" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            {/* Dynamic text based on our 'isLogin' state */}
            {isLogin ? 'Sign in to FlowBoard' : 'Create your account'}
          </h1>
          <p className="text-slate-500 text-sm mt-2 font-medium">
            {isLogin ? 'Welcome back! Manage your tasks with ease.' : 'Start organizing your workflow today.'}
          </p>
        </div>

        {/* THE FORM */}
        <form onSubmit={handleAuth} className="space-y-5">
          
          {/* EMAIL FIELD */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700 ml-1">Email Address</label>
            <div className="relative group">
              {/* Mail icon is absolute positioned inside the container to look like it's inside the input */}
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
              <input
                type="email"
                required
                value={email}
                /* Update the local 'email' state whenever the user types a character */
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full pl-12 pr-5 py-3.5 rounded-2xl bg-slate-50 border-2 border-transparent focus:bg-white focus:border-indigo-500 focus:outline-none transition-all text-slate-900 placeholder:text-slate-400 font-medium"
              />
            </div>
          </div>

          {/* PASSWORD FIELD */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700 ml-1">Password</label>
            <div className="relative group">
              {/* Lock icon similarly positioned inside the input group */}
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
              <input
                type="password"
                required
                value={password}
                /* Update the local 'password' state on every keystroke */
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-12 pr-5 py-3.5 rounded-2xl bg-slate-50 border-2 border-transparent focus:bg-white focus:border-indigo-500 focus:outline-none transition-all text-slate-900 placeholder:text-slate-400 font-medium"
              />
            </div>
          </div>

          {/* SUBMIT BUTTON */}
          <button
            type="submit"
            /* If we are currently talking to the server, disable the button so they don't spam it */
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-2xl shadow-lg shadow-indigo-100 transition-all flex items-center justify-center gap-2 active:scale-[0.98] disabled:opacity-70"
          >
            {/* Conditional Rendering: Show a spinning loader icon if loading, otherwise show the text */}
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              isLogin ? 'Sign In' : 'Get Started'
            )}
          </button>

          {/* TOGGLE LINK */}
          <div className="text-center mt-6">
            <p className="text-sm font-medium text-slate-500">
              {isLogin ? "Don't have an account?" : "Already have an account?"}{' '}
              <button
                type="button"
                /** 
                 * When clicked, this flips the 'isLogin' boolean. 
                 * This triggers a re-render that swaps out the titles and button text.
                 */
                onClick={() => setIsLogin(!isLogin)}
                className="text-indigo-600 font-bold hover:underline"
              >
                {isLogin ? 'Create one' : 'Sign in'}
              </button>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AuthPage;