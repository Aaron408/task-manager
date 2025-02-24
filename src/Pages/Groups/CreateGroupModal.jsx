import React, { useState } from "react";
import { FiX } from "react-icons/fi";

const CreateGroupModal = ({ isOpen, onClose, onCreateGroup, usersList }) => {
  const [newGroupName, setNewGroupName] = useState("");
  const [participants, setParticipants] = useState([""]);

  const handleAddParticipant = () => {
    setParticipants([...participants, ""]);
  };

  const handleRemoveParticipant = (index) => {
    const newParticipants = participants.filter((_, i) => i !== index);
    setParticipants(newParticipants);
  };

  const handleParticipantChange = (index, value) => {
    const newParticipants = [...participants];
    newParticipants[index] = value;
    setParticipants(newParticipants);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onCreateGroup({
      name: newGroupName,
      participantes: participants.filter((p) => p !== ""),
    });
    setNewGroupName("");
    setParticipants([""]);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h3 className="text-xl font-semibold mb-4">Crear Nuevo Grupo</h3>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="groupName"
              className="block text-sm font-medium text-gray-700"
            >
              Nombre del Grupo
            </label>
            <input
              type="text"
              id="groupName"
              value={newGroupName}
              onChange={(e) => setNewGroupName(e.target.value)}
              className="w-full px-2 py-2 mt-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-200"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Participantes
            </label>
            {participants.map((participant, index) => (
              <div key={index} className="flex items-center mt-2">
                <select
                  value={participant}
                  onChange={(e) =>
                    handleParticipantChange(index, e.target.value)
                  }
                  className="block w-full p-2 rounded-md border-gray-300 shadow-sm"
                >
                  <option value="">Seleccionar usuario</option>
                  {usersList
                    .filter(
                      (user) =>
                        !participants.includes(user.id.toString()) ||
                        participants[index] === user.id.toString()
                    )
                    .map((user) => (
                      <option key={user.id} value={user.id}>
                        {user.email}
                      </option>
                    ))}
                </select>
                {index > 0 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveParticipant(index)}
                    className="ml-2 text-red-500 hover:text-red-700"
                  >
                    <FiX />
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={handleAddParticipant}
              className="mt-2 text-sm text-blue-500 hover:text-blue-700"
            >
              + Añadir participante
            </button>
          </div>
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm text-white font-bold bg-red-600 rounded-md hover:bg-red-700 focus:outline-none"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-black rounded-md hover:bg-gray-800 focus:outline-none"
            >
              Crear Grupo
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateGroupModal;
