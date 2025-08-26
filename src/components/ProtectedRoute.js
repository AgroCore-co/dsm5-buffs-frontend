import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/hooks/useAuth';
import Loading from './Loading';
import UnauthorizedError from './errors/UnauthorizedError';
import CountdownTimer from './CountdownTimer';

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, isLoading, authInitialized } = useAuth();
  const router = useRouter();
  const [showUnauthorized, setShowUnauthorized] = useState(false);
  const didRedirectRef = useRef(false);

  // Não aplicar proteção em páginas de erro
  if (router.pathname === '/404' || router.pathname === '/500' || router.pathname === '/_error' || router.pathname === '/test-error') {
    return children;
  }

  useEffect(() => {
    if (!isLoading && authInitialized) {
      if (!isAuthenticated) {
        setShowUnauthorized(true);
        return;
      }
      setShowUnauthorized(false);
    }
  }, [isAuthenticated, isLoading, authInitialized]);

  const handleRedirect = () => {
    if (!didRedirectRef.current && router.pathname !== '/auth/login') {
      didRedirectRef.current = true;
      router.push('/auth/login');
    }
  };

  // Mostra loading enquanto verifica autenticação
  if (isLoading || !authInitialized) {
    return <Loading />;
  }

  // Se não estiver autenticado, mostra erro de acesso não autorizado
  if (showUnauthorized) {
    return (
      <UnauthorizedError 
        message="Você não tem permissão para acessar esta página. Será redirecionado automaticamente para o login em alguns segundos."
        showLoginButton={true}
        countdownTimer={<CountdownTimer seconds={5} onComplete={handleRedirect} />}
      />
    );
  }

  // Se estiver autenticado, renderiza o conteúdo
  return children;
}
