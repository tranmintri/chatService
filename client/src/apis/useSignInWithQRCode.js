import {useMutation} from "@tanstack/react-query";
import {signInWithQRCode} from "./authApi";
import {saveUser} from "../utils/UserStorage";
import {toast} from "react-toastify";
import {useNavigate} from "react-router-dom";
import Page from "../constants/Page";
import {saveToken} from "../utils/TokenStorage";
import {reducerCases} from "../context/constants";
import {useStateProvider} from "../context/StateContext";

export const useSignInWithQRCode = () => {
    const navigate = useNavigate();
    const [{userInfo, socket}, dispatch] = useStateProvider();
    const {mutate: signInWithQRCodeMutate} = useMutation({
        mutationFn: (token) => signInWithQRCode(token),
        onSuccess: (res) => {
            const data = res.data;
            const userInfo = data.user_info;

            if(!(userInfo.email_verified && userInfo.email_verified === 1)) {
                navigate(Page.EMAIL_VERIFY_SEND_PAGE.path, {replace: true, state: userInfo});
            } else {
                saveToken(data);
                saveUser(userInfo);
                toast.success("Đăng nhập thành công");
                dispatch({
                    type: reducerCases.SET_USER_INFO,
                    userInfo: data.user_info,
                });

                navigate(Page.MAIN_PAGE.path, {replace: true});
            }
        },
        onError: (error) => {
            console.error(error);
            toast.error(error.response.data);
        },
    });
    return signInWithQRCodeMutate;
};
