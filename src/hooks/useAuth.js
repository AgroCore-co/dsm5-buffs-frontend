"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/router"
import { supabase } from "@/lib/supabaseClient"
import { apiFetch } from "@/lib/apiClient"

export const useAuth = () => {
  const [user, setUser] = useState(null)
  const [userProfile, setUserProfile] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [needsProfile, setNeedsProfile] = useState(false)
  const [error, setError] = useState(null)
  const [authInitialized, setAuthInitialized] = useState(false)
  const didHandleRef = useRef(false)
  const router = useRouter()

  // Função para verificar se o usuário tem perfil criado na API
  const checkUserProfile = async (token) => {
    try {
      const profile = await apiFetch("/usuarios/me", { token })
      setUserProfile(profile)
      setNeedsProfile(false)
      return true
    } catch (error) {
      if (error.status === 404) {
        // Usuário não tem perfil ainda
        setNeedsProfile(true)
        setUserProfile(null)
        return false
      }
      throw error
    }
  }

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession()
        if (session) {
          setUser(session.user)
          setIsAuthenticated(true)

          // Verificar se o usuário tem perfil
          try {
            await checkUserProfile(session.access_token)
          } catch (error) {
            console.error("Erro ao verificar perfil do usuário:", error)
          }
        } else {
          setUser(null)
          setUserProfile(null)
          setIsAuthenticated(false)
          setNeedsProfile(false)
        }
      } catch (error) {
        console.error("Erro na verificação de autenticação:", error)
        setUser(null)
        setUserProfile(null)
        setIsAuthenticated(false)
        setNeedsProfile(false)
      } finally {
        setIsLoading(false)
        setAuthInitialized(true)
      }
    }

    checkAuth()

    // Escutar mudanças na autenticação
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      setIsLoading(true)
      switch (event) {
        case "SIGNED_IN":
          setUser(session.user)
          setIsAuthenticated(true)
          try {
            await checkUserProfile(session.access_token)
          } catch (error) {
            console.error("Erro ao verificar perfil do usuário:", error)
          }
          break
        case "SIGNED_OUT":
          setUser(null)
          setUserProfile(null)
          setIsAuthenticated(false)
          setNeedsProfile(false)
          break
        case "TOKEN_REFRESHED":
        case "USER_UPDATED":
          // Ignora eventos neutros
          break
        default:
          break
      }
      setIsLoading(false)
      setAuthInitialized(true)
    })

    return () => subscription.unsubscribe()
  }, [])

  // Login com email e senha
  const login = async (email, password) => {
    setIsLoading(true)
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      })

      if (error) {
        return { success: false, error: error.message }
      }

      if (data.session) {
        setUser(data.user)
        setIsAuthenticated(true)

        // Verificar se o usuário tem perfil
        try {
          const hasProfile = await checkUserProfile(data.session.access_token)
          return {
            success: true,
            user: data.user,
            needsProfile: !hasProfile,
            redirectTo: hasProfile ? "/dashboard" : "/complete-profile",
          }
        } catch (error) {
          console.error("Erro ao verificar perfil:", error)
          return {
            success: true,
            user: data.user,
            needsProfile: true,
            redirectTo: "/complete-profile",
          }
        }
      } else {
        return { success: false, error: "Falha na autenticação" }
      }
    } catch (error) {
      return { success: false, error: "Erro ao fazer login" }
    } finally {
      setIsLoading(false)
    }
  }

  // Login com Google
  const loginWithGoogle = async () => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      if (error) {
        return { success: false, error: error.message }
      }

      return { success: true }
    } catch (error) {
      return { success: false, error: "Erro ao fazer login com Google" }
    }
  }

  // Cadastro (apenas cria conta no Supabase)
  const signUp = async (email, password, userData = {}) => {
    try {
      setIsLoading(true)
      setError(null)

      console.log("Iniciando signUp no Supabase para:", email)
      console.log("Dados do usuário:", userData)

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL || window.location.origin,
          data: userData, // Dados adicionais do usuário
        },
      })

      console.log("Resposta do Supabase signUp:", { data, error })

      if (error) {
        console.error("Erro no signUp:", error)
        setError(error.message)
        return { success: false, error: error.message }
      }

      if (data.user) {
        console.log("Usuário criado com sucesso:", data.user)
        console.log("Email confirmado?", !!data.user.email_confirmed_at)

        if (data.user.email_confirmed_at) {
          setUser(data.user)
          setIsAuthenticated(true)
          setNeedsProfile(true) // Novo usuário sempre precisa completar perfil
        }

        const result = {
          success: true,
          user: data.user,
          session: data.session,
          needsConfirmation: !data.user.email_confirmed_at,
        }

        console.log("Resultado final do signUp:", result)
        return result
      }

      console.error("Nenhum usuário retornado pelo Supabase")
      return { success: false, error: "Falha ao criar usuário" }
    } catch (err) {
      console.error("Erro inesperado no signUp:", err)
      setError(err.message)
      return { success: false, error: err.message }
    } finally {
      setIsLoading(false)
    }
  }

  // Criar perfil do usuário na API
  const createProfile = async (profileData) => {
    try {
      const token = await getAccessToken()
      if (!token) {
        return { success: false, error: "Token não encontrado" }
      }

      const profile = await apiFetch("/usuarios", {
        method: "POST",
        data: profileData,
        token,
      })

      setUserProfile(profile)
      setNeedsProfile(false)

      return { success: true, profile }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  // Logout
  const logout = async () => {
    try {
      setIsLoading(true)
      const { error } = await supabase.auth.signOut()

      if (error) {
        return { success: false, error: error.message }
      }

      setUser(null)
      setUserProfile(null)
      setIsAuthenticated(false)
      setNeedsProfile(false)
      router.push("/auth/login")

      return { success: true }
    } catch (error) {
      return { success: false, error: "Erro no logout" }
    } finally {
      setIsLoading(false)
    }
  }

  // Reset de senha
  const resetPassword = async (email) => {
    try {
      setIsLoading(true)
      setError(null)

      console.log("Iniciando reset de senha para:", email)

      const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      })

      console.log("Resposta do reset password:", { data, error })

      if (error) {
        console.error("Erro no reset password:", error)
        setError(error.message)
        return { success: false, error: error.message }
      }

      console.log("Email de reset enviado com sucesso")
      return { success: true }
    } catch (err) {
      console.error("Erro inesperado no reset password:", err)
      setError(err.message)
      return { success: false, error: err.message }
    } finally {
      setIsLoading(false)
    }
  }

  // Atualizar senha
  const updatePassword = async (newPassword) => {
    try {
      setIsLoading(true)
      setError(null)

      console.log("Atualizando senha do usuário")

      const { data, error } = await supabase.auth.updateUser({
        password: newPassword,
      })

      console.log("Resposta do update password:", { data, error })

      if (error) {
        console.error("Erro ao atualizar senha:", error)
        setError(error.message)
        return { success: false, error: error.message }
      }

      console.log("Senha atualizada com sucesso")
      return { success: true, user: data.user }
    } catch (err) {
      console.error("Erro inesperado ao atualizar senha:", err)
      setError(err.message)
      return { success: false, error: err.message }
    } finally {
      setIsLoading(false)
    }
  }

  const checkAuthStatus = () => {
    return isAuthenticated
  }

  const getCurrentUser = () => {
    return user
  }

  const getUserProfile = () => {
    return userProfile
  }

  const getAccessToken = async () => {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession()
      return session?.access_token || null
    } catch (error) {
      console.error("Erro ao obter token:", error)
      return null
    }
  }

  return {
    user,
    userProfile,
    isLoading,
    isAuthenticated,
    needsProfile,
    error,
    authInitialized,
    login,
    loginWithGoogle,
    signUp,
    createProfile,
    logout,
    resetPassword,
    updatePassword,
    checkAuthStatus,
    getCurrentUser,
    getUserProfile,
    getAccessToken,
    checkUserProfile,
  }
}
