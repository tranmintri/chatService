import { useMutation } from "@tanstack/react-query";
import { signUp } from "./authApi";
import { useNavigate } from "react-router-dom";
import Page from "../constants/Page";

export const useSignUp = () => {
  const navigate = useNavigate();
  const { mutate: signUpMutate } = useMutation({
    mutationFn: ({ displayName, email, username, password }) =>
      signUp(displayName, email, username, password),
    onSuccess: (res) => {
      const data = res.data;
      const email = data.email;

      navigate(Page.SIGN_UP_SUCCESS_PAGE.path, {
        replace: true,
        state: { email: email },
      });
    },
    onError: (error) => {
      console.error(error);
    },
  });
  return signUpMutate;
};
