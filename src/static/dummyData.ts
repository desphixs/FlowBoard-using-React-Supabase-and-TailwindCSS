import type { Task } from "../types";

/**
 * These tasks will be loaded the very first time someone visits the 
 * static demo site so the board doesn't look empty and sad.
 */
export const DUMMY_TASKS: Task[] = [
    {
        id: "1",
        user_id: "demo-user",
        title: "👋 Welcome to FlowBoard!",
        description: "This is a static demo. No database is required! Your changes will be saved to your browser's local storage.",
        column: "todo",
        position: 0,
        created_at: new Date().toISOString()
    },
    {
        id: "2",
        user_id: "demo-user",
        title: "🏗️ Try Dragging Me",
        description: "You can move me between columns or reorder me vertically.",
        column: "todo",
        position: 1,
        created_at: new Date().toISOString()
    },
    {
        id: "3",
        user_id: "demo-user",
        title: "💻 Built with React",
        description: "A clean and powerful Kanban board for managing your workflow.",
        column: "inprogress",
        position: 0,
        created_at: new Date().toISOString()
    },
    {
        id: "4",
        user_id: "demo-user",
        title: "✅ Done and Dusted",
        description: "Move tasks here when they are finished.",
        column: "done",
        position: 0,
        created_at: new Date().toISOString()
    }
];
