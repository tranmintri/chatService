import { useSendVerifyEmail } from "../../apis/useSendVerifyEmail";
import { Link, useLocation } from "react-router-dom";
import Page from "../../constants/Page";

const SignUpSuccessPage = () => {
    const sendVerifyEmail = useSendVerifyEmail();
    const { email } = useLocation().state;

    const handleBtnResendVerifyEmailClick = () => {
        sendVerifyEmail(email);
    }

    return (
        <div className="tw-w-full tw-min-w-screen tw-h-full tw-min-h-screen tw-flex tw-items-center tw-justify-center">
            <div className="tw-text-center tw-select-none">
                <i className="fa-solid fa-circle-check fa-2xl tw-text-[10rem] tw-text-green-600"></i>
                <div className="tw-mt-16">
                    <p className="tw-text-2xl tw-font-bold">ĐĂNG KÍ TÀI KHOẢN THÀNH CÔNG</p>
                    <p>Một email xác thực đã được gửi về hộp thư mà bạn đăng kí. Vui lòng kiểm tra và xác thực tài khoản.</p>
                    <div className="tw-block">
                        <button className="tw-px-4 tw-py-2 tw-font-semibold  tw-bg-blue-500 tw-rounded-md tw-mr-2">
                            <Link className='tw-text-white ' to={Page.SIGN_IN_PAGE.path} style={{ textDecoration: 'none' }}>TRỞ VỀ TRANG ĐĂNG NHẬP</Link>
                        </button>
                        <button
                            className="tw-px-4 tw-py-2 tw-font-semibold tw-text-white tw-rounded-md tw-mt-5 tw-bg-gray-500"
                            onClick={handleBtnResendVerifyEmailClick}
                        >
                            GỬI LẠI EMAIL
                        </button>

                    </div>

                </div>
            </div>
        </div>
    )
}

export default SignUpSuccessPage;