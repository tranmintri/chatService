import React, { useState } from "react";
import { Modal, Button } from "react-bootstrap";
import { CiEdit } from "react-icons/ci";
import { toast } from "react-toastify";
import { CHAT_API } from "../../../router/ApiRoutes";
import axios from "axios";

const ModalGroupInfo = ({ showModalInfo, toggleModalInfo, chat }) => {
  const [newImage, setNewImage] = useState(chat.picture);
  const [newName, setNewName] = useState(chat.name);
  const [file, setFile] = useState(null);

  const handleGroupAvatarChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onload = () => {
        setNewImage(reader.result);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleNameChange = (event) => {
    setNewName(event.target.value);
  };

  const handleClose = () => {
    setNewImage(chat.picture);
    setNewName(chat.name);
    toggleModalInfo();
  };

  const handleConfirm = async () => {
    const formData = new FormData();
    if (newImage) {
      formData.append("image", file);
    }
    formData.append("name", newName);

    // Bây giờ bạn có thể gửi formData đến server hoặc thực hiện các hành động khác với nó

    const response = await axios.put(
      CHAT_API + chat.chatId + "/update-chat-info",
      formData
    );
    toast("Changes confirmed!");
    toggleModalInfo();
  };

  return (
    <Modal
      show={showModalInfo}
      onHide={handleClose}
      dialogClassName="modal-dialog-centered"
    >
      <Modal.Header closeButton>
        <Modal.Title>
          <span className="tw-text-[20px]">Change group information</span>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="tw-flex tw-justify-center">
          <img
            src={newImage}
            className="tw-w-24 tw-h-24 tw-rounded-full"
            alt="Group Avatar"
          />
          <div>
            <label htmlFor="input-choose-avatar">
              <CiEdit className="tw-cursor-pointer" size={20} />
            </label>
            <input
              type="file"
              id="input-choose-avatar"
              accept="image/*"
              className="tw-text-dark-2"
              onChange={handleGroupAvatarChange}
              style={{ display: "none" }}
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
            Are you sure you want to change the group information? Confirming
            will update the group information.
          </span>
        </div>
        <div className="tw-flex tw-justify-center">
          <input
            type="text"
            placeholder="Enter new group name"
            size={45}
            className="tw-border tw-px-2 tw-py-1 tw-rounded"
            value={newName}
            onChange={handleNameChange}
          />
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
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
