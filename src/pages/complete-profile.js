"use client"

import { useState, useMemo } from "react"
import { useRouter } from "next/router"
import { useAuth } from "@/hooks/useAuth"
import Head from "next/head"

const CompleteProfile = () => {
  const [formData, setFormData] = useState({ nome: "", telefone: "" })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")

  const { createProfile, user } = useAuth()
  const router = useRouter()

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const isFormValid = useMemo(() => {
    const nome = String(formData.nome).trim()
    const telefone = String(formData.telefone).trim()
    return nome.length > 0 && nome.length <= 100 && telefone.length > 0
  }, [formData])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setIsSubmitting(true)
    try {
      const payload = {
        nome: String(formData.nome || "")
          .trim()
          .slice(0, 100),
        telefone: String(formData.telefone || "").trim(),
      }
      const result = await createProfile(payload)
      if (result.success) router.push("/dashboard")
      else setError(result.error || "Erro ao criar perfil")
    } catch (err) {
      setError("Erro inesperado ao criar perfil")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <Head>
        <title>Complete seu Perfil | Buffs</title>
        <meta name="description" content="Complete seu perfil para acessar o sistema" />
      </Head>

      <div className="p-6 flex flex-col gap-8">
        {/* Header Section - Following propriedade page pattern */}
        <div className="w-full flex flex-col bg-white rounded-xl p-6 gap-6 box-border border border-[#e0e0e0] shadow-sm">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Complete seu Perfil</h1>
            <p className="text-gray-600 text-lg">
              Olá {user?.email}! Para continuar, precisamos de algumas informações adicionais para personalizar sua
              experiência.
            </p>
          </div>
        </div>

        {/* Form Section - Updated with propriedade page styling */}
        <div className="w-full flex flex-col bg-white rounded-xl p-6 gap-6 box-border border border-[#e0e0e0] shadow-sm">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="w-full flex flex-row gap-4 p-4 bg-gradient-to-br from-red-50 to-red-100 rounded-xl box-border border border-red-200 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-red-500 flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-xs font-bold">!</span>
                  </div>
                  <p className="text-red-700 font-medium">{error}</p>
                </div>
              </div>
            )}

           

            {/* Form Fields - Updated styling */}
            <div className="w-full flex flex-col bg-white rounded-xl p-5 gap-6 box-border border border-[#e0e0e0] shadow-sm">
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Informações Pessoais</h2>
                <p className="text-gray-600">Preencha os dados abaixo para completar seu perfil no sistema.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Nome Field */}
                <div className="bg-gradient-to-br from-white to-orange-50 p-6 rounded-xl border border-[#FFCF78] shadow-sm">
                  <label htmlFor="nome" className="block text-lg font-semibold text-gray-800 mb-3">
                    Nome Completo *
                  </label>
                  <input
                    id="nome"
                    name="nome"
                    type="text"
                    required
                    maxLength={100}
                    value={formData.nome}
                    onChange={handleChange}
                    placeholder="Digite seu nome completo"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FFCF78] focus:border-[#FFCF78] transition-colors bg-white"
                  />
                  <p className="text-sm text-gray-500 mt-2">Como você gostaria de ser chamado no sistema</p>
                </div>

                {/* Telefone Field */}
                <div className="bg-gradient-to-br from-white to-blue-50 p-6 rounded-xl border border-blue-200 shadow-sm">
                  <label htmlFor="telefone" className="block text-lg font-semibold text-gray-800 mb-3">
                    Telefone *
                  </label>
                  <input
                    id="telefone"
                    name="telefone"
                    type="tel"
                    required
                    value={formData.telefone}
                    onChange={handleChange}
                    placeholder="(11) 99999-9999"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white"
                  />
                  <p className="text-sm text-gray-500 mt-2">Para contato e notificações importantes</p>
                </div>
              </div>
            </div>


            {/* Submit Button - Updated styling */}
            <div className="w-full flex flex-col bg-white rounded-xl p-5 gap-4 box-border border border-[#e0e0e0] shadow-sm">
              <div className="text-center">
                <button
                  type="submit"
                  disabled={isSubmitting || !isFormValid}
                  className="bg-[#CE7D0A] hover:bg-[#FFCF78] hover:text-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed
                    text-white py-4 px-12 rounded-xl font-semibold text-lg transition-all duration-200 
                    focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FFCF78]
                    shadow-lg hover:shadow-xl disabled:shadow-none transform hover:scale-105 disabled:transform-none"
                >
                  {isSubmitting ? (
                    <div className="flex items-center gap-3">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Salvando perfil...
                    </div>
                  ) : (
                    "Completar Perfil"
                  )}
                </button>
              </div>

              {/* Help Text */}
              <div className="text-center">
                <p className="text-sm text-gray-500">
                  Suas informações são seguras e serão usadas apenas para melhorar sua experiência no sistema.
                </p>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}

export default CompleteProfile
