import React, { useEffect, useState } from "react";
import { Container, Row, Col, Stack } from "react-bootstrap";
import UserChat from "./chat/UserChat";
import ChatBox from "./chat/ChatBox";
import ConversationInfo from "./chat/ConversationInfo";
import EmptyChatScreen from "./chat/EmptyChatScreen";
import { useStateProvider } from "../context/StateContext";
import { CHAT_API, GET_CHAT_BY_PARTICIPANTS } from "../router/ApiRoutes";
import axios from "axios";
import xls from "../assets/xls.png";
import xlsx from "../assets/xlsx.png";
import txt from "../assets/txt.png";
import pdf from "../assets/pdf.png";
import doc from "../assets/doc.png";
import docx from "../assets/docx.png";
import ppt from "../assets/ppt.png";

const Chat = () => {
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [showInfo, setShowInfo] = useState(false);

  const [{ userInfo, currentChat, socket }] = useStateProvider()
  const [chats, setChats] = useState([]);


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

  const images = [
    { url: 'https://scontent.fsgn2-7.fna.fbcdn.net/v/t39.30808-6/428624993_405250445378343_6788722697735108244_n.jpg?_nc_cat=100&ccb=1-7&_nc_sid=5f2048&_nc_ohc=gubRbnp_JuIAb7g2xV9&_nc_ht=scontent.fsgn2-7.fna&oh=00_AfAxJ7CNqizhJ1sk-QlgMiHxR0HkN2lpOUR611DLLHZ88Q&oe=661F45C1', alt: 'Hình ảnh 1' },
    { url: 'https://scontent.fsgn2-7.fna.fbcdn.net/v/t39.30808-6/428624993_405250445378343_6788722697735108244_n.jpg?_nc_cat=100&ccb=1-7&_nc_sid=5f2048&_nc_ohc=gubRbnp_JuIAb7g2xV9&_nc_ht=scontent.fsgn2-7.fna&oh=00_AfAxJ7CNqizhJ1sk-QlgMiHxR0HkN2lpOUR611DLLHZ88Q&oe=661F45C1', alt: 'Hình ảnh 2' },
    { url: 'https://scontent.fsgn2-7.fna.fbcdn.net/v/t39.30808-6/428624993_405250445378343_6788722697735108244_n.jpg?_nc_cat=100&ccb=1-7&_nc_sid=5f2048&_nc_ohc=gubRbnp_JuIAb7g2xV9&_nc_ht=scontent.fsgn2-7.fna&oh=00_AfAxJ7CNqizhJ1sk-QlgMiHxR0HkN2lpOUR611DLLHZ88Q&oe=661F45C1', alt: 'Hình ảnh 2' },
    { url: 'https://scontent.fsgn2-7.fna.fbcdn.net/v/t39.30808-6/428624993_405250445378343_6788722697735108244_n.jpg?_nc_cat=100&ccb=1-7&_nc_sid=5f2048&_nc_ohc=gubRbnp_JuIAb7g2xV9&_nc_ht=scontent.fsgn2-7.fna&oh=00_AfAxJ7CNqizhJ1sk-QlgMiHxR0HkN2lpOUR611DLLHZ88Q&oe=661F45C1', alt: 'Hình ảnh 2' },
    { url: 'https://scontent.fsgn2-7.fna.fbcdn.net/v/t39.30808-6/428624993_405250445378343_6788722697735108244_n.jpg?_nc_cat=100&ccb=1-7&_nc_sid=5f2048&_nc_ohc=gubRbnp_JuIAb7g2xV9&_nc_ht=scontent.fsgn2-7.fna&oh=00_AfAxJ7CNqizhJ1sk-QlgMiHxR0HkN2lpOUR611DLLHZ88Q&oe=661F45C1', alt: 'Hình ảnh 2' },
    { url: 'https://scontent.fsgn2-7.fna.fbcdn.net/v/t39.30808-6/428624993_405250445378343_6788722697735108244_n.jpg?_nc_cat=100&ccb=1-7&_nc_sid=5f2048&_nc_ohc=gubRbnp_JuIAb7g2xV9&_nc_ht=scontent.fsgn2-7.fna&oh=00_AfAxJ7CNqizhJ1sk-QlgMiHxR0HkN2lpOUR611DLLHZ88Q&oe=661F45C1', alt: 'Hình ảnh 2' },
    { url: 'https://scontent.fsgn2-7.fna.fbcdn.net/v/t39.30808-6/428624993_405250445378343_6788722697735108244_n.jpg?_nc_cat=100&ccb=1-7&_nc_sid=5f2048&_nc_ohc=gubRbnp_JuIAb7g2xV9&_nc_ht=scontent.fsgn2-7.fna&oh=00_AfAxJ7CNqizhJ1sk-QlgMiHxR0HkN2lpOUR611DLLHZ88Q&oe=661F45C1', alt: 'Hình ảnh 2' },
    { url: 'https://scontent.fsgn2-7.fna.fbcdn.net/v/t39.30808-6/428624993_405250445378343_6788722697735108244_n.jpg?_nc_cat=100&ccb=1-7&_nc_sid=5f2048&_nc_ohc=gubRbnp_JuIAb7g2xV9&_nc_ht=scontent.fsgn2-7.fna&oh=00_AfAxJ7CNqizhJ1sk-QlgMiHxR0HkN2lpOUR611DLLHZ88Q&oe=661F45C1', alt: 'Hình ảnh 2' },
    { url: 'https://scontent.fsgn2-7.fna.fbcdn.net/v/t39.30808-6/428624993_405250445378343_6788722697735108244_n.jpg?_nc_cat=100&ccb=1-7&_nc_sid=5f2048&_nc_ohc=gubRbnp_JuIAb7g2xV9&_nc_ht=scontent.fsgn2-7.fna&oh=00_AfAxJ7CNqizhJ1sk-QlgMiHxR0HkN2lpOUR611DLLHZ88Q&oe=661F45C1', alt: 'Hình ảnh 2' },
  ];

  const files = [
    {
      name: 'file1.ppt',
      size: '2MB',
      date: '2024-04-15',
      imageUrl: 'https://scontent.fsgn2-7.fna.fbcdn.net/v/t39.30808-6/428624993_405250445378343_6788722697735108244_n.jpg?_nc_cat=100&ccb=1-7&_nc_sid=5f2048&_nc_ohc=gubRbnp_JuIAb7g2xV9&_nc_ht=scontent.fsgn2-7.fna&oh=00_AfAxJ7CNqizhJ1sk-QlgMiHxR0HkN2lpOUR611DLLHZ88Q&oe=661F45C1',
      fileType: 'ppt'
    },
    {
      name: 'file2.docx',
      size: '1.5MB',
      date: '2024-04-16',
      imageUrl: 'https://scontent.fsgn2-7.fna.fbcdn.net/v/t39.30808-6/428624993_405250445378343_6788722697735108244_n.jpg?_nc_cat=100&ccb=1-7&_nc_sid=5f2048&_nc_ohc=gubRbnp_JuIAb7g2xV9&_nc_ht=scontent.fsgn2-7.fna&oh=00_AfAxJ7CNqizhJ1sk-QlgMiHxR0HkN2lpOUR611DLLHZ88Q&oe=661F45C1',
      fileType: 'docx'
    },
    {
      name: 'file3.txt',
      size: '500KB',
      date: '2024-04-17',
      imageUrl: 'https://scontent.fsgn2-7.fna.fbcdn.net/v/t39.30808-6/428624993_405250445378343_6788722697735108244_n.jpg?_nc_cat=100&ccb=1-7&_nc_sid=5f2048&_nc_ohc=gubRbnp_JuIAb7g2xV9&_nc_ht=scontent.fsgn2-7.fna&oh=00_AfAxJ7CNqizhJ1sk-QlgMiHxR0HkN2lpOUR611DLLHZ88Q&oe=661F45C1',
      fileType: 'txt'
    },
    {
      name: 'file3.txt',
      size: '500KB',
      date: '2024-04-17',
      imageUrl: 'https://scontent.fsgn2-7.fna.fbcdn.net/v/t39.30808-6/428624993_405250445378343_6788722697735108244_n.jpg?_nc_cat=100&ccb=1-7&_nc_sid=5f2048&_nc_ohc=gubRbnp_JuIAb7g2xV9&_nc_ht=scontent.fsgn2-7.fna&oh=00_AfAxJ7CNqizhJ1sk-QlgMiHxR0HkN2lpOUR611DLLHZ88Q&oe=661F45C1',
      fileType: 'txt'
    },
    // Thêm các đối tượng file khác vào đây
  ];
  const links = [
    {
      title: 'Google',
      url: 'https://www.google.com',
      description: 'A popular search engine.'
    },
    {
      title: 'OpenAI',
      url: 'https://www.openai.com',
      description: 'A leading AI research lab.'
    },
    {
      title: 'GitHub',
      url: 'https://www.github.com',
      description: 'A platform for hosting and collaborating on code.'
    },
    // Thêm các đối tượng liên kết khác vào đây
  ];
  const members = [
    {
      id: 1,
      name: "Trú Nghi",
      avatar: 'https://scontent.fsgn2-7.fna.fbcdn.net/v/t39.30808-6/428624993_405250445378343_6788722697735108244_n.jpg?_nc_cat=100&ccb=1-7&_nc_sid=5f2048&_nc_ohc=gubRbnp_JuIAb7g2xV9&_nc_ht=scontent.fsgn2-7.fna&oh=00_AfAxJ7CNqizhJ1sk-QlgMiHxR0HkN2lpOUR611DLLHZ88Q&oe=661F45C1'
    },
    { id: 2, name: "Cu Ngảnh", avatar: 'https://scontent.fsgn2-7.fna.fbcdn.net/v/t39.30808-6/428624993_405250445378343_6788722697735108244_n.jpg?_nc_cat=100&ccb=1-7&_nc_sid=5f2048&_nc_ohc=gubRbnp_JuIAb7g2xV9&_nc_ht=scontent.fsgn2-7.fna&oh=00_AfAxJ7CNqizhJ1sk-QlgMiHxR0HkN2lpOUR611DLLHZ88Q&oe=661F45C1' },
    { id: 3, name: "Hủ Ngai", avatar: 'https://scontent.fsgn2-7.fna.fbcdn.net/v/t39.30808-6/428624993_405250445378343_6788722697735108244_n.jpg?_nc_cat=100&ccb=1-7&_nc_sid=5f2048&_nc_ohc=gubRbnp_JuIAb7g2xV9&_nc_ht=scontent.fsgn2-7.fna&oh=00_AfAxJ7CNqizhJ1sk-QlgMiHxR0HkN2lpOUR611DLLHZ88Q&oe=661F45C1' },
    // Các thành viên khác...
  ];
  return (
    <div className="d-flex w-100">
      <div className="col-3">
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
              <ConversationInfo chat={currentChat} images={images} files={files} links={links} members={members} />
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
