import Head from "next/head";
import { useState } from "react";
import { useRouter } from "next/router";
import { createOwnerProfile, getMyProfile } from "@/services/userService";

export default function CompleteProfile() {
  const [form, setForm] = useState({ nome: "", telefone: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await createOwnerProfile({ nome: form.nome.trim(), telefone: form.telefone.trim() });
      // Buscar perfil criado e redirecionar de acordo com o cargo
      const profile = await getMyProfile();
      if (profile.cargo === "PROPRIETARIO") {
        router.replace("/proprietario");
      } else if (profile.cargo === "ADMIN") {
        router.replace("/admin");
      } else {
        router.replace("/home");
      }
    } catch (err) {
      if (err.response && err.response.status === 409) {
        setError("Perfil já cadastrado.");
      } else if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError("Erro ao criar perfil. Tente novamente.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Complete seu Perfil | Buffs</title>
        <meta name="description" content="Complete seu perfil para acessar o sistema" />
      </Head>
      <div className="p-6 flex flex-col gap-8">
        <div className="w-full flex flex-col bg-white rounded-xl p-6 gap-6 box-border border border-[#e0e0e0] shadow-sm">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Complete seu Perfil</h1>
            <p className="text-gray-600 text-lg">
              Para continuar, precisamos de algumas informações adicionais para personalizar sua experiência.
            </p>
          </div>
        </div>
        <div className="w-full flex flex-col bg-white rounded-xl p-6 gap-6 box-border border border-[#e0e0e0] shadow-sm">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {error && <div className="text-red-600 font-semibold mb-2">{error}</div>}
            <label className="font-medium">Nome completo *</label>
            <input
              name="nome"
              value={form.nome}
              onChange={handleChange}
              required
              maxLength={100}
              className="border rounded px-3 py-2"
              placeholder="Digite seu nome completo"
              disabled={loading}
            />
            <label className="font-medium">Telefone *</label>
            <input
              name="telefone"
              value={form.telefone}
              onChange={handleChange}
              required
              className="border rounded px-3 py-2"
              placeholder="(11) 99999-9999"
              disabled={loading}
            />
            <button
              type="submit"
              className="bg-orange-500 text-white rounded px-6 py-2 mt-4 disabled:opacity-60"
              disabled={loading || !form.nome.trim() || !form.telefone.trim()}
            >
              {loading ? "Salvando..." : "Completar Perfil"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}