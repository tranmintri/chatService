import { Button, Modal } from "react-bootstrap";
import { useStateProvider } from "../../../context/StateContext";
import { CHAT_API, GET_CHAT_BY_PARTICIPANTS } from "../../../router/ApiRoutes";
import { reducerCases } from "../../../context/constants";
import axios from "axios";

const ModalLeaveConversation = ({
  showFormLeaveConversation,
  handleLeaveConversation,
  selectChangeRole,
}) => {
  const [{ userInfo, currentChat, socket, groups }, dispatch] =
    useStateProvider();
  const onLeaveGroup = async () => {
    if (selectChangeRole) {
      try {
        // Sử dụng template literals để tạo URL một cách rõ ràng và dễ đọc hơn
        const res = await axios.put(
          `${CHAT_API}${currentChat.chatId}/update-role/${selectChangeRole.id}`
        );
        // Cập nhật managerId trong currentChat
        currentChat.managerId = selectChangeRole.id;
        // Sử dụng dispatch để cập nhật state của currentChat
        dispatch({
          type: reducerCases.SET_CURRENT_CHAT,
          chat: currentChat,
        });
      } catch (error) {
        console.log(error);
      }
    }
    if (
      currentChat.participants.length > 2 &&
      currentChat.managerId !== userInfo?.id
    ) {
      const postData = {
        chatId: currentChat.chatId,
        chatParticipants: currentChat.participants,
        userId: userInfo.id,
        user_Name: userInfo.display_name,
        managerId: currentChat.managerId,
      };

      try {
        socket.current.emit("leave-group", postData);
        alert("You have left the group");
        const { data } = await axios.get(
          GET_CHAT_BY_PARTICIPANTS + userInfo?.id
        );
        if (data) {
          dispatch({
            type: reducerCases.SET_ALL_GROUP,
            groups: data.filter((d) => d.chatId !== currentChat.chatId),
          });
        }
        dispatch({
          type: reducerCases.SET_CURRENT_CHAT,
          chat: undefined,
        });
      } catch (error) {
        console.error("Error leaving group:", error);
      }
    } else {
      socket.current.emit("request-disband-the-group", {
        currentChat: currentChat,
        userInfo: userInfo,
      });
      try {
        // Sử dụng template literals để tạo URL một cách rõ ràng và dễ đọc hơn
        const res = await axios.delete(`${CHAT_API}${currentChat.chatId}`);
        // Cập nhật managerId trong currentChat
        const { data } = await axios.get(
          GET_CHAT_BY_PARTICIPANTS + userInfo?.id
        );
        if (data) {
          dispatch({
            type: reducerCases.SET_ALL_GROUP,
            groups: data.filter((d) => d.chatId !== currentChat.chatId),
          });
        }
        dispatch({
          type: reducerCases.SET_CURRENT_CHAT,
          chat: undefined,
        });
      } catch (error) {
        console.log(error);
      }
    }
  };

  const confirmLeaveGroup = () => {
    onLeaveGroup(); // Xử lý việc rời khỏi nhóm
    handleLeaveConversation(); // Đóng modal "Leave Conversation"
  };

  return (
    <Modal
      show={showFormLeaveConversation}
      onHide={handleLeaveConversation}
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title style={{ fontSize: "18px" }}>
          Leave this conversation?
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <span className="tw-text-gray-500">
          You won't be able to see messages in this group after leaving.
        </span>
        <div className="tw-w-full tw-flex tw-justify-center tw-items-center tw-mt-4">
          <div className="tw-w-11/12 tw-bg-slate-200 tw-min-h-24 tw-rounded-lg tw-px-4   tw-py-4">
            <span className="tw-font-semibold ">Leave group silently</span>
            <span className="tw-text-wrap tw-text-gray-500">
              <br />
              No one knows you're leaving the group.
            </span>
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleLeaveConversation}>
          Close
        </Button>
        <Button variant="danger" onClick={confirmLeaveGroup}>
          Leave Group
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalLeaveConversation;
