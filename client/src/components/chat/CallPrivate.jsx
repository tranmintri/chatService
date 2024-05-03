import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";
import { ServerSecret, appId } from "../../utils/config";
import { io } from "socket.io-client";
import { CLIENT_HOST, HOST } from "./../../router/ApiRoutes";
import { v4 as uuidv4 } from "uuid";
import { CHAT_API } from "../../router/ApiRoutes";
import axios from "axios";

const socket = io.connect(HOST);
const CallPrivate = () => {
  const { id } = useParams();

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
    });
  };

  return <div ref={meeting} style={{ width: "100vw", height: "100vh" }}></div>;
};

export default CallPrivate;
