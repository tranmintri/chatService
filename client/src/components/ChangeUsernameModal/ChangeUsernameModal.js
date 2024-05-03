import React, { Fragment, useEffect, useRef } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { useForm } from "react-hook-form";
import clsx from "clsx";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateUserInfo } from "../../apis/userApi";
import { toast } from "react-toastify";
import QueryKey from "../../constants/QueryKey";

const ChangeUsernameModal = ({ open, setOpen, userInfo }) => {
  const cancelButtonRef = useRef(null);
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    setFocus,
    formState: { errors },
  } = useForm();

  const updateMutation = useMutation({
    mutationFn: (data) => updateUserInfo(data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [QueryKey.GET_USER_INFO] });
      toast.info("Cập nhật tên đăng nhập thành công");
      setOpen(false);
    },
    onError: (errors) => {
      console.error(errors);
      toast.error(errors?.response?.data);
    },
  });

  const onSubmit = (data) => {
    updateMutation.mutate(data);
  };

  useEffect(() => {
    if (open) {
      if (userInfo) {
        setValue("id", userInfo.id);
        setValue("username", userInfo.username);
      }
      setFocus("username");
    } else {
      reset();
    }
  }, [open]);

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog
        as="div"
        className="tw-relative tw-z-10"
        initialFocus={cancelButtonRef}
        onClose={setOpen}
      >
        <Transition.Child
          as={Fragment}
          enter="tw-ease-out tw-duration-300"
          enterFrom="tw-opacity-0"
          enterTo="tw-opacity-100"
          leave="tw-ease-in tw-duration-200"
          leaveFrom="tw-opacity-100"
          leaveTo="tw-opacity-0"
        >
          <div className="tw-fixed tw-inset-0 tw-bg-gray-950 tw-bg-opacity-70 tw-transition-opacity" />
        </Transition.Child>

        <div className="tw-fixed tw-inset-0 tw-z-10 tw-w-screen tw-overflow-y-auto">
          <div className="tw-flex tw-min-h-full tw-items-end tw-justify-center tw-p-4 tw-text-center sm:tw-items-center sm:tw-p-0">
            <Transition.Child
              as={Fragment}
              enter="tw-ease-out tw-duration-300"
              enterFrom="tw-opacity-0 tw-translate-y-4 sm:tw-translate-y-0 sm:tw-scale-95"
              enterTo="tw-opacity-100 tw-translate-y-0 sm:tw-scale-100"
              leave="tw-ease-in tw-duration-200"
              leaveFrom="tw-opacity-100 tw-translate-y-0 sm:tw-scale-100"
              leaveTo="tw-opacity-0 tw-translate-y-4 sm:tw-translate-y-0 sm:tw-scale-95"
            >
              <Dialog.Panel className="tw-bg-dark-1 tw-relative tw-transform tw-overflow-hidden tw-rounded-lg tw-text-left tw-shadow-xl tw-transition-all sm:tw-my-8 sm:tw-w-full sm:tw-max-w-lg">
                <form onSubmit={handleSubmit(onSubmit)}>
                  <div className="tw-px-5 tw-py-4">
                    <p className="tw-text-center tw-text-dark-1 tw-font-bold tw-text-2xl tw-mb-2 tw-mt-3 tw-transition-all tw-ease-in-out tw-duration-300">
                      Change username
                    </p>
                    <p className="tw-text-center tw-text-dark-2 tw-text-sm">
                      Enter new username and password
                    </p>

                    <div className="tw-mb-2.5">
                      <div className="tw-mb-1.5">
                        <label className="tw-text-dark-2 tw-font-semibold tw-text-xs tw-uppercase">
                          Username
                        </label>
                      </div>
                      <div>
                        <input
                          type="text"
                          className="tw-text-dark-2 tw-px-4 tw-py-1.5 tw-bg-dark-2 tw-w-full tw-rounded-sm"
                          {...register("username", {
                            required: "Vui lòng nhập tên đăng nhập mới",
                            validate: (value) =>
                              value !== userInfo?.username ||
                              "Tên đăng nhập giống với tên đăng nhập hiện tại",
                          })}
                        />
                      </div>
                      <div>
                        {errors?.username && (
                          <p className="tw-text-red-500 tw-mt-1 tw-text-sm">
                            {errors.username.message}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="tw-mb-2.5">
                      <div className="tw-mb-1.5">
                        <label className="tw-text-dark-2 tw-font-semibold tw-text-xs tw-uppercase">
                          Password
                        </label>
                      </div>
                      <div>
                        <input
                          type="password"
                          className="tw-text-dark-2 tw-px-4 tw-py-1.5 tw-bg-dark-2 tw-w-full tw-rounded-sm"
                          {...register("password", {
                            required: "Vui lòng nhập mật khẩu",
                          })}
                        />
                      </div>
                      <div>
                        {errors?.password && (
                          <p className="tw-text-red-500 tw-mt-1 tw-text-sm">
                            {errors.password.message}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="tw-bg-dark-4 tw-py-4 sm:tw-flex sm:tw-flex-row-reverse sm:tw-px-6">
                    <button
                      type="submit"
                      className="tw-px-6 tw-py-2.5 tw-text-sm tw-text-dark-1 tw-bg-blue-1 tw-rounded-sm"
                      // onClick={() => setOpen(false)}
                    >
                      Confirm
                    </button>
                    <button
                      type="button"
                      className="tw-px-6 tw-py-2.5 tw-text-sm tw-text-dark-1 tw-rounded-sm"
                      onClick={() => setOpen(false)}
                      ref={cancelButtonRef}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

export default React.memo(ChangeUsernameModal);
