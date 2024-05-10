import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { signInWithGoogle } from "./authApi";
import { saveToken } from "../utils/TokenStorage";
import { saveUser } from "../utils/UserStorage";
import { toast } from "react-toastify";
import Page from "../constants/Page";
import { signInWithPopup } from "firebase/auth";
import { auth, googleAuthProvider } from "../configs/FirebaseConfig";
import { useStateProvider } from "../context/StateContext";
import { reducerCases } from "../context/constants";

export const useSignInWithGoogle = () => {
  const navigate = useNavigate();
  const [{ userInfo, socket }, dispatch] = useStateProvider();
  const { mutate: signInWithGoogleMutate } = useMutation({
    mutationFn: () => signInWithPopup(auth, googleAuthProvider),
    onSuccess: (result) => {
      // const credential = GoogleAuthProvider.credentialFromResult(result);
      const user = result.user;
      const token = user.accessToken;

      signInWithGoogle(token)
        .then((res) => {
          const data = res.data;

          saveToken(data);
          saveUser(data.user_info);
          toast.success("Login successfully");
          dispatch({
            type: reducerCases.SET_USER_INFO,
            userInfo: data.user_info,
          });
          socket.current.emit("request-get-all-friend-online", userInfo);
          socket.current.emit("request-connect-user", userInfo);
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
