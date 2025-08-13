import React from 'react';
import Head from 'next/head';
import Layout from '@/components/Layout';

export default function Suporte() {
  return (
    <>
      <Head>
        <title>Suporte | Buffs</title>
        <meta name="description" content="Entre em contato com nossa equipe de suporte" />
      </Head>
      
      <div className="p-6 flex flex-col gap-8">
        <div className="w-full flex flex-col bg-white rounded-xl p-6 gap-6 box-border border border-[#e0e0e0] shadow-sm">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Suporte Técnico</h1>
            <p className="text-gray-600 text-lg">
              Precisa de ajuda? Nossa equipe está aqui para ajudar você.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Contato */}
          <div className="bg-white rounded-xl p-6 border border-[#e0e0e0] shadow-sm">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Entre em Contato</h2>
            
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                  📧
                </div>
                <div>
                  <p className="font-medium text-gray-800">Email</p>
                  <p className="text-gray-600">suporte@buffs.com.br</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                  📱
                </div>
                <div>
                  <p className="font-medium text-gray-800">WhatsApp</p>
                  <p className="text-gray-600">(11) 99999-9999</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                  🕒
                </div>
                <div>
                  <p className="font-medium text-gray-800">Horário de Atendimento</p>
                  <p className="text-gray-600">Segunda a Sexta: 8h às 18h</p>
                </div>
              </div>
            </div>
          </div>

          {/* FAQ */}
          <div className="bg-white rounded-xl p-6 border border-[#e0e0e0] shadow-sm">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Perguntas Frequentes</h2>
            
            <div className="space-y-4">
              <details className="group">
                <summary className="cursor-pointer font-medium text-gray-800 hover:text-orange-600">
                  Como faço login na plataforma?
                </summary>
                <p className="mt-2 text-gray-600 text-sm">
                  Use seu email e senha cadastrados na página de login. Se esqueceu sua senha, clique em "Esqueci minha senha".
                </p>
              </details>
              
              <details className="group">
                <summary className="cursor-pointer font-medium text-gray-800 hover:text-orange-600">
                  Como adicionar um novo búfalo ao rebanho?
                </summary>
                <p className="mt-2 text-gray-600 text-sm">
                  Acesse a seção "Rebanho" e clique no botão "Adicionar Búfalo" para cadastrar um novo animal.
                </p>
              </details>
              
              <details className="group">
                <summary className="cursor-pointer font-medium text-gray-800 hover:text-orange-600">
                  Como registrar uma nova lactação?
                </summary>
                <p className="mt-2 text-gray-600 text-sm">
                  Na seção "Lactação", clique em "Nova Lactação" e preencha os dados da produção de leite.
                </p>
              </details>
            </div>
          </div>
        </div>

        {/* Formulário de Contato */}
        <div className="bg-white rounded-xl p-6 border border-[#e0e0e0] shadow-sm">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Envie uma Mensagem</h2>
          
          <form className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="nome" className="block text-sm font-medium text-gray-700 mb-1">
                  Nome
                </label>
                <input
                  type="text"
                  id="nome"
                  name="nome"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="Seu nome completo"
                />
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="seu@email.com"
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="assunto" className="block text-sm font-medium text-gray-700 mb-1">
                Assunto
              </label>
              <select
                id="assunto"
                name="assunto"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                <option value="">Selecione um assunto</option>
                <option value="problema-tecnico">Problema Técnico</option>
                <option value="duvida">Dúvida sobre Funcionalidade</option>
                <option value="sugestao">Sugestão de Melhoria</option>
                <option value="outro">Outro</option>
              </select>
            </div>
            
            <div>
              <label htmlFor="mensagem" className="block text-sm font-medium text-gray-700 mb-1">
                Mensagem
              </label>
              <textarea
                id="mensagem"
                name="mensagem"
                rows="4"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="Descreva sua dúvida ou problema..."
              ></textarea>
            </div>
            
            <button
              type="submit"
              className="w-full bg-orange-500 hover:bg-orange-600 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200"
            >
              Enviar Mensagem
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
