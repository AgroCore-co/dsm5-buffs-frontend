import React from "react";

export default function ResumoTab({ bufaloData, propriedades }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
      <div className="lg:col-span-2 space-y-6">
        <div className="relative rounded-xl border border-gray-200 bg-white">
          <div className="absolute left-0 top-0 h-full w-1.5 bg-amber-400 rounded-l-xl" />
          <div className="p-5">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Dados Básicos
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <p>ID: {bufaloData.id_bufalo}</p>
              <p>Nome: {bufaloData.nome}</p>
              <p>Brinco: {bufaloData.brinco}</p>
              <p>Sexo: {bufaloData.sexo === "F" ? "Fêmea" : "Macho"}</p>
              <p>Raça: {bufaloData.raca?.nome || "-"}</p>
              <p>Maturidade: {bufaloData.nivel_maturidade}</p>
              <p>Categoria: {bufaloData.categoria}</p>
              <p>Status: {bufaloData.status ? "Ativo" : "Inativo"}</p>
              <p>Nascimento: {new Date(bufaloData.dt_nascimento).toLocaleDateString("pt-BR")}</p>
              <p>Origem: {bufaloData.origem}</p>
            </div>
          </div>
        </div>
        <div className="relative rounded-xl border border-gray-200 bg-white">
          <div className="absolute left-0 top-0 h-full w-1.5 bg-purple-400 rounded-l-xl" />
          <div className="p-5">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Dados Complementares
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <p>Data de Baixa: {bufaloData.data_baixa || "-"}</p>
              <p>Motivo Inativo: {bufaloData.motivo_inativo || "-"}</p>
              <p>Brinco Original: {bufaloData.brinco_original}</p>
              <p>Registro Provisório: {bufaloData.registro_prov}</p>
            </div>
          </div>
        </div>
      </div>
      <div className="lg:col-span-1 space-y-6">
        <div className="relative rounded-xl border border-gray-200 bg-white">
          <div className="absolute left-0 top-0 h-full w-1.5 bg-blue-400 rounded-l-xl" />
          <div className="p-5">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Informações do Sistema
            </h3>
            <div className="grid grid-cols-1 gap-4 text-sm">
              <p>Raça: {bufaloData.raca?.nome || "-"}</p>
              <p>Propriedade: {propriedades?.[0]?.nome || bufaloData.id_propriedade || "-"}</p>
              <p>ID Grupo: {bufaloData.id_grupo || "-"}</p>
              <p>Criado em: {new Date(bufaloData.created_at).toLocaleDateString("pt-BR")}</p>
              <p>Última Atualização: {new Date(bufaloData.updated_at).toLocaleDateString("pt-BR")}</p>
            </div>
          </div>
        </div>
        <div className="relative rounded-xl border border-gray-200 bg-white">
          <div className="absolute left-0 top-0 h-full w-1.5 bg-emerald-400 rounded-l-xl" />
          <div className="p-5">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Informações de Genealogia
            </h3>
            <div className="grid grid-cols-1 gap-4 text-sm">
              <p>ID do Pai: {bufaloData.id_pai || "-"}</p>
              <p>ID da Mãe: {bufaloData.id_mae || "-"}</p>
              <p>Registro Definitivo: {bufaloData.registro_def || "-"}</p>
              <p>Microchip: {bufaloData.microchip || "-"}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}