import { Stack } from "react-bootstrap";
import {
  FileImageOutlined,
  SmileOutlined,
  LinkOutlined,
  SendOutlined,
  AudioOutlined,
  DownOutlined,
} from "@ant-design/icons";
import ReactPlayer from "react-player";
import { IoIosSend } from "react-icons/io";
import { IoMdSearch, IoIosCall, IoIosVideocam } from "react-icons/io";
import { VscLayoutSidebarRightOff } from "react-icons/vsc";
import React, { useEffect, useRef, useState } from "react";
import { useStateProvider } from "../../context/StateContext";
import TextArea from "antd/es/input/TextArea";
import { CHAT_API, CLIENT_HOST, GET_ALL_USER } from "../../router/ApiRoutes";
import { reducerCases } from "../../context/constants";
import axios from "axios";
import { calculateTime } from "./../../utils/CalculateTime";
import { MdDeleteForever } from "react-icons/md";
import ChatImage from "../contact/card/ChatImage";
import xls from "../../assets/xls.png";
import xlsx from "../../assets/xlsx.png";
import txt from "../../assets/txt.png";
import pdf from "../../assets/pdf.png";
import doc from "../../assets/doc.png";
import docx from "../../assets/docx.png";
import ppt from "../../assets/ppt.png";
import EmojiPicker from "emoji-picker-react";
import { SlReload } from "react-icons/sl";
import { IoIosRedo } from "react-icons/io";
import { BiPhone, BiSolidQuoteRight } from "react-icons/bi";
import { BiSolidQuoteAltRight } from "react-icons/bi";
import { v4 as uuidv4 } from "uuid";
import ForwardModal from "../contact/modal/ForwardModal";
import { FaMicrophone } from "react-icons/fa6";
import { CiMicrophoneOn } from "react-icons/ci";
import CaptureAudio from "./CaptureAudio";
import RemoveMessageModal from "../contact/modal/RemoveMessageModal";
import RecordCard from "../contact/card/RecordCard";
import { BsPersonAdd } from "react-icons/bs";
import ModalAddMember from "./modal/ModalAddMember";
import { DatePicker, Space, Dropdown, Menu, Button, Select, List } from "antd";
import { Option } from "antd/es/mentions";
import moment from "moment";

