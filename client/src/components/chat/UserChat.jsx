import { Stack } from "react-bootstrap";
import avatar from "../../assets/2Q.png"
import { useState } from "react";
import { useStateProvider } from "../../context/StateContext";
import { calculateTime } from "../../utils/CalculateTime";
import { reducerCases } from "../../context/constants";

const UserChat = ({ chats }) => {
    console.log(chats)
    const [{ userInfo }, dispatch] = useStateProvider();

    const handleSelectChat = (chat) => {
        dispatch({
            type: reducerCases.SET_CURRENT_CHAT,
            chat: chat   // hoặc chat.chat nếu cần truy cập vào các thuộc tính khác của chat
        });
    };

    return (
        <div className="tw-mt-20">
            {chats.map((chat, index) => {
                // Lấy tin nhắn cuối cùng từ mỗi người gửi có senderID khác 1
                const lastMessage = chat.messages.slice().reverse().find((contentItem) => contentItem.senderID !== userInfo?.id);

                if (lastMessage) {
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
                                    <div className="name">{chat.name}</div>
                                    <div className="text">{lastMessage.content}</div>
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
