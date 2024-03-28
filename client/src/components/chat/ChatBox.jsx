import { Stack } from "react-bootstrap";
// import InputEmoji from "react-input-emoji";
import { Input } from 'antd';
import { FileImageOutlined, SmileOutlined, LinkOutlined, SendOutlined } from '@ant-design/icons'
import { PiPaperPlaneRightFill } from "react-icons/pi";
import { IoMdSearch, IoIosCall, IoIosVideocam } from "react-icons/io";
import { VscLayoutSidebarRightOff } from "react-icons/vsc";
import avatar from "../../assets/2Q.png"
import { useEffect, useRef, useState } from "react";
import { useStateProvider } from "../../context/StateContext";
import TextArea from "antd/es/input/TextArea";
import { CHAT_API } from "../../router/ApiRoutes";
import { reducerCases } from "../../context/constants";
import axios from "axios";
import { calculateTime } from './../../utils/CalculateTime';
import { MdDeleteForever } from "react-icons/md";
const ChatBox = ({ chat, toggleConversationInfo, showInfo }) => {
  const [sendMessages, setSendMessages] = useState([]);
  const [{ messages, userInfo, currentChat, socket }, dispatch] = useStateProvider()
  const [selectedImages, setSelectedImages] = useState([]);

  const handleImageInputChange = (e) => {
    const files = Array.from(e.target.files);
    setSelectedImages((prevImages) => [...prevImages, ...files]);
  };
  const handleRemoveImage = (index) => {
    setSelectedImages((prevImages) => prevImages.filter((_, i) => i !== index));
  };
  const handleSendMessage = async () => {
    if (sendMessages.trim().length > 0) {
      try {
        const { data } = await axios.put(CHAT_API + currentChat?.chatId + "/messages", {
          newMessage: {
            senderId: userInfo?.id,
            type: "text",
            content: sendMessages,
            timestamp: Date.now()
          }
        })
        const receiveId = currentChat?.participants.length == 2 ? currentChat?.participants.reduce((acc, participantId) => {
          if (participantId !== userInfo?.id) {
            acc = participantId;
          }
          return acc;
        }, null) : "";
        console.log(receiveId)
        socket.current.emit("send-msg", {
          receiveId: receiveId,
          newMessage: {
            senderId: userInfo?.id,
            type: "text",
            content: data.data.newMessage.content,
            timestamp: Date.now()
          }
        })
        console.log(data.data)
        dispatch({
          type: reducerCases.ADD_MESSAGES,
          newMessage: {
            ...data.data.newMessage,
          },
          fromSelf: true
        })
        console.log(sendMessages)
        console.log(
          {
            senderId: userInfo?.id,
            type: "text",
            content: sendMessages,
            timestamp: Date.now()
          })
        setSendMessages("")
      } catch (error) {
        console.log(error)
      }
    }
  }

  return (
    <Stack className={`chat-box border-1 ${showInfo ? 'w-full' : ''}`}>
      <div className="chat-header justify-content-between align-items-center">
        <div className="d-flex">
          <img src={avatar} className="me-2 tw-w-12 tw-h-12 tw-rounded-full" />
          <div>
            <strong style={{ fontSize: '20px' }}>{chat ? chat.name : 'Default Name'}</strong>
            <p className="chat-header-condition">online</p>
          </div>
        </div>
        <div className="d-flex">
          <IoMdSearch className="chat-header-icon px-2 bg-white" title="Search" />
          <IoIosCall className="chat-header-icon px-2 bg-white" color="black" title="Call" />
          <IoIosVideocam className="chat-header-icon px-2 bg-white" color="black" title="Video Call" />
          {showInfo ? (<VscLayoutSidebarRightOff className="chat-header-icon px-2 bg-white" color="blue" onClick={toggleConversationInfo} />)
            : (<VscLayoutSidebarRightOff className="chat-header-icon px-2 bg-white" color="black" onClick={toggleConversationInfo} />)}
        </div>
      </div>
      <div >

      </div>

      {messages && (
        <Stack gap={3} className="messages tw-max-h-60">
          {messages && messages.map((message, index) => (
            <Stack
              key={index}
              className={`tw-my-1 message align-self-${message.senderId == userInfo?.id ? 'end self' : 'start'} flex-grow-0`}
            >
              <span >{message.content}</span>

              <span className="tw-text-bubble-meta tw-text-[11px] tw-pt-1 tw-min-w-fit ">
                {calculateTime(message.timestamp)}
              </span>
            </Stack>
          ))}
        </Stack>
      )}


      <div className="chat-input">
        <div className="w-100 items-center">
          <SmileOutlined className="chat-input-icon px-2" title="Send Emoji" size="2em" />

          <input
            type="file"
            accept="image/*"
            className="d-none"
            onChange={handleImageInputChange}
            multiple
            id="image-input"
          />
          <label htmlFor="image-input">
            <FileImageOutlined className="chat-input-icon px-2" title="Send Image" />

          </label>
          <LinkOutlined className="chat-input-icon px-2" title="Attach File" />
        </div>

        <div className="selected-images">
          {selectedImages.map((image, index) => (
            <div key={index} className="image-wrapper  tw-p-3 tw-mr-2">
              <img src={URL.createObjectURL(image)} alt={`Image ${index + 1}`} className="tw-w-12 tw-h-12" />
              <button className="delete-btn " onClick={() => handleRemoveImage(index)}><MdDeleteForever className="" /></button>
            </div>
          ))}

        </div>
        <div className="d-flex w-100">
          <TextArea
            type="text"
            placeholder="Type your message here..."
            className=" custom-scrollbar tw-overflow-auto tw-text-sm  focus:outline-none tw-text-black pt-3 tw-rounded-lg tw-w-full tw-max-h-14 tw-min-h-11"
            onChange={(e) => setSendMessages(e.target.value)}
            value={sendMessages}
          />
          <PiPaperPlaneRightFill className="send-btn tw-cursor-pointer" onClick={handleSendMessage} />
        </div>
      </div>
    </Stack>
    // <div>a</div>
  );
};
export default ChatBox;