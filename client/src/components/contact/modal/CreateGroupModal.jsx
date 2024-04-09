import axios from "axios";
import { useState } from "react";
import { Button, Form, ListGroup, Modal } from "react-bootstrap";
import { CHAT_API, GET_ALL_USER } from "../../../router/ApiRoutes";
import { useStateProvider } from "../../../context/StateContext";
import { reducerCases } from "../../../context/constants";
import { useEffect } from "react";

const CreateGroupModal = ({ showModal, handleCloseModal }) => {
    const [{ userInfo, groups }, dispatch] = useStateProvider();
    const [groupName, setGroupName] = useState('');
    const [selectedFriends, setSelectedFriends] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [friendList, setFriendList] = useState([])
    const filteredFriendList = friendList.filter(friend => 
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
        console.log(selectedFriends)
        if (groupName.trim() === '') {
            alert("Please enter group name");
            return;
        }
        const participant = selectedFriends.concat(userInfo?.id)
        const postData = {
            name: groupName,
            participants: participant,
            type: "public",
        }
        const result = await axios.post(CHAT_API, postData)

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
        setSelectedFriends([])
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
                        {filteredFriendList && filteredFriendList.length > 0 ? (
                            <ListGroup>
                                {filteredFriendList.map(friend => (
                                    <ListGroup.Item className="mb-2 d-flex text-center align-items-center" key={friend.id} onClick={() => handleFriendSelect(friend.id)} >
                                        <img src={friend.profilePicture} className="me-3 tw-size-12" style={{ borderRadius: '50%' }} alt="Avatar" />
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
                <Button variant="primary" onClick={handleCreateGroupChat}>
                    Create
                </Button>
            </Modal.Footer>
        </Modal >
    )
}

export default CreateGroupModal;
