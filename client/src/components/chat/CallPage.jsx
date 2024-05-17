import React, { useEffect, useRef, useState } from "react";
import { useStateProvider } from "../../context/StateContext";
import io from "socket.io-client";
import { MdScreenShare } from "react-icons/md";
import { reducerCases } from "../../context/constants";
import { FaUserPlus } from "react-icons/fa6";
import { ImHangouts, ImPhoneHangUp } from "react-icons/im";
import { BiMicrophone } from "react-icons/bi";
import { v4 as uuidv4 } from "uuid";
import { CHAT_API } from "../../router/ApiRoutes";
import axios from "axios";

const CallPage = () => {
  const [
    { incomingVoiceCall, socket, userInfo, currentChat, callPage, groups },
    dispatch,
  ] = useStateProvider();
  useEffect(() => {
    let isMounted = true; // Biến để kiểm tra component có được mount hay không
    const timer = setTimeout(async () => {
      if (isMounted) {
        const content = " missed the call from ";

        try {
          const messageId = uuidv4();
          const { data } = await axios.put(
            CHAT_API + currentChat?.chatId + "/messages",
            {
              newMessage: {
                messageId: messageId,
                senderId: incomingVoiceCall.senderId,
                senderName: incomingVoiceCall.senderName,
                senderPicture: incomingVoiceCall.senderPicture,
                type: "missing call",
                content: content,
                timestamp: Date.now(),
              },
            }
          );
          if (currentChat.type == "private") {
            socket.current.emit("send-msg-private", {
              receiveId: incomingVoiceCall.receiveId,
              newMessage: {
                messageId: messageId,
                senderId: incomingVoiceCall.senderId,
                senderName: incomingVoiceCall.senderName,
                senderPicture: incomingVoiceCall.senderPicture,
                type: "missing call",
                content: content,
                timestamp: Date.now(),
              },
            });
          }
          dispatch({
            type: reducerCases.ADD_MESSAGES,
            newMessage: {
              ...data.data.newMessage,
            },
            fromSelf: true,
          });
          let group = [
            ...groups.filter((chat) => chat.chatId === currentChat.chatId),
            ...groups.filter((chat) => chat.chatId !== currentChat.chatId),
          ];
          dispatch({
            type: reducerCases.SET_ALL_GROUP,
            groups: group,
          });

          dispatch({
            type: reducerCases.SET_CALL_PAGE,
            callPage: false,
          });
          dispatch({
            type: reducerCases.SET_INCOMING_VOICE_CALL,
            incomingVoiceCall: undefined,
          });
        } catch (error) {
          console.error("Error:", error);
        }
      }
    }, 5000); // 5 giây

    // Hàm clean up để clear timer khi component unmount
    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, []);
  const handleEndCall = () => {
    socket.current.emit("request-end-voice-call", {
      senderId: userInfo?.id,
      receiveId:
        incomingVoiceCall.senderId == userInfo?.id
          ? incomingVoiceCall.receiveId
          : incomingVoiceCall.senderId,
    });
    dispatch({
      type: reducerCases.SET_CALL_PAGE,
      callPage: false,
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
            <div className="tw-bg-gray-700 tw-rounded-full tw-w-10 tw-min-h-10 tw-cursor-pointer tw-flex tw-justify-center tw-items-center tw-mr-5">
              <MdScreenShare className="tw-cursor-pointer tw-text-gray-400 tw-text-2xl tw-shadow-2xl" />
            </div>
          </div>
          <div>
            <div className="tw-bg-gray-700 tw-rounded-full tw-w-10 tw-min-h-10 tw-cursor-pointer tw-flex tw-justify-center tw-items-center tw-mr-5">
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
