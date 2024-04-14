import { Button, Form, ListGroup, Modal } from "react-bootstrap";
import { useStateProvider } from "../../../context/StateContext";
import { useEffect, useState } from "react";
import axios from "axios";
import { CHAT_API, GET_ALL_USER } from "../../../router/ApiRoutes";

const ModalAddMember = ({ showModalAddMember, handleCloseModalAddMember }) => {
  const [{ userInfo, groups, currentChat }, dispatch] = useStateProvider();
  const [friendList, setFriendList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFriends, setSelectedFriends] = useState([]);

  const handleFriendSelect = (friendId) => {
    setSelectedFriends((prevSelectedFriends) => {
      const isSelected = prevSelectedFriends.includes(friendId);
      return isSelected
        ? prevSelectedFriends.filter((id) => id !== friendId)
        : [...prevSelectedFriends, friendId];
    });
  };
  const filteredFriendList = friendList.filter((friend) => {
    return !currentChat.participants.some((id) => id === friend.id);
  });

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
  const handleAddMember = async () => {
    try {
      const res = await axios.put(
        CHAT_API + currentChat.chatId,
        selectedFriends
      );
      handleCloseModalAddMember();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Modal
      show={showModalAddMember}
      onHide={handleCloseModalAddMember}
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title style={{ fontSize: "20px" }}>
          Add new members into group
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group controlId="formAddMembers" className="mb-3">
            <Form.Control
              type="text"
              placeholder="Enter phone or name to add members into group"
              value={searchTerm}
              onChange={handleSearchTermChange}
            />
          </Form.Group>
          <div style={{ maxHeight: "200px", overflowY: "scroll" }}>
            {/* Check if friendList is defined */}
            {filteredFriendList && filteredFriendList.length > 0 ? (
              <ListGroup>
                {filteredFriendList.map((friend) => (
                  <ListGroup.Item
                    className="mb-2 d-flex text-center align-items-center "
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
        <Button variant="secondary" onClick={handleCloseModalAddMember}>
          Cancel
        </Button>
        <Button
          variant="primary"
          disabled={selectedFriends.length <= 0}
          onClick={handleAddMember}
        >
          Add
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
export default ModalAddMember;
