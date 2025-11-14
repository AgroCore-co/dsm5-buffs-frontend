"use client";

import React, { useEffect, useState } from "react";
import grupoService from "@/services/grupoService";

export default function GrupoDetalhesModal({ open, onClose, grupo }) {
  const [grupoInfo, setGrupoInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (open && grupo) {
      setLoading(true);
      setError("");
      grupoService.buscarGrupoPorId(grupo.id_grupo ?? grupo.id ?? grupo._id)
        .then(data => setGrupoInfo(data))
        .catch(() => setError("Erro ao buscar informações do grupo."))
        .finally(() => setLoading(false));
    } else {
      setGrupoInfo(null);
    }
  }, [open, grupo]);

  if (!open || !grupo) return null;

  return (
    <div className="fixed inset-0 z-[1001] flex items-center justify-center bg-black/45 backdrop-blur-sm p-4" role="dialog" aria-modal="true">
      <div className="w-[min(96vw,1200px)] max-h-[95vh] bg-white rounded-3xl shadow-2xl ring-1 ring-gray-200 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="sticky top-0 z-10 border-b bg-white rounded-t-3xl">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-start gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-2xl font-extrabold tracking-tight text-gray-900">
                    Grupo • {typeof (grupoInfo?.nome_grupo ?? grupo.nome_grupo) === 'object' ? JSON.stringify(grupoInfo?.nome_grupo ?? grupo.nome_grupo) : (grupoInfo?.nome_grupo ?? grupo.nome_grupo)}
                  </h2>
                  <span className="text-xs px-2 py-1 rounded-full uppercase tracking-wide bg-yellow-100 text-yellow-800">
                    {typeof (grupoInfo?.nivel_maturidade ?? grupo.nivel_maturidade ?? "-") === 'object' ? JSON.stringify(grupoInfo?.nivel_maturidade ?? grupo.nivel_maturidade ?? "-") : (grupoInfo?.nivel_maturidade ?? grupo.nivel_maturidade ?? "-")}
                  </span>
                </div>
                <p className="text-sm text-gray-500">
                  ID: {typeof (grupoInfo?.id_grupo ?? grupo.id_grupo ?? grupo.id ?? grupo._id) === 'object' ? JSON.stringify(grupoInfo?.id_grupo ?? grupo.id_grupo ?? grupo.id ?? grupo._id) : (grupoInfo?.id_grupo ?? grupo.id_grupo ?? grupo.id ?? grupo._id)}
                  {' • Propriedade: '}
                  {typeof (grupoInfo?.id_propriedade ?? grupo.id_propriedade ?? "-") === 'object' ? JSON.stringify(grupoInfo?.id_propriedade ?? grupo.id_propriedade ?? "-") : (grupoInfo?.id_propriedade ?? grupo.id_propriedade ?? "-")}
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
        </div>
        {/* Conteúdo */}
        <div className="flex-1 p-6 min-h-[700px] max-h-[700px] overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center h-full text-gray-500">Carregando informações...</div>
          ) : error ? (
            <div className="flex items-center justify-center h-full text-red-500">{error}</div>
          ) : grupoInfo ? (
            <div className="max-w-5xl mx-auto">
              <div className="relative rounded-xl border border-gray-200 bg-white shadow-sm mb-6">
                <div className="absolute left-0 top-0 h-full w-1.5 bg-[#FEF048] rounded-l-xl" />
                <div className="p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <span className="inline-block w-5 h-5 rounded-full border" style={{ background: grupoInfo.color ?? '#eee' }} />
                    {typeof grupoInfo.nome_grupo === 'object' ? JSON.stringify(grupoInfo.nome_grupo) : grupoInfo.nome_grupo}
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5">
                    <div className="bg-gradient-to-br from-yellow-50 to-yellow-100/50 p-4 rounded-lg border border-yellow-200 hover:shadow-md transition-shadow">
                      <span className="text-xs font-semibold text-yellow-700 uppercase tracking-wide">ID do Grupo</span>
                      <p className="text-lg font-bold text-gray-900 mt-1 break-all">{typeof grupoInfo.id_grupo === 'object' ? JSON.stringify(grupoInfo.id_grupo) : grupoInfo.id_grupo}</p>
                    </div>
                    <div className="bg-gradient-to-br from-gray-50 to-gray-100/50 p-4 rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
                      <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Nível de Maturidade</span>
                      <p className="text-lg font-bold text-gray-900 mt-1">{typeof grupoInfo.nivel_maturidade === 'object' ? JSON.stringify(grupoInfo.nivel_maturidade) : (grupoInfo.nivel_maturidade ?? '-')}</p>
                    </div>
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 p-4 rounded-lg border border-blue-200 hover:shadow-md transition-shadow">
                      <span className="text-xs font-semibold text-blue-700 uppercase tracking-wide">ID Propriedade</span>
                      <p className="text-lg font-bold text-blue-900 mt-1 break-all">{typeof grupoInfo.id_propriedade === 'object' ? JSON.stringify(grupoInfo.id_propriedade) : (grupoInfo.id_propriedade ?? '-')}</p>
                    </div>
                  </div>

                  {/* Detalhes do Grupo */}
                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <h4 className="text-sm font-semibold text-gray-700 mb-3">Informações Detalhadas</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-6">
                      <div className="flex items-start gap-3">
                        <div className="w-1.5 h-1.5 bg-[#FEF048] rounded-full mt-2"></div>
                        <div className="flex-1">
                          <span className="text-xs font-medium text-gray-500 block">Cor</span>
                          <span className="text-sm font-semibold text-gray-900">{typeof grupoInfo.color === 'object' ? JSON.stringify(grupoInfo.color) : (grupoInfo.color ?? '-')}</span>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-1.5 h-1.5 bg-[#FEF048] rounded-full mt-2"></div>
                        <div className="flex-1">
                          <span className="text-xs font-medium text-gray-500 block">Criado em</span>
                          <span className="text-sm font-semibold text-gray-900">{typeof grupoInfo.created_at === 'object' ? JSON.stringify(grupoInfo.created_at) : (grupoInfo.created_at ?? '-')}</span>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-1.5 h-1.5 bg-[#FEF048] rounded-full mt-2"></div>
                        <div className="flex-1">
                          <span className="text-xs font-medium text-gray-500 block">Atualizado em</span>
                          <span className="text-sm font-semibold text-gray-900">{typeof grupoInfo.updated_at === 'object' ? JSON.stringify(grupoInfo.updated_at) : (grupoInfo.updated_at ?? '-')}</span>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-1.5 h-1.5 bg-[#FEF048] rounded-full mt-2"></div>
                        <div className="flex-1">
                          <span className="text-xs font-medium text-gray-500 block">Deletado em</span>
                          <span className="text-sm font-semibold text-gray-900">{typeof grupoInfo.deleted_at === 'object' ? JSON.stringify(grupoInfo.deleted_at) : (grupoInfo.deleted_at ?? 'Não deletado')}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500">Nenhuma informação encontrada.</div>
          )}
        </div>
      </div>
    </div>
  );
}
