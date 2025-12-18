import api from '../api/axiosConfig';

// endpoint base definido no Controller Java
const BASE_URL = '/planos';

const PlanoService = {

  // Consome: GET http://localhost:8080/planos/findById
  // Lista os planos na tabela
  findById: async (id) => {
    try {
      const response = await api.get(`${BASE_URL}/find/${id}`);
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar plano por ID:", error);
      throw error;
    }
  },
  
  // Consome: GET http://localhost:8080/planos/findall
  // Lista os planos na tabela
  findAll: async (page = 0, size = 10) => {
    try {
      // O Spring espera parâmetros de paginação (?page=0&size=10)
      const response = await api.get(`${BASE_URL}/findall`, {
        params: { page, size }
      });
      return response.data; // Retorna o objeto Page do Spring (com .content, .totalPages, etc)
    } catch (error) {
      console.error("Erro ao buscar planos:", error);
      throw error;
    }
  },

  // Consome: POST http://localhost:8080/planos/save
  // Cria novo plano
  save: async (planoData) => {
    try {
      const response = await api.post(`${BASE_URL}/save`, planoData);
      return response.data;
    } catch (error) {
      console.error("Erro ao salvar plano:", error);
      throw error;
    }
  },

  // Consome: DELETE http://localhost:8080/planos/delete/{id}
  // Exclui um plano
  delete: async (id) => {
    try {
      await api.delete(`${BASE_URL}/delete/${id}`);
    } catch (error) {
      console.error("Erro ao deletar plano:", error);
      throw error;
    }
  },

  // Consome: PUT http://localhost:8080/planos/update
  // Edita um plano existente
  update: async (planoData) => {
    try {
      await api.put(`${BASE_URL}/update`, planoData);
    } catch (error) {
      console.error("Erro ao atualizar plano:", error);
      throw error;
    }
  }
};

export default PlanoService;