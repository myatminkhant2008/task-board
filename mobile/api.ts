import axios from "axios";

export const API = axios.create({
  baseURL: "https://task-board-api-ryqi.onrender.com/api",
});
