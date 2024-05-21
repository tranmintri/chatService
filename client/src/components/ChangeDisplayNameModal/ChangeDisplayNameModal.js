import React, { Fragment, useEffect, useRef } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateUserInfo } from "../../apis/userApi";
import QueryKey from "../../constants/QueryKey";
import { toast } from "react-toastify";

const ChangeDisplayNameModal = ({ open, setOpen, userInfo }) => {
  const cancelButtonRef = useRef(null);
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    setFocus,
    formState: { errors },
  } = useForm();

  const updateMutation = useMutation({
    mutationFn: (userInfo) => updateUserInfo(userInfo),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [QueryKey.GET_USER_INFO] });
      setOpen(false);
      toast.info("Cập nhật tên hiển thị thành công");
    },
    onError: (error) => {
      console.error(error);
    },
  });

  const onSubmit = (data) => {
    updateMutation.mutate({
      id: userInfo?.id,
      ...data,
    });
  };

  useEffect(() => {
    if (open) {
      if (userInfo?.display_name) {
        setValue("displayName", userInfo.display_name);
      }
      setFocus("displayName");
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
                      Change display name
                    </p>
                    <p className="tw-text-center tw-text-dark-2 tw-text-sm">
                      Enter display name
                    </p>

                    <div className="tw-mb-2.5">
                      <div className="tw-mb-1.5">
                        <label className="tw-text-dark-2 tw-font-semibold tw-text-xs tw-uppercase">
                          Display name
                        </label>
                      </div>
                      <div>
                        <input
                          type="text"
                          className=" tw-px-4 tw-py-1.5 tw-text-black tw-w-full tw-rounded-sm"
                          {...register("displayName", {
                            required: "Vui lòng nhập tên hiển thị",
                            validate: (value) =>
                              value !== userInfo?.display_name ||
                              "Tên hiển thị giống với tên hiển thị hiện tại",
                          })}
                        />
                      </div>
                      <div>
                        {errors?.displayName && (
                          <p className="tw-text-red-500 tw-mt-1 tw-text-sm">
                            {errors.displayName.message}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="tw-bg-dark-4 tw-py-4 sm:tw-flex sm:tw-flex-row-reverse sm:tw-px-6">
                    <button
                      type="submit"
                      className="tw-px-6 tw-py-2.5 tw-text-sm tw-text-dark-1 tw-bg-blue-1 tw-rounded-sm"
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

export default React.memo(ChangeDisplayNameModal);
