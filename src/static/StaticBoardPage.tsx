import { useState, useEffect } from "react";
import { Loader2, LayoutDashboard, LogOut } from "lucide-react";
import Column from "../components/Column";
import AddTaskForm from "../components/AddTaskForm";
import type { ColumnId, Task } from "../types";
import { toast, Toaster } from "sonner";
import { DUMMY_TASKS } from "./dummyData";

const COLUMNS: { title: string; id: ColumnId }[] = [
    { title: "To Do", id: "todo" },
    { title: "In Progress", id: "inprogress" },
    { title: "Done", id: "done" },
];

interface StaticBoardPageProps {
    onSignOut: () => void;
}

const StaticBoardPage: React.FC<StaticBoardPageProps> = ({ onSignOut }) => {
    // We mock the user for the demo
    const user = { email: "destiny@flowboard.com" };

    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);

    /**
     * EFFECT: Load tasks from localStorage or use DUMMY_TASKS
     */
    useEffect(() => {
        const savedTasks = localStorage.getItem("flowboard_tasks");
        if (savedTasks) {
            setTasks(JSON.parse(savedTasks));
        } else {
            setTasks(DUMMY_TASKS);
        }

        // Add a slight delay to simulate a real fetch for the "Premium" feel
        const timer = setTimeout(() => {
            setLoading(false);
        }, 800);

        return () => clearTimeout(timer);
    }, []);

    /**
     * EFFECT: Save tasks to localStorage whenever they change
     */
    useEffect(() => {
        if (!loading) {
            localStorage.setItem("flowboard_tasks", JSON.stringify(tasks));
        }
    }, [tasks, loading]);

    const handleAddTask = async (title: string, description: string) => {
        const newTask: Task = {
            id: Math.random().toString(36).substr(2, 9),
            user_id: "demo-user",
            title,
            description,
            column: "todo",
            position: tasks.filter((t) => t.column === "todo").length,
            created_at: new Date().toISOString(),
        };

        setTasks([...tasks, newTask]);
        toast.success("Task added successfully!");
    };

    const handleMoveTask = async (taskId: string, targetColumn: ColumnId, targetPosition?: number) => {
        const taskToMove = tasks.find((t) => t.id === taskId);
        if (!taskToMove) return;

        const otherTasks = tasks.filter((t) => t.id !== taskId);
        const columnTasks = otherTasks.filter((t) => t.column === targetColumn);
        columnTasks.sort((a, b) => a.position - b.position);

        const newPosition = targetPosition !== undefined ? targetPosition : columnTasks.length;
        columnTasks.splice(newPosition, 0, { ...taskToMove, column: targetColumn });

        const updatedColumnTasks = columnTasks.map((t, index) => ({ ...t, position: index }));
        const finalTasks = [...otherTasks.filter((t) => t.column !== targetColumn), ...updatedColumnTasks];

        setTasks(finalTasks);
    };

    const handleDeleteTask = async (taskId: string) => {
        setTasks((prev) => prev.filter((t) => t.id !== taskId));
        toast.success("Task deleted");
    };

    const handleReorderTask = (draggedTaskId: string, targetTaskId: string) => {
        const targetTask = tasks.find((t) => t.id === targetTaskId);
        if (!targetTask) return;

        handleMoveTask(draggedTaskId, targetTask.column, targetTask.position);
    };

    return (
        <div className="min-h-screen bg-slate-50">
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
                        <p className="text-sm font-bold text-slate-900 leading-none">{user.email.split("@")[0]}</p>
                    </div>
                    <button onClick={onSignOut} className="flex items-center gap-2 bg-slate-50 hover:bg-red-50 text-slate-600 hover:text-red-600 px-3 py-1.5 rounded-lg transition-all font-bold text-xs border border-slate-200 hover:border-red-200">
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
                    <div className="flex-1 flex flex-col items-center justify-center">
                        <Loader2 className="w-8 h-8 text-indigo-500 animate-spin mb-4" />
                        <p className="text-slate-500 font-medium">Loading your tasks...</p>
                    </div>
                ) : (
                    <div className="flex gap-6 overflow-x-auto pb-8 snap-x scrollbar-hide flex-1 items-start">
                        {COLUMNS.map((col) => (
                            <div key={col.id} className="flex-1 snap-center min-w-[320px]">
                                <Column title={col.title} columnId={col.id} onDrop={handleMoveTask} onDelete={handleDeleteTask} onDropOnCard={handleReorderTask} tasks={tasks.filter((t) => t.column === col.id)}>
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

export default StaticBoardPage;
