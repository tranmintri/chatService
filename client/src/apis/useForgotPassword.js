import {useNavigate} from "react-router-dom";
import {useMutation} from "@tanstack/react-query";
import {forgotPassword} from "./authApi";
import {toast} from "react-toastify";
import Page from "../constants/Page";

export const useForgotPassword = () => {
    const navigate = useNavigate();
    const {mutate: forgotPasswordMutate} = useMutation({
        mutationFn: async (email) => {
            await forgotPassword(email);
            toast('Send forgot password request success!');
            navigate(Page.FORGOT_PASS_SEND_SUCCESS_PAGE.path, {replace: true, state: {email: email}});
        },
        onError: (error) => {
            console.log(error)
            toast.error('Username not found!');
        },
    });
    return forgotPasswordMutate;
}
