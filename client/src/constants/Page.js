import SignUpPage from "../pages/SignUpPage/SignUpPage";
import SignInPage from "../pages/SignInPage/SignInPage";
import SignUpSuccessPage from "../pages/SignUpSuccessPage/SignUpSuccessPage";
import Main from "../pages/Main";

const SIGN_UP_PAGE = {
    name: "SIGN_UP_PAGE",
    displayName: "Đăng kí",
    path: "/signup",
    element: <SignUpPage/>
}

const SIGN_UP_SUCCESS_PAGE = {
    name: "SIGN_UP_SUCCESS_PAGE",
    displayName: "Đăng kí thành công",
    path: "/signup/success",
    element: <SignUpSuccessPage/>
}

const SIGN_IN_PAGE = {
    name: "SIGN_IN_PAGE",
    displayName: "Đăng nhập",
    path: "/signin",
    element: <SignInPage/>
}

const MAIN_PAGE = {
    name: "MAIN_PAGE",
    displayName: "Main page",
    path: "/",
    element: <Main/>
}

const Page = {
    SIGN_UP_PAGE,
    SIGN_UP_SUCCESS_PAGE,
    SIGN_IN_PAGE,
    MAIN_PAGE,
}

export default Page;