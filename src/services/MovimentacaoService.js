import api from '../api/axiosConfig';

const BASE_URL = '/movimentacoes_financeiras';

const MovimentacaoService = {
  // Lista todas as movimentações com paginação
  findAll: async (page = 0, size = 10) => {
    try {
      const params = { page, size };
      const response = await api.get(`${BASE_URL}/findall`, { params });
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar movimentações:", error);
      throw error;
    }
  },

  save: async (movimentacao) => {
    try {
      const response = await api.post(`${BASE_URL}/save`, movimentacao);
      return response.data;
    } catch (error) {
      console.error("Erro ao salvar movimentação:", error);
      throw error;
    }
  }
};

export default MovimentacaoService;