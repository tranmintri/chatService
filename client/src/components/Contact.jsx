import { Col, Nav, Tab } from "react-bootstrap";
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
import avatar from "../assets/2Q.png";
import { useEffect } from "react";
import { reducerCases } from "../context/constants";
import { useStateProvider } from "../context/StateContext";
import { GET_CHAT_BY_PARTICIPANTS } from "../router/ApiRoutes";
import axios from "axios";
const Contact = ({ data }) => {
  const [showAddFriendModal, setShowAddFriendModal] = useState(false);
  const [showCreateGroupModal, setShowCreateGroupModal] = useState(false);
  const [{ userInfo }, dispatch] = useStateProvider();
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

  const [activeTab, setActiveTab] = useState("first");
  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get(
          GET_CHAT_BY_PARTICIPANTS + userInfo?.id
        );
        if (data && Array.isArray(data)) {
          // Ensure data exists and is an array
          dispatch({
            type: reducerCases.SET_ALL_GROUP,
            groups: data.sort((a, b) => {
              // Ensure a.messages and b.messages exist before accessing their length
              const lastMessageA = a.messages?.[a.messages.length - 1];
              const lastMessageB = b.messages?.[b.messages.length - 1];
              // Ensure lastMessageA and lastMessageB are not undefined before accessing their timestamp
              if (lastMessageA && lastMessageB) {
                return lastMessageB.timestamp - lastMessageA.timestamp;
              } else {
                // Handle cases where lastMessageA or lastMessageB is undefined
                // For example, you might want to handle these cases differently
                return 0; // For simplicity, assuming equal timestamp for now
              }
            }),
          });
        } else {
          console.error("Data is undefined or not in the expected format");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [activeTab, dispatch, userInfo?.id]);

  return (
    <Tab.Container
      defaultActiveKey={"first"}
      activeKey={activeTab}
      onSelect={(selectedTab) => setActiveTab(selectedTab)}
    >
      <div className="d-flex">
        <Col md={3} style={{ backgroundColor: "white" }}>
          <Nav className="nav-contact flex-column gap-2" variant="light">
            <Nav.Item className="tab-link  tw-mt-20">
              <Nav.Link
                eventKey="first"
                style={{
                  textDecoration: "none",
                  color: "black",
                  backgroundColor:
                    activeTab === "first" ? "gray" : "transparent",
                }}
              >
                <div className="d-flex align-item-center justify-content-start ">
                  <FontAwesomeIcon
                    icon={faUsers}
                    style={{ fontSize: "22px", marginRight: 12 }}
                    color="black"
                  />
                  <span className="ml-3">Friends list</span>
                </div>
              </Nav.Link>
            </Nav.Item>
            <Nav.Item className="tab-link">
              <Nav.Link
                eventKey="second"
                style={{
                  textDecoration: "none",
                  color: "black",
                  backgroundColor:
                    activeTab === "second" ? "gray" : "transparent",
                }}
              >
                <div className=" d-flex align-item-center justify-content-start">
                  <FontAwesomeIcon
                    icon={faUserGroup}
                    style={{ fontSize: "22px", marginRight: 12 }}
                    color="black"
                  />
                  <span>Groups list</span>
                </div>
              </Nav.Link>
            </Nav.Item>
            <Nav.Item className="tab-link">
              <Nav.Link
                eventKey="third"
                style={{
                  textDecoration: "none",
                  color: "black",
                  backgroundColor:
                    activeTab === "third" ? "gray" : "transparent",
                }}
              >
                <div className=" d-flex align-item-center justify-content-start tw-relative">
                  <FontAwesomeIcon
                    icon={faUserPlus}
                    style={{ fontSize: "22px", marginRight: 12 }}
                    color="black"
                  />
                  <span>Friend requests</span>
                  <div className="request-notifications tw-absolute tw-right-0 tw-top-1">{1}</div>
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
