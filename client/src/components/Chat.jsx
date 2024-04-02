import React, { useEffect, useState } from "react";
import { Container, Row, Col, Stack } from "react-bootstrap";
import UserChat from "./chat/UserChat";
import ChatBox from "./chat/ChatBox";
import ConversationInfo from "./chat/ConversationInfo";
import EmptyChatScreen from "./chat/EmptyChatScreen";
import { useStateProvider } from "../context/StateContext";
import { CHAT_API, GET_CHAT_BY_PARTICIPANTS } from "../router/ApiRoutes";
import axios from "axios";

const Chat = () => {
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [showInfo, setShowInfo] = useState(false);

  const [{ userInfo, currentChat, socket }] = useStateProvider()
  const [chat, setChat] = useState({});
  const [chats, setChats] = useState([]);

  useEffect(() => {
    socket.current.emit("get-online-user")

    socket.current.on("online-users", (userList) => {
      console.log("Online users:", userList);
    });
  }, [socket.current])

  useEffect(() => {
    const fetchChatData = async () => {
      try {
        const response = await axios.get(GET_CHAT_BY_PARTICIPANTS + userInfo?.id); // Gọi API để lấy dữ liệu chat
        setChats(response.data);
        console.log(chats) // Cập nhật dữ liệu chat vào state
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
    setShowInfo(!showInfo)
  };

  const handleSelectMessage = (message) => {
    // Xử lý khi người dùng chọn một tin nhắn trong CombinedComponentWithScrollbar
    setSelectedMessage(message);
  };
  return (
    <div className="d-flex w-100">
      <div className="col-3 border-r-2 border-gray-300">
        <Stack className="message-box flex-grow-0" gap={3}>
          <UserChat chats={chats ? chats : []} />
        </Stack>
      </div>
      {currentChat ? (
        showInfo ? (
          <div className="col-9 d-flex">
            <div className="col-8">
              <ChatBox chat={currentChat} toggleConversationInfo={toggleConversationInfo} showInfo={showInfo} />
            </div>
            <div className="col-4">
              <ConversationInfo chat={currentChat} />
            </div>
          </div>


        ) : (
          <div className="col-9">
            <ChatBox chat={currentChat} toggleConversationInfo={toggleConversationInfo} showInfo={showInfo} />
          </div>
          // <div>aaaaaa</div>
        )
      ) : (<div className="col-9">
        <div className="">
          <EmptyChatScreen />
        </div>
      </div>)}
    </div >
  );
};

export default Chat;
