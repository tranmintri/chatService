import React, { useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";
import { ServerSecret, appId } from "../../utils/config";
import { io } from "socket.io-client";
import { CLIENT_HOST, HOST } from "./../../router/ApiRoutes";
import { Howl } from 'howler';

const socket = io.connect(HOST);

const CallPrivate = () => {
  const { id } = useParams();

  // Khởi tạo âm thanh chờ với Howl
  const ringbackTone = useRef(
    new Howl({
      src: ['../../assets/tieng-tut-tut-cua-dien-thoai.mp3'], // Thay bằng đường dẫn đến tệp âm thanh chờ của bạn
      loop: true,
      volume: 1.0,
    })
  );

  const meeting = (element) => {
    const token = ZegoUIKitPrebuilt.generateKitTokenForTest(
      appId,
      ServerSecret,
      id,
      Date.now().toString(),
      "Your Name"
    );

    const zc = ZegoUIKitPrebuilt.create(token);

    zc.joinRoom({
      container: element,
      scenario: {
        mode: ZegoUIKitPrebuilt.OneONoneCall,
      },
      showScreenSharingButton: false,
      showRoomTimer: true,
      onLeaveRoom: () => {
        const currentTab = window.open(`${CLIENT_HOST}/chat/${id}`, "_self");
        // Nếu tab hiện tại tồn tại và có thể đóng, thì đóng tab đó
        if (currentTab && currentTab.close) {
          currentTab.close();
        }
      },
      // Bắt đầu phát âm thanh chờ khi bắt đầu cuộc gọi
      onJoinRoom: () => {
        ringbackTone.current.play();
      },
      // Dừng phát âm thanh chờ khi cuộc gọi được kết nối
      onRoomUserUpdate: (updateType, userList) => {
        if (updateType === 'ADD' && userList.length > 1) {
          ringbackTone.current.stop();
        }
      },
    });
  };

  return <div ref={meeting} style={{ width: "100vw", height: "100vh" }}></div>;
};

export default CallPrivate;
