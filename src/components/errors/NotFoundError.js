import React from 'react';
import ErrorPage from '../ErrorPage';

const NotFoundError = ({ message, showSearchButton = true }) => {

  return (
    <ErrorPage
      title="Página Não Encontrada"
      message={message || "A página que você está procurando não existe ou foi movida. Verifique o endereço e tente novamente."}
      statusCode="404"
      showHomeButton={true}
      showBackButton={true}
    />
  );
};

export default NotFoundError;
