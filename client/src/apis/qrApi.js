import axios from "./axiosConfig";

export const generateLoginQRCode = async () => {
    try {
        return await axios.post(`/qr/generate`);
    } catch (error) {
        throw error;
    }
};
