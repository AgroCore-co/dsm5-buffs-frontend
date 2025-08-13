import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/hooks/useAuth';
import Loading from './Loading';
import UnauthorizedError from './errors/UnauthorizedError';
import CountdownTimer from './CountdownTimer';

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const [isTokenValid, setIsTokenValid] = useState(false);
  const [showUnauthorized, setShowUnauthorized] = useState(false);
  const [redirecting, setRedirecting] = useState(false);

  // Não aplicar proteção em páginas de erro
  if (router.pathname === '/404' || router.pathname === '/500' || router.pathname === '/_error' || router.pathname === '/test-error') {
    return children;
  }

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        // Em vez de redirecionar imediatamente, mostra o erro
        setShowUnauthorized(true);
        return;
      }

      // Se estiver autenticado, considera o token válido
      setIsTokenValid(true);
      setShowUnauthorized(false);
    }
  }, [isAuthenticated, isLoading]);

  const handleRedirect = () => {
    setRedirecting(true);
    router.push('/auth/login');
  };

  // Mostra loading enquanto verifica autenticação
  if (isLoading) {
    return <Loading />;
  }

  // Se não estiver autenticado, mostra erro de acesso não autorizado
  if (showUnauthorized) {
    return (
      <UnauthorizedError 
        message="Você não tem permissão para acessar esta página. Será redirecionado automaticamente para o login."
        showLoginButton={false}
        countdownTimer={<CountdownTimer seconds={5} onComplete={handleRedirect} />}
      />
    );
  }

  // Se não estiver autenticado ou token inválido, não renderiza nada
  if (!isAuthenticated || !isTokenValid) {
    return null;
  }

  // Se estiver autenticado e token válido, renderiza o conteúdo
  return children;
}
