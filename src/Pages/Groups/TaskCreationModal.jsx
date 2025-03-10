import { useState } from "react";
import { TasksApi } from "../../api";
import { toast } from "react-toastify";

const TaskCreationModal = ({
  isOpen,
  onClose,
  groupParticipants,
  groupId,
  usersList,
  onSuccess,
}) => {
  const [taskName, setTaskName] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [taskCategory, setTaskCategory] = useState("");
  const [taskStatus, setTaskStatus] = useState("In Progress");
  const [assignedUser, setAssignedUser] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Find users that are participants in the group
  const participantUsers = usersList.filter((user) =>
    groupParticipants.includes(user.id.toString())
  );

  const handleSubmit = async (e) => {
    e.preventDefault();

    const taskData = {
      name: taskName,
      description: taskDescription,
      category: taskCategory,
      status: taskStatus,
      assignedTo: assignedUser,
      groupId: groupId,
    };

    setIsSubmitting(true);
    try {
      const response = await TasksApi.post("/createGroupTasks", taskData);

      onSuccess(response.data.task);
      resetForm();
      onClose();
      toast.success("Tarea creada exitosamente");
    } catch (error) {
      console.error("Error al crear la tarea:", error);
      toast.error("Error al crear la tarea");
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setTaskName("");
    setTaskDescription("");
    setTaskCategory("");
    setTaskStatus("In Progress");
    setAssignedUser("");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h3 className="text-xl font-semibold mb-4">Crear Nueva Tarea</h3>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="taskName"
              className="block text-sm font-medium text-gray-700"
            >
              Nombre de la Tarea
            </label>
            <input
              type="text"
              id="taskName"
              value={taskName}
              onChange={(e) => setTaskName(e.target.value)}
              className="w-full px-2 py-2 mt-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-200"
              required
              disabled={isSubmitting}
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="taskDescription"
              className="block text-sm font-medium text-gray-700"
            >
              Descripción
            </label>
            <textarea
              id="taskDescription"
              value={taskDescription}
              onChange={(e) => setTaskDescription(e.target.value)}
              className="w-full px-2 py-2 mt-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-200"
              rows="3"
              required
              disabled={isSubmitting}
            ></textarea>
          </div>
          <div className="mb-4">
            <label
              htmlFor="taskCategory"
              className="block text-sm font-medium text-gray-700"
            >
              Categoría
            </label>
            <input
              type="text"
              id="taskCategory"
              value={taskCategory}
              onChange={(e) => setTaskCategory(e.target.value)}
              className="w-full px-2 py-2 mt-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-200"
              required
              disabled={isSubmitting}
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="taskStatus"
              className="block text-sm font-medium text-gray-700"
            >
              Estado
            </label>
            <select
              id="taskStatus"
              value={taskStatus}
              onChange={(e) => setTaskStatus(e.target.value)}
              className="w-full px-2 py-2 mt-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-200"
              disabled={isSubmitting}
            >
              <option value="In Progress">En Progreso</option>
              <option value="Completed">Completado</option>
              <option value="Paused">Pausado</option>
            </select>
          </div>
          <div className="mb-4">
            <label
              htmlFor="assignedUser"
              className="block text-sm font-medium text-gray-700"
            >
              Asignar a
            </label>
            <select
              id="assignedUser"
              value={assignedUser}
              onChange={(e) => setAssignedUser(e.target.value)}
              className="w-full px-2 py-2 mt-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-200"
              required
              disabled={isSubmitting}
            >
              <option value="">Seleccionar usuario</option>
              {participantUsers.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.email}
                </option>
              ))}
            </select>
          </div>
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm text-white font-bold bg-red-600 rounded-md hover:bg-red-700 focus:outline-none"
              disabled={isSubmitting}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-black rounded-md hover:bg-gray-800 focus:outline-none"
              disabled={isSubmitting}
            >
              Crear Tarea
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskCreationModal;
