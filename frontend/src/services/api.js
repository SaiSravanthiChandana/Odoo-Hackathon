// import axios from "axios";

// const API = axios.create({
//   baseURL: "http://localhost:5000", // your backend URL
// });

// // Add JWT token to every request if exists
// API.interceptors.request.use((req) => {
//   const token = localStorage.getItem("token");
//   if (token) {
//     req.headers.Authorization = `Bearer ${token}`;
//   }
//   return req;
// });

// export default API;



import axios from "axios";

const API_BASE = "http://localhost:5000"; // change if your backend runs on another port

export const login = (email, password) => {
  return axios.post(`${API_BASE}/auth/login`, { email, password });
};

export const getExpenses = (token) => {
  return axios.get(`${API_BASE}/expenses/my`, {
    headers: { Authorization: token },
  });
};
