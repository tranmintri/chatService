import { useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useResetPassword } from "../../apis/useResetPassword";
import React from "react";

const ResetPasswordPage = () => {
    //http://localhost:3000/reset-password?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJkcmFmaSIsInN1YiI6IkF1dGhlbnRpY2F0aW9uIiwiaWF0IjoxNzE1OTEyNjg1LCJleHAiOjE3MTU5MTU2ODUsImp0aSI6IjY2N2I3NzVjODEyZDQ0NjRiNDJkZmE3NWRiMzJhNmMyIiwidXNlcl9pZCI6ImU0YWRlY2RkLTg1YzEtNDM4NC1iNWEyLWNkNzViODg4NDhhYSJ9.XDMNCNutfM9_XiK-4SRBy0cGOLB3Bkrc80q2AtzxIF4
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const token = searchParams.get("token");

    const {
        register,
        watch,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const newPassword = watch("newPassword");

    const resetPassword = useResetPassword();

    const onSubmit = (data) => {
        resetPassword({
            token,
            newPassword: data.newPassword,
        });
    };

    return (
        <div className="signin-page tw-w-full tw-min-w-screen tw-h-full tw-min-h-screen tw-flex tw-items-center tw-justify-center">
            <div className="tw-w-[30rem] md:tw-w-auto tw-bg-dark-1 tw-px-7 tw-py-10 tw-m-5 tw-rounded-md tw-font-medium tw-block md:tw-flex tw-gap-14">
                <div className="md:tw-w-[25rem]">
                    <p className="tw-mb-5 tw-text-dark-1 tw-text-xl tw-font-bold tw-text-center">
                        Reset Password
                    </p>

                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="tw-mb-5">
                            <div className="tw-mb-1">
                                <label
                                    htmlFor="newPassword"
                                    className="tw-uppercase tw-text-dark-2 tw-text-xs tw-font-bold"
                                >
                                    New Password
                                    <span className="tw-text-red-500"> *</span>
                                </label>
                            </div>
                            <div>
                                <input
                                    id="newPassword"
                                    className="tw-w-full tw-px-4 tw-py-2 tw-rounded-sm tw-text-black"
                                    type="password"
                                    placeholder="Enter New Password"
                                    {...register("newPassword", {
                                        required: "Please enter New Password",
                                        pattern:
                                            /^(?=.*\d)(?=.*[a-zA-Z])(?=.*[!@#$%^&*?])[A-Za-z\d!@#$%^&*?]{6,}$/,
                                    })}
                                />
                                {errors?.newPassword && (
                                    <p className="tw-text-red-500 tw-text-sm tw-mt-1">
                                        {errors.newPassword.message}
                                    </p>
                                )}
                            </div>
                            <div>
                                {errors?.newPassword && (
                                    <div className="tw-text-sm tw-mt-2.5">
                                        <p
                                            className={`tw-my-0.5 ${
                                                /.{6,}/.test(newPassword)
                                                    ? "tw-text-green-600"
                                                    : "tw-text-red-500"
                                            }`}
                                        >
                                            {/.{6,}/.test(newPassword) ? (
                                                <i className="fa-regular fa-circle-check tw-mr-2"></i>
                                            ) : (
                                                <i className="fa-regular fa-circle-xmark tw-mr-2"></i>
                                            )}
                                            Minimum 6 characters
                                        </p>
                                        <p
                                            className={`tw-my-0.5 ${
                                                /[a-zA-Z]+/.test(newPassword)
                                                    ? "tw-text-green-600"
                                                    : "tw-text-red-500"
                                            }`}
                                        >
                                            {/[a-zA-Z]+/.test(newPassword) ? (
                                                <i className="fa-regular fa-circle-check tw-mr-2"></i>
                                            ) : (
                                                <i className="fa-regular fa-circle-xmark tw-mr-2"></i>
                                            )}
                                            At least one alphabetic character
                                        </p>
                                        <p
                                            className={`tw-my-0.5 ${
                                                /\d+/.test(newPassword)
                                                    ? "tw-text-green-600"
                                                    : "tw-text-red-500"
                                            }`}
                                        >
                                            {/\d+/.test(newPassword) ? (
                                                <i className="fa-regular fa-circle-check tw-mr-2"></i>
                                            ) : (
                                                <i className="fa-regular fa-circle-xmark tw-mr-2"></i>
                                            )}
                                            At least one numeric character
                                        </p>
                                        <p
                                            className={`tw-my-0.5 ${
                                                /[!@#$%^&*?]+/.test(newPassword)
                                                    ? "tw-text-green-600"
                                                    : "tw-text-red-500"
                                            }`}
                                        >
                                            {/[!@#$%^&*?]+/.test(newPassword) ? (
                                                <i className="fa-regular fa-circle-check tw-mr-2"></i>
                                            ) : (
                                                <i className="fa-regular fa-circle-xmark tw-mr-2"></i>
                                            )}
                                            At least one special character [!@#$%^&*?]
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="tw-mb-5">
                            <div className="tw-mb-1">
                                <label
                                    htmlFor="confirmNewPassword"
                                    className="tw-uppercase tw-text-dark-2 tw-text-xs tw-font-bold"
                                >
                                    Confirm new Password
                                    <span className="tw-text-red-500"> *</span>
                                </label>
                            </div>
                            <input
                                id="confirmNewPassword"
                                className="tw-w-full tw-px-4 tw-py-2  tw-rounded-sm tw-text-black"
                                type="password"
                                placeholder="Confirm New Password"
                                {...register("confirmNewPassword", {
                                    required: "Please confirm new password",
                                    validate: (value) =>
                                        newPassword === value || "Confirm password not match",
                                })}
                            />
                            {errors?.confirmNewPassword && (
                                <p className="tw-text-red-500 tw-text-sm tw-mt-1">
                                    {errors.confirmNewPassword.message}
                                </p>
                            )}
                        </div>

                        <div className="tw-mb-3">
                            <button
                                className="tw-w-full tw-px-4 tw-py-2 tw-rounded-sm tw-font-semibold tw-bg-blue-1 tw-text-dark-1">
                                Confirm
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ResetPasswordPage;
