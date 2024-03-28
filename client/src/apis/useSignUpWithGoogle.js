import { useMutation } from "@tanstack/react-query";
import { signInWithGoogle, signUpWithGoogle } from "./authApi";
import { signInWithPopup } from "firebase/auth";
import { auth, googleAuthProvider } from "../configs/FirebaseConfig";
import { toast } from "react-toastify";
import { saveToken } from "../utils/TokenStorage";
import { saveUser } from "../utils/UserStorage";
import Page from "../constants/Page";
import { useNavigate } from "react-router-dom";

export const useSignUpWithGoogle = () => {
    const navigate = useNavigate();

    const { mutate: signUpWithGoogleMutation } = useMutation({
        mutationFn: () => signInWithPopup(auth, googleAuthProvider),
        onSuccess: (result) => {
            console.log(result);

            // const credential = GoogleAuthProvider.credentialFromResult(result);
            const user = result.user;
            const displayName = user.displayName;
            const token = user.accessToken;

            signUpWithGoogle(token, displayName)
                .then(res => {
                    signInWithGoogle(token)
                        .then(res => {
                            const data = res.data;

                            saveToken(data);
                            saveUser(data.user_info);

                            toast.success("Đăng kí tài khoản thành công");
                            navigate(Page.HOME_PAGE.path, {replace: true});
                        })
                        .catch(error => {
                            console.error(error);
                            toast.error(error.response.data);
                        })
                })
                .catch(error => {
                    console.error(error);
                    toast.error(error.response.data);
                })
        },
        onError: (error) => {
            console.error(error);
        }
    });

    return signUpWithGoogleMutation;
}