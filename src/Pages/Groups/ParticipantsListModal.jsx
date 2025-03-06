import { useState, useEffect } from "react";
import { UsersApi } from "../../api";
import { toast } from "react-toastify";

const ParticipantsListModal = ({
  isOpen,
  onClose,
  groupParticipants,
  usersList,
  onUsersUpdated,
}) => {
  const [participants, setParticipants] = useState([]);
  const [pendingChanges, setPendingChanges] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  useEffect(() => {
    if (isOpen && groupParticipants.length > 0) {
      const filteredParticipants = usersList.filter((user) =>
        groupParticipants.includes(user.id.toString())
      );
      setParticipants(filteredParticipants);
      setPendingChanges({});
    }
  }, [isOpen, groupParticipants, usersList]);

  const handleRoleChange = (userId, newRole) => {
    setPendingChanges((prev) => ({
      ...prev,
      [userId]: newRole,
    }));
  };

  const hasPendingChanges = () => {
    return Object.keys(pendingChanges).length > 0;
  };

  const saveChanges = async () => {
    setIsLoading(true);
    try {
      const updatePromises = Object.entries(pendingChanges).map(
        ([userId, newRole]) =>
          UsersApi.patch(`/users/${userId}/role`, { role: newRole })
      );

      await Promise.all(updatePromises);

      const updatedParticipants = participants.map((participant) => {
        if (pendingChanges[participant.id]) {
          return {
            ...participant,
            role: pendingChanges[participant.id],
          };
        }
        return participant;
      });

      setParticipants(updatedParticipants);

      if (onUsersUpdated) {
        const updatedUsersList = usersList.map((user) => {
          if (pendingChanges[user.id]) {
            return {
              ...user,
              role: pendingChanges[user.id],
            };
          }
          return user;
        });
        onUsersUpdated(updatedUsersList);
      }

      setPendingChanges({});
      setShowConfirmation(false);

      toast.success("Roles actualizados exitosamente");
    } catch (error) {
      console.error("Error al actualizar los roles:", error);
      toast.error("Error al actualizar los roles de los usuarios");
    } finally {
      setIsLoading(false);
    }
  };

  const cancelChanges = () => {
    setPendingChanges({});
    setShowConfirmation(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
        <h3 className="text-xl font-semibold mb-4">Participantes del Grupo</h3>

        <div className="overflow-y-auto max-h-96">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Usuario
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Email
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Rol
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {participants.map((participant) => (
                <tr
                  key={participant.id}
                  className={
                    pendingChanges[participant.id] ? "bg-yellow-50" : ""
                  }
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {participant.fullName || participant.username}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">
                      {participant.email}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <select
                      value={pendingChanges[participant.id] || participant.role}
                      onChange={(e) =>
                        handleRoleChange(participant.id, e.target.value)
                      }
                      className={`block w-full p-2 text-sm border rounded-md focus:outline-none focus:ring-2 ${
                        pendingChanges[participant.id]
                          ? "border-yellow-300 bg-yellow-50 focus:ring-yellow-200"
                          : "border-gray-300 focus:ring-gray-200"
                      }`}
                      disabled={isLoading}
                    >
                      <option value="admin">Admin</option>
                      <option value="mortal">Mortal</option>
                    </select>
                    {pendingChanges[participant.id] && (
                      <span className="text-xs text-yellow-600 mt-1 block">
                        Cambio pendiente
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex justify-end mt-6 space-x-2">
          {hasPendingChanges() && !showConfirmation && (
            <button
              type="button"
              onClick={() => setShowConfirmation(true)}
              className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 focus:outline-none"
              disabled={isLoading}
            >
              Guardar Cambios
            </button>
          )}

          {!showConfirmation && (
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-white bg-gray-600 rounded-md hover:bg-gray-700 focus:outline-none"
              disabled={isLoading}
            >
              {hasPendingChanges() ? "Cancelar" : "Cerrar"}
            </button>
          )}
        </div>

        {/* Confirmation Dialog */}
        {showConfirmation && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md">
              <h3 className="text-lg font-semibold mb-4">Confirmar Cambios</h3>
              <p className="mb-4">
                ¿Estás seguro de que deseas guardar los cambios de roles para{" "}
                {Object.keys(pendingChanges).length} usuario(s)?
              </p>
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={cancelChanges}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none"
                  disabled={isLoading}
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={saveChanges}
                  className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 focus:outline-none"
                  disabled={isLoading}
                >
                  {isLoading ? "Guardando..." : "Confirmar"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ParticipantsListModal;
