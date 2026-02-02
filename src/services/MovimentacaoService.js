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

  // Busca por ID para preencher o formulário de edição
  findById: async (id) => {
    try {
      const response = await api.get(`${BASE_URL}/find/${id}`);
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar movimentação por ID:", error);
      throw error;
    }
  },

  save: async (movimentacao) => {
    const response = await api.post(`${BASE_URL}/save`, movimentacao);
    return response.data;
  },

  // método de atualização (PUT)
  update: async (movimentacao) => {
    try {
      const response = await api.put(`${BASE_URL}/update`, movimentacao);
      return response.data;
    } catch (error) {
      console.error("Erro ao atualizar movimentação:", error);
      throw error;
    }
  },

  // método de exclusão (DELETE)
  delete: async (id) => {
    try {
      await api.delete(`${BASE_URL}/delete/${id}`);
    } catch (error) {
      console.error("Erro ao deletar movimentação:", error);
      throw error;
    }
  }
};

export default MovimentacaoService;
