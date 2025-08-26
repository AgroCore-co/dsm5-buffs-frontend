import React from 'react';
import ErrorPage from '../ErrorPage';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/router';

const UnauthorizedError = ({ message, showLoginButton = true, countdownTimer }) => {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  const handleLogin = () => {
    router.push('/auth/login');
  };

  const actionButton = showLoginButton && !isAuthenticated ? (
    <button
      onClick={handleLogin}
      className="w-full bg-orange-500 hover:bg-orange-600 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200"
    >
       Fazer Login
    </button>
  ) : null;

  return (
    <ErrorPage
      title="Acesso Negado"
      message={message || "Você não tem permissão para acessar esta página. Faça login para continuar."}
      showHomeButton={isAuthenticated}
      showBackButton={true}
      actionButton={actionButton}
      countdownTimer={countdownTimer}
    />
  );
};

export default UnauthorizedError;
