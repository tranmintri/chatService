import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useStateProvider } from '../../context/StateContext';
import { IoMdMic, IoMdMicOff } from "react-icons/io";
import { HiVideoCamera, HiVideoCameraSlash } from "react-icons/hi2";
import { MdOutlineScreenShare } from "react-icons/md";
import { ImPhoneHangUp } from "react-icons/im";
import { MdGroups2 } from "react-icons/md";

function CallPrivate() {
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
            if (micOn) {
                setMicOn(false);
            }
            else {
                setMicOn(true)
            }
        }
    };

    const toggleCamera = () => {
        if (localStream) {
            const videoTrack = localStream.getVideoTracks()[0];
            videoTrack.enabled = !videoTrack.enabled; // Toggle trạng thái của camera

            if (cameraOn) {
                setCameraOn(false);
            }
            else {
                setCameraOn(true)
            }
        }
    };
    useEffect(() => {
        // Listen for answer event from server
        socket.current.on('answer', (answer) => {
            handleAnswer(answer);
        });

        return () => {
            // Remove the event listener when the component unmounts
            if (socket && socket.current) {
                socket.current.off('answer');
            }
        };
    }, []);


    const handleAnswer = (answer) => {
        peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
    };
    useEffect(() => {
        // Listen for ice-candidate event from server
        socket.current.on('ice-candidate', (data) => {
            handleIceCandidate(data.candidate);
        });

        return () => {
            // Remove the event listener when the component unmounts
            if (socket && socket.current) {
                socket.current.off('ice-candidate');
            }
        };
    }, []);


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
        <div className='tw-w-full tw-bg-slate-950'>
            <div className='tw-flex tw-min-h-96 tw-max-h-96 tw-bg-slate-900'>
                <video autoPlay muted ref={videoRef} style={{ width: '47%', height: '60%' }}>
                </video>
                <video autoPlay ref={videoRef} style={{ width: '47%', height: '60%' }}></video>

            </div>
            <div className='tw-min-h-56 tw-max-h-56 tw-bg-slate-900'>
                aaaaaaaaaaaaaaaa
            </div>
            <div className='tw-flex tw-justify-between tw-mt-7 tw-min-h-32 tw-max-h-32'>
                <div>
                    <span className='tw-text-2xl tw-text-white tw-font-semibold'>Group Meeting</span>
                </div>
                <div>
                    <button className="control-button" onClick={toggleMic}>
                        {micOn ? <IoMdMic className='tw-text-6xl tw-text-white tw-mr-9 tw-bg-slate-500 tw-rounded-full p-3' /> : <IoMdMicOff className='tw-text-6xl tw-text-white tw-mr-9 tw-bg-slate-500 tw-rounded-full tw-p-3' />}
                    </button>
                    <button className="control-button" onClick={toggleCamera}>
                        {cameraOn ? <HiVideoCamera className='tw-text-6xl tw-text-white tw-mr-9 tw-bg-slate-500 tw-rounded-full tw-p-3' /> : <HiVideoCameraSlash className='tw-text-6xl tw-text-white tw-mr-9 tw-bg-slate-500 tw-rounded-full tw-p-3' />}
                    </button>
                    <button className="control-button">
                        <ImPhoneHangUp className='tw-text-6xl tw-text-white tw-mr-9 tw-bg-red-600 tw-rounded-full tw-p-3' />
                    </button>
                    <button className="control-button">
                        <MdOutlineScreenShare className='tw-text-6xl tw-text-white tw-bg-slate-500 tw-rounded-full tw-p-3' />
                    </button>
                </div>
                <div>
                    <span className='tw-text-4xl tw-text-white tw-mr-7 flex tw-justify-center tw-items-center'>
                        <MdGroups2 />
                    </span>
                </div>
            </div>
        </div>
    );
}

export default CallPrivate;
