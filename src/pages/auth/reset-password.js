"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import Link from "next/link"; // 👈 IMPORTANTE
import { useAuth } from "@/hooks/useAuth";
import Button from "@/components/Button";
import styles from "@/styles/Login.module.css";

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { updatePassword, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!window.location.hash) {
      router.push("/auth/login");
    }
  }, [router]);

  useEffect(() => {
    document.body.setAttribute("data-page", "reset-password");
    return () => {
      document.body.removeAttribute("data-page");
    };
  }, []);

  if (isLoading) return null;

  const validateForm = () => {
    if (!password) {
      setError("Por favor, digite sua nova senha");
      return false;
    }
    if (password.length < 6) {
      setError("A senha deve ter pelo menos 6 caracteres");
      return false;
    }
    if (password !== confirmPassword) {
      setError("As senhas não coincidem");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const result = await updatePassword(password);

      if (result.success) {
        setSuccessMessage(
          "✅ Senha atualizada com sucesso! Redirecionando para o login..."
        );
        setTimeout(() => {
          router.push("/auth/login");
        }, 3000);
      } else {
        setError(result.error || "❌ Erro ao atualizar senha");
      }
    } catch (err) {
      setError("❌ Erro inesperado. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (setter) => (e) => {
    setter(e.target.value);
    if (error) setError("");
    if (successMessage) setSuccessMessage("");
  };

  const togglePasswordVisibility = () => setShowPassword((prev) => !prev);
  const toggleConfirmPasswordVisibility = () =>
    setShowConfirmPassword((prev) => !prev);

  return (
    <div className={`${styles.container} ${styles.loginPage}`}>
      <div className={styles.imageSection}>
        <Image
          src="/images/bg2.png"
          alt="Background"
          fill
          style={{ objectFit: "cover" }}
        />
      </div>

      <div className={styles.formSection}>
        <h1 className={styles.title}>Redefinir Senha</h1>
        <p className={styles.description}>
          Digite sua nova senha abaixo para redefinir o acesso à sua conta.
        </p>

        {error && <p className={styles.error}>{error}</p>}
        {successMessage && <p className={styles.success}>{successMessage}</p>}

        <form className={styles.form} onSubmit={handleSubmit}>
          {/* campos de senha iguais ao seu código */}
          <Button
            type="submit"
            variant="primary"
            size="full"
            loading={isSubmitting}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Atualizando..." : "Atualizar Senha"}
          </Button>
        </form>

        <p className={styles.signupLink}>
          Lembrou da sua senha?{" "}
          <Link href="/auth/login" className={styles.link}>
            Fazer login
          </Link>
        </p>
      </div>
    </div>
  );
}
