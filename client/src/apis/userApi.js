import axios from "./axiosConfig";

export const getUserInfo = async (uid) => {
  try {
    return await axios.get(`/users/${uid}`);
  } catch (error) {
    throw error;
  }
};

export const updateUserInfo = async ({
  id,
  displayName,
  username,
  email,
  phone,
  password,
}) => {
  try {
    return await axios.put(`/users`, {
      uid: id,
      display_name: displayName,
      username: username,
      email: email,
      phone: phone,
      password: password,
    });
  } catch (error) {
    throw error;
  }
};

export const updateAvatar = async ({ id, avatar }) => {
  try {
    const formData = new FormData();
    formData.append("uid", id);
    formData.append("avatar", avatar);

    return await axios.putForm(`/users/avatar`, formData);
  } catch (error) {
    throw error;
  }
};
