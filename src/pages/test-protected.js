import React from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import Layout from '@/components/Layout';

const TestProtectedPage = () => {
  return (
    <ProtectedRoute>
      <Layout>
        <div className="min-h-screen bg-gradient-to-br from-orange-50 to-yellow-50 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">
              Página Protegida de Teste
            </h1>
            <p className="text-gray-600 mb-6">
              Se você está vendo esta mensagem, significa que está autenticado e a proteção de rota está funcionando corretamente.
            </p>
            <div className="bg-green-100 border border-green-200 rounded-lg p-4">
              <p className="text-green-800 font-medium">
                ✅ Autenticação bem-sucedida!
              </p>
            </div>
          </div>
        </div>
      </Layout>
    </ProtectedRoute>
  );
};

export default TestProtectedPage;
