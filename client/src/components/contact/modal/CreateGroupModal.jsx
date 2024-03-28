import axios from "axios";
import { useState } from "react";
import { Button, Form, ListGroup, Modal } from "react-bootstrap";
import { CHAT_API } from "../../../router/ApiRoutes";
import { useStateProvider } from "../../../context/StateContext";
import { reducerCases } from "../../../context/constants";

const CreateGroupModal = ({ showModal, handleCloseModal, friendList }) => {
    const [{ userInfo, groups }, dispatch] = useStateProvider();
    const [groupName, setGroupName] = useState('');
    const [selectedFriends, setSelectedFriends] = useState([userInfo?.id]);
    const [searchTerm, setSearchTerm] = useState('');

    const handleFriendSelect = (friendId) => {
        const isSelected = selectedFriends.includes(friendId);
        setSelectedFriends(
            isSelected
                ? selectedFriends.filter(id => id !== friendId)
                : [...selectedFriends, friendId]
        );
    };

    const handleSearchTermChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const handleCreateGroupChat = async () => {
        if (groupName.trim() === '') {
            alert("Please enter group name");
            return;
        }

        console.log("Creating group chat with name:", groupName);
        console.log("Selected friends:", selectedFriends);
        const postData = {
            name: groupName,
            participants: selectedFriends,
            type: "public",
        }
        const result = await axios.post(CHAT_API, postData)
        console.log(result.data.data)
        if (result.data.data) {
            dispatch({
                type: reducerCases.SET_ALL_GROUP, groups: [...groups, result.data.data]
            })
            alert("create chat success")
        }
        setGroupName('');
        setSelectedFriends([]);
        setSearchTerm('');
        handleCloseModal();
    };

    return (
        <Modal show={showModal} onHide={handleCloseModal} centered>
            <Modal.Header closeButton>
                <Modal.Title style={{ fontSize: '20px' }}>Create group chat</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group controlId="formGroupName" className="mb-3">
                        <Form.Control type="text" placeholder="Enter group name" value={groupName} onChange={(e) => setGroupName(e.target.value)} required={true} />
                    </Form.Group>
                    <Form.Group controlId="formSearchFriends" className="mb-3">
                        <Form.Control type="text" placeholder="Search friends" value={searchTerm} onChange={handleSearchTermChange} />
                    </Form.Group>
                    <h5>Friend list</h5>
                    <div style={{ maxHeight: '200px', overflowY: 'scroll' }}>
                        {/* Check if friendList is defined */}
                        {friendList && friendList.length > 0 ? (
                            <ListGroup>
                                {friendList.map(friend => (
                                    <ListGroup.Item className="mb-2 d-flex text-center align-items-center" key={friend.id} onClick={() => handleFriendSelect(friend.id)} >
                                        <img src={friend.profilePicture} className="me-3 tw-size-12" style={{ borderRadius: '50%' }} alt="Avatar" />
                                        <Form.Check
                                            type="radio"
                                            id={`radio-${friend.id}`}
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
                <Button variant="primary" onClick={handleCreateGroupChat}>
                    Create
                </Button>
            </Modal.Footer>
        </Modal >
    )
}

export default CreateGroupModal;
