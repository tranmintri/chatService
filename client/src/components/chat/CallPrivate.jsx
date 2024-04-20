import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";
import { ServerSecret, appId } from "../../utils/config";

const CallPrivate = () => {
  const { id } = useParams();
  console.log(id);
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
        console.log("leaveRoom");
      },
    });
  };

  return <div ref={meeting} style={{ width: "100vw", height: "100vh" }}></div>;
};

export default CallPrivate;
