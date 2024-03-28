import { getUser } from "../utils/UserStorage";
import axios from "./axiosConfig";

export const checkUserExists = async (emailOrPhone) => {
    try {
        return await axios.get("/auth/exists", {
            params: {
                email_or_phone: emailOrPhone
            }
        });
    } catch (error) {
        throw error;
    }
}

export const signUpWithGoogle = async (token, displayName) => {
    try {
        return await axios.post("/auth/signup/google", {
            token: token,
            display_name: displayName,
        })
    } catch (error) {
        throw error;
    }
}

export const signInWithGoogle = async (token) => {
    try {
        return await axios.post("/auth/signin/google", {
            token: token
        })
    } catch (error) {
        throw error;
    }
}

export const signUp = async (displayName, email, username, password) => {
    try {
        return await axios.post("/auth/signup", {
            display_name: displayName,
            email: email,
            username: username,
            password: password
        })
    } catch (error) {
        throw error;
    }
}

export const signIn = async (username, password) => {
    try {
        return await axios.post("/auth/signin", {
            username: username,
            password: password
        })
    } catch (error) {
        throw error;
    }
}

export const logout = async (tokenId) => {
    try {
        return await axios.post("/auth/logout", {
            token_id: tokenId
        })
    } catch (error) {
        throw error;
    }
}

export const sendVerifyEmail = async (email) => {
    try {
        return await axios.post("/auth/verify/email/send", {
            email: email
        });
    } catch (error) {
        throw error;
    }
}

export const getUserInfo = async () => {
    try {
        const user = getUser();
        const uid = user.id;
        return await axios.get(`/auth/users/${uid}`);
    } catch (error) {
        throw error;
    }
}