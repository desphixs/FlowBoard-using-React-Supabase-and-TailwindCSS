import React from "react";
/* Import Task type to ensure we have access to properties like id, title, and description */
import type { Task } from "../types";
/* Import X icon for the delete button */
import { X } from "lucide-react";

interface TaskCardProps {
    task: Task;
    onDelete: (taskId: string) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onDelete }) => {
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

    /**
     * handleDelete:
     * Prevents the click from triggering anything else, and calls the delete function.
     */
    const handleDelete = (e: React.MouseEvent) => {
        /* Stop the click from bubbling up (useful if the whole card was clickable) */
        e.stopPropagation();
        onDelete(task.id);
    };

    /* Format the Supabase timestamp into a readable date (e.g., "Oct 24, 2023") */
    const formattedDate = new Date(task.created_at).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric"
    });

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
               The 'relative' class allows us to absolutely position the delete button inside the card.
            */
            className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md hover:border-slate-200 transition-all cursor-pointer group active:scale-95 active:rotate-2 active:cursor-grabbing relative"
        >
            {/* 
                DELETE BUTTON
                It is absolutely positioned in the top right.
                'opacity-0 group-hover:opacity-100' means it is invisible until you hover over the entire card.
            */}
            <button 
                onClick={handleDelete}
                className="absolute top-3 right-3 p-1.5 bg-red-50 text-red-500 rounded-lg opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity hover:bg-red-100"
                title="Delete task"
            >
                <X className="w-3.5 h-3.5" />
            </button>

            {/* Display the task title with a color shift on hover */}
            {/* pr-8 ensures the title text doesn't overlap with our absolutely positioned delete button */}
            <h3 className="font-bold text-slate-800 text-sm mb-1 group-hover:text-indigo-600 transition-colors pr-8">{task.title}</h3>

            {/* 
                Conditional Rendering: Only show the paragraph tag if a description actually exists. 
                'line-clamp-2' ensures long descriptions don't make the card too tall.
            */}
            {task.description && <p className="text-slate-500 text-xs leading-relaxed line-clamp-2">{task.description}</p>}

            {/* CARD FOOTER Decoration */}
            <div className="mt-3 pt-3 border-t border-slate-50 flex items-center justify-between">
                {/* We now show the formatted date instead of static text */}
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{formattedDate}</span>
            </div>
        </div>
    );
};

export default TaskCard;
