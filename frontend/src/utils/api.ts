// src/utils/api.ts
import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3001", // URL ของ Backend NestJS
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
