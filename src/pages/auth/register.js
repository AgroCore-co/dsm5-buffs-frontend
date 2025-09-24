"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import styles from "@/styles/Register.module.css"
import Button from "@/components/Button"
import { useAuth } from "@/hooks/useAuth"

export default function Register() {
  const router = useRouter()
  const { signUp, loginWithGoogle, isAuthenticated, isLoading } = useAuth()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoadingForm, setIsLoadingForm] = useState(false)
  const [isLoadingGoogle, setIsLoadingGoogle] = useState(false)
  const [registerError, setRegisterError] = useState("")
  const [successMessage, setSuccessMessage] = useState("")
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  })

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.push("/dashboard")
    }
  }, [isAuthenticated, isLoading, router])

  useEffect(() => {
    document.body.setAttribute("data-page", "register")
    return () => {
      document.body.removeAttribute("data-page")
    }
  }, [])

  if (isLoading || isAuthenticated) return null

  const togglePasswordVisibility = () => setShowPassword((prev) => !prev)
  const toggleConfirmPasswordVisibility = () => setShowConfirmPassword((prev) => !prev)

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    setRegisterError("") // Limpa erro ao digitar
    setSuccessMessage("")
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const { name, email, password, confirmPassword } = formData

    if (!name || !email || !password || !confirmPassword) {
      setRegisterError("Por favor, preencha todos os campos.")
      return
    }

    if (password !== confirmPassword) {
      setRegisterError("As senhas não coincidem")
      return
    }

    if (password.length < 6) {
      setRegisterError("A senha deve ter pelo menos 6 caracteres")
      return
    }

    setIsLoadingForm(true)
    setRegisterError("")
    setSuccessMessage("")

    try {
      // Novo fluxo: usa signUp do useAuth, que chama /auth/signup
      const result = await signUp({
        email,
        password,
        nome: name,
        telefone: "",
      })

      if (result && result.success === true) {
        setSuccessMessage(
          "Cadastro realizado com sucesso! Verifique seu email para confirmar a conta e depois faça login.",
        )
        setTimeout(() => {
          router.push("/auth/login")
        }, 3000)
      } else {
        setRegisterError(result?.error || "Erro ao criar conta")
      }
    } catch (err) {
      setRegisterError("Erro inesperado ao criar conta")
    } finally {
      setIsLoadingForm(false)
    }
  }

  const handleGoogleLogin = async () => {
    setIsLoadingGoogle(true)
    setRegisterError("")
    setSuccessMessage("")

    const result = await loginWithGoogle()

    if (!result.success) {
      setRegisterError(result.error || "❌ Erro ao fazer cadastro com Google.")
      setIsLoadingGoogle(false)
    }
    // Se sucesso, o redirecionamento será tratado pela página de callback
  }

  return (
    <div className={`${styles.container} ${styles.registerPage}`}>
      <div className={styles.imageSection}>
        <Image src="/images/bg2.png" alt="Imagem de cadastro" className={styles.image} width={500} height={600} />
      </div>
      <div className={styles.formSection}>
        <h1 className={styles.title}>Criar Conta</h1>
        <p className={styles.description}>Preencha os dados abaixo para criar sua conta.</p>

        {successMessage && <p className={styles.success}>{successMessage}</p>}
        {/* Exibe erro no HTML */}
        {registerError && <p className={styles.error}>{registerError}</p>}

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.inputGroup}>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              className={styles.input}
              placeholder=" "
              autoComplete="name"
              disabled={isLoadingForm || isLoadingGoogle}
            />
            <label htmlFor="name" className={styles.label}>
              Nome Completo
            </label>
            <span className={styles.icon} aria-hidden="true">
              <Image src="/images/icon_user.svg" alt="" width={24} height={24} />
            </span>
          </div>

          <div className={styles.inputGroup}>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              className={styles.input}
              placeholder=" "
              autoComplete="email"
              disabled={isLoadingForm || isLoadingGoogle}
            />
            <label htmlFor="email" className={styles.label}>
              Email
            </label>
            <span className={styles.icon} aria-hidden="true">
              <Image src="/images/icon_email.svg" alt="" width={24} height={24} />
            </span>
          </div>

          <div className={styles.inputGroup}>
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              required
              className={styles.input}
              placeholder=" "
              autoComplete="new-password"
              disabled={isLoadingForm || isLoadingGoogle}
            />
            <label htmlFor="password" className={styles.label}>
              Senha
            </label>
            <button
              type="button"
              className={styles.icon}
              onClick={togglePasswordVisibility}
              aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
              aria-pressed={showPassword}
              disabled={isLoadingForm || isLoadingGoogle}
            >
              <Image
                src={showPassword ? "/images/not-view-password.svg" : "/images/not-view-password-bloqued.svg"}
                alt=""
                width={24}
                height={24}
              />
            </button>
          </div>

          <div className={styles.inputGroup}>
            <input
              type={showConfirmPassword ? "text" : "password"}
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              required
              className={styles.input}
              placeholder=" "
              autoComplete="new-password"
              disabled={isLoadingForm || isLoadingGoogle}
            />
            <label htmlFor="confirmPassword" className={styles.label}>
              Confirmar Senha
            </label>
            <button
              type="button"
              className={styles.icon}
              onClick={toggleConfirmPasswordVisibility}
              aria-label={showConfirmPassword ? "Ocultar senha" : "Mostrar senha"}
              aria-pressed={showConfirmPassword}
              disabled={isLoadingForm || isLoadingGoogle}
            >
              <Image
                src={showConfirmPassword ? "/images/not-view-password.svg" : "/images/not-view-password-bloqued.svg"}
                alt=""
                width={24}
                height={24}
              />
            </button>
          </div>

          <Button
            type="submit"
            variant="primary"
            size="full"
            loading={isLoadingForm}
            disabled={isLoadingForm || isLoadingGoogle}
          >
            {isLoadingForm ? "Criando conta..." : "Criar Conta"}
          </Button>
        </form>

        {/* Divisor */}
        <div className={styles.divider}>
          <span>ou</span>
        </div>

        {/* Botão do Google */}
        <Button
          type="button"
          variant="secondary"
          size="full"
          loading={isLoadingGoogle}
          disabled={isLoadingForm || isLoadingGoogle}
          onClick={handleGoogleLogin}
          className={styles.googleButton}
        >
          {isLoadingGoogle ? (
            "Conectando..."
          ) : (
            <>
              <Image src="/images/google-icon.svg" alt="Google" className={styles.googleIcon} width={24} height={24} />
              Cadastrar com Google
            </>
          )}
        </Button>

        {/* Link para login */}
        <p className={styles.signupLink}>
          Já tem uma conta?
          <Link href="/auth/login" className={styles.link}>
            Faça login
          </Link>
        </p>
      </div>
    </div>
  )
}
