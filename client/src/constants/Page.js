import SignUpPage from "../pages/SignUpPage/SignUpPage";
import SignInPage from "../pages/SignInPage/SignInPage";
import SignUpSuccessPage from "../pages/SignUpSuccessPage/SignUpSuccessPage";
import Main from "../pages/Main";
import UserSettingPage from "../pages/UserSettingPage/UserSettingPage";
import MyAccountPage from "../pages/UserSettingPage/MyAccountPage/MyAccountPage";
import EmailVerifySendPage from "../pages/EmailVerifySendPage/EmailVerifySendPage";
import EmailVerifyPage from "../pages/EmailVerifyPage/EmailVerifyPage";
import EmailVerifySuccessPage from "../pages/EmailVerifySuccessPage/EmailVerifySuccessPage";
import ForgotPasswordPage from "../pages/ForgotPasswordPage/ForgotPasswordPage";
import ForgotPassSendSuccessPage from "../pages/ForgotPassSendSuccessPage/ForgotPassSendSuccessPage";
import ResetPasswordPage from "../pages/ResetPasswordPage/ResetPasswordPage";

const SIGN_UP_PAGE = {
  name: "SIGN_UP_PAGE",
  displayName: "Đăng kí",
  path: "/signup",
  element: <SignUpPage />,
};

const SIGN_UP_SUCCESS_PAGE = {
  name: "SIGN_UP_SUCCESS_PAGE",
  displayName: "Đăng kí thành công",
  path: "/signup/success",
  element: <SignUpSuccessPage />,
};

const SIGN_IN_PAGE = {
  name: "SIGN_IN_PAGE",
  displayName: "Đăng nhập",
  path: "/signin",
  element: <SignInPage />,
};

const MAIN_PAGE = {
  name: "MAIN_PAGE",
  displayName: "Main page",
  path: "/",
  element: <Main />,
};

const USER_SETTING_PAGE = {
  name: "USER_SETTING_PAGE",
  displayName: "User Setting Page",
  path: "/me",
  element: <UserSettingPage />,
};

const MY_ACCOUNT_PAGE = {
  name: "MY_ACCOUNT_PAGE",
  displayName: "My Account Page",
  element: <MyAccountPage />,
};

const EMAIL_VERIFY_PAGE = {
  path: "/verify/email",
  name: "EMAIL_VERIFY_PAGE",
  displayName: "Email Verify Page",
  element: <EmailVerifyPage />,
};

const EMAIL_VERIFY_SEND_PAGE = {
  path: "/verify/email/send",
  name: "SEND_VERIFY_EMAIL_PAGE",
  displayName: "Send Verify Email Page",
  element: <EmailVerifySendPage />,
};

const EMAIL_VERIFY_SUCCESS_PAGE = {
  path: "/verify/email/success",
  name: "EMAIL_VERIFY_SUCCESS_PAGE",
  displayName: "Email Verify Success Page",
  element: <EmailVerifySuccessPage />,
};

const FORGOT_PASSWORD_PAGE = {
  path: "/forgot-password",
  name: "FORGOT_PASSWORD_PAGE",
  displayName: "Forgot Password Page",
  element: <ForgotPasswordPage />,
};

const FORGOT_PASS_SEND_SUCCESS_PAGE = {
  path: "/forgot-password/success",
  name: "FORGOT_PASS_SEND_SUCCESS_PAGE",
  displayName: "Forgot Password Send Success Page",
  element: <ForgotPassSendSuccessPage />,
};

const RESET_PASSWORD_PAGE = {
  path: "/reset-password",
  name: "RESET_PASSWORD_PAGE",
  displayName: "Reset Password Page",
  element: <ResetPasswordPage />,
};

const Page = {
  SIGN_UP_PAGE,
  SIGN_UP_SUCCESS_PAGE,
  SIGN_IN_PAGE,
  MAIN_PAGE,
  USER_SETTING_PAGE,
  MY_ACCOUNT_PAGE,
  EMAIL_VERIFY_PAGE,
  EMAIL_VERIFY_SEND_PAGE,
  EMAIL_VERIFY_SUCCESS_PAGE,
  FORGOT_PASSWORD_PAGE,
  FORGOT_PASS_SEND_SUCCESS_PAGE,
  RESET_PASSWORD_PAGE,
};

export default Page;
