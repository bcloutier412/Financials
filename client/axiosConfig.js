import axios from 'axios';

const baseURL = process.env.NODE_ENV === "development"
  ? "http://localhost:3000/"
  : "https://financial-tracker-api.vercel.app/"

const app = axios.create({
  baseURL,
  withCredentials: true
})

export default app;