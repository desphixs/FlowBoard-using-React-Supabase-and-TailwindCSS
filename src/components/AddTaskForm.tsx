import React, { useState } from "react";
/* Plus is the '+' icon; Loader2 is the animated spinner icon for the 'saving' state */
import { Plus, Loader2 } from "lucide-react";

/**
 * PROPS DEFINITION
 * This component expects a function called 'onAdd' from its parent.
 * This function is 'async' (returns a Promise) because adding to a database takes time.
 */
interface AddTaskFormProps {
    onAdd: (title: string, description: string) => Promise<void>;
}

const AddTaskForm: React.FC<AddTaskFormProps> = ({ onAdd }) => {
    /* Tracks if we are showing the simple "Add New Task" button or the full input form */
    const [isExpanded, setIsExpanded] = useState(false);

    /* Tracks if the 'onAdd' function is currently running so we can show a loading spinner */
    const [loading, setLoading] = useState(false);

    /* Stores the current text for both the title and the description fields */
    const [formData, setFormData] = useState({
        title: "",
        description: "",
    });

    /**
     * HANDLER: handleSubmit
     * Logic to process the form when the user clicks 'Create Task' or presses Enter.
     */
    const handleSubmit = async (e: React.FormEvent) => {
        /* Prevents the browser from reloading the page */
        e.preventDefault();

        /* Simple validation: if the title is just empty spaces, don't do anything */
        if (!formData.title.trim()) return;

        /* Start the loading state to give visual feedback */
        setLoading(true);

        /* Call the function passed from the parent with the user's input */
        await onAdd(formData.title, formData.description);

        /* Success! Reset the inputs back to empty strings */
        setFormData({ title: "", description: "" });

        /* Stop the loading spinner and hide the form (collapse it back to a button) */
        setLoading(false);
        setIsExpanded(false);
    };

    /**
     * VIEW 1: COLLAPSED STATE
     * If 'isExpanded' is false, we only show a styled button.
     */
    if (!isExpanded) {
        return (
            <button
                /* Clicking this flips the state and reveals the form */
                onClick={() => setIsExpanded(true)}
                className="w-full flex items-center gap-2 p-3 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-2xl transition-all font-bold text-sm border-2 border-dashed border-transparent hover:border-indigo-100 group"
            >
                <div className="w-8 h-8 bg-slate-100 group-hover:bg-indigo-100 rounded-lg flex items-center justify-center transition-colors">
                    <Plus className="w-5 h-5" />
                </div>
                Add New Task
            </button>
        );
    }

    /**
     * VIEW 2: EXPANDED STATE (THE FORM)
     * This is shown when the user wants to actually type a new task.
     */
    return (
        <form
            onSubmit={handleSubmit}
            /* The 'animate-in' classes provide a smooth slide-down effect when the form appears */
            className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200 space-y-3 animate-in fade-in slide-in-from-top-2 duration-200"
        >
            {/* TASK TITLE INPUT */}
            <input
                /* autoFocus ensures the cursor is ready to type as soon as the form opens */
                autoFocus
                type="text"
                placeholder="Task title..."
                required
                value={formData.title}
                /* We use the spread operator (...formData) to keep the description intact while updating title */
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full bg-transparent text-sm font-bold text-slate-900 placeholder:text-slate-400 focus:outline-none"
            />

            {/* TASK DESCRIPTION TEXTAREA */}
            <textarea
                placeholder="Add a description (optional)"
                value={formData.description}
                /* Similar to the title, we update only the description property in our state object */
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full bg-transparent text-xs text-slate-600 placeholder:text-slate-400 focus:outline-none resize-none min-h-[60px]"
            />

            {/* ACTION BUTTONS */}
            <div className="flex items-center gap-2 pt-1">
                <button
                    type="submit"
                    /* Disable the button if we are currently saving or if the title is empty */
                    disabled={loading || !formData.title.trim()}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl text-xs font-bold transition-all disabled:opacity-50 flex items-center gap-2"
                >
                    {/* If loading, show the spinner; otherwise, show the button text */}
                    {loading ? <Loader2 className="w-3 h-3 animate-spin" /> : "Create Task"}
                </button>

                {/* CANCEL BUTTON */}
                <button
                    type="button"
                    /* Clicking this hides the form and goes back to the "Add New Task" button */
                    onClick={() => setIsExpanded(false)}
                    className="text-slate-400 hover:text-slate-600 px-3 py-2 text-xs font-bold transition-all"
                >
                    Cancel
                </button>
            </div>
        </form>
    );
};

export default AddTaskForm;
