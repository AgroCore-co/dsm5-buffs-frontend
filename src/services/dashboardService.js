import apiClient from "@/lib/apiClient";

const dashboardService = {
  async getDashboardStatsByPropriedadeId(idPropriedade) {
    try {
      const response = await apiClient.get(`/dashboard/${idPropriedade}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export default dashboardService;
