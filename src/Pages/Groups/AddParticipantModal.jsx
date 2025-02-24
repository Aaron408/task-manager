import { useState } from "react";

const AddParticipantModal = ({
  isOpen,
  onClose,
  onAddParticipant,
  usersList,
  currentParticipants,
}) => {
  const [selectedParticipant, setSelectedParticipant] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onAddParticipant(selectedParticipant);
    setSelectedParticipant("");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h3 className="text-xl font-semibold mb-4">Añadir Participante</h3>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Seleccionar Participante
            </label>
            <select
              value={selectedParticipant}
              onChange={(e) => setSelectedParticipant(e.target.value)}
              className="block w-full p-2 mt-2 rounded-md border-gray-300 shadow-sm"
              required
            >
              <option value="">Seleccionar usuario</option>
              {usersList
                .filter(
                  (user) => !currentParticipants.includes(user.id.toString())
                )
                .map((user) => (
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
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-black rounded-md hover:bg-gray-800 focus:outline-none"
            >
              Añadir Participante
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddParticipantModal;
