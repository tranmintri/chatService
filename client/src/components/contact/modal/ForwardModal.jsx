import axios from "axios";
import { useState } from "react";
import { Button, Form, ListGroup, Modal } from "react-bootstrap";
import { CHAT_API, GET_ALL_USER } from "../../../router/ApiRoutes";
import { useStateProvider } from "../../../context/StateContext";
import { reducerCases } from "../../../context/constants";
import { useEffect } from "react";
import { toast } from "react-toastify";

const ForwardModal = ({ showModal, handleCloseModal, shareMessage }) => {
    const [{ userInfo, groups, currentChat }, dispatch] = useStateProvider();
    const [selectedGroups, setSelectedGroups] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [friendList, setFriendList] = useState([])
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
                type: 'text', // Đây là trường type của newMessage
                senderId: userInfo?.id,
                senderName: userInfo?.display_name,
                senderPicture: userInfo?.avatar,
                content: shareMessage.content,
                timestamp: Date.now(),
                status: 'sent'
            }
        };

        const { data } = await axios.post(CHAT_API + "/share-message", shareData);
        toast.success('Share successfully!');
        setSelectedGroups([]);
        setSearchTerm('');
        handleCloseModal();


    };
    const convertName = (chat) => {
        if (chat.type == "private") {
            const splitName = chat.name.split("/");
            const displayName = splitName[0] !== userInfo?.display_name ? splitName[0] : splitName[1];

            return displayName
        }
        return chat.name
    }
    const convertImage = (chat) => {
        if (chat.type == "private") {
            const splitName = chat.picture.split("|");
            const friendPicture = splitName[0] !== userInfo?.avatar ? splitName[0] : splitName[1];

            return friendPicture
        }
        return chat.picture
    }

    return (
        <Modal show={showModal} onHide={handleCloseModal} centered>
            <Modal.Header closeButton>
                <Modal.Title style={{ fontSize: '20px' }}>Share</Modal.Title>
            </Modal.Header>
            <Modal.Body className="tw-border-b-2">
                <Form>
                    <Form.Group controlId="formSearchFriends" className="mb-3">
                        <Form.Control type="text" placeholder="Search friends" value={searchTerm} onChange={handleSearchTermChange} />
                    </Form.Group>
                    <div style={{ maxHeight: '500px', minHeight: '350px', overflowY: 'scroll' }} >
                        {/* Check if friendList is defined */}
                        {groups && groups.length > 0 ? (
                            <ListGroup>
                                {groups.map(group => (
                                    <ListGroup.Item className="mb-2 d-flex text-center align-items-center" key={group.chatId} onClick={() => handleGroupSelect(group.chatId)} >
                                        <img src={convertImage(group)} className="me-3 tw-size-12" style={{ borderRadius: '50%' }} alt="Avatar" />
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
                    <div className="tw-bg-slate-100">
                        {shareMessage.content}
                    </div>
                    <Button variant="secondary" >
                        Edit
                    </Button>
                </div>
            </div>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleCloseModal}>
                    Cancel
                </Button>
                <Button variant="primary" onClick={handleShareMessage} disabled={selectedGroups.length <= 0}>
                    Share
                </Button>
            </Modal.Footer>
        </Modal >
    )
}

export default ForwardModal;
