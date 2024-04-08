import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import SideBar from "../components/SideBar";
import Loading from "../components/chat/Loading";
import { useStateProvider } from "../context/StateContext";
import { reducerCases } from "../context/constants";
import { CHAT_API, GET_CHAT_BY_PARTICIPANTS, HOST, HOST2 } from "../router/ApiRoutes";

const Main = () => { // State để kiểm soát việc gọi fetchData
  const [{ userInfo, currentChat }, dispatch] = useStateProvider();
  const navigate = useNavigate();
  const socket = useRef()
  const [socketEvent, setSocketEvent] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  useEffect(() => {
    if (!userInfo) {

      navigate("/signin");
    }
    console.log(userInfo)
  }, [navigate, userInfo]);
  useEffect(() => {
    // Chỉ gọi fetchData nếu userInfo tồn tại và groupList chưa được fetch
    const fetchData = async () => {
      try {
        const { data } = await axios.get(GET_CHAT_BY_PARTICIPANTS + userInfo?.id);

        dispatch({
          type: reducerCases.SET_ALL_GROUP, groups: data.sort((a, b) => {
            const lastMessageA = a.messages?.[a.messages.length - 1];
            const lastMessageB = b.messages?.[b.messages.length - 1];
            return (lastMessageB?.timestamp || 0) - (lastMessageA?.timestamp || 0);
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

      // socket.current = io(HOST2)
      // socket.current.emit("add-user", userInfo?.id)
      // dispatch({ type: reducerCases.SET_SOCKET, socket: socket })
    }
  }, [userInfo])
  useEffect(() => {
    if (socket.current && !socketEvent) {
      socket.current.on(" ", (data) => {
        console.log(data)
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
    if (socket.current && !socketEvent) {
      socket.current.on("msg-recieve-private", (data) => {
        console.log("public")
        console.log(data)
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
    if (socket.current && !socketEvent) {
      socket.current.on("msg-recieve-public", (data) => {
        console.log("public")
        console.log(data)
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
    }, 800);

    // Clear timeout khi component unmount để tránh memory leak
    return () => clearTimeout(timer);
  }, [])
  useEffect(() => {
    const getMessage = async () => {
      try {
        if (currentChat?.chatId) {
          const { data } = await axios.get(`${CHAT_API}${currentChat.chatId}/messages`);
          console.log(data)
          dispatch({ type: reducerCases.SET_MESSAGES, messages: data ? data : [] });
        }
      } catch (error) {
        console.error("Error fetching messages:", error);
        // Handle the error, e.g., display an error message to the user
      }
    };

    getMessage();
  }, [currentChat]);



  return isLoading ? <SideBar /> : <Loading />;
};

export default Main;