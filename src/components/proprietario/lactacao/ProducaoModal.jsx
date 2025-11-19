"use client";

import { useState, useEffect } from "react";
import bufaloService from "@/services/bufaloService";
import racaService from "@/services/racaService";
import grupoService from "@/services/grupoService";

export default function CriarBufaloModal({ open, onClose, propriedadeId, onSuccess }) {
  const [formData, setFormData] = useState({
    nome: "",
    brinco: "",
    microchip: "",
    dt_nascimento: "",
    nivel_maturidade: "",
    sexo: "",
    id_raca: "",
    id_grupo: "",
    id_pai: "",
    id_mae: "",
    status: true,
    categoria: "",
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [racas, setRacas] = useState([]);
  const [loadingRacas, setLoadingRacas] = useState(false);
  const [grupos, setGrupos] = useState([]);
  const [loadingGrupos, setLoadingGrupos] = useState(false);
  const [touros, setTouros] = useState([]);
  const [loadingTouros, setLoadingTouros] = useState(false);
  const [femeas, setFemeas] = useState([]);
  const [loadingFemeas, setLoadingFemeas] = useState(false);

  // Carregar raças, grupos, touros e fêmeas quando o modal abrir
  useEffect(() => {
    if (open) {
      const fetchRacas = async () => {
        setLoadingRacas(true);
        try {
          const data = await racaService.listarRacas();
          setRacas(data || []);
        } catch (err) {
          console.error("Erro ao carregar raças:", err);
          setRacas([]);
        } finally {
          setLoadingRacas(false);
        }
      };

      const fetchGrupos = async () => {
        if (!propriedadeId) return;
        setLoadingGrupos(true);
        try {
          const response = await grupoService.listarGruposPorPropriedade(propriedadeId, 1, 100);
          setGrupos(response.data || []);
        } catch (err) {
          console.error("Erro ao carregar grupos:", err);
          setGrupos([]);
        } finally {
          setLoadingGrupos(false);
        }
      };

      const fetchTouros = async () => {
        if (!propriedadeId) return;
        setLoadingTouros(true);
        try {
          const response = await bufaloService.filtrarBufalosAvancado({
            idPropriedade: propriedadeId,
            sexo: "M",
            nivelMaturidade: "T",
            status: true,
            limit: 100,
          });
          setTouros(response.data || []);
        } catch (err) {
          console.error("Erro ao carregar touros:", err);
          setTouros([]);
        } finally {
          setLoadingTouros(false);
        }
      };

      const fetchFemeas = async () => {
        if (!propriedadeId) return;
        setLoadingFemeas(true);
        try {
          // Buscar vacas (V) e novilhas (N) ativas
          const [vacas, novilhas] = await Promise.all([
            bufaloService.filtrarBufalosAvancado({
              idPropriedade: propriedadeId,
              sexo: "F",
              nivelMaturidade: "V",
              status: true,
              limit: 100,
            }),
            bufaloService.filtrarBufalosAvancado({
              idPropriedade: propriedadeId,
              sexo: "F",
              nivelMaturidade: "N",
              status: true,
              limit: 100,
            }),
          ]);
          setFemeas([...(vacas.data || []), ...(novilhas.data || [])]);
        } catch (err) {
          console.error("Erro ao carregar fêmeas:", err);
          setFemeas([]);
        } finally {
          setLoadingFemeas(false);
        }
      };

      fetchRacas();
      fetchGrupos();
      fetchTouros();
      fetchFemeas();
    }
  }, [open, propriedadeId]);

  if (!open) return null;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await bufaloService.criarBufalo({
        ...formData,
        id_propriedade: propriedadeId,
      });
      onSuccess();
      onClose();
      // Resetar formulário
      setFormData({
        nome: "",
        brinco: "",
        microchip: "",
        dt_nascimento: "",
        nivel_maturidade: "",
        sexo: "",
        id_raca: "",
        id_grupo: "",
        id_pai: "",
        id_mae: "",
        status: true,
        categoria: "",
      });
    } catch (err) {
      setError("Erro ao criar búfalo. Verifique os dados e tente novamente.");
      console.error("Erro ao criar búfalo:", err);
    } finally {
      setLoading(false);
    }
  };

  // Estilos reutilizáveis para inputs seguindo o design system do modal de produção
  const inputLabelClass = "block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2";
  const inputClass = "w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:ring-2 focus:ring-[#FFCF78] focus:border-[#CE7D0A] transition-all bg-gray-50 hover:bg-white text-gray-800 outline-none placeholder-gray-400";
  const selectClass = "w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:ring-2 focus:ring-[#FFCF78] focus:border-[#CE7D0A] transition-all bg-gray-50 hover:bg-white text-gray-800 outline-none appearance-none cursor-pointer";

  return (
    <div
      className="fixed inset-0 z-[1001] flex items-center justify-center bg-black/45 backdrop-blur-sm p-4"
      role="dialog"
      aria-modal="true"
    >
      <div className="w-[min(96vw,1000px)] max-h-[92vh] bg-white rounded-3xl shadow-2xl ring-1 ring-gray-200 flex flex-col overflow-hidden">
        
        {/* Header Sticky */}
        <div className="sticky top-0 z-10 border-b bg-white rounded-t-3xl">
          <div className="flex items-center justify-between px-6 py-5">
            <div>
              <h2 className="text-2xl font-extrabold tracking-tight text-gray-900">
                Novo Búfalo
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                Preencha os dados para cadastrar um animal no rebanho
              </p>
            </div>
            <button
              onClick={onClose}
              className="h-10 w-10 grid place-items-center rounded-xl border border-gray-200 hover:bg-gray-50 text-xl font-bold text-gray-600 transition-colors"
              aria-label="Fechar modal"
            >
              ×
            </button>
          </div>
        </div>

        {/* Conteúdo Scrollável */}
        <div className="flex-1 p-6 overflow-y-auto bg-gray-50">
          <form onSubmit={handleSubmit} className="max-w-5xl mx-auto">
            
            {/* Card do Formulário */}
            <div className="relative rounded-xl border border-gray-200 bg-white shadow-sm">
              {/* Faixa Decorativa Lateral */}
              <div className="absolute left-0 top-0 h-full w-1.5 bg-[#CE7D0A] rounded-l-xl" />
              
              <div className="p-6 md:p-8">
                <h3 className="text-lg font-bold text-gray-900 mb-6 pb-2 border-b border-gray-100">
                  Dados Principais
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Nome */}
                  <div className="col-span-1 md:col-span-2">
                    <label className={inputLabelClass}>Nome *</label>
                    <input
                      name="nome"
                      type="text"
                      placeholder="Nome do animal"
                      className={inputClass}
                      required
                      value={formData.nome}
                      onChange={handleChange}
                    />
                  </div>

                  {/* Brinco */}
                  <div>
                    <label className={inputLabelClass}>Brinco</label>
                    <input
                      name="brinco"
                      type="text"
                      placeholder="Número do brinco"
                      className={inputClass}
                      value={formData.brinco}
                      onChange={handleChange}
                    />
                  </div>

                  {/* Microchip */}
                  <div>
                    <label className={inputLabelClass}>Microchip</label>
                    <input
                      name="microchip"
                      type="text"
                      placeholder="Código do chip"
                      className={inputClass}
                      value={formData.microchip}
                      onChange={handleChange}
                    />
                  </div>

                  {/* Data de Nascimento */}
                  <div>
                    <label className={inputLabelClass}>Data de Nascimento *</label>
                    <input
                      name="dt_nascimento"
                      type="date"
                      className={inputClass}
                      required
                      value={formData.dt_nascimento}
                      onChange={handleChange}
                    />
                  </div>

                  {/* Sexo */}
                  <div>
                    <label className={inputLabelClass}>Sexo *</label>
                    <div className="relative">
                      <select
                        name="sexo"
                        className={selectClass}
                        required
                        value={formData.sexo}
                        onChange={handleChange}
                      >
                        <option value="">Selecione o sexo</option>
                        <option value="M">Macho</option>
                        <option value="F">Fêmea</option>
                      </select>
                      {/* Ícone Chevron para Select */}
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                        <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"/></svg>
                      </div>
                    </div>
                  </div>

                  {/* Maturidade */}
                  <div>
                    <label className={inputLabelClass}>Nível de Maturidade *</label>
                    <div className="relative">
                      <select
                        name="nivel_maturidade"
                        className={selectClass}
                        required
                        value={formData.nivel_maturidade}
                        onChange={handleChange}
                      >
                        <option value="">Selecione a maturidade</option>
                        <option value="B">Bezerro(a)</option>
                        <option value="N">Novilho(a)</option>
                        <option value="V">Vaca</option>
                        <option value="T">Touro</option>
                        <option value="A">Adulto</option>
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                        <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"/></svg>
                      </div>
                    </div>
                  </div>

                  {/* Raça */}
                  <div>
                    <label className={inputLabelClass}>Raça</label>
                    <div className="relative">
                      <select
                        name="id_raca"
                        className={selectClass}
                        value={formData.id_raca}
                        onChange={handleChange}
                        disabled={loadingRacas}
                      >
                        <option value="">
                          {loadingRacas ? "Carregando..." : "Selecione uma raça"}
                        </option>
                        {racas.map((raca) => (
                          <option key={raca.id_raca} value={raca.id_raca}>
                            {raca.nome}
                          </option>
                        ))}
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                        <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"/></svg>
                      </div>
                    </div>
                  </div>

                  {/* Grupo */}
                  <div>
                    <label className={inputLabelClass}>Grupo</label>
                    <div className="relative">
                      <select
                        name="id_grupo"
                        className={selectClass}
                        value={formData.id_grupo}
                        onChange={handleChange}
                        disabled={loadingGrupos}
                      >
                        <option value="">
                          {loadingGrupos ? "Carregando..." : "Selecione um grupo"}
                        </option>
                        {grupos.map((grupo) => (
                          <option key={grupo.id_grupo} value={grupo.id_grupo}>
                            {grupo.nome_grupo}
                          </option>
                        ))}
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                        <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"/></svg>
                      </div>
                    </div>
                  </div>

                  {/* Categoria */}
                  <div>
                    <label className={inputLabelClass}>Categoria</label>
                    <div className="relative">
                      <select
                        name="categoria"
                        className={selectClass}
                        value={formData.categoria}
                        onChange={handleChange}
                      >
                        <option value="">Selecione a categoria</option>
                        <option value="PO">PO</option>
                        <option value="PC">PC</option>
                        <option value="PA">PA</option>
                        <option value="CCG">CCG</option>
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                        <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"/></svg>
                      </div>
                    </div>
                  </div>

                  {/* Filiação */}
                  <div className="col-span-1 md:col-span-2 border-t border-gray-100 pt-4 mt-2">
                     <h4 className="text-sm font-bold text-gray-700 mb-4">Filiação (Opcional)</h4>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Pai */}
                        <div>
                          <label className={inputLabelClass}>Pai (Touro)</label>
                          <div className="relative">
                            <select
                              name="id_pai"
                              className={selectClass}
                              value={formData.id_pai}
                              onChange={handleChange}
                              disabled={loadingTouros}
                            >
                              <option value="">
                                {loadingTouros ? "Carregando..." : "Selecione o pai"}
                              </option>
                              {touros.map((touro) => (
                                <option key={touro.id_bufalo} value={touro.id_bufalo}>
                                  {touro.nome} {touro.brinco ? `(${touro.brinco})` : ""}
                                </option>
                              ))}
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                              <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"/></svg>
                            </div>
                          </div>
                        </div>

                        {/* Mãe */}
                        <div>
                          <label className={inputLabelClass}>Mãe (Vaca/Novilha)</label>
                          <div className="relative">
                            <select
                              name="id_mae"
                              className={selectClass}
                              value={formData.id_mae}
                              onChange={handleChange}
                              disabled={loadingFemeas}
                            >
                              <option value="">
                                {loadingFemeas ? "Carregando..." : "Selecione a mãe"}
                              </option>
                              {femeas.map((femea) => (
                                <option key={femea.id_bufalo} value={femea.id_bufalo}>
                                  {femea.nome} {femea.brinco ? `(${femea.brinco})` : ""}
                                </option>
                              ))}
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                              <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"/></svg>
                            </div>
                          </div>
                        </div>
                     </div>
                  </div>

                  {/* Status Checkbox - Estilizado */}
                  <div className="col-span-1 md:col-span-2 bg-amber-50/50 rounded-lg p-4 border border-amber-100">
                    <label className="flex items-center space-x-4 cursor-pointer">
                      <div className="relative">
                        <input
                          name="status"
                          type="checkbox"
                          className="sr-only peer"
                          checked={formData.status}
                          onChange={handleChange}
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#CE7D0A]"></div>
                      </div>
                      <div>
                        <span className="text-sm font-bold text-gray-800 block">
                          Búfalo Ativo
                        </span>
                        <span className="text-xs text-gray-500">
                          Marque se o animal já faz parte do rebanho ativo
                        </span>
                      </div>
                    </label>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Mensagem de Erro */}
            {error && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                {error}
              </div>
            )}

            {/* Footer Fixo com Botões */}
            <div className="mt-6 flex items-center justify-end gap-3 pb-6">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2.5 rounded-xl border border-gray-300 text-gray-700 font-medium hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-200"
                disabled={loading}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 bg-[#FFCF78] text-gray-900 font-bold rounded-xl hover:bg-[#F2B84D] transition-all shadow-sm hover:shadow focus:outline-none focus:ring-2 focus:ring-amber-300 disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2"
                disabled={loading}
              >
                {loading ? (
                   <>
                     <svg className="animate-spin h-4 w-4 text-gray-900" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                     Cadastrando...
                   </>
                ) : "Cadastrar Búfalo"}
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}