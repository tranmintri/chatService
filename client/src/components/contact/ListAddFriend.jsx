import axios from "axios";
import { faEnvelopeOpen, faUserGroup } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState, useEffect } from "react";
import { Container, ListGroup, Alert, Button, Col } from "react-bootstrap";
import { NOTI_API } from "../../router/ApiRoutes";
import { useStateProvider } from "../../context/StateContext";
const ListAddFriend = () => {
  const [{ userInfo, groups, socket }, dispatch] = useStateProvider()
  const [sentInvitations, setSentInvitations] = useState([]);
  const [receivedInvitations, setReceivedInvitations] = useState([]);

  //chuan
  useEffect(() => {
    const fetchData = async () => {
      try {
        const listSenderRequest = await axios.get(NOTI_API + "getListSenderRequest/" + userInfo?.id);
        console.log(listSenderRequest.data)
        if (listSenderRequest.data) {
          setSentInvitations(listSenderRequest.data ? listSenderRequest.data : []);
        }
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
        console.log(listReceiverRequest.data)
        if (listReceiverRequest.data) {
          setReceivedInvitations(listReceiverRequest.data ? listReceiverRequest.data : []);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [userInfo?.id]);



  const handleRejectInvite = (invitationsId) => {
    // Xử lý hủy lời mời kết bạn đã gửi
    console.log(`Hủy lời mời kết bạn đã gửi với id: ${invitationsId}`);
    // Cập nhật danh sách lời mời đã gửi sau khi hủy
    const updatedSentInvitations = sentInvitations.filter(
      (invitations) => invitations.id !== invitationsId
    );
    setSentInvitations(updatedSentInvitations);
  };

  const handleAcceptInvite = (invitationId) => {
    // Xử lý chấp nhận lời mời kết bạn đã nhận
    console.log(`Chấp nhận lời mời kết bạn đã nhận với id: ${invitationId}`);
    // Cập nhật danh sách lời mời đã nhận sau khi chấp nhận
    const updatedReceivedInvitations = receivedInvitations.filter(
      (invitation) => invitation.id !== invitationId
    );
    setReceivedInvitations(updatedReceivedInvitations);
  };

  const handleCancelInvite = (invitationId) => {
    // Xử lý từ chối lời mời kết bạn đã nhận
    console.log(`Từ chối lời mời kết bạn đã nhận với id: ${invitationId}`);
    // Cập nhật danh sách lời mời đã nhận sau khi từ chối
    const updatedReceivedInvitations = receivedInvitations.filter(
      (invitation) => invitation.id !== invitationId
    );
    setReceivedInvitations(updatedReceivedInvitations);
  };

  receivedInvitations.map((invitation) => {
    // console.log(invitation.sender);
  });


  return (
    <div className="px-3" style={{ backgroundColor: 'white', height: '100vh' }}>
      <div className="friend-requests-header">
        <h2>
          {" "}
          <FontAwesomeIcon
            icon={faUserGroup}
            style={{ fontSize: "22px", marginRight: 12 }}
            color="black"
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
        <u>Lời mời kết bạn đã nhận</u>{" "}
        <span>({receivedInvitations.length})</span>
      </div>

      {receivedInvitations.length === 0 ? (
        <div className="text-center align-items-center">
          <FontAwesomeIcon
            icon={faEnvelopeOpen}
            style={{ fontSize: "100px", margin: 15 }}
            color="white"
          />
          <Alert variant="info">Oops, this is no friend requests.</Alert>
        </div>
      ) : (
        <ListGroup className="m-3">
          {receivedInvitations.map((invitation) => (
            <div className="">
              <ListGroup.Item
                key={invitation.id}
                style={{ width: "350px", fontWeight: "bold" }}
              >
                {invitation.senderName}
                <div className="d-flex justify-content-between">
                  <Col md={6}>
                    <Button
                      variant="success"
                      onClick={() => handleAcceptInvite(invitation.id)}
                      style={{ width: "100%" }}
                    >
                      Accept
                    </Button>
                  </Col>
                  <Col>
                    <Button
                      variant="danger"
                      onClick={() => handleCancelInvite(invitation.id)}
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
        <u>Lời mời kết bạn đã gửi</u> <span>({sentInvitations.length})</span>
      </div>

      {sentInvitations.length === 0 ? (
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
          {sentInvitations.map((invitations) => (
            <div className="">
              <ListGroup.Item
                key={invitations.id}
                style={{ width: "350px", fontWeight: "bold" }}
              >
                {invitations.receiverName}
                <div className="d-flex justify-content-end">
                  <Col md={12}>
                    <Button
                      variant="secondary"
                      onClick={() => handleRejectInvite(invitations.id)}
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
