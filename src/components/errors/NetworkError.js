import React from 'react';
import ErrorPage from '../ErrorPage';

const NetworkError = ({ message, showRetryButton = true }) => {
  const handleRetry = () => {
    window.location.reload();
  };

  const actionButton = showRetryButton ? (
    <button
      onClick={handleRetry}
      className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200"
    >
      🌐 Verificar Conexão
    </button>
  ) : null;

  return (
    <ErrorPage
      title="Erro de Conexão"
      message={message || "Não foi possível conectar ao servidor. Verifique sua conexão com a internet e tente novamente."}
      statusCode="503"
      icon="🌐"
      showHomeButton={true}
      showBackButton={true}
      actionButton={actionButton}
    />
  );
};

export default NetworkError;
