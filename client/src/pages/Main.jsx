import { useEffect, useRef, useState } from "react";
import SideBar from "../components/SideBar";
import { useStateProvider } from "../context/StateContext";
import { useNavigate } from "react-router-dom";
import {
  CHAT_API,
  GET_ALL_USER,
  GET_CHAT_BY_PARTICIPANTS,
} from "../router/ApiRoutes";
import axios from "axios";
import { reducerCases } from "../context/constants";
import { io } from "socket.io-client";
import { HOST } from "../router/ApiRoutes";
import { HOST2 } from "../router/ApiRoutes";
import Loading from "../components/chat/Loading";
import { toast } from "react-toastify";
import CallPrivate from "./../components/chat/CallPrivate";
import CallPage from "../components/chat/CallPage";
const Main = () => {
  const [
    { userInfo, groups, currentChat, callPage, onlineUsers, incomingVoiceCall },
    dispatch,
  ] = useStateProvider();
  const [state] = useStateProvider();
  const navigate = useNavigate();
  const socket = useRef();
  const socket2 = useRef();
  const [socketEvent, setSocketEvent] = useState(false);
  const [socketEvent2, setSocketEvent2] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    if (!userInfo) {
      navigate("/signin");
    }
  }, [navigate, userInfo]);
  useEffect(() => {
    // Chỉ gọi fetchData nếu userInfo tồn tại và groupList chưa được fetch
    const fetchData = async () => {
      try {
        const { data } = await axios.get(
          GET_CHAT_BY_PARTICIPANTS + userInfo?.id
        );

        dispatch({
          type: reducerCases.SET_ALL_GROUP,
          groups: data.sort((a, b) => {
            const lastMessageA = a.messages?.[a.messages.length - 1];
            const lastMessageB = b.messages?.[b.messages.length - 1];
            return (
              (lastMessageB?.timestamp || 0) - (lastMessageA?.timestamp || 0)
            );
          }),
        });
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [userInfo, dispatch]);

  useEffect(() => {
    if (userInfo) {
      socket.current = io(HOST);
      socket.current.emit("add-user", userInfo?.id);
      dispatch({ type: reducerCases.SET_SOCKET, socket: socket });

      socket2.current = io(HOST2);
      socket2.current.emit("add-user", userInfo?.id);
      dispatch({ type: reducerCases.SET_SOCKET2, socket2: socket2 });
    }
  }, [userInfo]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get(GET_ALL_USER + userInfo.id);

        socket.current.emit("request-get-all-friend-online", data.data);
        socket.current.emit("request-connect-user", data.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();

    return () => {
      // Cleanup code here (if needed)
    };
  }, [userInfo]);

  useEffect(() => {
    if (socket.current && !socketEvent) {
      socket.current.on("msg-recieve-private", (data) => {
        dispatch({
          type: reducerCases.ADD_MESSAGES,
          newMessage: {
            ...data.newMessage,
          },
        });
      });
      setSocketEvent(true);
    }
  }, [socket.current]);

  useEffect(() => {
    if (socket.current && !socketEvent) {
      socket.current.on("response-to-voice-call-private", (data) => {
        dispatch({
          type: reducerCases.SET_INCOMING_VOICE_CALL,
          incomingVoiceCall: data,
        });
      });

      setSocketEvent(true);
    }
  }, [socket.current]);

  useEffect(() => {
    if (socket.current && !socketEvent) {
      socket.current.on("response-get-all-friend-online", (data) => {
        dispatch({
          type: reducerCases.SET_ALL_ONLINE_USER,
          onlineUsers: data,
        });
      });

      setSocketEvent(true);
    }
  }, [socket.current]);
  useEffect(() => {
    const fetchData = async (friendId) => {
      try {
        dispatch({
          type: reducerCases.ADD_ONLINE_USER,
          newOnlineUsers: friendId,
          fromSelf: true,
        });
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    if (socket.current && !socketEvent && userInfo) {
      socket.current.on("response-connect-user", async (data) => {
        await fetchData(data);
      });
      setSocketEvent(true);
    }
  }, [socket.current]);
  useEffect(() => {
    const fetchData = async (friendId) => {
      try {
        dispatch({
          type: reducerCases.REMOVE_ONLINE_USER,
          onlineUsers: friendId,
        });
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    if (socket.current && !socketEvent && userInfo) {
      socket.current.on("response-disconnect-user", async (friendId) => {
        await fetchData(friendId);
      });
      setSocketEvent(true);
    }
  }, [socket.current]);

  useEffect(() => {
    if (socket.current && !socketEvent) {
      socket.current.on("response-accpet-call-private", (data) => {
        dispatch({
          type: reducerCases.SET_CALL_ACCEPTED,
          callAccepted: data,
        });

        toast.info("User is accept");
      });

      setSocketEvent(true);
    }
  }, [socket.current]);

  useEffect(() => {
    if (socket.current && !socketEvent) {
      socket.current.on("response-cancel-call-private", (data) => {
        dispatch({
          type: reducerCases.SET_INCOMING_VOICE_CALL,
          incomingVoiceCall: undefined,
        });
        toast.info("The call is canceled");
      });

      setSocketEvent(true);
    }
  }, [socket.current]);
  useEffect(() => {
    if (socket.current && !socketEvent) {
      socket.current.on("response-end-call-private", (data) => {
        dispatch({
          type: reducerCases.SET_INCOMING_VOICE_CALL,
          incomingVoiceCall: undefined,
        });
        toast.info("The call is ended");
      });

      setSocketEvent(true);
    }
  }, [socket.current]);
  useEffect(() => {
    if (socket.current && !socketEvent) {
      socket.current.on("response-disband-the-group", async (chatId) => {
        const { data } = await axios.get(
          GET_CHAT_BY_PARTICIPANTS + userInfo?.id
        );

        if (data) {
          dispatch({
            type: reducerCases.SET_ALL_GROUP,
            groups: data.filter((d) => d.chatId !== chatId),
          });
        }
      });
      setSocketEvent(true);
    }
  }, [socket.current]);
  useEffect(() => {
    if (socket.current && !socketEvent) {
      socket.current.on("response-create-the-group", async (group) => {
        if (group) {
          dispatch({
            type: reducerCases.CREATE_GROUP,
            groups: { ...group },
            fromSelf: true,
          });
        }
      });
      setSocketEvent(true);
    }
  }, [socket.current]);

  useEffect(() => {
    if (socket.current && !socketEvent) {
      socket.current.on("msg-recieve-public", (data) => {
        dispatch({
          type: reducerCases.ADD_MESSAGES,
          newMessage: {
            ...data.newMessage,
          },
        });
      });
      setSocketEvent(true);
    }
  }, [socket.current]);
  useEffect(() => {
    if (socket2.current && !socketEvent2) {
      socket2.current.on("friendRequest", (data) => {
        if (data.receiver === userInfo?.id) {
          dispatch({
            type: reducerCases.ADD_RECEIVE_INVITATION,
            newReceive: data,
          });
        }
        toast.info("You have a new friend request " + data.senderName);
      });
      setSocketEvent2(true);
    }
  }, [socket2.current]);
  useEffect(() => {
    if (socket2.current && !socketEvent2) {
      socket2.current.on("acceptFriend", (data) => {
        toast.success("You friend request accpeted by " + data.display_name);
      });
      setSocketEvent2(true);
    }
  }, [socket2.current]);

  useEffect(() => {
    // Sử dụng setTimeout để đợi 5 giây trước khi hiển thị thông báo
    const timer = setTimeout(() => {
      setIsLoading(true);
    }, 2000);

    // Clear timeout khi component unmount để tránh memory leak
    return () => clearTimeout(timer);
  }, []);
  useEffect(() => {
    const getMessage = async () => {
      try {
        if (currentChat?.chatId) {
          const { data } = await axios.get(
            `${CHAT_API}${currentChat.chatId}/messages`
          );

          dispatch({
            type: reducerCases.SET_MESSAGES,
            messages: data ? data : [],
          });
        }
      } catch (error) {
        console.error("Error fetching messages:", error);
        // Handle the error, e.g., display an error message to the user
      }
    };

    getMessage();
  }, [currentChat]);
  useEffect(() => {
    if (socket.current && !socketEvent) {
      socket.current.on("leave-group-noti", (data) => {
        alert(data.user_Name + " leave group");
      });
      // console.log("log-out");
      // dispatch({
      //   type: reducerCases.SET_ALL_GROUP,
      //   groups: groups.filter((g) => g.chatId != data.chatId),
      // });
      // dispatch({
      //   type: reducerCases.SET_CURRENT_CHAT,
      //   chat: undefined,
      // });
      setSocketEvent(true);
    }
  }, [socket.current]);

  useEffect(() => {
    if (socket.current && !socketEvent) {
      socket.current.on("kick-out", (data) => {
        alert(data.user_Name + " has been kicked out of the group");
      });
      setSocketEvent(true);
    }
  }, [socket.current]);

  return callPage ? <CallPage /> : isLoading ? <SideBar /> : <Loading />;
};

export default Main;
