import React from "react";
import { Modal, Button } from "react-bootstrap";
import { CiEdit } from "react-icons/ci";

const ModalReactionInfo = ({ showModalInfo, handleCloseModal }) => {
  const handleConfirm = () => {
    window.alert("info!");
  };
  return (
    <Modal
      show={showModalInfo}
      onHide={handleCloseModal}
      dialogClassName="modal-dialog-centered"
      className="tw-min-w-[50vh]"
    >
      <Modal.Header closeButton>
        <Modal.Title>
          <span className="tw-text-[20px] tw-min-w-[50vh]">Reaction</span>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className=" tw-min-w-[50vh]">
        <div className="tw-max-h-[50vh] tw-min-h-[50vh] tw-min-w-[50vh] tw-flex tw-w-full">
          <div className="tw-bg-red-400 tw-h-full tw-max-h-[50vh] tw-min-h-[50vh] tw-w-4/12 tw-overflow-auto custom-scrollbar">
            All
          </div>
          <div className="tw-bg-green-400 tw-h-full tw-max-h-[50vh] tw-min-h-[50vh] tw-w-8/12    tw-overflow-auto custom-scrollbar">
            b
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleCloseModal}>
          Close
        </Button>
        <Button variant="primary" onClick={handleConfirm}>
          Confirm
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalReactionInfo;
