import React, { useEffect, useRef, useState } from "react";
import { useStateProvider } from "../../context/StateContext";
import io from "socket.io-client";
import { MdScreenShare } from "react-icons/md";
import { reducerCases } from "../../context/constants";
import { FaUserPlus } from "react-icons/fa6";
import { ImHangouts, ImPhoneHangUp } from "react-icons/im";
import { BiMicrophone } from "react-icons/bi";
// import io from 'socket.io-client';

const CallPage = () => {
  const [{ incomingVoiceCall, socket, userInfo, currentChat }, dispatch] =
    useStateProvider();

  const handleEndCall = () => {
    socket.current.emit("request-end-voice-call", {
      senderId: userInfo?.id,
      receiveId:
        incomingVoiceCall.senderId == userInfo?.id
          ? incomingVoiceCall.receiveId
          : incomingVoiceCall.senderId,
    });
    dispatch({
      type: reducerCases.SET_INCOMING_VOICE_CALL,
      incomingVoiceCall: undefined,
    });
  };

  return (
    <>
      <div className="tw-w-full tw-h-screen">
        <div className="tw-flex tw-justify-center tw-items-center tw-w-full tw-min-h-[80vh] tw-bg-slate-950 ">
          <div className="tw-w-full tw-min-h-40 -tw-mt-36">
            <div className="tw-w-full tw-flex tw-justify-center tw-items-center ">
              <img
                src={
                  incomingVoiceCall.receivePicture == userInfo?.avatar
                    ? incomingVoiceCall.senderPicture
                    : incomingVoiceCall.receivePicture
                }
                width={90}
                height={90}
                alt=""
                className="tw-rounded-full"
              />
            </div>
            <div className="tw-w-full tw-flex tw-justify-center tw-items-center ">
              <span className="tw-text-white tw-text-3xl tw-text-center tw-mt-3 tw-font-bold">
                {incomingVoiceCall.receiveName == userInfo?.display_name
                  ? incomingVoiceCall.senderName
                  : incomingVoiceCall.receiveName}
              </span>
            </div>
            <div className="tw-w-full tw-flex tw-justify-center tw-items-center ">
              <span className="tw-text-gray-400 tw-text-lg tw-text-center tw-mt-3">
                Calling...
              </span>
            </div>
          </div>
        </div>
        <div className="tw-bg-slate-950 tw-w-full tw-min-h-[20vh] tw-flex tw-justify-center tw-items-center">
          <div>
            <div
              className="tw-bg-gray-700 tw-rounded-full tw-w-10 tw-min-h-10 tw-cursor-pointer tw-flex tw-justify-center tw-items-center tw-mr-5"
              // onClick={() => handleCancelVoiceCall()}
            >
              <MdScreenShare className="tw-cursor-pointer tw-text-gray-400 tw-text-2xl tw-shadow-2xl" />
            </div>
          </div>
          <div>
            <div
              className="tw-bg-gray-700 tw-rounded-full tw-w-10 tw-min-h-10 tw-cursor-pointer tw-flex tw-justify-center tw-items-center tw-mr-5"
              // onClick={() => handleCancelVoiceCall()}
            >
              <FaUserPlus className="tw-cursor-pointer tw-text-white tw-text-2xl tw-shadow-2xl" />
            </div>
          </div>
          <div>
            <div
              className="tw-bg-gray-700 tw-rounded-full tw-w-10 tw-min-h-10 tw-cursor-pointer tw-flex tw-justify-center tw-items-center tw-mr-5"
              // onClick={() => handleCancelVoiceCall()}
            >
              <BiMicrophone className="tw-cursor-pointer tw-text-gray-400 tw-text-2xl tw-shadow-2xl" />
            </div>
          </div>
          <div>
            <div
              className="tw-bg-red-500 tw-rounded-full tw-w-10 tw-min-h-10 tw-cursor-pointer tw-flex tw-justify-center tw-items-center"
              onClick={() => handleEndCall()}
            >
              <ImPhoneHangUp className="tw-cursor-pointer tw-text-white tw-text-2xl tw-shadow-2xl" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CallPage;
