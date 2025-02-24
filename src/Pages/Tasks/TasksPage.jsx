"use client";

import { useState, useEffect } from "react";
import MainLayout from "../../Layouts/MainLayouts";

const TasksPage = () => {
  const [tasks, setTasks] = useState({
    completed: [],
    inProgress: [],
    paused: [],
  });

  useEffect(() => {
    // Fetch tasks from API
    const fetchTasks = async () => {
      try {
        const response = await fetch("http://localhost:5000/tasks", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        const data = await response.json();
        if (response.ok) {
          // Organize tasks into columns
          const organizedTasks = {
            completed: data.tasks.filter((task) => task.status === "Done"),
            inProgress: data.tasks.filter(
              (task) => task.status === "In Progress"
            ),
            paused: data.tasks.filter((task) => task.status === "Paused"),
          };
          setTasks(organizedTasks);
        }
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };

    fetchTasks();
  }, []);

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
      const updatedTasks = { ...tasks };
      const taskToMove = updatedTasks[sourceColumn].find(
        (task) => task.id.toString() === taskId
      );

      if (taskToMove) {
        updatedTasks[sourceColumn] = updatedTasks[sourceColumn].filter(
          (task) => task.id.toString() !== taskId
        );
        updatedTasks[targetColumn].push({
          ...taskToMove,
          status: getStatusFromColumn(targetColumn),
        });

        setTasks(updatedTasks);

        // Update task status in the backend
        try {
          await fetch(`http://localhost:5000/tasks/${taskId}`, {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            body: JSON.stringify({ status: getStatusFromColumn(targetColumn) }),
          });
        } catch (error) {
          console.error("Error updating task status:", error);
        }
      }
    }
  };

  const getStatusFromColumn = (column) => {
    switch (column) {
      case "completed":
        return "Done";
      case "inProgress":
        return "In Progress";
      case "paused":
        return "Paused";
      default:
        return "";
    }
  };

  return (
    <MainLayout>
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-6">Task Management</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Object.entries(tasks).map(([columnId, columnTasks]) => (
            <div
              key={columnId}
              className="bg-gray-100 p-4 rounded-lg"
              onDragOver={onDragOver}
              onDrop={(e) => onDrop(e, columnId)}
            >
              <h2 className="text-xl font-semibold mb-4 capitalize">
                {columnId}
              </h2>
              <div className="space-y-4">
                {columnTasks.map((task) => (
                  <div
                    key={task.id}
                    draggable
                    onDragStart={(e) => onDragStart(e, task.id, columnId)}
                    className="bg-white p-4 rounded shadow cursor-move"
                  >
                    <h3 className="font-medium">{task.name}</h3>
                    <p className="text-sm text-gray-600 mt-2">
                      {task.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </MainLayout>
  );
};

export default TasksPage;
