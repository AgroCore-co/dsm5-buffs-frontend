// src/pages/_app.js
import "@/styles/globals.css";
import Layout from "@/components/Layout";
import { useRouter } from "next/router";
import { useRouteProtection } from "@/hooks/useRouteProtection";
import ErrorBoundary from "@/components/ErrorBoundary";
import { PropertyProvider } from "@/contexts/PropertyContext";
// (import AuthProvider se você tiver um)

function App({ Component, pageProps }) {
  const router = useRouter();
  const isErrorPage = ["/404", "/500", "/_error", "/test-error"].includes(
    router.pathname
  );

  useRouteProtection();

  if (isErrorPage) {
    return (
      <ErrorBoundary>
        <Component {...pageProps} />
      </ErrorBoundary>
    );
  }

  return (
    // <AuthProvider>  // se você tiver
    <PropertyProvider>
      <ErrorBoundary>
        {router.pathname.startsWith("/auth") ? (
          <Component {...pageProps} />
        ) : (
          <Layout>
            <Component {...pageProps} />
          </Layout>
        )}
      </ErrorBoundary>
    </PropertyProvider>
    // </AuthProvider>
  );
}

export default App;
