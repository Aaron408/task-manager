import { createContext, useState, useCallback, useContext } from "react";
import { Navigate, Outlet, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { AuthApi } from "../api";

export const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();

  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const login = useCallback(
    async (email, password) => {
      try {
        const response = await AuthApi.post("/login", {
          email,
          password,
        });

        const { token, role, user: userData } = response.data;

        const userInfo = {
          ...userData,
          token,
          role,
        };

        setUser(userInfo);
        localStorage.setItem("user", JSON.stringify(userInfo));
        toast.success("¡Inicio de sesión exitoso!");
        navigate("/dashboard");
      } catch (error) {
        console.error("Error during login:", error);
        if (error.response && error.response.status === 401) {
          toast.error(
            "Credenciales incorrectas. Por favor, intente nuevamente."
          );
        } else {
          toast.error(
            "Error al iniciar sesión. Por favor, intente nuevamente."
          );
        }
        throw error;
      }
    },
    [navigate]
  );

  const logout = useCallback(async () => {
    try {
      setUser(null);
      localStorage.removeItem("user");
      navigate("/login");
      toast.success("Has cerrado sesión correctamente.");
    } catch (error) {
      console.error("Error during logout:", error);
      toast.error("Error al intentar cerrar sesión. Inténtelo nuevamente.");
    }
  }, [navigate]);

  const value = {
    user,
    login,
    logout,
    isAuthenticated: !!user,
    role: user?.role,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const PrivateRoute = ({ allowedRoles, redirectTo = "/login" }) => {
  const { user } = useContext(AuthContext);

  if (!user) {
    return <Navigate to={redirectTo} />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to={"/dashboard" || redirectTo} />;
  }

  return <Outlet />;
};
