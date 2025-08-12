import React, { useEffect, useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { useAuth } from "@/hooks/useAuth";

export default function Configuracoes() {
  const router = useRouter();
  const { isLoading, isAuthenticated } = useAuth();
  const [statusMsg, setStatusMsg] = useState("");
  const [statusType, setStatusType] = useState("success");

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/auth/login");
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading || !isAuthenticated) return null;

  const getStatusColor = () => {
    switch (statusType) {
      case "success": return "bg-green-100 text-green-700";
      case "error": return "bg-red-100 text-red-700";
      case "warning": return "bg-yellow-100 text-yellow-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <>
      <Head>
        <title>Configurações | Buffs</title>
        <meta name="description" content="Configurações da plataforma Buffs" />
      </Head>

      <div className="p-6">
        <div className="w-full bg-white rounded-xl p-5 box-border border border-[#e0e0e0] shadow-sm max-w-3xl">
          <h2 className="text-xl font-bold text-gray-800 mb-6">
            Configurações do Sistema
          </h2>
          
          {/* Configurações Básicas */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">
              Configurações Básicas
            </h3>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="text-sm font-medium text-blue-800 mb-2">
                🌟 Sistema de Configurações
              </h4>
              <ul className="text-xs text-blue-700 space-y-1">
                <li>• Configurações do sistema centralizadas</li>
                <li>• Interface intuitiva e responsiva</li>
                <li>• Sistema de notificações integrado</li>
                <li>• Persistência de dados no navegador</li>
              </ul>
            </div>
          </div>

          {/* Status */}
          {statusMsg && (
            <div className={`inline-block mt-3 text-sm font-medium px-4 py-2 rounded-lg ${getStatusColor()}`}>
              {statusMsg}
            </div>
          )}
        </div>
      </div>
    </>
  );
}


