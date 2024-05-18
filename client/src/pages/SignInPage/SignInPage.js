import {Link} from "react-router-dom";
import "./SignInPage.scss";
import Page from "../../constants/Page";
import {useForm} from "react-hook-form";
import {useSignIn} from "../../apis/useSignIn";
import {useSignInWithGoogle} from "../../apis/useSignInWithGoogle";
import {useEffect, useState} from "react";
import {useGenerateLoginQRCode} from "../../apis/useGenerateLoginQRCode";
import {firestoreDB} from "../../configs/FirebaseConfig";
import {useSignInWithQRCode} from "../../apis/useSignInWithQRCode";

const QR_EXPIRATION_TIME = 300;

const SignInPage = () => {
    const {
        register,
        handleSubmit,
        formState: {errors},
    } = useForm();

    const signIn = useSignIn();
    const signInWithGoogle = useSignInWithGoogle();
    const signInWithQRCode = useSignInWithQRCode();
    const {
        data: generateLoginQRResponse,
        error: generateLoginQRError,
        isPending: isGeneratingQRCode,
        isSuccess: isGenerateQRCodeSuccess,
        mutate: generateLoginQRCodeMutate
    } = useGenerateLoginQRCode();
    const requestId = generateLoginQRResponse?.data?.id;
    const qrCode = generateLoginQRResponse?.data?.image;

    const [countDown, setCountDown] = useState(QR_EXPIRATION_TIME);
    const [loginQRRequest, setLoginQRRequest] = useState();

    const onSubmit = (data) => {
        signIn(data);
    };

    const handleBtnSignInWithGoogleClick = () => {
        signInWithGoogle();
    };

    const handleBtnReGenerateQRCodeClick = () => {
        generateLoginQRCodeMutate();
    }

    useEffect(() => {
        generateLoginQRCodeMutate();
    }, []);

    useEffect(() => {
        let interval;

        if(isGenerateQRCodeSuccess) {
            setCountDown(QR_EXPIRATION_TIME);
            firestoreDB.collection("LoginQRRequest")
                .doc(requestId)
                .onSnapshot((doc) => {
                    const data = doc.data();
                    console.log(data);
                    setLoginQRRequest(data);
                    if(data.status === "REJECTED") {
                        clearInterval(interval);
                    } else if(data.status === "CONFIRMED") {
                        signInWithQRCode(data.token);
                        clearInterval(interval);
                    }
                });
        }

        if(isGenerateQRCodeSuccess) {
            interval = setInterval(() => {
                setCountDown(pre => {
                    const newCountDown = pre - 1;
                    newCountDown === 0 && generateLoginQRCodeMutate();
                    return newCountDown;
                });
            }, 1000);
        }

        return () => clearInterval(interval);
    }, [isGenerateQRCodeSuccess]);

    return (
        <div
            className="signin-page tw-w-full tw-min-w-screen tw-h-full tw-min-h-screen tw-flex tw-items-center tw-justify-center">
            <div
                className="tw-w-[30rem] md:tw-w-auto tw-bg-dark-1 tw-px-7 tw-py-10 tw-m-5 tw-rounded-md tw-font-medium tw-block md:tw-flex tw-gap-14">
                <div className="md:tw-w-[25rem]">
                    <p className="tw-mb-5 tw-text-dark-1 tw-text-xl tw-font-bold tw-text-center">
                        Login to Your Account
                    </p>

                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="tw-mb-5">
                            <div className="tw-mb-1">
                                <label
                                    htmlFor="username"
                                    className="tw-uppercase tw-text-dark-2 tw-text-xs tw-font-bold"
                                >
                                    Email or Phone Number
                                    <span className="tw-text-red-500"> *</span>
                                </label>
                            </div>
                            <input
                                id="username"
                                className="tw-w-full tw-px-4 tw-py-2 tw-bg-dark-2 tw-rounded-sm tw-text-white"
                                type="text"
                                {...register("username", {
                                    required: "Please enter Email or Phone Number",
                                })}
                            />
                            {errors?.username && (
                                <p className="tw-text-red-500 tw-text-sm tw-mt-1">
                                    {errors.username.message}
                                </p>
                            )}
                        </div>

                        <div className="tw-mb-5">
                            <div className="tw-mb-1">
                                <label
                                    htmlFor="password"
                                    className="tw-uppercase tw-text-dark-2 tw-text-xs tw-font-bold"
                                >
                                    Password
                                    <span className="tw-text-red-500"> *</span>
                                </label>
                            </div>
                            <input
                                id="password"
                                className="tw-w-full tw-px-4 tw-py-2 tw-bg-dark-2 tw-rounded-sm tw-text-white"
                                type="password"
                                {...register("password", {required: "Please enter password"})}
                            />
                            {errors?.password && (
                                <p className="tw-text-red-500 tw-text-sm tw-mt-1">
                                    {errors.password.message}
                                </p>
                            )}
                            <div className="tw-mt-1">
                                <Link
                                    className="tw-text-blue-1 tw-text-sm"
                                    to={Page.FORGOT_PASSWORD_PAGE.path}
                                >
                                    Forgot your password?
                                </Link>
                            </div>
                        </div>

                        <div className="tw-mb-3">
                            <button
                                className="tw-w-full tw-px-4 tw-py-2 tw-rounded-sm tw-font-semibold tw-bg-blue-1 tw-text-dark-1">
                                Log In
                            </button>
                        </div>
                    </form>

                    <div className="tw-text-dark-2 tw-text-sm tw-text-center">
                        <span>Dont have an account? </span>
                        <Link
                            className="tw-text-blue-1"
                            to={Page.SIGN_UP_PAGE.path}
                            replace={true}
                        >
                            Sign Up
                        </Link>
                    </div>

                    <div className="tw-text-sm tw-font-bold tw-text-center tw-text-dark-1 tw-my-3">
                        OR
                    </div>

                    <div>
                        <button
                            className="tw-w-full tw-flex tw-items-center tw-justify-center tw-gap-3 tw-px-4 tw-py-2 tw-rounded-sm tw-bg-dark-2 tw-text-dark-2 tw-font-semibold"
                            onClick={handleBtnSignInWithGoogleClick}
                        >
                            <img
                                className="tw-w-6"
                                src="https://cdn.iconscout.com/icon/free/png-256/free-google-1772223-1507807.png"
                                alt=""
                            />
                            Log In with Google
                        </button>
                    </div>
                </div>
                {loginQRRequest?.userInfo ? (
                    <div className="md:tw-w-[15rem] tw-hidden md:tw-block tw-text-center">
                        <div
                            className="tw-w-48 tw-h-48 tw-flex tw-items-center tw-justify-center tw-bg-white p-2 tw-rounded-full tw-mx-auto tw-mb-7">
                            <img src={loginQRRequest.userInfo.avatar} alt=""/>
                        </div>

                        {isGenerateQRCodeSuccess && loginQRRequest.status !== "REJECTED" && (
                            <p className="tw-text-dark-1 tw-text-sm tw-mb-0 tw-font-semibold">{String(Math.floor(countDown / 60)).padStart(2, '0')} : {String(countDown % 60).padStart(2, '0')}</p>
                        )}

                        {loginQRRequest.status === "SCANNED" && (
                            <p className="tw-text-green-600 tw-font-semibold">Waiting Confirm</p>
                        )}
                        {loginQRRequest.status === "REJECTED" && (
                            <>
                                <p className="tw-text-red-600 tw-mb-0 tw-font-semibold">Request is Rejected</p>
                                <button
                                    className="tw-bg-red-600 tw-mb-4 text-white tw-font-semibold tw-text-xs tw-px-3 tw-py-1 tw-rounded-md"
                                    onClick={handleBtnReGenerateQRCodeClick}
                                >
                                    <i className="fa-solid fa-rotate-right tw-mr-1.5"></i>
                                    Generate New
                                </button>
                            </>
                        )}

                        <p className="tw-text-xl tw-text-dark-1 tw-font-bold tw-mb-2">
                            {loginQRRequest.userInfo.displayName}
                        </p>
                        <p className="tw-text-dark-2 tw-text-sm">
                            {loginQRRequest.userInfo.username}
                        </p>
                    </div>
                ) : (
                    <div className="md:tw-w-[15rem] tw-hidden md:tw-block tw-text-center">
                    <div
                            className="tw-w-48 tw-h-48 tw-flex tw-items-center tw-justify-center tw-bg-white p-2 tw-rounded-md tw-mx-auto tw-mb-7">
                            {qrCode && <img src={qrCode} alt=""/>}
                            {isGeneratingQRCode && (
                                <div className="tw-relative">
                                    <img
                                        className="tw-opacity-20"
                                        src="https://www.qrstuff.com/images/default_qrcode.png"
                                        alt=""
                                    />
                                    <div
                                        className="tw-absolute tw-text-4xl tw-text-gray-900 tw-top-1/2 tw-left-1/2 -tw-translate-x-1/2 -tw-translate-y-1/2">
                                        <i className="fa-solid fa-spinner fa-spin"></i>
                                    </div>
                                </div>
                            )}
                            {generateLoginQRError && (
                                <div className="tw-relative">
                                    <img
                                        className="tw-opacity-20"
                                        src="https://www.qrstuff.com/images/default_qrcode.png"
                                        alt=""
                                    />
                                    <div
                                        className="tw-absolute tw-text-[#ff3838] tw-top-1/2 tw-left-1/2 -tw-translate-x-1/2 -tw-translate-y-1/2 tw-cursor-pointer"
                                        onClick={handleBtnReGenerateQRCodeClick}
                                    >
                                        <i className="fa-solid fa-rotate-right tw-text-4xl"></i>
                                        <p className="tw-font-extrabold">Error</p>
                                    </div>
                                </div>
                            )}
                        </div>

                        {isGenerateQRCodeSuccess && (
                            <p className="tw-text-dark-1 tw-text-sm tw-font-semibold">{String(Math.floor(countDown / 60)).padStart(2, '0')} : {String(countDown % 60).padStart(2, '0')}</p>
                        )}

                        <p className="tw-text-xl tw-text-dark-1 tw-font-bold tw-mb-2">
                            Log in with QR Code
                        </p>
                        <p className="tw-text-dark-2 tw-text-sm">
                            Scan this with the <b>DraFi Mobile App</b> to log in instantly
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SignInPage;
