import React, { useEffect, useRef } from "react";
import { AudioPlayer } from "react-audio-play";
import ReactPlayer from "react-player";

const RecordCard = ({ message }) => {
  return (
    <div className="tw-mt-2">
      <AudioPlayer
        src={message.content}
        color="#cfcfcf"
        sliderColor="#47484b"
        backgroundColor="#757575"
        style={{ borderRadius: "15px", padding: "30px" }}
      />
    </div>
  );
};

export default RecordCard;
