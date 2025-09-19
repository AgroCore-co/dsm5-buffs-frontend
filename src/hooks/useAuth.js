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
  const router = useRouter()
  const firstCheckRef = useRef(true) // marca se é o primeiro checkAuth
  const didHandleEventRef = useRef(false) // impede loop de eventos

  const checkUserProfile = async (token) => {
    try {
      const profile = await apiFetch("/usuarios/me", { token })
      setUserProfile(profile)
      setNeedsProfile(false)
      return true
    } catch (error) {
      if (error.status === 404) {
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
          try {
            await checkUserProfile(session.access_token)
          } catch (err) {
            console.error("Erro ao verificar perfil do usuário:", err)
          }
        } else {
          setUser(null)
          setUserProfile(null)
          setIsAuthenticated(false)
          setNeedsProfile(false)
        }
      } catch (err) {
        console.error("Erro na verificação de autenticação:", err)
        setUser(null)
        setUserProfile(null)
        setIsAuthenticated(false)
        setNeedsProfile(false)
      } finally {
        setIsLoading(false)
        setAuthInitialized(true)
        firstCheckRef.current = false
      }
    }

    checkAuth()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!authInitialized || didHandleEventRef.current) return
      didHandleEventRef.current = true

      switch (event) {
        case "SIGNED_IN":
          setUser(session.user)
          setIsAuthenticated(true)
          try {
            await checkUserProfile(session.access_token)
          } catch (err) {
            console.error("Erro ao verificar perfil do usuário:", err)
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
          // eventos neutros, não mexe em isLoading/isAuthenticated
          break
        default:
          break
      }
    })

    return () => subscription.unsubscribe()
  }, [authInitialized])

  const login = async (email, password) => {
    setIsLoading(true)
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      })

      if (error) return { success: false, error: error.message }

      if (data.session) {
        setUser(data.user)
        setIsAuthenticated(true)
        const hasProfile = await checkUserProfile(data.session.access_token)
        return {
          success: true,
          user: data.user,
          needsProfile: !hasProfile,
          redirectTo: hasProfile ? "/dashboard" : "/complete-profile",
        }
      } else {
        return { success: false, error: "Falha na autenticação" }
      }
    } catch (err) {
      return { success: false, error: "Erro ao fazer login" }
    } finally {
      setIsLoading(false)
    }
  }

  // logout simplificado
  const logout = async () => {
    setIsLoading(true)
    try {
      const { error } = await supabase.auth.signOut()
      if (error) return { success: false, error: error.message }
      setUser(null)
      setUserProfile(null)
      setIsAuthenticated(false)
      setNeedsProfile(false)
      router.push("/auth/login")
      return { success: true }
    } finally {
      setIsLoading(false)
    }
  }

  const getAccessToken = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      return session?.access_token || null
    } catch (err) {
      console.error("Erro ao obter token:", err)
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
    logout,
    getAccessToken,
    checkUserProfile,
  }
}
