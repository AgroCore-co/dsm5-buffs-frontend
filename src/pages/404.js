import React from 'react';
import Head from 'next/head';
import { NotFoundError } from '@/components/errors';

export default function Custom404() {
  return (
    <>
      <Head>
        <title>Página Não Encontrada | Buffs</title>
        <meta name="description" content="A página que você está procurando não foi encontrada" />
      </Head>
      
      <NotFoundError 
        message="A página que você está procurando não existe ou foi movida. Verifique o endereço e tente novamente."
        showSearchButton={true}
      />
    </>
  );
}
