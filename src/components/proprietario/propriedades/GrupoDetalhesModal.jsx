"use client";

import React, { useEffect, useState } from "react";
import grupoService from "@/services/grupoService";
import movLoteService from "@/services/movLoteService";
import loteService from "@/services/loteService";
import bufaloService from "@/services/bufaloService";
import dynamic from "next/dynamic";
const MapaGrupoPiquetes = dynamic(() => import("@/components/MapaGrupoPiquetes"), { ssr: false });

import GrupoMapaTab from "@/components/proprietario/propriedades/GrupoMapaTab";
import GrupoDetalhesTab from "@/components/proprietario/propriedades/GrupoDetalhesTab";
import GrupoMovimentacaoTab from "@/components/proprietario/propriedades/GrupoMovimentacaoTab";
import GrupoBufalosTab from "@/components/proprietario/propriedades/GrupoBufalosTab";

export default function GrupoDetalhesModal({ open, onClose, grupo }) {
  const [grupoInfo, setGrupoInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [loteAtualId, setLoteAtualId] = useState(null);
  const [lotes, setLotes] = useState([]);
  const [lotesLoading, setLotesLoading] = useState(false);
  const [lotesError, setLotesError] = useState("");
  const [activeTab, setActiveTab] = useState("Mapa");

  // Função para converter geo_mapa em coordenadas para o mapa
  const parseGeoJSONPolygon = (geoJson) => {
    if (!geoJson) return null;
    try {
      if (geoJson.type === "Polygon" && geoJson.coordinates) {
        const coordinates = geoJson.coordinates[0];
        return coordinates.map(([lng, lat]) => [lat, lng]);
      }
      return null;
    } catch (error) {
      console.error("Erro ao converter GeoJSON:", error);
      return null;
    }
  };

  useEffect(() => {
    if (open && grupo) {
      setLoading(true);
      setError("");
      grupoService
        .buscarGrupoPorId(grupo.id_grupo ?? grupo.id ?? grupo._id)
        .then((data) => setGrupoInfo(data))
        .catch(() => setError("Erro ao buscar informações do grupo."))
        .finally(() => setLoading(false));
      // Buscar localização atual do grupo
      movLoteService
        .verificarStatusGrupo(grupo.id_grupo ?? grupo.id ?? grupo._id)
        .then((res) => {
          if (res.localizacao_atual && res.localizacao_atual.id_lote) {
            setLoteAtualId(res.localizacao_atual.id_lote);
          } else {
            setLoteAtualId(null);
          }
        })
        .catch(() => setLoteAtualId(null));
      setLotes([]); // Limpa lotes ao abrir
    } else {
      setGrupoInfo(null);
      setLoteAtualId(null);
      setLotes([]);
    }
  }, [open, grupo]);

  // Novo efeito: busca lotes só quando grupoInfo.id_propriedade está disponível
  useEffect(() => {
    if (open && grupoInfo && grupoInfo.id_propriedade) {
      setLotesLoading(true);
      setLotesError("");
      loteService
        .listarLotesPorPropriedade(grupoInfo.id_propriedade)
        .then((lotesData) => {
          const processed = lotesData
            .map((lote) => ({
              ...lote,
              coordenadas: parseGeoJSONPolygon(lote.geo_mapa),
              cor: lote.grupo?.color || "#444444",
            }))
            .filter((l) => l.coordenadas);
          setLotes(processed);
        })
        .catch(() => setLotesError("Erro ao buscar piquetes da propriedade."))
        .finally(() => setLotesLoading(false));
    }
  }, [open, grupoInfo]);

  // Novo: buscar quantidade de búfalos ativos no grupo
  const [totalBufalosGrupo, setTotalBufalosGrupo] = useState(null);
  useEffect(() => {
    async function fetchTotalBufalosGrupo() {
      if (open && grupoInfo && grupoInfo.id_grupo) {
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
  }, [open, grupoInfo]);

  // Função para atualizar dados do grupo e dependências
  const atualizarGrupoInfo = async () => {
    if (!grupo) return;
    setLoading(true);
    setError("");
    try {
      const data = await grupoService.buscarGrupoPorId(grupo.id_grupo ?? grupo.id ?? grupo._id);
      setGrupoInfo(data);
      // Atualiza localização atual
      const res = await movLoteService.verificarStatusGrupo(grupo.id_grupo ?? grupo.id ?? grupo._id);
      if (res.localizacao_atual && res.localizacao_atual.id_lote) {
        setLoteAtualId(res.localizacao_atual.id_lote);
      } else {
        setLoteAtualId(null);
      }
    } catch {
      setError("Erro ao buscar informações do grupo.");
    } finally {
      setLoading(false);
    }
  };

  if (!open || !grupo) return null;

  return (
    <div
      className="fixed inset-0 z-[1001] flex items-center justify-center bg-black/45 backdrop-blur-sm p-4"
      role="dialog"
      aria-modal="true"
    >
      <div className="w-[min(99vw,1600px)] max-h-[98vh] bg-white rounded-3xl shadow-2xl ring-1 ring-gray-200 flex flex-col overflow-visible">
        {/* Header */}
        <div className="sticky top-0 z-10 border-b bg-white rounded-t-3xl">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-start gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-2xl font-extrabold tracking-tight text-gray-900">
                    Grupo • {typeof (grupoInfo?.nome_grupo ?? grupo.nome_grupo) === "object"
                      ? JSON.stringify(grupoInfo?.nome_grupo ?? grupo.nome_grupo)
                      : grupoInfo?.nome_grupo ?? grupo.nome_grupo}
                  </h2>
                </div>
                <p className="text-sm text-gray-500">
                  ID: {typeof (grupoInfo?.id_grupo ?? grupo.id_grupo ?? grupo.id ?? grupo._id) === "object"
                    ? JSON.stringify(grupoInfo?.id_grupo ?? grupo.id_grupo ?? grupo.id ?? grupo._id)
                    : grupoInfo?.id_grupo ?? grupo.id_grupo ?? grupo.id ?? grupo._id}
                  {" • Propriedade: "}
                  {typeof (grupoInfo?.id_propriedade ?? grupo.id_propriedade ?? "-") === "object"
                    ? JSON.stringify(grupoInfo?.id_propriedade ?? grupo.id_propriedade ?? "-")
                    : grupoInfo?.id_propriedade ?? grupo.id_propriedade ?? "-"}
                  {totalBufalosGrupo !== null && (
                    <span className="ml-2 text-blue-700 font-semibold">• {totalBufalosGrupo} búfalo(s) no grupo</span>
                  )}
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
          {/* Tabs */}
          <div className="flex gap-1 px-3 pb-3">
            {["Mapa", "Detalhes", "Movimentação", "Búfalos"].map((label) => (
              <button
                key={label}
                onClick={() => setActiveTab(label)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all border ${
                  activeTab === label
                    ? "bg-amber-50 text-amber-900 border-amber-200 shadow-sm"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50 border-transparent"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
        {/* Conteúdo */}
        <div className="flex-1 p-4 sm:p-8 min-h-[60vh] max-h-[calc(100vh-100px)] overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center h-full text-gray-500">Carregando informações...</div>
          ) : error ? (
            <div className="flex items-center justify-center h-full text-red-500">{error}</div>
          ) : grupoInfo ? (
            <>
              {activeTab === "Mapa" && (
                <GrupoMapaTab lotes={lotes} loteAtualId={loteAtualId} lotesLoading={lotesLoading} lotesError={lotesError} atualizarGrupoInfo={atualizarGrupoInfo} />
              )}
              {activeTab === "Detalhes" && (
                <div className="h-full min-h-[40vh] max-h-[calc(100vh-200px)] overflow-y-auto">
                  <GrupoDetalhesTab grupoInfo={grupoInfo} atualizarGrupoInfo={atualizarGrupoInfo} />
                </div>
              )}
              {activeTab === "Movimentação" && (
                <GrupoMovimentacaoTab grupoInfo={grupoInfo} atualizarGrupoInfo={atualizarGrupoInfo} />
              )}
              {activeTab === "Búfalos" && (
                <GrupoBufalosTab grupoInfo={grupoInfo} />
              )}
            </>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500">Nenhuma informação encontrada.</div>
          )}
        </div>
      </div>
    </div>
  );
}
