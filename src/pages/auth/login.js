import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import styles from "@/styles/Login.module.css";
import Button from "@/components/Button";
import { useAuth } from "@/hooks/useAuth";

export default function Login() {
  const router = useRouter();
  const { login, loginWithGoogle, isAuthenticated, isLoading, needsProfile } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoadingForm, setIsLoadingForm] = useState(false);
  const [isLoadingGoogle, setIsLoadingGoogle] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      // Redireciona baseado no estado do perfil
      if (needsProfile) {
        router.push("/complete-profile");
      } else {
        router.push("/dashboard");
      }
    }
  }, [isAuthenticated, isLoading, needsProfile, router]);

  useEffect(() => {
    document.body.setAttribute("data-page", "login");
    return () => {
      document.body.removeAttribute("data-page");
    };
  }, []);

  if (isLoading || isAuthenticated) return null;

  const togglePasswordVisibility = () => setShowPassword((prev) => !prev);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setLoginError(""); // Limpa erro ao digitar
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      setLoginError("Por favor, preencha todos os campos.");
      return;
    }

    setIsLoadingForm(true);
    setLoginError("");

    const result = await login(formData.email, formData.password);
    
    if (result.success) {
      // O redirecionamento é tratado automaticamente pelo useEffect acima
      // baseado no resultado do login (needsProfile, redirectTo)
      if (result.redirectTo) {
        router.push(result.redirectTo);
      }
    } else {
      // Tratamento de erros específicos
      if (result.error?.includes("Invalid login credentials")) {
        setLoginError("❌ Email ou senha inválidos.");
      } else if (result.error?.includes("User not confirmed")) {
        setLoginError("⚠️ Usuário não confirmado. Verifique seu email.");
      } else if (result.error?.includes("Email not confirmed")) {
        setLoginError("⚠️ Por favor, confirme seu email antes de fazer login.");
      } else if (result.error?.includes("Too many requests")) {
        setLoginError("⚠️ Muitas tentativas. Aguarde alguns minutos.");
      } else {
        setLoginError(result.error || "❌ Ocorreu um erro inesperado. Tente novamente.");
      }
    }
    setIsLoadingForm(false);
  };

  const handleGoogleLogin = async () => {
    setIsLoadingGoogle(true);
    setLoginError("");

    const result = await loginWithGoogle();
    
    if (!result.success) {
      setLoginError(result.error || "❌ Erro ao fazer login com Google.");
      setIsLoadingGoogle(false);
    }
    // Se sucesso, o redirecionamento será tratado pela página de callback
  };

  return (
    <div className={`${styles.container} ${styles.loginPage}`}>
      <div className={styles.imageSection}>
        <img
          src="/images/bg2.png"
          alt="Imagem de login"
          className={styles.image}
        />
      </div>
      <div className={styles.formSection}>
        <h1 className={styles.title}>Bem-Vindo!</h1>
        <p className={styles.description}>
          Faça login com os dados inseridos durante seu cadastro.
        </p>

        {/* Exibe erro no HTML */}
        {loginError && <p className={styles.error}>{loginError}</p>}

        <form className={styles.form} onSubmit={handleSubmit}>
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
              <img src="/images/icon_email.svg" alt="" />
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
              autoComplete="current-password"
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
              <img
                src={
                  showPassword
                    ? "/images/not-view-password.svg"
                    : "/images/not-view-password-bloqued.svg"
                }
                alt=""
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
            {isLoadingForm ? "Entrando..." : "Log in"}
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
              <img 
                src="/images/google-icon.svg" 
                alt="Google" 
                className={styles.googleIcon}
              />
              
            </>
          )}
        </Button>

        <a href="/auth/forgot-password" className={styles.forgotPassword}>
          Esqueci minha senha
        </a>

        {/* Link para cadastro */}
        <p className={styles.signupLink}>
          Não tem uma conta? 
          <a href="/auth/register" className={styles.link}>
            Cadastre-se
          </a>
        </p>
      </div>
    </div>
  );
}