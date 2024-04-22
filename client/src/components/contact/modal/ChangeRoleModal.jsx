import axios from "axios";
import { Button, Form, Modal } from "react-bootstrap";
import { useStateProvider } from "../../../context/StateContext";
import { useEffect, useState } from "react";
import { GET_ALL_USER } from "../../../router/ApiRoutes";

const ChangeRoleModal = ({
  showFormChangeRole,
  handleCloseChangeRoleModal,
  showFormLeaveConversation,
  handleLeaveConversation,
  handleLeaveGroup,
  setSelectChangeRole,
}) => {
  const [selectedOption, setSelectedOption] = useState(null);
  const [friendList, setFriendList] = useState([]);
  const [{ userInfo, currentChat, socket }] = useStateProvider();

  const confirmLeaveGroup = () => {
    handleCloseChangeRoleModal(); // Đóng modal "Change Role"
    handleLeaveGroup(); // Xử lý việc rời khỏi nhóm
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get(GET_ALL_USER);
        setFriendList(data.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const filteredFriendList = friendList.filter((friend) => {
    return currentChat.participants.some(
      (id) => id === friend.id && id !== userInfo?.id
    );
  });

  const handleSelectAndContinue = () => {
    setSelectChangeRole(selectedOption);
    handleLeaveConversation(); // Hiển thị modal "Leave Conversation"
    handleCloseChangeRoleModal(); // Đóng modal "Change Role"
  };

  return (
    <div>
      <Modal
        show={showFormChangeRole}
        onHide={handleCloseChangeRoleModal}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title style={{ fontSize: "18px" }}>
            Select a new group owner before leaving
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div
            style={{
              maxHeight: "350px",
              overflowY: "scroll",
              minHeight: "350px",
            }}
          >
            {filteredFriendList.map((member, index) => (
              <div
                key={index}
                className="tw-flex tw-items-center tw-py-5 tw-px-2 tw-border-b-2 tw-border-gray-200"
              >
                <Form.Check
                  type="radio"
                  name="removeOption"
                  id={`removeWithPeople_${index}`}
                  onChange={() => setSelectedOption(member)}
                  style={{ marginRight: "10px" }}
                />
                <img
                  src={member.profilePicture}
                  width={30}
                  height={30}
                  className="tw-rounded-full"
                  alt="Profile"
                />
                <span className="tw-ml-10 tw-font-semibold">
                  {member.display_name}
                </span>
              </div>
            ))}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseChangeRoleModal}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleSelectAndContinue}
            disabled={!selectedOption}
          >
            Select and continue
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ChangeRoleModal;
