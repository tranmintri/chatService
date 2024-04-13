import React, { useState, useRef, useEffect } from "react";
import { FaCirclePause, FaCirclePlay } from "react-icons/fa6";
import { IoIosCloseCircle, IoMdSend } from "react-icons/io";
import { CHAT_API } from "../../router/ApiRoutes";
import { useStateProvider } from "../../context/StateContext";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";
import { reducerCases } from "../../context/constants";

const AudioRecorder = ({ hide }) => {
  const [{ currentChat, userInfo, socket, groups }, dispatch] =
    useStateProvider();
  const [isRecording, setIsRecording] = useState(false);
  const [recordedAudio, setRecordedAudio] = useState(null);
  const [formData, setFormData] = useState(null);
  const mediaRecorderRef = useRef(null);
  const audioRef = useRef(null);
  const [recordingDuration, setRecordingDuration] = useState(0);

  useEffect(() => {
    startRecording(); // Start recording when component is rendered
    return () => stopRecording(); // Stop recording when component is unmounted
  }, []);

  useEffect(() => {
    let interval;
    if (isRecording) {
      interval = setInterval(() => {
        setRecordingDuration((prevDuration) => prevDuration + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  const startRecording = () => {
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorderRef.current = mediaRecorder;
        const chunks = [];

        mediaRecorder.ondataavailable = (e) => chunks.push(e.data);
        mediaRecorder.onstop = () => {
          const blob = new Blob(chunks, { type: "audio/ogg" });
          setRecordedAudio(blob);
          const newFormData = new FormData();
          newFormData.append("record", blob, "recording.ogg");
          setFormData(newFormData);
        };

        mediaRecorder.start();
        setIsRecording(true);
      })
      .catch((error) => {
        console.error("Error recording:", error);
      });
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
    }
  };

  const handleSend = async () => {
    mediaRecorderRef.current.stop();
    setIsRecording(false);

    // Tạo đối tượng Blob từ recordedAudio
    const newBlob = new Blob([recordedAudio], { type: "audio/ogg" });

    // Tạo FormData và cập nhật state formData
    const newFormData = new FormData();
    newFormData.append("record", newBlob, "recording.ogg");
    setFormData(newFormData); // Cập nhật formData với dữ liệu mới

    setRecordingDuration(0); // Đặt lại độ dài ghi âm

    // Gọi hàm gửi dữ liệu ngay sau khi cập nhật formData
    try {
      const response = await axios.post(
        CHAT_API + currentChat.chatId + "/record",
        newFormData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      console.log("Server response:", response.data);
      const receiveId =
        currentChat?.participants.length == 2
          ? currentChat?.participants.reduce((acc, participantId) => {
              if (participantId !== userInfo?.id) {
                acc = participantId;
              }
              return acc;
            }, null)
          : "";
      const type = "record";
      const messageId = uuidv4();
      console.log(response.data);
      const { data } = await axios.put(
        CHAT_API + currentChat?.chatId + "/messages",
        {
          newMessage: {
            messageId: messageId,
            senderId: userInfo?.id,
            senderName: userInfo?.display_name,
            senderPicture: userInfo?.avatar,
            type: type,
            content: response.data.url,
            timestamp: Date.now(),
          },
        }
      );
      console.log(data.data);
      const content = response.data.url;
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
          receiveId: currentChat.participants.filter((p) => p !== userInfo?.id),
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
      hide();
    } catch (error) {
      console.error("Error sending audio:", error);
    }
  };

  const formatTime = (time) => {
    if (isNaN(time)) return "00:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  };

  return (
    <div>
      <div className="tw-w-full tw-flex tw-items-center tw-justify-between">
        <IoIosCloseCircle
          onClick={() => hide()}
          className="tw-cursor-pointer"
        />
        <div className="tw-flex tw-justify-between tw-relative tw-px-2 tw-items-center tw-w-11/12 tw-bg-slate-300 tw-rounded-full">
          <div className="tw-items-center tw-mb-1 tw-relative">
            <span className="tw-rounded-lg tw-bg-white tw-text-black tw-px-2 tw-py-1 tw-text-sm tw-inline-block">
              {formatTime(recordingDuration)}
            </span>
          </div>
        </div>
        <IoMdSend
          className="tw-text-3xl tw-cursor-pointer"
          onClick={handleSend}
        />
      </div>
    </div>
  );
};

export default AudioRecorder;
