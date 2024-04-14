import { useEffect, useRef, useState } from "react";
import { Button, Modal } from "react-bootstrap";
import { BsThreeDots } from "react-icons/bs";
import { CHAT_API, GET_ALL_USER } from "../../../router/ApiRoutes";
import axios from "axios";
import { useStateProvider } from "../../../context/StateContext";
import { HiMiniKey } from "react-icons/hi2";

const ModalGroupMembers = ({
  showModalMembers,
  toggleModalMembers,
  members,
}) => {
  const [showOptions, setShowOptions] = useState({});
  const [selectedOptionPosition, setSelectedOptionPosition] = useState({});
  const [{ userInfo, groups, currentChat, socket }, dispatch] = useStateProvider();
  const [friendList, setFriendList] = useState([]);
  const [modalShow, setModalShow] = useState(false);
  const [currentMember, setCurrentMember] = useState(null);
  const filteredFriendList = friendList.filter((friend) => {
    return members.some((id) => id === friend.id);
  });
  console.log(members);
  console.log(friendList);
  console.log(filteredFriendList);

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

  const changeRole = async (member) => {
    alert(member.id);
    try {
      const res = await axios.put(
        CHAT_API + currentChat.chatId + "/update-role/" + member.id
      );
    } catch (error) {
      console.log(error);
    }
    toggleModalMembers();
    setShowOptions({});
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
    console.log(member, "member")
    toggleModalMembers();
    setShowOptions({});
    const postData = {
      chatId: currentChat.chatId,
      chatParticipants: currentChat.participants,
      userId: member.id,
      user_Name: member.display_name
    }
    console.log(postData, "data Leave")
    try {
      socket.current.emit("kick-from-group", postData);
      alert("You have left the group");
    }
    catch (error) {
      console.error('Error kick:', error);
    }

  };
  // const onLeaveGroup = () => {
  //   const postData = {
  //     chatId: currentChat.chatId,
  //     chatParticipants: currentChat.participants,
  //     userId: userInfo.id,
  //     user_Name: userInfo.display_name
  //   }
  //   console.log(postData, "data Leave")
  //   try {
  //     socket.current.emit("leave-group", postData);
  //     alert("You have left the group");
  //   }
  //   catch (error) {
  //     console.error('Error sending friend request:', error);
  //   }
  // };
  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

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
          {filteredFriendList.map((member, index) => {
            const isOptionVisible = showOptions[index];
            return (
              <li
                key={index}
                className="tw-flex tw-justify-between align-items-center tw-my-2 tw-border-b-2 tw-border-gray-200 tw-px-2 tw-py-3"
              >
                <div className="tw-flex items-center">
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
                  userInfo.id === currentChat.managerId && (
                    <div onClick={() => handleShowOptions(index)}>
                      <button className="tw-cursor-pointer tw-bg-white">
                        <BsThreeDots />
                      </button>
                    </div>
                  )}

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
  <Modal.Body>Are you sure you want to remove this member from the group?</Modal.Body>
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
