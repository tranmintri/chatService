import {useMutation} from "@tanstack/react-query";
import {resetPassword} from "./authApi";
import {toast} from "react-toastify";
import {useNavigate} from "react-router-dom";
import Page from "../constants/Page";

export const useResetPassword = () => {
    const navigate = useNavigate();
    const { mutate: sendVerifyEmailMutate } = useMutation({
        mutationFn: ({token, newPassword}) => resetPassword(token, newPassword),
        onSuccess: (res => {
            toast('Reset password success!');
            navigate(Page.SIGN_IN_PAGE.path, {replace: true});
        }),
        onError: (error => {
            console.error(error);
        })
    });
    return sendVerifyEmailMutate;
}
