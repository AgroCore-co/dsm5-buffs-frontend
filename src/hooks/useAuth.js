"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/router";
import { supabase } from "@/lib/supabaseClient";
import { apiFetch } from "@/lib/apiClient";

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState(null);
  const [authInitialized, setAuthInitialized] = useState(false);

  const router = useRouter();
  const firstCheckRef = useRef(true);
  const didHandleEventRef = useRef(false);

  // --- CHECAR PERFIL ---
  const checkUserProfile = useCallback(async (token) => {
    try {
      const profile = await apiFetch("/usuarios/me", { token });
      // Se perfil existe, salva e não redireciona
      setUserProfile(profile);
      return profile;
    } catch (err) {
      // Só redireciona se for 404 (perfil não existe)
      if (err.status === 404 || (err.message && err.message.includes("Perfil de usuário não encontrado"))) {
        setUserProfile(null);
        // Redireciona para completar perfil se não existir
        if (router.pathname !== "/complete-profile") {
          router.push("/complete-profile");
        }
        return null;
      }
      // Outros erros não redirecionam, apenas lançam
      throw err;
    }
  }, [router]);

  // --- GET TOKEN ---
  const getAccessToken = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      return session?.access_token || null;
    } catch (err) {
      console.error("Erro ao obter token:", err);
      return null;
    }
  };

  // --- LOGIN ---
  const login = async (email, password) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) return { success: false, error: error.message };

      if (data.session) {
        setUser(data.user);
        setIsAuthenticated(true);
        await checkUserProfile(data.session.access_token); // apenas verifica
        return { success: true, user: data.user };
      } else {
        return { success: false, error: "Falha na autenticação" };
      }
    } catch (err) {
      return { success: false, error: "Erro ao fazer login" };
    } finally {
      setIsLoading(false);
    }
  };

  // --- LOGIN GOOGLE ---
  const loginWithGoogle = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: { redirectTo: `${window.location.origin}/auth/callback` },
      });
      if (error) return { success: false, error: error.message };
      return { success: true, data };
    } catch (err) {
      return { success: false, error: "Erro ao iniciar login com Google" };
    } finally {
      setIsLoading(false);
    }
  };

  // --- LOGOUT ---
  const logout = async () => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signOut();
      if (error) return { success: false, error: error.message };
      setUser(null);
      setUserProfile(null);
      setIsAuthenticated(false);
      router.push("/auth/login");
      return { success: true };
    } finally {
      setIsLoading(false);
    }
  };

  // --- SIGNUP ---
  const signUp = async ({ email, password, nome, telefone }) => {
    try {
      const response = await apiFetch("/auth/signup", {
        method: "POST",
        body: { email, password, nome, telefone }, // Corrigido: envia objeto, não string
        headers: { "Content-Type": "application/json" },
        skipAuth: true, // Não exige autenticação
      });
      return { success: true, data: response };
    } catch (err) {
      return { success: false, error: err.message || "Erro ao criar conta" };
    }
  };

  // --- EFFECT DE AUTENTICAÇÃO ---
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          setUser(session.user);
          setIsAuthenticated(true);
          try {
            await checkUserProfile(session.access_token);
          } catch (err) {
            console.error("Erro ao verificar perfil:", err);
          }
        } else {
          setUser(null);
          setUserProfile(null);
          setIsAuthenticated(false);
        }
      } catch (err) {
        console.error("Erro na verificação de autenticação:", err);
        setUser(null);
        setUserProfile(null);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
        setAuthInitialized(true);
        firstCheckRef.current = false;
      }
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!authInitialized || didHandleEventRef.current) return;
      didHandleEventRef.current = true;

      switch (event) {
        case "SIGNED_IN":
          setUser(session.user);
          setIsAuthenticated(true);
          try { await checkUserProfile(session.access_token); } 
          catch (err) { console.error(err); }
          break;
        case "SIGNED_OUT":
          setUser(null);
          setUserProfile(null);
          setIsAuthenticated(false);
          break;
      }
    });

    return () => subscription.unsubscribe();
  }, [authInitialized, checkUserProfile]);


  // --- CREATE PROFILE ---
  const createProfile = async ({ nome, telefone }) => {
    try {
      const token = await getAccessToken();
      const response = await apiFetch("/usuarios", {
        method: "POST",
        body: { nome, telefone },
        token,
      });
      return { success: true, data: response };
    } catch (err) {
      return { success: false, error: err.message || "Erro ao criar perfil" };
    }
  };

  return {
    user,
    userProfile,
    isLoading,
    isAuthenticated,
    error,
    authInitialized,
    login,
    loginWithGoogle,
    logout,
    getAccessToken,
    checkUserProfile,
    signUp,
    createProfile,
  };
};
