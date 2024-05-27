import { useEffect, useState } from "react";
import { useStateProvider } from "../../context/StateContext";
import { FaRegTrashCan } from "react-icons/fa6";
import { MdLogout } from "react-icons/md";
import { GrGroup } from "react-icons/gr";
import ModalGroupMembers from "./modal/ModalGroupMembers";
import { CiEdit } from "react-icons/ci";
import ModalGroupInfo from "./modal/ModalGroupInfo";
import xls from "../../assets/xls.png";
import xlsx from "../../assets/xlsx.png";
import txt from "../../assets/txt.png";
import pdf from "../../assets/pdf.png";
import doc from "../../assets/doc.png";
import docx from "../../assets/docx.png";
import ppt from "../../assets/ppt.png";

import { AiOutlineUserAdd } from "react-icons/ai";
import ModalAddMember from "./modal/ModalAddMember";
import ChangeRoleModal from "../contact/modal/ChangeRoleModal";

import ModalLeaveConversation from "./modal/ModalLeaveConversation";
import ChatImage from "../contact/card/ChatImage";

const ConversationInfo = ({ chat }) => {
  const [{ userInfo, currentChat }, dispatch] = useStateProvider();
  const [showAllImage, setShowAllImage] = useState(false);
  const [showModalMembers, setShowModalMembers] = useState(false);
  const [showModalInfo, setShowModalInfo] = useState(false);
  const [menberCount, setMemberCount] = useState(0);

  const [showModalAddMember, setShowModalAddMember] = useState(false);
  const [showFormChangeRole, setShowFormChangeRole] = useState(false);
  const [showFormLeaveConversation, setShowLeaveConversation] = useState(false);
  const [selectChangeRole, setSelectChangeRole] = useState();
  const [showModalDeleteChat, setShowModalDeleteChat] = useState(false);
  const handleLeaveConversation = () => {
    setShowLeaveConversation(!showFormLeaveConversation);
  };
  
  const handleShowLeaveConversation = () => {
    // if (currentChat.participants.length == 2)
    setShowLeaveConversation(!showFormLeaveConversation);
  };
  const handleCloseChangeRoleModal = () => {
    setShowFormChangeRole(!showFormChangeRole);
  };
  const handleShowChangeRole = () => setShowFormChangeRole(true);

  const handleCloseModalAddMember = () => {
    setShowModalAddMember(!showModalAddMember);
  };
  const toggleModalInfo = () => {
    setShowModalInfo(!showModalInfo);
  };

  useEffect(() => {
    setMemberCount(currentChat.participants.length);
  }, [currentChat.participants]);

  const toggleModalMembers = () => {
    setShowModalMembers(!showModalMembers);
  };

  const convertName = () => {
    if (chat.type == "private") {
      const splitName = chat.name.split("/");
      const displayName =
        splitName[0] !== userInfo?.display_name ? splitName[0] : splitName[1];

      return displayName;
    }
    return chat.name;
  };
  const onDeleteHistory = () => {
    window.alert("xoas ruif nef");
  };
  const onDeleteChat = () => {
    alert("xóa chat");
    setShowModalDeleteChat(true);
  };

  const splitImage = () => {
    let url = "";
    if (currentChat.messages && Array.isArray(currentChat.messages)) {
      currentChat.messages.forEach((element) => {
        if (element.type.includes("image")) {
          url += element.content.toString() + "|"; // Thêm "|" để phân biệt các URL
        }
      });
    }
    const urlSplit = url.split("|").filter((url) => url.startsWith("https://"));

    return urlSplit;
  };
  const convertImage = () => {
    if (chat.type == "private") {
      const splitName = chat.picture.split("|");
      const friendPicture =
        splitName[0] !== userInfo?.avatar ? splitName[0] : splitName[1];

      return friendPicture;
    }
    return chat.picture;
  };
  const splitFile = () => {
    let url = "";
    if (currentChat.messages && Array.isArray(currentChat.messages)) {
      currentChat.messages.forEach((element) => {
        if (element.type.includes("files")) {
          url += element.content.toString() + "|"; // Thêm "|" để phân biệt các URL
        }
      });
    }
    const urlSplit = url.split("|").filter((url) => url.startsWith("https://"));

    return urlSplit;
  };

  return (
    <div className="tw-w-full tw-h-full">
      <div className=" tw-bg-gray-50 tw-h-full">
        <p className="tw-text-center tw-border-b tw-font-bold m-0 tw-text-[22px] tw-max-h-[5vh]">
          Conversation Info
        </p>
        <div style={{ height: "95vh" }}>
          <div className=" border-bottom d-flex justify-content-center align-items-center tw-min-h-[27.5vh]">
            <div className="align-items-center">
              <img
                src={convertImage()}
                className="mx-auto mb-3 tw-h-20 tw-w-20 tw-rounded-full"
                alt="Group Avatar"
              />
              <div className="tw-flex tw-justify-center tw-items-center tw-mb-3">
                <div className="fs-6 fw-bold tw-mr-2">
                  {convertName(chat.name)}
                </div>
                <div>
                  {currentChat.type === "public" && (
                    <CiEdit
                      className="tw-cursor-pointer tw-bg-gray-300 tw-p-1 tw-rounded-full"
                      size={25}
                      onClick={toggleModalInfo}
                    />
                  )}
                </div>
              </div>
              <ModalGroupInfo
                showModalInfo={showModalInfo}
                toggleModalInfo={toggleModalInfo}
                chat={currentChat}
              />
              <div className="tw-flex tw-justify-center tw-items-center">
                {currentChat.type == "public" && (
                  <div className="tw-flex tw-flex-col tw-items-center">
                    <AiOutlineUserAdd
                      className="tw-p-1 tw-bg-gray-200 tw-rounded-full tw-cursor-pointer tw-text-gray-500 tw-mb-2 tw-mt-2"
                      size={30}
                      onClick={handleCloseModalAddMember}
                    />
                    <ModalAddMember
                      showModalAddMember={showModalAddMember}
                      handleCloseModalAddMember={handleCloseModalAddMember}
                    />
                    <div className="tw-text-gray-500 tw-text-sm tw-mb-2">
                      <span>Add member</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="tw-overflow-y-auto tw-max-h-[67.5vh] custom-scrollbar">
            <div>
              {currentChat.type === "public" && (
                <div className="mb-2 tw-border-b tw-ml-2">
                  <span className="tw-font-bold tw-text-[18px]">
                    Member List
                  </span>
                  <button
                    className="tw-block tw-mt-2 tw-mx-auto tw-mb-4 underline hover:tw-bg-gray-200 tw-w-full"
                    style={{ height: "40px" }}
                    onClick={toggleModalMembers}
                  >
                    <div className="tw-flex  align-items-center">
                      <GrGroup size={20} />
                      <span className="tw-pl-5">{menberCount} members</span>
                    </div>
                  </button>
                  <ModalGroupMembers
                    showModalMembers={showModalMembers}
                    toggleModalMembers={toggleModalMembers}
                    members={currentChat.participants}
                  />
                </div>
              )}
            </div>
            <div className="mb-2 tw-border-b tw-ml-2">
              <span className="tw-font-bold tw-text-[18px] tw-mt-3">
                Photos / Videos
              </span>
              <div className="tw-flex tw-mt-3 tw-flex-wrap tw-pr-7 tw-min-h-[25vh] tw-max-h-[25vh] tw-overflow-auto custom-scrollbar">
                {splitImage().map((image, index) => (
                  <div
                    key={index}
                    className="w-full sm:w-1/2 md:w-1/2 lg:w-1/2 xl:w-1/2 px-4 mb-4 tw-overflow-auto tw-max-h-40 custom-scrollbar tw-cursor-pointer"
                  >
                    <ChatImage
                      imageUrl={image}
                      size={100}
                      alt="Image"
                      className="w-full h-auto tw-mx-auto "
                    />
                  </div>
                ))}
              </div>
            </div>
            <div className="mb-2 tw-border-b">
              <span className="tw-font-bold tw-text-[18px] tw-ml-2 tw-mt-3 ">
                Files
              </span>
              <ul className="tw-block tw-mt-10 tw-min-h-[30vh] tw-max-h-[30vh] tw-overflow-auto custom-scrollbar tw-pr-7">
                {splitFile().map((content, index) => {
                  const lastSlashIndex = content.split("?");
                  const filenameWithExtension = lastSlashIndex[0];

                  const lastSlashIndex1 = filenameWithExtension.split("/");
                  const filenameWithExtension1 =
                    lastSlashIndex1[lastSlashIndex1.length - 1];

                  const lastDotIndex = filenameWithExtension1.lastIndexOf(".");
                  const filename = filenameWithExtension1.substring(
                    0,
                    lastDotIndex
                  );
                  const extension =
                    filenameWithExtension1.substring(lastDotIndex);
                  return (
                    <div className="tw-flex" key={index}>
                      {content.startsWith("https://") ? (
                        <div className="tw-flex tw-justify-start tw-mb-3 tw-bg-blue-100 tw-w-full tw-p-3 tw-rounded-lg">
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
              </ul>
            </div>

            <div className="mb-2 tw-ml-2 ">
              {/* {currentChat.managerId == userInfo?.id && (
                <button
                  className="tw-block tw-mt-2 tw-mx-auto tw-mb-4 underline tw-w-full tw-cursor-pointer"
                  style={{ height: "40px", color: "red" }}
                >
                  <div
                    className="tw-flex  align-items-center"
                    onClick={() => onDeleteChat()}
                  >
                    <FaRegTrashCan size={20} color="red" />
                    <span className="tw-pl-5">Delete Chat</span>
                  </div>
                </button>
              )} */}
              {currentChat.type == "private" && (
                <button
                  onClick={onDeleteHistory}
                  className="tw-block tw-mt-2 tw-mx-auto tw-mb-4 underline tw-w-full"
                  style={{ height: "40px", color: "#b2b2b2" }}
                  disabled={true}
                >
                  <div className="tw-flex  align-items-center">
                    <FaRegTrashCan size={20} color="#b2b2b2" />
                    <span className="tw-pl-5">Delete History</span>
                  </div>
                </button>
              )}
              {currentChat.type === "public" && (
                <div>
                  <button
                    onClick={onDeleteHistory}
                    className="tw-block tw-mt-2 tw-mx-auto tw-mb-4 underline tw-w-full"
                    style={{ height: "40px", color: "#b2b2b2" }}
                    disabled={true}
                  >
                    <div className="tw-flex align-items-center">
                      <FaRegTrashCan size={20} color="#b2b2b2" />
                      <span className="tw-pl-5">Delete History</span>
                    </div>
                  </button>
                  {currentChat.managerId === userInfo?.id &&
                  currentChat.participants.length > 2 ? (
                    <button
                      onClick={handleShowChangeRole}
                      className="tw-block tw-mt-2 tw-mx-auto tw-mb-4 underline tw-w-full"
                      style={{ height: "40px", color: "red" }}
                    >
                      <div className="tw-flex align-items-center">
                        <MdLogout size={20} color="red" />
                        <span className="tw-pl-5">Leave Group</span>
                      </div>
                    </button>
                  ) : (
                    <button
                      onClick={handleShowLeaveConversation}
                      className="tw-block tw-mt-2 tw-mx-auto tw-mb-4 underline tw-w-full"
                      style={{ height: "40px", color: "red" }}
                    >
                      <div className="tw-flex align-items-center">
                        <MdLogout size={20} color="red" />
                        <span className="tw-pl-5">Leave Group</span>
                      </div>
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {showFormChangeRole && currentChat.managerId === userInfo?.id ? (
        <ChangeRoleModal
          showFormChangeRole={showFormChangeRole}
          handleCloseChangeRoleModal={handleCloseChangeRoleModal}
          showFormLeaveConversation={showFormLeaveConversation}
          handleLeaveConversation={handleLeaveConversation}
          setSelectChangeRole={setSelectChangeRole}
        />
      ) : (
        <ModalLeaveConversation
          showFormLeaveConversation={showFormLeaveConversation}
          handleLeaveConversation={handleLeaveConversation}
          selectChangeRole={selectChangeRole}
        />
      )}
    </div>
  );
};
export default ConversationInfo;
