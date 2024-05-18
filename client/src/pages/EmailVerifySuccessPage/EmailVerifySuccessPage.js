import {useEffect, useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import Page from "../../constants/Page";

const EmailVerifySuccessPage = () => {
    const navigate = useNavigate();
    const [countdown, setCountdown] = useState(10);

    if(countdown === 0) navigate(Page.SIGN_IN_PAGE.path, {replace: true});

    useEffect(() => {
        const interval = setInterval(() => {
            setCountdown((prev) => prev - 1);
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="tw-bg-[#8B7FFF] tw-min-h-screen tw-flex tw-items-center tw-justify-center">
            <div className="tw-bg-white tw-w-[500px] tw-rounded-lg tw-text-center">
                <div
                    className="tw-relative tw-bg-[#E5E8FD] tw-h-32 tw-rounded-t-lg"
                    style={{
                        borderBottomLeftRadius: "50% 3rem",
                        borderBottomRightRadius: "50% 3rem",
                    }}
                >
                    <div
                        className="tw-absolute tw-left-1/2 -tw-translate-x-1/2 bottom-0 tw-translate-y-1/2 tw-w-24 tw-h-24 tw-border-4 tw-border-solid tw-border-white tw-rounded-full tw-bg-[#BCA2FC] tw-flex tw-items-center tw-justify-center"
                    >
                        <div className="tw-relative">
                            <img
                                className="tw-w-16 tw-h-16"
                                src="https://cdn-icons-png.flaticon.com/256/1804/1804188.png"
                                alt=""
                            />
                            <div
                                className="tw-absolute tw-bottom-0 tw-right-0 tw-w-6 tw-h-6 tw-text-sm tw-flex tw-items-center tw-justify-center tw-bg-green-500 tw-text-white tw-rounded-full">
                                <i className="fa-solid fa-check"></i>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="tw-px-14 tw-py-16">
                    <p className="tw-font-bold tw-text-gray-800 tw-text-xl">Verify Email Success</p>
                    <p className="tw-text-gray-600 tw-text-sm tw-font-medium">
                        Hello USERNAME, to start using invoiceflow, we need to verify your email.<br/>
                        We've already sent out the verification link. Please check it and confirm it's really you.
                    </p>
                    <Link to={Page.SIGN_IN_PAGE.path} replace={true}
                        className="tw-px-4 tw-py-1.5 tw-rounded-full tw-bg-blue-400 tw-text-white tw-text-sm tw-font-semibold tw-mt-2">
                        <button>
                            Go to Login Page ({countdown})
                        </button>
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default EmailVerifySuccessPage;
