"use client";

import { useEffect, useState } from "react";
import { Calendar, Pill, CheckCircle2, AlertCircle } from "lucide-react";
import dadosSanitariosService from "@/services/dadosSanitariosService";

export default function SanitariosTab({ bufaloData }) {
  const idBufalo = bufaloData?.id_bufalo;

  const [sanitariosData, setSanitariosData] = useState(null);
  const [sanitariosLoading, setSanitariosLoading] = useState(true);
  const [sanitariosError, setSanitariosError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [viewMode, setViewMode] = useState("cards");

  useEffect(() => {
    const fetchSanitariosData = async () => {
      try {
        setSanitariosLoading(true);
        const response = await dadosSanitariosService.listarDadosSanitariosPorBufalo(idBufalo, page);
        setSanitariosData(response.data);
        setTotalPages(response.meta.totalPages);
      } catch (error) {
        setSanitariosError(error.message);
      } finally {
        setSanitariosLoading(false);
      }
    };

    if (idBufalo) {
      fetchSanitariosData();
    }
  }, [idBufalo, page]);

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

  const getReturnIndicator = (necessitaRetorno, dtRetorno) => {
    if (!necessitaRetorno) {
      return <span className="text-green-600 font-semibold">Sem retorno necessário</span>;
    }

    const retornoDate = new Date(dtRetorno);
    const formattedDate = retornoDate.toLocaleDateString("pt-BR");

    return (
      <span className="text-orange-600 font-semibold">
        Retorno programado para {formattedDate}
      </span>
    );
  };

  const VaccineCard = ({ registro, getReturnIndicator }) => {
    const dataFormatada = new Date(registro.dt_aplicacao).toLocaleDateString("pt-BR");
    const temRetorno = registro.necessita_retorno;

    return (
      <div className="group relative overflow-hidden rounded-2xl border border-primary bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-md hover:border-primary-hover">
        <div className="relative space-y-5">
          {/* Header com data */}
          <div className="flex items-center justify-between pb-4 border-b border-border">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-light">
                <Calendar className="h-5 w-5 text-primary-dark" />
              </div>
              <div>
                <p className="text-xs font-medium text-primary-dark uppercase tracking-wide">Data da Aplicação</p>
                <p className="text-lg font-bold text-text-primary">{dataFormatada}</p>
              </div>
            </div>
          </div>

          {/* Doença */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Pill className="h-4 w-4 text-primary-dark" />
              <p className="text-xs font-semibold text-text-secondary uppercase tracking-wide">Doença</p>
            </div>
            <p className="text-base font-semibold text-text-primary ml-6">{registro.doenca}</p>
          </div>

          {/* Dosagem */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Pill className="h-4 w-4 text-primary" />
              <p className="text-xs font-semibold text-text-secondary uppercase tracking-wide">Dosagem</p>
            </div>
            <div className="ml-6 inline-flex items-center gap-2 rounded-lg bg-primary-hover/10 px-3 py-2">
              <p className="text-sm font-semibold text-primary-dark">
                {registro.dosagem} <span className="text-primary">{registro.unidade_medida}</span>
              </p>
            </div>
          </div>

          {/* Retorno */}
          <div className="space-y-2 pt-2">
            <div className="flex items-center gap-2">
              {temRetorno ? (
                <AlertCircle className="h-4 w-4 text-warning" />
              ) : (
                <CheckCircle2 className="h-4 w-4 text-success" />
              )}
              <p className="text-xs font-semibold text-text-secondary uppercase tracking-wide">Status de Retorno</p>
            </div>
            <div
              className={`ml-6 inline-flex items-center gap-2 rounded-lg px-3 py-2 ${
                temRetorno ? "bg-warning/10 border border-warning" : "bg-success/10 border border-success"
              }`}
            >
              <p className={`text-sm font-semibold ${temRetorno ? "text-warning" : "text-success"}`}>
                {getReturnIndicator(registro.necessita_retorno, registro.dt_retorno)}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (sanitariosLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="flex items-center space-x-3">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-amber-600"></div>
          <span className="text-gray-600">Carregando dados sanitários...</span>
        </div>
      </div>
    );
  }

  if (sanitariosError) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500">Erro ao carregar dados sanitários: {sanitariosError}</p>
      </div>
    );
  }

  if (!sanitariosData || sanitariosData.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Nenhum dado sanitário encontrado para este búfalo.</p>
      </div>
    );
  }

  const sortedData = [...sanitariosData].sort(
    (a, b) => new Date(b.dt_aplicacao).getTime() - new Date(a.dt_aplicacao).getTime()
  );

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-gray-200 bg-white p-6">
        <div className="mb-6 flex justify-between items-center">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Dados Sanitários</h3>
            <p className="text-sm text-gray-500 mt-1">
              Histórico de aplicações e tratamentos sanitários de {bufaloData.nome || "-"}
            </p>
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
            {sortedData.map((registro) => (
              <VaccineCard
                key={registro.id_sanit}
                registro={registro}
                getReturnIndicator={getReturnIndicator}
              />
            ))}
          </div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200 rounded-lg overflow-hidden">
            <thead className="bg-amber-100">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Data de Aplicação
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Doença
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Dosagem
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Retorno
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sortedData.map((registro, index) => (
                <tr
                  key={registro.id_sanit}
                  className={index % 2 === 0 ? "bg-gray-100" : "bg-white"}
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(registro.dt_aplicacao).toLocaleDateString("pt-BR")}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{registro.doenca}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {registro.dosagem} {registro.unidade_medida}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {getReturnIndicator(registro.necessita_retorno, registro.dt_retorno)}
                  </td>
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