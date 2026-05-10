import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { LogOut } from 'lucide-react';
import Column from '../components/Column';
import type { ColumnId } from '../types';

/* We define the columns as an array of objects. This makes it easy to map over them to render UI. */
const COLUMNS: { title: string; id: ColumnId }[] = [
  { title: 'To Do', id: 'todo' },
  { title: 'In Progress', id: 'inprogress' },
  { title: 'Done', id: 'done' },
];

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

      {/* Kanban Board Container */}
      <main className="p-6 sm:p-10 max-w-[1400px] mx-auto">
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">My Workspace</h1>
          <p className="text-slate-500 font-medium mt-2">Manage your projects and keep track of your progress.</p>
        </div>

        {/* Scrollable Container for Mobile */}
        <div className="flex gap-6 overflow-x-auto pb-8 snap-x scrollbar-hide">
          {COLUMNS.map((col) => (
            <div key={col.id} className="flex-1 snap-center">
              <Column 
                title={col.title} 
                columnId={col.id} 
                tasks={[]} // Tasks will be fetched in Task 6
              />
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default BoardPage;
