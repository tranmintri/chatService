import { Button, Col, ListGroup } from "react-bootstrap";
import { useStateProvider } from "../../../context/StateContext";
import { GET_ALL_USER, GET_CHAT_BY_PARTICIPANTS } from "../../../router/ApiRoutes";
import axios from "axios";
import { useEffect, useState } from "react";
import { FaCheck } from "react-icons/fa";
import { reducerCases } from "../../../context/constants";
import { toast } from "react-toastify";

const AddFriendCard = ({ searchResults, handleCloseModal, setFriendList, sendFriendDataToModal, selectedCountryCode }) => {
    const [{ userInfo, groups, socket, socket2 }, dispatch ] = useStateProvider()
    const [friends, setFriends] = useState([]);



    useEffect(() => {
        const fetchData = async () => {
            try {
                const { data } = await axios.get(GET_ALL_USER + userInfo?.id);
                console.log(data)
                if (data.data) {
                    setFriends(data.data?.friends ? data.data?.friends : []);
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };
        fetchData();
    }, [userInfo?.id]);


    const handleAddFriend = async () => {
        if (!searchResults) return; 
        const postData = {
            id_UserWantAdd: searchResults.id,
            userId: userInfo?.id,
            profilePicture: searchResults.profilePicture,
            senderName: userInfo?.display_name,
            receiverName: searchResults.display_name
        };
        try {
            socket2.current.emit("sendFriendRequest", postData);
            // alert('Friend added successfully!');
            toast.success('Friend added successfully!');
            handleCloseModal();

        } catch (error) {
            console.error('Error sending friend request:', error);
        }
    };

    const isFriendInArray = (friendList, searchResults) => {
        if (!friendList || !Array.isArray(friendList) || friendList.length === 0) {
            return false; // Return false if friendList is undefined, not an array, or empty
        }
        return friendList.find(friend => friend.id === searchResults.id) !== undefined;
    };

    return (
        <> {!searchResults ? (
            <p>No results found.</p>
        ) : (
            <ListGroup className="mt-3">
                <ListGroup.Item >
                    <div className="d-flex justify-content-between align-items-center">
                        <Col md={3}>
                            <img src={searchResults.profilePicture} className="me-2" height="65px" style={{ borderRadius: '50%' }} alt="Avatar" />
                        </Col>
                        <Col md={6}>
                            <div style={{ fontSize: '18px' }}><strong>{searchResults.display_name}</strong></div>
                            <div style={{ fontSize: '14px' }}>({selectedCountryCode}) {searchResults.phone}</div>
                        </Col>
                        <Col md={3}>
                            <Button variant="success" onClick={handleAddFriend} disabled={isFriendInArray(friends, searchResults)}>
                                {isFriendInArray(friends, searchResults) ? <FaCheck /> : "Add Friend"}
                            </Button>
                            {/* <Button variant="success" onClick={handleAddFriend} disabled={false}>
                                {!true ? <FaCheck /> : "Add Friend"}
                            </Button> */}
                        </Col>
                    </div>
                </ListGroup.Item>
            </ListGroup>)}
        </>
    )
}

export default AddFriendCard;