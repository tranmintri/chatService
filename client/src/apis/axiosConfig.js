import axios from "axios";

const instance = axios.create({
  baseURL: "https://auth.ntt1102.xyz/auth/api/v1/",

  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

export default instance;
