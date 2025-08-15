import "@/styles/globals.css";
import Layout from "@/components/Layout";
import { useRouter } from "next/router";
import { useRouteProtection } from "@/hooks/useRouteProtection";
import ErrorBoundary from "@/components/ErrorBoundary";
import { PropertyProvider } from "@/contexts/PropertyContext"; // import do contexto

function App({ Component, pageProps }) {
  const router = useRouter();
  const isAuthRoute = router.pathname.startsWith("/auth");
  const isErrorPage = router.pathname === "/404" || router.pathname === "/500" || router.pathname === "/_error" || router.pathname === "/test-error";
  
  // Aplica proteção de rotas globalmente
  useRouteProtection();

  // Páginas de erro não devem ter layout nem proteção
  if (isErrorPage) {
    return (
      <ErrorBoundary>
        <Component {...pageProps} />
      </ErrorBoundary>
    );
  }

  if (isAuthRoute) {
    return (
      <ErrorBoundary>
        <Component {...pageProps} />
      </ErrorBoundary>
    );
  }

  return (
    <PropertyProvider> {/* Contexto engloba o sistema todo */}
      <ErrorBoundary>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </ErrorBoundary>
    </PropertyProvider>
  );
}

export default App;