const ChatBox = ({ chat, toggleConversationInfo, showInfo }) => {
  const [sendMessages, setSendMessages] = useState([]);
  const [isHovered, setIsHovered] = useState(false);

  const [
    {
      messages,
      userInfo,
      currentChat,
      groups,
      socket,
      onlineUsers,
      search,
      searchValue,
      searchStartDate,
      searchEndDate,
    },
    dispatch,
  ] = useStateProvider();
  const [selectedImages, setSelectedImages] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const emojiPickerRef = useRef(null);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [replyMessage, setReplyMessage] = useState({});
  const [shareMessage, setShareMessage] = useState({});
  const [showReplyTooltip, setShowReplyTooltip] = useState(false);
  const messageRefs = useRef([]);
  const [scrollToMessageId, setScrollToMessageId] = useState(null);
  const [showFormShareMessage, setShowFormShareMessage] = useState(false);
  const [showAudioRecorder, setShowAudioRecorder] = useState(false);
  const [showFormRemoveMessage, setShowFormRemoveMessage] = useState(false);
  const [showModalAddMember, setShowModalAddMember] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [dropdownNameVisible, setDropdownNameVisible] = useState(false);
  const [dropdownDateVisible, setDropdownDateVisible] = useState(false);
  const [datePickerDisabled, setDatePickerDisabled] = useState(false);
  const [searchByName, setSearchByName] = useState("");
  const [allUsers, setAllUsers] = useState([]);
  const [chatParticipants, setChatParticipants] = useState([]);

  const handleShowFormShareMessage = () => setShowFormShareMessage(true);
  const handleShowFormRemoveMessage = () => setShowFormRemoveMessage(true);

  const handleCloseModalAddMember = () => {
    setShowModalAddMember(!showModalAddMember);
  };
  const handleCloseModal = () => {
    setShowFormShareMessage(false);
    setShareMessage({});
  };
  const handleCloseRemoveMessageModal = () => {
    setShowFormRemoveMessage(false);
  };
  const handleEmojiModal = () => {
    setShowEmojiPicker(!showEmojiPicker);
  };
  const updateMessageRefs = (element, index) => {
    messageRefs.current[index] = element;
  };
  const scrollToMessage = (index) => {
    if (messageRefs.current[index]) {
      messageRefs.current[index].scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleEmojiClick = (emoji) => {
    setSendMessages((prevMessage) => (prevMessage += emoji.emoji));
  };
  // const [tempMessage, setTempMessage] = useState('');

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && e.shiftKey) {
      // Nếu nhấn Shift + Enter, thêm ký tự xuống dòng vào tin nhắn
      setSendMessages(sendMessages);
    } else if (e.key === "Enter") {
      // Nếu chỉ nhấn Enter, gửi tin nhắn và reset tin nhắn
      handleSendMessage();
    }
  };
  // useEffect(() => {
  //   const handleOutSideClick = (event) => {
  //     if (event.target.id !== "emoji-open") {
  //       if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target)) {
  //         // setShowEmojiPicker(false)
  //       }
  //     }
  //   }
  //   document.addEventListener("click", handleOutSideClick)
  //   return () => {
  //     document.removeEventListener("click", handleOutSideClick)
  //   }
  // }, [])

  const handleImageInputChange = (e) => {
    const files = Array.from(e.target.files);
    setSelectedImages((prevImages) => [...prevImages, ...files]);
  };
  const handleRemoveImage = (index) => {
    setSelectedImages((prevImages) => prevImages.filter((_, i) => i !== index));
  };
  const receiveId =
    currentChat?.participants.length == 2
      ? currentChat?.participants.reduce((acc, participantId) => {
          if (participantId !== userInfo?.id) {
            acc = participantId;
          }
          return acc;
        }, null)
      : "";
  const handleSendMessage = async () => {
    if (
      sendMessages.length > 0 ||
      selectedImages.length > 0 ||
      selectedFiles.length > 0 ||
      showReplyTooltip
    ) {
      let type = "text";
      let content = "";
      let messageId = "";
      messageId = uuidv4();
      if (
        showReplyTooltip &&
        (selectedImages.length > 0 || selectedFiles.length > 0)
      ) {
        alert("Can't reply message and send photos or files at the same time");
        return;
      }

      if (selectedImages.length > 0 && selectedFiles.length > 0) {
        alert("Can't send photos and files at the same time");
        return;
      }
      // Nếu có hình ảnh được chọn, gửi hình ảnh trước
      if (
        selectedImages.length > 0 &&
        selectedFiles.length == 0 &&
        !showReplyTooltip
      ) {
        try {
          const formData = new FormData();
          selectedImages.forEach((image, index) => {
            formData.append(`images`, image);
          });

          const { data } = await axios.post(
            CHAT_API + currentChat?.chatId + "/images",
            formData
          );

          content = data.data;
          type = "image";
        } catch (error) {
          console.log("Error uploading images:", error);
          return;
        }
      }
      if (
        selectedFiles.length > 0 &&
        selectedImages == 0 &&
        !showReplyTooltip
      ) {
        const formData = new FormData();
        selectedFiles.forEach((file, index) => {
          const encodedFileName = encodeURIComponent(file.name);
          formData.append(`files`, file, encodedFileName);
        });

        try {
          const response = await axios.post(
            CHAT_API + currentChat?.chatId + "/files",
            formData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            }
          );
          content += response.data.data;
          type = "files";
        } catch (error) {
          console.error("Error uploading files:", error);
        }
      }
      if (
        showReplyTooltip &&
        selectedFiles.length == 0 &&
        selectedImages.length == 0
      ) {
        type = "reply";

        messageId = replyMessage.messageId;
      }

      try {
        content += sendMessages;

        const { data } = await axios.put(
          CHAT_API + currentChat?.chatId + "/messages",
          {
            newMessage: {
              messageId: messageId,
              senderId: userInfo?.id,
              senderName: userInfo?.display_name,
              senderPicture: userInfo?.avatar,
              type: type,
              content: content,
              timestamp: Date.now(),
            },
          }
        );

        if (currentChat.type == "private") {
          socket.current.emit("send-msg-private", {
            receiveId: receiveId,
            newMessage: {
              messageId: messageId,
              senderId: userInfo?.id,
              senderName: userInfo?.display_name,
              senderPicture: userInfo?.avatar,
              type: type,
              content: content,
              timestamp: Date.now(),
            },
          });
        }
        if (currentChat.type == "public") {
          socket.current.emit("send-msg-public", currentChat.chatId, {
            receiveId: currentChat.participants.filter(
              (p) => p !== userInfo?.id
            ),
            newMessage: {
              messageId: messageId,
              senderId: userInfo?.id,
              senderName: userInfo?.display_name,
              senderPicture: userInfo?.avatar,
              type: type,
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
        setReplyMessage({}); // Xóa nội dung tin nhắn reply
        setShowReplyTooltip(false); // Ẩn tooltip
        setSelectedFiles([]);
        setSelectedImages([]);
        setSendMessages("");
      } catch (error) {
        console.log(error);
      }
    }
  };
  const convertName = () => {
    if (currentChat) {
      if (chat.type == "private") {
        const splitName = chat.name.split("/");
        const displayName =
          splitName[0] !== userInfo?.display_name ? splitName[0] : splitName[1];
        return displayName;
      }
      return chat.name;
    } else {
      return "";
    }
  };
  const convertPicture = () => {
    if (currentChat) {
      if (chat.type == "private") {
        const splitPicture = chat.picture.split("|");
        const receiverPicture =
          splitPicture[0] !== userInfo?.avatar
            ? splitPicture[0]
            : splitPicture[1];
        return receiverPicture;
      }
      return chat.picture;
    } else {
      return "";
    }
  };
  // const openNewWindow = (chatId) => {

  //   return () => {
  //     socket.current.emit("get-browser", chatId);
  //   };
  // };

  const handleFileInputChange = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles((prevFiles) => [...prevFiles, ...files]);
  };
  const handleRemoveFile = (index) => {
    setSelectedFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  // const handleAttachFiles = () => {
  //   document.getElementById('file-input').click();
  // };

  // const handleVoiceCall = () => {
  //   if (currentChat.type === "private") {

  //     socket.current.emit("request-to-voice-call-private", {
  //       receiveId: receiveId,
  //       senderId: userInfo?.id,
  //       senderName: userInfo?.display_name
  //     });
  //   }
  // };
  const handleClickOpenTab = () => {
    let receiverId = undefined;
    let receiverName = undefined;
    if (currentChat.type == "public") {
      receiverId = "I do not know";
      receiverName = currentChat.name;
      sendVoiceCallRequest(receiverId, userInfo?.id);
      const newTabUrl = `${CLIENT_HOST}/chat/${currentChat.chatId}`;
      // Mở tab mới
      const newTab = window.open(newTabUrl, "_blank");
      // Kiểm tra nếu tab được tạo thành công và có thể focus, thì focus vào tab đó
      if (newTab && newTab.focus) {
        newTab.focus();
      }
    } else {
      receiverId =
        currentChat.participants[0] == userInfo?.id
          ? currentChat.participants[1]
          : currentChat.participants[0];
      receiverName = convertName();
      if (onlineUsers.includes(receiverId)) {
        // Tạo URL cho tab mới
        sendVoiceCallRequest(receiverId, userInfo?.id);
        const newTabUrl = `${CLIENT_HOST}/chat/${currentChat.chatId}`;
        // Mở tab mới
        const newTab = window.open(newTabUrl, "_blank");
        // Kiểm tra nếu tab được tạo thành công và có thể focus, thì focus vào tab đó
        if (newTab && newTab.focus) {
          newTab.focus();
        }
      } else {
        const incomingVoiceCall = {
          receiveId: receiverId,
          senderId: userInfo?.id,
          senderPicture: userInfo?.avatar,
          senderName: userInfo?.display_name,
          receiveName: receiverName,
          receivePicture: convertPicture(),
          chatId: currentChat.chatId,
        };
        dispatch({
          type: reducerCases.SET_INCOMING_VOICE_CALL,
          incomingVoiceCall: incomingVoiceCall,
        });
        dispatch({
          type: reducerCases.SET_CALL_PAGE,
          callPage: true,
        });
      }
    }
  };
  const sendVoiceCallRequest = (receiverId, senderId) => {
    const incomingVoiceCall = {
      receiveId: receiverId,
      senderId: senderId,
      senderPicture: userInfo?.avatar,
      senderName: userInfo?.display_name,
      receiveName: convertName(),
      receivePicture: convertPicture(),
      chatId: currentChat.chatId,
    };
    dispatch({
      type: reducerCases.SET_INCOMING_VOICE_CALL,
      incomingVoiceCall: incomingVoiceCall,
    });
    if (currentChat.type == "private")
      socket.current.emit("request-to-voice-call-private", incomingVoiceCall);
    if (currentChat.type == "public")
      console.log("request-to-voice-call-public");
    socket.current.emit("request-to-voice-call-public", {
      currentChat: currentChat,
      incomingVoiceCall: incomingVoiceCall,
    });
  };
  const handleMouseEnter = (index) => {
    setHoveredIndex(index);
  };

  const handleMouseLeave = () => {
    setHoveredIndex(null);
  };

  const handleForward = (message) => {
    handleShowFormShareMessage();
    setShareMessage(message);
  };
  const handleReply = (message) => {
    setReplyMessage(message);
    setShowReplyTooltip(true);
  };
  const handleClickReply = (messageId) => {
    setScrollToMessageId(messageId); // Set messageId cần cuộn đế
  };
  const handleRemove = (messageId) => {
    // window.alert(messageId)
    handleShowFormRemoveMessage();
  };

  const handleCloseReply = () => {
    // Xử lý khi tooltip được đóng đi
    setReplyMessage({}); // Xóa nội dung tin nhắn reply
    setShowReplyTooltip(false); // Ẩn tooltip
  };
  useEffect(() => {
    const lastMessageIndex = messages.length - 1;
    scrollToMessage(lastMessageIndex);
  }, [messages]);

  const findMessageIndexById = (messageId) => {
    return messages.findIndex((message) => message.messageId === messageId);
  };
  const findMessageById = (messageId) => {
    return messages.find((message) => message.messageId === messageId);
  };

  useEffect(() => {
    if (scrollToMessageId) {
      // Tìm index của message có messageId bằng với scrollToMessageId
      const index = findMessageIndexById(scrollToMessageId);
      if (index !== -1) {
        // Cuộn đến message tương ứng nếu tìm thấy
        scrollToMessage(index);
      }
      // Reset lại state scrollToMessageId sau khi đã cuộn đến message
      setScrollToMessageId(null);
    }
  }, [messages, scrollToMessageId]); // useEffect sẽ chạy lại khi messages hoặc scrollToMessageId thay đổi

  const closeAudioRecorder = () => {
    setShowAudioRecorder(false);
  };
  const handleSearch = () => {
    dispatch({
      type: reducerCases.SET_SEARCH,
      search: true,
    });
  };
  const handleCloseSearch = () => {
    console.log(currentChat.participants);
    dispatch({
      type: reducerCases.SET_SEARCH,
      search: false,
    });
    dispatch({
      type: reducerCases.SET_START_DATE,
      searchStartDate: null,
    });
    dispatch({
      type: reducerCases.SET_END_DATE,
      searchEndDate: null,
    });
  };
  const handleInputChange = (event) => {
    const inputValue = event.target.value;
    setInputValue(inputValue);

    dispatch({
      type: reducerCases.SET_SEARCH_VALUE,
      searchValue: inputValue,
    });
  };
  const handleDropdownNameVisibleChange = (visible) => {
    setDropdownNameVisible(visible);
  };
  const handleDropdownDateVisibleChange = (visible) => {
    setDropdownDateVisible(visible);
  };
  const handleStartDateChange = (date) => {
    setStartDate(date);
  };

  const handleEndDateChange = (date) => {
    setEndDate(date);
  };

  const handleSearchMessages = () => {
    if (!startDate && !endDate) {
      dispatch({
        type: reducerCases.SET_START_DATE,
        searchStartDate: null, // Xóa ngày bắt đầu khỏi Redux state khi ngày bị xóa
      });
      dispatch({
        type: reducerCases.SET_END_DATE,
        searchEndDate: null, // Xóa ngày kết thúc khỏi Redux state khi ngày bị xóa
      });
      return; // Ngừng xử lý nếu ngày bị xóa
    }
    const startTimestamp = startDate.valueOf();
    const endTimestamp = endDate.valueOf();
    dispatch({
      type: reducerCases.SET_START_DATE,
      searchStartDate: startTimestamp,
    });
    dispatch({
      type: reducerCases.SET_END_DATE,
      searchEndDate: endTimestamp,
    });
  };
  const handleChangeTimeOption = (value) => {
    // Nếu giá trị là 'timehint', cho phép chọn mốc thời gian trong DatePicker
    if (value === "timehint") {
      setDatePickerDisabled(false);
    } else {
      // Nếu giá trị khác 'timehint', vô hiệu hóa chọn mốc thời gian trong DatePicker
      setDatePickerDisabled(true);
    }

    // Thực hiện cập nhật giá trị state tương ứng với giá trị mới
    const currentTimestamp = Date.now();
    let newStartDate = null;
    let newEndDate = null;

    switch (value) {
      case "3days":
        newStartDate = moment(currentTimestamp - 3 * 24 * 60 * 60 * 1000);
        newEndDate = moment(currentTimestamp);
        break;
      case "7days":
        newStartDate = moment(currentTimestamp - 7 * 24 * 60 * 60 * 1000);
        newEndDate = moment(currentTimestamp);
        break;
      case "30days":
        newStartDate = moment(currentTimestamp - 30 * 24 * 60 * 60 * 1000);
        newEndDate = moment(currentTimestamp);
        break;
      default:
        break;
    }

    // Cập nhật giá trị state startDate và endDate
    setStartDate(newStartDate);
    setEndDate(newEndDate);
  };

  const menuDate = (
    <div className="tw-bg-white ">
      <Menu className="tw-block">
        <label className="tw-text-[13px] tw-mx-4">Choose time hint: </label>
        <Menu.Item key="0">
          <Select
            defaultValue="timehint"
            style={{ width: 220 }}
            onChange={handleChangeTimeOption}
          >
            <Option value="timehint">Time hint</Option>
            <Option value="3days">3 days ago</Option>
            <Option value="7days">7 days ago</Option>
            <Option value="30days">30 days ago</Option>
          </Select>
        </Menu.Item>
        <label className="tw-text-[13px] tw-mx-4">Choose date: </label>
        <div className="tw-flex">
          <Menu.Item key="1">
            <DatePicker
              value={startDate}
              onChange={handleStartDateChange}
              placeholder="Start Date"
              style={{ flex: 1 }}
              onClick={(e) => e.stopPropagation()}
              disabled={datePickerDisabled}
            />
          </Menu.Item>
          <Menu.Item key="2">
            <DatePicker
              value={endDate}
              onChange={handleEndDateChange}
              placeholder="End Date"
              style={{ flex: 1 }}
              onClick={(e) => e.stopPropagation()}
              disabled={datePickerDisabled}
            />
          </Menu.Item>
        </div>
        <Button
          className="d-flex tw-justify-center tw-mx-auto tw-my-2 tw-w-36 "
          onClick={handleSearchMessages}
          type="primary"
        >
          Search
        </Button>
      </Menu>
    </div>
  );
  const handleSearchByName = (event) => {
    setSearchByName(event.target.value.toLowerCase()); // Lưu trữ nội dung nhập vào input (chuyển về chữ thường để so sánh không phân biệt hoa thường)
  };

  useEffect(() => {
    const fetchAllUsers = async () => {
      try {
        const response = await axios.get(GET_ALL_USER);
        setAllUsers(response.data.data); // Lưu tất cả người dùng vào state allUsers
        console.log(response.data.data);
      } catch (error) {
        console.error("Error fetching all users:", error);
      }
    };

    fetchAllUsers();
  }, []);

  useEffect(() => {
    // Kiểm tra nếu đã có dữ liệu của cả hai
    if (allUsers.length > 0 && currentChat.participants.length > 0) {
      // Lọc ra danh sách người dùng trong cuộc trò chuyện hiện tại
      const participants = allUsers.filter((user) =>
        currentChat.participants.includes(user.id)
      );
      setChatParticipants(participants);
    }
  }, [allUsers, currentChat.participants]);

  const handleFilterByName = (chatParticipants) => {
    dispatch({
      type: reducerCases.SET_FILTER_NAME,
      filterName: chatParticipants,
    });
  };
  const menuName = (
    <div className="tw-bg-white ">
      <Menu className="tw-block">
        <div className="tw-w-full tw-flex">
          <input
            type="text"
            placeholder="Search name"
            className="tw-text-sm tw-pl-2 tw-rounded-full tw-text-gray-500 tw-max-h-7 tw-min-h-7 tw-my-2"
            style={{ backgroundColor: "#eaedf0" }}
            onChange={handleSearchByName}
          ></input>
        </div>
        <List
          size="small"
          bordered
          dataSource={chatParticipants}
          renderItem={(chatparticipants, index) => (
            <List.Item
              className="tw-cursor-pointer"
              key={index}
              onClick={() => handleFilterByName(chatparticipants)}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = "#e5efff";
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = "#ffffff";
              }}
            >
              <div className="tw-flex ">
                <img
                  className="tw-mr-2 tw-rounded-full"
                  src={chatparticipants.profilePicture}
                  width={18}
                  height={18}
                />
                {chatparticipants.display_name}{" "}
                {/* Hiển thị tên của người dùng */}
              </div>
            </List.Item>
          )}
        />
      </Menu>
    </div>
  );

  return (
    <Stack className={`chat-box border-1 ${showInfo ? "w-full" : ""} `}>
      <div className="chat-header justify-content-between align-items-center ">
        <div className="d-flex">
          <img
            src={convertPicture()}
            className="me-2 tw-w-12 tw-h-12 tw-rounded-full"
          />
          <div className="tw-flex tw-justify-center tw-items-center">
            {chat.type === "private" ? (
              <div>
                <strong style={{ fontSize: "20px" }}>{convertName()}</strong>
                {onlineUsers.includes(
                  chat.participants.filter((p) => p !== userInfo?.id)[0]
                ) ? (
                  <p className="chat-header-condition">online</p>
                ) : (
                  <p className="chat-header-condition">offline</p>
                )}
              </div>
            ) : (
              <strong style={{ fontSize: "20px", alignItems: "center" }}>
                {convertName()}
              </strong>
            )}
          </div>
        </div>
        <div className="d-flex">
          {currentChat.type == "public" && (
            <div>
              <BsPersonAdd
                className="chat-header-icon px-2 bg-white"
                title="Search"
                onClick={handleCloseModalAddMember}
              />
              <ModalAddMember
                showModalAddMember={showModalAddMember}
                handleCloseModalAddMember={handleCloseModalAddMember}
              />
            </div>
          )}
          <IoMdSearch
            className="chat-header-icon px-2 bg-white"
            title="Search"
            onClick={() => handleSearch()}
          />
          <IoIosCall
            className="chat-header-icon px-2 bg-white"
            color="black"
            title="Call"
            onClick={() => handleClickOpenTab()}
            // onClick={() =>
            //   sendVoiceCallRequest(
            //     chat.type == "private"
            //       ? chat.participants[0] == userInfo?.id
            //         ? chat.participants[1]
            //         : chat.participants[0]
            //       : chat.chatId,
            //     userInfo?.id
            //   )
            // }
          />
          {/* <IoIosCall className="chat-header-icon px-2 bg-white" color="black" title="Call" onClick={handleVoiceCall} /> */}
          {/* <IoIosVideocam className="chat-header-icon px-2 bg-white" color="black" title="Video Call" onClick={handleVideoCall} /> */}
          {showInfo ? (
            <VscLayoutSidebarRightOff
              className="chat-header-icon px-2 bg-white"
              color="blue"
              onClick={toggleConversationInfo}
            />
          ) : (
            <VscLayoutSidebarRightOff
              className="chat-header-icon px-2 bg-white"
              color="black"
              onClick={toggleConversationInfo}
            />
          )}
        </div>
      </div>
      {search && (
        <div>
          <div className="tw-w-full tw-px-3 tw-bg-white tw-min-h-12 tw-shadow-2xl tw-max-h-12 tw-flex tw-justify-center tw-items-center">
            <IoMdSearch className="tw-bg-[#eaedf0] tw-p-1 tw-text-3xl tw-w-[40px] tw-rounded-l-2xl tw-max-h-7 tw-min-h-7" />
            <input
              type="text"
              placeholder="Search"
              className="tw-text-sm tw-w-10/12 tw-rounded-r-2xl tw-text-gray-500 tw-max-h-7 tw-min-h-7"
              style={{ backgroundColor: "#eaedf0" }}
              onChange={handleInputChange}
            />
            <button
              className="tw-font-bold  tw-rounded tw-w-1/12 tw-text-black hover:tw-text-black tw-max-h-7 tw-min-h-7"
              onClick={() => handleCloseSearch()}
            >
              Close
            </button>
          </div>
          <div className="tw-w-full tw-px-2 tw-bg-white tw-h-12 tw-shadow-2xl tw-flex tw-items-center">
            <label className="tw-font-bold tw-text-[13px] tw-mx-2">
              Filter:
            </label>
            <Dropdown
              className="tw-rounded-full tw-bg-gray-300 tw-mx-2"
              overlay={<div>{menuName}</div>}
              trigger={["click"]}
              visible={dropdownNameVisible}
              onVisibleChange={handleDropdownNameVisibleChange}
            >
              <Button className="tw-flex tw-items-center">
                Filter by Name
                <DownOutlined />
              </Button>
            </Dropdown>
            <Dropdown
              className="tw-rounded-full tw-bg-gray-300 tw-mx-2"
              overlay={<div>{menuDate}</div>}
              trigger={["click"]}
              visible={dropdownDateVisible}
              onVisibleChange={handleDropdownDateVisibleChange}
            >
              <Button className="tw-flex tw-items-center">
                Filter by Dates
                <DownOutlined />
              </Button>
            </Dropdown>
          </div>
        </div>
      )}

      {messages && (
        <Stack
          gap={2}
          className="messages tw-max-h-60 tw-cursor-pointer items-end tw-overflow-y-auto custom-scrollbar"
        >
          {messages.map((message, index) => (
            <div>
              {message.type.includes("notification") ? (
                <div className="tw-flex tw-justify-center tw-items-center tw-w-ful tw-mt-5">
                  <div className="tw-w-3/12 tw-px-1 tw-text-center tw-bg-gray-200 tw-text-[13px] tw-items-center tw-flex tw-justify-center tw-py-0.5 tw-text-slate-500 tw-rounded-lg tw-shadow-2xl">
                    <span>{message.content}</span>
                  </div>
                </div>
              ) : (
                <div>
                  {message.type.includes("init group") ? (
                    <div className="tw-flex tw-justify-center tw-items-center tw-w-ful tw-mt-5">
                      <div className="tw-w-5/12 tw-bg-slate-50 tw-items-center tw-flex tw-justify-center tw-py-1 tw-text-slate-700 tw-rounded-lg tw-shadow-2xl">
                        <img
                          src={currentChat.picture}
                          width={30}
                          height={30}
                          alt=""
                          className="tw-rounded-full tw-mr-6"
                        />
                        <span>{message.content}</span>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div key={index}>
                        {message.type.includes("init friend") ? (
                          <div className="tw-flex tw-justify-center tw-items-center tw-w-ful tw-mt-5">
                            <div className="tw-w-5/12 tw-bg-slate-50 tw-items-center tw-min-h-60 tw-max-h-64 tw-rounded-lg tw-shadow-2xl">
                              <img
                                src="https://res-zalo.zadn.vn/upload/media/2019/10/11/artboard_5_4_x_2x_1570759790847_74009.png"
                                alt=""
                                className="tw-z-10"
                              />
                              <div className="tw-flex tw-w-full tw-items-center tw-justify-center">
                                <img
                                  src={userInfo?.avatar}
                                  width={70}
                                  height={70}
                                  alt=""
                                  className="-tw-mt-8 tw-rounded-full tw-p-1 tw-z-20 -tw-mr-3 tw-border-white"
                                />
                                <img
                                  src={convertPicture()}
                                  width={70}
                                  height={70}
                                  alt=""
                                  className="-tw-mt-8 tw-rounded-full tw-p-1 tw-z-30 tw-border-white "
                                />
                              </div>
                              <div className="tw-items-center tw-text-center tw-mt-2 tw-font-bold">
                                You and {convertName()} are now friends
                              </div>

                              <div className="tw-items-center tw-text-center tw-mt-2 tw-text-slate-500 tw-w-full tw-z-20">
                                <span>Let's send any message your friend</span>
                              </div>
                              <img
                                src="https://res-zalo.zadn.vn/upload/media/2019/10/11/artboard_5_4_x_2x_1570759790847_74009.png"
                                alt=""
                                className="tw-z-10 -tw-mt-2"
                              />
                            </div>
                          </div>
                        ) : (
                          <div>
                            {
                              <div className="tw-w-full tw-h-full tw-flex tw-justify-center tw-items-center">
                                <div
                                  key={index}
                                  className={`tw-w-full tw-min-h-11 ${
                                    message.senderId == userInfo?.id
                                      ? "  tw-justify-end tw-order-2"
                                      : "  tw-justify-start tw-order-1"
                                  } tw-flex tw-items-end tw-py-2 tw-break-words`}
                                  onMouseEnter={() => handleMouseEnter(index)}
                                  onMouseLeave={handleMouseLeave}
                                  ref={(element) =>
                                    updateMessageRefs(element, index)
                                  }
                                  onClick={() => scrollToMessage(index)}
                                >
                                  {message.status == "removed" &&
                                  message.senderId == userInfo?.id ? (
                                    <div
                                      className={`tw-rounded-lg tw-italic  tw-p-3 ${
                                        message.senderId == userInfo?.id
                                          ? "tw-bg-[#e5efff] align-self-end"
                                          : "tw-bg-black tw-text-white align-self-start tw-text-"
                                      }`}
                                    >
                                      <span className=" tw-text-sm ">
                                        message has been recovered
                                      </span>
                                      <div>
                                        <span
                                          span
                                          className="tw-text-bubble-meta tw-text-[10px] tw-pt-1 tw-min-w-fit"
                                        >
                                          {calculateTime(message.timestamp)}
                                        </span>
                                      </div>
                                    </div>
                                  ) : (
                                    <div className="tw-flex tw-justify-center tw-items-center ">
                                      <div
                                        className={`tw-flex ${
                                          message.senderId == userInfo?.id
                                            ? " tw-justify-end tw-bg-blue-100 tw-order-2"
                                            : "tw-justify-start tw-bg-black tw-text-white tw-order-1"
                                        } flex-grow-0 tw-break-words tw-max-w-[50vh] tw-px-3 tw-rounded-lg`}
                                      >
                                        <div className="tw-break-words tw-max-w-[40vh]">
                                          <div
                                            className="tw-right-1 tw-text-start tw-italic"
                                            style={{ fontSize: "13px" }}
                                          >
                                            {message.type.includes("share") ? (
                                              <div>
                                                <div
                                                  className={`tw-flex tw-justify-items-center tw-items-center`}
                                                >
                                                  <IoIosRedo className="tw-mr-2" />
                                                  <span>
                                                    {message.senderId ==
                                                    userInfo?.id
                                                      ? "You've"
                                                      : "Your friend"}{" "}
                                                    forwarded a message
                                                  </span>
                                                </div>
                                                <div></div>
                                              </div>
                                            ) : (
                                              message.senderName
                                            )}
                                          </div>

                                          {message.type.includes("text") ? (
                                            <span className="tw-text-[16px]">
                                              {message.content}
                                            </span>
                                          ) : message.type.includes("files") ? (
                                            <div>
                                              {message.content &&
                                                message.content
                                                  .split("|")
                                                  .map((content, index) => {
                                                    const lastSlashIndex =
                                                      content.split("?");
                                                    const filenameWithExtension =
                                                      lastSlashIndex[0];

                                                    const lastSlashIndex1 =
                                                      filenameWithExtension.split(
                                                        "/"
                                                      );
                                                    const filenameWithExtension1 =
                                                      lastSlashIndex1[
                                                        lastSlashIndex1.length -
                                                          1
                                                      ];

                                                    const lastDotIndex =
                                                      filenameWithExtension1.lastIndexOf(
                                                        "."
                                                      );
                                                    const filename =
                                                      filenameWithExtension1.substring(
                                                        0,
                                                        lastDotIndex
                                                      );
                                                    const extension =
                                                      filenameWithExtension1.substring(
                                                        lastDotIndex
                                                      );
                                                    return (
                                                      <div
                                                        className="tw-flex"
                                                        key={index}
                                                      >
                                                        {content.startsWith(
                                                          "https://"
                                                        ) ? (
                                                          <div className="tw-flex tw-justify-start tw-mb-3 tw-bg-blue-100 tw-w-full tw-p-3 tw-rounded-lg">
                                                            <div className="tw-mr-3 ">
                                                              {extension ===
                                                                ".doc" && (
                                                                <img
                                                                  src={doc}
                                                                  alt={`Document ${
                                                                    index + 1
                                                                  }`}
                                                                  style={{
                                                                    width:
                                                                      "32px",
                                                                    height:
                                                                      "32px",
                                                                  }}
                                                                />
                                                              )}
                                                              {extension ===
                                                                ".xls" && (
                                                                <img
                                                                  src={xls}
                                                                  alt={`Document ${
                                                                    index + 1
                                                                  }`}
                                                                  style={{
                                                                    width:
                                                                      "32px",
                                                                    height:
                                                                      "32px",
                                                                  }}
                                                                />
                                                              )}
                                                              {extension ===
                                                                ".xlsx" && (
                                                                <img
                                                                  src={xlsx}
                                                                  alt={`Document ${
                                                                    index + 1
                                                                  }`}
                                                                  style={{
                                                                    width:
                                                                      "32px",
                                                                    height:
                                                                      "32px",
                                                                  }}
                                                                />
                                                              )}
                                                              {extension ===
                                                                ".pdf" && (
                                                                <img
                                                                  src={pdf}
                                                                  alt={`Document ${
                                                                    index + 1
                                                                  }`}
                                                                  style={{
                                                                    width:
                                                                      "32px",
                                                                    height:
                                                                      "32px",
                                                                  }}
                                                                />
                                                              )}
                                                              {extension ===
                                                                ".txt" && (
                                                                <img
                                                                  src={txt}
                                                                  alt={`Document ${
                                                                    index + 1
                                                                  }`}
                                                                  style={{
                                                                    width:
                                                                      "32px",
                                                                    height:
                                                                      "32px",
                                                                  }}
                                                                />
                                                              )}
                                                              {extension ===
                                                                ".docx" && (
                                                                <img
                                                                  src={docx}
                                                                  alt={`Document ${
                                                                    index + 1
                                                                  }`}
                                                                  style={{
                                                                    width:
                                                                      "32px",
                                                                    height:
                                                                      "32px",
                                                                  }}
                                                                />
                                                              )}
                                                              {extension ===
                                                                ".pptx" && (
                                                                <img
                                                                  src={ppt}
                                                                  alt={`Document ${
                                                                    index + 1
                                                                  }`}
                                                                  style={{
                                                                    width:
                                                                      "32px",
                                                                    height:
                                                                      "32px",
                                                                  }}
                                                                />
                                                              )}
                                                            </div>
                                                            <span>
                                                              <a
                                                                href={content}
                                                                download={
                                                                  filename +
                                                                  extension
                                                                }
                                                                style={{
                                                                  textDecoration:
                                                                    "none",
                                                                  color:
                                                                    "black",
                                                                }}
                                                              >
                                                                {decodeURIComponent(
                                                                  decodeURI(
                                                                    filename
                                                                  )
                                                                )}
                                                              </a>
                                                            </span>
                                                          </div>
                                                        ) : (
                                                          <span>{content}</span>
                                                        )}
                                                      </div>
                                                    );
                                                  })}
                                            </div>
                                          ) : message.type.includes("image") ? (
                                            message.content &&
                                            message.content
                                              .split("|")
                                              .map((content, index) => (
                                                <div
                                                  className="tw-flex"
                                                  key={index}
                                                >
                                                  {content.startsWith(
                                                    "https://"
                                                  ) ? (
                                                    <ChatImage
                                                      imageUrl={content}
                                                      alt="Image"
                                                      className="tw-mb-1 tw-mr-1"
                                                    />
                                                  ) : (
                                                    <span>{content}</span>
                                                  )}
                                                </div>
                                              ))
                                          ) : message.type === "reply" ? (
                                            <div>
                                              <div
                                                className="tw-border-l-4 tw-border-blue-500 tw-pl-3 tw-mb-2"
                                                onClick={() =>
                                                  handleClickReply(
                                                    message.messageId
                                                  )
                                                }
                                              >
                                                <span
                                                  className={`${
                                                    message.senderId ==
                                                    userInfo?.id
                                                      ? "tw-text-black"
                                                      : "tw-text-white"
                                                  }  tw-text-sm`}
                                                >
                                                  {findMessageById(
                                                    message.messageId
                                                  )?.content &&
                                                    findMessageById(
                                                      message.messageId
                                                    )
                                                      ?.content.split("|")
                                                      .map((content, index) => {
                                                        const lastSlashIndex =
                                                          content.lastIndexOf(
                                                            "?"
                                                          );
                                                        const filenameWithExtension =
                                                          content.substring(
                                                            0,
                                                            lastSlashIndex
                                                          );

                                                        const lastSlashIndex1 =
                                                          filenameWithExtension.lastIndexOf(
                                                            "/"
                                                          );
                                                        const filenameWithExtension1 =
                                                          filenameWithExtension.substring(
                                                            lastSlashIndex1 + 1
                                                          );

                                                        const lastDotIndex =
                                                          filenameWithExtension1.lastIndexOf(
                                                            "."
                                                          );
                                                        const filename =
                                                          filenameWithExtension1.substring(
                                                            0,
                                                            lastDotIndex
                                                          );
                                                        const extension =
                                                          filenameWithExtension1.substring(
                                                            lastDotIndex
                                                          );

                                                        return (
                                                          <div
                                                            className="tw-flex"
                                                            key={index}
                                                          >
                                                            {content.startsWith(
                                                              "https://"
                                                            ) ? (
                                                              <div className="tw-flex tw-justify-start tw-mb-3 tw-bg-blue-100 tw-w-full tw-p-3 tw-rounded-lg">
                                                                <div className="tw-mr-3">
                                                                  {extension ===
                                                                    ".doc" && (
                                                                    <img
                                                                      src={doc}
                                                                      alt={`Document ${
                                                                        index +
                                                                        1
                                                                      }`}
                                                                      style={{
                                                                        width:
                                                                          "32px",
                                                                        height:
                                                                          "32px",
                                                                      }}
                                                                    />
                                                                  )}
                                                                  {extension ===
                                                                    ".xls" && (
                                                                    <img
                                                                      src={xls}
                                                                      alt={`Document ${
                                                                        index +
                                                                        1
                                                                      }`}
                                                                      style={{
                                                                        width:
                                                                          "32px",
                                                                        height:
                                                                          "32px",
                                                                      }}
                                                                    />
                                                                  )}
                                                                  {extension ===
                                                                    ".xlsx" && (
                                                                    <img
                                                                      src={xlsx}
                                                                      alt={`Document ${
                                                                        index +
                                                                        1
                                                                      }`}
                                                                      style={{
                                                                        width:
                                                                          "32px",
                                                                        height:
                                                                          "32px",
                                                                      }}
                                                                    />
                                                                  )}
                                                                  {extension ===
                                                                    ".pdf" && (
                                                                    <img
                                                                      src={pdf}
                                                                      alt={`Document ${
                                                                        index +
                                                                        1
                                                                      }`}
                                                                      style={{
                                                                        width:
                                                                          "32px",
                                                                        height:
                                                                          "32px",
                                                                      }}
                                                                    />
                                                                  )}
                                                                  {extension ===
                                                                    ".txt" && (
                                                                    <img
                                                                      src={txt}
                                                                      alt={`Document ${
                                                                        index +
                                                                        1
                                                                      }`}
                                                                      style={{
                                                                        width:
                                                                          "32px",
                                                                        height:
                                                                          "32px",
                                                                      }}
                                                                    />
                                                                  )}
                                                                  {extension ===
                                                                    ".docx" && (
                                                                    <img
                                                                      src={docx}
                                                                      alt={`Document ${
                                                                        index +
                                                                        1
                                                                      }`}
                                                                      style={{
                                                                        width:
                                                                          "32px",
                                                                        height:
                                                                          "32px",
                                                                      }}
                                                                    />
                                                                  )}
                                                                  {extension ===
                                                                    ".pptx" && (
                                                                    <img
                                                                      src={ppt}
                                                                      alt={`Document ${
                                                                        index +
                                                                        1
                                                                      }`}
                                                                      style={{
                                                                        width:
                                                                          "32px",
                                                                        height:
                                                                          "32px",
                                                                      }}
                                                                    />
                                                                  )}
                                                                </div>
                                                                <span>
                                                                  <a
                                                                    href={
                                                                      content
                                                                    }
                                                                    download={`${decodeURIComponent(
                                                                      decodeURI(
                                                                        filename
                                                                      )
                                                                    )}${extension}`}
                                                                    style={{
                                                                      textDecoration:
                                                                        "none",
                                                                      color:
                                                                        "black",
                                                                    }}
                                                                  >
                                                                    {decodeURIComponent(
                                                                      decodeURI(
                                                                        filename
                                                                      )
                                                                    )}
                                                                  </a>
                                                                </span>
                                                              </div>
                                                            ) : (
                                                              <span>
                                                                {content}
                                                              </span>
                                                            )}
                                                          </div>
                                                        );
                                                      })}
                                                </span>
                                              </div>
                                              <span
                                                className={`${
                                                  message.senderId ==
                                                  userInfo?.id
                                                    ? "tw-text-black"
                                                    : "tw-text-white"
                                                }`}
                                              >
                                                {message.content}
                                              </span>
                                            </div>
                                          ) : (
                                            <div>
                                              {message.type.includes(
                                                "missing call"
                                              ) ? (
                                                <div className="tw-flex tw-justify-center tw-items-center tw-break-words">
                                                  <div className="tw-mt-3 tw-mr-3 tw-w-10 tw-h-10 tw-bg-red-500 tw-p-2 tw-flex tw-justify-center tw-items-center tw-rounded-full">
                                                    <IoIosCall className="tw-text-white tw-text-3xl" />
                                                  </div>
                                                  <div className="tw-flex tw-justify-center tw-items-center tw-flex-wrap tw-break-words">
                                                    <span className="tw-break-words">
                                                      {message.senderId !=
                                                      userInfo?.id
                                                        ? "You"
                                                        : convertName()}{" "}
                                                      {message.content}{" "}
                                                      {message.senderId ==
                                                      userInfo?.id
                                                        ? "You"
                                                        : convertName()}
                                                    </span>
                                                  </div>
                                                </div>
                                              ) : (
                                                message.type === "record" && (
                                                  <RecordCard
                                                    message={message}
                                                  />
                                                )
                                              )}
                                            </div>
                                          )}
                                          <br />
                                          <span className="tw-text-bubble-meta tw-text-[10px] tw-pt-1 tw-min-w-fit">
                                            {calculateTime(message.timestamp)}
                                          </span>
                                        </div>
                                      </div>
                                      {hoveredIndex === index &&
                                        message.status != "removed" &&
                                        userInfo?.id === message.senderId && (
                                          <div
                                            className={`tw-mt-2 tw-flex ${
                                              message.senderId == userInfo?.id
                                                ? "tw-order-1"
                                                : " tw-order-2"
                                            } tw-items-center tw-justify-center`}
                                          >
                                            <BiSolidQuoteRight
                                              className="tw-mx-1 hover:tw-text-blue-700"
                                              title="Reply"
                                              onClick={() =>
                                                handleReply(message)
                                              }
                                              size={18}
                                            />
                                            <ForwardModal
                                              showModal={showFormShareMessage}
                                              handleCloseModal={
                                                handleCloseModal
                                              }
                                              shareMessage={shareMessage}
                                            />
                                            <IoIosRedo
                                              className="tw-mx-1 hover:tw-text-blue-700"
                                              title="Forward"
                                              onClick={() =>
                                                handleForward(message)
                                              }
                                              size={18}
                                            />
                                            <RemoveMessageModal
                                              showModal={showFormRemoveMessage}
                                              handleCloseModal={
                                                handleCloseRemoveMessageModal
                                              }
                                              removeMessage={message}
                                              backdrop="static"
                                            />
                                            <SlReload
                                              className="tw-mx-1 hover:tw-text-blue-700"
                                              title="Remove"
                                              onClick={() =>
                                                handleRemove(message.messageId)
                                              }
                                              size={18}
                                            />
                                          </div>
                                        )}
                                      {hoveredIndex === index &&
                                        userInfo?.id !== message.senderId && (
                                          <div
                                            className={`tw-mt-2 tw-h-full  tw-flex ${
                                              message.senderId == userInfo?.id
                                                ? " tw-order-1"
                                                : "tw-order-2"
                                            } tw-items-center tw-justify-center`}
                                          >
                                            <BiSolidQuoteRight
                                              className="tw-mx-1 hover:tw-text-blue-700"
                                              title="Reply"
                                              onClick={() =>
                                                handleReply(message)
                                              }
                                              size={18}
                                            />
                                            <ForwardModal
                                              showModal={showFormShareMessage}
                                              handleCloseModal={
                                                handleCloseModal
                                              }
                                              shareMessage={shareMessage}
                                            />
                                            <IoIosRedo
                                              className="tw-mx-1 hover:tw-text-blue-700"
                                              title="Forward"
                                              onClick={() =>
                                                handleForward(message)
                                              }
                                              size={18}
                                            />
                                            <RemoveMessageModal
                                              showModal={showFormRemoveMessage}
                                              handleCloseModal={
                                                handleCloseRemoveMessageModal
                                              }
                                              removeMessage={message}
                                              backdrop="static"
                                            />
                                          </div>
                                        )}
                                    </div>
                                  )}
                                </div>
                              </div>
                            }
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </Stack>
      )}

      <div className="chat-input">
        <div className="w-100 items-center">
          <SmileOutlined
            className="chat-input-icon px-2 tw-text-2xl"
            title="Send Emoji"
            size="2em"
            id="emoji-open"
            onClick={handleEmojiModal}
          />
          {showEmojiPicker && (
            <div
              className="tw-absolute tw-bottom-28 tw-left-12 tw-z-40"
              ref={emojiPickerRef}
            >
              <EmojiPicker onEmojiClick={handleEmojiClick} />
            </div>
          )}

          <input
            type="file"
            accept="image/*"
            className="d-none"
            onChange={handleImageInputChange}
            multiple
            id="image-input"
          />
          <label htmlFor="image-input">
            <FileImageOutlined
              className="chat-input-icon px-2 tw-text-2xl"
              title="Send Image"
            />
          </label>
          <input
            type="file"
            accept=".doc, .docx, .xls, .xlsx, .pdf, .txt, .pptx"
            className="d-none"
            onChange={handleFileInputChange}
            multiple
            id="file-input"
          />
          <label htmlFor="file-input">
            <LinkOutlined
              className="chat-input-icon px-2 tw-text-2xl"
              title="Attach File"
            />
          </label>
          <label>
            <AudioOutlined
              className="chat-input-icon px-2 tw-text-2xl"
              title="Attach File"
              onClick={() => setShowAudioRecorder(true)}
            />
          </label>
        </div>

        <div className="selected-images">
          {selectedImages.map((image, index) => (
            <div key={index} className="image-wrapper  tw-p-3 tw-mr-2">
              <img
                src={URL.createObjectURL(image)}
                alt={`Image ${index + 1}`}
                className="tw-w-12 tw-h-12"
              />
              <button
                className="delete-btn "
                onClick={() => handleRemoveImage(index)}
              >
                <MdDeleteForever className="" />
              </button>
            </div>
          ))}
        </div>
        <div className=" tw-flex tw-flex-wrap">
          {selectedFiles.map((file, index) => (
            <div key={index} className="file-wrapper tw-p-3 tw-mr-2">
              <button
                onClick={() => handleRemoveFile(index)}
                className="tw-absolute -tw-right-2 -tw-top-4 tw-p-2"
              >
                <MdDeleteForever className="tw-bg-white tw-rounded-full tw-p-1 tw-text-3xl" />
              </button>
              <div className="tw-bg-slate-500 tw-p-2 tw-rounded-full">
                <div className="tw-text-white tw-text-sm ">{file.name}</div>
              </div>
            </div>
          ))}
        </div>
        <div>
          {/* Hiển thị tooltip */}
          {showReplyTooltip && (
            <div className="tw-w-full tw-p-1">
              <div className="reply-wrapper tw-w-11/12 tw-p-3 tw-mr-2">
                <button
                  onClick={handleCloseReply}
                  className="tw-absolute -tw-right-2 -tw-top-4 tw-p-2"
                >
                  <MdDeleteForever className="tw-bg-white tw-rounded-full tw-p-1 tw-text-3xl" />
                </button>
                <div className="tw-bg-slate-200 tw-py-2 tw-px-5 tw-rounded-lg ">
                  {replyMessage.type == "text" ? (
                    <div className="tw-border-l-4 tw-border-blue-500 tw-pl-3">
                      <div className="tw-flex ">
                        <span>
                          <BiSolidQuoteAltRight className="tw-text-slate-400 tw-text-sm tw-mr-1" />
                        </span>
                        <span className="tw-text-slate-400 tw-text-sm tw-mr-1">
                          Reply
                        </span>
                        <span className="tw-text-sm tw-font-bold">
                          {replyMessage.senderName}
                        </span>
                      </div>
                      <span className="tw-text-black tw-text-sm">
                        {replyMessage.content}
                      </span>
                    </div>
                  ) : (
                    <div className="tw-border-l-4 tw-border-blue-500 tw-pl-3">
                      <div className="tw-flex tw-items-center">
                        <span>
                          <BiSolidQuoteAltRight className="tw-text-slate-400 tw-text-sm tw-mr-1" />
                        </span>
                        <span className="tw-text-slate-400 tw-text-sm tw-mr-1">
                          Reply
                        </span>
                        <span className="tw-text-sm tw-font-bold">
                          {convertName()}
                        </span>
                      </div>
                      <span className="tw-text-black tw-text-sm">
                        [ {replyMessage.type} ]
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
        {!showAudioRecorder && (
          <div className="d-flex w-100 tw-justify-center tw-items-center ">
            <TextArea
              type="text"
              placeholder="Type your message here..."
              className="custom-scrollbar tw-overflow-auto tw-text-sm  focus:outline-none tw-text-black pt-3 tw-rounded-lg tw-w-full tw-max-h-14 tw-min-h-11"
              onChange={(e) => setSendMessages(e.target.value)}
              onKeyPress={handleKeyPress}
              value={sendMessages}
            />
            <IoIosSend
              className="send-btn tw-cursor-pointer tw-text-white ms-2"
              onClick={handleSendMessage}
              style={{ backgroundColor: "white", color: "#fffffff" }}
            />
          </div>
        )}
        {showAudioRecorder && <CaptureAudio hide={setShowAudioRecorder} />}
      </div>
    </Stack>
  );
};
export default ChatBox;
