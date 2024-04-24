import { Stack } from "react-bootstrap";
import avatar from "../../assets/2Q.png";
import { useState } from "react";
import { useStateProvider } from "../../context/StateContext";
import { calculateTime } from "../../utils/CalculateTime";
import { reducerCases } from "../../context/constants";
import { useEffect } from "react";

const UserChat = () => {
  const [groupList, setGroupList] = useState([]);
  const [{ userInfo, groups, socket, onlineUsers, messages }, dispatch] =
    useStateProvider();

  const handleSelectChat = (chat) => {
    socket.current.emit("joinRoom", chat.chatId);
    dispatch({
      type: reducerCases.SET_CURRENT_CHAT,
      chat: chat, // hoặc chat.chat nếu cần truy cập vào các thuộc tính khác của chat
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setGroupList(groups ? groups : []);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [groups]);

  return (
    <div className="tw-mt-20">
      {groupList.map((chat, index) => {
        if (chat.messages && chat.messages.length > 0) {
          const lastMessage = chat.messages
            .slice()
            .reverse()
            .find((contentItem) => contentItem.senderID !== userInfo?.id);

          if (lastMessage && chat.name) {
            const convertName = () => {
              if (chat.type == "private") {
                const splitName = chat.name.split("/");
                const displayName =
                  splitName[0] !== userInfo?.display_name
                    ? splitName[0]
                    : splitName[1];

                return displayName;
              }
              return chat.name;
            };
            const convertImage = () => {
              if (chat.type == "private") {
                const splitName = chat.picture.split("|");
                const friendPicture =
                  splitName[0] !== userInfo?.avatar
                    ? splitName[0]
                    : splitName[1];

                return friendPicture;
              }
              return chat.picture;
            };
            return (
              <Stack
                key={index}
                onClick={() => handleSelectChat(chat)}
                direction="horizontal"
                gap={3}
                className="user-card align-items-center p-2 justify-content-between tw-overflow-x-clip "
                role="button"
              >
                <div className="d-flex">
                  <div className="m-2">
                    <img
                      src={convertImage()}
                      className="me-2 tw-h-16 tw-w-16 tw-rounded-full tw-shadow-lg"
                      alt="Avatar"
                    />
                  </div>
                  <div className="text-content">
                    <div className="name">{convertName()}</div>
                    {lastMessage.type == "image" ? (
                      `Friend sent some image for you`
                    ) : lastMessage.type == "files" ? (
                      `Friend sent some file for you`
                    ) : lastMessage.type == "record" ? (
                      `Friend sent a record for you`
                    ) : (
                      <div className="text">{lastMessage.content}</div>
                    )}
                  </div>
                </div>
                <div className="d-flex flex-column align-items-end">
                  <div className="date">
                    {calculateTime(lastMessage.timestamp)}
                  </div>
                  {/* <div className="this-user-notifications">{1}</div> */}
                  {chat.type === "private" &&
                  onlineUsers.includes(
                    chat.participants.filter((p) => p !== userInfo?.id)[0]
                  ) ? (
                    <span className="user-online mt-1"></span>
                  ) : (
                    chat.type === "private" && (
                      <span className="user-offline mt-1"></span>
                    )
                  )}
                </div>
              </Stack>
            );
          }
        }
        // Lấy tin nhắn cuối cùng từ mỗi người gửi có senderID khác 1
      })}
    </div>
  );
};

export default UserChat;
