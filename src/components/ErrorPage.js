import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

const ErrorPage = ({ 
  title = "Ops! Algo deu errado", 
  message = "Ocorreu um erro inesperado. Tente novamente mais tarde.",
  statusCode = "500",
  showHomeButton = true,
  showBackButton = true,
  actionButton = null,
  countdownTimer = null
}) => {
  const router = useRouter();

  const handleGoBack = () => {
    router.back();
  };

  const handleGoHome = () => {
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-yellow-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
        
        
        {/* Código de status */}
        {statusCode && (
          <div className="text-sm font-mono text-gray-400 mb-2">
            Erro {statusCode}
          </div>
        )}
        
        {/* Título */}
        <h1 className="text-2xl font-bold text-gray-800 mb-4">
          {title}
        </h1>
        
        {/* Mensagem */}
        <p className="text-gray-600 mb-8 leading-relaxed">
          {message}
        </p>
        
        {/* Contador regressivo */}
        {countdownTimer && (
          <div className="mb-6">
            {countdownTimer}
          </div>
        )}
        
        {/* Botões de ação */}
        <div className="space-y-3">
          {actionButton && (
            <div className="mb-4">
              {actionButton}
            </div>
          )}
          
          {showBackButton && (
            <button
              onClick={handleGoBack}
              className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 px-4 rounded-lg transition-colors duration-200"
            >
              ← Voltar
            </button>
          )}
          
          {showHomeButton && (
            <button
              onClick={handleGoHome}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200"
            >
              Ir para o Dashboard
            </button>
          )}
        </div>
        
       
      </div>
    </div>
  );
};

export default ErrorPage;
