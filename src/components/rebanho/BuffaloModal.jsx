"use client";

import React, { useEffect, useState, useCallback } from "react";
import GenealogyTree from "./GenealogyTree";

export default function BuffaloModal({
  open,
  buffalo,
  onClose,
  getStatusColor,
  getDadosZootecnicos,
  getDadosSanitarios,
  getSexIcon,
  buffalosMock = [],
}) {
  const [activeTab, setActiveTab] = useState("info");

  // --- Estados de paginação (itens por página configuráveis) ---
  const PER_PAGE_SMALL = 5; // observações, linha do tempo, descendentes
  const PER_PAGE_TABLE = 5; // tabelas (medicamentos, procedimentos, vacinas etc.)

  const [timelinePage, setTimelinePage] = useState(1);
  const [obsPage, setObsPage] = useState(1);
  const [descPage, setDescPage] = useState(1);

  const [medsPage, setMedsPage] = useState(1);
  const [procsPage, setProcsPage] = useState(1);

  const [vacPage, setVacPage] = useState(1);
  const [vermPage, setVermPage] = useState(1);
  const [examsPage, setExamsPage] = useState(1);
  const [tratPage, setTratPage] = useState(1);

  // reset de abas e paginações ao abrir/trocar animal
  useEffect(() => {
    if (open) {
      setActiveTab("info");
      setTimelinePage(1);
      setObsPage(1);
      setDescPage(1);
      setMedsPage(1);
      setProcsPage(1);
      setVacPage(1);
      setVermPage(1);
      setExamsPage(1);
      setTratPage(1);
    }
  }, [open, buffalo]);

  useEffect(() => {
    if (!open) return;
    const onEsc = (e) => e.key === "Escape" && onClose?.();
    window.addEventListener("keydown", onEsc);
    return () => window.removeEventListener("keydown", onEsc);
  }, [open, onClose]);

  const stop = useCallback((e) => e.stopPropagation(), []);
  if (!open || !buffalo) return null;

  // --- Util: paginação simples de arrays ---
  const paginate = (arr = [], page = 1, perPage = 10) => {
    const total = arr.length;
    const totalPages = Math.max(1, Math.ceil(total / perPage));
    const p = Math.min(Math.max(page, 1), totalPages);
    const start = (p - 1) * perPage;
    const end = start + perPage;
    return {
      data: arr.slice(start, end),
      total,
      totalPages,
      page: p,
      start: start + 1,
      end: Math.min(end, total),
    };
  };

  // --------- DADOS FIXOS DE SAÚDE (exemplo) ---------
  const SAUDE_FIXA = {
    sinaisVitais: {
      temperatura: "38.5 °C",
      freqCardiaca: "60 bpm",
      freqRespiratoria: "25 mpm",
      ruminacao: "55 min/h",
    },
    avaliacao: {
      escoreCorporal: "3/5",
      escoreLocomocao: "2/5",
      hidratacao: "Normal",
      condicaoPele: "Sem lesões",
    },
    alergias: ["Nenhuma relatada", "—"], // adicione mais para testar paginação
    risco: "Baixo",
    proximaRevisao: "20/01/2025",
    observacoes: [
      "Mucosas róseas, sem secreções.",
      "Apetite preservado, comportamento ativo.",
      "Casco íntegro, sem rachaduras.",
      "Sem alterações respiratórias.",
      "Fezes pastosas, cor normal.",
      "Hidratação adequada.",
    ],
    linhaDoTempo: [
      {
        data: "10/12/2024",
        titulo: "Curativo superficial",
        detalhe: "Região torácica — evolução satisfatória",
        status: "Concluído",
      },
      {
        data: "02/12/2024",
        titulo: "Banho carrapaticida",
        detalhe: "Ivermectina pour-on",
        status: "Concluído",
      },
      {
        data: "25/11/2024",
        titulo: "Hemograma",
        detalhe: "Resultados dentro da normalidade",
        status: "Concluído",
      },
      {
        data: "10/11/2024",
        titulo: "Avaliação clínica",
        detalhe: "Sem achados relevantes",
        status: "Concluído",
      },
      {
        data: "01/11/2024",
        titulo: "Vermifugação",
        detalhe: "Conforme protocolo",
        status: "Concluído",
      },
      {
        data: "20/10/2024",
        titulo: "Vacinação",
        detalhe: "Febre Aftosa",
        status: "Concluído",
      },
    ],
  };
  // ---------------------------------------------------

  return (
    <div
      className="fixed inset-0 z-[1001] flex items-center justify-center bg-black/45 backdrop-blur-sm p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="w-[min(96vw,1200px)] max-h-[92vh] bg-white rounded-2xl shadow-2xl ring-1 ring-gray-200 flex flex-col"
        onClick={stop}
      >
        {/* Header (sticky) */}
        <div className="sticky top-0 z-10 border-b bg-white">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-start gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-2xl font-extrabold tracking-tight text-gray-900">
                    Prontuário • {buffalo.nome}
                  </h2>
                  <span
                    className={`text-xs px-2 py-1 rounded-full uppercase tracking-wide ${getStatusColor(
                      typeof buffalo.status === "boolean" ? (buffalo.status ? "Ativo" : "Inativo") : buffalo.status
                    )}`}
                  >
                    {typeof buffalo.status === "boolean" ? (buffalo.status ? "Ativo" : "Inativo") : buffalo.status}
                  </span>
                </div>
                <p className="text-sm text-gray-500">
                  Tag {buffalo.tag} • {getSexIcon(buffalo.sexo)} {buffalo.sexo}{" "}
                  • {buffalo.raca}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="h-10 w-10 grid place-items-center rounded-xl border border-gray-200 hover:bg-gray-50 text-xl font-bold text-gray-600"
              aria-label="Fechar modal"
            >
              ×
            </button>
          </div>

          {/* Abas */}
          <div className="flex gap-1 px-3 pb-3">
            {[
              { id: "info", label: "Resumo" },
              { id: "zootecnicos", label: "Zootécnicos" },
              { id: "saude", label: "Saúde" },
              { id: "sanitarios", label: "Sanitários" },
              { id: "genealogia", label: "Genealogia" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all border
                  ${
                    activeTab === tab.id
                      ? "bg-amber-50 text-amber-900 border-amber-200 shadow-sm"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-50 border-transparent"
                  }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Conteúdo (rolável apenas aqui) */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* RESUMO */}
          {activeTab === "info" && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <div className="relative rounded-xl border border-gray-200 bg-white">
                  <div className="absolute left-0 top-0 h-full w-1.5 bg-amber-400 rounded-l-xl" />
                  <div className="p-5">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Dados Básicos
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                      <div className="flex justify-between border-b pb-2">
                        <span className="text-gray-500">Nome</span>
                        <span className="font-medium">{buffalo.nome}</span>
                      </div>
                      <div className="flex justify-between border-b pb-2">
                        <span className="text-gray-500">Tag</span>
                        <span className="font-medium">{buffalo.tag}</span>
                      </div>
                      <div className="flex justify-between border-b pb-2">
                        <span className="text-gray-500">Sexo</span>
                        <span className="font-medium">{buffalo.sexo}</span>
                      </div>
                      <div className="flex justify-between border-b pb-2">
                        <span className="text-gray-500">Raça</span>
                        <span className="font-medium">{buffalo.raca}</span>
                      </div>
                      <div className="flex justify-between border-b pb-2">
                        <span className="text-gray-500">Maturidade</span>
                        <span className="font-medium">
                          {buffalo.maturidade}
                        </span>
                      </div>
                      <div className="flex justify-between border-b pb-2">
                        <span className="text-gray-500">Peso Atual</span>
                        <span className="font-medium">{buffalo.peso} kg</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="relative rounded-xl border border-gray-200 bg-white">
                  <div className="absolute left-0 top-0 h-full w-1.5 bg-emerald-400 rounded-l-xl" />
                  <div className="p-5">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Informações Adicionais
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                      <div className="flex justify-between border-b pb-2">
                        <span className="text-gray-500">Nascimento</span>
                        <span className="font-medium">
                          {buffalo.nascimento}
                        </span>
                      </div>
                      <div className="flex justify-between border-b pb-2">
                        <span className="text-gray-500">
                          Última Atualização
                        </span>
                        <span className="font-medium">
                          {buffalo.ultimaAtualizacao}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="rounded-xl border border-gray-200 bg-white p-5">
                  <h3 className="text-sm font-semibold text-gray-700 mb-3">
                    Etiquetas
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-2.5 py-1 rounded-full text-xs bg-amber-100 text-amber-900">
                      Leiteiro
                    </span>
                    <span className="px-2.5 py-1 rounded-full text-xs bg-blue-100 text-blue-900">
                      Dócil
                    </span>
                    <span className="px-2.5 py-1 rounded-full text-xs bg-emerald-100 text-emerald-900">
                      Baixo risco
                    </span>
                  </div>
                </div>
                <div className="rounded-xl border border-gray-200 bg-white p-5">
                  <h3 className="text-sm font-semibold text-gray-700 mb-3">
                    Contatos rápidos
                  </h3>
                  <div className="text-sm text-gray-600 space-y-2">
                    <div className="flex items-center justify-between">
                      <span>Responsável</span>
                      <span className="font-medium">Equipe Fazenda</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Veterinário</span>
                      <span className="font-medium">Dr. Almeida</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ZOOTÉCNICOS */}
          {activeTab === "zootecnicos" && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {(() => {
                const z = getDadosZootecnicos(buffalo);
                return (
                  <>
                    {z.producaoLeite && (
                      <div className="lg:col-span-3 rounded-xl border border-gray-200 bg-white p-5">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">
                          Produção de Leite
                        </h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          {[
                            {
                              v: z.producaoLeite.producaoDiaria,
                              l: "Produção Diária",
                            },
                            {
                              v: z.producaoLeite.producaoMensal,
                              l: "Produção Mensal",
                            },
                            { v: z.producaoLeite.gordura, l: "% Gordura" },
                            { v: z.producaoLeite.proteina, l: "% Proteína" },
                          ].map((it, i) => (
                            <div
                              key={i}
                              className="text-center rounded-lg bg-amber-50 p-4 ring-1 ring-amber-100"
                            >
                              <div className="text-2xl font-extrabold text-amber-900">
                                {it.v}
                              </div>
                              <div className="text-xs text-amber-900/70">
                                {it.l}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="rounded-xl border border-gray-200 bg-white p-5">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        Reprodução
                      </h3>
                      <div className="space-y-3 text-sm">
                        <div className="flex justify-between border-b pb-2">
                          <span className="text-gray-500">Último Cio</span>
                          <span className="font-medium">
                            {z.reproducao.ultimoCio}
                          </span>
                        </div>
                        <div className="flex justify-between border-b pb-2">
                          <span className="text-gray-500">Gestante</span>
                          <span className="font-medium">
                            {z.reproducao.gestante}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">
                            Número de Partos
                          </span>
                          <span className="font-medium">
                            {z.reproducao.numeroPartos}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="rounded-xl border border-gray-200 bg-white p-5">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        Crescimento
                      </h3>
                      <div className="grid grid-cols-2 gap-4 text-center">
                        {[
                          {
                            v: z.crescimento.pesoNascimento,
                            l: "Peso Nascimento",
                          },
                          {
                            v: z.crescimento.ganhoPesoDiario,
                            l: "Ganho Peso/Dia",
                          },
                          { v: z.crescimento.alturaGarupa, l: "Altura Garupa" },
                          {
                            v: z.crescimento.condicaoCorporal,
                            l: "Condição Corporal",
                          },
                        ].map((it, i) => (
                          <div
                            key={i}
                            className="rounded-lg bg-gray-50 p-4 ring-1 ring-gray-100"
                          >
                            <div className="text-2xl font-extrabold text-gray-900">
                              {it.v}
                            </div>
                            <div className="text-xs text-gray-500">{it.l}</div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="rounded-xl border border-gray-200 bg-white p-5">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        Notas
                      </h3>
                      <p className="text-sm text-gray-600">
                        Dados simulados para visualização do prontuário.
                        Integração futura com API do rebanho.
                      </p>
                    </div>
                  </>
                );
              })()}
            </div>
          )}

          {/* SAÚDE — FULL WIDTH (com paginação) */}
          {activeTab === "saude" && (
            <div className="space-y-6">
              {/* Avaliação Clínica */}
              <div className="rounded-2xl border border-gray-200 bg-white p-5">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Avaliação Clínica
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="space-y-3">
                    <div className="flex justify-between border-b pb-2">
                      <span className="text-gray-500">Escore Corporal</span>
                      <span className="font-medium">
                        {SAUDE_FIXA.avaliacao.escoreCorporal}
                      </span>
                    </div>
                    <div className="flex justify-between border-b pb-2">
                      <span className="text-gray-500">Hidratação</span>
                      <span className="font-medium">
                        {SAUDE_FIXA.avaliacao.hidratacao}
                      </span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between border-b pb-2">
                      <span className="text-gray-500">Escore de Locomoção</span>
                      <span className="font-medium">
                        {SAUDE_FIXA.avaliacao.escoreLocomocao}
                      </span>
                    </div>
                    <div className="flex justify-between border-b pb-2">
                      <span className="text-gray-500">Condição da Pele</span>
                      <span className="font-medium">
                        {SAUDE_FIXA.avaliacao.condicaoPele}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Linha do Tempo + paginação */}
              {(() => {
                const { data, total, totalPages, page, start, end } = paginate(
                  SAUDE_FIXA.linhaDoTempo,
                  timelinePage,
                  PER_PAGE_SMALL
                );
                return (
                  <div className="rounded-2xl border border-gray-200 bg-white p-5">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-900">
                        Linha do Tempo
                      </h3>
                      <span className="text-xs text-gray-500">
                        Mostrando {start}-{end} de {total}
                      </span>
                    </div>
                    <div className="relative pl-6">
                      <div className="absolute left-2 top-0 bottom-0 w-px bg-gray-200" />
                      <ul className="space-y-4">
                        {data.map((ev, i) => (
                          <li key={i} className="relative">
                            <span className="absolute left-0 top-1.5 inline-block h-2.5 w-2.5 rounded-full bg-amber-400 ring-4 ring-amber-100" />
                            <div className="rounded-lg border border-gray-200 p-3 bg-white">
                              <div className="flex flex-wrap items-center justify-between gap-2">
                                <div className="font-semibold text-gray-900">
                                  {ev.titulo}
                                </div>
                                <span className="text-xs text-gray-500">
                                  {ev.data}
                                </span>
                              </div>
                              <div className="text-sm text-gray-600">
                                {ev.detalhe}
                              </div>
                              <div className="mt-2">
                                <span className="px-2 py-1 rounded-full text-xs bg-emerald-100 text-emerald-800">
                                  {ev.status}
                                </span>
                              </div>
                            </div>
                          </li>
                        ))}
                      </ul>
                      {totalPages > 1 && (
                        <div className="flex justify-center items-center space-x-2 mt-6">
                          <button
                            onClick={() => setTimelinePage(page - 1)}
                            disabled={page === 1}
                            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                              page === 1
                                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                                : "bg-[#FFCF78] hover:bg-[#F2B84D] text-gray-800"
                            }`}
                          >
                            Anterior
                          </button>
                          {Array.from(
                            { length: totalPages },
                            (_, i) => i + 1
                          ).map((p) => (
                            <button
                              key={p}
                              onClick={() => setTimelinePage(p)}
                              className={`w-10 h-10 rounded-lg font-medium transition-colors ${
                                p === page
                                  ? "bg-[#CE7D0A] text-white"
                                  : "bg-gray-200 hover:bg-[#FFCF78] text-gray-800"
                              }`}
                            >
                              {p}
                            </button>
                          ))}
                          <button
                            onClick={() => setTimelinePage(page + 1)}
                            disabled={page === totalPages}
                            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                              page === totalPages
                                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                                : "bg-[#FFCF78] hover:bg-[#F2B84D] text-gray-800"
                            }`}
                          >
                            Próximo
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })()}

              {/* Observações + paginação */}
              {(() => {
                const { data, total, totalPages, page, start, end } = paginate(
                  SAUDE_FIXA.observacoes,
                  obsPage,
                  PER_PAGE_SMALL
                );
                return (
                  <div className="rounded-2xl border border-gray-200 bg-white p-5">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-900">
                        Observações
                      </h3>
                      <span className="text-xs text-gray-500">
                        Mostrando {start}-{end} de {total}
                      </span>
                    </div>
                    <ul className="list-disc pl-5 space-y-1 text-sm text-gray-700">
                      {data.map((obs, i) => (
                        <li key={i}>{obs}</li>
                      ))}
                    </ul>
                    {totalPages > 1 && (
                      <div className="flex justify-center items-center space-x-2 mt-6">
                        <button
                          onClick={() => setObsPage(page - 1)}
                          disabled={page === 1}
                          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                            page === 1
                              ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                              : "bg-[#FFCF78] hover:bg-[#F2B84D] text-gray-800"
                          }`}
                        >
                          Anterior
                        </button>
                        {Array.from(
                          { length: totalPages },
                          (_, i) => i + 1
                        ).map((p) => (
                          <button
                            key={p}
                            onClick={() => setObsPage(p)}
                            className={`w-10 h-10 rounded-lg font-medium transition-colors ${
                              p === page
                                ? "bg-[#CE7D0A] text-white"
                                : "bg-gray-200 hover:bg-[#FFCF78] text-gray-800"
                            }`}
                          >
                            {p}
                          </button>
                        ))}
                        <button
                          onClick={() => setObsPage(page + 1)}
                          disabled={page === totalPages}
                          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                            page === totalPages
                              ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                              : "bg-[#FFCF78] hover:bg-[#F2B84D] text-gray-800"
                          }`}
                        >
                          Próximo
                        </button>
                      </div>
                    )}
                  </div>
                );
              })()}

              {/* Medicamentos + paginação (tabela zebra padronizada) */}
              {(() => {
                const rows = [
                  {
                    data: "12/12/2024",
                    med: "Ivermectina",
                    dose: "1 mL/50kg",
                    via: "pour-on",
                    status: "Concluído",
                  },
                  {
                    data: "10/12/2024",
                    med: "Antisséptico tópico",
                    dose: "Conforme rótulo",
                    via: "tópica",
                    status: "Concluído",
                  },
                  {
                    data: "01/12/2024",
                    med: "Antibiótico (profilaxia)",
                    dose: "IM 10 mL",
                    via: "intramuscular",
                    status: "Concluído",
                  },
                  {
                    data: "20/11/2024",
                    med: "Anti-inflamatório",
                    dose: "IM 5 mL",
                    via: "intramuscular",
                    status: "Concluído",
                  },
                  {
                    data: "10/11/2024",
                    med: "Vitaminas ADE",
                    dose: "10 mL",
                    via: "subcutânea",
                    status: "Concluído",
                  },
                  {
                    data: "01/11/2024",
                    med: "Probiótico",
                    dose: "Conforme rótulo",
                    via: "oral",
                    status: "Concluído",
                  },
                ];
                const { data, total, totalPages, page, start, end } = paginate(
                  rows,
                  medsPage,
                  PER_PAGE_TABLE
                );
                return (
                  <div className="w-full flex flex-col bg-white rounded-xl p-5 gap-4 box-border border border-[#e0e0e0] shadow-sm">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-gray-900">
                        Medicamentos Recentes
                      </h3>
                      <span className="text-xs text-gray-500">
                        Mostrando {start}-{end} de {total}
                      </span>
                    </div>
                    <table className="w-full border-collapse bg-white rounded-lg overflow-hidden shadow-sm">
                      <thead className="bg-[#f0f0f0]">
                        <tr>
                          <th className="p-3 text-left font-medium text-gray-800 text-sm">
                            Data
                          </th>
                          <th className="p-3 text-left font-medium text-gray-800 text-sm">
                            Medicamento
                          </th>
                          <th className="p-3 text-left font-medium text-gray-800 text-sm">
                            Dose
                          </th>
                          <th className="p-3 text-left font-medium text-gray-800 text-sm">
                            Via
                          </th>
                          <th className="p-3 text-left font-medium text-gray-800 text-sm">
                            Status
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {data.map((r, i) => (
                          <tr
                            key={i}
                            className="odd:bg-white even:bg-[#fafafa] hover:bg-gray-50"
                          >
                            <td className="p-3 text-gray-800 text-sm">
                              {r.data}
                            </td>
                            <td className="p-3 text-gray-800 text-sm">
                              {r.med}
                            </td>
                            <td className="p-3 text-gray-800 text-sm">
                              {r.dose}
                            </td>
                            <td className="p-3 text-gray-800 text-sm">
                              {r.via}
                            </td>
                            <td className="p-3 text-gray-800 text-sm">
                              <span className="px-2.5 py-1.5 rounded-full text-xs font-bold inline-block bg-emerald-100 text-emerald-800">
                                {r.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {totalPages > 1 && (
                      <div className="flex justify-center items-center space-x-2">
                        <button
                          onClick={() => setMedsPage(page - 1)}
                          disabled={page === 1}
                          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                            page === 1
                              ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                              : "bg-[#FFCF78] hover:bg-[#F2B84D] text-gray-800"
                          }`}
                        >
                          Anterior
                        </button>
                        {Array.from(
                          { length: totalPages },
                          (_, i) => i + 1
                        ).map((p) => (
                          <button
                            key={p}
                            onClick={() => setMedsPage(p)}
                            className={`w-10 h-10 rounded-lg font-medium transition-colors ${
                              p === page
                                ? "bg-[#CE7D0A] text-white"
                                : "bg-gray-200 hover:bg-[#FFCF78] text-gray-800"
                            }`}
                          >
                            {p}
                          </button>
                        ))}
                        <button
                          onClick={() => setMedsPage(page + 1)}
                          disabled={page === totalPages}
                          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                            page === totalPages
                              ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                              : "bg-[#FFCF78] hover:bg-[#F2B84D] text-gray-800"
                          }`}
                        >
                          Próximo
                        </button>
                      </div>
                    )}
                  </div>
                );
              })()}

              {/* Procedimentos + paginação */}
              {(() => {
                const rows = [
                  {
                    data: "10/12/2024",
                    proc: "Curativo",
                    resp: "Téc. João",
                    obs: "Troca de curativo; sem exsudato",
                  },
                  {
                    data: "25/11/2024",
                    proc: "Coleta de sangue",
                    resp: "Dr. Almeida",
                    obs: "Hemograma OK",
                  },
                  {
                    data: "20/11/2024",
                    proc: "Exame físico",
                    resp: "Dr. Almeida",
                    obs: "Sem alterações",
                  },
                  {
                    data: "10/11/2024",
                    proc: "Casqueamento",
                    resp: "Equipe Fazenda",
                    obs: "Rotina",
                  },
                ];
                const { data, total, totalPages, page, start, end } = paginate(
                  rows,
                  procsPage,
                  PER_PAGE_TABLE
                );
                return (
                  <div className="w-full flex flex-col bg-white rounded-xl p-5 gap-4 box-border border border-[#e0e0e0] shadow-sm">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-gray-900">
                        Procedimentos
                      </h3>
                      <span className="text-xs text-gray-500">
                        Mostrando {start}-{end} de {total}
                      </span>
                    </div>
                    <table className="w-full border-collapse bg-white rounded-lg overflow-hidden shadow-sm">
                      <thead className="bg-[#f0f0f0]">
                        <tr>
                          <th className="p-3 text-left font-medium text-gray-800 text-sm">
                            Data
                          </th>
                          <th className="p-3 text-left font-medium text-gray-800 text-sm">
                            Procedimento
                          </th>
                          <th className="p-3 text-left font-medium text-gray-800 text-sm">
                            Responsável
                          </th>
                          <th className="p-3 text-left font-medium text-gray-800 text-sm">
                            Observações
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {data.map((r, i) => (
                          <tr
                            key={i}
                            className="odd:bg-white even:bg-[#fafafa] hover:bg-gray-50"
                          >
                            <td className="p-3 text-gray-800 text-sm">
                              {r.data}
                            </td>
                            <td className="p-3 text-gray-800 text-sm">
                              {r.proc}
                            </td>
                            <td className="p-3 text-gray-800 text-sm">
                              {r.resp}
                            </td>
                            <td className="p-3 text-gray-800 text-sm">
                              {r.obs}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {totalPages > 1 && (
                      <div className="flex justify-center items-center space-x-2">
                        <button
                          onClick={() => setProcsPage(page - 1)}
                          disabled={page === 1}
                          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                            page === 1
                              ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                              : "bg-[#FFCF78] hover:bg-[#F2B84D] text-gray-800"
                          }`}
                        >
                          Anterior
                        </button>
                        {Array.from(
                          { length: totalPages },
                          (_, i) => i + 1
                        ).map((p) => (
                          <button
                            key={p}
                            onClick={() => setProcsPage(p)}
                            className={`w-10 h-10 rounded-lg font-medium transition-colors ${
                              p === page
                                ? "bg-[#CE7D0A] text-white"
                                : "bg-gray-200 hover:bg-[#FFCF78] text-gray-800"
                            }`}
                          >
                            {p}
                          </button>
                        ))}
                        <button
                          onClick={() => setProcsPage(page + 1)}
                          disabled={page === totalPages}
                          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                            page === totalPages
                              ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                              : "bg-[#FFCF78] hover:bg-[#F2B84D] text-gray-800"
                          }`}
                        >
                          Próximo
                        </button>
                      </div>
                    )}
                  </div>
                );
              })()}
            </div>
          )}

          {/* SANITÁRIOS — FULL WIDTH (com paginação) */}
          {activeTab === "sanitarios" && (
            <div className="space-y-6">
              {(() => {
                const s = getDadosSanitarios(buffalo);

                // Vacinação
                const vac = paginate(s.vacinacao, vacPage, PER_PAGE_TABLE);
                // Vermifugação
                const verm = paginate(s.vermifugacao, vermPage, PER_PAGE_TABLE);
                // Exames
                const ex = paginate(s.exames, examsPage, PER_PAGE_TABLE);
                // Tratamentos
                const tr = paginate(s.tratamentos, tratPage, PER_PAGE_TABLE);

                return (
                  <>
                    {/* Vacinação */}
                    <div className="w-full flex flex-col bg-white rounded-xl p-5 gap-4 box-border border border-[#e0e0e0] shadow-sm">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-gray-900">
                          Histórico de Vacinação
                        </h3>
                        <span className="text-xs text-gray-500">
                          Mostrando {vac.start}-{vac.end} de {vac.total}
                        </span>
                      </div>
                      <table className="w-full border-collapse bg-white rounded-lg overflow-hidden shadow-sm">
                        <thead className="bg-[#f0f0f0]">
                          <tr>
                            <th className="p-3 text-left font-medium text-gray-800 text-sm">
                              Vacina
                            </th>
                            <th className="p-3 text-left font-medium text-gray-800 text-sm">
                              Última
                            </th>
                            <th className="p-3 text-left font-medium text-gray-800 text-sm">
                              Próxima
                            </th>
                            <th className="p-3 text-left font-medium text-gray-800 text-sm">
                              Status
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {vac.data.map((v, i) => (
                            <tr
                              key={i}
                              className="odd:bg-white even:bg-[#fafafa] hover:bg-gray-50"
                            >
                              <td className="p-3 text-gray-800 text-sm">
                                <strong>{v.vacina}</strong>
                              </td>
                              <td className="p-3 text-gray-800 text-sm">
                                {v.data}
                              </td>
                              <td className="p-3 text-gray-800 text-sm">
                                {v.proxima}
                              </td>
                              <td className="p-3 text-gray-800 text-sm">
                                <span className="px-2.5 py-1.5 rounded-full text-xs font-bold inline-block bg-emerald-100 text-emerald-800">
                                  {v.status}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      {vac.totalPages > 1 && (
                        <div className="flex justify-center items-center space-x-2">
                          <button
                            onClick={() => setVacPage(vac.page - 1)}
                            disabled={vac.page === 1}
                            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                              vac.page === 1
                                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                                : "bg-[#FFCF78] hover:bg-[#F2B84D] text-gray-800"
                            }`}
                          >
                            Anterior
                          </button>
                          {Array.from(
                            { length: vac.totalPages },
                            (_, i) => i + 1
                          ).map((p) => (
                            <button
                              key={p}
                              onClick={() => setVacPage(p)}
                              className={`w-10 h-10 rounded-lg font-medium transition-colors ${
                                p === vac.page
                                  ? "bg-[#CE7D0A] text-white"
                                  : "bg-gray-200 hover:bg-[#FFCF78] text-gray-800"
                              }`}
                            >
                              {p}
                            </button>
                          ))}
                          <button
                            onClick={() => setVacPage(vac.page + 1)}
                            disabled={vac.page === vac.totalPages}
                            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                              vac.page === vac.totalPages
                                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                                : "bg-[#FFCF78] hover:bg-[#F2B84D] text-gray-800"
                            }`}
                          >
                            Próximo
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Vermifugação */}
                    <div className="w-full flex flex-col bg-white rounded-xl p-5 gap-4 box-border border border-[#e0e0e0] shadow-sm">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-gray-900">
                          Controle de Vermifugação
                        </h3>
                        <span className="text-xs text-gray-500">
                          Mostrando {verm.start}-{verm.end} de {verm.total}
                        </span>
                      </div>
                      <table className="w-full border-collapse bg-white rounded-lg overflow-hidden shadow-sm">
                        <thead className="bg-[#f0f0f0]">
                          <tr>
                            <th className="p-3 text-left font-medium text-gray-800 text-sm">
                              Produto
                            </th>
                            <th className="p-3 text-left font-medium text-gray-800 text-sm">
                              Última
                            </th>
                            <th className="p-3 text-left font-medium text-gray-800 text-sm">
                              Próxima
                            </th>
                            <th className="p-3 text-left font-medium text-gray-800 text-sm">
                              Status
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {verm.data.map((v, i) => (
                            <tr
                              key={i}
                              className="odd:bg-white even:bg-[#fafafa] hover:bg-gray-50"
                            >
                              <td className="p-3 text-gray-800 text-sm">
                                <strong>{v.produto}</strong>
                              </td>
                              <td className="p-3 text-gray-800 text-sm">
                                {v.data}
                              </td>
                              <td className="p-3 text-gray-800 text-sm">
                                {v.proxima}
                              </td>
                              <td className="p-3 text-gray-800 text-sm">
                                <span
                                  className={`px-2.5 py-1.5 rounded-full text-xs font-bold inline-block ${
                                    v.status === "Em dia"
                                      ? "bg-emerald-100 text-emerald-800"
                                      : "bg-red-100 text-red-800"
                                  }`}
                                >
                                  {v.status}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      {verm.totalPages > 1 && (
                        <div className="flex justify-center items-center space-x-2">
                          <button
                            onClick={() => setVermPage(verm.page - 1)}
                            disabled={verm.page === 1}
                            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                              verm.page === 1
                                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                                : "bg-[#FFCF78] hover:bg-[#F2B84D] text-gray-800"
                            }`}
                          >
                            Anterior
                          </button>
                          {Array.from(
                            { length: verm.totalPages },
                            (_, i) => i + 1
                          ).map((p) => (
                            <button
                              key={p}
                              onClick={() => setVermPage(p)}
                              className={`w-10 h-10 rounded-lg font-medium transition-colors ${
                                p === verm.page
                                  ? "bg-[#CE7D0A] text-white"
                                  : "bg-gray-200 hover:bg-[#FFCF78] text-gray-800"
                              }`}
                            >
                              {p}
                            </button>
                          ))}
                          <button
                            onClick={() => setVermPage(verm.page + 1)}
                            disabled={verm.page === verm.totalPages}
                            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                              verm.page === verm.totalPages
                                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                                : "bg-[#FFCF78] hover:bg-[#F2B84D] text-gray-800"
                            }`}
                          >
                            Próximo
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Exames */}
                    <div className="w-full flex flex-col bg-white rounded-xl p-5 gap-4 box-border border border-[#e0e0e0] shadow-sm">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-gray-900">
                          Histórico de Exames
                        </h3>
                        <span className="text-xs text-gray-500">
                          Mostrando {ex.start}-{ex.end} de {ex.total}
                        </span>
                      </div>
                      <table className="w-full border-collapse bg-white rounded-lg overflow-hidden shadow-sm">
                        <thead className="bg-[#f0f0f0]">
                          <tr>
                            <th className="p-3 text-left font-medium text-gray-800 text-sm">
                              Exame
                            </th>
                            <th className="p-3 text-left font-medium text-gray-800 text-sm">
                              Data
                            </th>
                            <th className="p-3 text-left font-medium text-gray-800 text-sm">
                              Resultado
                            </th>
                            <th className="p-3 text-left font-medium text-gray-800 text-sm">
                              Status
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {ex.data.map((e, i) => (
                            <tr
                              key={i}
                              className="odd:bg-white even:bg-[#fafafa] hover:bg-gray-50"
                            >
                              <td className="p-3 text-gray-800 text-sm">
                                <strong>{e.exame}</strong>
                              </td>
                              <td className="p-3 text-gray-800 text-sm">
                                {e.data}
                              </td>
                              <td className="p-3 text-gray-800 text-sm">
                                {e.resultado}
                              </td>
                              <td className="p-3 text-gray-800 text-sm">
                                <span className="px-2.5 py-1.5 rounded-full text-xs font-bold inline-block bg-emerald-100 text-emerald-800">
                                  {e.status}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      {ex.totalPages > 1 && (
                        <div className="flex justify-center items-center space-x-2">
                          <button
                            onClick={() => setExamsPage(ex.page - 1)}
                            disabled={ex.page === 1}
                            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                              ex.page === 1
                                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                                : "bg-[#FFCF78] hover:bg-[#F2B84D] text-gray-800"
                            }`}
                          >
                            Anterior
                          </button>
                          {Array.from(
                            { length: ex.totalPages },
                            (_, i) => i + 1
                          ).map((p) => (
                            <button
                              key={p}
                              onClick={() => setExamsPage(p)}
                              className={`w-10 h-10 rounded-lg font-medium transition-colors ${
                                p === ex.page
                                  ? "bg-[#CE7D0A] text-white"
                                  : "bg-gray-200 hover:bg-[#FFCF78] text-gray-800"
                              }`}
                            >
                              {p}
                            </button>
                          ))}
                          <button
                            onClick={() => setExamsPage(ex.page + 1)}
                            disabled={ex.page === ex.totalPages}
                            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                              ex.page === ex.totalPages
                                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                                : "bg-[#FFCF78] hover:bg-[#F2B84D] text-gray-800"
                            }`}
                          >
                            Próximo
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Tratamentos */}
                    {s.tratamentos.length > 0 && (
                      <div className="w-full flex flex-col bg-white rounded-xl p-5 gap-4 box-border border border-[#e0e0e0] shadow-sm">
                        <div className="flex items-center justify-between">
                          <h3 className="text-lg font-semibold text-gray-900">
                            Tratamentos em Andamento
                          </h3>
                          <span className="text-xs text-gray-500">
                            Mostrando {tr.start}-{tr.end} de {tr.total}
                          </span>
                        </div>
                        <table className="w-full border-collapse bg-white rounded-lg overflow-hidden shadow-sm">
                          <thead className="bg-[#f0f0f0]">
                            <tr>
                              <th className="p-3 text-left font-medium text-gray-800 text-sm">
                                Tratamento
                              </th>
                              <th className="p-3 text-left font-medium text-gray-800 text-sm">
                                Início
                              </th>
                              <th className="p-3 text-left font-medium text-gray-800 text-sm">
                                Fim
                              </th>
                              <th className="p-3 text-left font-medium text-gray-800 text-sm">
                                Status
                              </th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-200">
                            {tr.data.map((t, i) => (
                              <tr
                                key={i}
                                className="odd:bg-white even:bg-[#fafafa] hover:bg-gray-50"
                              >
                                <td className="p-3 text-gray-800 text-sm">
                                  <strong>{t.tratamento}</strong>
                                </td>
                                <td className="p-3 text-gray-800 text-sm">
                                  {t.inicio}
                                </td>
                                <td className="p-3 text-gray-800 text-sm">
                                  {t.fim}
                                </td>
                                <td className="p-3 text-gray-800 text-sm">
                                  <span className="px-2.5 py-1.5 rounded-full text-xs font-bold inline-block bg-amber-100 text-amber-800">
                                    {t.status}
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                        {tr.totalPages > 1 && (
                          <div className="flex justify-center items-center space-x-2">
                            <button
                              onClick={() => setTratPage(tr.page - 1)}
                              disabled={tr.page === 1}
                              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                                tr.page === 1
                                  ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                                  : "bg-[#FFCF78] hover:bg-[#F2B84D] text-gray-800"
                              }`}
                            >
                              Anterior
                            </button>
                            {Array.from(
                              { length: tr.totalPages },
                              (_, i) => i + 1
                            ).map((p) => (
                              <button
                                key={p}
                                onClick={() => setTratPage(p)}
                                className={`w-10 h-10 rounded-lg font-medium transition-colors ${
                                  p === tr.page
                                    ? "bg-[#CE7D0A] text-white"
                                    : "bg-gray-200 hover:bg-[#FFCF78] text-gray-800"
                                }`}
                              >
                                {p}
                              </button>
                            ))}
                            <button
                              onClick={() => setTratPage(tr.page + 1)}
                              disabled={tr.page === tr.totalPages}
                              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                                tr.page === tr.totalPages
                                  ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                                  : "bg-[#FFCF78] hover:bg-[#F2B84D] text-gray-800"
                              }`}
                            >
                              Próximo
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </>
                );
              })()}
            </div>
          )}

          {/* GENEALOGIA (descendentes com paginação) */}
          {activeTab === "genealogia" && (
            <div className="space-y-6">
              <div className="rounded-2xl border border-gray-200 bg-white p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      Árvore Genealógica
                    </h3>
                    <p className="text-sm text-gray-500">
                      {buffalo.nome} • 3 gerações
                      <span className="ml-2 inline-flex items-center rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-semibold text-emerald-700">
                        Consanguinidade: 12%
                      </span>
                    </p>
                  </div>
                </div>

                {/* GenealogyTree recebe o búfalo atual e dados básicos dos antepassados */}
                <GenealogyTree
                  current={{
                    nome: buffalo.nome,
                    tag: buffalo.tag,
                    raca: buffalo.raca,
                    maturidade: buffalo.maturidade,
                    sexo: buffalo.sexo,
                  }}
                  parents={{
                    pai: {
                      nome: buffalo.pai || "—",
                      raca: buffalo.raca || "—",
                      prod: "3.200L",
                      risk: "low",
                    },
                    mae: {
                      nome: buffalo.mae || "—",
                      raca: buffalo.raca || "—",
                      prod: "2.950L",
                      risk: "med",
                    },
                  }}
                  grandparents={{
                    avoPai: {
                      nome: "Titã",
                      raca: "Murrah",
                      prod: "2.950L",
                      risk: "low",
                    },
                    avoPaiF: {
                      nome: "Vitória",
                      raca: "Murrah",
                      prod: "3.100L",
                      risk: "low",
                    },
                    avoMae: {
                      nome: "Magnus",
                      raca: "Híbrido",
                      prod: "2.800L",
                      risk: "med",
                    },
                    avoMaeF: {
                      nome: "Ísis",
                      raca: "Jafarabadi",
                      prod: "2.650L",
                      risk: "low",
                    },
                  }}
                  greatGrandparents={{
                    bisavoP1: { nome: "Brutus", raca: "Murrah", risk: "low" },
                    bisavoP2: { nome: "Dalila", raca: "Murrah", risk: "low" },
                    bisavoM1: {
                      nome: "César",
                      raca: "Jafarabadi",
                      risk: "low",
                    },
                    bisavoM2: { nome: "Lara", raca: "Jafarabadi", risk: "low" },
                  }}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
