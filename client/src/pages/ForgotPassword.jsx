import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Page from '../constants/Page';

const ForgotPassword = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [success, setSuccess] = useState(false);

  const handleContinue = (e) => {
    e.preventDefault();
    if (step === 1) {
      // Kiểm tra và xử lý hợp lệ email
      // Nếu hợp lệ, chuyển sang bước 2
      setStep(2);
    } else if (step === 2) {
      // Kiểm tra và xử lý hợp lệ OTP
      // Nếu hợp lệ, chuyển sang bước 3
      setStep(3);
    } else if (step === 3) {
      // Kiểm tra và xử lý hợp lệ mật khẩu mới và xác nhận mật khẩu
      // Nếu hợp lệ, gửi yêu cầu thay đổi mật khẩu
      setSuccess(true);
      setStep(4);
    }
  };

  return (
    <div className="signin-page tw-w-full tw-min-w-screen tw-h-full tw-min-h-screen tw-flex tw-items-center tw-justify-center">
      <div className="tw-w-[30rem] md:tw-w-auto tw-bg-dark-1 tw-px-7 tw-py-10 tw-m-5 tw-rounded-md tw-font-medium tw-block md:tw-flex tw-gap-14">
        <div className="md:tw-w-[25rem]">
          <p className="tw-mb-8 tw-text-dark-1 tw-text-xl tw-font-bold tw-text-center">
            {step === 1 ? 'DraFi password recovery' : step === 2 ? 'Enter OTP' : step === 3 ? 'Enter new password' : 'Password Recovery Successfull'}
          </p>
          {success ? (
            <div className="tw-mb-5 tw-text-center tw-text-white ">
              <i className="fa-solid fa-circle-check fa-2xl tw-text-[4rem] tw-text-green-600 "></i>
              <p className='tw-pt-5'>Password reset successful!</p>
              <button className="tw-w-full tw-px-4 tw-py-2 tw-rounded-sm tw-font-semibold tw-bg-blue-1 tw-text-dark-1">
                <Link
                  className="tw-text-white"
                  style={{ textDecoration: 'none' }}
                  to={Page.SIGN_IN_PAGE.path}
                  replace={true}
                >
                  Back to Sign In
                </Link>
              </button>
            </div>
          ) : (
            <form onSubmit={handleContinue}>
              {step === 1 && (
                <div className="tw-mb-5">
                  <div className="tw-mb-1">
                    <label
                      htmlFor="username"
                      className="tw-uppercase tw-text-dark-2 tw-text-xs tw-font-bold"
                    >
                      Enter your account registration email
                    </label>
                  </div>
                  <input
                    id="username"
                    className="tw-w-full tw-px-4 tw-py-2 tw-bg-dark-2 tw-rounded-sm tw-text-white"
                    type="text"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              )}
              {step === 2 && (
                <div className="tw-mb-5">
                  <div className="tw-mb-5">
                    <div className="tw-mb-1">
                      <label
                        htmlFor="otp"
                        className="tw-uppercase tw-text-dark-2 tw-text-xs tw-font-bold"
                      >
                        Enter the OTP sent to your email
                      </label>
                    </div>
                    <input
                      id="otp"
                      className="tw-w-full tw-px-4 tw-py-2 tw-bg-dark-2 tw-rounded-sm tw-text-white"
                      type="text"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                    />
                  </div>
                </div>
              )}
              {step === 3 && (
                <div className="tw-mb-5">
                  <div className="tw-mb-5">
                    <div className="tw-mb-5">
                      <div className="tw-mb-1">
                        <label
                          htmlFor="otp"
                          className="tw-uppercase tw-text-dark-2 tw-text-xs tw-font-bold"
                        >
                          Enter new password
                        </label>
                      </div>
                      <input
                        id="newpassword"
                        className="tw-w-full tw-px-4 tw-py-2 tw-bg-dark-2 tw-rounded-sm tw-text-white"
                        type="text"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                      />
                    </div>
                    <div className="tw-mb-5">
                      <div className="tw-mb-1">
                        <label
                          htmlFor="confirmewpassword"
                          className="tw-uppercase tw-text-dark-2 tw-text-xs tw-font-bold"
                        >
                          Confirm new password
                        </label>
                      </div>
                      <input
                        id="confirmnewpassword"
                        className="tw-w-full tw-px-4 tw-py-2 tw-bg-dark-2 tw-rounded-sm tw-text-white"
                        type="text"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              )}
              <hr className="tw-text-white" />
              <div className="tw-mb-5">
                <button type="submit" className="tw-w-full tw-px-4 tw-py-2 tw-rounded-sm tw-font-semibold tw-bg-blue-1 tw-text-dark-1">
                  {step < 3 ? 'Continue' : 'Confirm'}
                </button>
              </div>
              {step == 1 && (
                <div className="tw-mb-3">
                  <button className="tw-w-full tw-px-4 tw-py-2 tw-rounded-sm tw-font-semibold tw-bg-gray-500 tw-text-dark-1">
                    <Link
                      className="tw-text-white"
                      style={{ textDecoration: 'none' }}
                      to={Page.SIGN_IN_PAGE.path}
                      replace={true}
                    >
                      Back to Sign In
                    </Link>
                  </button>
                </div>
              )}
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
