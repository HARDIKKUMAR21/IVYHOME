import axios from 'axios';

const api = axios.create({
    baseURL: '/api',
    headers: {
        'Content-Type': 'application/json',
    }
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const login = async (email, password) => {
    const response = await api.post('/ivy-login', {
        email: (email || '').trim(),
        password: (password || '').trim()
    });
    return response.data;
};

export const getListings = async (params) => {
    const response = await api.get('/listings', { params });
    return response.data;
};

export const getListing = async (id) => {
    const response = await api.get(`/listing/${id}`);
    return response.data;
};

export const getRentals = async (params) => {
    const response = await api.get('/rentals', { params });
    return response.data;
};

export const getProjects = async (params) => {
    const response = await api.get('/projects', { params });
    return response.data;
};

export const getFavourites = async () => {
    const response = await api.get('/favourites');
    return response.data;
};

export const addFavourite = async (id) => {
    const response = await api.post('/favourites', { id });
    return response.data;
};

export const removeFavourite = async (id) => {
    const response = await api.delete(`/favourites/${id}`);
    return response.data;
};

export default api;