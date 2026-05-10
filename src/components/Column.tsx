import React from "react";
/* Import the data types to ensure 'tasks' and 'columnId' follow our app's rules */
import type { Task, ColumnId } from "../types";
/* A simple circle icon for the header decoration */
import { Circle } from "lucide-react";
/* Import the TaskCard component to display individual task details */
import TaskCard from "./TaskCard";

/**
 * PROPS DEFINITION:
 * title: The name of the column (e.g., "To Do").
 * tasks: An array of task objects belonging to this specific column.
 * children: This allows us to inject the 'AddTaskForm' into the column from the parent.
 */
interface ColumnProps {
    title: string;
    columnId: ColumnId;
    tasks: Task[];
    children?: React.ReactNode;
}

const Column: React.FC<ColumnProps> = ({ title, tasks, children }) => {
    return (
        /* The main column container. 'min-w-[300px]' ensures columns don't get too squished on desktop. */
        <div className="flex flex-col w-full min-w-[300px] bg-slate-100/50 rounded-3xl p-5 border border-slate-200/60 h-fit min-h-[500px]">
            {/* COLUMN HEADER */}
            <div className="flex items-center justify-between mb-6 px-1">
                <div className="flex items-center gap-2">
                    {/* Indigo circle icon for styling */}
                    <Circle className="w-2.5 h-2.5 fill-indigo-500 text-indigo-500" />
                    <h2 className="text-sm font-bold text-slate-700 uppercase tracking-wider">{title}</h2>
                    {/* The Task Counter pill: shows exactly how many tasks are currently in this list */}
                    <span className="ml-2 px-2.5 py-0.5 bg-white rounded-full text-xs font-bold text-slate-500 border border-slate-200 shadow-sm">{tasks.length}</span>
                </div>
            </div>

            {/* ADD TASK FORM SLOT
                If 'children' exists (meaning BoardPage sent the AddTaskForm), render it here. */}
            {children && <div className="mb-4">{children}</div>}

            {/* TASK LIST CONTAINER */}
            <div className="flex flex-col gap-4">
                {/* 
                  CONDITIONAL RENDERING:
                  If there are no tasks, show a "Dashed Box" that says "Empty".
                  Otherwise, show the container where TaskCards will live.
                */}
                {tasks.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 border-2 border-dashed border-slate-200 rounded-2xl bg-white/50">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Empty</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {/* 
                          DYNAMIC LIST:
                          We loop through our tasks array and create a <TaskCard /> for every task.
                        */}
                        {tasks.map((task) => (
                            <TaskCard key={task.id} task={task} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Column;
