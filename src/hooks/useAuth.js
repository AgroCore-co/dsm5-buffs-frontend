import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { supabase } from "@/lib/supabaseClient";

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Verificar se há uma sessão ativa do Supabase
    const checkAuth = async () => {
      try {
        // Obter a sessão atual
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session) {
          setUser(session.user);
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

    // Escutar mudanças na autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session) {
          setUser(session.user);
          setIsAuthenticated(true);
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
          setIsAuthenticated(false);
        }
        setIsLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email, password) => {
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });

      if (error) {
        console.error("Erro no login:", error);
        return { success: false, error: error.message };
      }

      if (data.session) {
        setUser(data.user);
        setIsAuthenticated(true);
        return { success: true, user: data.user };
      } else {
        return { success: false, error: "Falha na autenticação" };
      }
    } catch (error) {
      console.error("Erro no login:", error);
      return { success: false, error: "Erro ao fazer login" };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      console.log("Iniciando logout...");
      
      // Limpar estado local primeiro para evitar conflitos
      setUser(null);
      setIsAuthenticated(false);
      
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error("Erro no logout:", error);
        return;
      }

      console.log("Logout do Supabase concluído, redirecionando...");
      
      // Redirecionar para login
      router.push("/auth/login");
    } catch (error) {
      console.error("Erro no logout:", error);
    }
  };

  const checkAuthStatus = () => {
    return isAuthenticated;
  };

  const getCurrentUser = () => {
    return user;
  };

  const getAccessToken = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      return session?.access_token || null;
    } catch (error) {
      console.error("Erro ao obter token:", error);
      return null;
    }
  };

  return {
    user,
    isLoading,
    isAuthenticated,
    login,
    logout,
    checkAuthStatus,
    getCurrentUser,
    getAccessToken
  };
};
