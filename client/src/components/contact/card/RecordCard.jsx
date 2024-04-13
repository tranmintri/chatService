import React, { useEffect, useRef } from "react";
import WaveSurfer from "wavesurfer.js";

const RecordCard = ({ message }) => {
  return (
    <div>
      <audio controls>
        <source src={message.content} type="audio/ogg" />
        Your browser does not support the audio element.
      </audio>
      <audio controls controlsList="nodownload" volume={10.0}>
        <source src={URL.createObjectURL(message.content)} type="audio/ogg" />
        Your browser does not support the audio element.
      </audio>
    </div>
  );
};

export default RecordCard;
