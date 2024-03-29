import { useEffect, useRef, useState } from "react";
import SideBar from "../components/SideBar";
import { useStateProvider } from "../context/StateContext";
import { useNavigate } from "react-router-dom";
import { CHAT_API, GET_CHAT_BY_PARTICIPANTS } from "../router/ApiRoutes";
import axios from "axios";
import { reducerCases } from "../context/constants";
import { io } from "socket.io-client";
import { HOST } from '../router/ApiRoutes';
import Loading from "../components/chat/Loading";

const Main = () => { // State để kiểm soát việc gọi fetchData
  const [{ userInfo, groups, currentChat }, dispatch] = useStateProvider();
  const navigate = useNavigate();
  const socket = useRef()
  const [socketEvent, setSocketEvent] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  useEffect(() => {
    if (!userInfo) {

      navigate("/signin");
    }
  }, [navigate, userInfo]);
  useEffect(() => {
    // Chỉ gọi fetchData nếu userInfo tồn tại và groupList chưa được fetch
    const fetchData = async () => {
      try {
        const { data } = await axios.get(GET_CHAT_BY_PARTICIPANTS + userInfo?.id);

        dispatch({
          type: reducerCases.SET_ALL_GROUP, groups: data.sort((a, b) => {
            const lastMessageA = a.messages[a.messages.length - 1];
            const lastMessageB = b.messages[b.messages.length - 1];
            return lastMessageB.timestamp - lastMessageA.timestamp;
          })
        });
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();

  }, [userInfo, dispatch]);

  useEffect(() => {
    if (userInfo) {
      socket.current = io(HOST)
      socket.current.emit("add-user", userInfo?.id)
      dispatch({ type: reducerCases.SET_SOCKET, socket: socket })
    }
  }, [userInfo])
  useEffect(() => {
    if (socket.current && !socketEvent) {
      socket.current.on("msg-recieve-private", (data) => {

        dispatch({
          type: reducerCases.ADD_MESSAGES,
          newMessage: {
            ...data.newMessage,
          }
        })
      })
      setSocketEvent(true)
    }
  }, [socket.current])

  useEffect(() => {
    // Sử dụng setTimeout để đợi 5 giây trước khi hiển thị thông báo
    const timer = setTimeout(() => {
      setIsLoading(true)
    }, 2000);

    // Clear timeout khi component unmount để tránh memory leak
    return () => clearTimeout(timer);
  }, [])
  useEffect(() => {
    const getMessage = async () => {
      const { data } = await axios.get(CHAT_API + currentChat?.chatId + "/messages")

      dispatch({
        type: reducerCases.SET_MESSAGES, messages: data
      })
    }
    if (currentChat?.chatId) {
      getMessage()
    }
  }, [currentChat])



  return isLoading ? <SideBar /> : <Loading />;
};

export default Main;
