import React from 'react';
import type { Task, ColumnId } from '../types';
import { Circle } from 'lucide-react';

interface ColumnProps {
  title: string;
  columnId: ColumnId;
  tasks: Task[];
}

const Column: React.FC<ColumnProps> = ({ title, tasks }) => {
  return (
    <div className="flex flex-col w-full min-w-[300px] bg-slate-100/50 rounded-3xl p-5 border border-slate-200/60 h-fit min-h-[500px]">
      {/* Column Header */}
      <div className="flex items-center justify-between mb-6 px-1">
        <div className="flex items-center gap-2">
          <Circle className="w-2.5 h-2.5 fill-indigo-500 text-indigo-500" />
          <h2 className="text-sm font-bold text-slate-700 uppercase tracking-wider">{title}</h2>
          <span className="ml-2 px-2.5 py-0.5 bg-white rounded-full text-xs font-bold text-slate-500 border border-slate-200 shadow-sm">
            {tasks.length}
          </span>
        </div>
      </div>

      {/* Task List Container */}
      <div className="flex flex-col gap-4">
        {tasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 border-2 border-dashed border-slate-200 rounded-2xl bg-white/50">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Empty</p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* TaskCards will go here in the next task */}
            <p className="text-center text-slate-400 text-sm italic py-4">Cards loading...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Column;
