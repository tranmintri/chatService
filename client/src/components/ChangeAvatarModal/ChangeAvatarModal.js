import React, { Fragment, useEffect, useRef, useState } from "react";
import AvatarEditor from "react-avatar-editor";
import { Dialog, Transition } from "@headlessui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateAvatar } from "../../apis/userApi";
import { toast } from "react-toastify";
import QueryKey from "../../constants/QueryKey";

const ChangeAvatarModal = ({ open = false, setOpen, userInfo }) => {
  const cancelButtonRef = useRef(null);
  const queryClient = useQueryClient();

  const [file, setFile] = useState();
  const [zoom, setZoom] = useState(1);
  const [rotate, setRotate] = useState(0);
  const cropRef = useRef(null);

  const updateMutation = useMutation({
    mutationFn: (data) => updateAvatar(data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [QueryKey.GET_USER_INFO] });
      toast.info("Cập nhật hình đại điện thành công");
      setOpen(false);
    },
    onError: (error) => {
      console.error(error);
      toast.error(error?.response?.data);
    },
  });

  const handleInputFileChange = (event) => {
    const file = event.target?.files?.length > 0 ? event.target.files[0] : null;
    if (file) {
      setFile(file);
    }
  };

  const handleInputZoomChange = (event) => {
    const zoomValue = event.target.value;
    setZoom(zoomValue);
  };

  const handleInputRotateChange = (event) => {
    const rotateValue = event.target.value;
    setRotate(rotateValue);
  };

  const handleBtnSaveClick = async () => {
    if (cropRef && userInfo) {
      const dataUrl = cropRef.current.getImage().toDataURL();
      const result = await fetch(dataUrl);
      const blob = await result.blob();
      // setPreview(URL.createObjectURL(blob));
      // setModalOpen(false);
      updateMutation.mutate({
        id: userInfo.id,
        avatar: blob,
      });
    }
  };

  useEffect(() => {
    if (open) {
    } else {
      setFile(null);
      setZoom(1);
      setRotate(0);
      cropRef.current = null;
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
              <Dialog.Panel className="tw-w-[29rem] tw-bg-dark-1 tw-relative tw-transform tw-overflow-hidden tw-rounded-lg tw-text-left tw-shadow-xl tw-transition-all sm:tw-my-8">
                <div className="">
                  <p className="tw-px-4 tw-pt-3 pb-0 tw-font-semibold tw-text-lg tw-text-dark-1">
                    Update profile picture
                  </p>

                  <div className="tw-px-4 tw-pb-5 tw-grid tw-grid-cols-9 tw-gap-x-5 tw-gap-y-2 tw-justify-center">
                    {file && (
                      <>
                        <AvatarEditor
                          ref={cropRef}
                          className="tw-col-span-9 tw-mx-auto tw-mb-5"
                          // style={{ width: "100%", height: "100%" }}
                          image={URL.createObjectURL(file)}
                          width={320}
                          height={320}
                          border={50}
                          borderRadius={250}
                          scale={zoom}
                          rotate={rotate}
                        />
                        <label className="tw-col-span-2 tw-text-sm tw-font-semibold tw-text-dark-2">
                          Zoom
                        </label>
                        <input
                          type="range"
                          className="tw-col-span-5 tw-transparent tw-h-[4px] tw-w-full tw-cursor-pointer tw-appearance-none tw-border-transparent tw-bg-neutral-200 dark:tw-bg-neutral-600 tw-mt-2"
                          id="customRange1"
                          min={0}
                          max={2}
                          step={0.05}
                          value={zoom}
                          onChange={handleInputZoomChange}
                        />
                        <input
                          type="number"
                          className="tw-bg-dark-2 tw-text-dark-2 tw-col-span-2 tw-py-1.5 tw-rounded-md tw-text-sm tw-font-semibold tw-text-center"
                          min={0}
                          max={2}
                          step={0.05}
                          value={zoom}
                          onChange={handleInputZoomChange}
                        />

                        <label className="tw-col-span-2 tw-text-sm tw-font-semibold tw-text-dark-2">
                          Rotate
                        </label>
                        <input
                          type="range"
                          className="tw-col-span-5 tw-transparent tw-h-[4px] tw-w-full tw-cursor-pointer tw-appearance-none tw-border-transparent tw-bg-neutral-200 dark:tw-bg-neutral-600 tw-mt-2"
                          id="customRange1"
                          min={-180}
                          max={180}
                          value={rotate}
                          step={1}
                          onChange={handleInputRotateChange}
                        />
                        <input
                          type="number"
                          className="tw-bg-dark-2 tw-text-dark-2 tw-col-span-2 tw-py-1.5 tw-rounded-md tw-text-sm tw-font-semibold tw-text-center"
                          min={-180}
                          max={180}
                          step={1}
                          value={rotate}
                          onChange={handleInputRotateChange}
                        />
                      </>
                    )}
                  </div>
                  <div className="tw-grid tw-grid-cols-2 tw-bg-dark-4 tw-px-4 tw-py-4">
                    <div>
                      <input
                        type="file"
                        hidden
                        id="input-choose-avatar"
                        className="tw-text-dark-2"
                        onChange={handleInputFileChange}
                      />
                      <label
                        className="tw-px-4 tw-py-1.5 tw-bg-dark-5 tw-text-dark-1 tw-rounded-sm tw-text-sm tw-mr-2 tw-font-semibold"
                        htmlFor="input-choose-avatar"
                      >
                        Choose File...
                      </label>
                    </div>
                    <div className="tw-text-right">
                      <button
                        className="tw-px-4 tw-py-1.5 tw-bg-dark-5 tw-text-dark-1 tw-rounded-sm tw-text-sm tw-mr-2 tw-font-semibold"
                        onClick={() => setOpen(false)}
                      >
                        Cancel
                      </button>
                      <button
                        className="tw-px-4 tw-py-1.5 tw-bg-blue-1 tw-text-dark-1 tw-rounded-sm tw-text-sm tw-font-semibold"
                        onClick={handleBtnSaveClick}
                      >
                        Update
                      </button>
                    </div>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

export default ChangeAvatarModal;
