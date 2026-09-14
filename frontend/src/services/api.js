import axios from 'axios';

const API_KEY = 'IVY26-ED62B530A404';

const api = axios.create({
    baseURL: 'https://solve.ivy.homes',
    headers: {
        'X-API-Key': API_KEY,
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
    const response = await api.post('/auth/login', { email, password });
    return response.data;
};

export const getListings = async (params) => {
    const response = await api.get('/v1/listings', { params });
    return response.data;
};

export const getListing = async (id) => {
    const response = await api.get(`/v1/listing/${id}`);
    return response.data;
};

export const getRentals = async (params) => {
    const response = await api.get('/v1/rentals', { params });
    return response.data;
};

export const getProjects = async (params) => {
    const response = await api.get('/v1/projects', { params });
    return response.data;
};

export const getFavourites = async () => {
    const response = await api.get('/v1/favourites');
    return response.data;
};

export const addFavourite = async (id) => {
    const response = await api.post('/v1/favourites', { id });
    return response.data;
};

export const removeFavourite = async (id) => {
    const response = await api.delete(`/v1/favourites/${id}`);
    return response.data;
};

export default api;