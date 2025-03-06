import { useState, useEffect } from "react";
import MainLayout from "../../Layouts/MainLayouts";
import {
  FaTrophy,
  FaCheckCircle,
  FaClock,
  FaFolder,
  FaFolderOpen,
  FaPauseCircle,
} from "react-icons/fa";
import { IoIosAlert } from "react-icons/io";

import { TasksApi } from "../../api";
import AddTaskModal, { AddTaskButton } from "../Tasks/AddTaskModal";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const DashboardPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    setIsLoading(true);
    try {
      const response = await TasksApi.get("/tasks");

      if (response.status === 200) {
        setTasks(response.data.tasks || []);
      }
    } catch (error) {
      console.error("Error al obtener las tareas:", error);
      if (error.response && error.response.status === 404) {
        // No tasks found is not an error, just set empty array
        setTasks([]);
      } else {
        toast.error("Error al cargar las tareas");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleTaskAdded = (newTask) => {
    setTasks([...tasks, newTask]);
  };

  const getTaskStats = () => {
    const total = tasks.length;
    const completed = tasks.filter(
      (task) => task.status === "Completed"
    ).length;
    const inProgress = tasks.filter(
      (task) => task.status === "In Progress"
    ).length;
    const pausedTask = tasks.filter((task) => task.status === "Paused").length;

    return { total, completed, inProgress, pausedTask };
  };

  const getCategoryPercentages = () => {
    if (tasks.length === 0) return [];

    const categories = {};
    tasks.forEach((task) => {
      if (!task.category) return;

      if (categories[task.category]) {
        categories[task.category]++;
      } else {
        categories[task.category] = 1;
      }
    });

    const total = tasks.length;
    return Object.entries(categories).map(([category, count]) => ({
      category,
      percentage: ((count / total) * 100).toFixed(1),
      count,
    }));
  };

  const getTimeRemaining = (dueDate) => {
    if (!dueDate) return "Sin fecha";

    const now = new Date();
    const due = new Date(dueDate);
    const timeDiff = due - now;

    if (timeDiff < 0) return "Caducado";

    const hours = Math.floor(timeDiff / (1000 * 60 * 60));
    if (hours < 24) return `${hours} horas`;

    const days = Math.floor(hours / 24);
    return `${days} días`;
  };

  const stats = getTaskStats();
  const categoryPercentages = getCategoryPercentages();

  return (
    <MainLayout>
      <div className="bg-white min-h-screen p-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-800">
              Tareas y Actividades
            </h1>
            <p className="text-gray-600 mt-2">
              Aquí tan tus tareas y actividades, pa que te pongas abusado!.
            </p>
          </div>
        </div>

        {/* Métricas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <MetricCard
            icon={<FaTrophy className="h-6 w-6" />}
            title="Total de Tareas"
            value={stats.total}
            iconColor="text-purple-600"
          />
          <MetricCard
            icon={<FaCheckCircle className="h-6 w-6" />}
            title="Completadas"
            value={stats.completed}
            percentage={
              stats.total > 0
                ? ((stats.completed / stats.total) * 100).toFixed(0)
                : "0"
            }
            iconColor="text-green-600"
          />
          <MetricCard
            icon={<FaClock className="h-6 w-6" />}
            title="En Progreso"
            value={stats.inProgress}
            iconColor="text-blue-600"
          />
          <MetricCard
            icon={<FaPauseCircle className="h-6 w-6" />}
            title="Pausadas"
            value={stats.pausedTask}
            iconColor="text-yellow-600"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Tareas Recientes */}
          <div className="lg:col-span-2">
            <div className="bg-gray-50 rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <IoIosAlert className="mr-2 text-red-500" />
                Tareas Recientes
              </h2>
              {isLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
                  <p className="mt-2 text-gray-600">Cargando tareas...</p>
                </div>
              ) : tasks.filter((task) => task.status !== "Completed").length >
                0 ? (
                <div className="space-y-4">
                  {tasks
                    .filter((task) => task.status !== "Completed")
                    .map((task) => (
                      <div
                        key={task.id}
                        className="bg-white p-4 rounded-lg shadow-sm"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-medium">{task.name}</h3>
                            <p className="text-sm text-gray-600 flex items-center mt-1">
                              <FaFolder className="h-4 w-4 mr-1" />
                              {task.category || "Sin categoría"}
                            </p>
                          </div>
                          <div className="flex items-center">
                            <span
                              className={`text-sm px-2 py-1 rounded ${
                                getTimeRemaining(task.dueDate) === "Caducado"
                                  ? "bg-red-100 text-red-700"
                                  : getTimeRemaining(task.dueDate) ===
                                    "Sin fecha"
                                  ? "bg-gray-100 text-gray-700"
                                  : "bg-yellow-100 text-yellow-700"
                              }`}
                            >
                              {getTimeRemaining(task.dueDate)}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">No hay tareas pendientes</p>
                  <button
                    onClick={() => setIsModalOpen(true)}
                    className="mt-4 px-4 py-2 bg-black text-white rounded hover:bg-gray-800"
                  >
                    Agregar una tarea
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Tareas por Categoría */}
          <div>
            <div className="bg-gray-50 rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <FaFolderOpen className="mr-2" />
                Tareas por Categoría
              </h2>
              {isLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
                </div>
              ) : categoryPercentages.length > 0 ? (
                <div className="space-y-4">
                  {categoryPercentages.map(
                    ({ category, percentage, count }) => (
                      <div
                        key={category}
                        className="bg-white p-4 rounded-lg shadow-sm"
                      >
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-medium capitalize">
                            {category}
                          </span>
                          <span className="text-sm text-gray-600">
                            {percentage}% ({count})
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-black rounded-full h-2 transition-all duration-500"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    )
                  )}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">
                    No hay categorías para mostrar
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Botón para agregar tarea */}
        <AddTaskButton onClick={() => setIsModalOpen(true)} />

        {/* Modal para agregar tarea */}
        <AddTaskModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onTaskAdded={handleTaskAdded}
        />
        <ToastContainer position="bottom-right" autoClose={3000} />
      </div>
    </MainLayout>
  );
};

const MetricCard = ({ icon, title, value, percentage, iconColor }) => (
  <div className="bg-gray-50 rounded-lg p-6">
    <div className="flex items-center">
      <div className={`${iconColor}`}>{icon}</div>
      <span className="text-3xl font-bold ml-3">{value}</span>
    </div>
    <h3 className="text-gray-600 mt-2">{title}</h3>
    {percentage && (
      <div className="mt-2">
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-black rounded-full h-2 transition-all duration-500"
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    )}
  </div>
);

export default DashboardPage;
