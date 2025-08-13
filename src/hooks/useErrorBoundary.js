import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

export const useErrorBoundary = () => {
  const [error, setError] = useState(null);
  const [errorInfo, setErrorInfo] = useState(null);
  const router = useRouter();

  const handleError = (error, errorInfo) => {
    console.error('Erro capturado:', error, errorInfo);
    setError(error);
    setErrorInfo(errorInfo);
  };

  const clearError = () => {
    setError(null);
    setErrorInfo(null);
  };

  const handleRetry = () => {
    clearError();
    window.location.reload();
  };

  const handleGoHome = () => {
    clearError();
    router.push('/dashboard');
  };

  const handleGoBack = () => {
    clearError();
    router.back();
  };

  // Captura erros não tratados
  useEffect(() => {
    const handleUnhandledRejection = (event) => {
      console.error('Promise rejeitada não tratada:', event.reason);
      setError(new Error('Erro de conexão com o servidor'));
    };

    const handleError = (event) => {
      console.error('Erro não tratado:', event.error);
      setError(event.error || new Error('Erro inesperado'));
    };

    window.addEventListener('unhandledrejection', handleUnhandledRejection);
    window.addEventListener('error', handleError);

    return () => {
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
      window.removeEventListener('error', handleError);
    };
  }, []);

  return {
    error,
    errorInfo,
    handleError,
    clearError,
    handleRetry,
    handleGoHome,
    handleGoBack,
    hasError: !!error
  };
};
