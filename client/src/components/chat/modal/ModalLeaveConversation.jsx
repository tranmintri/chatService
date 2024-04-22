import { Button, Modal } from "react-bootstrap";

const ModalLeaveConversation = ({
  showFormLeaveConversation,
  handleLeaveConversation,
  handleLeaveGroup,
}) => {
  const confirmLeaveGroup = () => {
    handleLeaveGroup(); // Xử lý việc rời khỏi nhóm
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
