// pages/auth/login.tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { signin } from "@/services/authService";
import styles from "@/styles/Login.module.css";
import Button from "@/components/Button";

interface Errors {
  email?: string;
  password?: string;
  general?: string;
}

export default function Login() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const [loading, setLoading] = useState(false);

  /** Validação simples */
  const validate = (): boolean => {
    const newErrors: Errors = {};
    if (!email) newErrors.email = "Email é obrigatório.";
    if (!password) newErrors.password = "Senha é obrigatória.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    setErrors({});

    try {
      const data = await signin({ email, password });

      if (data.access_token) {
        localStorage.setItem("token", data.access_token);
        if (data.refresh_token)
          localStorage.setItem("refresh_token", data.refresh_token);

        // Redireciona sem recarregar a página
        router.push("/");
        router.refresh(); // opcional – atualiza dados server-side
      } else {
        setErrors({ general: "Resposta inesperada do servidor." });
      }
    } catch (err: any) {
      if (err.response?.status === 401) {
        setErrors({
          general: "Credenciais inválidas ou email não confirmado.",
        });
      } else {
        setErrors({ general: "Erro ao tentar fazer login. Tente novamente." });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`${styles.container} ${styles.loginPage}`}>
      {/* ---------- FORM ---------- */}
      <div className={styles.formSection}>
        <div className={styles.formBox}>
          {/* LOGO */}
          <div className={styles.logoContainer}>
            <Image
              src="/images/Logo-buffs.svg"
              alt="Logo Buff's"
              width={150}
              height={70}
              priority
            />
          </div>

          <h1 className={styles.title}>Bem-Vindo!</h1>
          <p className={styles.description}>
            Faça login com os dados inseridos durante seu cadastro.
          </p>

          <form className={styles.form} onSubmit={handleSubmit} noValidate>
            {errors.general && (
              <div className={styles.error} style={{ marginBottom: 12 }}>
                {errors.general}
              </div>
            )}

            {/* EMAIL */}
            <div className={styles.inputGroup}>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={styles.input}
                placeholder=" "
                autoComplete="email"
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? "email-error" : undefined}
                disabled={loading}
              />
              <label htmlFor="email" className={styles.label}>
                Email
              </label>
              <span className={styles.icon} aria-hidden="true">
                <Image src="/images/icon_email.svg" alt="" width={20} height={20} />
              </span>
              {errors.email && (
                <span id="email-error" className={styles.error}>
                  {errors.email}
                </span>
              )}
            </div>

            {/* PASSWORD */}
            <div className={styles.inputGroup}>
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={styles.input}
                placeholder=" "
                autoComplete="current-password"
                aria-invalid={!!errors.password}
                aria-describedby={errors.password ? "password-error" : undefined}
                disabled={loading}
              />
              <label htmlFor="password" className={styles.label}>
                Senha
              </label>

              <button
                type="button"
                className={styles.icon}
                aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                aria-pressed={showPassword}
                onClick={() => setShowPassword((v) => !v)}
                disabled={loading}
                style={{
                  background: "none",
                  border: "none",
                  padding: 0,
                  cursor: "pointer",
                }}
              >
                <Image
                  src={
                    showPassword
                      ? "/images/not-view-password.svg"
                      : "/images/not-view-password-bloqued.svg"
                  }
                  alt=""
                  width={20}
                  height={20}
                />
              </button>

              {errors.password && (
                <span id="password-error" className={styles.error}>
                  {errors.password}
                </span>
              )}
            </div>

            <Button
              type="submit"
              variant="primary"
              size="full"
              className={styles.loginButton}
              disabled={loading}
              aria-busy={loading}
            >
              {loading ? "Entrando…" : "Log in"}
            </Button>
          </form>

          <div className={styles.divider}>
            <span>ou</span>
          </div>

          {/* GOOGLE */}
          <Button
            type="button"
            variant="secondary"
            className={styles.googleCircleButton}
            disabled={loading}
            aria-label="Entrar com Google"
            style={{
              borderRadius: "50%",
              width: 44,
              height: 44,
              minWidth: 44,
              minHeight: 44,
              padding: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Image
              src="/images/google-icon.svg"
              alt="Google"
              width={24}
              height={24}
            />
          </Button>

          <Link href="/auth/forgot-password" className={styles.forgotPassword}>
            Esqueci minha senha
          </Link>

          <p className={styles.signupLink}>
            Não tem uma conta?{" "}
            <Link href="/auth/register" className={styles.link}>
              Cadastre-se
            </Link>
          </p>
        </div>
      </div>

      {/* ---------- IMAGEM DE FUNDO (CSS) ---------- */}
      <div className={styles.imageSection} />
    </div>
  );
}