import { useState } from "react";
import { TasksApi } from "../../api";
import { toast, ToastContainer } from "react-toastify";
import { IoMdAdd } from "react-icons/io";

const AddTaskModal = ({ isOpen, onClose, onTaskAdded }) => {
  const [newTask, setNewTask] = useState({
    name: "",
    description: "",
    dueDate: "",
    status: "In Progress",
    category: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewTask({ ...newTask, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await TasksApi.post("/add-tasks", newTask);

      if (response.status === 201 || response.status === 200) {
        toast.success("Tarea añadida exitosamente");
        onTaskAdded(response.data.task);
        resetForm();
        onClose();
      } else {
        toast.error(response.data.message || "Error al añadir la tarea");
      }
    } catch (error) {
      console.error("Error al añadir la tarea:", error);
      toast.error("Error al añadir la tarea");
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setNewTask({
      name: "",
      description: "",
      dueDate: "",
      status: "In Progress",
      category: "",
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-md w-full">
        <h3 className="text-2xl font-semibold mb-4">Agregar Nueva Tarea</h3>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Nombre de la tarea"
            className="w-full p-2 mb-4 border rounded"
            value={newTask.name}
            onChange={handleInputChange}
            required
            disabled={isSubmitting}
          />
          <textarea
            name="description"
            placeholder="Descripción"
            className="w-full p-2 mb-4 border rounded"
            rows="3"
            value={newTask.description}
            onChange={handleInputChange}
            disabled={isSubmitting}
          ></textarea>
          <input
            type="datetime-local"
            name="dueDate"
            className="w-full p-2 mb-4 border rounded"
            value={newTask.dueDate}
            onChange={handleInputChange}
            disabled={isSubmitting}
          />
          <select
            name="category"
            className="w-full p-2 mb-4 border rounded"
            value={newTask.category}
            onChange={handleInputChange}
            disabled={isSubmitting}
          >
            <option value="">Seleccionar categoría</option>
            <option value="Trabajo">Trabajo</option>
            <option value="Personal">Personal</option>
            <option value="Otros">Otros</option>
          </select>
          <div className="flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="mr-2 px-4 py-2 text-gray-600 hover:text-gray-800"
              disabled={isSubmitting}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800 disabled:bg-gray-400"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Agregando..." : "Agregar Tarea"}
            </button>
          </div>
        </form>
      </div>
      <ToastContainer position="bottom-right" autoClose={3000} />
    </div>
  );
};

// Floating action button component
export const AddTaskButton = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-8 right-8 bg-black text-white rounded-full p-4 shadow-lg hover:bg-gray-800 transition-colors duration-300"
      aria-label="Agregar tarea"
    >
      <IoMdAdd className="h-8 w-8" />
    </button>
  );
};

export default AddTaskModal;
