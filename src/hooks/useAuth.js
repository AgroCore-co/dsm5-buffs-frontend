import { useState, useEffect } from "react";
import { useRouter } from "next/router";

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Verificar se há dados de usuário no localStorage
    const checkAuth = () => {
      try {
        const token = localStorage.getItem("authToken");
        const userData = localStorage.getItem("userData");
        
        if (token && userData) {
          const parsedUser = JSON.parse(userData);
          setUser(parsedUser);
          setIsAuthenticated(true);
        } else {
          setUser(null);
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error("Erro ao verificar autenticação:", error);
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email, password) => {
    try {
      // Simular chamada de API
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // TODO: Implementar chamada real para API
      const mockResponse = {
        success: true,
        user: {
          id: 1,
          name: "Usuário Teste",
          email: email
        },
        token: "mock-jwt-token"
      };

      if (mockResponse.success) {
        localStorage.setItem("authToken", mockResponse.token);
        localStorage.setItem("userData", JSON.stringify(mockResponse.user));
        
        setUser(mockResponse.user);
        setIsAuthenticated(true);
        
        return { success: true };
      } else {
        return { success: false, error: "Credenciais inválidas" };
      }
    } catch (error) {
      console.error("Erro no login:", error);
      return { success: false, error: "Erro ao fazer login" };
    }
  };

  const logout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userData");
    
    setUser(null);
    setIsAuthenticated(false);
    
    router.push("/auth/login");
  };

  const checkAuthStatus = () => {
    const token = localStorage.getItem("authToken");
    return !!token;
  };

  return {
    user,
    isLoading,
    isAuthenticated,
    login,
    logout,
    checkAuthStatus
  };
};
