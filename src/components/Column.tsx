import React, { useState } from "react";
/* Import the data types to ensure 'tasks' and 'columnId' follow our app's rules */
import type { Task, ColumnId } from "../types";
/* A simple circle icon for the header decoration */
import { Circle } from "lucide-react";
/* Import the TaskCard component to display individual task details */
import TaskCard from "./TaskCard";

/**
 * PROPS DEFINITION:
 * onDrop: A function from the parent (BoardPage) that updates the database.
 * onDelete: A function from the parent (BoardPage) that deletes a task from the database.
 * columnId: The unique identifier for this column (e.g., 'todo', 'inprogress').
 */
interface ColumnProps {
    title: string;
    columnId: ColumnId;
    tasks: Task[];
    onDrop: (taskId: string, targetColumn: ColumnId) => void;
    onDelete: (taskId: string) => void;
    children?: React.ReactNode;
}

const Column: React.FC<ColumnProps> = ({ title, columnId, tasks, onDrop, onDelete, children }) => {
    /* 
       This state tracks if a user is currently hovering a dragged item over THIS column.
       We use this to change the background color and give the user visual feedback.
    */
    const [isOver, setIsOver] = useState(false);

    /**
     * onDragOver:
     * This fires continuously as a card is held over the column.
     * CRITICAL: By default, browsers prevent dropping.
     * Calling e.preventDefault() "turns off" that block so the drop can happen.
     */
    const onDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsOver(true); // Light up the column to show it's ready to catch the card
    };

    /**
     * onDragLeave:
     * Fires when the user drags the card out of this column's boundaries
     * without letting go. We reset the highlight state here.
     */
    const onDragLeave = () => {
        setIsOver(false);
    };

    /**
     * handleDrop:
     * This fires when the user releases the mouse button over the column.
     */
    const handleDrop = (e: React.DragEvent) => {
        /* Prevents the browser from opening the dropped data as a link/file */
        e.preventDefault();
        /* Turn off the highlight immediately */
        setIsOver(false);

        /**
         * We retrieve the "taskId" that was stashed inside the dataTransfer object
         * back in the TaskCard component's onDragStart function.
         */
        const taskId = e.dataTransfer.getData("taskId");

        /* 
           Send the ID of the caught task and the ID of this current column 
           back up to the parent component to handle the data update. 
        */
        onDrop(taskId, columnId);
    };

    return (
        <div
            /* Attach the drag-and-drop event listeners to the main container */
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onDrop={handleDrop}
            /* 
               Dynamic Styling:
               If 'isOver' is true, we apply indigo colors and a slight scale-up 
               effect to make the UI feel reactive and "physical."
            */
            className={`flex flex-col w-full min-w-[300px] rounded-3xl p-5 border transition-all duration-200 h-fit min-h-[500px] ${isOver ? "bg-indigo-50/50 border-indigo-200 scale-[1.01] shadow-inner" : "bg-slate-100/50 border-slate-200/60"}`}
        >
            {/* COLUMN HEADER */}
            <div className="flex items-center justify-between mb-6 px-1">
                <div className="flex items-center gap-2">
                    <Circle className="w-2.5 h-2.5 fill-indigo-500 text-indigo-500" />
                    <h2 className="text-sm font-bold text-slate-700 uppercase tracking-wider">{title}</h2>
                    <span className="ml-2 px-2.5 py-0.5 bg-white rounded-full text-xs font-bold text-slate-500 border border-slate-200 shadow-sm">{tasks.length}</span>
                </div>
            </div>

            {/* If the 'AddTaskForm' was passed down as a child, it renders here */}
            {children && <div className="mb-4">{children}</div>}

            <div className="flex flex-col gap-4">
                {tasks.length === 0 ? (
                    /* Show this empty state box if no tasks exist in this column */
                    <div className="flex flex-col items-center justify-center py-12 border-2 border-dashed border-slate-200 rounded-2xl bg-white/50">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Nothing here yet</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {/* Map through the tasks and render a card for each one */}
                        {tasks.map((task) => (
                            <TaskCard key={task.id} task={task} onDelete={onDelete} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Column;
