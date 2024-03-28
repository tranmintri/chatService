import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { signInWithGoogle } from "./authApi";
import { saveToken } from "../utils/TokenStorage";
import { saveUser } from "../utils/UserStorage";
import { toast } from "react-toastify";
import Page from "../constants/Page";
import { signInWithPopup } from "firebase/auth";
import { auth, googleAuthProvider } from "../configs/FirebaseConfig";


export const useSignInWithGoogle = () => {
  const navigate = useNavigate();
  const { mutate: signInWithGoogleMutate } = useMutation({
    mutationFn: () => signInWithPopup(auth, googleAuthProvider),
    onSuccess: (result) => {
      console.log(result);

      // const credential = GoogleAuthProvider.credentialFromResult(result);
      const user = result.user;
      const token = user.accessToken;

      signInWithGoogle(token)
        .then((res) => {
          console.log(res);

          const data = res.data;

          saveToken(data);
          saveUser(data.user_info);
          toast.success("Đăng nhập thành công");
          navigate(Page.MAIN_PAGE.path, { replace: true });
        })
        .catch((error) => {
          console.error(error);
          toast.error(error.response.data);
        });
    },
    onError: (error) => {
      console.error(error);
    },
  });

  return signInWithGoogleMutate;
};
