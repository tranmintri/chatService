import React, { useEffect, useRef } from "react";
import WaveSurfer from "wavesurfer.js";

const RecordCard = ({ message }) => {
  return (
    <div>
      <audio controls>
        <source src={message.content} type="audio/mp3" />
        Your browser does not support the audio element.
      </audio>
    </div>
  );
};

export default RecordCard;
