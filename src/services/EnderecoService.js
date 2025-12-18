import api from '../api/axiosConfig';

const BASE_URL = '/enderecos';

const EnderecoService = {

  // Consome: GET /enderecos/findall
  findAll: async (page = 0, size = 10) => {
    try {
      const response = await api.get(`${BASE_URL}/findall`, {
        params: { page, size }
      });
      return response.data; 
    } catch (error) {
      console.error("Erro ao buscar endereços:", error);
      throw error;
    }
  },

  // Consome: GET /enderecos/find/{id} 
  findById: async (id) => {
      try {
        const response = await api.get(`${BASE_URL}/find/${id}`);
        return response.data;
      } catch (error) {
        console.error("Erro ao buscar plano por ID:", error);
        throw error;
      }
    },
  
  // Consome: POST /enderecos/save
  save: async (enderecoData) => {
    try {
      const response = await api.post(`${BASE_URL}/save`, enderecoData);
      return response.data;
    } catch (error) {
      console.error("Erro ao salvar endereço:", error);
      throw error;
    }
  },

  // Consome: PUT /enderecos/update
  update: async (enderecoData) => {
    try {
      await api.put(`${BASE_URL}/update`, enderecoData);
    } catch (error) {
      console.error("Erro ao atualizar endereço:", error);
      throw error;
    }
  },

  // Consome: DELETE /enderecos/delete/{id}
  delete: async (id) => {
    try {
      await api.delete(`${BASE_URL}/delete/${id}`);
    } catch (error) {
      console.error("Erro ao deletar endereço:", error);
      throw error;
    }
  }
};

export default EnderecoService;