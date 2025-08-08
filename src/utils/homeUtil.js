// Funções para buscar dados do dashboard
// Por enquanto, retornando dados mockados

export const fetchBuffaloStats = async () => {
  // Simular delay de API
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return {
    total: 150,
    females: 105,
    males: 45,
  };
};

export const fetchEmployeeCount = async () => {
  await new Promise(resolve => setTimeout(resolve, 300));
  return 12;
};

export const fetchLactationData = async () => {
  await new Promise(resolve => setTimeout(resolve, 400));
  
  return {
    weekly: [
      { name: "Semana 1", uv: 8.5, count: 85 },
      { name: "Semana 2", uv: 9.2, count: 82 },
      { name: "Semana 3", uv: 8.8, count: 88 },
      { name: "Semana 4", uv: 9.5, count: 90 },
    ],
    monthly: [
      { name: "Jan", uv: 8.5, count: 85 },
      { name: "Fev", uv: 9.2, count: 82 },
      { name: "Mar", uv: 8.8, count: 88 },
      { name: "Abr", uv: 9.5, count: 90 },
      { name: "Mai", uv: 9.8, count: 92 },
      { name: "Jun", uv: 10.2, count: 95 },
      { name: "Jul", uv: 9.9, count: 93 },
      { name: "Ago", uv: 10.5, count: 98 },
      { name: "Set", uv: 10.8, count: 100 },
      { name: "Out", uv: 11.2, count: 102 },
      { name: "Nov", uv: 11.5, count: 105 },
      { name: "Dez", uv: 11.8, count: 108 },
    ],
    yearly: [
      { name: "2020", uv: 8.5, count: 80 },
      { name: "2021", uv: 9.2, count: 85 },
      { name: "2022", uv: 9.8, count: 90 },
      { name: "2023", uv: 10.5, count: 95 },
      { name: "2024", uv: 11.2, count: 100 },
    ],
  };
};

export const fetchTopBuffalos = async () => {
  await new Promise(resolve => setTimeout(resolve, 350));
  
  return {
    buffalos: [
      { name: "Búfala 001", leite: 12.5 },
      { name: "Búfala 045", leite: 11.8 },
      { name: "Búfala 023", leite: 11.2 },
      { name: "Búfala 067", leite: 10.9 },
      { name: "Búfala 089", leite: 10.5 },
    ],
    count: 5,
  };
};

export const fetchProductionSalesData = async () => {
  await new Promise(resolve => setTimeout(resolve, 250));
  
  return {
    lastCollection: {
      amount: 2850,
      date: new Date("2024-01-15"),
    },
    pricePerLiter: 3.85,
    estimatedRevenue: 125000,
  };
};

export const fetchProductionVsCollectionData = async () => {
  await new Promise(resolve => setTimeout(resolve, 400));
  
  return [
    { month: "Jan", producao: 8500, coleta: 8200 },
    { month: "Fev", producao: 9200, coleta: 8900 },
    { month: "Mar", producao: 8800, coleta: 8500 },
    { month: "Abr", producao: 9500, coleta: 9200 },
    { month: "Mai", producao: 9800, coleta: 9500 },
    { month: "Jun", producao: 10200, coleta: 9900 },
    { month: "Jul", producao: 9900, coleta: 9600 },
    { month: "Ago", producao: 10500, coleta: 10200 },
    { month: "Set", producao: 10800, coleta: 10500 },
    { month: "Out", producao: 11200, coleta: 10900 },
    { month: "Nov", producao: 11500, coleta: 11200 },
    { month: "Dez", producao: 11800, coleta: 11500 },
  ];
};

export const fetchProductionChartData = async () => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  return {
    monthly: [
      { name: "Jan", producao: 8500 },
      { name: "Fev", producao: 9200 },
      { name: "Mar", producao: 8800 },
      { name: "Abr", producao: 9500 },
      { name: "Mai", producao: 9800 },
      { name: "Jun", producao: 10200 },
      { name: "Jul", producao: 9900 },
      { name: "Ago", producao: 10500 },
      { name: "Set", producao: 10800 },
      { name: "Out", producao: 11200 },
      { name: "Nov", producao: 11500 },
      { name: "Dez", producao: 11800 },
    ],
    yearly: [
      { name: "2020", producao: 68000 },
      { name: "2021", producao: 78200 },
      { name: "2022", producao: 88200 },
      { name: "2023", producao: 99700 },
      { name: "2024", producao: 112000 },
    ],
  };
};
