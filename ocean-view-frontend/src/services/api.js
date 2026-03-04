import axios from "axios";

const api = axios.create({
  baseURL: "/api",
  headers: { "Content-Type": "application/json" },
});

// Attach JWT token to every request
api.interceptors.request.use((config) => {
  const token = sessionStorage.getItem("ovr_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Auto redirect to login on 401
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      sessionStorage.clear();
      window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);

// Auth
export const authApi = {
  login: (data) => api.post("/auth/login", data),
  register: (data) => api.post("/auth/register", data),
};

// Reservations
export const reservationApi = {
  create: (data) => api.post("/reservations", data),
  getAll: () => api.get("/reservations"),
  getByNumber: (num) => api.get(`/reservations/${num}`),
  getBill: (num) => api.get(`/reservations/${num}/bill`),
  update: (num, data) => api.put(`/reservations/${num}`, data),
  delete: (num) => api.delete(`/reservations/${num}`),
  search: (data) => api.post("/reservations/search", data),
};

// Guests
export const guestApi = {
  create: (data) => api.post("/guests", data),
  getAll: () => api.get("/guests"),
  getById: (id) => api.get(`/guests/${id}`),
  search: (query) => api.get(`/guests/search?query=${query}`),
  update: (id, data) => api.put(`/guests/${id}`, data),
  delete: (id) => api.delete(`/guests/${id}`),
};

// Rooms
export const roomApi = {
  create: (data) => api.post("/rooms", data),
  getAll: () => api.get("/rooms"),
  getAvailable: () => api.get("/rooms/available"),
  setAvailability: (id, available) =>
    api.patch(`/rooms/${id}/availability?available=${available}`),
  delete: (id) => api.delete(`/rooms/${id}`),
};

// Admin
export const adminApi = {
  getOccupancyReport: () => api.get("/admin/reports/occupancy"),
};

export default api;
