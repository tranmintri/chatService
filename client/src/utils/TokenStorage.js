const STORAGE_ID = "DRAFI_TOKEN";

export const saveToken = (token) => {
    localStorage.setItem(STORAGE_ID, JSON.stringify(token));
}

export const getToken = () => {
    const token = localStorage.getItem(STORAGE_ID);
    return token ? JSON.parse(token) : undefined;
}

export const removeToken = () => {
    localStorage.removeItem(STORAGE_ID);
}
