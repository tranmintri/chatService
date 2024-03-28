import axios from "axios";

export const postAPI = async (url, post, token) => {
    const res = await axios.post(`http://localhost:4000/api/${url}`, post, {
        headers: { Authorization: token },
    });
    return res;
};

export const patchAPI = async (url, post, token) => {
    const res = await axios.patch(`http://localhost:4000/api/${url}`, post, {
        headers: { Authorization: token },
    });

    return res;
};

export const putAPI = async (url, post, token) => {
    const res = await axios.put(`http://localhost:4000/api/${url}`, post, {
        headers: { Authorization: token },
    });

    return res;
};

export const getAPI = async (url, token) => {
    const res = await axios.get(`http://localhost:4000/api/${url}`, {
        headers: { Authorization: token },
    });
    return res;
};
export const getID = async (url, slug, token) => {
    const res = await axios.get(`http://localhost:4000/api/${url}/${slug}`, {
        headers: { Authorization: token },
    });
    return res;
};

export const deleteAPI = async (url, token) => {
    const res = await axios.delete(`http://localhost:4000/api/${url}`, {
        headers: { Authorization: token },
    });

    return res;
};