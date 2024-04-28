import React, { useEffect, useState } from "react";
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
import { MdCancel } from "react-icons/md";
import { FaPhone } from "react-icons/fa6";
import { IoMdClose } from "react-icons/io";
import axios from "axios";
import { reducerCases } from "../context/constants";
import MessageResultCard from "./contact/card/MessageResultCard";

const Chat = () => {
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [showInfo, setShowInfo] = useState(false);

  const [
    { userInfo, currentChat, socket, incomingVoiceCall, callAccepted, search, searchValue, messages, searchStartDate, searchEndDate, filterName },
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

  const images = [
    {
      url: "https://scontent.fsgn2-7.fna.fbcdn.net/v/t39.30808-6/428624993_405250445378343_6788722697735108244_n.jpg?_nc_cat=100&ccb=1-7&_nc_sid=5f2048&_nc_ohc=gubRbnp_JuIAb7g2xV9&_nc_ht=scontent.fsgn2-7.fna&oh=00_AfAxJ7CNqizhJ1sk-QlgMiHxR0HkN2lpOUR611DLLHZ88Q&oe=661F45C1",
      alt: "Hình ảnh 1",
    },
    {
      url: "https://scontent.fsgn2-7.fna.fbcdn.net/v/t39.30808-6/428624993_405250445378343_6788722697735108244_n.jpg?_nc_cat=100&ccb=1-7&_nc_sid=5f2048&_nc_ohc=gubRbnp_JuIAb7g2xV9&_nc_ht=scontent.fsgn2-7.fna&oh=00_AfAxJ7CNqizhJ1sk-QlgMiHxR0HkN2lpOUR611DLLHZ88Q&oe=661F45C1",
      alt: "Hình ảnh 2",
    },
    {
      url: "https://scontent.fsgn2-7.fna.fbcdn.net/v/t39.30808-6/428624993_405250445378343_6788722697735108244_n.jpg?_nc_cat=100&ccb=1-7&_nc_sid=5f2048&_nc_ohc=gubRbnp_JuIAb7g2xV9&_nc_ht=scontent.fsgn2-7.fna&oh=00_AfAxJ7CNqizhJ1sk-QlgMiHxR0HkN2lpOUR611DLLHZ88Q&oe=661F45C1",
      alt: "Hình ảnh 2",
    },
    {
      url: "https://scontent.fsgn2-7.fna.fbcdn.net/v/t39.30808-6/428624993_405250445378343_6788722697735108244_n.jpg?_nc_cat=100&ccb=1-7&_nc_sid=5f2048&_nc_ohc=gubRbnp_JuIAb7g2xV9&_nc_ht=scontent.fsgn2-7.fna&oh=00_AfAxJ7CNqizhJ1sk-QlgMiHxR0HkN2lpOUR611DLLHZ88Q&oe=661F45C1",
      alt: "Hình ảnh 2",
    },
    {
      url: "https://scontent.fsgn2-7.fna.fbcdn.net/v/t39.30808-6/428624993_405250445378343_6788722697735108244_n.jpg?_nc_cat=100&ccb=1-7&_nc_sid=5f2048&_nc_ohc=gubRbnp_JuIAb7g2xV9&_nc_ht=scontent.fsgn2-7.fna&oh=00_AfAxJ7CNqizhJ1sk-QlgMiHxR0HkN2lpOUR611DLLHZ88Q&oe=661F45C1",
      alt: "Hình ảnh 2",
    },
    {
      url: "https://scontent.fsgn2-7.fna.fbcdn.net/v/t39.30808-6/428624993_405250445378343_6788722697735108244_n.jpg?_nc_cat=100&ccb=1-7&_nc_sid=5f2048&_nc_ohc=gubRbnp_JuIAb7g2xV9&_nc_ht=scontent.fsgn2-7.fna&oh=00_AfAxJ7CNqizhJ1sk-QlgMiHxR0HkN2lpOUR611DLLHZ88Q&oe=661F45C1",
      alt: "Hình ảnh 2",
    },
    {
      url: "https://scontent.fsgn2-7.fna.fbcdn.net/v/t39.30808-6/428624993_405250445378343_6788722697735108244_n.jpg?_nc_cat=100&ccb=1-7&_nc_sid=5f2048&_nc_ohc=gubRbnp_JuIAb7g2xV9&_nc_ht=scontent.fsgn2-7.fna&oh=00_AfAxJ7CNqizhJ1sk-QlgMiHxR0HkN2lpOUR611DLLHZ88Q&oe=661F45C1",
      alt: "Hình ảnh 2",
    },
    {
      url: "https://scontent.fsgn2-7.fna.fbcdn.net/v/t39.30808-6/428624993_405250445378343_6788722697735108244_n.jpg?_nc_cat=100&ccb=1-7&_nc_sid=5f2048&_nc_ohc=gubRbnp_JuIAb7g2xV9&_nc_ht=scontent.fsgn2-7.fna&oh=00_AfAxJ7CNqizhJ1sk-QlgMiHxR0HkN2lpOUR611DLLHZ88Q&oe=661F45C1",
      alt: "Hình ảnh 2",
    },
    {
      url: "https://scontent.fsgn2-7.fna.fbcdn.net/v/t39.30808-6/428624993_405250445378343_6788722697735108244_n.jpg?_nc_cat=100&ccb=1-7&_nc_sid=5f2048&_nc_ohc=gubRbnp_JuIAb7g2xV9&_nc_ht=scontent.fsgn2-7.fna&oh=00_AfAxJ7CNqizhJ1sk-QlgMiHxR0HkN2lpOUR611DLLHZ88Q&oe=661F45C1",
      alt: "Hình ảnh 2",
    },
  ];

  const files = [
    {
      name: "file1.ppt",
      size: "2MB",
      date: "2024-04-15",
      imageUrl:
        "https://scontent.fsgn2-7.fna.fbcdn.net/v/t39.30808-6/428624993_405250445378343_6788722697735108244_n.jpg?_nc_cat=100&ccb=1-7&_nc_sid=5f2048&_nc_ohc=gubRbnp_JuIAb7g2xV9&_nc_ht=scontent.fsgn2-7.fna&oh=00_AfAxJ7CNqizhJ1sk-QlgMiHxR0HkN2lpOUR611DLLHZ88Q&oe=661F45C1",
      fileType: "ppt",
    },
    {
      name: "file2.docx",
      size: "1.5MB",
      date: "2024-04-16",
      imageUrl:
        "https://scontent.fsgn2-7.fna.fbcdn.net/v/t39.30808-6/428624993_405250445378343_6788722697735108244_n.jpg?_nc_cat=100&ccb=1-7&_nc_sid=5f2048&_nc_ohc=gubRbnp_JuIAb7g2xV9&_nc_ht=scontent.fsgn2-7.fna&oh=00_AfAxJ7CNqizhJ1sk-QlgMiHxR0HkN2lpOUR611DLLHZ88Q&oe=661F45C1",
      fileType: "docx",
    },
    {
      name: "file3.txt",
      size: "500KB",
      date: "2024-04-17",
      imageUrl:
        "https://scontent.fsgn2-7.fna.fbcdn.net/v/t39.30808-6/428624993_405250445378343_6788722697735108244_n.jpg?_nc_cat=100&ccb=1-7&_nc_sid=5f2048&_nc_ohc=gubRbnp_JuIAb7g2xV9&_nc_ht=scontent.fsgn2-7.fna&oh=00_AfAxJ7CNqizhJ1sk-QlgMiHxR0HkN2lpOUR611DLLHZ88Q&oe=661F45C1",
      fileType: "txt",
    },
    {
      name: "file3.txt",
      size: "500KB",
      date: "2024-04-17",
      imageUrl:
        "https://scontent.fsgn2-7.fna.fbcdn.net/v/t39.30808-6/428624993_405250445378343_6788722697735108244_n.jpg?_nc_cat=100&ccb=1-7&_nc_sid=5f2048&_nc_ohc=gubRbnp_JuIAb7g2xV9&_nc_ht=scontent.fsgn2-7.fna&oh=00_AfAxJ7CNqizhJ1sk-QlgMiHxR0HkN2lpOUR611DLLHZ88Q&oe=661F45C1",
      fileType: "txt",
    },
    // Thêm các đối tượng file khác vào đây
  ];
  const links = [
    {
      title: "Google",
      url: "https://www.google.com",
      description: "A popular search engine.",
    },
    {
      title: "OpenAI",
      url: "https://www.openai.com",
      description: "A leading AI research lab.",
    },
    {
      title: "GitHub",
      url: "https://www.github.com",
      description: "A platform for hosting and collaborating on code.",
    },
    // Thêm các đối tượng liên kết khác vào đây
  ];
  const members = [
    {
      id: 1,
      name: "Trú Nghi",
      avatar:
        "https://scontent.fsgn2-7.fna.fbcdn.net/v/t39.30808-6/428624993_405250445378343_6788722697735108244_n.jpg?_nc_cat=100&ccb=1-7&_nc_sid=5f2048&_nc_ohc=gubRbnp_JuIAb7g2xV9&_nc_ht=scontent.fsgn2-7.fna&oh=00_AfAxJ7CNqizhJ1sk-QlgMiHxR0HkN2lpOUR611DLLHZ88Q&oe=661F45C1",
    },
    {
      id: 2,
      name: "Cu Ngảnh",
      avatar:
        "https://scontent.fsgn2-7.fna.fbcdn.net/v/t39.30808-6/428624993_405250445378343_6788722697735108244_n.jpg?_nc_cat=100&ccb=1-7&_nc_sid=5f2048&_nc_ohc=gubRbnp_JuIAb7g2xV9&_nc_ht=scontent.fsgn2-7.fna&oh=00_AfAxJ7CNqizhJ1sk-QlgMiHxR0HkN2lpOUR611DLLHZ88Q&oe=661F45C1",
    },
    {
      id: 3,
      name: "Hủ Ngai",
      avatar:
        "https://scontent.fsgn2-7.fna.fbcdn.net/v/t39.30808-6/428624993_405250445378343_6788722697735108244_n.jpg?_nc_cat=100&ccb=1-7&_nc_sid=5f2048&_nc_ohc=gubRbnp_JuIAb7g2xV9&_nc_ht=scontent.fsgn2-7.fna&oh=00_AfAxJ7CNqizhJ1sk-QlgMiHxR0HkN2lpOUR611DLLHZ88Q&oe=661F45C1",
    },
    // Các thành viên khác...
  ];

  return (
    <div className="d-flex w-100">
      {incomingVoiceCall && incomingVoiceCall.receiveId == userInfo?.id && (
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
              <span className="tw-text-2xl">Tri is calling you</span>
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
                    onClick={() => handleCancelVoiceCall()}
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
                    onClick={() => handleAcceptVoiceCall()}
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
            <MessageResultCard searchValue={searchValue} messages={messages} searchStartDate={searchStartDate} searchEndDate={searchEndDate} filterName={filterName} />
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
              <ConversationInfo
                chat={currentChat}
                images={images}
                files={files}
                links={links}
                members={members}
              />
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
          <div className="">
            <EmptyChatScreen />
          </div>
        </div>
      )}
    </div>
  );
};

export default Chat;
