import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from './useAuth';
import { isPublicRoute, shouldRedirectIfAuthenticated } from '@/lib/authConfig';

export const useRouteProtection = () => {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    // Não aplicar proteção em páginas de erro
    if (router.pathname === '/404' || router.pathname === '/500' || router.pathname === '/_error' || router.pathname === '/test-error') {
      return;
    }

    if (!isLoading) {
      // Se estiver autenticado e estiver em rota de auth, redireciona para dashboard
      if (isAuthenticated && shouldRedirectIfAuthenticated(router.pathname)) {
        router.push('/dashboard');
        return;
      }
      
      // Removido o redirecionamento automático para login
      // Agora o ProtectedRoute é responsável por mostrar a tela de erro
      // e controlar o redirecionamento com o contador de 15 segundos
    }
  }, [isAuthenticated, isLoading, router]);

  return { isAuthenticated, isLoading };
};
