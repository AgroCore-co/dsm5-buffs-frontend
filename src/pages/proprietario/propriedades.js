"use client";

import Head from "next/head";
import { useEffect, useState } from "react";
import propriedadeService from "@/services/propriedadeService";
import enderecoService from "@/services/enderecoService";
import { getUserById } from "@/services/userService";
import Link from "next/link";
import PropriedadeCreateModal from "@/components/proprietario/propriedades/PropriedadeCreateModal";
import PropriedadeEditModal from "@/components/proprietario/propriedades/PropriedadeEditModal";
import { FiEdit2 } from "react-icons/fi";

export default function Propriedades() {
  const [propriedades, setPropriedades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [propriedadeSelecionada, setPropriedadeSelecionada] = useState(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [confirmDeleteEnderecoId, setConfirmDeleteEnderecoId] = useState(null);

  const fetchPropriedades = async () => {
    setLoading(true);
    setError(null);
    try {
      const props = await propriedadeService.listarPropriedades();
      // Busca os endereços e donos de cada propriedade
      const propsComEnderecoDono = await Promise.all(
        props.map(async (p) => {
          let endereco = null;
          let dono = null;
          try {
            endereco = await enderecoService.buscarEnderecoPorId(p.id_endereco);
          } catch {
            endereco = null;
          }
          try {
            dono = await getUserById(p.id_dono);
          } catch {
            dono = null;
          }
          return { ...p, endereco, dono };
        })
      );
      setPropriedades(propsComEnderecoDono);
    } catch (err) {
      setError("Erro ao carregar propriedades");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPropriedades();
  }, []);

  // Funções utilitárias para exibir dados
  const formatCNPJ = (cnpj) => cnpj || "N/A";
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleDateString("pt-BR");
    } catch {
      return "N/A";
    }
  };
  const formatEndereco = (endereco) =>
    endereco
      ? `${endereco.rua}, ${endereco.bairro}, ${endereco.cidade} - ${endereco.estado}`
      : "Endereço não encontrado";
  const formatDono = (dono) => (dono && dono.nome ? dono.nome : "Usuário não encontrado");

  return (
    <>
      <Head>
        <title>Gestão de Propriedades | Buffs</title>
        <meta
          name="description"
          content="Gestão e controle de propriedades rurais"
        />
      </Head>
      <div className="p-6 flex flex-col gap-8">
        {/* Header - Gestão de Propriedades */}
        <div className="w-full flex flex-col bg-white rounded-xl p-6 gap-6 box-border border border-[#e0e0e0] shadow-sm">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Gestão de Propriedades
            </h1>
            <p className="text-gray-600 text-lg">
              Controle e monitore todas as propriedades rurais do seu negócio.
            </p>
          </div>
          {/* Estatísticas Gerais */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-4 rounded-lg shadow border border-[#e0e0e0]">
              <div className="flex items-center justify-between mb-1">
                <h2 className="text-sm font-semibold text-[var(--color-text-secondary)]">
                  Total de Propriedades
                </h2>
                <span className="text-xs font-medium text-[var(--color-primary-dark]">
                  Cadastradas
                </span>
              </div>
              <p className="text-4xl font-extrabold tracking-tight text-[var(--color-text-dark)]">
                {propriedades.length}
              </p>
              <p className="text-xs text-[var(--color-text-tertiary)] mt-1">
                Quantidade no sistema
              </p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow border border-[#e0e0e0]">
              <div className="flex items-center justify-between mb-1">
                <h2 className="text-sm font-semibold text-[var(--color-text-secondary)]">
                  Propriedades Ativas
                </h2>
                <span className="text-xs font-medium text-[var(--color-primary-dark)]">
                  Status
                </span>
              </div>
              <p className="text-4xl font-extrabold tracking-tight text-[var(--color-text-dark)]">
                {propriedades.filter((p) => p.status === "Ativa" || p.status === undefined).length}
              </p>
              <p className="text-xs text-[var(--color-text-tertiary)] mt-1">
                Quantidade funcionando
              </p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow border border-[#e0e0e0]">
              <div className="flex items-center justify-between mb-1">
                <h2 className="text-sm font-semibold text-[var(--color-text-secondary)]">
                  Tipo Pecuária
                </h2>
                <span className="text-xs font-medium text-[var(--color-primary-dark)]">
                  Manejo
                </span>
              </div>
              <p className="text-4xl font-extrabold tracking-tight text-[var(--color-text-dark)]">
                {propriedades.filter((p) => p.tipo_manejo === "P").length}
              </p>
              <p className="text-xs text-[var(--color-text-tertiary)] mt-1">
                Quantidade focadas em bubalinos
              </p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow border border-[#e0e0e0]">
              <div className="flex items-center justify-between mb-1">
                <h2 className="text-sm font-semibold text-[var(--color-text-secondary)]">
                  Registradas ABCB
                </h2>
                <span className="text-xs font-medium text-[var(--color-primary-dark)]">
                  Certificação
                </span>
              </div>
              <p className="text-4xl font-extrabold tracking-tight text-[var(--color-text-dark)]">
                {propriedades.filter((p) => p.p_abcb).length}
              </p>
              <p className="text-xs text-[var(--color-text-tertiary)] mt-1">
                Quantidade com certificação
              </p>
            </div>
          </div>
        </div>
        <div className="w-full flex flex-col bg-white rounded-xl p-5 gap-4 box-border border border-[#e0e0e0] shadow-sm">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                Propriedades Cadastradas
              </h2>
              <p className="text-gray-600">
                {propriedades.length} propriedades encontradas
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                className="bg-[#FFCF78] text-gray-800 py-2 px-4 rounded-lg text-sm font-bold"
                onClick={() => setModalOpen(true)}
              >
                + Nova Propriedade
              </button>
            </div>
          </div>
          {/* Grid de Cards */}
          {loading ? (
            <div className="text-center py-12 text-gray-500">Carregando propriedades...</div>
          ) : error ? (
            <div className="text-center py-12 text-red-500">{error}</div>
          ) : propriedades.length === 0 ? (
            <div className="text-center py-12 text-gray-500">Nenhuma propriedade encontrada.</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-4">
              {propriedades.map((propriedade) => (
                <div key={propriedade.id_propriedade} className="relative group">
                  <Link
                    href={`/proprietario/propriedade/${propriedade.id_propriedade}`}
                    className="no-underline"
                    passHref
                  >
                    <div
                      className="bg-white border border-gray-200 rounded-lg hover:shadow-md transition-all p-4 cursor-pointer h-full"
                      style={{ height: "100%" }}
                    >
                      {/* Header do Card */}
                      <div className="flex justify-between items-center mb-3">
                        <div className="flex flex-col gap-1">
                          <span className="px-2 py-1 rounded-full text-xs font-medium bg-[#9DFFBE] text-gray-800">
                            {propriedade.status || "Ativa"}
                          </span>
                          {propriedade.p_abcb && (
                            <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              ABCB
                            </span>
                          )}
                        </div>
                      </div>
                      {/* Nome e informações principais */}
                      <div className="mb-3">
                        <h3 className="text-sm font-bold text-gray-800 mb-1 truncate">
                          {propriedade.nome}
                        </h3>
                        <div className="flex justify-between text-xs text-gray-600 mb-1">
                          <span>{propriedade.tipo_manejo === "P" ? "Pecuária" : propriedade.tipo_manejo === "E" ? "Extensivo" : "Intensivo"}</span>
                          <span className="text-xs text-gray-500">
                            {propriedade.tipo_manejo && `(${propriedade.tipo_manejo})`}
                          </span>
                        </div>
                        <div className="text-xs text-gray-500">
                          CNPJ: {formatCNPJ(propriedade.cnpj)}
                        </div>
                      </div>
                      {/* Informações de datas */}
                      <div className="mb-3">
                        <div className="text-xs text-gray-500">
                          Cadastrada em: {formatDate(propriedade.created_at)}
                        </div>
                        {propriedade.updated_at !== propriedade.created_at && (
                          <div className="text-xs text-gray-500">
                            Atualizada: {formatDate(propriedade.updated_at)}
                          </div>
                        )}
                      </div>
                      {/* Informações adicionais */}
                      <div className="flex flex-col gap-1 text-xs text-gray-600 mt-2">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-gray-700">Endereço:</span>
                          <span className="truncate max-w-[180px]" title={formatEndereco(propriedade.endereco)}>
                            {formatEndereco(propriedade.endereco)}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-gray-700">Dono:</span>
                          <span className="truncate max-w-[140px]" title={formatDono(propriedade.dono)}>
                            {formatDono(propriedade.dono)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                  <button
                    type="button"
                    className="absolute top-2 right-2 bg-[#FFCF78] text-gray-800 p-2 rounded-full pointer-events-auto border border-[#e0e0e0] shadow flex items-center justify-center
                      opacity-0 scale-75 group-hover:opacity-100 group-hover:scale-100 transition-all duration-300 ease-out"
                    onClick={(e) => {
                      e.preventDefault();
                      setPropriedadeSelecionada(propriedade);
                      setEditModalOpen(true);
                    }}
                    title="Editar"
                    style={{ zIndex: 2 }}
                  >
                    <FiEdit2 className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    className="absolute top-2 right-12 bg-red-500 text-white p-2 rounded-full pointer-events-auto border border-[#e0e0e0] shadow flex items-center justify-center
                      opacity-0 scale-75 group-hover:opacity-100 group-hover:scale-100 transition-all duration-300 ease-out"
                    onClick={(e) => {
                      e.preventDefault();
                      setConfirmDeleteId(propriedade.id_propriedade);
                      setConfirmDeleteEnderecoId(propriedade.id_endereco);
                    }}
                    title="Deletar"
                    style={{ zIndex: 2 }}
                  >
                    <span className="sr-only">Deletar</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                  {/* Modal de confirmação de exclusão */}
                  {confirmDeleteId === propriedade.id_propriedade && (
                    <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/40">
                      <div className="bg-white rounded-lg shadow-lg p-8 max-w-sm w-full flex flex-col items-center">
                        <h2 className="text-lg font-bold mb-4 text-gray-800">Tem certeza que deseja deletar esta propriedade?</h2>
                        <p className="text-sm text-gray-600 mb-6">Essa ação não pode ser desfeita.</p>
                        <div className="flex gap-4">
                          <button
                            className="px-4 py-2 rounded bg-gray-300 text-gray-700 font-medium hover:bg-gray-400"
                            onClick={() => setConfirmDeleteId(null)}
                          >
                            Cancelar
                          </button>
                          <button
                            className="px-4 py-2 rounded bg-red-500 text-white font-medium hover:bg-red-600"
                            onClick={async () => {
                              try {
                                await propriedadeService.deletarPropriedade(confirmDeleteId);
                                if (confirmDeleteEnderecoId) {
                                  await enderecoService.deletarEndereco(confirmDeleteEnderecoId);
                                }
                                setConfirmDeleteId(null);
                                setConfirmDeleteEnderecoId(null);
                                fetchPropriedades();
                              } catch (err) {
                                alert("Erro ao deletar propriedade.");
                              }
                            }}
                          >
                            Deletar
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <PropriedadeCreateModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
      <PropriedadeEditModal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        propriedade={propriedadeSelecionada}
        onUpdated={fetchPropriedades}
      />
    </>
  );
}