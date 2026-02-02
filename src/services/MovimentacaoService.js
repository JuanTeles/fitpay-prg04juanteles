import api from '../api/axiosConfig';

const BASE_URL = '/movimentacoes_financeiras';

const MovimentacaoService = {
  findAll: async (
    page = 0,
    size = 10,
    tipo = '',
    categoria = '',
    sort = 'dataHora,desc'
  ) => {
    try {
      const params = { page, size, sort };

      // Só adiciona se tiver valor
      if (tipo) params.tipo = tipo;
      if (categoria) params.categoria = categoria;

      const response = await api.get(`${BASE_URL}/findall`, { params });
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar movimentações:', error);
      throw error;
    }
  },

  save: async (movimentacao) => {
    const response = await api.post(`${BASE_URL}/save`, movimentacao);
    return response.data;
  }
};

export default MovimentacaoService;
