import React, { useEffect, useState } from "react";
import { usePropriedade } from "@/contexts/propriedadeContext";
import bufaloService from "@/services/bufaloService";
import racaService from "@/services/racaService";

export default function BuffaloTable({
  setModalOpen,
  setBufaloSelecionado,
  setModalCriarBufaloOpen,
  setModalRelatorioOpen,
}) {
  const { propriedadeId } = usePropriedade();
  const [bufalos, setBufalos] = useState([]);
  const [metaBufalos, setMetaBufalos] = useState(null);
  const [loadingBufalos, setLoadingBufalos] = useState(false);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [racas, setRacas] = useState([]);
  const [racaSelecionada, setRacaSelecionada] = useState("");
  const [sexoSelecionado, setSexoSelecionado] = useState("");
  const [maturidadeSelecionada, setMaturidadeSelecionada] = useState("");
  const [statusSelecionado, setStatusSelecionado] = useState("");

  useEffect(() => {
    racaService.listarRacas().then(setRacas).catch(() => setRacas([]));
  }, []);

  useEffect(() => {
    if (!propriedadeId) {
      setBufalos([]);
      setMetaBufalos(null);
      return;
    }
    let ignore = false;
    (async () => {
      setLoadingBufalos(true);
      try {
        let res;
        if (statusSelecionado === "false") {
          // Busca apenas inativos, ignora outros filtros
          res = await bufaloService.filtrarBufalosPorStatusPropriedade(
            false,
            propriedadeId,
            page,
            limit
          );
        } else {
          // Busca todos, permite demais filtros
          res = await bufaloService.filtrarBufalosAvancado({
            idPropriedade: propriedadeId,
            idRaca: racaSelecionada || undefined,
            sexo: sexoSelecionado || undefined,
            nivelMaturidade: maturidadeSelecionada || undefined,
            page,
            limit,
          });
        }
        if (ignore) return;
        setBufalos(Array.isArray(res?.data) ? res.data : []);
        setMetaBufalos(res?.meta ?? null);
      } catch (err) {
        if (!ignore) {
          setBufalos([]);
          setMetaBufalos(null);
        }
      } finally {
        if (!ignore) setLoadingBufalos(false);
      }
    })();
    return () => { ignore = true; };
  }, [propriedadeId, page, limit, racaSelecionada, sexoSelecionado, maturidadeSelecionada, statusSelecionado]);

  return (
    <div className="w-full flex flex-col bg-white rounded-xl p-5 gap-4 box-border border border-[#e0e0e0] shadow-sm">
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-2xl font-bold text-gray-800">Registro de Búfalos</h2>
          <div className="flex gap-3">
            <button
              className="bg-white hover:bg-gray-50 text-gray-700 font-medium py-2 px-4 rounded-lg border border-gray-300 flex items-center gap-2 transition-colors"
              onClick={() => setModalRelatorioOpen(true)}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Gerar Relatório
            </button>
            <button
              className="bg-[#FFCF78] hover:bg-[#F2B84D] text-gray-800 font-medium py-2 px-4 rounded-lg"
              onClick={() => setModalCriarBufaloOpen(true)}
            >
              + Adicionar Búfalo
            </button>
          </div>
        </div>
        <p className="text-gray-600">Lista estática para visualização do layout.</p>
      </div>

      {/* Filtros (visuais apenas) */}
      <div className="bg-gray-50 rounded-lg p-4 mb-4">
        <div className="flex flex-wrap items-center gap-4">
          <h3 className="text-sm font-semibold text-gray-700 mr-2">Filtros:</h3>
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-600">Sexo:</label>
            <select
              className="border border-gray-300 rounded-md px-3 py-1 text-sm"
              value={sexoSelecionado}
              onChange={e => {
                setPage(1);
                setSexoSelecionado(e.target.value);
              }}
              disabled={statusSelecionado === "false"}
            >
              <option value="">Todos</option>
              <option value="F">Fêmea</option>
              <option value="M">Macho</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-600">Raça:</label>
            <select
              className="border border-gray-300 rounded-md px-3 py-1 text-sm"
              value={racaSelecionada}
              onChange={e => {
                setPage(1);
                setRacaSelecionada(e.target.value);
              }}
              disabled={statusSelecionado === "false"}
            >
              <option value="">Todas</option>
              {racas.map((raca) => (
                <option key={raca.id_raca} value={raca.id_raca}>{raca.nome}</option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-600">Maturidade:</label>
            <select
              className="border border-gray-300 rounded-md px-3 py-1 text-sm"
              value={maturidadeSelecionada}
              onChange={e => {
                setPage(1);
                setMaturidadeSelecionada(e.target.value);
              }}
              disabled={statusSelecionado === "false"}
            >
              <option value="">Todas</option>
              <option value="B">Bezerro(a)</option>
              <option value="N">Novilho(a)</option>
              <option value="V">Vaca</option>
              <option value="T">Touro</option>
              <option value="A">Adulto</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-600">Status:</label>
            <select
              className="border border-gray-300 rounded-md px-3 py-1 text-sm"
              value={statusSelecionado}
              onChange={e => {
                setPage(1);
                setStatusSelecionado(e.target.value);
                if (e.target.value === "false") {
                  setRacaSelecionada("");
                  setSexoSelecionado("");
                  setMaturidadeSelecionada("");
                }
              }}
            >
              <option value="">Todos</option>
              <option value="false">Inativos</option>
            </select>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto w-full">
        <table className="w-full border-collapse min-w-[800px] bg-white rounded-lg overflow-hidden shadow-sm">
          <thead className="bg-[#f0f0f0]">
            <tr>
              <th className="p-3 text-center font-medium text-gray-800 text-base">TAG</th>
              <th className="p-3 text-center font-medium text-gray-800 text-base">Nome</th>
              <th className="p-3 text-center font-medium text-gray-800 text-base">Sexo</th>
              <th className="p-3 text-center font-medium text-gray-800 text-base">Raça</th>
              <th className="p-3 text-center font-medium text-gray-800 text-base">Maturidade</th>
              <th className="p-3 text-center font-medium text-gray-800 text-base">Status</th>
              <th className="p-3 text-center font-medium text-gray-800 text-base">Ações</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200">
            {loadingBufalos ? (
              <tr>
                <td colSpan="7" className="text-center p-6 text-gray-500">Carregando búfalos...</td>
              </tr>
            ) : bufalos.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center p-6 text-gray-500">Nenhum búfalo encontrado</td>
              </tr>
            ) : (
              bufalos.map((b) => (
                <tr key={b.id_bufalo} className="odd:bg-white even:bg-[#fafafa]">
                  <td className="p-3 text-center text-gray-800 text-base font-medium">{b.brinco || b.id_bufalo}</td>
                  <td className="p-3 text-center text-gray-800 text-base">{b.nome}</td>
                  <td className="p-3 text-center text-gray-800 text-base">
                    {b.sexo === "M" ? "Macho" : b.sexo === "F" ? "Fêmea" : b.sexo}
                  </td>
                  <td className="p-3 text-center text-gray-800 text-base">{b.raca?.nome || "N/D"}</td>
                  <td className="p-3 text-center text-gray-800 text-base">
                    {(() => {
                      switch (b.nivel_maturidade) {
                        case "B": return "Bezerro(a)";
                        case "N": return "Novilho(a)";
                        case "V": return "Vaca";
                        case "T": return "Touro";
                        case "A": return "Adulto";
                        default: return b.nivel_maturidade || "N/D";
                      }
                    })()}
                  </td>
                  <td className="p-3 text-center text-gray-800 text-base">
                    <span className={`px-2.5 py-1.5 rounded-full text-sm font-bold inline-block w-28 ${b.status ? "bg-[#9DFFBE] text-gray-800" : "bg-red-200 text-red-800"}`}>
                      {b.status ? "Ativo" : "Inativo"}
                    </span>
                  </td>
                  <td className="p-3 text-center">
                    <button
                      onClick={() => {
                        setBufaloSelecionado(b.id_bufalo);
                        setModalOpen(true);
                      }}
                      className="bg-[#FFCF78] hover:bg-[#F2B84D] text-black px-3 py-1 rounded-lg text-sm font-medium"
                    >
                      Prontuário
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Paginação simples */}
      {metaBufalos && metaBufalos.totalPages > 1 && (
        <div className="flex justify-center items-center space-x-2 mt-4">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={metaBufalos.page <= 1}
            className={`px-4 py-2 rounded-lg font-medium ${metaBufalos.page <= 1 ? "bg-gray-200 text-gray-400 cursor-not-allowed" : "bg-[#FFCF78] hover:bg-[#F2B84D] text-gray-800"}`}
          >
            Anterior
          </button>

          {Array.from({ length: metaBufalos.totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => setPage(p)}
              className={`w-10 h-10 rounded-lg font-medium ${metaBufalos.page === p ? "bg-[#CE7D0A] text-white" : "bg-gray-200 hover:bg-[#FFCF78] text-gray-800"}`}
            >
              {p}
            </button>
          ))}

          <button
            onClick={() => setPage((p) => Math.min(metaBufalos.totalPages, p + 1))}
            disabled={metaBufalos.page >= metaBufalos.totalPages}
            className={`px-4 py-2 rounded-lg font-medium ${metaBufalos.page >= metaBufalos.totalPages ? "bg-gray-200 text-gray-400 cursor-not-allowed" : "bg-[#FFCF78] hover:bg-[#F2B84D] text-gray-800"}`}
          >
            Próximo
          </button>
        </div>
      )}
    </div>
  );
}
