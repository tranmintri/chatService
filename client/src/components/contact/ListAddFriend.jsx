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

const ListAddFriend = () => {
  const [dataLoaded, setDataLoaded] = useState(false);

  const [
    { userInfo, receivedInvitations, socket2, sentInvitations },
    dispatch,
  ] = useStateProvider();
  const [receivedList, setReceivedList] = useState([]);
  const [sentList, setSentList] = useState([]);
  // console.log(sentInvitations, "sentInvitations");
  // console.log(receivedInvitations, "receivedInvitations");
  //chuan
  // NHAN
  useEffect(() => {
    const fetchData = async () => {
      try {
        const listReceiverRequest = await axios.get(
          NOTI_API + "getListReceiverRequest/" + userInfo?.id
        );
        setReceivedList(listReceiverRequest.data);
        console.log(listReceiverRequest.data, "nhan lai");
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [userInfo?.id]);
  // load lai du lieu receivelist
  const fetchReceiverData = async () => {
    try {
      const listReceiverRequest = await axios.get(
        NOTI_API + "getListReceiverRequest/" + userInfo?.id
      );
      setReceivedList(listReceiverRequest.data);
      // if (listReceiverRequest.data) {
      //   dispatch({
      //     type: reducerCases.SET_RECEIVE_INVITATION,
      //     receive: listReceiverRequest.data ? listReceiverRequest.data : [],
      //   });
      // }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  //CHO
  useEffect(() => {
    const fetchData = async () => {
      try {
        const listSenderRequest = await axios.get(
          NOTI_API + "getListSenderRequest/" + userInfo?.id
        );
        setSentList(listSenderRequest.data);
        console.log(listSenderRequest.data, "cho di");
        // if (listSenderRequest.data && listSenderRequest.data.length > 0) {
        //   console.log(listSenderRequest.data, "cho di");
        //   dispatch({
        //     type: reducerCases.SET_SENT_INVITATION,
        //     send: listSenderRequest.data,
        //   });
        // }
        // setDataLoaded(true);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [userInfo?.id]);
  // load lai du lieu send list
  const fetchSenderData = async () => {
    try {
      const listSenderRequest = await axios.get(
        NOTI_API + "getListSenderRequest/" + userInfo?.id
      );
      // if (listSenderRequest.data) {
      //   dispatch({
      //     type: reducerCases.SET_SENT_INVITATION,
      //     send: listSenderRequest.data ? listSenderRequest.data : [],
      //   });
      // }
      setSentList(listSenderRequest.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleAcceptInvite = async (invitation) => {
    const postData = {
      senderId: invitation.sender,
      senderName: invitation.senderName,
      profilePicture: invitation.profilePicture,
      receiver: userInfo,
    };
    // const postData = {
    //   userId: userInfo?.id,
    //   requestId: invitation.sender,
    // };

    // const response = await axios.post(GET_ALL_USER + userInfo?.id, postData);
    try {
      const response2 = await axios.post(NOTI_API + "accept", postData);
      console.log(response2)
      alert("Accept successfully!");
      fetchReceiverData();
    }
    catch (error) {
      console.error("Error fetching data:", error);
    }
    //   socket2.current.emit("acceptFriendRequest", invitation);
    //   // alert('Acept successfully!');
    //   toast.success("Accept successfully!");
    //   fetchReceiverData();
    //   const updatedReceivedInvitations = receivedInvitations?.filter(
    //     (invitation) => invitation.id !== invitation.sender
    //   );
    //   dispatch({
    //     type: reducerCases.SET_RECEIVE_INVITATION,
    //     receive: updatedReceivedInvitations ? updatedReceivedInvitations : [],
    //   });
    // } catch (error) {
    //   console.error("Error fetching data:", error);
    // }
  };

  const handleRejectInvite = async (invitation) => {
    const postData = {
      userId: userInfo?.id,
      requestId: invitation.sender,
    };
    try {
      // socket2.current.emit("rejectFriendRequest", postData);
      const response = await axios.post(NOTI_API + "decline", postData);
      console.log(response)
      alert("Reject successfully!");
      fetchReceiverData();
      // const updatedReceivedInvitations = receivedInvitations?.filter(
      //   (invitation) => invitation.id !== invitation.sender
      // );
      // dispatch({
      //   type: reducerCases.SET_RECEIVE_INVITATION,
      //   receive: updatedReceivedInvitations ? updatedReceivedInvitations : [],
      // });
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleCancelInvite = async (invitation) => {
    const postData = {
      userId: userInfo?.id,
      requestId: invitation.receiver,
    };
    try {
      const response = await axios.post(NOTI_API + "cancel", postData);
      console.log(response)
      alert("Cancel successfully!");
      fetchSenderData();
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  return (
    <div className="px-3" style={{ backgroundColor: "white", height: "100vh" }}>
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
          color: "black",
        }}
      >
        <u>Friend Requests Received</u>{" "}
        <span>
          ({receivedList?.length ? receivedList?.length : 0})
        </span>
      </div>

      {receivedList?.length === 0 ? (
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
          {receivedList?.map((invitation, index) => (
            <div key={index}>
              <ListGroup.Item style={{ width: "350px", fontWeight: "bold" }}>
                {invitation?.senderName}
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
        <u>Friend Requests Sent</u>{" "}
        <span>({sentList?.length || 0})</span>
      </div>
      {sentList.length === 0 ? (
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
          {sentList?.length > 0 &&
            sentList?.map((invitation, index) => (
              <div key={index}>
                <ListGroup.Item style={{ width: "350px", fontWeight: "bold" }}>
                  {invitation?.receiverName}
                  <div className="d-flex justify-content-end">
                    <Col md={12}>
                      <Button
                        variant="secondary"
                        onClick={() => handleCancelInvite(invitation)}
                        style={{ width: "100%" }}
                      >
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
