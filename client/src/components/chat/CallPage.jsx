import React, { useEffect, useRef, useState } from "react"
import Peer from "simple-peer"
import { io } from "socket.io-client";
import { useParams } from 'react-router-dom';
import { useStateProvider } from "../../context/StateContext"
import { Input } from 'antd';
import { Button } from 'react-bootstrap';
import { HOST } from "../../router/ApiRoutes";
import { reducerCases } from "../../context/constants";

function CallPage() {
    const { id } = useParams();
    const socket = useRef()
    const [{ userInfo }, dispatch] = useStateProvider()

    const [me, setMe] = useState("")
    const [stream, setStream] = useState()
    const [receivingCall, setReceivingCall] = useState(false)
    const [caller, setCaller] = useState("")
    const [callerSignal, setCallerSignal] = useState()
    const [callAccepted, setCallAccepted] = useState(false)
    const [idToCall, setIdToCall] = useState("")
    const [callEnded, setCallEnded] = useState(false)
    // const [name, setName] = useState("")
    const myVideo = useRef()
    const userVideo = useRef()
    const connectionRef = useRef()

    useEffect(() => {
        // if (userInfo) {
        socket.current = io(HOST)
        socket.current.emit("add-user", userInfo?.id)
        dispatch({ type: reducerCases.SET_SOCKET, socket: socket })

        // socket.current = io(HOST2)
        // socket.current.emit("add-user", userInfo?.id)
        // dispatch({ type: reducerCases.SET_SOCKET, socket: socket })
        // }
    }, [])

    useEffect(() => {
        navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((stream) => {
            setStream(stream)
            myVideo.current.srcObject = stream
        })

        socket.current.on("me", (id) => {
            console.log(id)
            setMe(id)
        })

        socket.current.on("callUser", (data) => {
            console.log(data)
            setReceivingCall(true)
            setCaller(data.from)
            // setName(data.name)
            setCallerSignal(data.signal)
        })
    }, [socket.current])

    const callUser = (id) => {
        const peer = new Peer({
            initiator: true,
            trickle: false,
            stream: stream
        })
        peer.on("signal", (data) => {
            console.log(data)
            // socket.current.emit("callUser", {
            //     // userToCall: id,
            //     // signalData: data,
            //     // from: me,
            //     // name: name
            //     name: "a"
            // })
            socket.current.emit("callUser", "aaaaaaa")
        })
        socket.current.emit("callUser", "aaaaaaa")
        peer.on("stream", (stream) => {
            userVideo.current.srcObject = stream
        })
        socket.current.on("callAccepted", (signal) => {
            setCallAccepted(true)
            peer.signal(signal)
        })

        connectionRef.current = peer
    }

    const answerCall = () => {
        setCallAccepted(true)
        const peer = new Peer({
            initiator: false,
            trickle: false,
            stream: stream
        })
        peer.on("signal", (data) => {
            console.log(data)
            socket.current.emit("answerCall", { signal: data, to: caller })
        })
        peer.on("stream", (stream) => {
            userVideo.current.srcObject = stream
        })

        peer.signal(callerSignal)
        connectionRef.current = peer
    }

    const leaveCall = () => {
        setCallEnded(true)
        connectionRef.current.destroy()
    }

    return (
        <>
            <h1 style={{ textAlign: "center", color: '#fff' }}>Zoomish</h1>
            <div className="container">
                <div className="video-container">
                    <div className="video">
                        <video ref={myVideo} autoPlay playsInline muted style={{ width: "300px" }} />

                    </div>
                    <div className="video">
                        {callAccepted && !callEnded ?
                            <video playsInline ref={userVideo} autoPlay style={{ width: "300px" }} /> :
                            null}
                    </div>
                </div>
                <div className="myId">



                    <Input
                        id="filled-basic"
                        label="ID to call"
                        variant="filled"
                        value={id}
                        onChange={(e) => setIdToCall(e.target.value)}
                    />
                    <div className="call-button">
                        {callAccepted && !callEnded ? (
                            <Button variant="contained" color="secondary" onClick={leaveCall}>
                                End Call
                            </Button>
                        ) : (
                            <Button color="primary" aria-label="call" onClick={() => callUser(id)}>
                                Phone Icon
                            </Button>
                        )}
                        {id}
                    </div>
                </div>
                <div>
                    {receivingCall && !callAccepted ? (
                        <div className="caller">
                            <h1 >{id} is calling...</h1>
                            <Button className="tw-bg-black" onClick={answerCall}>
                                Answer
                            </Button>
                        </div>
                    ) : null}
                </div>
            </div>
        </>
    )
}

export default CallPage;
