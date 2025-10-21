import { useEffect } from "react";
import { useRouter } from "next/router";
import { getMyProfile } from "@/services/userService";
import { useAuth } from "@/contexts/authContext";


export function useRoleRedirect() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) return;
    let ignore = false;
    async function checkRole() {
      try {
        const profile = await getMyProfile();
        if (ignore) return;
        if (profile.cargo === "PROPRIETARIO") {
          router.replace("/dashboard");
        } else {
          // Redirecione para outra rota conforme o cargo
          router.replace("/home");
        }
      } catch (e) {
        if (e.response && e.response.status === 404) {
          // Perfil não encontrado, forçar completar perfil
          router.replace("/complete-profile");
        } else {
        }
      }
    }
    checkRole();
    return () => {
      ignore = true;
    };
  }, [isAuthenticated, router]);
}
