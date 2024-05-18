import {useMutation} from "@tanstack/react-query";
import {toast} from "react-toastify";
import {generateLoginQRCode} from "./qrApi";

export const useGenerateLoginQRCode = () => {
    const {mutate, data, error, isPending, isSuccess} = useMutation({
        mutationFn: () => generateLoginQRCode(),
        onError: (error) => {
            console.log(error);
            toast.error('Generate QR Code Error!');
        },
    });

    return {mutate, data, error, isPending, isSuccess};
}
