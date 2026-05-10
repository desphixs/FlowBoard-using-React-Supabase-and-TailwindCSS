import React from "react";
/* Import Task type to ensure we have access to properties like id, title, and description */
import type { Task } from "../types";

interface TaskCardProps {
    task: Task;
}

const TaskCard: React.FC<TaskCardProps> = ({ task }) => {
    /**
     * onDragStart:
     * This fires the moment the user clicks and starts pulling the card.
     */
    const onDragStart = (e: React.DragEvent) => {
        /**
         * The 'dataTransfer' object is like a little invisible bucket.
         * We put the task's ID into the bucket so that whatever column "catches"
         * the drop later knows exactly which task was being held.
         */
        e.dataTransfer.setData("taskId", task.id);

        /* Tells the browser cursor to show the "move" icon instead of "copy" or "link" */
        e.dataTransfer.effectAllowed = "move";
    };

    return (
        <div
            /* 
               The 'draggable' attribute is a native HTML feature. 
               Without this, the browser will just try to select the text. 
            */
            draggable
            onDragStart={onDragStart}
            /* 
               We use 'group' for hover effects and 'active' for when the user is 
               actually grabbing the card (scaling it down and rotating it slightly).
            */
            className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md hover:border-slate-200 transition-all cursor-pointer group active:scale-95 active:rotate-2 active:cursor-grabbing"
        >
            {/* Display the task title with a color shift on hover */}
            <h3 className="font-bold text-slate-800 text-sm mb-1 group-hover:text-indigo-600 transition-colors">{task.title}</h3>

            {/* 
                Conditional Rendering: Only show the paragraph tag if a description actually exists. 
                'line-clamp-2' ensures long descriptions don't make the card too tall.
            */}
            {task.description && <p className="text-slate-500 text-xs leading-relaxed line-clamp-2">{task.description}</p>}

            {/* CARD FOOTER Decoration */}
            <div className="mt-3 pt-3 border-t border-slate-50 flex items-center justify-between">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Task Details</span>
            </div>
        </div>
    );
};

export default TaskCard;
