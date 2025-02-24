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
import { IoIosAlert, IoMdAdd } from "react-icons/io";

const DashboardPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({
    name: "",
    description: "",
    dueDate: "",
    status: "In Progress",
    category: "",
  });

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch("http://localhost:5000/tasks", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        const data = await response.json();

        if (response.ok) {
          setTasks(data.tasks);
        }
      } catch (error) {
        console.error("Error al obtener las tareas:", error);
        alert("Error en el servidor");
      }
    };

    fetchTasks();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewTask({ ...newTask, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/add-tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(newTask),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Tarea añadida exitosamente");
        setTasks([...tasks, data.task]);
        setIsModalOpen(false);
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error("Error al añadir la tarea:", error);
      alert("Error en el servidor");
    }
  };

  const getTaskStats = () => {
    const total = tasks.length;
    const completed = tasks.filter((task) => task.status === "Done").length;
    const inProgress = tasks.filter(
      (task) => task.status === "In Progress"
    ).length;
    const pausedTask = tasks.filter((task) => task.status === "Paused").length;

    return { total, completed, inProgress, pausedTask };
  };

  const getCategoryPercentages = () => {
    const categories = {};
    tasks.forEach((task) => {
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
    }));
  };

  const getTimeRemaining = (dueDate) => {
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
            percentage={((stats.completed / stats.total) * 100).toFixed(0)}
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
              <div className="space-y-4">
                {tasks
                  .filter((task) => task.status !== "Done")
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
                            {task.category}
                          </p>
                        </div>
                        <div className="flex items-center">
                          <span
                            className={`text-sm px-2 py-1 rounded ${
                              getTimeRemaining(task.dueDate) === "Caducado"
                                ? "bg-red-100 text-red-700"
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
            </div>
          </div>

          {/* Tareas por Categoría */}
          <div>
            <div className="bg-gray-50 rounded-lg p-6">
              <FaFolderOpen className="mr-2" />
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                Tareas por Categoría
              </h2>
              <div className="space-y-4">
                {getCategoryPercentages().map(({ category, percentage }) => (
                  <div
                    key={category}
                    className="bg-white p-4 rounded-lg shadow-sm"
                  >
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium capitalize">{category}</span>
                      <span className="text-sm text-gray-600">
                        {percentage}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-black rounded-full h-2 transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Botón para agregar tarea */}
        <button
          onClick={() => setIsModalOpen(true)}
          className="fixed bottom-8 right-8 bg-black text-white rounded-full p-4 shadow-lg hover:bg-gray-800 transition-colors duration-300"
        >
          <IoMdAdd className="h-8 w-8" />
        </button>

        {/* Modal para agregar tarea */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg p-8 max-w-md w-full">
              <h3 className="text-2xl font-semibold mb-4">
                Agregar Nueva Tarea
              </h3>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setIsModalOpen(false);
                }}
              >
                <input
                  type="text"
                  name="name"
                  placeholder="Nombre de la tarea"
                  className="w-full p-2 mb-4 border rounded"
                  required
                />
                <textarea
                  name="description"
                  placeholder="Descripción"
                  className="w-full p-2 mb-4 border rounded"
                  rows="3"
                ></textarea>
                <input
                  type="datetime-local"
                  name="dueDate"
                  className="w-full p-2 mb-4 border rounded"
                />
                <select
                  name="category"
                  className="w-full p-2 mb-4 border rounded"
                >
                  <option value="">Seleccionar categoría</option>
                  <option value="Trabajo">Trabajo</option>
                  <option value="Personal">Personal</option>
                  <option value="Otros">Otros</option>
                </select>
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="mr-2 px-4 py-2 text-gray-600 hover:text-gray-800"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800"
                  >
                    Agregar Tarea
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
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
