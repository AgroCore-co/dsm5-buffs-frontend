"use client";

import Head from "next/head";
import { useState, useEffect } from "react";
import { getMyProfile } from "@/services/userService";

export default function Perfil() {
  // Dados do usuário vindos da API
  const [userData, setUserData] = useState(null);

  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState(null);

  const handleEdit = () => {
    setIsEditing(true);
    setEditedData(userData);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedData(userData);
  };

  const handleSave = () => {
    setUserData(editedData);
    setIsEditing(false);
    // Aqui você faria a chamada para a API para salvar os dados
    console.log("Dados salvos:", editedData);
  };

  const handleChange = (field, value) => {
    setEditedData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const formatCargo = (cargo) => {
    const cargos = {
      'PROPRIETARIO': 'Proprietário',
      'GERENTE': 'Gerente',
      'FUNCIONARIO': 'Funcionário',
      'VETERINARIO': 'Veterinário'
    };
    return cargos[cargo] || cargo;
  };

  useEffect(() => {
    getMyProfile()
      .then((data) => {
        setUserData(data);
        setEditedData(data);
      })
      .catch(() => {
        setUserData(null);
        setEditedData(null);
      });
  }, []);

  if (!userData) {
    return (
      <div className="p-10 text-center text-gray-500">Carregando dados do usuário...</div>
    );
  }

  return (
    <>
      <Head>
        <title>Perfil | Buffs</title>
        <meta name="description" content="Perfil do usuário na plataforma Buffs" />
      </Head>

      <div className="p-6 flex flex-col gap-8">
        {/* Header */}
        <div className="w-full flex flex-col bg-white rounded-xl p-6 gap-6 box-border border border-[#e0e0e0] shadow-sm">
          <div className="flex justify-between items-start">
            <div>
                <h1 className="text-3xl font-bold text-gray-800 mb-2">Meu Perfil</h1>
              <p className="text-gray-600 text-lg">
                Gerencie suas informações pessoais e configurações de conta.
              </p>
            </div>
            <div className="flex gap-3">
              {!isEditing ? (
                <button
                  onClick={handleEdit}
                  className="px-6 py-2.5 bg-[#FFCF78] text-gray-800 rounded-lg font-semibold hover:bg-[#F2B84D] transition-colors shadow-sm"
                >
                  Editar Perfil
                </button>
              ) : (
                <>
                  <button
                    onClick={handleCancel}
                    className="px-6 py-2.5 bg-gray-200 text-gray-800 rounded-lg font-semibold hover:bg-gray-300 transition-colors shadow-sm"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleSave}
                    className="px-6 py-2.5 bg-[#FFCF78] text-gray-800 rounded-lg font-semibold hover:bg-[#F2B84D] transition-colors shadow-sm"
                  >
                    Salvar
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Informações Pessoais */}
        <div className="w-full flex flex-col bg-white rounded-xl p-6 gap-6 box-border border border-[#e0e0e0] shadow-sm">
          <h2 className="text-2xl font-bold text-gray-800">Informações Pessoais</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Nome Completo */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-gray-700">
                Nome Completo
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={editedData.nome}
                  onChange={(e) => handleChange('nome', e.target.value)}
                  className="px-4 py-3 border border-[#e0e0e0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFCF78] focus:border-transparent"
                />
              ) : (
                <div className="px-4 py-3 bg-gray-50 rounded-lg text-gray-800 font-medium">
                  {userData.nome}
                </div>
              )}
            </div>

            {/* Email */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-gray-700">
                Email
              </label>
              {isEditing ? (
                <input
                  type="email"
                  value={editedData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  className="px-4 py-3 border border-[#e0e0e0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFCF78] focus:border-transparent"
                />
              ) : (
                <div className="px-4 py-3 bg-gray-50 rounded-lg text-gray-800 font-medium">
                  {userData.email}
                </div>
              )}
            </div>

            {/* Telefone */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-gray-700">
                Telefone
              </label>
              {isEditing ? (
                <input
                  type="tel"
                  value={editedData.telefone}
                  onChange={(e) => handleChange('telefone', e.target.value)}
                  className="px-4 py-3 border border-[#e0e0e0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFCF78] focus:border-transparent"
                />
              ) : (
                <div className="px-4 py-3 bg-gray-50 rounded-lg text-gray-800 font-medium">
                  {userData.telefone}
                </div>
              )}
            </div>

            {/* Cargo */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-gray-700">
                Cargo
              </label>
              <div className="px-4 py-3 bg-gray-50 rounded-lg">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-[#FFCF78] text-gray-800">
                  {formatCargo(userData.cargo)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Informações da Conta */}
        <div className="w-full flex flex-col bg-white rounded-xl p-6 gap-6 box-border border border-[#e0e0e0] shadow-sm">
          <h2 className="text-2xl font-bold text-gray-800">Informações da Conta</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* ID do Usuário */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-gray-700">
                ID do Usuário
              </label>
              <div className="px-4 py-3 bg-gray-50 rounded-lg text-gray-600 text-sm font-mono break-all">
                {userData.id_usuario}
              </div>
            </div>

            {/* ID de Autenticação */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-gray-700">
                ID de Autenticação
              </label>
              <div className="px-4 py-3 bg-gray-50 rounded-lg text-gray-600 text-sm font-mono break-all">
                {userData.auth_id}
              </div>
            </div>

            {/* ID do Endereço */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-gray-700">
                ID do Endereço
              </label>
              <div className="px-4 py-3 bg-gray-50 rounded-lg text-gray-600 text-sm">
                {userData.id_endereco || 'Não cadastrado'}
              </div>
            </div>

            {/* Data de Criação */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-gray-700">
                Conta Criada em
              </label>
              <div className="px-4 py-3 bg-gray-50 rounded-lg text-gray-800 font-medium">
                {userData.created_at}
              </div>
            </div>

            {/* Data de Atualização */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-gray-700">
                Última Atualização
              </label>
              <div className="px-4 py-3 bg-gray-50 rounded-lg text-gray-800 font-medium">
                {userData.updated_at}
              </div>
            </div>

            {/* Endereço */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-gray-700">
                Endereço
              </label>
              <div className="px-4 py-3 bg-gray-50 rounded-lg text-gray-600 text-sm">
                {userData.endereco || 'Não cadastrado'}
              </div>
            </div>
          </div>
        </div>

        {/* Estatísticas Rápidas */}
       
      </div>
    </>
  );
}
