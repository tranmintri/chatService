import { Stack } from "react-bootstrap";
// import InputEmoji from "react-input-emoji";
import { Input } from 'antd';
import { FileImageOutlined, SmileOutlined, LinkOutlined, SendOutlined } from '@ant-design/icons'
import { IoIosSend } from "react-icons/io";
import { IoMdSearch, IoIosCall, IoIosVideocam } from "react-icons/io";
import { VscLayoutSidebarRightOff } from "react-icons/vsc";
import { useEffect, useRef, useState } from "react";
import { useStateProvider } from "../../context/StateContext";
import TextArea from "antd/es/input/TextArea";
import { CHAT_API, CLIENT_HOST } from "../../router/ApiRoutes";
import { reducerCases } from "../../context/constants";
import axios from "axios";
import { calculateTime } from './../../utils/CalculateTime';
import { MdDeleteForever } from "react-icons/md";
import ChatImage from "../contact/card/ChatImage";
import xls from "../../assets/xls.png";
import xlsx from "../../assets/xlsx.png";
import txt from "../../assets/txt.png";
import pdf from "../../assets/pdf.png";
import doc from "../../assets/doc.png";
import docx from "../../assets/docx.png";
import ppt from "../../assets/ppt.png";
import he from 'he';

const ChatBox = ({ chat, toggleConversationInfo, showInfo }) => {
  const [sendMessages, setSendMessages] = useState([]);
  const [isHovered, setIsHovered] = useState(false);
  const [{ messages, userInfo, currentChat, groups, socket }, dispatch] = useStateProvider()
  const [selectedImages, setSelectedImages] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);


  const handleImageInputChange = (e) => {
    const files = Array.from(e.target.files);
    setSelectedImages((prevImages) => [...prevImages, ...files]);
  };
  const handleRemoveImage = (index) => {
    setSelectedImages((prevImages) => prevImages.filter((_, i) => i !== index));
  };
  const receiveId = currentChat?.participants.length == 2 ? currentChat?.participants.reduce((acc, participantId) => {
    if (participantId !== userInfo?.id) {
      acc = participantId;
    }
    return acc;
  }, null) : "";
  const handleSendMessage = async () => {
    if (sendMessages.length > 0 || selectedImages.length > 0 || selectedFiles.length > 0) {
      let type = "text";
      let content = "";

      if (selectedImages.length > 0 && selectedFiles.length > 0) {
        alert("Can't send photos and files at the same time")
        return
      }
      // Nếu có hình ảnh được chọn, gửi hình ảnh trước
      if (selectedImages.length > 0 && selectedFiles.length == 0) {
        try {
          const formData = new FormData();
          selectedImages.forEach((image, index) => {
            formData.append(`images`, image);
          });

          const { data } = await axios.post(CHAT_API + currentChat?.chatId + "/images", formData);


          content = data.data;
          type = "image";
        } catch (error) {
          console.log("Error uploading images:", error);
          return;
        }
      }
      if (selectedFiles.length > 0 && selectedImages == 0) {
        const formData = new FormData();
        selectedFiles.forEach((file, index) => {
          const encodedFileName = encodeURIComponent(file.name);
          formData.append(`files`, file, encodedFileName);

        });

        try {
          const response = await axios.post(CHAT_API + currentChat?.chatId + "/files", formData, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          });
          content += response.data.data;
          type = "files";
        } catch (error) {
          console.error('Error uploading files:', error);
        }
      }

      try {
        content += sendMessages

        // Gửi tin nhắn đến server
        const { data } = await axios.put(CHAT_API + currentChat?.chatId + "/messages", {
          newMessage: {
            senderId: userInfo?.id,
            senderName: userInfo?.display_name,
            senderPicture: "https://lh3.googleusercontent.com/a/ACg8ocK1LMjQE59_kT4mNFmgxs6CmqzZ24lqR2bJ4jHjgB6yiW4=s96-c",
            type: type,
            content: content,
            timestamp: Date.now()
          }
        });



        if (currentChat.type == "private") {
          console.log("aaaaa")
          socket.current.emit("send-msg-private", {

            receiveId: receiveId,
            newMessage: {
              senderId: userInfo?.id,
              senderName: userInfo?.display_name,
              senderPicture: "https://lh3.googleusercontent.com/a/ACg8ocK1LMjQE59_kT4mNFmgxs6CmqzZ24lqR2bJ4jHjgB6yiW4=s96-c",
              type: type,
              content: content,
              timestamp: Date.now()
            }
          })
        }
        if (currentChat.type == "public") {

          socket.current.emit("send-msg-public", {

            receiveId: currentChat.participants.filter(p => p !== userInfo?.id),
            newMessage: {
              senderId: userInfo?.id,
              senderName: userInfo?.display_name,
              senderPicture: "https://lh3.googleusercontent.com/a/ACg8ocK1LMjQE59_kT4mNFmgxs6CmqzZ24lqR2bJ4jHjgB6yiW4=s96-c",
              type: type,
              content: content,
              timestamp: Date.now()
            }
          });
        }

        dispatch({
          type: reducerCases.ADD_MESSAGES,
          newMessage: {
            ...data.data.newMessage,
          },
          fromSelf: true
        })
        let group = [
          ...groups.filter(chat => chat.chatId === currentChat.chatId),
          ...groups.filter(chat => chat.chatId !== currentChat.chatId)
        ];
        dispatch({
          type: reducerCases.SET_ALL_GROUP,
          groups: group
        })
        setSelectedFiles([])
        setSelectedImages([])
        setSendMessages("")
      } catch (error) {
        console.log(error)
      }
    }
  }
  const convertName = () => {
    if (currentChat) {
      if (chat.type == "private") {
        const splitName = chat.name.split("/");
        const displayName = splitName[0] !== userInfo?.display_name ? splitName[0] : splitName[1];
        return displayName
      }
      return chat.name
    }
    else {
      return ""
    }
  }
  const openNewWindow = (chatId) => {

    return () => {
      socket.current.emit("get-browser", chatId);
    };
  };



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

  const handleVoiceCall = () => {
    if (currentChat.type === "private") {

      socket.current.emit("request-to-voice-call-private", {
        receiveId: receiveId,
        senderId: userInfo?.id,
        senderName: userInfo?.display_name
      });
    }
  };
  const handleClickOpenTab = (chatId) => {
    // Tạo URL cho tab mới
    const newTabUrl = `${CLIENT_HOST}/chat/${chatId}`;
    // Mở tab mới
    const newTab = window.open(newTabUrl, '_blank');
    // Kiểm tra nếu tab được tạo thành công và có thể focus, thì focus vào tab đó
    if (newTab && newTab.focus) {
      newTab.focus();
    }
  };


  // useEffect(() => {
  //   const handleResponse = (data) => {
  //     console.log("res call private");
  //     alert(data.res);
  //   };

  //   socket.current.on("response-from-voice-call-private", handleResponse);

  //   // Cleanup effect to remove the listener when component unmounts
  //   return () => {
  //     socket.current.off("response-from-voice-call-private", handleResponse);
  //   };
  // }, []); // Passing an empty dependency array ensures this effect runs only once, similar to componentDidMount
  // // Ensure this effect runs only once, similar to componentDidMount


  const handleVideoCall = () => {
    alert("call video")
  }


  return (

    <Stack className={`chat-box border-1 ${showInfo ? 'w-full' : ''}`}>
      <div className="chat-header justify-content-between align-items-center">
        <div className="d-flex">
          <img src={`https://lh3.googleusercontent.com/a/ACg8ocK1LMjQE59_kT4mNFmgxs6CmqzZ24lqR2bJ4jHjgB6yiW4=s96-c`} className="me-2 tw-w-12 tw-h-12 tw-rounded-full" />
          <div>
            <strong style={{ fontSize: '20px' }}>{convertName()}</strong>
            <p className="chat-header-condition">online</p>
          </div>
        </div>
        <div className="d-flex">
          <IoMdSearch className="chat-header-icon px-2 bg-white" title="Search" />
          <IoIosCall className="chat-header-icon px-2 bg-white" color="black" title="Call" onClick={() => handleClickOpenTab(chat.chatId)} />
          {/* <IoIosCall className="chat-header-icon px-2 bg-white" color="black" title="Call" onClick={openNewWindow(chat.chatId)} /> */}
          <IoIosVideocam className="chat-header-icon px-2 bg-white" color="black" title="Video Call" onClick={handleVideoCall} />
          {showInfo ? (<VscLayoutSidebarRightOff className="chat-header-icon px-2 bg-white" color="blue" onClick={toggleConversationInfo} />)
            : (<VscLayoutSidebarRightOff className="chat-header-icon px-2 bg-white" color="black" onClick={toggleConversationInfo} />)}
        </div>
      </div>
      <div >

      </div>


      {messages && (
        <Stack gap={3} className="messages tw-max-h-60"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {messages && messages.map((message, index) => (

            <div key={index} className={`tw-my-1 message align-self-${message.senderId == userInfo?.id ? 'end self' : 'start'} flex-grow-0`}>
              {message.senderId !== userInfo?.id ? (<img src={message.senderPicture} alt="" className="tw-w-10 tw-rounded-full tw-mr-2" />) : ""}
              <div className={'tw-flex tw-justify-center tw-items-center'}>
                <Stack>
                  <div className="tw-ml-4 tw-mb-1">
                    {message.senderName}
                  </div>
                  {message.type === "text" ? (
                    <span>{message.content}</span>
                  ) : (
                    message.type === "files" ? (
                      <div>
                        {message.content && message.content.split('|').map((content, index) => {


                          const lastSlashIndex = content.split("?");
                          const filenameWithExtension = lastSlashIndex[0];


                          const lastSlashIndex1 = filenameWithExtension.split("/");
                          const filenameWithExtension1 = lastSlashIndex1[lastSlashIndex1.length - 1];


                          const lastDotIndex = filenameWithExtension1.lastIndexOf(".");
                          const filename = filenameWithExtension1.substring(0, lastDotIndex);
                          const extension = filenameWithExtension1.substring(lastDotIndex);

                          return (
                            <div className="tw-flex" key={index}>
                              {content.startsWith("https://") ? (
                                <div className="tw-flex tw-justify-start tw-mb-3 tw-bg-blue-100 tw-w-full tw-p-3 tw-rounded-lg">

                                  <div className="tw-mr-3 ">
                                    {extension === ".doc" && (
                                      <img src={doc} alt={`Document ${index + 1}`} style={{ width: '32px', height: '32px' }} />
                                    )}
                                    {extension === ".xls" && (
                                      <img src={xls} alt={`Document ${index + 1}`} style={{ width: '32px', height: '32px' }} />
                                    )}
                                    {extension === ".xlsx" && (
                                      <img src={xlsx} alt={`Document ${index + 1}`} style={{ width: '32px', height: '32px' }} />
                                    )}
                                    {extension === ".pdf" && (
                                      <img src={pdf} alt={`Document ${index + 1}`} style={{ width: '32px', height: '32px' }} />
                                    )}
                                    {extension === ".txt" && (
                                      <img src={txt} alt={`Document ${index + 1}`} style={{ width: '32px', height: '32px' }} />
                                    )}
                                    {extension === ".docx" && (
                                      <img src={docx} alt={`Document ${index + 1}`} style={{ width: '32px', height: '32px' }} />
                                    )}
                                    {extension === ".pptx" && (
                                      <img src={ppt} alt={`Document ${index + 1}`} style={{ width: '32px', height: '32px' }} />
                                    )}
                                  </div>
                                  <span><a href={content}
                                    download={filename + extension}
                                    style={{ textDecoration: 'none', color: 'black' }}>{decodeURIComponent(decodeURI(filename))}</a></span>

                                </div>
                              ) : (
                                <span>{content}</span>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      message.content && message.content.split('|').map((content, index) => (
                        <div className="tw-flex" key={index}>
                          {content.startsWith("https://") ? (
                            <ChatImage imageUrl={content} alt="Image" className="tw-mb-1 tw-mr-1" />
                          ) : (
                            <span>{content}</span>
                          )}
                        </div>
                      ))
                    )
                  )}

                  <span className="tw-text-bubble-meta tw-text-[11px] tw-pt-1 tw-min-w-fit">
                    {calculateTime(message.timestamp)}
                  </span>
                </Stack>
                {message.senderId == userInfo?.id ? (<img src={message.senderPicture} alt="" className="tw-w-10 tw-rounded-full tw-ml-2" />) : ""}
              </div>
            </div>
          ))}
        </Stack>
      )
      }

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
          <input
            type="file"
            accept=".doc, .docx, .xls, .xlsx, .pdf, .txt, .pptx"
            className="d-none"
            onChange={handleFileInputChange}
            multiple
            id="file-input"
          />
          <label htmlFor="file-input" >
            <LinkOutlined className="chat-input-icon px-2" title="Attach File" />
          </label>
        </div>

        <div className="selected-images">
          {selectedImages.map((image, index) => (
            <div key={index} className="image-wrapper  tw-p-3 tw-mr-2">
              <img src={URL.createObjectURL(image)} alt={`Image ${index + 1}`} className="tw-w-12 tw-h-12" />
              <button className="delete-btn " onClick={() => handleRemoveImage(index)}><MdDeleteForever className="" /></button>
            </div>
          ))}
        </div>
        <div className=" tw-flex tw-flex-wrap">
          {selectedFiles.map((file, index) => (
            <div key={index} className="file-wrapper tw-p-3 tw-mr-2">
              <button onClick={() => handleRemoveFile(index)} className="tw-absolute -tw-right-2 -tw-top-4 tw-p-2">
                <MdDeleteForever className="tw-bg-[#1e1f22] tw-rounded-full tw-p-1 tw-text-3xl" />
              </button>
              <div className="tw-bg-slate-500 tw-p-2 tw-rounded-full">
                <div className="tw-text-white tw-text-sm ">{file.name}</div>
              </div>

            </div>
          ))}
        </div>
        <div className="d-flex w-100 tw-justify-center tw-items-center ">
          <TextArea
            type="text"
            placeholder="Type your message here..."
            className=" custom-scrollbar tw-overflow-auto tw-text-sm  focus:outline-none tw-text-black pt-3 tw-rounded-lg tw-w-full tw-max-h-14 tw-min-h-11"
            onChange={(e) => setSendMessages(e.target.value)}
            value={sendMessages}
          />
          <IoIosSend className="send-btn tw-cursor-pointer tw-text-white ms-2" onClick={handleSendMessage} style={{ backgroundColor: 'white', color: '#fffffff' }} />
        </div>
      </div>
    </Stack >
    // <div>a</div>
  );
};
export default ChatBox;