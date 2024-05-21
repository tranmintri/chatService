import { useForm } from "react-hook-form";
import { useForgotPassword } from "../../apis/useForgotPassword";

const ForgotPasswordPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const forgotPassword = useForgotPassword();

  const onSubmit = (data) => {
    forgotPassword(data.username);
  };

  return (
    <div className="signin-page tw-w-full tw-min-w-screen tw-h-full tw-min-h-screen tw-flex tw-items-center tw-justify-center">
      <div className="tw-w-[30rem] md:tw-w-auto tw-bg-dark-1 tw-px-7 tw-py-10 tw-m-5 tw-rounded-md tw-font-medium tw-block md:tw-flex tw-gap-14">
        <div className="md:tw-w-[25rem]">
          <p className="tw-mb-5 tw-text-dark-1 tw-text-xl tw-font-bold tw-text-center">
            Forgot Password
          </p>

          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="tw-mb-5">
              <div className="tw-mb-1">
                <label
                  htmlFor="username"
                  className="tw-uppercase tw-text-dark-2 tw-text-xs tw-font-bold"
                >
                  Email
                  <span className="tw-text-red-500"> *</span>
                </label>
              </div>
              <input
                id="username"
                className="tw-w-full tw-px-4 tw-py-2  tw-rounded-sm tw-text-black"
                type="text"
                placeholder="Enter Email or Phone Number"
                {...register("username", {
                  required: "Enter username",
                })}
              />
              <div className="tw-text-gray-400 tw-text-xs tw-mt-1 tw-font-semibold">
                Username is username or email or phone
              </div>
              {errors?.username && (
                <p className="tw-text-red-500 tw-text-sm tw-mt-1">
                  {errors.username.message}
                </p>
              )}
            </div>

            <div className="tw-mb-3">
              <button className="tw-w-full tw-px-4 tw-py-2 tw-rounded-sm tw-font-semibold tw-bg-blue-1 tw-text-dark-1">
                Confirm
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
