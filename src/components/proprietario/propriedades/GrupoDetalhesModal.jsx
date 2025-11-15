"use client";

import React, { useEffect, useState } from "react";
import grupoService from "@/services/grupoService";
import movLoteService from "@/services/movLoteService";
import loteService from "@/services/loteService";
import MapaGrupoPiquetes from "@/components/MapaGrupoPiquetes";

export default function GrupoDetalhesModal({ open, onClose, grupo }) {
  const [grupoInfo, setGrupoInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [loteAtualId, setLoteAtualId] = useState(null);
  const [lotes, setLotes] = useState([]);
  const [lotesLoading, setLotesLoading] = useState(false);
  const [lotesError, setLotesError] = useState("");

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

  if (!open || !grupo) return null;

  return (
    <div
      className="fixed inset-0 z-[1001] flex items-center justify-center bg-black/45 backdrop-blur-sm p-4"
      role="dialog"
      aria-modal="true"
    >
      <div className="w-[min(96vw,1200px)] bg-white rounded-3xl shadow-2xl ring-1 ring-gray-200 flex flex-col overflow-visible">
        {/* Header */}
        <div className="sticky top-0 z-10 border-b bg-white rounded-t-3xl">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-start gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-2xl font-extrabold tracking-tight text-gray-900">
                    Grupo •{" "}
                    {typeof (grupoInfo?.nome_grupo ?? grupo.nome_grupo) ===
                    "object"
                      ? JSON.stringify(
                          grupoInfo?.nome_grupo ?? grupo.nome_grupo
                        )
                      : grupoInfo?.nome_grupo ?? grupo.nome_grupo}
                  </h2>
                </div>
                <p className="text-sm text-gray-500">
                  ID:{" "}
                  {typeof (
                    grupoInfo?.id_grupo ??
                    grupo.id_grupo ??
                    grupo.id ??
                    grupo._id
                  ) === "object"
                    ? JSON.stringify(
                        grupoInfo?.id_grupo ??
                          grupo.id_grupo ??
                          grupo.id ??
                          grupo._id
                      )
                    : grupoInfo?.id_grupo ??
                      grupo.id_grupo ??
                      grupo.id ??
                      grupo._id}
                  {" • Propriedade: "}
                  {typeof (
                    grupoInfo?.id_propriedade ??
                    grupo.id_propriedade ??
                    "-"
                  ) === "object"
                    ? JSON.stringify(
                        grupoInfo?.id_propriedade ?? grupo.id_propriedade ?? "-"
                      )
                    : grupoInfo?.id_propriedade ?? grupo.id_propriedade ?? "-"}
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
        <div className="flex-1 p-6 min-h-[700px] max-h-none overflow-y-visible">
          {loading ? (
            <div className="flex items-center justify-center h-full text-gray-500">
              Carregando informações...
            </div>
          ) : error ? (
            <div className="flex items-center justify-center h-full text-red-500">
              {error}
            </div>
          ) : grupoInfo ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 auto-rows-min h-full">
              {/* Mapa do grupo - fora da coluna lateral, ocupando toda a largura do modal */}
              <div className="col-span-full w-full mt-2">
                <section className="rounded-xl border border-gray-200 bg-white shadow-sm p-6">
                  <h3 className="text-xl font-bold text-green-700 mb-4 border-b border-green-100 pb-2">
                    Localização Atual do Grupo
                  </h3>
                  {lotesLoading ? (
                    <div className="text-gray-500">Carregando piquetes...</div>
                  ) : lotesError ? (
                    <div className="text-red-500">{lotesError}</div>
                  ) : lotes.length === 0 ? (
                    <div className="text-gray-500">
                      Nenhum piquete encontrado para exibir no mapa.
                    </div>
                  ) : (
                    <MapaGrupoPiquetes
                      lotes={lotes}
                      loteDestacadoId={loteAtualId}
                      height="350px"
                    />
                  )}
                </section>
              </div>
              {/* Coluna Principal */}
              <div className="lg:col-span-2 space-y-6">
                {/* Dados Básicos */}
                <div className="relative rounded-xl border border-gray-200 bg-white">
                  <div className="absolute left-0 top-0 h-full w-1.5 bg-amber-400 rounded-l-xl" />
                  <div className="p-5">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      Dados Básicos
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4 text-sm">
                      <p>
                        <span className="font-medium text-gray-700">Nome:</span>{" "}
                        {grupoInfo.nome_grupo ?? "-"}
                      </p>
                      <p>
                        <span className="font-medium text-gray-700">Cor:</span>{" "}
                        {grupoInfo.color ?? "-"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Coluna Lateral */}
              <div className="lg:col-span-1 space-y-6">
                {/* Informações do Sistema */}
                <div className="relative rounded-xl border border-gray-200 bg-white">
                  <div className="absolute left-0 top-0 h-full w-1.5 bg-blue-400 rounded-l-xl" />
                  <div className="p-5">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      Informações do Sistema
                    </h3>
                    <div className="grid grid-cols-1 gap-4 text-sm">
                      <p>
                        <span className="font-medium text-gray-700">
                          ID do Grupo:
                        </span>{" "}
                        {grupoInfo.id_grupo ?? "-"}
                      </p>
                      <p>
                        <span className="font-medium text-gray-700">
                          Criado em:
                        </span>{" "}
                        {grupoInfo.created_at ?? "-"}
                      </p>
                      <p>
                        <span className="font-medium text-gray-700">
                          Última Atualização:
                        </span>{" "}
                        {grupoInfo.updated_at ?? "-"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500">
              Nenhuma informação encontrada.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
