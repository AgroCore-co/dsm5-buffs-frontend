import React, { useEffect } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import Button from "@/components/Button";
import { useAuth } from "@/hooks/useAuth";

export default function Dashboard() {
  const router = useRouter();
  const { user, isLoading, isAuthenticated, logout } = useAuth();

  useEffect(() => {
    // Redirecionar para login se não estiver autenticado (mas só após carregar)
    if (!isLoading && !isAuthenticated) {
      router.push("/auth/login");
    }
  }, [isLoading, isAuthenticated, router]);

  // Não mostrar nada se estiver carregando ou não autenticado
  if (isLoading || !isAuthenticated) {
    return null;
  }

  return (
    <>
      <Head>
        <title>Dashboard | Buffs</title>
        <meta name="description" content="Dashboard da plataforma Buffs" />
      </Head>
      
      <div style={{ padding: "20px" }}>
        <h1>Dashboard - Teste</h1>
        <Button 
          variant="outline" 
          onClick={() => router.push("/auth/login")}
        >
          Voltar ao Login
        </Button>
      </div>
    </>
  );
}
