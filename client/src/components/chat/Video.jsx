import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useStateProvider } from '../../context/StateContext';
import { IoMdMic, IoMdMicOff } from "react-icons/io";
import { HiVideoCamera, HiVideoCameraSlash } from "react-icons/hi2";
import { MdOutlineScreenShare } from "react-icons/md";
import { ImPhoneHangUp } from "react-icons/im";
import { MdGroups2 } from "react-icons/md";

function Video() {
    const { id } = useParams();
    const [{ socket }] = useStateProvider();
    const [localStream, setLocalStream] = useState(null);
    const [remoteStream, setRemoteStream] = useState(null);
    const [peerConnection, setPeerConnection] = useState(null);
    const [roomId, setRoomId] = useState('');
    const videoRef = useRef(null); // Khởi tạo useRef
    const [micOn, setMicOn] = useState(true); // State cho trạng thái mic
    const [cameraOn, setCameraOn] = useState(true); // State cho trạng thái camera

    const createPeerConnection = () => {
        const pc = new RTCPeerConnection();
        pc.addStream(localStream);
        pc.onicecandidate = (event) => {
            if (event.candidate) {
                socket.emit('ice-candidate', { roomId, candidate: event.candidate });
            }
        };
        pc.onaddstream = (event) => setRemoteStream(event.stream);
        setPeerConnection(pc);
    };

    useEffect(() => {
        navigator.mediaDevices.getUserMedia({ video: true, audio: true })
            .then((stream) => {
                setLocalStream(stream);
            })
            .catch((error) => {
                console.error('Error accessing media devices:', error);
            });

        if (socket && socket.current) {
            socket.current.on('connect', () => {
                console.log('Connected to server');
            });

            // Nhận offer từ người gọi
            socket.current.on('offer', (offer) => {
                handleOffer(offer);
            });
        }

        return () => {
            if (localStream) {
                localStream.getTracks().forEach((track) => track.stop());
            }
            if (socket && socket.current) {
                socket.current.disconnect();
            }
        };
    }, []);

    const handleJoinCall = () => {
        if (roomId) {
            createPeerConnection();
            socket.current.emit('join-call', roomId);
        }
    };

    const handleOffer = (offer) => {
        if (!peerConnection) {
            createPeerConnection();
        }
        peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
        peerConnection.createAnswer()
            .then((answer) => {
                peerConnection.setLocalDescription(answer);
                socket.current.emit('answer', { roomId, answer });
            })
            .catch((error) => {
                console.error('Error creating answer:', error);
            });
    };

    const toggleMic = () => {
        if (localStream) {
            const audioTrack = localStream.getAudioTracks()[0];
            audioTrack.enabled = !audioTrack.enabled; // Toggle trạng thái của mic
            setMicOn(!micOn);
        }
    };

    const toggleCamera = () => {
        if (localStream) {
            const videoTrack = localStream.getVideoTracks()[0];
            videoTrack.enabled = !videoTrack.enabled; // Toggle trạng thái của camera
            setCameraOn(!cameraOn);
        }
    };

    const handleAnswer = (answer) => {
        peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
    };

    const handleIceCandidate = (candidate) => {
        if (peerConnection) {
            peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
        }
    };

    useEffect(() => {
        if (localStream) {
            videoRef.current.srcObject = localStream;
        }
    }, [localStream, remoteStream]);

    return (
        <div className='w-full bg-slate-950'>
            <div className='min-h-96 max-h-96 bg-slate-900'>
                <video autoPlay muted ref={videoRef} style={{ width: '47%', height: '47%', position: 'absolute', top: 0, left: 450 }}></video>
                <video autoPlay ref={videoRef} style={{ width: '47%', height: '47%', position: 'absolute', top: 0, left: 450 }}></video>
            </div>
            <div className='min-h-56 max-h-56'>
                ádddđ
            </div>
            <div className='flex justify-between mt-7 min-h-32 max-h-32'>
                <div>
                    <span className='text-2xl text-white font-semibold'>Group Meeting</span>
                </div>
                <div>
                    <button className="control-button" onClick={toggleMic}>
                        {micOn ? <IoMdMic className='text-6xl text-white mr-9 bg-slate-500 rounded-full p-3' /> : <IoMdMicOff className='text-6xl text-white mr-9 bg-slate-500 rounded-full p-3' />}
                    </button>
                    <button className="control-button" onClick={toggleCamera}>
                        {cameraOn ? <HiVideoCamera className='text-6xl text-white mr-9 bg-slate-500 rounded-full p-3' /> : <HiVideoCameraSlash className='text-6xl text-white mr-9 bg-slate-500 rounded-full p-3' />}
                    </button>
                    <button className="control-button">
                        <ImPhoneHangUp className='text-6xl text-white mr-9 bg-red-600 rounded-full p-3' />
                    </button>
                    <button className="control-button">
                        <MdOutlineScreenShare className='text-6xl text-white bg-slate-500 rounded-full p-3' />
                    </button>
                </div>
                <div>
                    <span className='text-4xl text-white mr-7 flex justify-center items-center'>
                        <MdGroups2 />
                    </span>
                </div>
            </div>
        </div>
    );
}

export default Video;