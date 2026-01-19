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

const MatriculaService = {
    create,
    findAll
};

export default MatriculaService;