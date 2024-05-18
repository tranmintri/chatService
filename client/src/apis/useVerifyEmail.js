import {useMutation} from "@tanstack/react-query";
import {verifyEmail} from "./authApi";
import {toast} from "react-toastify";
import {useNavigate} from "react-router-dom";
import Page from "../constants/Page";

export const useVerifyEmail = () => {
    const navigate = useNavigate();
    const { mutate: sendVerifyEmailMutate } = useMutation({
        mutationFn: (token) => verifyEmail(token),
        onSuccess: (res => {
            toast('Verify email success!');
            navigate(Page.EMAIL_VERIFY_SUCCESS_PAGE.path, {replace: true});
        }),
        onError: (error => {
            console.error(error);
            toast.error('Verify email failed!');
        })
    });
    return sendVerifyEmailMutate;
}
