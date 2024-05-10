import SignUpPage from "../pages/SignUpPage/SignUpPage";
import SignInPage from "../pages/SignInPage/SignInPage";
import SignUpSuccessPage from "../pages/SignUpSuccessPage/SignUpSuccessPage";
import Main from "../pages/Main";
import UserSettingPage from "../pages/UserSettingPage/UserSettingPage";
import MyAccountPage from "../pages/UserSettingPage/MyAccountPage/MyAccountPage";
import ForgotPassword from "../pages/ForgotPassword";

const SIGN_UP_PAGE = {
  name: "SIGN_UP_PAGE",
  displayName: "Signup",
  path: "/signup",
  element: <SignUpPage />,
};
const FORGOT_PASSWORD_PAGE = {
  name: "FORGOT_PASSWORD_PAGE",
  displayName: "Forgotpassword",
  path: "/forgotpassword",
  element: <ForgotPassword />,
};

const SIGN_UP_SUCCESS_PAGE = {
  name: "SIGN_UP_SUCCESS_PAGE",
  displayName: "Signup successfully",
  path: "/signup/success",
  element: <SignUpSuccessPage />,
};

const SIGN_IN_PAGE = {
  name: "SIGN_IN_PAGE",
  displayName: "Signin",
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

const Page = {
  SIGN_UP_PAGE,
  SIGN_UP_SUCCESS_PAGE,
  SIGN_IN_PAGE,
  MAIN_PAGE,
  USER_SETTING_PAGE,
  MY_ACCOUNT_PAGE,
  FORGOT_PASSWORD_PAGE,
};

export default Page;
