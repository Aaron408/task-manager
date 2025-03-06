import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { AuthContext } from "../../Components/AuthContext";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [backgroundSpots, setBackgroundSpots] = useState([]);
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  useEffect(() => {
    const spots = [...Array(20)].map(() => ({
      id: Math.random(),
      size: Math.random() * 100 + 50,
      top: Math.random() * 100,
      left: Math.random() * 100,
      rotation: Math.random() * 360,
      opacity: 0.05 + Math.random() * 0.05,
    }));
    setBackgroundSpots(spots);
  }, []);

  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isFormValid = isValidEmail(email) && password.trim() !== "";

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await login(email, password);
    } catch (error) {
      console.error("Error en el login:", error);
      toast.error(
        "Error en el inicio de sesión. Por favor, intente nuevamente."
      );
    }
  };

  return (
    <div className="relative min-h-screen bg-gray-50 overflow-hidden">
      {/* Fondo con manchas */}
      <div className="absolute inset-0 z-0">
        {backgroundSpots.map((spot) => (
          <div
            key={spot.id}
            className="absolute rounded-full bg-gray-900"
            style={{
              width: `${spot.size}px`,
              height: `${spot.size}px`,
              top: `${spot.top}%`,
              left: `${spot.left}%`,
              transform: `rotate(${spot.rotation}deg)`,
              opacity: spot.opacity,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Inicia sesión
          </h2>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Correo electrónico
                </label>
                <div className="mt-1">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-gray-500 focus:border-gray-500 sm:text-sm"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  {!isValidEmail(email) && email.length > 0 && (
                    <p className="text-red-500 text-xs mt-1">
                      Ingresa un correo electrónico válido
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700"
                >
                  Contraseña
                </label>
                <div className="mt-1">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-gray-500 focus:border-gray-500 sm:text-sm"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  {password.trim() === "" && (
                    <p className="text-red-500 text-xs mt-1">
                      La contraseña no puede estar vacía
                    </p>
                  )}
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white 
                    ${
                      isFormValid
                        ? "bg-gray-800 hover:bg-gray-700"
                        : "bg-gray-400 cursor-not-allowed"
                    }
                    focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500`}
                  disabled={!isFormValid}
                >
                  Iniciar Sesión
                </button>
              </div>
            </form>
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                ¿No tienes cuenta?{" "}
                <button
                  onClick={() => navigate("/register")}
                  className="text-gray-800 font-medium hover:underline"
                >
                  Regístrate aquí
                </button>
              </p>
              <button
                onClick={() => navigate("/")}
                className="mt-2 text-sm text-gray-600 hover:text-gray-800"
              >
                Volver al inicio
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
