import "@/styles/globals.css";
import Layout from "@/components/Layout";
import { useRouter } from "next/router";

function App({ Component, pageProps }) {
  const router = useRouter();
  const isAuthRoute = router.pathname.startsWith("/auth");

  if (isAuthRoute) {
    return <Component {...pageProps} />;
  }

  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  );
}

export default App;
