import axios from "axios";
import { useState } from "react";
import { Button, Form, ListGroup, Modal } from "react-bootstrap";
import { CHAT_API, GET_ALL_USER } from "../../../router/ApiRoutes";
import { useStateProvider } from "../../../context/StateContext";
import { reducerCases } from "../../../context/constants";
import { useEffect } from "react";
import { toast } from "react-toastify";
import xls from "../../../assets/xls.png";
import xlsx from "../../../assets/xlsx.png";
import txt from "../../../assets/txt.png";
import pdf from "../../../assets/pdf.png";
import doc from "../../../assets/doc.png";
import docx from "../../../assets/docx.png";
import ppt from "../../../assets/ppt.png";
import ChatImage from "../card/ChatImage";

const ForwardModal = ({ showModal, handleCloseModal, shareMessage }) => {
  const [{ userInfo, groups, currentChat }, dispatch] = useStateProvider();
  const [selectedGroups, setSelectedGroups] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [friendList, setFriendList] = useState([]);
  const handleGroupSelect = (groupId) => {
    setSelectedGroups((prevSelectedGroups) => {
      const isSelected = prevSelectedGroups.includes(groupId);
      return isSelected
        ? prevSelectedGroups.filter((id) => id !== groupId)
        : [...prevSelectedGroups, groupId];
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get(GET_ALL_USER + userInfo?.id);

        setFriendList(data.data?.friends);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleSearchTermChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleShareMessage = async () => {
    const shareData = {
      selectedGroups: selectedGroups,
      shareMessage: {
        type: "text", // Đây là trường type của newMessage
        senderId: userInfo?.id,
        senderName: userInfo?.display_name,
        senderPicture: userInfo?.avatar,
        content: shareMessage.content,
        timestamp: Date.now(),
        status: "sent",
      },
    };

    const { data } = await axios.post(CHAT_API + "/share-message", shareData);
    toast.success("Share successfully!");
    setSelectedGroups([]);
    setSearchTerm("");
    handleCloseModal();
  };
  const convertName = (chat) => {
    if (chat.type == "private") {
      const splitName = chat.name.split("/");
      const displayName =
        splitName[0] !== userInfo?.display_name ? splitName[0] : splitName[1];

      return displayName;
    }
    return chat.name;
  };
  const convertImage = (chat) => {
    if (chat.type == "private") {
      const splitName = chat.picture.split("|");
      const friendPicture =
        splitName[0] !== userInfo?.avatar ? splitName[0] : splitName[1];

      return friendPicture;
    }
    return chat.picture;
  };

  return (
    <Modal show={showModal} onHide={handleCloseModal} centered>
      <Modal.Header closeButton>
        <Modal.Title style={{ fontSize: "20px" }}>Share</Modal.Title>
      </Modal.Header>
      <Modal.Body className="tw-border-b-2 ">
        <Form>
          <Form.Group controlId="formSearchFriends" className="mb-3">
            <Form.Control
              type="text"
              placeholder="Search friends"
              value={searchTerm}
              onChange={handleSearchTermChange}
            />
          </Form.Group>
          <div
            style={{
              maxHeight: "300px",
              minHeight: "200px",
              overflowY: "scroll",
            }}
          >
            {/* Check if friendList is defined */}
            {groups && groups.length > 0 ? (
              <ListGroup className="tw-max-h-[30vh]">
                {groups.map((group) => (
                  <ListGroup.Item
                    className="mb-2 d-flex text-center align-items-center "
                    key={group.chatId}
                    onClick={() => handleGroupSelect(group.chatId)}
                  >
                    <img
                      src={convertImage(group)}
                      className="me-3 tw-size-12"
                      style={{ borderRadius: "50%" }}
                      alt="Avatar"
                    />
                    <Form.Check
                      type="checkbox"
                      id={`group-checkbox-${group.chatId}`}
                      label={convertName(group)}
                      checked={selectedGroups.includes(group.chatId)}
                    />
                  </ListGroup.Item>
                ))}
              </ListGroup>
            ) : (
              <p>No friends in your list.</p>
            )}
          </div>
        </Form>
      </Modal.Body>
      <div className="tw-px-5 tw-py-3 ">
        <span className="tw-font-semibold">Content</span>
        <div className="tw-p-3 tw-flex tw-justify-between">
          <div className="tw-bg-slate-100 tw-flex">
            {shareMessage.type == "files" ? (
              <div>
                {shareMessage.content &&
                  shareMessage.content.split("|").map((content, index) => {
                    const lastSlashIndex = content.split("?");
                    const filenameWithExtension = lastSlashIndex[0];

                    const lastSlashIndex1 = filenameWithExtension.split("/");
                    const filenameWithExtension1 =
                      lastSlashIndex1[lastSlashIndex1.length - 1];

                    const lastDotIndex =
                      filenameWithExtension1.lastIndexOf(".");
                    const filename = filenameWithExtension1.substring(
                      0,
                      lastDotIndex
                    );
                    const extension =
                      filenameWithExtension1.substring(lastDotIndex);
                    return (
                      <div className="tw-flex" key={index}>
                        {content.startsWith("https://") ? (
                          <div className="tw-flex tw-justify-start tw-mb-3  tw-w-full tw-p-3 tw-rounded-lg">
                            <div className="tw-mr-3 ">
                              {extension === ".doc" && (
                                <img
                                  src={doc}
                                  alt={`Document ${index + 1}`}
                                  style={{
                                    width: "32px",
                                    height: "32px",
                                  }}
                                />
                              )}
                              {extension === ".xls" && (
                                <img
                                  src={xls}
                                  alt={`Document ${index + 1}`}
                                  style={{
                                    width: "32px",
                                    height: "32px",
                                  }}
                                />
                              )}
                              {extension === ".xlsx" && (
                                <img
                                  src={xlsx}
                                  alt={`Document ${index + 1}`}
                                  style={{
                                    width: "32px",
                                    height: "32px",
                                  }}
                                />
                              )}
                              {extension === ".pdf" && (
                                <img
                                  src={pdf}
                                  alt={`Document ${index + 1}`}
                                  style={{
                                    width: "32px",
                                    height: "32px",
                                  }}
                                />
                              )}
                              {extension === ".txt" && (
                                <img
                                  src={txt}
                                  alt={`Document ${index + 1}`}
                                  style={{
                                    width: "32px",
                                    height: "32px",
                                  }}
                                />
                              )}
                              {extension === ".docx" && (
                                <img
                                  src={docx}
                                  alt={`Document ${index + 1}`}
                                  style={{
                                    width: "32px",
                                    height: "32px",
                                  }}
                                />
                              )}
                              {extension === ".pptx" && (
                                <img
                                  src={ppt}
                                  alt={`Document ${index + 1}`}
                                  style={{
                                    width: "32px",
                                    height: "32px",
                                  }}
                                />
                              )}
                            </div>
                            <span>
                              <a
                                href={content}
                                download={filename + extension}
                                style={{
                                  textDecoration: "none",
                                  color: "black",
                                }}
                              >
                                {decodeURIComponent(decodeURI(filename))}
                              </a>
                            </span>
                          </div>
                        ) : (
                          <span>{content}</span>
                        )}
                      </div>
                    );
                  })}
              </div>
            ) : (
              <div className="">
                {shareMessage.type == "image" ? (
                  <div className="tw-flex tw-flex-wrap tw-max-h-[20vh] tw-overflow-auto custom-scrollbar tw-px-2 tw-py-3">
                    {shareMessage.content &&
                      shareMessage.content.split("|").map((content, index) => (
                        <div className="tw-flex" key={index}>
                          {content.startsWith("https://") ? (
                            <img
                              src={content}
                              width={80}
                              height={80}
                              className="tw-mr-3"
                            />
                          ) : (
                            <span>{content}</span>
                          )}
                        </div>
                      ))}
                  </div>
                ) : (
                  <div>{shareMessage.content}</div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleCloseModal}>
          Cancel
        </Button>
        <Button
          variant="primary"
          onClick={handleShareMessage}
          disabled={selectedGroups.length <= 0}
        >
          Share
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ForwardModal;
