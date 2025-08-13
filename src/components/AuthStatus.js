import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';

export default function AuthStatus() {
  const { user, isAuthenticated, getAccessToken, logout } = useAuth();
  const [accessToken, setAccessToken] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleGetToken = async () => {
    setIsLoading(true);
    try {
      const token = await getAccessToken();
      setAccessToken(token);
    } catch (error) {
      console.error('Erro ao obter token:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    setAccessToken(null);
  };

  if (!isAuthenticated) {
    return (
      <div className="p-4 bg-yellow-100 border border-yellow-400 rounded-md">
        <p className="text-yellow-800">Usuário não autenticado</p>
      </div>
    );
  }

  return (
    <div className="p-4 bg-green-100 border border-green-400 rounded-md">
      <h3 className="text-lg font-semibold text-green-800 mb-2">
        Status da Autenticação
      </h3>
      
      <div className="mb-4">
        <p className="text-green-700">
          <strong>Email:</strong> {user?.email}
        </p>
        <p className="text-green-700">
          <strong>ID:</strong> {user?.id}
        </p>
        <p className="text-green-700">
          <strong>Último login:</strong> {user?.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleString('pt-BR') : 'N/A'}
        </p>
      </div>

      <div className="mb-4">
        <button
          onClick={handleGetToken}
          disabled={isLoading}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 mr-2"
        >
          {isLoading ? 'Obtendo...' : 'Obter Token de Acesso'}
        </button>
        
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Logout
        </button>
      </div>

      {accessToken && (
        <div className="mt-4">
          <h4 className="font-semibold text-green-800 mb-2">Token de Acesso:</h4>
          <div className="bg-gray-100 p-2 rounded text-xs font-mono break-all">
            {accessToken}
          </div>
          <p className="text-xs text-gray-600 mt-1">
            Use este token para fazer requisições autenticadas para o Supabase
          </p>
        </div>
      )}
    </div>
  );
}
