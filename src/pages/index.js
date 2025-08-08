import { useEffect } from "react";
import { useRouter } from "next/router";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Redirecionar sempre para a tela de login
    router.push("/auth/login");
  }, [router]);

  // Retorna null enquanto redireciona
  return null;
}
