import axios from "axios";
import { faEnvelopeOpen, faUserGroup } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState, useEffect } from "react";
import { Container, ListGroup, Alert, Button, Col } from "react-bootstrap";
import { NOTI_API } from "../../router/ApiRoutes";
import { useStateProvider } from "../../context/StateContext";
import { reducerCases } from "../../context/constants";
import { GET_ALL_USER, GET_CHAT_BY_PARTICIPANTS } from "../../router/ApiRoutes";
import { toast } from "react-toastify";
import { useSelector } from 'react-redux';

const ListAddFriend = () => {
  const [dataLoaded, setDataLoaded] = useState(false);

  const [{ userInfo, receivedInvitations, socket2, sentInvitations }, dispatch] = useStateProvider()

  console.log(sentInvitations, "sentInvitations");
  //chuan
  useEffect(() => {
    const fetchData = async () => {
      try {
        const listSenderRequest = await axios.get(NOTI_API + "getListSenderRequest/" + userInfo?.id);

        if (listSenderRequest.data && listSenderRequest.data.length > 0) {
          console.log(listSenderRequest.data, "data")
          dispatch({ type: reducerCases.SET_SENT_INVITATION, send: listSenderRequest.data })
        }
        setDataLoaded(true);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [userInfo?.id]);


  useEffect(() => {
    const fetchData = async () => {
      try {
        const listReceiverRequest = await axios.get(NOTI_API + "getListReceiverRequest/" + userInfo?.id);
        if (listReceiverRequest.data) {
          dispatch({ type: reducerCases.SET_RECEIVE_INVITATION, receivedInvitations: listReceiverRequest.data ? listReceiverRequest.data : [] })
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [userInfo?.id]);
  const fetchReceiverData = async () => {
    try {
      const listReceiverRequest = await axios.get(NOTI_API + "getListSenderRequest/" + userInfo?.id);
      if (listReceiverRequest.data) {
        // setReceivedInvitations(listReceiverRequest.data ? listReceiverRequest.data : []);
        dispatch({ type: reducerCases.SET_RECEIVE_INVITATION, receivedInvitations: listReceiverRequest.data ? listReceiverRequest.data : [] })
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const fetchSenderData = async () => {
    try {
      const listReceiverRequest = await axios.get(NOTI_API + "getListReceiverRequest/" + userInfo?.id);
      if (listReceiverRequest.data) {

        dispatch({ type: reducerCases.SET_SENT_INVITATION, sentInvitations: listReceiverRequest.data ? listReceiverRequest.data : [] })
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  // id: searchResults.id,
  // display_name: searchResults.display_name,
  // profilePicture: searchResults.profilePicture,
  // user: userInfo

  const handleAcceptInvite = async (invitation) => {
    // const postData = {
    //   userId: userInfo?.id,
    //   requestId: invitation.sender,
    // }
    // console.log(invitation)
    const postData = {
      id: invitation.sender,
      display_name: invitation.senderName,
      profilePicture: invitation.profilePicture,
      user: userInfo
    };
    const response = await axios.post(GET_ALL_USER + userInfo?.id, postData);
    const response2 = await axios.post(NOTI_API + 'delete', postData);
    // sendFriendDataToModal(response.data.data);
    // setFriendList(prevList => [...prevList, response.data.data]);
    // dispatch({ type: reducerCases.SET_ALL_GROUP, groups: [...groups, response.data.data] });
    try {
      socket2.current.emit("acceptFriendRequest", postData);
      // alert('Acept successfully!');
      toast.success("Accept successfully!");
      fetchReceiverData();
      const updatedReceivedInvitations = receivedInvitations?.filter(
        (invitation) => invitation.id !== invitation.sender
      );
      dispatch({ type: reducerCases.SET_RECEIVE_INVITATION, receivedInvitations: updatedReceivedInvitations ? updatedReceivedInvitations : [] })
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  const handleRejectInvite = async (invitation) => {
    const postData = {
      userId: userInfo?.id,
      requestId: invitation.sender
    }
    try {
      socket2.current.emit("rejectFriendRequest", postData);
      alert('Reject successfully!');
      fetchReceiverData();
      const updatedReceivedInvitations = receivedInvitations?.filter(
        (invitation) => invitation.id !== invitation.sender
      );
      dispatch({ type: reducerCases.SET_RECEIVE_INVITATION, receivedInvitations: updatedReceivedInvitations ? updatedReceivedInvitations : [] })
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  const handleCancelInvite = async (invitation) => {
    const postData = {
      userId: userInfo?.id,
      requestId: invitation.receiver
    }
    try {
      socket2.current.emit("cancelFriendRequest", postData);
      alert('Cancel successfully!');
      fetchSenderData();
      const updatedSendedInvitations = sentInvitations?.filter(
        (invitation) => invitation.id !== invitation.sender
      );

      dispatch({ type: reducerCases.SET_SENT_INVITATION, sentInvitations: updatedSendedInvitations ? updatedSendedInvitations : [] })
      socket2.current.on("cancelFriend", (data) => {
      })
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }


  return (
    <div className="px-3" style={{ backgroundColor: 'white', height: '100vh' }}>
      <div className="friend-requests-header">
        <h2>
          {" "}
          <FontAwesomeIcon
            icon={faUserGroup}
            style={{ fontSize: "22px", marginRight: 12 }}
            color="white"
          />
          Friend Requests List
        </h2>
        <span>You can see your friends requests here</span>
      </div>
      <div
        style={{
          fontSize: 18,
          fontWeight: "bold",
          marginTop: "20px",
          marginBottom: "20px",
          color: 'black'
        }}
      >
        <u>Friend Requests Received</u>{" "}
        <span>({receivedInvitations?.length ? receivedInvitations?.length : 0})</span>
      </div>

      {receivedInvitations.length === 0 ? (
        <div className="text-center align-items-center">
          <FontAwesomeIcon
            icon={faEnvelopeOpen}
            style={{ fontSize: "100px", margin: 15 }}
            color="black"
          />
          <Alert variant="info">Oops, this is no friend requests.</Alert>
        </div>
      ) : (
        <ListGroup className="m-3">
          {receivedInvitations?.map((invitation, index) => (
            <div key={index}>
              <ListGroup.Item
                style={{ width: "350px", fontWeight: "bold" }}
              >
                {invitation.senderName}
                <div className="d-flex justify-content-between">
                  <Col md={6}>
                    <Button
                      variant="success"
                      onClick={() => handleAcceptInvite(invitation)}
                      style={{ width: "100%" }}
                    >
                      Accept
                    </Button>
                  </Col>
                  <Col>
                    <Button
                      variant="danger"
                      onClick={() => handleRejectInvite(invitation)}
                      style={{ width: "100%" }}
                    >
                      Reject
                    </Button>
                  </Col>
                </div>
              </ListGroup.Item>
            </div>
          ))}
        </ListGroup>
      )}

      <div
        style={{
          fontSize: 18,
          fontWeight: "bold",
          marginTop: "20px",
          marginBottom: "20px",
        }}
      >
        <u>Friend Requests Sent</u> <span>({sentInvitations?.length})</span>
      </div>
      {dataLoaded && sentInvitations.length === 0 ? (
        <div className="text-center align-items-center">
          <FontAwesomeIcon
            icon={faEnvelopeOpen}
            style={{ fontSize: "100px", margin: 15 }}
            color="black"
          />
          <Alert variant="info">Oops, there are no friend requests.</Alert>
        </div>
      ) : (
        <ListGroup className="m-3">
          {sentInvitations.length > 0 && sentInvitations.map((invitation, index) => (
            <div key={index}>
              <ListGroup.Item style={{ width: "350px", fontWeight: "bold" }}>
                {invitation?.receiverName}
                <div className="d-flex justify-content-end">
                  <Col md={12}>
                    <Button variant="secondary" onClick={() => handleCancelInvite(invitation)} style={{ width: "100%" }}>
                      Cancel
                    </Button>
                  </Col>
                </div>
              </ListGroup.Item>
            </div>
          ))}
        </ListGroup>
      )}
    </div>
  );
};

export default ListAddFriend;
