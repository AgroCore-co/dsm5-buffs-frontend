import React from 'react';
import Head from 'next/head';
import { ServerError } from '@/components/errors';

export default function Custom500() {
  return (
    <>
      <Head>
        <title>Erro do Servidor | Buffs</title>
        <meta name="description" content="Ocorreu um erro interno no servidor" />
      </Head>
      
      <ServerError 
        message="Ocorreu um erro interno no servidor. Nossa equipe foi notificada e está trabalhando para resolver o problema. Tente novamente em alguns minutos."
        showRetryButton={true}
      />
    </>
  );
}
