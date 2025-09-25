import { useState } from "react";
import propriedadeService from "@/services/propriedadeService";

export default function PropriedadeTestePage() {
  const [form, setForm] = useState({
    nome: "Fazenda Santa Clara",
    cnpj: "12.345.678/0001-99",
    id_endereco: "",
    p_abcb: false,
    tipo_manejo: "P"
  });
  const [token, setToken] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);
    // Validação dos campos obrigatórios
    const nome = String(form.nome).trim();
    const cnpj = String(form.cnpj).trim();
    const id_endereco = parseInt(form.id_endereco, 10);
    if (!nome) {
      setError("Campo 'nome' é obrigatório e deve ser uma string não vazia.");
      setLoading(false);
      return;
    }
    if (!cnpj) {
      setError("Campo 'cnpj' é obrigatório e deve ser uma string não vazia.");
      setLoading(false);
      return;
    }
    if (!id_endereco || isNaN(id_endereco)) {
      setError("Campo 'id_endereco' é obrigatório e deve ser um número inteiro.");
      setLoading(false);
      return;
    }
    if (!form.tipo_manejo) {
      setError("Campo 'tipo_manejo' é obrigatório.");
      setLoading(false);
      return;
    }
    const payload = {
      nome,
      cnpj,
      id_endereco,
      p_abcb: Boolean(form.p_abcb),
      tipo_manejo: form.tipo_manejo
    };
    console.log("Payload propriedade enviado:", payload, {
      nomeType: typeof nome,
      cnpjType: typeof cnpj,
      id_enderecoType: typeof id_endereco,
      p_abcbType: typeof payload.p_abcb,
      tipo_manejoType: typeof payload.tipo_manejo
    });
    try {
      const res = await propriedadeService.criarPropriedade(payload, token);
      setResult(res);
    } catch (err) {
      setError(err.message || JSON.stringify(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 500, margin: "40px auto", padding: 24, background: "#fff", borderRadius: 12, boxShadow: "0 2px 8px #0001" }}>
      <h2 style={{ fontSize: 24, fontWeight: "bold", marginBottom: 16 }}>Teste POST Propriedade</h2>
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <input name="token" type="text" value={token} onChange={e => setToken(e.target.value)} placeholder="Token JWT" style={{ padding: 8, borderRadius: 6, border: "1px solid #ccc" }} required />
        <input name="nome" value={form.nome} onChange={handleChange} placeholder="Nome da Propriedade" required />
        <input name="cnpj" value={form.cnpj} onChange={handleChange} placeholder="CNPJ" required />
        <input name="id_endereco" value={form.id_endereco} onChange={handleChange} placeholder="ID do Endereço" required />
        <select name="tipo_manejo" value={form.tipo_manejo} onChange={handleChange} required>
          <option value="">Selecione o tipo de manejo</option>
          <option value="P">P - Pecuária</option>
          <option value="E">E - Extensivo</option>
          <option value="I">I - Intensivo</option>
        </select>
        <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <input name="p_abcb" type="checkbox" checked={form.p_abcb} onChange={handleChange} />
          Propriedade ABCB
        </label>
        <button type="submit" disabled={loading} style={{ background: "#FFCF78", color: "#222", padding: 10, borderRadius: 6, fontWeight: "bold", border: "none" }}>
          {loading ? "Enviando..." : "Cadastrar Propriedade"}
        </button>
      </form>
      {result && (
        <div style={{ marginTop: 20, color: "green" }}>
          <strong>Propriedade criada:</strong>
          <pre>{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}
      {error && (
        <div style={{ marginTop: 20, color: "red" }}>
          <strong>Erro:</strong> {error}
        </div>
      )}
    </div>
  );
}
