import {useLocation} from "react-router-dom";
import {useEffect} from "react";
import {useVerifyEmail} from "../../apis/useVerifyEmail";

const EmailVerifyPage = () => {
    //http://localhost:3000/verify/email?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJkcmFmaSIsInN1YiI6IkF1dGhlbnRpY2F0aW9uIiwiaWF0IjoxNzE1OTA5MzQ1LCJleHAiOjE3MTU5MTIzNDUsImp0aSI6IjVmZWE5ZjEzY2IyNzQ4ZDFiNTJkMTc4ZDM2ZTQ3OWZhIiwidXNlcl9pZCI6ImU0YWRlY2RkLTg1YzEtNDM4NC1iNWEyLWNkNzViODg4NDhhYSJ9.OlW_ehUFeVtgM_2E7VHc_SxnGii7ios917iJT1W31Is
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const token = searchParams.get('token');

    const verifyEmail = useVerifyEmail();

    useEffect(() => {
        if(token) {
            verifyEmail(token);
        }
    }, []);

    return (
        <div></div>
    )
}

export default EmailVerifyPage;
