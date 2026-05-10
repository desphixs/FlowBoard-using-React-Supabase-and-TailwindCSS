import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { LogOut } from 'lucide-react';

const BoardPage = () => {
  const { user } = useAuth();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Simple Navbar */}
      <nav className="h-20 bg-white border-b border-slate-100 px-6 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10">
            <img src="https://cdn-icons-png.flaticon.com/128/11243/11243780.png" alt="FlowBoard Logo" className="w-full h-full object-contain" />
          </div>
          <span className="text-xl font-bold text-slate-900 tracking-tight">FlowBoard</span>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="hidden sm:block text-right">
            <p className="text-sm font-bold text-slate-900 leading-none">{user?.email?.split('@')[0]}</p>
            <p className="text-xs font-medium text-slate-500 mt-1">{user?.email}</p>
          </div>
          <button
            onClick={handleSignOut}
            className="flex items-center gap-2 bg-slate-50 hover:bg-red-50 text-slate-600 hover:text-red-600 px-4 py-2 rounded-xl transition-all font-bold text-sm"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Sign Out</span>
          </button>
        </div>
      </nav>

      {/* Placeholder Board Content */}
      <main className="p-6 sm:p-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">My Workspace</h1>
          <p className="text-slate-500 font-medium mt-2">Welcome to your dashboard. Your Kanban board will appear here soon.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {['Todo', 'In Progress', 'Done'].map((col) => (
            <div key={col} className="bg-slate-100/50 rounded-2xl p-4 border-2 border-dashed border-slate-200 min-h-[400px] flex items-center justify-center">
              <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">{col} Column</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default BoardPage;
