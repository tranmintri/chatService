import { useMutation } from "@tanstack/react-query";
import { signIn } from "./authApi";
import { saveUser } from "../utils/UserStorage";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import Page from "../constants/Page";
import { saveToken } from "../utils/TokenStorage";
import { reducerCases } from "../context/constants";
import { useStateProvider } from "../context/StateContext";
export const useSignIn = () => {
  const navigate = useNavigate();
  const [{ userInfo, socket }, dispatch] = useStateProvider();
  const { mutate: signInMutate } = useMutation({
    mutationFn: ({ username, password }) => signIn(username, password),
    onSuccess: (res) => {
      const data = res.data;
      saveToken(data);
      saveUser(data.user_info);
      toast.success("Đăng nhập thành công");
      dispatch({
        type: reducerCases.SET_USER_INFO,
        userInfo: data.user_info,
      });

      navigate(Page.MAIN_PAGE.path, { replace: true });
    },
    onError: (error) => {
      console.error(error);
      toast.error(error.response.data);
    },
  });
  return signInMutate;
};
