import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { logout } from "./authApi";
import { toast } from "react-toastify";
import Page from "../constants/Page";
import { removeUser } from "../utils/UserStorage";

export const useLogout = () => {
  const navigate = useNavigate();
  const { mutate: logoutMutate } = useMutation({
    mutationFn: (tokenId) => logout(tokenId),
    onSuccess: (res) => {
      removeUser();
      toast.success("Đăng xuất thành công");
      navigate(Page.SIGN_IN_PAGE.path, { replace: true });
    },
    onError: (error) => {
      console.error(error);
    },
  });
  return logoutMutate;
};
