const USER_STORAGE = "DRAFI_USER";

export const saveUser = (user) => {
    localStorage.setItem(USER_STORAGE, JSON.stringify(user));
}

export const getUser = () => {
    const user = localStorage.getItem(USER_STORAGE);
    return user ? JSON.parse(user) : undefined;
}

export const removeUser = () => {
    localStorage.removeItem(USER_STORAGE);
}