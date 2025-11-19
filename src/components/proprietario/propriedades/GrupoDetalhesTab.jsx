import React, { useEffect, useState } from "react";
import movLoteService from "@/services/movLoteService";
import loteService from "@/services/loteService";
import bufaloService from "@/services/bufaloService";

function formatDate(dateStr) {
  if (!dateStr) return "-";
  const d = new Date(dateStr);
  return d.toLocaleDateString("pt-BR");
}

export default function GrupoDetalhesTab({ grupoInfo }) {
  const [statusAtual, setStatusAtual] = useState(null);
  const [historico, setHistorico] = useState([]);
  const [loteAtualInfo, setLoteAtualInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  // Novo: buscar quantidade de búfalos ativos no grupo
  const [totalBufalosGrupo, setTotalBufalosGrupo] = useState(null);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const status = await movLoteService.verificarStatusGrupo(
          grupoInfo.id_grupo ?? grupoInfo.id
        );
        setStatusAtual(status.localizacao_atual || null);
        const hist = await movLoteService.buscarHistoricoGrupo(
          grupoInfo.id_grupo ?? grupoInfo.id
        );
        setHistorico(hist.historico || []);
        // Busca nome do lote atual
        if (status.localizacao_atual?.id_lote) {
          const lote = await loteService.buscarLotePorId(
            status.localizacao_atual.id_lote
          );
          setLoteAtualInfo(lote);
        } else {
          setLoteAtualInfo(null);
        }
      } catch (e) {
        setStatusAtual(null);
        setHistorico([]);
        setLoteAtualInfo(null);
      } finally {
        setLoading(false);
      }
    }
    if (grupoInfo?.id_grupo || grupoInfo?.id) fetchData();
  }, [grupoInfo]);

  useEffect(() => {
    async function fetchTotalBufalosGrupo() {
      if (grupoInfo?.id_grupo) {
        try {
          const res = await bufaloService.listarBufalosPorGrupo(grupoInfo.id_grupo, 1, 1);
          setTotalBufalosGrupo(res.meta?.total ?? null);
        } catch (e) {
          setTotalBufalosGrupo(null);
        }
      } else {
        setTotalBufalosGrupo(null);
      }
    }
    fetchTotalBufalosGrupo();
  }, [grupoInfo]);

  // Status visual
  const status = grupoInfo.deleted_at
    ? { label: "Removido", color: "text-red-600", bg: "bg-red-100" }
    : statusAtual?.id_lote
    ? { label: "Alocado", color: "text-green-600", bg: "bg-green-100" }
    : { label: "Sem lote", color: "text-amber-600", bg: "bg-amber-100" };

  // Cards estatísticos
  const totalAnimais = grupoInfo.total_animais ?? 0;
  // Lote atual: busca pelo nome, descrição e status
  const loteAtualNome = loteAtualInfo?.nome_lote ?? "Não alocado";
  const loteAtualDescricao = loteAtualInfo?.descricao ?? "";
  const loteAtualStatus = loteAtualInfo?.status ?? "";
  const diasNoLote = statusAtual?.dias_no_local ?? "-";
  const totalMovs = historico.length;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 auto-rows-min h-full">
      {/* ===== CARD PRINCIPAL ===== */}
      <div className="lg:col-span-2 space-y-6">
        {/* Dados Básicos */}
        <div className="relative rounded-xl border border-gray-200 bg-white">
          <div className="p-5">
            

            {/* Título */}
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Dados Básicos
            </h3>

            {/* Informações Básicas */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4 text-sm mb-6">
              <p>
                <span className="font-medium text-gray-700">Nome:</span>{" "}
                {grupoInfo.nome_grupo ?? "-"}
              </p>
              <p>
                <span className="font-medium text-gray-700">Cor:</span>{" "}
                {grupoInfo.color ?? "-"}
              </p>
              <p>
                <span className="font-medium text-gray-700">
                  Total de Animais:
                </span>{" "}
                {totalBufalosGrupo !== null ? totalBufalosGrupo : "-"}
              </p>
            </div>

            {/* Estatísticas Rápidas */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-blue-50 p-3 rounded-lg text-center">
                <p className="text-xl font-bold text-blue-700">
                  {loteAtualNome}
                </p>
                <p className="text-xs text-gray-600">{loteAtualDescricao}</p>
                <span
                  className={`text-xs px-2 py-1 rounded-full inline-block mt-1 ${
                    loteAtualStatus === "ativo"
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-100 text-gray-700"
                  }`}
                >
                  {loteAtualStatus === "ativo" ? "Ativo" : "Inativo"}
                </span>
              </div>

              <div className="bg-green-50 p-3 rounded-lg text-center">
                <p className="text-2xl font-bold text-green-700">
                  {diasNoLote}
                </p>
                <p className="text-xs text-gray-600">Dia(s) no Lote</p>
              </div>

              <div className="bg-amber-50 p-3 rounded-lg text-center">
                <p className="text-2xl font-bold text-amber-700">{totalMovs}</p>
                <p className="text-xs text-gray-600">Movimentações</p>
              </div>
            </div>
          </div>
        </div>

        {/* Localização Atual */}
        <div className="relative rounded-xl border border-gray-200 bg-white">
          <div className="absolute left-0 top-0 h-full w-1.5 bg-green-400 rounded-l-xl" />
          <div className="p-5">
            <h3 className="text-lg font-semibold text-green-700 mb-4 flex items-center gap-2">
              Localização Atual
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4 text-sm">
              <p>
                <span className="font-medium text-gray-700">Lote Atual:</span>{" "}
                {loteAtualNome}
              </p>
              <p>
                <span className="font-medium text-gray-700">Desde:</span>{" "}
                {statusAtual?.desde ? formatDate(statusAtual.desde) : "-"}
              </p>
              {loteAtualDescricao && (
                <p>
                  <span className="font-medium text-gray-700">Descrição:</span>{" "}
                  {loteAtualDescricao}
                </p>
              )}
              <p>
                <span className="font-medium text-gray-700">
                  Status do Lote:
                </span>{" "}
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    loteAtualStatus === "ativo"
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-100 text-gray-700"
                  }`}
                >
                  {loteAtualStatus === "ativo" ? "Ativo" : "Inativo"}
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* Últimos Movimentos */}
        <div className="relative rounded-xl border border-gray-200 bg-white">
          <div className="absolute left-0 top-0 h-full w-1.5 bg-amber-400 rounded-l-xl" />
          <div className="p-5">
            <h3 className="text-lg font-semibold text-amber-700 mb-4">
              Últimos Movimentos
            </h3>

            <div className="space-y-2">
              {historico.slice(0, 3).map((mov) => (
                <div
                  key={mov.id_movimento}
                  className="flex justify-between text-xs text-gray-600"
                >
                  <span>
                    ID Lote Atual: {mov.id_lote_atual || "Desconhecido"}
                  </span>
                  <span>{mov.dias_permanencia ?? "-"} dias</span>
                  <span>{mov.status ? mov.status : ""}</span>
                </div>
              ))}
              {historico.length > 3 && (
                <p className="text-xs text-blue-600">
                  +{historico.length - 3} movimentos anteriores
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ===== INFORMAÇÕES DO SISTEMA (SIDEBAR) ===== */}
      <div className="lg:col-span-1 space-y-6">
        <div className="relative rounded-xl border border-gray-200 bg-white">
          <div className="absolute left-0 top-0 h-full w-1.5 bg-blue-400 rounded-l-xl" />
          <div className="p-5">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Informações do Sistema
            </h3>

            <div className="grid grid-cols-1 gap-4 text-sm">
              <p>
                <span className="font-medium text-gray-700">ID do Grupo:</span>{" "}
                {grupoInfo.id_grupo ?? "-"}
              </p>
              <p>
                <span className="font-medium text-gray-700">Criado em:</span>{" "}
                {grupoInfo.created_at ? formatDate(grupoInfo.created_at) : "-"}
              </p>
              <p>
                <span className="font-medium text-gray-700">
                  Última Atualização:
                </span>{" "}
                {grupoInfo.updated_at ? formatDate(grupoInfo.updated_at) : "-"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
