import React from 'react';
import Layout from '@/components/Layout';
import AuthStatus from '@/components/AuthStatus';
import { SupabaseAuth } from '@/utils/supabaseApi';

export default function ExemploSupabase() {
  const handleTestRebanho = async () => {
    console.log('Testando API do Rebanho...');
    alert('Função temporariamente indisponível - API RebanhoApi não implementada');
    // Esta API precisará ser implementada ou atualizada
  };

  
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">
          Exemplo de Integração com Supabase
        </h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Status da Autenticação */}
          <div>
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">
              Status da Autenticação
            </h2>
            <AuthStatus />
          </div>

          
        </div>

        {/* Instruções */}
        <div className="mt-8 p-6 bg-gray-50 border border-gray-200 rounded-md">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Como usar esta integração:
          </h2>
          
          <ol className="list-decimal list-inside space-y-2 text-gray-700">
            <li>
              <strong>Faça login:</strong> Use as credenciais de teste (teste@email.com / 123456)
            </li>
            <li>
              <strong>Verifique o status:</strong> O componente AuthStatus mostrará informações da sessão
            </li>
            <li>
              <strong>Obtenha o token:</strong> Clique em &quot;Obter Token de Acesso&quot; para ver o JWT
            </li>
            <li>
              <strong>Teste as APIs:</strong> Use os botões para testar as diferentes funcionalidades
            </li>
            <li>
              <strong>Use em seu código:</strong> Importe as APIs específicas para suas páginas
            </li>
          </ol>

          <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
            <h3 className="font-semibold text-yellow-800 mb-2"> Importante:</h3>
            <p className="text-yellow-700 text-sm">
              Certifique-se de que o arquivo <code className="bg-yellow-100 px-1 rounded">env.local</code> 
              esteja na raiz do projeto com suas credenciais do Supabase. 
              Renomeie para <code className="bg-yellow-100 px-1 rounded">.env.local</code> para que o Next.js o reconheça.
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
}
