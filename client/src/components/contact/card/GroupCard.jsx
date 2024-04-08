import React, { useEffect, useState } from 'react';
import { MdDelete } from "react-icons/md";
import { AiOutlineMessage } from "react-icons/ai";
import { useStateProvider } from '../../../context/StateContext';
import { reducerCases } from '../../../context/constants';
import axios from 'axios';
import { CHAT_API } from '../../../router/ApiRoutes';

const GroupCard = ({ chat }) => {
    const [{ userInfo, contactsPage, currentChat, currentChatUser }, dispatch] = useStateProvider()

    const DeleteFriend = () => {
        console.log("delete")
    }
    const StartChat = async () => {

        dispatch({
            type: reducerCases.SET_ALL_CONTACTS_PAGE, contactsPage: false
        })


        try {
            console.log(chat.chatId)
            const { data } = await axios.get(CHAT_API + chat.chatId)
            console.log(data)
            dispatch({
                type: reducerCases.SET_CURRENT_CHAT,
                chat: data   // hoặc chat.chat nếu cần truy cập vào các thuộc tính khác của chat
            });
        } catch (error) {
            console.log(error)
        }
    }

    const convertName = () => {
        if (chat.type == "private") {
            const splitName = chat.name.split("/");
            const displayName = splitName[0] !== userInfo?.display_name ? splitName[0] : splitName[1];

            return displayName
        }

        return chat.name
    }

    return (
        <div className='tw-flex tw-items-center tw-w-full tw-border-b-2 hover:tw-bg-slate-100 tw-p-2 tw-text-black'>
            <div>
                <img src={chat?.avatar} className='tw-w-14' />
            </div>
            <div className="tw-flex-1 tw-ml-10">
                <span className='tw-font-semibold tw-text-xl'>{convertName()}</span>
            </div>
            <button onClick={StartChat}>
                <AiOutlineMessage className='tw-text-2xl tw-flex tw-items-end tw-mr-4' />
            </button>
            <button onClick={DeleteFriend}>
                <MdDelete className='tw-text-2xl tw-flex tw-items-end' />
            </button>
        </div>
    );
}

export default GroupCard;
