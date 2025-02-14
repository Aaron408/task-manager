import { useNavigate } from "react-router-dom";

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen bg-white overflow-hidden">
      {/* Fondo con manchas */}
      <div className="absolute inset-0 z-0">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-gray-900"
            style={{
              width: `${Math.random() * 100 + 50}px`,
              height: `${Math.random() * 100 + 50}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              transform: `rotate(${Math.random() * 360}deg)`,
              opacity: 0.1 + Math.random() * 0.1,
            }}
          />
        ))}
      </div>

      {/* Contenido */}
      <div className="relative z-10 min-h-screen flex flex-col justify-center items-center text-gray-800">
        <h1 className="text-5xl font-bold mb-4">Bienvenido al Task Manager</h1>
        <p className="text-xl mb-8">
          Organiza tus tareas de forma sencilla y eficiente
        </p>
        <div className="space-x-4">
          <button
            onClick={() => navigate("/login")}
            className="bg-black text-white px-6 py-2 rounded-full font-semibold hover:bg-gray-800 transition duration-300 cursor-pointer"
          >
            Iniciar Sesión
          </button>
          <button
            onClick={() => navigate("/signup")}
            className="border-2 border-gray-800 text-gray-800 px-6 py-2 rounded-full font-semibold hover:bg-gray-800 hover:text-white transition duration-300 cursor-pointer"
          >
            Registrate
          </button>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
