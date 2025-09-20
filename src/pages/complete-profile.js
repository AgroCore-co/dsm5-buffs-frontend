import { useState, useMemo } from "react";
import { useRouter } from "next/router";
import { useAuth } from "@/hooks/useAuth";

const CompleteProfile = () => {
  const [formData, setFormData] = useState({ nome: "", telefone: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const { createProfile, user } = useAuth();
  const router = useRouter();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const isFormValid = useMemo(() => {
    const nome = String(formData.nome).trim();
    const telefone = String(formData.telefone).trim();
    return nome.length > 0 && nome.length <= 100 && telefone.length > 0;
  }, [formData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const payload = {
        nome: String(formData.nome || "")
          .trim()
          .slice(0, 100),
        telefone: String(formData.telefone || "").trim(),
        id_endereco: 1, // fixo
      };

      console.log("Payload enviado:", payload); // verificar no console
      const result = await createProfile(payload);

      if (result.success) router.push("/dashboard");
      else setError(result.error || "Erro ao criar perfil");
    } catch (err) {
      console.error("Erro ao criar perfil:", err);
      setError("Erro inesperado ao criar perfil");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Complete seu Perfil
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Olá {user?.email}! Para continuar, precisamos de algumas informações
          adicionais.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
                {error}
              </div>
            )}

            <div>
              <label
                htmlFor="nome"
                className="block text-sm font-medium text-gray-700"
              >
                Nome Completo *
              </label>
              <div className="mt-1">
                <input
                  id="nome"
                  name="nome"
                  type="text"
                  required
                  maxLength={100}
                  value={formData.nome}
                  onChange={handleChange}
                  placeholder="Seu nome completo"
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="telefone"
                className="block text-sm font-medium text-gray-700"
              >
                Telefone *
              </label>
              <div className="mt-1">
                <input
                  id="telefone"
                  name="telefone"
                  type="tel"
                  required
                  value={formData.telefone}
                  onChange={handleChange}
                  placeholder="(11) 99999-9999"
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isSubmitting || !isFormValid}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Salvando..." : "Completar Perfil"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CompleteProfile;
