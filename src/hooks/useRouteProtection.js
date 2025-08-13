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
      
      // Se não estiver autenticado e não estiver em rota pública, redireciona para login
      // Mas só se não estiver já indo para login (evita loops)
      if (!isAuthenticated && !isPublicRoute(router.pathname) && router.pathname !== '/auth/login') {
        router.push('/auth/login');
        return;
      }
    }
  }, [isAuthenticated, isLoading, router]);

  return { isAuthenticated, isLoading };
};
