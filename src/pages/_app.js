import "@/styles/globals.css";
import { AuthProvider, useAuth } from "@/contexts/authContext";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { getMyProfile } from "@/services/userService";
import Layout from "@/layout/Layout";
import { PropriedadeProvider } from "@/contexts/propriedadeContext";
import PropertySelectorFloating from "@/components/PropertySelectorFloating";

function AuthGuard({ children }) {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const [profileChecked, setProfileChecked] = useState(false);
  const [profileData, setProfileData] = useState(null);

  useEffect(() => {
    if (!loading && !isAuthenticated && router.pathname !== "/auth/login" && router.pathname !== "/auth/register") {
      router.replace("/auth/login");
    }
  }, [isAuthenticated, loading, router]);

  useEffect(() => {
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
        setProfileData(profile);
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
          setProfileChecked(true);
        }
      }
    }
    checkProfile();
    return () => { ignore = true; };
  }, [isAuthenticated, loading, router]);

  if (loading || !profileChecked) return null;

  // espera router estar pronto para evitar cálculo com caminho incorreto
  if (!router.isReady) return null;

  // usa asPath (rota real) e normaliza (remove query e trailing slash)
  const rawPath = router?.asPath || router?.pathname || "/";
  const path = rawPath.split("?")[0].replace(/\/+$/, "") || "/";

  const propriedadeRoutePrefixes = ["/propriedade", "/propriedades"];
  const isPropriedadeRoute = propriedadeRoutePrefixes.some((p) => path === p || path.startsWith(p + "/"));
  const isAdmin = profileData && profileData.cargo === "ADMIN";
  const wrapWithPropriedade = !isPropriedadeRoute && !isAdmin;

  if (wrapWithPropriedade) {
    return (
      <PropriedadeProvider>
        {children}
        {profileData && profileData.cargo === "PROPRIETARIO" && <PropertySelectorFloating />}
      </PropriedadeProvider>
    );
  }

  return children;
}

export default function App({ Component, pageProps }) {
  const router = useRouter();
  const noLayoutRoutes = ["/auth/login", "/auth/register", "/complete-profile"];
  const useLayout = !noLayoutRoutes.includes(router.pathname);

  const appChildren = (
    <>
      {useLayout ? (
        <Layout>
          <Component {...pageProps} />
        </Layout>
      ) : (
        <Component {...pageProps} />
      )}
    </>
  );

  return (
    <AuthProvider>
      <PropriedadeProvider>
        <AuthGuard>
          {appChildren}
        </AuthGuard>
      </PropriedadeProvider>
    </AuthProvider>
  );
}
