import "./SignUpPage.scss";
import { Link } from "react-router-dom";
import Page from "../../constants/Page";
import { useForm } from "react-hook-form";
import { useSignUpWithGoogle } from "../../apis/useSignUpWithGoogle";
import { useSignUp } from "../../apis/useSignUp";

const SignUpPage = () => {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm();

  const password = watch("password");
  const acceptanceTerms = watch("acceptanceTerms");

  const signUpWithGoogle = useSignUpWithGoogle();
  const signUp = useSignUp();

  const onSubmit = (data) => {
    signUp(data);
  };

  const handleBtnSignUpWithGoogleClick = () => {
    signUpWithGoogle();
  };

  return (
    <div className="signup-page tw-w-full tw-min-w-screen tw-h-full tw-min-h-screen tw-flex tw-items-center tw-justify-center">
      <div className="tw-w-[30rem] tw-bg-dark-1 tw-px-7 tw-py-10 tw-m-5 tw-rounded-md tw-font-medium">
        <p className="tw-mb-5 tw-text-dark-1 tw-text-xl tw-font-bold tw-text-center">
          Create an account
        </p>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="tw-grid tw-grid-cols-2 tw-gap-5">
            <div className="tw-col-span-2">
              <div className="tw-mb-1">
                <label className="tw-uppercase tw-text-dark-2 tw-text-xs tw-font-bold">
                  Display Name
                  <span className="tw-text-red-500"> *</span>
                </label>
              </div>
              <input
                className="tw-w-full tw-px-4 tw-py-2 tw-bg-dark-2 tw-rounded-sm tw-text-white"
                type="text"
                {...register("displayName", {
                  required: "Please enter Display Name",
                })}
              />
              {errors?.displayName && (
                <p className="tw-text-red-500 tw-text-sm tw-mt-1">
                  {errors.displayName.message}
                </p>
              )}
            </div>

            <div className="tw-col-span-2">
              <div className="tw-mb-1">
                <label className="tw-uppercase tw-text-dark-2 tw-text-xs tw-font-bold">
                  Email
                  <span className="tw-text-red-500"> *</span>
                </label>
              </div>
              <input
                className="tw-w-full tw-px-4 tw-py-2 tw-bg-dark-2 tw-rounded-sm tw-text-white"
                type="text"
                {...register("email", { required: "Please enter Email" })}
              />
              {errors?.email && (
                <p className="tw-text-red-500 tw-text-sm tw-mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div className="tw-col-span-2">
              <div className="tw-mb-1">
                <label className="tw-uppercase tw-text-dark-2 tw-text-xs tw-font-bold">
                  Username
                  <span className="tw-text-red-500"> *</span>
                </label>
              </div>
              <input
                className="tw-w-full tw-px-4 tw-py-2 tw-bg-dark-2 tw-rounded-sm tw-text-white"
                type="text"
                {...register("username", { required: "Please enter Username" })}
              />
              {errors?.username && (
                <p className="tw-text-red-500 tw-text-sm tw-mt-1">
                  {errors.username.message}
                </p>
              )}
            </div>

            <div className="tw-col-span-2 md:tw-col-span-1">
              <div className="tw-mb-1">
                <label className="tw-uppercase tw-text-dark-2 tw-text-xs tw-font-bold">
                  Password
                  <span className="tw-text-red-500"> *</span>
                </label>
              </div>
              <input
                className="tw-w-full tw-px-4 tw-py-2 tw-bg-dark-2 tw-rounded-sm tw-outline-none tw-text-white"
                type="password"
                {...register("password", { required: "Please enter Password" })}
              />
              {errors?.password && (
                <p className="tw-text-red-500 tw-text-sm tw-mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            <div className="tw-col-span-2 md:tw-col-span-1">
              <div className="tw-mb-1">
                <label className="tw-uppercase tw-text-dark-2 tw-text-xs tw-font-bold">
                  Confirm Password
                  <span className="tw-text-red-500"> *</span>
                </label>
              </div>
              <input
                className="tw-w-full tw-px-4 tw-py-2 tw-bg-dark-2 tw-rounded-sm tw-outline-none tw-text-white"
                type="password"
                {...register("confirmPassword", {
                  required: "Please enter Confirm Password",
                  validate: (value) =>
                    password === value || "Confirm password not match",
                })}
              />
              {errors?.confirmPassword && (
                <p className="tw-text-red-500 tw-text-sm tw-mt-1">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            <div className="tw-col-span-2">
              <div className="tw-text-left tw-text-xs tw-text-dark-2 tw-flex tw-items-center">
                <div>
                  <input
                    type="checkbox"
                    hidden
                    id="acceptanceTerms"
                    name="acceptanceTerms"
                    {...register("acceptanceTerms", {
                      required: "Please acceptance Terms",
                    })}
                  />
                  {acceptanceTerms ? (
                    <i
                      className="fa-regular fa-square-check fa-xl tw-mr-2"
                      onClick={() => {
                        setValue("acceptanceTerms", false);
                      }}
                    ></i>
                  ) : (
                    <i
                      className="fa-regular fa-square fa-xl tw-mr-2"
                      onClick={() => {
                        setValue("acceptanceTerms", true);
                      }}
                    ></i>
                  )}
                </div>
                <div className="flex-1">
                  <label htmlFor="acceptanceTerms">
                    (Optional) It's okey to send me email with DraFi updates,
                    típ, and special ofers. You can opt out at any time.
                  </label>
                </div>
              </div>
              {errors?.acceptanceTerms && (
                <p className="tw-text-red-500 tw-text-sm tw-mt-1">
                  {errors.acceptanceTerms.message}
                </p>
              )}
            </div>

            <div className="tw-col-span-2">
              <button className="tw-w-full tw-px-4 tw-py-2 tw-rounded-sm tw-font-semibold tw-bg-blue-1 tw-text-dark-1">
                Continue
              </button>
            </div>
          </div>
        </form>

        <div className="tw-text-sm tw-font-bold tw-text-center tw-text-dark-1 tw-my-3">
          OR
        </div>

        <div>
          <button
            className="tw-w-full tw-flex tw-items-center tw-justify-center tw-gap-3 tw-px-4 tw-py-2 tw-rounded-sm tw-bg-dark-2 tw-text-dark-2 tw-font-semibold"
            onClick={handleBtnSignUpWithGoogleClick}
          >
            <img
              className="tw-w-6"
              src="https://cdn.iconscout.com/icon/free/png-256/free-google-1772223-1507807.png"
              alt=""
            />
            Sign Up with Google
          </button>
        </div>

        <div className="tw-text-center tw-mt-5">
          <Link
            className="tw-text-blue-1 tw-text-sm"
            to={Page.SIGN_IN_PAGE.path}
            replace={true}
          >
            Already have an account?
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
