import { Stack } from "react-bootstrap";
import avatar from "../../assets/2Q.png"
import { useState } from "react";
import { useStateProvider } from "../../context/StateContext";
import { calculateTime } from "../../utils/CalculateTime";
import { reducerCases } from "../../context/constants";
import { useEffect } from "react";

const UserChat = () => {

    const [groupList, setGroupList] = useState([])
    const [{ userInfo, groups }, dispatch] = useStateProvider();

    const handleSelectChat = (chat) => {
        dispatch({
            type: reducerCases.SET_CURRENT_CHAT,
            chat: chat   // hoặc chat.chat nếu cần truy cập vào các thuộc tính khác của chat
        });
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                setGroupList(groups ? groups : [])

            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();

    }, [groups]);

    // Tạo một mảng mới chứa tin nhắn cuối cùng từ mỗi người gửi có senderID khác userInfo?.id


    // Nếu bạn muốn trả về newLastMessages, hãy thay đổi thành:

    return (
        <div className="tw-mt-16">
            {groupList.map((chat, index) => {
                // Lấy tin nhắn cuối cùng từ mỗi người gửi có senderID khác 1
                const lastMessage = chat.messages.slice().reverse().find((contentItem) => contentItem.senderID !== userInfo?.id);

                if (lastMessage && chat.name) {
                    const convertName = () => {
                        if (chat.type == "private") {
                            const splitName = chat.name.split("/");
                            const displayName = splitName[0] !== userInfo?.display_name ? splitName[0] : splitName[1];

                            return displayName
                        }
                        return chat.name
                    }
                    return (
                        <Stack
                            key={index}
                            onClick={() => handleSelectChat(chat)}
                            direction="horizontal"
                            gap={3}
                            className="user-card align-items-center p-2 justify-content-between"
                            role="button"
                        >
                            <div className="d-flex">
                                <div className="m-2">
                                    <img src={`https://lh3.googleusercontent.com/a/ACg8ocK1LMjQE59_kT4mNFmgxs6CmqzZ24lqR2bJ4jHjgB6yiW4=s96-c`} className="me-2 tw-h-16 tw-w-16 tw-rounded-full" alt="Avatar" />
                                </div>
                                <div className="text-content">
                                    <div className="name">{convertName()}</div>
                                    {lastMessage.type == "image" ? `Friend sent a image for you` : <div className="text">{lastMessage.content}</div>}
                                </div>
                            </div>
                            <div className="d-flex flex-column align-items-end">
                                <div className="date">{calculateTime(lastMessage.timestamp)}</div>
                                <div className="this-user-notifications">{1}</div>
                                <span className="user-online mt-1"></span>
                            </div>
                        </Stack>
                    );
                }
            })}
        </div>
    );
};

export default UserChat;
