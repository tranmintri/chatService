import { useEffect, useRef, useState } from "react";
import { Button, Modal } from "react-bootstrap";
import { BsThreeDots } from "react-icons/bs";
import { CHAT_API, GET_ALL_USER, NOTI_API } from "../../../router/ApiRoutes";
import axios from "axios";
import { useStateProvider } from "../../../context/StateContext";
import { HiMiniKey } from "react-icons/hi2";
import { reducerCases } from "../../../context/constants";
import { toast } from "react-toastify";

const ModalGroupMembers = ({
  showModalMembers,
  toggleModalMembers,
  members,
}) => {
  const [showOptions, setShowOptions] = useState({});
  const [selectedOptionPosition, setSelectedOptionPosition] = useState({});
  const [
    {
      userInfo,
      groups,
      currentChat,
      socket,
      friendList,
      socket2,
      sentInvitations,
      receivedInvitations,
    },
    dispatch,
  ] = useStateProvider();
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState([]);
  const [modalShow, setModalShow] = useState(false);
  const [currentMember, setCurrentMember] = useState(null);
  const filteredParticipants = user.filter((user) => {
    return members.some((id) => id === user.id);
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get(GET_ALL_USER);
        setUser(data.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleShowOptions = (index) => {
    setShowOptions((prevState) => ({
      ...prevState,
      [index]: !prevState[index],
    }));
  };

  const ref = useRef();

  const handleClickOutside = (event) => {
    if (ref.current && !ref.current.contains(event.target)) {
      setShowOptions({});
    }
  };
  const checkExistingInvitation = (postData) => {
    let existingSentInvitation = false;
    let existingReceivedInvitation = false;
    console.log(sentInvitations);

    if (sentInvitations) {
      existingSentInvitation = sentInvitations.some(
        (invitation) =>
          invitation.sender === postData.sender &&
          invitation.receiver === postData.receiver
      );
    }

    if (receivedInvitations) {
      existingReceivedInvitation = receivedInvitations.some(
        (invitation) =>
          invitation.sender === postData.receiver &&
          invitation.receiver === postData.sender
      );
    }

    return existingSentInvitation || existingReceivedInvitation;
  };

  const changeRole = async (member) => {
    try {
      // Sử dụng template literals để tạo URL một cách rõ ràng và dễ đọc hơn
      const res = await axios.put(
        `${CHAT_API}${currentChat.chatId}/update-role/${member.id}`
      );
      // Cập nhật managerId trong currentChat
      currentChat.managerId = member.id;
      // Sử dụng dispatch để cập nhật state của currentChat
      dispatch({
        type: reducerCases.SET_CURRENT_CHAT,
        chat: currentChat,
      });
      // Gỡ modal members
      toggleModalMembers();
      // Ẩn các options
      setShowOptions({});
    } catch (error) {
      console.log(error);
    }
  };

  const handleRemove = (member) => {
    setCurrentMember(member);
    setModalShow(true);
  };

  const confirmRemove = () => {
    removeOutGroup(currentMember);
    setModalShow(false);
  };
  const removeOutGroup = (member) => {
    toggleModalMembers();
    setShowOptions({});
    const postData = {
      chatId: currentChat.chatId,
      chatParticipants: currentChat.participants,
      userId: member.id,
      user_Name: member.display_name,
      managerId: currentChat.managerId,
    };

    try {
      socket.current.emit("kick-from-group", postData);
      currentChat.participants = currentChat.participants.filter(
        (p) => p != member.id
      );
      dispatch({
        type: reducerCases.SET_CURRENT_CHAT,
        chat: currentChat,
      });
    } catch (error) {
      console.error("Error kick:", error);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  const handleAddFriend = async (index, member) => {
    if (!userInfo.phone) {
      toast.error("Please add your phone number in the profile section.");
      return;
    }
    if (loading) return;

    setLoading(true);

    const postData = {
      isAccepted: false,
      receiver: member.id,
      sender: userInfo?.id,
      profilePicture: userInfo?.avatar,
      senderName: userInfo?.display_name,
      receiverName: member.display_name,
      requestId: null,
    };

    if (checkExistingInvitation(postData)) {
      console.error("Invitation already exists.");
      toast.error("Invitation already exists.");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(NOTI_API + "add", postData);
      if (response) {
        toggleModalMembers();
      }
      socket2.current.emit("sendFriendRequest", postData);
      if (postData.sender === userInfo?.id) {
        dispatch({
          type: reducerCases.ADD_INVITATION,
          newSend: postData,
        });
      } else {
        dispatch({
          type: reducerCases.ADD_RECEIVE_INVITATION,
          newReceive: postData,
        });
      }
    } catch (error) {
      console.error("Error sending friend request:", error);
    } finally {
      setLoading(false);
    }
  };
  const checkIsFriend = (member) => {
    if (member.id == userInfo.id) return true;
    if (member && friendList) {
      const isFriend = friendList.some((friend) => friend.id === member.id);
      return isFriend;
    }
    return false;
  };

  // const calculateOptionPosition = (buttonRect, parentRect) => {
  //     const top = buttonRect.top - parentRect.top + buttonRect.height + 50;
  //     const left = buttonRect.left - parentRect.left + buttonRect.width + 60;
  //     return { top, left };
  // };

  return (
    <Modal show={showModalMembers} onHide={toggleModalMembers} centered>
      <Modal.Header closeButton>
        <Modal.Title>Member List</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <ul>
          {filteredParticipants.map((member, index) => {
            const isOptionVisible = showOptions[index];
            return (
              <li
                key={index}
                className="tw-w-full tw-flex tw-justify-start align-items-center tw-my-2 tw-border-b-2 tw-border-gray-200 tw-px-2 tw-py-3"
              >
                <div className="tw-w-full tw-flex tw-justify-center">
                  <div className="tw-flex items-center tw-justify-start tw-w-5/12">
                    <img
                      src={member.profilePicture}
                      alt={member.profilePicture}
                      className="tw-w-8 tw-h-8 tw-rounded-full tw-mr-6"
                    />
                    <span className="tw-mr-6">{member.display_name}</span>
                    {member.id === currentChat.managerId && (
                      <HiMiniKey className="tw-text-yellow-400 " />
                    )}
                  </div>

                  {member.id !== currentChat.managerId &&
                  userInfo.id === currentChat.managerId ? (
                    <div className="tw-w-7/12 tw-flex tw-justify-end tw-items-center">
                      {!checkIsFriend(member) && (
                        <div
                          className=" tw-mr-3 "
                          onClick={() => handleAddFriend(index, member)}
                        >
                          <button className="tw-cursor-pointer tw-bg-blue-200 tw-py-1 tw-px-2 tw-rounded-lg hover:tw-bg-blue-300">
                            Add Friend
                          </button>
                          {/* <button
                            className=" tw-bg-gray-200 tw-py-1 tw-px-2 tw-rounded-l "
                            disabled={true}
                          >
                            Sent
                          </button> */}
                        </div>
                      )}
                      <div onClick={() => handleShowOptions(index)}>
                        <button className="tw-cursor-pointer tw-bg-white">
                          <BsThreeDots />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="tw-w-7/12 tw-flex tw-justify-end tw-items-center">
                      {!checkIsFriend(member) && (
                        <div
                          className=" tw-mr-7 "
                          onClick={() => handleAddFriend(index, member)}
                        >
                          <button className="tw-cursor-pointer tw-bg-blue-200 tw-py-1 tw-px-2 tw-rounded-lg hover:tw-bg-blue-300">
                            Add Friend
                          </button>
                          {/* <button
                            className=" tw-bg-gray-200 tw-py-1 tw-px-2 tw-rounded-l "
                            disabled={true}
                          >
                            Sent
                          </button> */}
                        </div>
                      )}
                      <div onClick={() => handleShowOptions(index)}>
                        <button className="tw-cursor-pointer tw-bg-white"></button>
                      </div>
                    </div>
                  )}
                </div>

                {isOptionVisible && (
                  <div
                    ref={ref}
                    className={`tooltip-content col-5 tw-absolute -tw-right-48 tw-top-${
                      index * 100
                    } tw-bg-white tw-border tw-border-gray-200 tw-rounded`}
                    style={{
                      height: "100px",
                      overflowY: "auto",
                      //   ...selectedOptionPosition,
                    }}
                  >
                    <div
                      className="tw-h-[50%] hover:tw-bg-gray-200 tw-cursor-pointer tw-px-2 tw-py-1"
                      onClick={() => changeRole(member)}
                    >
                      Change of room owner
                    </div>
                    <div
                      className="tw-h-[50%] hover:tw-bg-gray-200 tw-cursor-pointer tw-px-2 tw-py-1"
                      onClick={() => handleRemove(member)}
                    >
                      Remove from group
                    </div>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={toggleModalMembers}>
          Close
        </Button>
      </Modal.Footer>
      <Modal show={modalShow} onHide={() => setModalShow(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Remove</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to remove this member from the group?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setModalShow(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={confirmRemove}>
            Remove
          </Button>
        </Modal.Footer>
      </Modal>
    </Modal>
  );
};

export default ModalGroupMembers;
