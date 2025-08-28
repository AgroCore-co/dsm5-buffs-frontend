import React, { useEffect } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { useAuth } from "@/hooks/useAuth";
import loteService from "@/services/loteService.js";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  AreaChart,
  Area,
} from "recharts";
import dynamic from "next/dynamic";

const MapaPiquetes = dynamic(() => import("@/components/MapaPiquetes"), {
  ssr: false, // desativa renderização no servidor
});

export default function Manejo() {
  const router = useRouter();
  const { user, isLoading, isAuthenticated, getAccessToken } = useAuth();

  // Dados mockados para manejo

  const distribuicaoPorTipoData = [
    { tipo: "Lactação", quantidade: 45, percentual: 30 },
    { tipo: "Gestação", quantidade: 35, percentual: 23 },
    { tipo: "Recria", quantidade: 25, percentual: 17 },
    { tipo: "Terminação", quantidade: 20, percentual: 13 },
    { tipo: "Reprodução", quantidade: 15, percentual: 10 },
    { tipo: "Quarentena", quantidade: 10, percentual: 7 },
  ];

  const lotesMock = [
    {
      id: 1,
      nome: "Lote A - Lactação",
      capacidade: 50,
      ocupacao: 45,
      area: 5000,
      unidade: "m²",
      status: "Em uso",
      propriedade: "Fazenda Principal",
    },
    {
      id: 2,
      nome: "Lote B - Gestação",
      capacidade: 40,
      ocupacao: 35,
      area: 4000,
      unidade: "m²",
      status: "Em uso",
      propriedade: "Fazenda Principal",
    },
    {
      id: 3,
      nome: "Lote C - Recria",
      capacidade: 30,
      ocupacao: 25,
      area: 3000,
      unidade: "m²",
      status: "Em uso",
      propriedade: "Fazenda Secundária",
    },
    {
      id: 4,
      nome: "Lote D - Terminação",
      capacidade: 25,
      ocupacao: 20,
      area: 2500,
      unidade: "m²",
      status: "Em uso",
      propriedade: "Fazenda Secundária",
    },
    {
      id: 5,
      nome: "Lote E - Reprodução",
      capacidade: 20,
      ocupacao: 15,
      area: 2000,
      unidade: "m²",
      status: "Em uso",
      propriedade: "Fazenda Principal",
    },
    {
      id: 6,
      nome: "Lote F - Quarentena",
      capacidade: 15,
      ocupacao: 10,
      area: 1500,
      unidade: "m²",
      status: "Em uso",
      propriedade: "Fazenda Principal",
    },
    {
      id: 7,
      nome: "Lote G - Disponível",
      capacidade: 35,
      ocupacao: 0,
      area: 3500,
      unidade: "m²",
      status: "Disponível",
      propriedade: "Fazenda Secundária",
    },
    {
      id: 8,
      nome: "Lote H - Manutenção",
      capacidade: 25,
      ocupacao: 0,
      area: 2500,
      unidade: "m²",
      status: "Manutenção",
      propriedade: "Fazenda Principal",
    },
  ];

  const ciclosMock = [
    {
      id: 1,
      nome: "Ciclo de Lactação 2024/1",
      periodo: "01/01/2024 - 30/06/2024",
      grupo: "Búfalas Lactantes A",
      status: "Em andamento",
      lote: "Lote A - Lactação",
    },
    {
      id: 2,
      nome: "Ciclo de Gestação 2024/1",
      periodo: "01/02/2024 - 01/11/2024",
      grupo: "Búfalas Gestantes",
      status: "Em andamento",
      lote: "Lote B - Gestação",
    },
    {
      id: 3,
      nome: "Ciclo de Recria 2024/1",
      periodo: "01/03/2024 - 31/08/2024",
      grupo: "Bezerros em Recria",
      status: "Em andamento",
      lote: "Lote C - Recria",
    },
    {
      id: 4,
      nome: "Ciclo de Terminação 2024/1",
      periodo: "01/04/2024 - 30/09/2024",
      grupo: "Búfalos em Terminação",
      status: "Em andamento",
      lote: "Lote D - Terminação",
    },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case "Em uso":
        return "bg-[#9DFFBE] text-gray-800";
      case "Disponível":
        return "bg-[#FFCF78] text-gray-800";
      case "Manutenção":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatStatus = (status) => {
    return status || "Desconhecido";
  };

  const calcularOcupacaoPercentual = (ocupacao, capacidade) => {
    return capacidade > 0 ? Math.round((ocupacao / capacidade) * 100) : 0;
  };

  useEffect(() => {
    // Redirecionar para login se não estiver autenticado (mas só após carregar)
    if (!isLoading && !isAuthenticated) {
      router.push("/auth/login");
    }
  }, [isLoading, isAuthenticated, router]);

  // Não mostrar nada se estiver carregando ou não autenticado
  if (isLoading || !isAuthenticated) {
    return null;
  }

  return (
    <>
      <Head>
        <title>Manejo do Rebanho | Buffs</title>
        <meta
          name="description"
          content="Gestão de lotes e manejo do rebanho"
        />
      </Head>

      <div className="p-6 flex flex-col gap-8"></div>
    </>
  );
}
