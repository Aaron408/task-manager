import { useContext } from "react";

import { createContext, useState, useCallback } from "react";
import { Navigate, Outlet, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { AuthApi } from "../api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();

  const [user, setUser] = useState(() => {
    const savedToken = localStorage.getItem("token");
    return savedToken ? { token: savedToken } : null;
  });

  const login = useCallback(
    async (email, password) => {
      try {
        const response = await AuthApi.post("/login", {
          email,
          password,
        });

        const { token } = response.data;
        setUser({ token });
        localStorage.setItem("token", token);
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
      localStorage.removeItem("token");
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
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const PrivateRoute = ({ allowedRoles, redirectTo = "/login" }) => {
  const { user } = useContext(AuthContext);

  if (!user) {
    return <Navigate to={redirectTo} />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to={redirectTo} />;
  }

  return <Outlet />;
};
