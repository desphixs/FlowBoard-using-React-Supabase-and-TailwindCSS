import React, { useState } from 'react';
import { Plus, Loader2 } from 'lucide-react';

interface AddTaskFormProps {
  onAdd: (title: string, description: string) => Promise<void>;
}

const AddTaskForm: React.FC<AddTaskFormProps> = ({ onAdd }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    setLoading(true);
    await onAdd(formData.title, formData.description);
    setFormData({ title: '', description: '' });
    setLoading(false);
    setIsExpanded(false);
  };

  if (!isExpanded) {
    return (
      <button
        onClick={() => setIsExpanded(true)}
        className="w-full flex items-center gap-2 p-3 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-2xl transition-all font-bold text-sm border-2 border-dashed border-transparent hover:border-indigo-100 group"
      >
        <div className="w-8 h-8 bg-slate-100 group-hover:bg-indigo-100 rounded-lg flex items-center justify-center transition-colors">
          <Plus className="w-5 h-5" />
        </div>
        Add New Task
      </button>
    );
  }

  return (
    <form 
      onSubmit={handleSubmit}
      className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200 space-y-3 animate-in fade-in slide-in-from-top-2 duration-200"
    >
      <input
        autoFocus
        type="text"
        placeholder="Task title..."
        required
        value={formData.title}
        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        className="w-full bg-transparent text-sm font-bold text-slate-900 placeholder:text-slate-400 focus:outline-none"
      />
      
      <textarea
        placeholder="Add a description (optional)"
        value={formData.description}
        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        className="w-full bg-transparent text-xs text-slate-600 placeholder:text-slate-400 focus:outline-none resize-none min-h-[60px]"
      />

      <div className="flex items-center gap-2 pt-1">
        <button
          type="submit"
          disabled={loading || !formData.title.trim()}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl text-xs font-bold transition-all disabled:opacity-50 flex items-center gap-2"
        >
          {loading ? <Loader2 className="w-3 h-3 animate-spin" /> : 'Create Task'}
        </button>
        <button
          type="button"
          onClick={() => setIsExpanded(false)}
          className="text-slate-400 hover:text-slate-600 px-3 py-2 text-xs font-bold transition-all"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default AddTaskForm;
