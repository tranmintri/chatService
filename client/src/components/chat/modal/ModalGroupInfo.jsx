import React, { useState } from "react";
import { Modal, Button } from "react-bootstrap";
import { CiEdit } from "react-icons/ci";
import { toast } from "react-toastify";

const ModalGroupInfo = ({ showModalInfo, toggleModalInfo, chat }) => {
  const [newImage, setNewImage] = useState(null);
  const [file, setFile] = useState();
  const handleGroupAvatarChange = (event) => {
    const file = event.target?.files?.length > 0 ? event.target.files[0] : null;
    if (file) {
      setFile(file);
      const reader = new FileReader();
      reader.onload = () => {
        setNewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleConfirm = () => {
    toast("dooir teen thanhf coong!");
  };
  return (
    <Modal
      show={showModalInfo}
      onHide={toggleModalInfo}
      dialogClassName="modal-dialog-centered"
    >
      <Modal.Header closeButton>
        <Modal.Title>
          <span className="tw-text-[20px]">Change group name</span>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="tw-flex tw-justify-center">
          <img
            src={newImage || chat.picture}
            className="tw-w-24 tw-h-24 tw-rounded-full"
            alt="Group Avatar"
          />
          <div>
            <label htmlFor="input-choose-avatar">
              <CiEdit className="tw-cursor-pointer" size={20} />
            </label>
            <input
              type="file"
              hidden
              id="input-choose-avatar"
              className="tw-text-dark-2"
              onChange={handleGroupAvatarChange}
            />
          </div>
        </div>
        <div className="tw-flex tw-justify-center">
          <span className="text-center tw-text-[18px] tw-font-bold">
            {chat.name}
          </span>
        </div>
        <div className="tw-flex tw-justify-center">
          <span className="text-center tw-text-[15px] tw-mb-2">
            Are you sure you want to rename the group, when confirming the new
            group name will be visible to all members.
          </span>
        </div>
        <div className="tw-flex tw-justify-center">
          <input
            type="text"
            placeholder="Enter new group name"
            size={45}
            className="tw-border tw-px-2 tw-py-1 tw-rounded"
          />
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={toggleModalInfo}>
          Close
        </Button>
        <Button variant="primary" onClick={handleConfirm}>
          Confirm
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalGroupInfo;
