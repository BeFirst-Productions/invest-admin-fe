import { createContext, useContext, useState, useEffect } from "react";
import axiosInstance from "@/api/axiosInstance";
import { useNavigate } from "react-router-dom";
import { signIn } from "@/api/apis";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate()
  // ✅ AUTO LOGIN ON PAGE REFRESH
  useEffect(() => {
    const refresh = async () => {
      try {
        const res = await axiosInstance.post("/auth/refresh");
        setAccessToken(res.data.accessToken);
        setUser(res.data.user);
      } catch (err) {
        setUser(null);
        setAccessToken(null);
      } finally {
        setLoading(false);
      }
    };

    refresh();
  }, []);

  // ✅ LOGIN
  const logIn = async (userData) => {
  try {
      const res = await signIn(userData);
    setAccessToken(res.accessToken);
    setUser(res.user);
    navigate("/packages")

  } catch (error) {
    return error.message
    
  }
  };

  // ✅ LOGOUT
  const logout = async () => {
    await axiosInstance.post("/auth/logout");
    setUser(null);
    setAccessToken(null);
    navigate("/login")

  };

  return (
    <AuthContext.Provider
      value={{ user, accessToken, logIn, logout, loading }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
