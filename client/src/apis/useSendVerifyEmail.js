import { useMutation } from "@tanstack/react-query";
import { sendVerifyEmail } from "./authApi";
import { toast } from "react-toastify";

export const useSendVerifyEmail = () => {
    const { mutate: sendVerifyEmailMutate } = useMutation({
        mutationFn: (email) => sendVerifyEmail(email),
        onSuccess: (res => {
            toast('Send verify email success!');
        }),
        onError: (error => {
            console.error(error);
        })
    });
    return sendVerifyEmailMutate;
}
