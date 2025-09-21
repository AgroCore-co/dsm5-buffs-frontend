"use client"
import { useState, useEffect } from "react"
import bufaloService from "@/services/bufaloService"
import racaService from "@/services/racaService"
import grupoService from "@/services/grupoService"
import { supabase } from "@/lib/supabaseClient"
import { useProperty } from "@/hooks/useProperty"

export default function CreateBuffaloModal({ open, onClose }) {
  const { propriedadeSelecionada } = useProperty()

  const [activeTab, setActiveTab] = useState("basicInfo")
  const [loading, setLoading] = useState(false)

  const [racas, setRacas] = useState([])
  const [grupos, setGrupos] = useState([])
  const [pais, setPais] = useState([])
  const [maes, setMaes] = useState([])

  const [formData, setFormData] = useState({
    nome: "",
    brinco: "",
    microchip: "",
    dtNascimento: "",
    sexo: "",
    nivelMaturidade: "",
    idRaca: "",
    idPropriedade: "",
    idGrupo: "",
    idPai: "",
    idMae: "",
    status: true,
    categoria: "",
  })

  useEffect(() => {
    if (propriedadeSelecionada && propriedadeSelecionada.id_propriedade) {
      setFormData((prev) => ({
        ...prev,
        idPropriedade: propriedadeSelecionada.id_propriedade,
      }))
    }
  }, [propriedadeSelecionada])

  // Carrega dados ao abrir
  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: session } = await supabase.auth.getSession()
        const token = session?.session?.access_token
        if (!token) throw new Error("Token de autenticação não encontrado")

        const listaRacas = await racaService.listarRacas(token)
        setRacas(Array.isArray(listaRacas) ? listaRacas.sort((a, b) => a.nome.localeCompare(b.nome, "pt-BR")) : [])

        const listaGrupos = await grupoService.listarGrupos(token)
        setGrupos(
          Array.isArray(listaGrupos)
            ? listaGrupos.sort((a, b) => a.nome_grupo.localeCompare(b.nome_grupo, "pt-BR"))
            : [],
        )

        const listaBufalos = await bufaloService.listarBufalos(token)
        const ativos = Array.isArray(listaBufalos) ? listaBufalos.filter((b) => b.status === true) : []
        setPais(ativos.filter((b) => b.sexo === "M"))
        setMaes(ativos.filter((b) => b.sexo === "F"))
      } catch (err) {
        console.error("Erro ao carregar dados:", err)
      }
    }

    if (open) fetchData()
  }, [open])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: name === "status" ? value === "true" : value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Validações
      let nome = formData.nome?.trim() || ""
      if (!nome) {
        alert("O campo Nome é obrigatório.")
        setLoading(false)
        return
      }
      if (nome.length > 50) {
        alert("O campo Nome deve ter no máximo 50 caracteres.")
        setLoading(false)
        return
      }

      let sexo = formData.sexo?.trim() || ""
      if (!["F", "M"].includes(sexo)) {
        alert("O campo Sexo é obrigatório e deve ser 'M' ou 'F'.")
        setLoading(false)
        return
      }

      let idPropriedade = Number(propriedadeSelecionada?.id_propriedade)
      if (!idPropriedade || isNaN(idPropriedade) || idPropriedade <= 0) {
        alert("Nenhuma propriedade válida selecionada.")
        setLoading(false)
        return
      }

      const { data: session } = await supabase.auth.getSession()
      const token = session?.session?.access_token
      if (!token) throw new Error("Token de autenticação não encontrado")

      // Monta payload
      const payload = {
        nome: String(nome),
        sexo: String(sexo),
        id_propriedade: idPropriedade,
        status: formData.status === true || formData.status === "true",
      }
      if (formData.brinco?.trim()) payload.brinco = formData.brinco.trim()
      if (formData.microchip?.trim()) payload.microchip = formData.microchip.trim()
      if (formData.dtNascimento) payload.dt_nascimento = new Date(formData.dtNascimento).toISOString()
      if (formData.nivelMaturidade) payload.nivel_maturidade = formData.nivelMaturidade
      if (formData.idRaca) payload.id_raca = Number(formData.idRaca)
      if (formData.idGrupo) payload.id_grupo = Number(formData.idGrupo)
      if (formData.idPai) payload.id_pai = Number(formData.idPai)
      if (formData.idMae) payload.id_mae = Number(formData.idMae)
      if (formData.categoria?.trim()) payload.categoria = formData.categoria.trim()

      console.log("Payload final (snake_case):", payload)

      // Faz o POST direto
      const url = `${process.env.NEXT_PUBLIC_API_URL}/bufalos`
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      })

      const data = await response.json() // só chamamos uma vez!

      if (!response.ok) {
        throw new Error(data.message || `Erro HTTP: ${response.status}`)
      }

      console.log("Status:", response.status)
      console.log("Resposta:", data)

      alert("Búfalo criado com sucesso!")

      // Reset form
      setFormData({
        nome: "",
        brinco: "",
        microchip: "",
        dtNascimento: "",
        sexo: "",
        nivelMaturidade: "",
        idRaca: "",
        idPropriedade: idPropriedade,
        idGrupo: "",
        idPai: "",
        idMae: "",
        status: true,
        categoria: "",
      })

      onClose?.()
    } catch (err) {
      if (err.message?.includes("nome must be")) {
        alert("Erro: Verifique o campo Nome. Deve ter entre 1 e 50 caracteres.")
      } else if (err.message?.includes("sexo")) {
        alert("Erro: Selecione o sexo do animal (Macho ou Fêmea).")
      } else if (err.message?.includes("idPropriedade")) {
        alert("Erro: Problema com a propriedade. Verifique se uma propriedade está selecionada.")
      } else {
        alert(`Erro: ${err.message || "Erro desconhecido"}`)
      }
      console.error("Erro ao criar búfalo:", err)
    } finally {
      setLoading(false)
    }
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-[1001] flex items-center justify-center bg-black/45 backdrop-blur-sm p-4">
      <div className="w-[min(96vw,800px)] max-h-[92vh] bg-white rounded-3xl shadow-2xl ring-1 ring-gray-200 flex flex-col overflow-hidden">
        {/* Header e Tabs */}
        <div className="sticky top-0 z-10 border-b bg-white rounded-t-3xl">
          <div className="flex items-center justify-between px-6 py-4">
            <h2 className="text-2xl font-extrabold tracking-tight text-gray-900">Cadastrar Novo Búfalo</h2>
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
                  activeTab === tab ? "bg-gray-100 text-gray-900" : "text-gray-600 hover:text-gray-800 hover:bg-gray-50"
                }`}
              >
                {tab === "basicInfo" && "Dados Básicos"}
                {tab === "additionalInfo" && "Detalhes Adicionais"}
                {tab === "parentage" && "Filiação"}
              </button>
            ))}
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Basic Info */}
          {activeTab === "basicInfo" && (
            <div className="space-y-6">
              <div className="relative rounded-xl border border-gray-200 bg-white p-5 space-y-4">
                <div className="absolute left-0 top-0 h-full w-1.5 bg-amber-400 rounded-l-xl" />
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Informações Principais</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="relative">
                    <input
                      name="nome"
                      value={formData.nome}
                      onChange={handleChange}
                      placeholder="Nome *"
                      maxLength="50"
                      className={`w-full border rounded-lg px-3 py-2 ${
                        !formData.nome ? "border-red-300 bg-red-50" : "border-gray-300"
                      }`}
                      required
                    />
                    <div className="text-xs text-gray-500 mt-1">{formData.nome.length}/50 caracteres</div>
                  </div>
                  <input
                    name="brinco"
                    value={formData.brinco}
                    onChange={handleChange}
                    placeholder="Brinco"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  />
                  <input
                    name="microchip"
                    value={formData.microchip}
                    onChange={handleChange}
                    placeholder="Microchip"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  />
                  <input
                    type="date"
                    name="dtNascimento"
                    value={formData.dtNascimento}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  />
                  <select
                    name="sexo"
                    value={formData.sexo}
                    onChange={handleChange}
                    className={`w-full border rounded-lg px-3 py-2 ${
                      !formData.sexo ? "border-red-300 bg-red-50" : "border-gray-300"
                    }`}
                    required
                  >
                    <option value="">Selecione o sexo *</option>
                    <option value="M">Macho</option>
                    <option value="F">Fêmea</option>
                  </select>
                  <select
                    name="nivelMaturidade"
                    value={formData.nivelMaturidade}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  >
                    <option value="">Selecione o nível de maturidade</option>
                    <option value="B">Bezerro(a)</option>
                    <option value="N">Novilho(a)</option>
                    <option value="V">Vaca/Vaca Jovem</option>
                    <option value="T">Touro</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Additional Info */}
          {activeTab === "additionalInfo" && (
            <div className="relative rounded-xl border border-gray-200 bg-white p-5 space-y-4">
              <div className="absolute left-0 top-0 h-full w-1.5 bg-emerald-400 rounded-l-xl" />
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Detalhes Adicionais</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <select
                  name="idRaca"
                  value={formData.idRaca}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                >
                  <option value="">Selecione a Raça</option>
                  {racas.map((raca) => (
                    <option key={raca.id_raca} value={raca.id_raca}>
                      {raca.nome}
                    </option>
                  ))}
                </select>

                <select
                  name="idGrupo"
                  value={formData.idGrupo}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                >
                  <option value="">Selecione o Grupo</option>
                  {grupos.map((grupo) => (
                    <option key={grupo.id_grupo} value={grupo.id_grupo}>
                      {grupo.nome_grupo} ({grupo.nivel_maturidade})
                    </option>
                  ))}
                </select>

                <select
                  name="categoria"
                  value={formData.categoria}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                >
                  <option value="">Selecione a Categoria</option>
                  <option value="PO">PO</option>
                  <option value="PC">PC</option>
                  <option value="PA">PA</option>
                  <option value="CCG">CCG</option>
                  <option value="SRD">SRD</option>
                </select>

                <div className="relative">
                  <input
                    name="idPropriedade"
                    value={
                      propriedadeSelecionada
                        ? `${propriedadeSelecionada.id_propriedade} - ${propriedadeSelecionada.nome}`
                        : "Nenhuma propriedade selecionada"
                    }
                    readOnly
                    className={`w-full border rounded-lg px-3 py-2 cursor-not-allowed ${
                      !propriedadeSelecionada ? "border-red-300 bg-red-50" : "border-gray-300 bg-gray-100"
                    }`}
                  />
                  {!propriedadeSelecionada && (
                    <div className="text-xs text-red-600 mt-1">* Propriedade é obrigatória</div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Parentage */}
          {activeTab === "parentage" && (
            <div className="relative rounded-xl border border-gray-200 bg-white p-5 space-y-4">
              <div className="absolute left-0 top-0 h-full w-1.5 bg-blue-400 rounded-l-xl" />
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Filiação</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <select
                  name="idPai"
                  value={formData.idPai}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                >
                  <option value="">Selecione o Pai</option>
                  {pais.map((p) => (
                    <option key={p.id_bufalo} value={p.id_bufalo}>
                      {p.nome} ({p.brinco}) {p.categoria ? `- ${p.categoria}` : ""}
                    </option>
                  ))}
                </select>

                <select
                  name="idMae"
                  value={formData.idMae}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                >
                  <option value="">Selecione a Mãe</option>
                  {maes.map((m) => (
                    <option key={m.id_bufalo} value={m.id_bufalo}>
                      {m.nome} ({m.brinco}) {m.categoria ? `- ${m.categoria}` : ""}
                    </option>
                  ))}
                </select>

                <select
                  name="status"
                  value={formData.status === true ? "true" : "false"}
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
              disabled={loading || !formData.nome || !formData.sexo || !propriedadeSelecionada}
              className="px-5 py-2.5 bg-amber-600 text-white font-medium rounded-xl hover:bg-amber-700 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Salvando..." : "Salvar Búfalo"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
