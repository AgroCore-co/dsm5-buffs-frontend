import { useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/hooks/useAuth';
import Loading from './Loading';
import UnauthorizedError from './errors/UnauthorizedError';
import CountdownTimer from './CountdownTimer';

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, authInitialized } = useAuth();
  const router = useRouter();
  const didRedirectRef = useRef(false);

  // Páginas onde não aplica proteção
  const isErrorPage = ['/404', '/500', '/_error', '/test-error'].includes(router.pathname);

  const handleRedirect = () => {
    if (!didRedirectRef.current && router.pathname !== '/auth/login') {
      didRedirectRef.current = true;
      router.push('/auth/login');
    }
  };

  // Mostra loading apenas durante inicialização da autenticação
  if (!authInitialized) {
    return <Loading fullScreen text="Verificando sessão..." />;
  }

  // Permite acesso direto a páginas de erro
  if (isErrorPage) {
    return children;
  }

  // Se não estiver autenticado, mostra erro e redireciona
  if (!isAuthenticated) {
    return (
      <UnauthorizedError
        message="Você não tem permissão para acessar esta página. Será redirecionado automaticamente para o login em alguns segundos."
        showLoginButton
        countdownTimer={<CountdownTimer seconds={5} onComplete={handleRedirect} />}
      />
    );
  }

  // Se estiver autenticado, renderiza o conteúdo
  return children;
}
