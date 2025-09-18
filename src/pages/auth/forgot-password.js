"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import Image from "next/image";
import styles from "@/styles/ForgotPassword.module.css";
import Button from "@/components/Button";
import { useAuth } from "@/hooks/useAuth";

export default function ForgotPassword() {
  const router = useRouter();
  const { resetPassword, isAuthenticated, isLoading } = useAuth();
  const [isLoadingForm, setIsLoadingForm] = useState(false);
  const [resetError, setResetError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.push("/dashboard");
    }
  }, [isAuthenticated, isLoading, router]);

  useEffect(() => {
    document.body.setAttribute("data-page", "forgot-password");
    return () => {
      document.body.removeAttribute("data-page");
    };
  }, []);

  if (isAuthenticated) return null;

  const handleInputChange = (e) => {
    setEmail(e.target.value);
    setResetError(""); // Limpa erro ao digitar
    setSuccessMessage(""); // Limpa mensagem de sucesso ao digitar
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      setResetError("Por favor, digite seu email.");
      return;
    }

    // Validação básica de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setResetError("Por favor, digite um email válido.");
      return;
    }

    setIsLoadingForm(true);
    setResetError("");
    setSuccessMessage("");

    const result = await resetPassword(email);

    if (result.success) {
      setSuccessMessage(
        "✅ Email de recuperação enviado! Verifique sua caixa de entrada e spam."
      );
      // Redirecionar para login após 5 segundos
      setTimeout(() => {
        router.push("/auth/login");
      }, 5000);
    } else {
      // Tratamento de erros específicos
      if (result.error?.includes("User not found")) {
        setResetError("❌ Email não encontrado em nossa base de dados.");
      } else if (result.error?.includes("Too many requests")) {
        setResetError("⚠️ Muitas tentativas. Aguarde alguns minutos.");
      } else {
        setResetError(
          result.error || "❌ Ocorreu um erro inesperado. Tente novamente."
        );
      }
    }
    setIsLoadingForm(false);
  };

  return (
    <div className={`${styles.container} ${styles.forgotPasswordPage}`}>
      <div className={styles.imageSection}>
        <Image
          src="/images/bg2.png"
          alt="Background"
          width={1920}
          height={1080}
        />
      </div>
      <div className={styles.formSection}>
        <h1 className={styles.title}>Esqueceu sua senha?</h1>
        <p className={styles.description}>
          Digite seu email e enviaremos um link para redefinir sua senha.
        </p>

        {/* Exibe erro no HTML */}
        {resetError && <p className={styles.error}>{resetError}</p>}

        {/* Exibe mensagem de sucesso */}
        {successMessage && <p className={styles.success}>{successMessage}</p>}

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.inputGroup}>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={handleInputChange}
              required
              className={styles.input}
              placeholder=" "
              autoComplete="email"
              disabled={isLoadingForm}
            />
            <label htmlFor="email" className={styles.label}>
              Email
            </label>
            <span className={styles.icon} aria-hidden="true">
              <Image
                src="/images/icon_email.svg"
                alt="Email"
                width={24}
                height={24}
              />
            </span>
          </div>

          <Button
            type="submit"
            variant="primary"
            size="full"
            loading={isLoadingForm}
            disabled={isLoadingForm || !!successMessage}
          >
            {isLoadingForm ? "Enviando..." : "Enviar link de recuperação"}
          </Button>
        </form>

        {/* Link para voltar ao login */}
        <div className={styles.backToLogin}>
          <Link href="/auth/login" className={styles.link}>
            ← Voltar para o login
          </Link>
        </div>
      </div>
    </div>
  );
}
