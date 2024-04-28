import React from "react";
import { calculateTime } from "../../../utils/CalculateTime";
import { useStateProvider } from "../../../context/StateContext";

const MessageResultCard = ({ searchValue, messages, searchStartDate, searchEndDate, filterName }) => {
  const [
    { currentChat },
    dispatch
  ] = useStateProvider();
  // Filter messages based on search value
  const filteredMessagesByContent = messages.filter(message =>
    message.content.toLowerCase().includes(searchValue.toLowerCase())
  );
  const filteredMessagesByName = currentChat.messages.filter(message =>
    message.senderId.includes(filterName.id)
  );
  // Filter messages based on search date range
  const filterMessagesByTimeRange = () => {
    if (!searchStartDate || !searchEndDate) return [];
    // Thêm phần thời gian vào ngày bắt đầu và kết thúc
    const startTime = new Date(searchStartDate).setHours(0, 0, 0, 0);
    const endTime = new Date(searchEndDate).setHours(23, 59, 59, 999);
    return messages.filter(message => {
      const messageDate = new Date(message.timestamp);
      return messageDate >= startTime && messageDate <= endTime;
    });
  };

  // Apply date range filter
  const filteredMessagesByTime = filterMessagesByTimeRange();

  // Determine the filtered messages based on whether there is search value or date range selected
  let filteredMessages = [];
  if (searchValue) {
    filteredMessages = filteredMessagesByContent;
  } else if (searchStartDate && searchEndDate) {
    filteredMessages = filteredMessagesByTime;
  } else if (filteredMessagesByName)
    filteredMessages = filteredMessagesByName
  // Render the result only if there are filtered messages
  return (
    <div className="tw-w-full tw-overflow-y-auto">
      {filteredMessages.length > 0 && filteredMessages.map((message, index) => (
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
