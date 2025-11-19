import React, { useState, useEffect } from "react";
import { 
  Dna, 
  Mars, 
  Venus, 
  Calculator, 
  AlertTriangle, 
  CheckCircle, 
  Info, 
  TrendingUp 
} from "lucide-react";
import bufaloService from "@/services/bufaloService";
import * as simulacaoService from "@/services/simulacaoService";

export default function SimulacaoAcasalamentoPanel({ propriedadeId }) {
  // --- Estados de Dados e Controle ---
  const [males, setMales] = useState([]);
  const [females, setFemales] = useState([]);
  const [selectedMale, setSelectedMale] = useState("");
  const [selectedFemale, setSelectedFemale] = useState("");
  const [simulationResult, setSimulationResult] = useState(null);
  const [loadingBufalos, setLoadingBufalos] = useState(true);
  const [loadingSimulacao, setLoadingSimulacao] = useState(false);

  // --- Lógica de Busca (Mantida) ---
  useEffect(() => {
    const fetchBufalos = async () => {
      setLoadingBufalos(true);
      try {
        if (!propriedadeId) {
          setMales([]);
          setFemales([]);
          setLoadingBufalos(false);
          return;
        }
        // Busca Touros
        const resTouros = await bufaloService.filtrarBufalosPorMaturidadeStatusPropriedade(
          "T", propriedadeId, true, 1, 100
        );
        const touros = Array.isArray(resTouros?.data)
          ? resTouros.data.filter((b) => b.sexo === "M")
          : [];
        setMales(touros);

        // Busca Vacas e Novilhas
        const [resVacas, resNovilhas] = await Promise.all([
          bufaloService.filtrarBufalosPorMaturidadeStatusPropriedade(
            "V", propriedadeId, true, 1, 100
          ),
          bufaloService.filtrarBufalosPorMaturidadeStatusPropriedade(
            "N", propriedadeId, true, 1, 100
          ),
        ]);
        const vacas = Array.isArray(resVacas?.data)
          ? resVacas.data.filter((b) => b.sexo === "F")
          : [];
        const novilhas = Array.isArray(resNovilhas?.data)
          ? resNovilhas.data.filter((b) => b.sexo === "F")
          : [];
        setFemales([...vacas, ...novilhas]);
      } catch (err) {
        console.error("Erro ao buscar rebanho:", err);
        setMales([]);
        setFemales([]);
      } finally {
        setLoadingBufalos(false);
      }
    };
    fetchBufalos();
  }, [propriedadeId]);

  // --- Lógica de Simulação (Mantida) ---
  const handleSimulation = async () => {
    if (!selectedMale || !selectedFemale) return;
    setSimulationResult(null);
    setLoadingSimulacao(true);
    try {
      const result = await simulacaoService.simularAcasalamento({
        id_macho: selectedMale,
        id_femea: selectedFemale,
      });
      
      setSimulationResult({
        confidence: 100,
        estimatedProduction: result.predicao_producao_femea ?? 0,
        inbreeding: result.consanguinidade_prole ?? 0,
        resistance: result.risco_consanguinidade || "-",
        geneticScore: result.parentesco_pais ?? 0,
        alert: result.risco_consanguinidade === "Alto" ? "Consanguinidade alta" : null,
        recommendation: result.recomendacao || "-",
        raw: result,
      });
    } catch (err) {
      setSimulationResult({
        alert: "Erro ao simular acasalamento",
        recommendation: err?.message || "Falha na simulação",
        raw: null // Indica erro
      });
    } finally {
      setLoadingSimulacao(false);
    }
  };

  // --- Helpers de UI ---
  const getAnimalDetails = (id, list) => {
    if (!id || !list) return null;
    return list.find(a => String(a.id_bufalo || a.id) === String(id));
  };

  const getRiskColorStyles = (risco) => {
    switch (risco) {
      case "Baixo": return "bg-green-50 border-green-200 text-green-800";
      case "Médio": return "bg-yellow-50 border-yellow-200 text-yellow-800";
      case "Alto": return "bg-orange-50 border-orange-200 text-orange-800";
      default: return "bg-gray-50 border-gray-200 text-gray-800";
    }
  };

  const getRiskIcon = (risco) => {
    switch (risco) {
      case "Baixo": return <CheckCircle className="w-6 h-6 text-green-600" />;
      case "Médio": return <AlertTriangle className="w-6 h-6 text-yellow-600" />;
      case "Alto": return <AlertTriangle className="w-6 h-6 text-orange-600" />;
      default: return <Info className="w-6 h-6 text-gray-400" />;
    }
  };

  // --- Renderização ---
  return (
    <div className="w-full flex flex-col bg-white rounded-2xl p-8 gap-8 border-2 border-gray-200 shadow-sm">
      
      {/* Header */}
      <header className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center justify-center gap-2">
          <Dna className="text-orange-600" size={28} />
          Simulação de Acasalamento
        </h2>
        <p className="text-gray-600 text-sm mt-2 max-w-md mx-auto">
          Selecione os reprodutores para analisar a compatibilidade genética e prever resultados produtivos.
        </p>
      </header>

      {/* Painel de Seleção */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Macho - Borda Aumentada (border-4) */}
        <div className={`rounded-xl p-5 border-4 transition-all ${selectedMale ? 'border-blue-400 bg-blue-50/30' : 'border-gray-200 bg-gray-50'}`}>
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
              <Mars size={18} />
            </div>
            Touro / Reprodutor
          </h3>
          <div className="space-y-3">
            <select
              value={selectedMale}
              onChange={(e) => setSelectedMale(e.target.value)}
              className="w-full px-3 py-3 border-2 border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 bg-white cursor-pointer font-medium text-gray-700"
              disabled={loadingBufalos}
            >
              <option value="">{loadingBufalos ? "Carregando..." : "Selecione um touro..."}</option>
              {males.map((male) => {
                const id = String(male.id_bufalo || male.id);
                return (
                  <option key={id} value={id}>
                    {male.nome || male.name} {male.brinco ? `- ${male.brinco}` : ""}
                  </option>
                );
              })}
            </select>
          </div>
        </div>

        {/* Fêmea - Borda Aumentada (border-4) */}
        <div className={`rounded-xl p-5 border-4 transition-all ${selectedFemale ? 'border-pink-400 bg-pink-50/30' : 'border-gray-200 bg-gray-50'}`}>
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-pink-100 flex items-center justify-center text-pink-600">
              <Venus size={18} />
            </div>
            Matriz / Receptora
          </h3>
          <div className="space-y-3">
            <select
              value={selectedFemale}
              onChange={(e) => setSelectedFemale(e.target.value)}
              className="w-full px-3 py-3 border-2 border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-pink-400 bg-white cursor-pointer font-medium text-gray-700"
              disabled={loadingBufalos}
            >
              <option value="">{loadingBufalos ? "Carregando..." : "Selecione uma matriz..."}</option>
              {females.map((female) => {
                const id = String(female.id_bufalo || female.id);
                return (
                  <option key={id} value={id}>
                    {female.nome || female.name} {female.brinco ? `- ${female.brinco}` : ""}
                  </option>
                );
              })}
            </select>
          </div>
        </div>
      </section>

      {/* Botão de Ação */}
      <div className="text-center">
        <button
          onClick={handleSimulation}
          disabled={!selectedMale || !selectedFemale || loadingSimulacao}
          className="bg-orange-600 hover:bg-orange-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white py-3 px-10 rounded-xl font-bold text-lg transition-all focus:outline-none focus:ring-4 focus:ring-orange-500/20 flex items-center gap-2 mx-auto shadow-lg hover:shadow-orange-600/20 active:scale-95"
        >
          {loadingSimulacao ? (
            <>
              <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></span>
              Processando...
            </>
          ) : (
            <>
              <Calculator size={24} />
              Simular Acasalamento
            </>
          )}
        </button>
      </div>

      {/* Painel de Resultados */}
      <section className="transition-all duration-300">
        {loadingSimulacao ? (
          <div className="flex flex-col items-center justify-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-orange-400 mb-4"></div>
            <p className="text-gray-500 font-medium">Calculando probabilidades genéticas...</p>
          </div>
        ) : simulationResult ? (
          
          simulationResult.raw ? ( // Sucesso na simulação
            <div className="bg-white rounded-xl overflow-hidden border-2 border-gray-200 shadow-lg animate-in fade-in slide-in-from-bottom-4">
              
              {/* Header do Resultado */}
              <div className="bg-gray-50 border-b-2 border-gray-200 px-6 py-4 flex justify-between items-center">
                <h3 className="font-bold text-gray-900 flex items-center gap-2">
                  Relatório de Predição
                </h3>
                <span className="text-xs font-medium bg-white border-2 px-2 py-1 rounded text-gray-500 uppercase tracking-wide">
                  Resultado
                </span>
              </div>

              <div className="p-6 space-y-6">
                
                {/* Resumo Visual dos Pais - Bordas internas aumentadas */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-blue-50 border-2 border-blue-200">
                    <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-blue-600 shadow-sm border-2 border-blue-100">
                        <Mars size={20} />
                    </div>
                    <div className="overflow-hidden">
                        <span className="text-xs text-blue-600 font-bold uppercase block">Pai (Touro)</span>
                        <p className="text-sm font-bold text-gray-900 truncate">
                          {getAnimalDetails(selectedMale, males)?.nome || "Macho"}
                        </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-pink-50 border-2 border-pink-200">
                    <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-pink-600 shadow-sm border-2 border-pink-100">
                        <Venus size={20} />
                    </div>
                    <div className="overflow-hidden">
                        <span className="text-xs text-pink-600 font-bold uppercase block">Mãe (Matriz)</span>
                        <p className="text-sm font-bold text-gray-900 truncate">
                          {getAnimalDetails(selectedFemale, females)?.nome || "Fêmea"}
                        </p>
                    </div>
                  </div>
                </div>

                {/* Card Principal de Risco - Borda lateral grossa mantida e bordas externas reforçadas */}
                <div className={`rounded-xl p-5 border-l-8 border-y-2 border-r-2 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between ${getRiskColorStyles(simulationResult.raw.risco_consanguinidade)}`}>
                  <div className="flex gap-4">
                    <div className="p-2 bg-white/60 rounded-lg h-fit border-2 border-white/50">
                      {getRiskIcon(simulationResult.raw.risco_consanguinidade)}
                    </div>
                    <div>
                      <h4 className="font-bold text-lg">
                        Risco {simulationResult.raw.risco_consanguinidade || "Desconhecido"}
                      </h4>
                      <p className="text-sm opacity-90 mt-1 font-medium">
                        {simulationResult.recommendation}
                      </p>
                    </div>
                  </div>
                  <div className="bg-white/50 px-4 py-2 rounded-lg text-center min-w-[120px] self-end sm:self-center border-2 border-white/30">
                    <span className="block text-xs font-bold opacity-70 uppercase">Consang. Prole</span>
                    <span className="block text-2xl font-extrabold">
                      {simulationResult.inbreeding}%
                    </span>
                  </div>
                </div>

                {/* Grid de Métricas Detalhadas - Bordas grossas (border-4) */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-3 bg-gray-50 rounded-lg border-4 border-gray-100 hover:border-blue-100 transition-colors">
                    <span className="text-xs text-gray-500 block mb-1 font-semibold">Consang. Pai</span>
                    <span className="font-bold text-blue-600 text-lg">{simulationResult.raw.consanguinidade_macho ?? 0}%</span>
                  </div>
                  
                  <div className={`text-center p-3 rounded-lg border-4 transition-colors ${simulationResult.raw.detalhes?.tem_parentesco_direto ? 'bg-yellow-50 border-yellow-200' : 'bg-gray-50 border-gray-100 hover:border-gray-200'}`}>
                    <span className="text-xs text-gray-500 block mb-1 flex justify-center items-center gap-1 font-semibold">
                      Parentesco {simulationResult.raw.detalhes?.tem_parentesco_direto && <AlertTriangle size={12} className="text-yellow-600"/>}
                    </span>
                    <span className="font-bold text-gray-800 text-lg">{simulationResult.geneticScore}%</span>
                  </div>

                  <div className="text-center p-3 bg-gray-50 rounded-lg border-4 border-gray-100 hover:border-pink-100 transition-colors">
                    <span className="text-xs text-gray-500 block mb-1 font-semibold">Consang. Mãe</span>
                    <span className="font-bold text-pink-600 text-lg">{simulationResult.raw.consanguinidade_femea ?? 0}%</span>
                  </div>
                </div>

                {/* Predição de Produção - Borda 2px */}
                {simulationResult.estimatedProduction !== 0 && (
                  <div className="bg-indigo-50 rounded-lg p-4 border-2 border-indigo-100 flex items-center gap-3">
                    <div className="p-2 bg-white rounded-full text-indigo-600 shadow-sm border-2 border-indigo-50">
                      <TrendingUp size={20} />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-indigo-500 uppercase">Potencial Genético de Produção</p>
                      <p className="text-indigo-900 font-medium">
                        Estimativa de <span className="text-lg font-bold">
                          {typeof simulationResult.estimatedProduction === 'object' 
                            ? simulationResult.estimatedProduction.predicao_litros 
                            : simulationResult.estimatedProduction}
                        </span> litros.
                      </p>
                    </div>
                  </div>
                )}

                {/* Alerta de Erro/Aviso */}
                {simulationResult.alert && (
                   <div className="bg-red-50 text-red-700 p-3 rounded-lg text-sm flex items-center gap-2 border-2 border-red-100">
                      <AlertTriangle size={16} />
                      {simulationResult.alert}
                   </div>
                )}
              </div>
            </div>
          ) : (
            // Estado de Erro (simulationResult existe mas raw é null)
            <div className="bg-red-50 rounded-xl p-6 text-center border-2 border-red-200">
              <AlertTriangle className="mx-auto text-red-500 mb-2" size={32} />
              <p className="text-red-800 font-semibold">Ocorreu um erro na simulação</p>
              <p className="text-red-600 text-sm">{simulationResult.recommendation}</p>
            </div>
          )
        ) : (
          // Estado Inicial (Placeholder)
          <div className="bg-gray-50 rounded-xl p-8 text-center border-4 border-dashed border-gray-200">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400 border-2 border-gray-200">
               <Dna size={32} />
            </div>
            <h3 className="text-gray-900 font-bold text-lg">Aguardando Simulação</h3>
            <p className="text-gray-500 text-sm mt-1 max-w-xs mx-auto font-medium">
              Selecione o touro e a matriz acima e clique no botão para gerar o relatório genético detalhado.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}