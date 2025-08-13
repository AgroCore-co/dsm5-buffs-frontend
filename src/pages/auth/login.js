import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import styles from "@/styles/Login.module.css";
import Button from "@/components/Button";
import { useAuth } from "@/hooks/useAuth";

export default function Login() {
  const router = useRouter();
  const { login, isAuthenticated, isLoading } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoadingForm, setIsLoadingForm] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  // Redireciona usuários já autenticados para o dashboard
  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.push("/dashboard");
    }
  }, [isAuthenticated, isLoading, router]);

  // Força fundo branco na página de login
  useEffect(() => {
    document.body.setAttribute('data-page', 'login');
    
    return () => {
      document.body.removeAttribute('data-page');
    };
  }, []);

  // Se estiver carregando ou já autenticado, não mostra o formulário
  if (isLoading || isAuthenticated) {
    return null;
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validação básica
    if (!formData.email || !formData.password) {
      alert("Por favor, preencha todos os campos.");
      return;
    }

    setIsLoadingForm(true);

    try {
      const result = await login(formData.email, formData.password);
      
      if (result.success) {
        // Redirecionar para o dashboard
        router.push("/dashboard");
      } else {
        alert(result.error || "Erro ao fazer login. Tente novamente.");
      }
    } catch (error) {
      console.error("Erro no login:", error);
      alert("Erro ao fazer login. Tente novamente.");
    } finally {
      setIsLoadingForm(false);
    }
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
              aria-describedby="email-error"
              disabled={isLoadingForm}
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
              aria-describedby="password-error"
              disabled={isLoadingForm}
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
              disabled={isLoadingForm}
            >
              <img
                src={showPassword ? "/images/not-view-password.svg" : "/images/not-view-password-bloqued.svg"}
                alt=""
              />
            </button>
          </div>

          <Button 
            type="submit" 
            variant="primary" 
            size="full"
            loading={isLoadingForm}
            disabled={isLoadingForm}
          >
            {isLoadingForm ? "Entrando..." : "Log in"}
          </Button>
        </form>
        <a href="/forgot-password" className={styles.forgotPassword}>
          Esqueci minha senha
        </a>
      </div>
    </div>
  );
}
