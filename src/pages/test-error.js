import React from 'react';
import Head from 'next/head';
import { ServerError } from '@/components/errors';

export default function TestError() {
  return (
    <>
      <Head>
        <title>Teste de Erro | Buffs</title>
        <meta name="description" content="Página para testar o sistema de tratamento de erros" />
      </Head>
      
      <ServerError 
        message="Esta é uma página de teste para demonstrar o sistema de tratamento de erros. As páginas de erro não devem ter o layout da aplicação."
        showRetryButton={false}
      />
    </>
  );
}
