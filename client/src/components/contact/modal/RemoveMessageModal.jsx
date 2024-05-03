import axios from "axios";
import { useState } from "react";
import { Button, Form, ListGroup, Modal } from "react-bootstrap";
import { useStateProvider } from "../../../context/StateContext";
import { reducerCases } from "../../../context/constants";
import { useEffect } from "react";
import { toast } from "react-toastify";
import { CHAT_API } from "../../../router/ApiRoutes";

const RemoveMessageModal = ({ showModal, handleCloseModal, removeMessage }) => {
  const [selectedOption, setSelectedOption] = useState(null);
  const [{ currentChat, userInfo, messages }, dispatch] = useStateProvider();
  const handleRemove = async () => {
    if (selectedOption === 0) {
      await axios.delete(
        CHAT_API + currentChat.chatId + "/messages/" + removeMessage.messageId
      );
      const updatedMessages = messages.filter(
        (msg) => msg.messageId !== removeMessage.messageId
      );

      // Dispatch action to update Redux state with the updated messages array
      dispatch({ type: reducerCases.SET_MESSAGES, messages: updatedMessages });
      handleCloseModal();
      return;
    }
    if (selectedOption === 1) {
      await axios.put(
        CHAT_API + currentChat.chatId + "/messages/" + removeMessage.messageId
      );
      handleCloseModal();
      const updatedMessages = [...messages];

      // Find the message by messageId and update its status
      const messageIndex = updatedMessages.findIndex(
        (msg) => msg.messageId === removeMessage.messageId
      );
      if (messageIndex !== -1) {
        // Update the status of the message at the found index
        updatedMessages[messageIndex] = {
          ...updatedMessages[messageIndex],
          status: "removed",
        };

        // Dispatch action to update Redux state with the updated messages array
        dispatch({
          type: reducerCases.SET_MESSAGES,
          messages: updatedMessages,
        });

        toast.success("Message status updated.");
      } else {
        toast.error("Message not found.");
      }
      return;
    }
    toast("Please select an option before removing.");
  };
  const isTimestampWithinOneMinute = (timestamp) => {
    const now = Date.now();
    const oneMinuteInMillis = 60 * 1000; // 1 phút = 60 giây * 1000 milliseconds

    // Kiểm tra nếu timestamp + 1 phút lớn hơn thời điểm hiện tại thì trả về true, ngược lại trả về false
    return timestamp + oneMinuteInMillis > now;
  };
  return (
    <Modal
      show={showModal}
      onHide={handleCloseModal}
      backdrop="static"
      centered
    >
      <Modal.Header closeButton style={{ alignItems: "center" }}>
        <Modal.Title style={{ fontSize: "17px" }}>
          Who do you want to remove this message from ?
        </Modal.Title>
      </Modal.Header>
      <Modal.Body style={{ background: "#f4f4f4" }}>
        {isTimestampWithinOneMinute(removeMessage.timestamp) &&
          removeMessage.senderId == userInfo?.id && (
            <div className="tw-border-b-2 tw-mb-2">
              <Form.Check
                type="radio"
                label={<strong>Remove with people</strong>}
                name="removeOption"
                id="removeWithPeople"
                onChange={() => setSelectedOption(0)}
              />
              <p className="tw-ml-6">
                This option will remove the message for everyone in the
                conversation.
              </p>
            </div>
          )}
        <Form.Check
          type="radio"
          label={<strong>Remove at your side</strong>}
          name="removeOption"
          id="removeAtYourSide"
          onChange={() => setSelectedOption(1)}
        />
        <p className="tw-ml-6">
          This option will remove the message only for you.
        </p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleCloseModal}>
          Close
        </Button>
        <Button variant="primary" onClick={handleRemove}>
          Remove
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default RemoveMessageModal;
