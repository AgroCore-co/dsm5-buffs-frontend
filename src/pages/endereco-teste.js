import { useState } from "react";
import enderecoService from "@/services/enderecoService";

export default function EnderecoTestePage() {
  const [form, setForm] = useState({
    pais: "Brasil",
    estado: "São Paulo",
    cidade: "Presidente Prudente",
    bairro: "Centro",
    rua: "Rua Principal",
    cep: "19000-000",
    numero: "123",
    ponto_referencia: "Próximo à ponte"
  });
  const [token, setToken] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);
    // Validação extra para garantir que todos os campos obrigatórios são strings não vazias
    const obrigatorios = ["pais", "estado", "cidade", "bairro", "rua", "cep"];
    for (const campo of obrigatorios) {
      if (!form[campo] || typeof form[campo] !== "string" || form[campo].trim() === "") {
        setError(`Campo '${campo}' é obrigatório e deve ser uma string não vazia.`);
        setLoading(false);
        return;
      }
    }
    console.log("Payload enviado:", form); // Adicionado log para debug
    try {
      const res = await enderecoService.criarEndereco(form, token);
      setResult(res);
    } catch (err) {
      setError(err.message || JSON.stringify(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 500, margin: "40px auto", padding: 24, background: "#fff", borderRadius: 12, boxShadow: "0 2px 8px #0001" }}>
      <h2 style={{ fontSize: 24, fontWeight: "bold", marginBottom: 16 }}>Teste POST Endereço</h2>
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <input name="token" type="text" value={token} onChange={e => setToken(e.target.value)} placeholder="Token JWT" style={{ padding: 8, borderRadius: 6, border: "1px solid #ccc" }} required />
        <input name="pais" value={form.pais} onChange={handleChange} placeholder="País" required />
        <input name="estado" value={form.estado} onChange={handleChange} placeholder="Estado" required />
        <input name="cidade" value={form.cidade} onChange={handleChange} placeholder="Cidade" required />
        <input name="bairro" value={form.bairro} onChange={handleChange} placeholder="Bairro" required />
        <input name="rua" value={form.rua} onChange={handleChange} placeholder="Rua" required />
        <input name="cep" value={form.cep} onChange={handleChange} placeholder="CEP" required />
        <input name="numero" value={form.numero} onChange={handleChange} placeholder="Número" />
        <input name="ponto_referencia" value={form.ponto_referencia} onChange={handleChange} placeholder="Ponto de Referência" />
        <button type="submit" disabled={loading} style={{ background: "#FFCF78", color: "#222", padding: 10, borderRadius: 6, fontWeight: "bold", border: "none" }}>
          {loading ? "Enviando..." : "Cadastrar Endereço"}
        </button>
      </form>
      {result && (
        <div style={{ marginTop: 20, color: "green" }}>
          <strong>Endereço criado:</strong>
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
