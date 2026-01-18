import api from '../api/axiosConfig';

const BASE_URL = '/alunos';

const AlunoService = {

  // Lista todos os alunos (paginado)
  // Consome: GET /alunos/findall?page=0&size=10&search=termo
  findAll: async (page = 0, size = 10, search = '') => {
    try {
      const params = { page, size };
      // Só adiciona o parametro se tiver busca
      if (search) {
          params.search = search;
      }

      const response = await api.get(`${BASE_URL}/findall`, { params });
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar alunos:", error);
      throw error;
    }
  },

  // Busca por ID
  findById: async (id) => {
    try {
      const response = await api.get(`${BASE_URL}/find/${id}`);
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar aluno por ID:", error);
      throw error;
    }
  },

  // Salva novo aluno
  save: async (alunoData) => {
    try {
      const response = await api.post(`${BASE_URL}/save`, alunoData);
      return response.data;
    } catch (error) {
      console.error("Erro ao salvar aluno:", error);
      throw error;
    }
  },

  // Atualiza aluno
  update: async (alunoData) => {
    try {
      await api.put(`${BASE_URL}/update`, alunoData);
    } catch (error) {
      console.error("Erro ao atualizar aluno:", error);
      throw error;
    }
  },

  // Deleta aluno
  delete: async (id) => {
    try {
      await api.delete(`${BASE_URL}/delete/${id}`);
    } catch (error) {
      console.error("Erro ao deletar aluno:", error);
      throw error;
    }
  }
};

export default AlunoService;