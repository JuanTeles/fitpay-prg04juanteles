import axios from "../api/axiosConfig";

const API_URL = "/pagamentos";

const PagamentoService = {
  // Lista todos os pagamentos (paginado + filtros)
  findAll: async (
    page = 0,
    size = 10,
    nome = null,
    metodo = null
  ) => {
    try {
      const params = { page, size };

      // Só adiciona o parametro se tiver valor REAL (não vazio, não null)
      if (nome && nome.trim() !== "") {
        params.nome = nome.trim();
      }

      if (metodo && metodo !== "") {
        params.metodo = metodo;
      }

      const response = await axios.get(`${API_URL}/findall`, { params });
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar pagamentos:", error);
      throw error;
    }
  },

  create: async (pagamentoData) => {
    try {
      const response = await axios.post(`${API_URL}/save`, pagamentoData);
      return response.data;
    } catch (error) {
      console.error("Erro ao registrar pagamento:", error);
      throw error;
    }
  },

  delete: async (id) => {
    try {
      await axios.delete(`${API_URL}/delete/${id}`);
    } catch (error) {
      console.error("Erro ao deletar pagamento:", error);
      throw error;
    }
  }
};

export default PagamentoService;
