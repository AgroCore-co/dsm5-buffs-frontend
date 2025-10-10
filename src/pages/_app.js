import "@/styles/globals.css";
import { AuthProvider, useAuth } from "@/contexts/authContext";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { getMyProfile } from "@/services/userService";
import Layout from "@/layout/Layout";

function AuthGuard({ children }) {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const [profileChecked, setProfileChecked] = useState(false);

  useEffect(() => {
    if (!loading && !isAuthenticated && router.pathname !== "/auth/login" && router.pathname !== "/auth/register") {
      router.replace("/auth/login");
    }
  }, [isAuthenticated, loading, router]);

  // Validação global de perfil

  useEffect(() => {
    // Sempre libera profileChecked em rotas públicas, mesmo se não autenticado
    if (["/auth/login", "/auth/register", "/complete-profile"].includes(router.pathname)) {
      setProfileChecked(true);
      return;
    }
    if (loading || !isAuthenticated) return;
    let ignore = false;
    async function checkProfile() {
      try {
        const profile = await getMyProfile();
        if (ignore) return;
        // Redirecionamento por cargo
        if (["/", "/dashboard", "/home", "/proprietario", "/admin"].includes(router.pathname)) {
          if (profile.cargo === "PROPRIETARIO" && router.pathname !== "/proprietario") {
            router.replace("/proprietario");
            return;
          } else if (profile.cargo === "ADMIN" && router.pathname !== "/admin") {
            router.replace("/admin");
            return;
          } else if (profile.cargo !== "PROPRIETARIO" && profile.cargo !== "ADMIN" && router.pathname !== "/home") {
            router.replace("/home");
            return;
          }
        }
        setProfileChecked(true);
      } catch (e) {
        if (e.response && e.response.status === 404) {
          router.replace("/complete-profile");
        } else {
          setProfileChecked(true); // permite acesso se erro não for 404
        }
      }
    }
    checkProfile();
    return () => { ignore = true; };
  }, [isAuthenticated, loading, router]);

  if (loading || !profileChecked) return null; // ou um spinner
  return children;
}

export default function App({ Component, pageProps }) {
  const router = useRouter();
  // Rotas que não devem usar o layout global
  const noLayoutRoutes = ["/auth/login", "/auth/register", "/complete-profile"];
  const useLayout = !noLayoutRoutes.includes(router.pathname);
  return (
    <AuthProvider>
      <AuthGuard>
        {useLayout ? (
          <Layout>
            <Component {...pageProps} />
          </Layout>
        ) : (
          <Component {...pageProps} />
        )}
      </AuthGuard>
    </AuthProvider>
  );
}
