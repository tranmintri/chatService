import React from "react";
import { calculateTime } from "../../../utils/CalculateTime";

const MessageResultCard = ({ searchValue, messages }) => {
  const filteredMessages = messages.filter(message =>
    message.content.toLowerCase().includes(searchValue.toLowerCase())
  );

  return (
    <div className="tw-w-full tw-overflow-y-auto">
      {searchValue && filteredMessages.length > 0 && filteredMessages.map((message, index) => (
        // Sử dụng điều kiện để chỉ hiển thị tin nhắn có loại là "share"
        (message.type.includes("text") || message.type.includes("reply")) && (
          <div key={index} className="tw-pl-4 tw-flex tw-justify-start tw-items-center tw-border-b-2 tw-border-slate-200 tw-break-words">
            <div className="tw-w-2/12">
              <img
                className=""
                src={message.senderPicture}
                alt=""
                width={50}
                height={50}
              />
            </div>
            <div className="tw-w-7/12 tw-mt-3 tw-text-sm tw-pl-2">
              <p className="tw-font-bold tw-text-[18px] ">{message.senderName}</p>
              <p>{message.content}</p>
            </div>
            <div className="tw-w-3/12 tw-content-end tw-text-sm">
              <p>{calculateTime(message.timestamp)}</p>
            </div>
          </div>
        )
      ))}
    </div>
  );
};

export default MessageResultCard;
