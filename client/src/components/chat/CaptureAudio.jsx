import React, { useRef, useState } from "react";
import { FaStop, FaTrash, FaPlay } from "react-icons/fa";
import { useStateProvider } from "../../context/StateContext";
import { formatTimeStr } from "antd/es/statistic/utils";

const CaptureAudio = ({ hide }) => {
    const [{ userInfo, currentChat, socket }, dispatch] = useStateProvider();

    const [isRecording, setIsRecording] = useState(false);
    const [recordedAudio, setRecordAudio] = useState(null);
    const [waveform, setWaveForm] = useState(null);
    const [recordingDuration, setRecordingDuration] = useState(0);
    const [currentPlayBackTime, setCurrentPlayBackTime] = useState(0);
    const [totalDuration, setTotalDuration] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);

    const audioRef = useRef(null);
    const mediaRecordRef = useRef(null);
    const waveFormRef = useRef(null);

    const handlePlayRecording = () => {

    }
    const handleStopRecording = () => {

    }

    return (
        <div className="tw-flex tw-text-2xl tw-w-full tw-justify-end tw-items-center">
            {/* <div className="tw-pt-1">
                <FaTrash className="" onClick={() => hide()} />
            </div>
            <div className="tw-mx-4 tw-px-4 tw-text-lg tw-flex tw-gap-3 tw-justify-center tw-items-center tw-rounded-full tw-drop-shadow-lg">
                {isRecording ? (
                    <div className="tw-text-red-500 tw-animate-pulse tw-2-60 tw-text-center">
                        Recording <span>{recordingDuration}</span>
                    </div>
                ) : (
                    <div>
                        {recordedAudio && <>{!isPlaying ? <FaPlay onClick={handlePlayRecording} /> : <FaStop onClick={handleStopRecording} />}</>}
                    </div>
                )}
                <div className="tw-w-60" ref={waveFormRef} hidden={isRecording}/>
                {
                    recordedAudio &&
                        isPlaying && <span>{formatTime(currentPlayBackTime)}</span>
                }
            </div> */}
            audio
        </div>
    );
};

export default CaptureAudio;
