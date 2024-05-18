import axios from "./axiosConfig";

export const checkUserExists = async (emailOrPhone) => {
  try {
    return await axios.get("/exists", {
      params: {
        email_or_phone: emailOrPhone,
      },
    });
  } catch (error) {
    throw error;
  }
};

export const signUpWithGoogle = async (token, displayName) => {
  try {
    return await axios.post("/signup/google", {
      token: token,
      display_name: displayName,
    });
  } catch (error) {
    throw error;
  }
};

export const signInWithGoogle = async (token) => {
  try {
    return await axios.post("/signin/google", {
      token: token,
    });
  } catch (error) {
    throw error;
  }
};

export const signInWithQRCode = async (token) => {
  try {
    return await axios.post("/signin/qr", {
      token: token,
    });
  } catch (error) {
    throw error;
  }
};

export const signUp = async (displayName, email, username, password) => {
  try {
    return await axios.post("/signup", {
      display_name: displayName,
      email: email,
      username: username,
      password: password,
    });
  } catch (error) {
    throw error;
  }
};

export const signIn = async (username, password) => {
  try {
    return await axios.post("/signin", {
      username: username,
      password: password,
    });
  } catch (error) {
    throw error;
  }
};

export const logout = async (tokenId) => {
  try {
    // return await axios.post("/logout", {
    //     token_id: tokenId,
    // });
  } catch (error) {
    throw error;
  }
};

export const sendVerifyEmail = async (email) => {
  try {
    return await axios.post("/verify/email/send", {
      email: email,
    });
  } catch (error) {
    throw error;
  }
};

export const verifyEmail = async (token) => {
  try {
    return await axios.get("/verify/email", {
      params: {
        token: token,
      },
    });
  } catch (error) {
    throw error;
  }
};

export const forgotPassword = async (email) => {
  try {
    return await axios.post("/forgot-password", {
      email: email,
    });
  } catch (error) {
    throw error;
  }
};

export const resetPassword = async (token, newPassword) => {
  try {
    return await axios.post("/reset-password", {
      token: token,
      password: newPassword,
    });
  } catch (error) {
    throw error;
  }
};

export const changePassword = async ({ uid, currentPassword, newPassword }) => {
  try {
    return await axios.put(`/change-password`, {
      uid: uid,
      current_password: currentPassword,
      new_password: newPassword,
    });
  } catch (error) {
    throw error;
  }
};
