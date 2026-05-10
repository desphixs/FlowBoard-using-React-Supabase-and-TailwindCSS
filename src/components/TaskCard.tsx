import React from "react";
/* We import the Task type to ensure we have access to properties like title and description */
import type { Task } from "../types";

/**
 * PROPS DEFINITION
 * This component takes a single 'task' object as a prop.
 */
interface TaskCardProps {
    task: Task;
}

const TaskCard: React.FC<TaskCardProps> = ({ task }) => {
    return (
        /* The main card container: white background, rounded corners, and a subtle shadow */
        /* We also add a hover effect to make the card slightly interactive */
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md hover:border-slate-200 transition-all cursor-pointer group">
            {/* TASK TITLE: Bold, dark slate color, and tight tracking for a modern look */}
            <h3 className="font-bold text-slate-800 text-sm mb-1 group-hover:text-indigo-600 transition-colors">
                {task.title}
            </h3>
            
            {/* TASK DESCRIPTION: Smaller, muted text. We only show it if a description exists. */}
            {task.description && (
                <p className="text-slate-500 text-xs leading-relaxed line-clamp-2">
                    {task.description}
                </p>
            )}
            
            {/* FOOTER: Optional timestamp or tags could go here in the future */}
            <div className="mt-3 pt-3 border-t border-slate-50 flex items-center justify-between">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    Task Details
                </span>
            </div>
        </div>
    );
};

export default TaskCard;
