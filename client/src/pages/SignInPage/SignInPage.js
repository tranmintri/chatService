import { Link } from "react-router-dom";
import "./SignInPage.scss";
import Page from "../../constants/Page";
import { useForm } from "react-hook-form";
import { useSignIn } from "../../apis/useSignIn";
import { useSignInWithGoogle } from "../../apis/useSignInWithGoogle";

const SignInPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const signIn = useSignIn();
  const signInWithGoogle = useSignInWithGoogle();

  const onSubmit = (data) => {
    signIn(data);
  };

  const handleBtnSignInWithGoogleClick = () => {
    signInWithGoogle();
  };

  return (
    <div className="signin-page tw-w-full tw-min-w-screen tw-h-full tw-min-h-screen tw-flex tw-items-center tw-justify-center">
      <div className="tw-w-[30rem] md:tw-w-auto tw-bg-dark-1 tw-px-7 tw-py-10 tw-m-5 tw-rounded-md tw-font-medium tw-block md:tw-flex tw-gap-14">
        <div className="md:tw-w-[25rem]">
          <p className="tw-mb-5 tw-text-dark-1 tw-text-xl tw-font-bold tw-text-center">
            Create an account
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
                className="tw-w-full tw-px-4 tw-py-2  tw-rounded-sm tw-text-black"
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
                className="tw-w-full tw-px-4 tw-py-2  tw-rounded-sm tw-text-black"
                type="password"
                {...register("password", { required: "Please enter password" })}
              />
              {errors?.password && (
                <p className="tw-text-red-500 tw-text-sm tw-mt-1">
                  {errors.password.message}
                </p>
              )}
              <div className="tw-mt-1">
                <Link
                  className="tw-text-blue-1 tw-text-sm"
                  to="/forgotpassword"
                >
                  Forgot your password?
                </Link>
              </div>
            </div>

            <div className="tw-mb-3">
              <button className="tw-w-full tw-px-4 tw-py-2 tw-rounded-sm tw-font-semibold tw-bg-blue-1 tw-text-dark-1">
                Log In
              </button>
            </div>
          </form>

          <div className="tw-text-dark-2 tw-text-sm tw-text-center">
            <span>Don't have an account? </span>
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
        <div className="md:tw-w-[15rem] tw-hidden md:tw-block tw-text-center">
          <div className="tw-w-48 tw-bg-white tw-rounded-md tw-mx-auto tw-mb-7">
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/d/d0/QR_code_for_mobile_English_Wikipedia.svg"
              alt=""
            />
          </div>
          <p className="tw-text-xl tw-text-dark-1 tw-font-bold tw-mb-2">
            Log in with QR Code
          </p>
          <p className="tw-text-dark-2 tw-text-sm">
            Scan this with the <b>DraFi Mobile App</b> to log in instantly
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignInPage;
