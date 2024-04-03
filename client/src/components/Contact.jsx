import {
  Col,
  Nav,
  Tab,
} from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUsers,
  faUserGroup,
  faUserPlus,
} from "@fortawesome/free-solid-svg-icons";
import ListContact from "./contact/ListContact";
import ListAddFriend from "./contact/ListAddFriend";
import ListGroups from "./contact/ListGroups";
import { useState } from "react";
import AddFriendModal from "./contact/modal/AddFriendModal";
import CreateGroupModal from "./contact/modal/CreateGroupModal";
import avatar from "../assets/2Q.png"
const Contact = ({ data }) => {
  const [showAddFriendModal, setShowAddFriendModal] = useState(false);
  const [showCreateGroupModal, setShowCreateGroupModal] = useState(false);
  const handleAddFriend = () => {
    setShowAddFriendModal(true);
  };

  const handleCloseAddFriendModal = () => {
    setShowAddFriendModal(false);
  };

  const handleCreateGroup = () => {
    setShowCreateGroupModal(true);
  };

  const handleCloseCreateGroupModal = () => {
    setShowCreateGroupModal(false);
  };

  const handleSendInvite = () => {
    console.log("Gửi lời mời kết bạn");
  };
  const handleSearch = () => {
    console.log("Searching...");
  };

  return (
    <Tab.Container>
      <div
        className="d-flex"
      >
        <Col md={3} style={{ backgroundColor: 'white' }}>
          <Nav className="nav-contact flex-column gap-2" variant="light">
            <Nav.Item className="tab-link  tw-mt-20">
              <Nav.Link
                eventKey="first"
                style={{ textDecoration: "none", color: "black", backgroundColor: activeTab === 'first' ? '#9ea6af' : 'transparent' }}
              >
                <div className="d-flex align-item-center justify-content-start">
                  <FontAwesomeIcon
                    icon={faUsers}
                    style={{ fontSize: "22px", marginRight: 12 }}
                    color="white"
                  />
                  <span className="ml-3">Friends list</span>
                </div>
              </Nav.Link>
            </Nav.Item>
            <Nav.Item className="tab-link">
              <Nav.Link
                eventKey="second"
                style={{ textDecoration: "none", color: "black", backgroundColor: activeTab === 'second' ? '#9ea6af' : 'transparent' }}
              >
                <div className=" d-flex align-item-center justify-content-start">
                  <FontAwesomeIcon
                    icon={faUserGroup}
                    style={{ fontSize: "22px", marginRight: 12 }}
                    color="white"
                  />
                  <span>Groups list</span>
                </div>
              </Nav.Link>
            </Nav.Item>
            <Nav.Item className="tab-link">
              <Nav.Link
                eventKey="third"
                style={{ textDecoration: "none", color: "black", backgroundColor: activeTab === 'third' ? '#9ea6af' : 'transparent' }}
              >
                <div className=" d-flex align-item-center justify-content-start">
                  <FontAwesomeIcon
                    icon={faUserPlus}
                    style={{ fontSize: "22px", marginRight: 12 }}
                    color="white"
                  />
                  <span>Friend requests</span>
                </div>
              </Nav.Link>
            </Nav.Item>
          </Nav>
        </Col>
        <Col md={9}>
          <Tab.Content>
            <Tab.Pane eventKey="first">
              <ListContact data={data} />
            </Tab.Pane>
            <Tab.Pane eventKey="second">
              <ListGroups data={data} />
            </Tab.Pane>
            <Tab.Pane eventKey="third">
              <ListAddFriend />
            </Tab.Pane>
          </Tab.Content>
        </Col>
      </div>
    </Tab.Container>
  );
};
export default Contact;