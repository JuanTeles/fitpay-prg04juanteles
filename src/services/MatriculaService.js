import axios from "../api/axiosConfig";

const API_URL = "/matriculas";

const create = async (matriculaData) => {
    const response = await axios.post(`${API_URL}/save`, matriculaData);
    return response.data;
};

const findAll = async (page = 0, size = 10) => {
    // Chama o endpoint de listagem paginada
    const response = await axios.get(`${API_URL}/findall`, {
        params: { page, size }
    });
    return response.data;
};

const findByAluno = async (alunoId) => {
    const response = await axios.get(`${API_URL}/aluno/${alunoId}`);
    return response.data;
};

const update = async (matriculaData) => {
    const response = await axios.put(`${API_URL}/update`, matriculaData);
    return response.data;
};

const getNovasNoMes = async () => {
    const response = await axios.get(`${API_URL}/dashboard/novas-no-mes`);
    return response.data;
};

const getARenovar = async () => {
    const response = await axios.get(`${API_URL}/dashboard/a-renovar`);
    return response.data;
};

const MatriculaService = {
    create,
    findAll,
    findByAluno,
    getNovasNoMes,
    getARenovar
};

export default MatriculaService;