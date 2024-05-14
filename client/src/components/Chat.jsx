import React, { useEffect, useRef, useState } from "react";
import { Container, Row, Col, Stack, Button } from "react-bootstrap";
import UserChat from "./chat/UserChat";
import ChatBox from "./chat/ChatBox";
import ConversationInfo from "./chat/ConversationInfo";
import EmptyChatScreen from "./chat/EmptyChatScreen";
import { useStateProvider } from "../context/StateContext";
import {
  CHAT_API,
  CLIENT_HOST,
  GET_CHAT_BY_PARTICIPANTS,
} from "../router/ApiRoutes";
import nhacchuong from '../assets/Nhac-chuong-cuoc-goi-Facebook-Messenger.mp3'
import { FaPhone } from "react-icons/fa6";
import { IoMdClose } from "react-icons/io";
import axios from "axios";
import { reducerCases } from "../context/constants";
import MessageResultCard from "./contact/card/MessageResultCard";
import { Howl } from 'howler';

const Chat = () => {
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [showInfo, setShowInfo] = useState(false);

  const [
    {
      userInfo,
      currentChat,
      socket,
      incomingVoiceCall,
      callAccepted,
      search,
      searchValue,
      messages,
      searchStartDate,
      searchEndDate,
      filterName,
    },
    dispatch,
  ] = useStateProvider();
  const [chats, setChats] = useState([]);

  useEffect(() => {
    const fetchChatData = async () => {
      try {
        const response = await axios.get(
          GET_CHAT_BY_PARTICIPANTS + userInfo?.id
        ); // Gọi API để lấy dữ liệu chat
        setChats(response.data);
      } catch (error) {
        console.error("Error fetching chat data:", error);
      }
    };

    fetchChatData(); // Gọi hàm để fetch dữ liệu chat khi component được render
  }, []);

  // useEffect(() => {
  //   setChat // Cập nhật giá trị của chat khi currentChat thay đổi
  // }, [chats]);
  const toggleConversationInfo = () => {
    setShowInfo(!showInfo);
  };

  const handleSelectMessage = (message) => {
    // Xử lý khi người dùng chọn một tin nhắn trong CombinedComponentWithScrollbar
    setSelectedMessage(message);
  };
  const handleAcceptVoiceCall = () => {
    dispatch({
      type: reducerCases.SET_CALL_ACCEPTED,
      callAccepted: true,
    });
    socket.current.emit(
      "request-accept-voice-call",
      incomingVoiceCall,
      callAccepted
    );
    const newTabUrl = `${CLIENT_HOST}/chat/${incomingVoiceCall.chatId}`;
    // Mở tab mới
    const newTab = window.open(newTabUrl, "_blank");
    // Kiểm tra nếu tab được tạo thành công và có thể focus, thì focus vào tab đó
    if (newTab && newTab.focus) {
      newTab.focus();
    }
    dispatch({
      type: reducerCases.SET_INCOMING_VOICE_CALL,
      incomingVoiceCall: undefined,
    });
  };
  const handleCancelVoiceCall = () => {
    socket.current.emit("request-cancel-voice-call", incomingVoiceCall);
    dispatch({
      type: reducerCases.SET_INCOMING_VOICE_CALL,
      incomingVoiceCall: undefined,
    });
  };
  const [isRinging, setIsRinging] = useState(false);

  // Khởi tạo âm thanh chờ với Howl
  const ringbackTone = useRef(
    new Howl({
      src: [nhacchuong], // Thay bằng đường dẫn đến tệp âm thanh chờ của bạn
      loop: true,
      volume: 1.0,
    })
  );

  useEffect(() => {
    if (incomingVoiceCall && incomingVoiceCall.receiveId === userInfo?.id) {
      // Phát âm thanh chờ khi có cuộc gọi đến
      ringbackTone.current.play();
      setIsRinging(true);
      console.log('Playing ringback tone');
      console.log(nhacchuong); // Kiểm tra xem đường dẫn âm thanh đã được import đúng chưa
    } else {
      // Dừng âm thanh khi không có cuộc gọi
      ringbackTone.current.stop();
      setIsRinging(false);
      console.log('Stopped ringback tone');
    }

    return () => {
      // Dừng âm thanh khi component bị unmount
      ringbackTone.current.stop();
    };
  }, [incomingVoiceCall, userInfo]);
  return (
    <div className="d-flex w-100">
      {incomingVoiceCall && incomingVoiceCall.receiveId === userInfo?.id && (
        <div className="d-flex justify-content-center align-items-center fixed-top tw-w-full tw-min-h-screen z-50 blur-bg">
          <div className="tw-py-4 tw-px-1 tw-w-[300px] bg-amber-300 tw-min-h-80 flex-wrap centẻ tw-bg-slate-950 tw-shadow-2xl tw-rounded-lg">
            <div className="tw-w-full tw-text-center">
              <span className="tw-text-xl tw-text-gray-300">Incoming call</span>
            </div>
            <div className="tw-w-full tw-flex tw-justify-center tw-mt-5">
              <img
                src={incomingVoiceCall.senderPicture}
                alt=""
                width={60}
                height={60}
                className="tw-rounded-full"
              />
            </div>
            <div className="tw-w-full tw-text-center tw-text-white tw-mt-3 tw-px-1">
              <span className="tw-text-2xl">{incomingVoiceCall.senderName} is calling you</span>
            </div>
            <div className="tw-w-full tw-text-center tw-text-white tw-mt-3 tw-px-10">
              <span className="tw-text-sm tw-text-gray-300">
                The call will begin as soon as you accept
              </span>
            </div>

            <div className="tw-w-full tw-text-center tw-flex tw-mt-4 tw-px-20 tw-justify-between">
              <div className="tw-justify-center tw-flex tw-items-center  tw-w-4/12">
                <div>
                  <div
                    className="tw-bg-red-500 tw-rounded-full tw-w-full tw-min-h-11 tw-cursor-pointer tw-flex tw-justify-center tw-items-center"
                    onClick={() => {
                      handleCancelVoiceCall();
                      ringbackTone.current.stop(); // Dừng âm thanh khi hủy cuộc gọi
                      setIsRinging(false);
                      console.log('Cancelled call');
                    }}
                  >
                    <IoMdClose className="tw-cursor-pointer tw-text-white tw-text-2xl tw-shadow-2xl" />
                  </div>
                  <span className="tw-text-sm tw-text-gray-300">Cancel</span>
                </div>
              </div>
              <div className="tw-justify-center tw-flex tw-items-center  tw-w-4/12">
                <div>
                  <div
                    className="tw-bg-green-500 tw-rounded-full tw-w-full tw-min-h-11 tw-cursor-pointer tw-flex tw-justify-center tw-items-center"
                    onClick={() => {
                      handleAcceptVoiceCall();
                      ringbackTone.current.stop(); // Dừng âm thanh khi chấp nhận cuộc gọi
                      setIsRinging(false);
                      console.log('Accepted call');
                    }}
                  >
                    <FaPhone className="tw-cursor-pointer tw-text-white tw-text-xl tw-shadow-2xl" />
                  </div>
                  <span className="tw-text-sm tw-text-gray-300">Accept</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      <div className="col-3 ">
        {!search && (
          <Stack
            className=" message-box tw-overflow-auto custom-scrollbar tw-max-h-[100vh] tw-z-30 tw-overflow-y-auto"
            gap={3}
          >
            <UserChat chats={chats ? chats : []} />
          </Stack>
        )}
        {search && (
          <Stack className="tw-overflow-auto custom-scrollbar tw-max-h-[82.5vh] tw-z-30 tw-mt-32">
            <MessageResultCard
              searchValue={searchValue}
              messages={messages}
              searchStartDate={searchStartDate}
              searchEndDate={searchEndDate}
              filterName={filterName}
            />
          </Stack>
        )}
      </div>
      {currentChat ? (
        showInfo ? (
          <div className="col-9 d-flex">
            <div className="col-8">
              <ChatBox
                chat={currentChat}
                toggleConversationInfo={toggleConversationInfo}
                showInfo={showInfo}
              />
            </div>
            <div className="col-4">
              <ConversationInfo chat={currentChat} />
            </div>
          </div>
        ) : (
          <div className="col-9 tw-z-0">
            <ChatBox
              chat={currentChat}
              toggleConversationInfo={toggleConversationInfo}
              showInfo={showInfo}
            />
          </div>
          // <div>aaaaaa</div>
        )
      ) : (
        <div className="col-9 tw-z-0">
          <div className="tw-overflow-hidden">
            <EmptyChatScreen />
          </div>
        </div>
      )}
    </div>
  );
};

export default Chat;
