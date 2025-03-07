import { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import MainLayout from "../../Layouts/MainLayouts";
import { TasksApi } from "../../api";
import AddTaskModal, { AddTaskButton } from "./AddTaskModal";

const TasksPage = () => {
  const [tasks, setTasks] = useState({
    Completed: [],
    "In Progress": [],
    Paused: [],
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    setIsLoading(true);
    try {
      const response = await TasksApi.get("/tasks");

      // Handle the case where there are no tasks
      const tasksList = response.data.tasks || [];

      const organizedTasks = {
        Completed: tasksList.filter((task) => task.status === "Completed"),
        "In Progress": tasksList.filter(
          (task) => task.status === "In Progress"
        ),
        Paused: tasksList.filter((task) => task.status === "Paused"),
      };

      setTasks(organizedTasks);
    } catch (error) {
      console.error("Error fetching tasks:", error);
      if (error.response && error.response.status === 404) {
        // No tasks found is not an error, just set empty arrays
        setTasks({
          Completed: [],
          "In Progress": [],
          Paused: [],
        });
      } else {
        toast.error("Error al cargar las tareas");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleTaskAdded = (newTask) => {
    setTasks((prevTasks) => ({
      ...prevTasks,
      [newTask.status]: [...prevTasks[newTask.status], newTask],
    }));
  };

  const onDragStart = (e, taskId, sourceColumn) => {
    e.dataTransfer.setData("taskId", taskId);
    e.dataTransfer.setData("sourceColumn", sourceColumn);
  };

  const onDragOver = (e) => {
    e.preventDefault();
  };

  const onDrop = async (e, targetColumn) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData("taskId");
    const sourceColumn = e.dataTransfer.getData("sourceColumn");

    if (sourceColumn !== targetColumn) {
      try {
        const response = await TasksApi.patch(`/tasks/${taskId}`, {
          status: targetColumn,
        });

        setTasks((prevTasks) => {
          const updatedTasks = { ...prevTasks };
          const taskToMove = updatedTasks[sourceColumn].find(
            (task) => task.id.toString() === taskId
          );

          if (taskToMove) {
            updatedTasks[sourceColumn] = updatedTasks[sourceColumn].filter(
              (task) => task.id.toString() !== taskId
            );
            updatedTasks[targetColumn] = [
              ...updatedTasks[targetColumn],
              { ...taskToMove, status: targetColumn },
            ];
          }

          return updatedTasks;
        });

        toast.success("Tarea actualizada con éxito");
      } catch (error) {
        console.error("Error updating task status:", error);
        toast.error("Error al actualizar la tarea");
      }
    }
  };

  const getTotalTasksCount = () => {
    return Object.values(tasks).reduce(
      (total, columnTasks) => total + columnTasks.length,
      0
    );
  };

  return (
    <MainLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Gestión de Tareas</h1>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
          </div>
        ) : getTotalTasksCount() > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {Object.entries(tasks).map(([columnId, columnTasks]) => (
              <div
                key={columnId}
                className="bg-gray-100 p-4 rounded-lg"
                onDragOver={onDragOver}
                onDrop={(e) => onDrop(e, columnId)}
              >
                <h2 className="text-xl font-semibold mb-4 capitalize">
                  {columnId} ({columnTasks.length})
                </h2>
                <div className="space-y-4">
                  {columnTasks.map((task) => (
                    <div
                      key={task.id}
                      draggable
                      onDragStart={(e) => onDragStart(e, task.id, task.status)}
                      className="bg-white p-4 rounded shadow cursor-move"
                    >
                      <h3 className="font-medium">{task.name}</h3>
                      <p className="text-sm text-gray-600 mt-2">
                        {task.description}
                      </p>
                      {task.category && (
                        <div className="mt-2">
                          <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-xs font-semibold text-gray-700">
                            {task.category}
                          </span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-gray-50 rounded-lg">
            <h3 className="text-xl font-medium text-gray-600 mb-4">
              No hay tareas disponibles
            </h3>
            <p className="text-gray-500 mb-6">
              Comienza agregando tu primera tarea
            </p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-6 py-3 bg-black text-white rounded-md hover:bg-gray-800"
            >
              Agregar Tarea
            </button>
          </div>
        )}
      </div>

      <AddTaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onTaskAdded={handleTaskAdded}
      />

      <AddTaskButton onClick={() => setIsModalOpen(true)} />

      <ToastContainer position="bottom-right" autoClose={3000} />
    </MainLayout>
  );
};

export default TasksPage;
