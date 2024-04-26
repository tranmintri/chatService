import axios from "axios";
import { useState } from "react";
import { Button, Form, ListGroup, Modal } from "react-bootstrap";
import { CHAT_API, GET_ALL_USER } from "../../../router/ApiRoutes";
import { useStateProvider } from "../../../context/StateContext";
import { reducerCases } from "../../../context/constants";
import { useEffect } from "react";
import { v4 as uuidv4 } from "uuid";

const CreateGroupModal = ({ showModal, handleCloseModal }) => {
  const [{ userInfo, socket, groups }, dispatch] = useStateProvider();
  const [groupName, setGroupName] = useState("");
  const [selectedFriends, setSelectedFriends] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [friendList, setFriendList] = useState([]);
  const filteredFriendList = friendList?.filter((friend) =>
    friend.displayName.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const handleFriendSelect = (friendId) => {
    setSelectedFriends((prevSelectedFriends) => {
      const isSelected = prevSelectedFriends.includes(friendId);
      return isSelected
        ? prevSelectedFriends.filter((id) => id !== friendId)
        : [...prevSelectedFriends, friendId];
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

  const handleCreateGroupChat = async () => {
    if (groupName.trim() === "") {
      alert("Please enter group name");
      return;
    }
    const messageId = uuidv4();
    const participants = selectedFriends.concat(userInfo?.id);
    const postData = {
      name: groupName,
      participants: participants,
      type: "public",
      picture:
        "https://firebasestorage.googleapis.com/v0/b/chatservice-d1f1c.appspot.com/o/avatars%2FavatarGroup.jpg?alt=media&token=cc85e7a4-6bbc-40d2-941c-313db77a2745",
      messages: [
        {
          senderId: userInfo?.id,
          senderName: userInfo?.display_name,
          messageId: messageId,
          senderPicture: userInfo?.avatar,
          type: "init group",
          content:
            "You and " +
            (participants.length - 1) +
            " others added by " +
            userInfo?.display_name,
          timestamp: Date.now(),
          status: "sent",
        },
      ],
      managerId: userInfo?.id,
    };
    const result = await axios.post(CHAT_API, postData);

    if (result.data.data) {
      dispatch({
        type: reducerCases.CREATE_GROUP,
        groups: { ...result.data.data },
        fromSelf: true,
      });

      socket.current.emit("request-create-the-group", {
        newChat: result.data.data,
        userInfo: userInfo,
      });
    }
    setGroupName("");
    setSelectedFriends([]);
    setSearchTerm("");
    handleCloseModal();
    setSelectedFriends([]);
  };

  return (
    <Modal show={showModal} onHide={handleCloseModal} centered>
      <Modal.Header closeButton>
        <Modal.Title style={{ fontSize: "20px" }}>
          Create group chat
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group controlId="formGroupName" className="mb-3">
            <Form.Control
              type="text"
              placeholder="Enter group name"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              required={true}
            />
          </Form.Group>
          <Form.Group controlId="formSearchFriends" className="mb-3">
            <Form.Control
              type="text"
              placeholder="Search friends"
              value={searchTerm}
              onChange={handleSearchTermChange}
            />
          </Form.Group>
          <h5>Friend list</h5>
          <div
            style={{
              maxHeight: "350px",
              overflowY: "scroll",
              minHeight: "350px",
            }}
          >
            {/* Check if friendList is defined */}
            {filteredFriendList && filteredFriendList.length > 0 ? (
              <ListGroup>
                {filteredFriendList.map((friend) => (
                  <ListGroup.Item
                    className="mb-2 d-flex text-center align-items-center"
                    key={friend.id}
                    onClick={() => handleFriendSelect(friend.id)}
                  >
                    <img
                      src={friend.profilePicture}
                      className="me-3 tw-size-12"
                      style={{ borderRadius: "50%" }}
                      alt="Avatar"
                    />
                    <Form.Check
                      type="checkbox"
                      id={`friend-checkbox-${friend.id}`}
                      label={friend.displayName}
                      checked={selectedFriends.includes(friend.id)}
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
      <Modal.Footer>
        <Button variant="secondary" onClick={handleCloseModal}>
          Cancel
        </Button>
        <Button
          variant="primary"
          onClick={handleCreateGroupChat}
          disabled={selectedFriends.length <= 0}
        >
          Create
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default CreateGroupModal;
