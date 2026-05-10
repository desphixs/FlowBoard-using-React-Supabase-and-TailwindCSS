import { useState, useEffect } from "react";
/* Accessing our custom auth hook to know which user is currently logged in */
import { useAuth } from "../context/AuthContext";
/* The Supabase client for database operations (Select, Insert, etc.) */
import { supabase } from "../lib/supabase";
/* Icons for the UI */
import { LogOut, Loader2, LayoutDashboard } from "lucide-react";
/* UI Component for the Kanban columns */
import Column from "../components/Column";
/* UI Component for the input form to create tasks */
import AddTaskForm from "../components/AddTaskForm";
/* TypeScript types for our Task objects and Column IDs */
import type { ColumnId, Task } from "../types";
/* Toast notifications for success/error messages */
import { toast, Toaster } from "sonner";

/**
 * We define the columns as an array of objects.
 * This makes it easy to map over them to render UI without repeating code.
 */
const COLUMNS: { title: string; id: ColumnId }[] = [
    { title: "To Do", id: "todo" },
    { title: "In Progress", id: "inprogress" },
    { title: "Done", id: "done" },
];

const BoardPage = () => {
    /* Get the current user object from our Auth Context */
    const { user } = useAuth();
    /* State to store all the tasks fetched or created for this board */
    const [tasks, setTasks] = useState<Task[]>([]);
    /* Loading state to show a spinner during the initial data fetch */
    const [loading, setLoading] = useState(true);

    /**
     * EFFECT: Fetch Tasks
     * This runs once when the component first loads (and whenever 'user' changes).
     */
    useEffect(() => {
        /* Only fetch if we have a user logged in */
        if (user) {
            fetchTasks();
        }
    }, [user]);

    /**
     * fetchTasks:
     * Pulls the user's tasks from the Supabase database.
     */
    const fetchTasks = async () => {
        try {
            const { data, error } = await supabase.from("tasks").select("*").eq("user_id", user?.id).order("position", { ascending: true });

            if (error) throw error;

            /* Update our local state with the data from the cloud */
            setTasks(data || []);
        } catch (error: any) {
            toast.error(error.message || "Failed to fetch tasks");
        } finally {
            /* Whether it succeeds or fails, stop the loading spinner */
            setLoading(false);
        }
    };

    /**
     * handleSignOut:
     * Tells Supabase to end the current session.
     */
    const handleSignOut = async () => {
        await supabase.auth.signOut();
    };

    /**
     * handleAddTask:
     * Takes the title and description from the AddTaskForm and saves it to Supabase.
     */
    const handleAddTask = async (title: string, description: string) => {
        if (!user) return;

        try {
            const { data, error } = await supabase
                .from("tasks")
                .insert({
                    title,
                    description,
                    user_id: user.id,
                    column: "todo" as ColumnId,
                    /* We calculate the order by checking how many tasks are already in 'todo' */
                    position: tasks.filter((t) => t.column === "todo").length,
                })
                .select()
                .single();

            if (error) throw error;

            /* Add to our local state so it appears instantly */
            setTasks([...tasks, data]);
            toast.success("Task added successfully!");
        } catch (error: any) {
            toast.error(error.message || "Failed to add task");
        }
    };

    /**
     * handleMoveTask:
     * Logic for when a card is dragged and dropped into a new column.
     */
    const handleMoveTask = async (taskId: string, targetColumn: ColumnId, targetPosition?: number) => {
        /* Find the task we are moving */
        const taskToMove = tasks.find((t) => t.id === taskId);
        if (!taskToMove) return;

        /**
         * OPTIMISTIC UI UPDATE:
         * We calculate the new order locally and update the state immediately.
         */
        const otherTasks = tasks.filter((t) => t.id !== taskId);
        
        /* Filter tasks that are already in the target column */
        const columnTasks = otherTasks.filter((t) => t.column === targetColumn);
        
        /* Sort them by position to be safe */
        columnTasks.sort((a, b) => a.position - b.position);

        /* If no position was specified, we put it at the end of the column */
        const newPosition = targetPosition !== undefined ? targetPosition : columnTasks.length;

        /* Insert the task at the new position */
        columnTasks.splice(newPosition, 0, { ...taskToMove, column: targetColumn });

        /* Re-assign position numbers 0, 1, 2... to everything in that column */
        const updatedColumnTasks = columnTasks.map((t, index) => ({ ...t, position: index }));

        /* Combine with tasks from other columns */
        const finalTasks = [...otherTasks.filter((t) => t.column !== targetColumn), ...updatedColumnTasks];

        setTasks(finalTasks);

        try {
            /**
             * SYNC WITH DATABASE:
             * We tell Supabase to update the column and position.
             */
            const { error } = await supabase
                .from("tasks")
                .update({ 
                    column: targetColumn,
                    position: newPosition 
                })
                .eq("id", taskId);

            if (error) throw error;
        } catch (error: any) {
            toast.error("Failed to sync move to database");
            fetchTasks();
        }
    };

    /**
     * handleDeleteTask:
     * Removes a task from the database and updates the UI instantly.
     */
    const handleDeleteTask = async (taskId: string) => {
        /* OPTIMISTIC UI: Remove the task from the local state array instantly */
        setTasks((prev) => prev.filter((t) => t.id !== taskId));

        try {
            /* Tell Supabase to permanently delete this row */
            const { error } = await supabase.from("tasks").delete().eq("id", taskId);

            if (error) throw error;
            toast.success("Task deleted");
        } catch (error: any) {
            toast.error("Failed to delete task");
            /* If the deletion failed on the server, fetch the tasks again to put it back on screen */
            fetchTasks();
        }
    };

    /**
     * handleReorderTask:
     * Logic for when a card is dropped directly onto another card.
     */
    const handleReorderTask = (draggedTaskId: string, targetTaskId: string) => {
        const targetTask = tasks.find((t) => t.id === targetTaskId);
        if (!targetTask) return;

        /* Move the task to the exact position of the task it was dropped on */
        handleMoveTask(draggedTaskId, targetTask.column, targetTask.position);
    };

    return (
        <div className="min-h-screen bg-slate-50">
            {/* The container that holds our popup notifications */}
            <Toaster position="top-center" />

            {/* NAVIGATION BAR */}
            <nav className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between sticky top-0 z-50">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shadow-sm">
                        <LayoutDashboard className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-lg font-bold text-slate-900 tracking-tight">FlowBoard</span>
                    <div className="h-4 w-px bg-slate-200 mx-2 hidden sm:block"></div>
                    <span className="text-sm font-medium text-slate-500 hidden sm:block">
                        {tasks.length} {tasks.length === 1 ? "task" : "tasks"}
                    </span>
                </div>

                <div className="flex items-center gap-4">
                    <div className="hidden sm:block text-right">
                        <p className="text-sm font-bold text-slate-900 leading-none">{user?.email?.split("@")[0]}</p>
                    </div>
                    <button onClick={handleSignOut} className="flex items-center gap-2 bg-slate-50 hover:bg-red-50 text-slate-600 hover:text-red-600 px-3 py-1.5 rounded-lg transition-all font-bold text-xs border border-slate-200 hover:border-red-200">
                        <LogOut className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Sign Out</span>
                    </button>
                </div>
            </nav>

            {/* MAIN CONTENT AREA */}
            <main className="p-6 sm:p-10 max-w-[1400px] mx-auto h-[calc(100vh-4rem)] flex flex-col">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight">My Workspace</h1>
                    <p className="text-slate-500 font-medium mt-1 text-sm">Manage your projects and keep track of your progress.</p>
                </div>

                {loading ? (
                    /* Loading State UI */
                    <div className="flex-1 flex flex-col items-center justify-center">
                        <Loader2 className="w-8 h-8 text-indigo-500 animate-spin mb-4" />
                        <p className="text-slate-500 font-medium">Loading your tasks...</p>
                    </div>
                ) : (
                    /* THE KANBAN BOARD */
                    <div className="flex gap-6 overflow-x-auto pb-8 snap-x scrollbar-hide flex-1 items-start">
                        {/* We loop through our COLUMNS array to create the 3 columns (To Do, In Progress, Done) */}
                        {COLUMNS.map((col) => (
                            <div key={col.id} className="flex-1 snap-center min-w-[320px]">
                                <Column
                                    title={col.title}
                                    columnId={col.id}
                                    /* Pass the move function down to the column */
                                    onDrop={handleMoveTask}
                                    /* Pass the delete function down to the column */
                                    onDelete={handleDeleteTask}
                                    /* Pass the reorder function down to the column */
                                    onDropOnCard={handleReorderTask}
                                    /* We only pass tasks to this column if they match its ID (e.g., 'todo') */
                                    tasks={tasks.filter((t) => t.column === col.id)}
                                >
                                    {/* Only show the "Add Task" button in the "To Do" column */}
                                    {col.id === "todo" && <AddTaskForm onAdd={handleAddTask} />}
                                </Column>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
};


export default BoardPage;
