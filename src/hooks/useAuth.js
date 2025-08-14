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
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) {
        // Não lança exceção, retorna objeto padronizado
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
      // Não lança exceção, retorna objeto padronizado
      return { success: false, error: "Erro ao fazer login" };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      // Limpar estado local depois do signOut
      const { error } = await supabase.auth.signOut();
      if (error) {
        // Não redireciona se erro no logout
        return { success: false, error: error.message };
      }
      setUser(null);
      setIsAuthenticated(false);
      router.push("/auth/login");
      return { success: true };
    } catch (error) {
      return { success: false, error: "Erro no logout" };
    } finally {
      setIsLoading(false);
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
