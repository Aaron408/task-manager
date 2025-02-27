"use client";

import { useState, useEffect } from "react";
import { HiOutlineUserGroup } from "react-icons/hi";
import { FiSearch, FiPlusCircle } from "react-icons/fi";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import MainLayout from "../../Layouts/MainLayouts";
import CreateGroupModal from "./CreateGroupModal";
import AddParticipantModal from "./AddParticipantModal";
import TaskCreationModal from "./TaskCreationModal";

const GroupsPage = () => {
  const [groups, setGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [userId, setUserId] = useState(null);
  const [activities, setActivities] = useState({
    Completed: [],
    "In Progress": [],
    Paused: [],
  });
  const [isCreateGroupModalOpen, setIsCreateGroupModalOpen] = useState(false);
  const [isAddParticipantModalOpen, setIsAddParticipantModalOpen] =
    useState(false);
  const [isTaskCreationModalOpen, setIsTaskCreationModalOpen] = useState(false);
  const [usersList, setUsersList] = useState([]);

  useEffect(() => {
    fetchGroups();
    fetchUsersList();
  }, []);

  useEffect(() => {
    if (selectedGroup) {
      fetchGroupTasks(selectedGroup.id);
    }
  }, [selectedGroup]);

  const fetchGroups = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("Token no encontrado en localStorage");
        return;
      }

      const response = await fetch(`http://localhost:5000/groups`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Error al obtener grupos:", errorText);
        return;
      }

      const data = await response.json();
      setGroups(data.groups);
      setUserRole(data.role);
    } catch (error) {
      console.error("Error de conexión:", error);
      toast.error("Error al cargar los grupos");
    }
  };

  const fetchUsersList = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("Token no encontrado en localStorage");
        return;
      }

      const response = await fetch(`http://localhost:5000/usersList`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Error al obtener lista de usuarios:", errorText);
        return;
      }

      const data = await response.json();
      setUsersList(data.users);
    } catch (error) {
      console.error("Error al obtener lista de usuarios:", error);
      toast.error("Error al cargar la lista de usuarios");
    }
  };

  const fetchGroupTasks = async (groupId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("Token no encontrado en localStorage");
        return;
      }

      const response = await fetch(
        `http://localhost:5000/groups/${groupId}/tasks`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Error al obtener tareas del grupo:", errorText);
        return;
      }

      const data = await response.json();
      const groupedTasks = {
        Completed: [],
        "In Progress": [],
        Paused: [],
      };

      data.tasks.forEach((task) => {
        groupedTasks[task.status].push(task);
      });

      setActivities(groupedTasks);
      setUserRole(data.userRole);
      setUserId(data.userId);
    } catch (error) {
      console.error("Error al obtener tareas del grupo:", error);
      toast.error("Error al cargar las tareas del grupo");
    }
  };

  const handleGroupSelect = (group) => {
    setSelectedGroup(group);
  };

  const handleCreateGroup = async (newGroupData) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("Token no encontrado en localStorage");
        return;
      }

      const response = await fetch(`http://localhost:5000/createGroup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newGroupData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Error al crear el grupo:", errorText);
        toast.error("Error al crear el grupo");
        return;
      }

      const data = await response.json();
      setGroups([...groups, data.group]);
      setIsCreateGroupModalOpen(false);
      toast.success("Grupo creado exitosamente");
    } catch (error) {
      console.error("Error al crear el grupo:", error);
      toast.error("Error al crear el grupo");
    }
  };

  const handleAddParticipant = async (newParticipantId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("Token no encontrado en localStorage");
        return;
      }

      const response = await fetch(
        `http://localhost:5000/groups/${selectedGroup.id}/addParticipant`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ participantId: newParticipantId }),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Error al añadir participante:", errorText);
        toast.error("Error al añadir participante");
        return;
      }

      setSelectedGroup((prevGroup) => ({
        ...prevGroup,
        participantes: [...prevGroup.participantes, newParticipantId],
      }));

      setIsAddParticipantModalOpen(false);
      toast.success("Participante añadido exitosamente");
    } catch (error) {
      console.error("Error al añadir participante:", error);
      toast.error("Error al añadir participante");
    }
  };

  const handleCreateTask = async (newTaskData) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("Token no encontrado en localStorage");
        return;
      }

      const response = await fetch(`http://localhost:5000/createGroupTasks`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newTaskData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Error al crear la tarea:", errorText);
        toast.error("Error al crear la tarea");
        return;
      }

      const data = await response.json();
      setActivities((prevActivities) => ({
        ...prevActivities,
        [data.task.status]: [...prevActivities[data.task.status], data.task],
      }));

      setIsTaskCreationModalOpen(false);
      toast.success("Tarea creada exitosamente");
    } catch (error) {
      console.error("Error al crear la tarea:", error);
      toast.error("Error al crear la tarea");
    }
  };

  const handleDragStart = (e, taskId, status) => {
    e.dataTransfer.setData("taskId", taskId);
    e.dataTransfer.setData("fromStatus", status);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = async (e, toStatus) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData("taskId");
    const fromStatus = e.dataTransfer.getData("fromStatus");

    if (fromStatus !== toStatus) {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.error("Token no encontrado en localStorage");
          return;
        }

        const response = await fetch(
          `http://localhost:5000/dropTasks/${taskId}`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ status: toStatus }),
          }
        );

        if (!response.ok) {
          const errorText = await response.text();
          console.error("Error al actualizar la tarea:", errorText);
          toast.error("No tienes permiso para mover esta tarea");
          return;
        }

        setActivities((prevActivities) => {
          const updatedActivities = { ...prevActivities };
          const taskIndex = updatedActivities[fromStatus].findIndex(
            (task) => task.id === taskId
          );
          if (taskIndex !== -1) {
            const [movedTask] = updatedActivities[fromStatus].splice(
              taskIndex,
              1
            );
            movedTask.status = toStatus;
            updatedActivities[toStatus].push(movedTask);
          }
          return updatedActivities;
        });

        toast.success("Tarea actualizada exitosamente");
      } catch (error) {
        console.error("Error al actualizar la tarea:", error);
        toast.error("Error al actualizar la tarea");
      }
    }
  };

  return (
    <MainLayout>
      <div className="flex flex-col h-full bg-gray-50 md:flex-row">
        {/* Lista de Grupos */}
        <div className="w-full md:w-1/4 bg-white border-r border-gray-200 overflow-y-auto">
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <HiOutlineUserGroup className="text-gray-500 mr-2" size={24} />
                <h2 className="text-xl font-semibold">Grupos</h2>
              </div>
              {userRole === "admin" && (
                <button
                  onClick={() => setIsCreateGroupModalOpen(true)}
                  className="text-blue-500 hover:text-blue-700"
                >
                  <FiPlusCircle
                    size={24}
                    className="text-black hover:text-black/50"
                  />
                </button>
              )}
            </div>
            <div className="relative mb-4">
              <input
                type="text"
                placeholder="Buscar grupos..."
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-200"
              />
              <FiSearch
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={18}
              />
            </div>
          </div>
          <ul>
            {groups.map((group) => (
              <li
                key={group.id}
                className={`px-4 py-3 cursor-pointer hover:bg-gray-100 ${
                  selectedGroup?.id === group.id ? "bg-gray-100" : ""
                }`}
                onClick={() => handleGroupSelect(group)}
              >
                <div className="flex justify-between items-center">
                  <span className="font-medium">{group.name}</span>
                  {group.unreadCount > 0 && (
                    <span className="bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                      {group.unreadCount}
                    </span>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Área de Actividades */}
        <div className="flex-1 p-6 overflow-x-auto">
          {selectedGroup ? (
            <>
              {userRole === "admin" && (
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold">{selectedGroup.name}</h2>
                  <div className="space-x-2">
                    <button
                      onClick={() => setIsAddParticipantModalOpen(true)}
                      className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none"
                    >
                      Añadir Participante
                    </button>
                    <button
                      onClick={() => setIsTaskCreationModalOpen(true)}
                      className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 focus:outline-none"
                    >
                      Crear Tarea
                    </button>
                  </div>
                </div>
              )}
              <div className="flex space-x-4">
                {Object.entries(activities).map(([status, tasks]) => (
                  <div
                    key={status}
                    className="flex-1 bg-gray-100 p-4 rounded-lg"
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, status)}
                  >
                    <h3 className="text-lg font-semibold mb-4 capitalize">
                      {status}
                    </h3>
                    <div className="space-y-4">
                      {tasks.map((task) => (
                        <div
                          key={task.id}
                          className="bg-white p-4 rounded shadow cursor-move"
                          draggable
                          onDragStart={(e) =>
                            handleDragStart(e, task.id, task.status)
                          }
                        >
                          <h4 className="font-medium">{task.name}</h4>
                          <p className="text-sm text-gray-600 mt-2">
                            Asignado a:{" "}
                            {usersList.find(
                              (user) => user.id === task.assignedTo
                            )?.email || "Desconocido"}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500">
              Selecciona un grupo para ver sus actividades
            </div>
          )}
        </div>
      </div>

      <CreateGroupModal
        isOpen={isCreateGroupModalOpen}
        onClose={() => setIsCreateGroupModalOpen(false)}
        onCreateGroup={handleCreateGroup}
        usersList={usersList}
      />

      <AddParticipantModal
        isOpen={isAddParticipantModalOpen}
        onClose={() => setIsAddParticipantModalOpen(false)}
        onAddParticipant={handleAddParticipant}
        usersList={usersList}
        currentParticipants={selectedGroup?.participantes || []}
      />

      <TaskCreationModal
        isOpen={isTaskCreationModalOpen}
        onClose={() => setIsTaskCreationModalOpen(false)}
        onCreateTask={handleCreateTask}
        groupParticipants={selectedGroup?.participantes || []}
        groupId={selectedGroup?.id}
      />

      <ToastContainer position="bottom-right" autoClose={3000} />
    </MainLayout>
  );
};

export default GroupsPage;
