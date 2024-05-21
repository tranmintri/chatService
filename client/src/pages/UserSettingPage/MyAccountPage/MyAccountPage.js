import { useQuery } from "@tanstack/react-query";
import QueryKey from "../../../constants/QueryKey";
import { getUserInfo } from "../../../apis/userApi";
import ChangePasswordModal from "../../../components/ChangePasswordModal/ChangePasswordModal";
import { useEffect, useState } from "react";
import ChangeDisplayNameModal from "../../../components/ChangeDisplayNameModal/ChangeDisplayNameModal";
import ChangeUsernameModal from "../../../components/ChangeUsernameModal/ChangeUsernameModal";
import ChangeEmailModal from "../../../components/ChangeEmailModal/ChangeEmailModal";
import ChangePhoneModal from "../../../components/ChangePhoneModal/ChangePhoneModal";
import ChangeAvatarModal from "../../../components/ChangeAvatarModal/ChangeAvatarModal";
import { useStateProvider } from "../../../context/StateContext";
import { reducerCases } from "../../../context/constants";
import axios from "axios";
import { FaCircleExclamation } from "react-icons/fa6";
import { GET_ALL_USER } from "../../../router/ApiRoutes";

const MyAccountPage = () => {
  const [{ userInfo: user }, dispatch] = useStateProvider();
  const {
    data: userInfo,
    error,
    isLoading,
  } = useQuery({
    queryKey: [QueryKey.GET_USER_INFO],
    queryFn: async () => {
      const res = await getUserInfo(user?.id);
      return res.data;
    },
  });

  const [changeAvatarModalShow, setChangeAvatarModalShow] = useState(false);
  const [changePasswordModalShow, setChangePasswordModalShow] = useState(false);
  const [changeDisplayNameModalShow, setChangeDisplayNameModalShow] =
    useState(false);
  const [changeUsernameModalShow, setChangeUsernameModalShow] = useState(false);
  const [changeEmailModalShow, setChangeEmailModalShow] = useState(false);
  const [changePhoneModalShow, setChangePhoneModalShow] = useState(false);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.put(GET_ALL_USER, userInfo);
        dispatch({
          type: reducerCases.SET_USER_INFO,
          userInfo: userInfo,
        });
      } catch (error) {
        console.error("Error updating user info:", error);
      }
    };

    fetchData();
  }, [userInfo]);

  const handleBtnChangeAvatarClick = () => {
    setChangeAvatarModalShow(true);
  };

  const handelBtnChangeDisplayNameClick = () => {
    setChangeDisplayNameModalShow(true);
  };

  const handleBtnChangeUsernameClick = () => {
    setChangeUsernameModalShow(true);
  };

  const handleBtnChangeEmailClick = () => {
    setChangeEmailModalShow(true);
  };

  const handleBtnChangePhoneClick = () => {
    setChangePhoneModalShow(true);
  };

  const handleBtnChangePasswordClick = () => {
    setChangePasswordModalShow(true);
  };

  const handleBtnBlockAccountClick = () => {};

  const handleBtnDeleteAccountClick = () => {};

  return (
    <>
      <div className="tw-px-10 tw-py-10">
        <div className="tw-mb-10">
          <p className="tw-font-bold tw-text-xl tw-mb-5">My Account</p>

          <div
            className="tw-rounded-lg tw-pb-0.5"
            style={{ backgroundColor: "#1E1F22" }}
          >
            <div
              className="tw-h-24 tw-rounded-t-lg tw-relative tw-group"
              style={{ backgroundColor: "#F7E678" }}
            >
              <form>
                <input id="avatar" type="file" hidden />
                <label
                  className="tw-hidden group-hover:tw-block tw-absolute tw-top-1/2 tw-left-1/2 -tw-translate-x-1/2 -tw-translate-y-1/2 tw-text-2xl tw-cursor-pointer"
                  htmlFor="avatar"
                >
                  <i className="fa-solid fa-camera"></i>
                </label>
              </form>
            </div>
            <div className="tw-grid tw-grid-cols-2 tw-items-center tw-px-6 tw-py-3">
              <div className="tw-relative">
                <div className="tw-absolute -tw-top-14 tw-flex tw-gap-3">
                  <div className="tw-relative tw-group">
                    <img
                      className="tw-w-24 tw-h-24 tw-rounded-full"
                      style={{
                        borderColor: "#1E1F22",
                        borderStyle: "solid",
                        borderWidth: "0.4rem",
                        objectFit: "cover",
                      }}
                      src={
                        userInfo?.avatar ||
                        "https://www.signivis.com/img/custom/avatars/member-avatar-01.png"
                      }
                      alt="avatar"
                    />
                    {/*<form>*/}
                    <button
                      className="tw-text-gray-500 tw-hidden group-hover:tw-block tw-absolute tw-top-1/2 tw-left-1/2 -tw-translate-x-1/2 -tw-translate-y-1/2 tw-text-2xl tw-cursor-pointer"
                      onClick={handleBtnChangeAvatarClick}
                    >
                      <i className="fa-solid fa-camera"></i>
                    </button>
                    {/*</form>*/}
                  </div>
                  <div>
                    <p className="tw-text-lg tw-font-bold tw-mt-9 tw-mb-0">
                      {userInfo?.display_name || "Loading..."}
                    </p>
                    <p className="tw-text-blue-1 tw-italic">
                      {userInfo?.username
                        ? `@${userInfo.username}`
                        : "Loading..."}
                    </p>
                  </div>
                </div>
              </div>
              <div className="text-end">
                <button className="tw-bg-blue-1 tw-px-4 tw-py-1.5 tw-rounded-sm tw-text-sm tw-font-semibold">
                  Edit User Profile
                </button>
              </div>
            </div>
            <div
              className="tw-grid tw-grid-cols-2 tw-gap-y-3 tw-items-center tw-mx-4 tw-my-7 tw-px-6 tw-py-3 tw-rounded-lg"
              style={{ backgroundColor: "#2B2D31" }}
            >
              <div>
                <label className="tw-font-bold tw-text-dark-2 tw-uppercase tw-text-xs">
                  Display Name
                </label>
                <p>{userInfo?.display_name || "Loading..."}</p>
              </div>
              <div className="text-end">
                <button
                  className="tw-px-4 tw-py-1.5 tw-rounded-sm tw-bg-dark-5 tw-text-sm tw-font-semibold"
                  onClick={handelBtnChangeDisplayNameClick}
                >
                  Edit
                </button>
              </div>

              <div>
                <label className="tw-font-bold tw-text-dark-2 tw-uppercase tw-text-xs">
                  Username
                </label>
                <p>
                  {userInfo?.username ? `@${userInfo.username}` : "Loading..."}
                </p>
              </div>
              <div className="text-end">
                <button
                  className="tw-px-4 tw-py-1.5 tw-rounded-sm tw-bg-dark-5 tw-text-sm tw-font-semibold"
                  onClick={handleBtnChangeUsernameClick}
                >
                  Edit
                </button>
              </div>

              <div>
                <label className="tw-font-bold tw-text-dark-2 tw-uppercase tw-text-xs">
                  Email
                </label>
                <p>{userInfo?.email || "You haven't added any emails"}</p>
              </div>
              <div className="text-end">
                <button
                  className="tw-px-4 tw-py-1.5 tw-rounded-sm tw-bg-dark-5 tw-text-sm tw-font-semibold"
                  onClick={handleBtnChangeEmailClick}
                >
                  Edit
                </button>
              </div>

              <div>
                <div className="tw-flex">
                  <label className="tw-font-bold tw-text-dark-2 tw-uppercase tw-text-xs tw-mr-3">
                    Phone Number
                  </label>
                  {!userInfo?.phone && (
                    <div className="tw-flex tw-justify-center tw-items-center tw-w-5 tw-h-5 tw-rounded-full tw-bg-white">
                      <FaCircleExclamation className="tw-text-red-500 tw-text-[20px] " />
                    </div>
                  )}
                </div>

                <p>
                  {userInfo?.phone || "You haven't added a phone number at all"}
                </p>
              </div>
              <div className="text-end">
                <button
                  className="tw-px-4 tw-py-1.5 tw-rounded-sm tw-bg-dark-5 tw-text-sm tw-font-semibold"
                  onClick={handleBtnChangePhoneClick}
                >
                  Edit
                </button>
              </div>
            </div>
          </div>

          <hr />
        </div>

        <div className="tw-mb-10">
          <p className="tw-font-bold tw-text-xl tw-mb-5">
            Password and Authentication
          </p>

          <button
            className="tw-bg-blue-1 tw-px-4 tw-py-1.5 tw-text-sm tw-font-semibold tw-rounded-sm"
            onClick={handleBtnChangePasswordClick}
          >
            Change Password
          </button>

          <hr className="tw-my-5" />
        </div>

        <div className="tw-mb-10">
          <p className="tw-text-dark-1 tw-font-semibold tw-uppercase tw-text-xs tw-mb-0">
            Stop using your account
          </p>
          <small className="tw-text-dark-2">
            If your account is locked, you can restore your account at any time
            any time
          </small>
          <br />
          <button
            className="tw-bg-red-500 tw-border-red-500 tw-border tw-mr-5 tw-px-4 tw-py-1.5 tw-text-sm tw-font-semibold tw-rounded-sm tw-mt-5"
            onClick={handleBtnBlockAccountClick}
          >
            Deactivate Account
          </button>
          <button
            className="tw-border-red-500 tw-border tw-px-4 tw-py-1.5 tw-text-sm tw-font-semibold tw-rounded-sm tw-mt-5"
            onClick={handleBtnDeleteAccountClick}
          >
            Delete the account
          </button>
        </div>

        <ChangeAvatarModal />
      </div>

      <ChangePasswordModal
        open={changePasswordModalShow}
        setOpen={setChangePasswordModalShow}
        userInfo={userInfo}
      />

      <ChangeDisplayNameModal
        open={changeDisplayNameModalShow}
        setOpen={setChangeDisplayNameModalShow}
        userInfo={userInfo}
      />

      <ChangeUsernameModal
        open={changeUsernameModalShow}
        setOpen={setChangeUsernameModalShow}
        userInfo={userInfo}
      />

      <ChangeEmailModal
        open={changeEmailModalShow}
        setOpen={setChangeEmailModalShow}
        userInfo={userInfo}
      />

      <ChangePhoneModal
        open={changePhoneModalShow}
        setOpen={setChangePhoneModalShow}
        userInfo={userInfo}
      />

      <ChangeAvatarModal
        open={changeAvatarModalShow}
        setOpen={setChangeAvatarModalShow}
        userInfo={userInfo}
      />
    </>
  );
};

export default MyAccountPage;
