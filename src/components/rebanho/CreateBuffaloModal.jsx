"use client";
import { useState, useEffect, useContext } from "react";
import { PropertyContext } from "@/contexts/PropertyContext";
import racaService from "@/services/racaService";
import grupoService from "@/services/grupoService";
import { supabase } from "@/lib/supabaseClient";

export default function CreateBuffaloModal({ open, onClose }) {
  const { propriedadeSelecionada } = useContext(PropertyContext);

  const [activeTab, setActiveTab] = useState("basicInfo");
  const [loading, setLoading] = useState(false);
  const [racas, setRacas] = useState([]);
  const [grupos, setGrupos] = useState([]);
  const [formData, setFormData] = useState({
    nome: "",
    brinco: "",
    microchip: "",
    dt_nascimento: "",
    sexo: "",
    raca: "",
    grupo: "",
    categoria: "",
    propriedade: "", // armazena o ID
    pai: "",
    mae: "",
    status: true,
  });

  // Atualiza o formData sempre que a propriedade do contexto mudar
  useEffect(() => {
    if (propriedadeSelecionada) {
      setFormData((prev) => ({
        ...prev,
        propriedade: propriedadeSelecionada.id_propriedade,
      }));
    }
  }, [propriedadeSelecionada]);

  // Carrega raças e grupos ao abrir o modal
  useEffect(() => {
    if (!open) return;

    const carregarDados = async () => {
      try {
        const { data: session } = await supabase.auth.getSession();
        const token = session?.session?.access_token;
        if (!token) return;

        // Raças
        const listaRacas = await racaService.listarRacas(token);
        setRacas(listaRacas);

        // Grupos
        const listaGrupos = await grupoService.listarGrupos(token);
        setGrupos(listaGrupos);
      } catch (error) {
        console.error("Erro ao carregar raças ou grupos:", error);
      }
    };

    carregarDados();
  }, [open]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "status" ? value === "true" : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const requiredFields = [
      "nome",
      "brinco",
      "dt_nascimento",
      "sexo",
      "raca",
      "grupo",
      "categoria",
      "propriedade",
    ];

    for (const field of requiredFields) {
      if (!formData[field]) {
        alert("Preencha todos os campos obrigatórios!");
        return;
      }
    }

    setLoading(true);
    try {
      const res = await fetch("/api/bufalos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Falha ao criar búfalo");

      const data = await res.json();
      console.log("Búfalo criado:", data);
      onClose?.();
    } catch (err) {
      console.error(err);
      alert("Erro ao criar búfalo. Veja o console para mais detalhes.");
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[1001] flex items-center justify-center bg-black/45 backdrop-blur-sm p-4">
      <div>
        <h2>Propriedade selecionada:</h2>
        {propriedadeSelecionada ? (
          <p>{propriedadeSelecionada.nome}</p>
        ) : (
          <p>Nenhuma propriedade selecionada</p>
        )}
      </div>

      <div className="w-[min(96vw,800px)] max-h-[92vh] bg-white rounded-3xl shadow-2xl ring-1 ring-gray-200 flex flex-col overflow-hidden">
        {/* Header e Tabs */}
        <div className="sticky top-0 z-10 border-b bg-white rounded-t-3xl">
          <div className="flex items-center justify-between px-6 py-4">
            <h2 className="text-2xl font-extrabold tracking-tight text-gray-900">
              Cadastrar Novo Búfalo
            </h2>
            <button
              onClick={onClose}
              className="h-10 w-10 grid place-items-center rounded-2xl border border-gray-200 hover:bg-gray-50 text-xl font-bold text-gray-600"
            >
              ×
            </button>
          </div>
          <div className="flex gap-1 px-3 pb-3">
            {["basicInfo", "additionalInfo", "parentage"].map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                  activeTab === tab
                    ? "bg-gray-100 text-gray-900"
                    : "text-gray-600 hover:text-gray-800 hover:bg-gray-50"
                }`}
              >
                {tab === "basicInfo"
                  ? "Dados Básicos"
                  : tab === "additionalInfo"
                  ? "Detalhes Adicionais"
                  : "Filiação"}
              </button>
            ))}
          </div>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="flex-1 overflow-y-auto p-6 space-y-6"
        >
          {/* Basic Info */}
          {activeTab === "basicInfo" && (
            <div className="space-y-6">
              <div className="relative rounded-xl border border-gray-200 bg-white p-5 space-y-4">
                <div className="absolute left-0 top-0 h-full w-1.5 bg-amber-400 rounded-l-xl" />
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Informações Principais
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <input
                    name="nome"
                    value={formData.nome}
                    onChange={handleChange}
                    placeholder="Nome do animal"
                    required
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  />
                  <input
                    name="brinco"
                    value={formData.brinco}
                    onChange={handleChange}
                    placeholder="Brinco/Tag"
                    required
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  />
                  <input
                    name="microchip"
                    value={formData.microchip}
                    onChange={handleChange}
                    placeholder="Microchip (opcional)"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  />
                  <input
                    type="date"
                    name="dt_nascimento"
                    value={formData.dt_nascimento}
                    onChange={handleChange}
                    required
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  />
                  <select
                    name="sexo"
                    value={formData.sexo}
                    onChange={handleChange}
                    required
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  >
                    <option value="">Selecione o sexo</option>
                    <option value="M">Macho</option>
                    <option value="F">Fêmea</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Additional Info */}
          {activeTab === "additionalInfo" && (
            <div className="relative rounded-xl border border-gray-200 bg-white p-5 space-y-4">
              <div className="absolute left-0 top-0 h-full w-1.5 bg-emerald-400 rounded-l-xl" />
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Detalhes Adicionais
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Raça */}
                <select
                  name="raca"
                  value={formData.raca}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                >
                  <option value="">Selecione a Raça</option>
                  {racas.map((r) => (
                    <option key={r.id_raca} value={r.id_raca}>
                      {r.nome}
                    </option>
                  ))}
                </select>

                {/* Grupo */}
                <select
                  name="grupo"
                  value={formData.grupo}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                >
                  <option value="">Selecione o Grupo</option>
                  {grupos.map((g) => (
                    <option key={g.id_grupo} value={g.id_grupo}>
                      {g.nome_grupo} ({g.nivel_maturidade})
                    </option>
                  ))}
                </select>

                <select
                  name="categoria"
                  value={formData.categoria}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                >
                  <option value="">Selecione a Categoria</option>
                  <option>PO</option>
                  <option>PC</option>
                  <option>PA</option>
                  <option>CCG</option>
                  <option>SRD</option>
                </select>

                <input
                  name="propriedade"
                  value={propriedadeSelecionada?.nome || ""}
                  readOnly
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-gray-100 cursor-not-allowed"
                />
              </div>
            </div>
          )}

          {/* Parentage */}
          {activeTab === "parentage" && (
            <div className="relative rounded-xl border border-gray-200 bg-white p-5 space-y-4">
              <div className="absolute left-0 top-0 h-full w-1.5 bg-blue-400 rounded-l-xl" />
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Filiação
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input
                  name="pai"
                  value={formData.pai}
                  onChange={handleChange}
                  placeholder="Pai"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                />
                <input
                  name="mae"
                  value={formData.mae}
                  onChange={handleChange}
                  placeholder="Mãe"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                />
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                >
                  <option value="true">Ativo</option>
                  <option value="false">Inativo</option>
                </select>
              </div>
            </div>
          )}

          {/* Buttons */}
          <div className="sticky bottom-0 flex justify-end gap-2 pt-4 border-t bg-white rounded-b-3xl">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2.5 bg-amber-600 text-white font-medium rounded-xl hover:bg-amber-700 transition-colors shadow-sm disabled:opacity-50"
            >
              {loading ? "Salvando..." : "Salvar Búfalo"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
