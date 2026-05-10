import { useState, useEffect } from "react";
/* Accessing our custom auth hook to know which user is currently logged in */
import { useAuth } from "../context/AuthContext";
/* The Supabase client for database operations (Select, Insert, etc.) */
import { supabase } from "../lib/supabase";
/* LogOut icon for the sign-out button */
import { LogOut } from "lucide-react";
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
            /**
             * .select("*"): Get all columns for each task.
             * .eq("user_id", user?.id): Only get tasks that belong to THIS user.
             * .order("position", { ascending: true }): Sort them by their position number.
             */
            const { data, error } = await supabase
                .from("tasks")
                .select("*")
                .eq("user_id", user?.id)
                .order("position", { ascending: true });

            if (error) throw error;
            
            /* Update our local state with the data from the cloud */
            setTasks(data || []);
        } catch (error: any) {
            toast.error(error.message || "Failed to fetch tasks");
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

    return (
        <div className="min-h-screen bg-slate-50">
            {/* The container that holds our popup notifications */}
            <Toaster position="top-center" />

            {/* NAVIGATION BAR */}
            <nav className="h-20 bg-white border-b border-slate-100 px-6 flex items-center justify-between sticky top-0 z-50">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10">
                        <img src="https://cdn-icons-png.flaticon.com/128/11243/11243780.png" alt="FlowBoard Logo" className="w-full h-full object-contain" />
                    </div>
                    <span className="text-xl font-bold text-slate-900 tracking-tight">FlowBoard</span>
                </div>

                <div className="flex items-center gap-4">
                    <div className="hidden sm:block text-right">
                        <p className="text-sm font-bold text-slate-900 leading-none">{user?.email?.split("@")[0]}</p>
                        <p className="text-xs font-medium text-slate-500 mt-1">{user?.email}</p>
                    </div>
                    <button onClick={handleSignOut} className="flex items-center gap-2 bg-slate-50 hover:bg-red-50 text-slate-600 hover:text-red-600 px-4 py-2 rounded-xl transition-all font-bold text-sm">
                        <LogOut className="w-4 h-4" />
                        <span className="hidden sm:inline">Sign Out</span>
                    </button>
                </div>
            </nav>

            {/* MAIN CONTENT AREA */}
            <main className="p-6 sm:p-10 max-w-[1400px] mx-auto">
                <div className="mb-10">
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight">My Workspace</h1>
                    <p className="text-slate-500 font-medium mt-2">Manage your projects and keep track of your progress.</p>
                </div>

                {/* THE KANBAN BOARD */}
                <div className="flex gap-6 overflow-x-auto pb-8 snap-x scrollbar-hide">
                    {/* We loop through our COLUMNS array to create the 3 columns (To Do, In Progress, Done) */}
                    {COLUMNS.map((col) => (
                        <div key={col.id} className="flex-1 snap-center">
                            <Column
                                title={col.title}
                                columnId={col.id}
                                /* We only pass tasks to this column if they match its ID (e.g., 'todo') */
                                tasks={tasks.filter((t) => t.column === col.id)}
                            >
                                {/* Only show the "Add Task" button in the "To Do" column */}
                                {col.id === "todo" && <AddTaskForm onAdd={handleAddTask} />}
                            </Column>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
};

export default BoardPage;
