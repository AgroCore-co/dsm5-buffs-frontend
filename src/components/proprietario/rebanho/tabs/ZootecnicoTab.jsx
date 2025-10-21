"use client";

import { useState, useEffect } from "react";
import { TrendingUp, TrendingDown, Calendar, Weight } from "lucide-react";
import dadosZootecnicosService from "@/services/dadosZootecnicosService";

export default function ZootecnicoTab({ bufaloData }) {
  const idBufalo = bufaloData?.id_bufalo;

  const [zootecData, setZootecData] = useState(null);
  const [zootecLoading, setZootecLoading] = useState(true);
  const [zootecError, setZootecError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [viewMode, setViewMode] = useState("cards"); // Novo estado para alternar entre modos

  useEffect(() => {
    const fetchZootecData = async () => {
      console.log("Iniciando carregamento de dados zootécnicos...");
      setZootecLoading(true);
      setZootecError(null);
      try {
        const response = await dadosZootecnicosService.listarDadosZootecnicosPorBufalo(idBufalo, page);
        console.log("Dados recebidos:", response);
        setZootecData(response.data);
        setTotalPages(response.meta.totalPages);
      } catch (error) {
        console.error("Erro ao carregar dados zootécnicos:", error);
        setZootecError("Erro ao carregar dados zootécnicos.");
      } finally {
        console.log("Finalizando carregamento de dados zootécnicos.");
        setZootecLoading(false);
      }
    };

    if (idBufalo) {
      fetchZootecData();
    }
  }, [idBufalo, page]);

  useEffect(() => {
    // Garantir que a primeira página seja carregada inicialmente
    setPage(1);
  }, [idBufalo]);

  const handleNextPage = () => {
    if (page < totalPages) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (page > 1) {
      setPage((prevPage) => prevPage - 1);
    }
  };

  const getWeightTrend = () => {
    if (!zootecData?.data || zootecData.data.length < 2) return null;
    const sorted = [...zootecData.data].sort(
      (a, b) => new Date(b.dt_registro).getTime() - new Date(a.dt_registro).getTime()
    );
    const latest = sorted[0]?.peso;
    const previous = sorted[1]?.peso;
    if (!latest || !previous) return null;
    return latest - previous;
  };

  const weightTrend = getWeightTrend();

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const getConditionColor = (condition) => {
    if (!condition || typeof condition !== "string") return "bg-gray-200 text-gray-600";
    const lower = condition.toLowerCase();
    if (lower.includes("excelente") || lower.includes("ótima")) return "bg-emerald-100 text-emerald-600";
    if (lower.includes("bom") || lower.includes("boa")) return "bg-blue-100 text-blue-600";
    if (lower.includes("regular")) return "bg-amber-100 text-amber-600";
    return "bg-red-100 text-red-600";
  };

  if (zootecLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="flex items-center space-x-3">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-amber-600"></div>
          <span className="text-gray-600">Carregando dados zootécnicos...</span>
        </div>
      </div>
    );
  }

  if (zootecError) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">Erro ao carregar dados</h3>
            <div className="mt-2 text-sm text-red-700">
              <p>{zootecError}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!zootecData || zootecData.length === 0) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center">
        <Calendar className="mx-auto h-12 w-12 text-gray-300 mb-3" />
        <p className="text-gray-500 font-medium">Nenhum dado zootécnico encontrado</p>
        <p className="text-gray-400 text-sm mt-1">Os registros aparecerão aqui quando forem adicionados</p>
      </div>
    );
  }

  const sortedData = [...zootecData].sort(
    (a, b) => new Date(b.dt_registro).getTime() - new Date(a.dt_registro).getTime()
  );

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-gray-200 bg-white p-6">
        <div className="mb-6 flex justify-between items-center">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Dados Zootécnicos</h3>
            <p className="text-sm text-gray-500 mt-1">Histórico de registros zootécnicos de {bufaloData.nome || "-"}</p>
          </div>
          <div>
            <button
              onClick={() => setViewMode("cards")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all border ${
                viewMode === "cards"
                  ? "bg-amber-50 text-amber-900 border-amber-200 shadow-sm"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50 border-transparent"
              }`}
            >
              Modo Cards
            </button>
            <button
              onClick={() => setViewMode("table")}
              className={`ml-2 px-4 py-2 rounded-lg text-sm font-medium transition-all border ${
                viewMode === "table"
                  ? "bg-amber-50 text-amber-900 border-amber-200 shadow-sm"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50 border-transparent"
              }`}
            >
              Modo Tabela
            </button>
          </div>
        </div>

        {viewMode === "cards" ? (
          <div className="grid grid-cols-1 gap-4">
            {sortedData.map((item) => (
              <div
                key={item.id_zootec}
                className="rounded-xl border border-gray-200 bg-gradient-to-br from-white to-gray-50 p-4 hover:shadow-md transition-shadow"
              >
                {/* Data do registro */}
                <div className="flex items-center gap-2 mb-4 pb-4 border-b border-gray-200">
                  <Calendar className="h-4 w-4 text-amber-600" />
                  <p className="text-sm font-semibold text-gray-900">{formatDate(item.dt_registro)}</p>
                </div>

                {/* Peso */}
                {item.peso && (
                  <div className="mb-3 p-3 bg-blue-50 rounded-lg border border-blue-100">
                    <div className="flex items-center gap-2 mb-1">
                      <Weight className="h-4 w-4 text-blue-600" />
                      <p className="text-xs font-medium text-blue-600 uppercase">Peso</p>
                    </div>
                    <p className="text-lg font-bold text-blue-900">{item.peso} kg</p>
                  </div>
                )}

                {/* Condição Corporal */}
                {item.condicao_corporal && (
                  <div className="mb-3">
                    <p className="text-xs font-medium text-gray-600 uppercase mb-1">Condição Corporal</p>
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getConditionColor(
                        item.condicao_corporal
                      )}`}
                    >
                      {item.condicao_corporal}
                    </span>
                  </div>
                )}

                {/* Cor Pelagem */}
                {item.cor_pelagem && (
                  <div className="mb-3">
                    <p className="text-xs font-medium text-gray-600 uppercase mb-1">Cor Pelagem</p>
                    <p className="text-sm text-gray-700">{item.cor_pelagem}</p>
                  </div>
                )}

                {/* Chifre */}
                {item.formato_chifre && (
                  <div className="mb-3">
                    <p className="text-xs font-medium text-gray-600 uppercase mb-1">Formato Chifre</p>
                    <p className="text-sm text-gray-700">{item.formato_chifre}</p>
                  </div>
                )}

                {/* Porte */}
                {item.porte_corporal && (
                  <div className="mb-3">
                    <p className="text-xs font-medium text-gray-600 uppercase mb-1">Porte Corporal</p>
                    <p className="text-sm text-gray-700">{item.porte_corporal}</p>
                  </div>
                )}

                {/* Tipo Pesagem */}
                {item.tipo_pesagem && (
                  <div className="pt-3 border-t border-gray-200">
                    <p className="text-xs text-gray-500">
                      Tipo: <span className="font-medium">{item.tipo_pesagem}</span>
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200 rounded-lg overflow-hidden"> {/* Adicionei bordas arredondadas */}
            <thead className="bg-amber-100">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Data do Registro
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Peso
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Condição Corporal
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Cor Pelagem
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Formato Chifre
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Porte Corporal
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Tipo Pesagem
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sortedData.map((item, index) => (
                <tr
                  key={item.id_zootec}
                  className={index % 2 === 0 ? "bg-gray-100" : "bg-white"} // Revertendo para bg-gray-100
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(item.dt_registro)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.peso || "-"}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.condicao_corporal || "-"}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.cor_pelagem || "-"}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.formato_chifre || "-"}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.porte_corporal || "-"}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.tipo_pesagem || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        <div className="flex justify-between items-center mt-6">
          <button
            onClick={handlePrevPage}
            disabled={page === 1}
            className="px-4 py-2 bg-gray-200 text-gray-600 rounded-lg disabled:opacity-50"
          >
            Anterior
          </button>
          <span className="text-sm text-gray-500">
            Página {page} de {totalPages}
          </span>
          <button
            onClick={handleNextPage}
            disabled={page === totalPages}
            className="px-4 py-2 bg-gray-200 text-gray-600 rounded-lg disabled:opacity-50"
          >
            Próxima
          </button>
        </div>
      </div>
    </div>
  );
}