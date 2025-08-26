import React from 'react';
import Head from 'next/head';
import { ErrorPage, ServerError, NetworkError } from '@/components/errors';

function Error({ statusCode, message }) {
  // Renderiza componente específico baseado no código de erro
  if (statusCode === 500) {
    return (
      <>
        <Head>
          <title>Erro do Servidor | Buffs</title>
        </Head>
        <ServerError message={message} />
      </>
    );
  }

  if (statusCode === 503) {
    return (
      <>
        <Head>
          <title>Erro de Conexão | Buffs</title>
        </Head>
        <NetworkError message={message} />
      </>
    );
  }

  // Para outros códigos de erro, usa o componente genérico
  return (
    <>
      <Head>
        <title>Erro {statusCode} | Buffs</title>
      </Head>
      <ErrorPage
        title={`Erro ${statusCode}`}
        message={message || "Ocorreu um erro inesperado. Tente novamente mais tarde."}
        statusCode={statusCode.toString()}
        icon="❌"
        showHomeButton={true}
        showBackButton={true}
      />
    </>
  );
}

Error.getInitialProps = ({ res, err }) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
  const message = err ? err.message : 'Ocorreu um erro inesperado';
  
  return { statusCode, message };
};

export default Error;
