import React, { useEffect, useState } from "react";
import loteService from "@/services/loteService";
import movLoteService from "@/services/movLoteService";
import toast from "react-hot-toast";
import { Loader2, MapPin, Package, Move } from "lucide-react";

export default function GrupoMovimentacaoTab({ grupoInfo }) {
  const [lotes, setLotes] = useState([]);
  const [loteAtualId, setLoteAtualId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [draggingLoteId, setDraggingLoteId] = useState(null);
  const [targetLoteId, setTargetLoteId] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    async function fetchLotes() {
      setLoading(true);
      try {
        const todosLotes = await loteService.listarLotesPorPropriedade(
          grupoInfo.id_propriedade?.id_propriedade ?? grupoInfo.id_propriedade
        );
        const lotesDoGrupo = todosLotes.filter(
          (l) => l.id_grupo === (grupoInfo.id_grupo ?? grupoInfo.id)
        );
        setLotes(lotesDoGrupo);

        const status = await movLoteService.verificarStatusGrupo(
          grupoInfo.id_grupo ?? grupoInfo.id
        );
        setLoteAtualId(status.localizacao_atual?.id_lote ?? null);
      } catch (e) {
        console.error("Erro ao carregar lotes:", e);
        setLotes([]);
        setLoteAtualId(null);
        toast.error("Erro ao carregar lotes");
      } finally {
        setLoading(false);
      }
    }

    if (grupoInfo?.id_grupo || grupoInfo?.id) fetchLotes();
  }, [grupoInfo]);

  const handleDragStart = (e, fromLoteId) => {
    setDraggingLoteId(fromLoteId);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragEnd = () => {
    setDraggingLoteId(null);
  };

  const handleDrop = (e, toLoteId) => {
    e.preventDefault();
    if (toLoteId === loteAtualId) {
      setDraggingLoteId(null);
      return;
    }
    setTargetLoteId(toLoteId);
    setShowConfirm(true);
  };

  const handleMobileMove = (toLoteId) => {
    if (toLoteId === loteAtualId) return;
    setDraggingLoteId(loteAtualId);
    setTargetLoteId(toLoteId);
    setShowConfirm(true);
  };

  const confirmarMovimentacao = async () => {
    if (!targetLoteId) {
      toast.error("Selecione um lote de destino");
      return;
    }

    const idPropriedade = grupoInfo.id_propriedade?.id_propriedade || grupoInfo.id_propriedade;
    const idGrupo = grupoInfo.id_grupo ?? grupoInfo.id;

    const payload = {
      id_propriedade: idPropriedade,
      id_grupo: idGrupo,
      id_lote_atual: targetLoteId,
      dt_entrada: new Date().toISOString(),
      dt_saida: null,
      ...(loteAtualId && { id_lote_anterior: loteAtualId }),
    };

    console.log("Payload enviado para /mov-lote:", payload);

    try {
      await movLoteService.registrarMovimentacaoGrupo(payload);
      setLoteAtualId(targetLoteId);
      toast.success("Grupo movido com sucesso!");
    } catch (err) {
      console.error("Erro na API:", err.response?.data || err);
      const msg = Array.isArray(err.response?.data?.message)
        ? err.response.data.message.join("; ")
        : err.response?.data?.message || "Erro ao mover grupo";
      toast.error(msg);
    } finally {
      setShowConfirm(false);
      setDraggingLoteId(null);
      setTargetLoteId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-12 h-full">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-500 mb-3" />
        <p className="text-sm text-gray-600 font-medium">Carregando lotes...</p>
      </div>
    );
  }

  if (!lotes.length) {
    return (
      <div className="flex flex-col items-center justify-center p-12 h-full">
        <Package className="w-12 h-12 text-gray-300 mb-3" />
        <p className="text-gray-600 font-medium">
          Nenhum lote encontrado para este grupo.
        </p>
      </div>
    );
  }

  return (
    <>
      {/* MAIN CONTAINER */}
      <div className="p-6 w-full h-full bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col justify-start items-stretch">
        <div className="mb-4">
          <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-emerald-600" />
            Movimentar para lote
          </h3>
          <p className="text-xs text-gray-500 mt-1">
            Arraste o grupo ou toque em um lote para mover
          </p>
        </div>

        {/* GRID DE LOTES */}
        <div className="h-full w-full p-4 overflow-hidden">
          <div
            className="grid gap-4 h-full"
            style={{
              gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            }}
          >
            {lotes.map((lote) => (
              <div
                key={lote.id_lote}
                onDrop={(e) => handleDrop(e, lote.id_lote)}
                onDragOver={(e) => e.preventDefault()}
                className={`group relative rounded-lg border-2 p-3 flex flex-col justify-between transition-all duration-200 cursor-pointer h-full min-h-0
                  ${
                    draggingLoteId && lote.id_lote !== loteAtualId
                      ? "border-emerald-400 border-dashed bg-emerald-50"
                      : lote.id_lote === loteAtualId
                      ? "border-emerald-500 bg-gradient-to-br from-emerald-50 to-emerald-100 shadow-md"
                      : "border-gray-200 bg-white hover:shadow-md hover:border-gray-300"
                  }
                `}
                {...(lote.id_lote === loteAtualId
                  ? {
                      draggable: true,
                      onDragStart: (e) => handleDragStart(e, lote.id_lote),
                      onDragEnd: handleDragEnd,
                    }
                  : {})}
              >
                {/* CABEÇALHO */}
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h4 className="font-bold text-sm text-gray-900 line-clamp-2 flex-1">
                    {lote.nome_lote}
                  </h4>
                  {lote.id_lote === loteAtualId && (
                    <span className="flex-shrink-0 px-2 py-0.5 bg-emerald-500 text-white text-xs font-semibold rounded-full">
                      Atual
                    </span>
                  )}
                </div>

                {/* DESCRIÇÃO */}
                <p className="text-xs text-gray-500 line-clamp-2 mb-3">
                  {lote.descricao || "Sem descrição"}
                </p>

                {/* GRUPO ATUAL */}
                {lote.id_lote === loteAtualId && (
                  <div className="p-2 bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-lg flex items-center gap-2 text-xs font-medium text-gray-900">
                    <div
                      className="w-3 h-3 rounded-full flex-shrink-0 shadow-sm"
                      style={{ backgroundColor: grupoInfo.color || "#3b82f6" }}
                    />
                    <span className="truncate">{grupoInfo.nome_grupo}</span>
                  </div>
                )}

                {/* ENCAIXE PONTILHADO + TOQUE */}
                {lote.id_lote !== loteAtualId && (
                  <>
                    {draggingLoteId && (
                     <div
                        onClick={() => handleMobileMove(lote.id_lote)}
                        className="mt-3 flex items-center justify-center text-xs text-gray-400 font-medium cursor-pointer hover:text-gray-600"
                      >
                        <Move className="w-3 h-3 mr-1" />
                       SOLTE AQUI
                      </div>
                    )}

                    {!draggingLoteId && (
                      <div
                        onClick={() => handleMobileMove(lote.id_lote)}
                        className="mt-3 flex items-center justify-center text-xs text-gray-400 font-medium cursor-pointer hover:text-gray-600"
                      >
                        <Move className="w-3 h-3 mr-1" />
                        Toque para mover
                      </div>
                    )}
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* MODAL DE CONFIRMAÇÃO */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl p-6 max-w-sm w-full animate-in fade-in zoom-in-95">
            <div className="flex items-center gap-3 mb-4">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: grupoInfo.color || "#3b82f6" }}
              />
              <h3 className="text-lg font-bold text-gray-900">
                Confirmar Movimentação
              </h3>
            </div>

            <p className="text-sm text-gray-600 mb-6 leading-relaxed">
              Mover{" "}
              <strong className="text-gray-900">{grupoInfo.nome_grupo}</strong>{" "}
              para{" "}
              <strong className="text-gray-900">
                {lotes.find((l) => l.id_lote === targetLoteId)?.nome_lote}
              </strong>
              ?
            </p>

            <div className="flex gap-3 justify-end">
              <button
                onClick={() => {
                  setShowConfirm(false);
                  setDraggingLoteId(null);
                  setTargetLoteId(null);
                }}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 font-medium transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={confirmarMovimentacao}
                disabled={!targetLoteId}
                className={`px-4 py-2 font-medium rounded-lg transition-colors shadow-sm ${
                  targetLoteId
                    ? "bg-emerald-600 text-white hover:bg-emerald-700"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                Mover
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}