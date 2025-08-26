import React from 'react';
import ErrorPage from '../ErrorPage';

const ServerError = ({ message, showRetryButton = true }) => {
  const handleRetry = () => {
    window.location.reload();
  };

  const actionButton = showRetryButton ? (
    <button
      onClick={handleRetry}
      className="w-full bg-red-500 hover:bg-red-600 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200"
    >
      🔄 Tentar Novamente
    </button>
  ) : null;

  return (
    <ErrorPage
      title="Erro do Servidor"
      message={message || "Ocorreu um erro interno no servidor. Nossa equipe foi notificada e está trabalhando para resolver o problema."}
      statusCode="500"
      icon="💥"
      showHomeButton={true}
      showBackButton={true}
      actionButton={actionButton}
    />
  );
};

export default ServerError;
