import { useState, useEffect } from "react";
import MainLayout from "../../Layouts/MainLayouts";
import { BiPlusCircle } from "react-icons/bi";
import { FaTimes } from "react-icons/fa";

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

  return (
    <MainLayout>
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Bienvenido al Dashboard
        </h2>
        <p className="text-gray-600 mb-6">Actividades del usuario</p>

        {/* Lista de tareas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {tasks.map((task, index) => (
            <div key={index} className="bg-gray-100 p-4 rounded-lg">
              <h3 className="font-semibold">{task.name}</h3>
              <p className="text-sm text-gray-600">{task.status}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Botón flotante */}
      <button
        onClick={() => setIsModalOpen(true)}
        className="fixed bottom-8 right-8 bg-black text-white rounded-full p-5 shadow-lg hover:bg-gray-800 transition-colors duration-300"
      >
        <BiPlusCircle size={36} />
      </button>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white rounded-lg p-8 max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">Agregar nueva tarea</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <FaTimes size={24} />
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700"
                >
                  Nombre de la tarea
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={newTask.name}
                  onChange={handleInputChange}
                  className="w-full px-4 mt-2 py-2 border rounded-md focus:outline-none focus:ring  focus:ring-black"
                  required
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-gray-700"
                >
                  Descripción
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={newTask.description}
                  onChange={handleInputChange}
                  className="w-full px-4 mt-2 py-2 border rounded-md focus:outline-none focus:ring  focus:ring-black"
                  rows="3"
                ></textarea>
              </div>
              <div className="mb-4">
                <label
                  htmlFor="dueDate"
                  className="block text-sm font-medium text-gray-700"
                >
                  Fecha límite
                </label>
                <input
                  type="datetime-local"
                  id="dueDate"
                  name="dueDate"
                  value={newTask.dueDate}
                  onChange={handleInputChange}
                  className="w-full px-4 mt-2 py-2 border rounded-md focus:outline-none focus:ring  focus:ring-black"
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="status"
                  className="block text-sm font-medium text-gray-700"
                >
                  Estado
                </label>
                <select
                  id="status"
                  name="status"
                  value={newTask.status}
                  onChange={handleInputChange}
                  className="w-full px-4 mt-2 py-2 border rounded-md focus:outline-none focus:ring focus:ring-black"
                >
                  <option value="In Progress">En progreso</option>
                  <option value="Done">Completada</option>
                  <option value="Paused">Pausada</option>
                  <option value="Revision">En revisión</option>
                </select>
              </div>
              <div className="mb-4">
                <label
                  htmlFor="category"
                  className="block text-sm font-medium text-gray-700"
                >
                  Categoría
                </label>
                <input
                  type="text"
                  id="category"
                  name="category"
                  value={newTask.category}
                  onChange={handleInputChange}
                  className="w-full px-4 mt-2 py-2 border rounded-md focus:outline-none focus:ring  focus:ring-black"
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800 transition-colors duration-300"
                >
                  Agregar tarea
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </MainLayout>
  );
};

export default DashboardPage;
