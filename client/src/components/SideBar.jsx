import {
  faAddressBook,
  faCamera,
  faMessage,
  faSignOutAlt,
  faUserPlus,
  faUsers,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import {
  Button,
  Col,
  Image,
  Modal,
  ModalFooter,
  ModalHeader,
  Nav,
  Tab,
} from "react-bootstrap";
import "react-datepicker/dist/react-datepicker.css";
import { useNavigate } from "react-router-dom";
import { useLogout } from "../apis/useLogout";
import Page from "../constants/Page";
import { useStateProvider } from "../context/StateContext";
import { reducerCases } from "../context/constants";
import { GET_ALL_USER, GET_CHAT_BY_PARTICIPANTS } from "../router/ApiRoutes";
import Chat from "./Chat";
import Contact from "./Contact";
import GroupCard from "./contact/card/GroupCard";
import AddFriendModal from "./contact/modal/AddFriendModal";
import CreateGroupModal from "./contact/modal/CreateGroupModal";
const SideBar = () => {
  const [{ userInfo, contactsPage, groups, messages }, dispatch] =
    useStateProvider();
  const [activeKey, setActiveKey] = useState("first");

  const [showFormUser, setShowFormUser] = useState(false);
  const [showFormAddFriend, setShowFormAddFriend] = useState(false);
  const [userList, setUserList] = useState([]);
  const [friendList, setFriendList] = useState([]);
  const handleCloseAddFriendModal = () => setShowFormAddFriend(false);
  const handleShowAddFriend = () => setShowFormAddFriend(true);

  const [showFormCreateGroup, setShowFormCreateGroup] = useState(false);
  const handleCloseCreateGroupModal = () => setShowFormCreateGroup(false);
  const handleShowCreateGroup = () => setShowFormCreateGroup(true);

  const [showFormLogout, setShowFormLogout] = useState(false);
  const handleCloseFormLogOut = () => setShowFormLogout(false);
  const handleShowFormLogOut = () => setShowFormLogout(true);

  const [showFormProfile, setShowFormProfile] = useState(false);
  const handleCloseFormProfile = () => setShowFormProfile(false);
  const handleShowFormProfile = () => setShowFormProfile(true);

  const [showFormSetting, setShowFormSetting] = useState(false);
  const handleCloseFormSetting = () => setShowFormSetting(false);
  const navigate = useNavigate();
  const handleShowFormSetting1 = () => {
    navigate(Page.USER_SETTING_PAGE.path, { replace: true });
  };

  const [showUpdateModal, setShowUpdateModal] = useState(false);

  const [showSearchTable, setShowSearchTable] = useState(false);
  // const [showUpdateModal, setShowUpdateModal] = useState(false);
  // const [showUpdateModal, setShowUpdateModal] = useState(false);

  const [receiveFriendData, setReceiveFriendData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredGroups = groups.filter((group) =>
    group.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const handleOpenUpdateModal = () => {
    setShowUpdateModal(true);
  };

  const handleCloseUpdateModal = () => {
    setShowUpdateModal(false);
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get(GET_ALL_USER);
        console.log(data);
        setUserList(data.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const ref = useRef();
  const handleClickOutside = (event) => {
    if (ref.current && !ref.current.contains(event.target)) {
      setShowFormUser(false);
    }
  };

  const receiveFriendDataFromModal = (friendData) => {
    // Xử lý dữ liệu được truyền từ modal ở đây
    setReceiveFriendData((prevList) => [...prevList, friendData]);

    // Ví dụ: Cập nhật trạng thái hoặc làm bất kỳ điều gì bạn cần với dữ liệu này
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  const [activeTab, setActiveTab] = useState("first");
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (activeTab === "first") {
          dispatch({
            type: reducerCases.SET_ALL_CONTACTS_PAGE,
            contactsPage: false,
          });
          const { data } = await axios.get(
            GET_CHAT_BY_PARTICIPANTS + userInfo?.id
          );
          if (data) {
            dispatch({
              type: reducerCases.SET_ALL_GROUP,
              groups: data.sort((a, b) => {
                const lastMessageA = a.messages?.[a.messages.length - 1];
                const lastMessageB = b.messages?.[b.messages.length - 1];
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
            console.error("Data is undefined");
          }
        } else if (activeTab === "second") {
          // Fetch other data based on the second tab if needed
          dispatch({
            type: reducerCases.SET_ALL_CONTACTS_PAGE,
            contactsPage: true,
          });
          const { data } = await axios.get(
            GET_CHAT_BY_PARTICIPANTS + userInfo?.id
          );
          if (data) {
            dispatch({
              type: reducerCases.SET_ALL_GROUP,
              groups: data.sort((a, b) => {
                const lastMessageA = a.messages?.[a.messages.length - 1];
                const lastMessageB = b.messages?.[b.messages.length - 1];
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
            console.error("Data is undefined");
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [activeTab, dispatch, userInfo?.id, messages]);

  const logOut = useLogout();
  const onLogout = () => {
    const data = localStorage.getItem("accessToken");
    console.log("logout ne");
    logOut(data);
  };

  useEffect(() => {
    // Nếu contactsPage là true, chọn tab "second", ngược lại chọn tab "first"
    setActiveTab(contactsPage ? "second" : "first");
  }, [contactsPage]);

  return (
    <Tab.Container
      id="left-tabs-example"
      defaultActiveKey="first"
      activeKey={activeTab}
      onSelect={(selectedTab) => setActiveTab(selectedTab)}
    >
      <div className="d-flex">
        <Col
          sm={3}
          style={{
            width: "100px",
            height: "100vh",
            overflowY: "auto",
            backgroundColor: "#1e1f22",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <Nav
            variant="pills"
            className="h-100 flex-column d-flex justify-content-between"
          >
            <Nav.Item className="mt-3 mb-3">
              <Nav.Link onClick={() => setShowFormUser(!showFormUser)}>
                <div className="d-flex align-items-center justify-content-center">
                  <Image
                    src={
                      userInfo?.avatar
                        ? userInfo?.avatar
                        : "https://www.signivis.com/img/custom/avatars/member-avatar-01.png"
                    }
                    roundedCircle
                    className="w-100"
                    style={{ border: "2px solid black" }}
                  />
                </div>
              </Nav.Link>

              <Modal
                show={showFormProfile}
                onHide={handleCloseFormProfile}
                centered
                className="custom-modal"
              >
                <Modal.Header closeButton>
                  <Modal.Title>Account Infomation</Modal.Title>
                </Modal.Header>
                <div className="tw-relative">
                  <img
                    src={"https://picsum.photos/200/300"}
                    alt="User Cover"
                    className="tw-w-full tw-h-40"
                  />
                  <div className="tw-ml-5 tw-flex tw-items-center tw-bottom-0 tw-transform tw--translate-y-1/3">
                    <div>
                      <img
                        src={
                          userInfo?.avatar
                            ? userInfo?.avatar
                            : "https://www.signivis.com/img/custom/avatars/member-avatar-01.png"
                        }
                        alt="User Avatar"
                        className="tw-w-24 tw-h-24 tw-rounded-full tw-border tw-border-gray-500"
                      />
                      <button className="tw-absolute tw-bottom-0 tw-left-16 tw-w-8 tw-h-8 tw-rounded-full tw-bg-gray-300 tw-text-gray-500 tw-flex tw-items-center tw-justify-center tw-border-2 tw-border-white">
                        <FontAwesomeIcon
                          icon={faCamera}
                          style={{ fontSize: "20px" }}
                        />
                      </button>
                    </div>
                    <div className="tw-ml-5 mt-2 tw-font-bold tw-text-xl">
                      {userInfo?.display_name}
                    </div>
                  </div>
                  <div>
                    <div className="tw-pl-5 tw-font-bold">
                      Personal Infomation
                    </div>
                    <div className="tw-ml-5">
                      <div className="tw-flex tw-w-3/5 pt-2">
                        <div className="tw-flex-1 tw-text-gray-400">Email</div>
                        <div className="tw-flex-1">
                          {userInfo?.email
                            ? userInfo?.email
                            : "abcdefgh@gmail.com"}
                        </div>
                      </div>

                      <div className="tw-flex tw-w-3/5 pt-2">
                        <div className="tw-flex-1 tw-text-gray-400">
                          Điện thoại
                        </div>
                        <div className="tw-flex-1">
                          +{userInfo?.phone ? userInfo?.phone : "123456789"}
                        </div>
                      </div>
                      <br />
                    </div>
                  </div>
                </div>
                <div className="tw-flex tw-justify-center tw-h-14 tw-border-t tw-border-gray-300">
                  <button
                    className="tw-rounded-lg tw-w-1/5"
                    variant="primary"
                    onClick={() => {
                      handleOpenUpdateModal();
                      handleCloseFormProfile();
                    }}
                  >
                    Cập nhật
                  </button>
                </div>
              </Modal>

              <Modal
                show={showUpdateModal}
                onHide={handleCloseUpdateModal}
                centered
                className="custom-modalupdate"
              >
                <ModalHeader>
                  <Modal.Title>Cập nhật thông tin cá nhân</Modal.Title>
                </ModalHeader>
                <div className="p-3">
                  <div className="tw-text-lg">Tên hiển thị</div>
                  <input
                    type="text"
                    className="tw-mt-2 tw-text-sm tw-w-full tw-p-2 tw-mb-2 tw-rounded-md tw-border-gray-400 tw-border"
                    defaultValue={userInfo?.display_name}
                  />
                  <div className="tw-font-bold tw-text-lg tw-mt-5">
                    Thông tin cá nhân
                  </div>
                  <div className="tw-flex tw-mt-3">
                    <div>
                      <input
                        type="radio"
                        id="male"
                        name="gender"
                        value="male"
                      />
                      <label className="tw-ml-2" htmlFor="male">
                        Nam
                      </label>
                    </div>
                    <div className="tw-ml-5">
                      <input
                        type="radio"
                        id="female"
                        name="gender"
                        value="female"
                      />
                      <label className="tw-ml-2" htmlFor="female">
                        Nữ
                      </label>
                    </div>
                  </div>
                  <div className="mt-3">Ngày sinh</div>
                  <div className="tw-flex tw-justify-center tw-mb-44 tw-mt-3">
                    <select className="tw-w-1/3 tw-p-2 tw-mb-2 tw-rounded-md tw-border tw-border-gray-400 tw-mr-2">
                      {generateOptions(1, 31)}
                    </select>
                    <select className="tw-w-1/3 tw-p-2 tw-mb-2 tw-rounded-md tw-border tw-border-gray-400 tw-mr-2">
                      {generateOptions(1, 12)}
                    </select>
                    <select className="tw-w-1/3 tw-p-2 tw-mb-2 tw-rounded-md tw-border tw-border-gray-400">
                      {generateOptions(1900, 2022)}
                    </select>
                  </div>
                </div>
                <ModalFooter>
                  <button
                    className="tw-bg-gray-500 tw-h-10 tw-w-20 tw-rounded-lg"
                    variant="secondary"
                    onClick={handleCloseUpdateModal}
                  >
                    Hủy
                  </button>
                  <button
                    className="tw-bg-blue-500 tw-h-10 tw-w-20 tw-rounded-lg"
                    variant="primary"
                    onClick={handleCloseUpdateModal}
                  >
                    Cập nhật
                  </button>
                </ModalFooter>
              </Modal>

              <Modal
                show={showFormSetting}
                onHide={handleCloseFormSetting}
                centered
              >
                <Modal.Header closeButton>
                  <Modal.Title>SETTING</Modal.Title>
                </Modal.Header>
                <Modal.Body style={{ borderBottom: "none" }}>
                  SETTING
                </Modal.Body>
              </Modal>

              {/* <AddFriendModal showModal={showFormAddFriend} handleCloseModal={handleCloseAddFriendModal} userList={userList} setFriendList={setFriendList} /> */}
              <AddFriendModal
                showModal={showFormAddFriend}
                handleCloseModal={handleCloseAddFriendModal}
                userList={userList}
                setFriendList={setFriendList}
                sendFriendDataToSidebar={receiveFriendDataFromModal}
              />
              <CreateGroupModal
                showModal={showFormCreateGroup}
                handleCloseModal={handleCloseCreateGroupModal}
              />
            </Nav.Item>
            <Nav.Item className="mt-3 mb-3">
              <Nav.Link
                style={{ backgroundColor: "transparent" }}
                eventKey="first"
                onClick={() => {
                  setActiveKey("first");
                }}
              >
                <div
                  className="d-flex align-item-center justify-content-center tw-p-3 tw-rounded-lg"
                  style={{
                    backgroundColor:
                      activeTab === "first" ? "gray" : "transparent",
                  }}
                >
                  <FontAwesomeIcon
                    icon={faMessage}
                    style={{ fontSize: "30px" }}
                    className={
                      activeTab === "first"
                        ? "tw-text-white"
                        : "tw-text-gray-500"
                    }
                  />
                </div>
              </Nav.Link>
            </Nav.Item>
            <Nav.Item className="mt-3 mb-3">
              <Nav.Link
                style={{ backgroundColor: "transparent" }}
                eventKey="second"
                onClick={() => {
                  setActiveKey("second");
                }}
              >
                <div
                  className="d-flex align-item-center justify-content-center tw-p-3 tw-rounded-lg"
                  style={{
                    backgroundColor:
                      activeTab === "second" ? "gray" : "transparent",
                  }}
                >
                  <FontAwesomeIcon
                    icon={faAddressBook}
                    style={{ fontSize: "30px" }}
                    className={
                      activeTab === "second"
                        ? "tw-text-white"
                        : "tw-text-gray-500"
                    }
                  />
                </div>
              </Nav.Link>
            </Nav.Item>
            <Nav.Item className="mt-auto">
              <Nav.Link>
                <div className="d-flex align-item-center justify-content-center">
                  <FontAwesomeIcon
                    icon={faSignOutAlt}
                    style={{ fontSize: "26px" }}
                    className="tw-text-white"
                    onClick={handleShowFormLogOut}
                  />
                </div>
              </Nav.Link>
              <Modal
                show={showFormLogout}
                onHide={handleCloseFormLogOut}
                centered
              >
                <Modal.Header closeButton>
                  <Modal.Title>Confirm</Modal.Title>
                </Modal.Header>
                <Modal.Body style={{ borderBottom: "none" }}>
                  Do you want to sign out to Drafi ?
                </Modal.Body>
                <Modal.Footer style={{ borderTop: "none" }}>
                  <Button variant="secondary" onClick={handleCloseFormLogOut}>
                    No
                  </Button>
                  <Button variant="primary" onClick={onLogout}>
                    Sign Out
                  </Button>
                </Modal.Footer>
              </Modal>
            </Nav.Item>
          </Nav>
        </Col>
        <Col style={{ width: "90%" }} className="tw-relative">
          <div
            className=" col-3 tw-h-20 tw-absolute tw-z-50"
            style={{ backgroundColor: "white" }}
          >
            <div className="tw-flex tw-justify-center tw-items-center tw-h-20 tw-w-full">
              <div className="tw-flex tw-w-full tw-items-center">
                <input
                  onClick={() => setShowSearchTable(true)}
                  type="text"
                  placeholder="Tìm kiếm"
                  className="tw-text-lg tw-w-4/5 tw-rounded tw-m-4 tw-border tw-border-gray-200 focus:tw-border-blue-500 tw-text-white"
                  style={{ backgroundColor: "#eaedf0" }}
                  value={searchTerm}
                  onChange={handleSearch}
                />
                <div className="tw-w-1/5 tw-flex-1 tw-flex">
                  {showSearchTable ? (
                    <button
                      className="tw-font-bold  tw-rounded tw-flex-1 tw-m-1 tw-text-black hover:tw-bg-gray-300 hover:tw-text-black"
                      onClick={() => setShowSearchTable(false)}
                    >
                      Close
                    </button>
                  ) : (
                    <>
                      <button
                        className="tw-text-white tw-rounded tw-flex-1 tw-m-1 hover:tw-bg-gray-300"
                        onClick={handleShowAddFriend}
                      >
                        <FontAwesomeIcon
                          icon={faUserPlus}
                          style={{ fontSize: "15px" }}
                          color="gray"
                        />
                      </button>
                      <button
                        className="tw-text-white tw-rounded tw-flex-1 tw-m-1 hover:tw-bg-gray-300"
                        onClick={handleShowCreateGroup}
                      >
                        <FontAwesomeIcon
                          icon={faUsers}
                          style={{ fontSize: "15px" }}
                          color="gray"
                        />
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
          {showSearchTable && (
            <div className="tw-bg-slate-100 tw-shadow-2xl tw-max-h-[40vh] tw-overflow-auto custom-scrollbar tw-absolute tw-z-50 col-3 tw-mt-16  tw-border-t tw-border-l tw-border-r">
              {filteredGroups.map((chat, index) => (
                <GroupCard chat={chat} />
              ))}
            </div>
          )}

          {showFormUser && (
            <div className="tooltip-content col-2 tw-w-2/5 absolute" ref={ref}>
              <div className="tw-h-[25%] tw-flex tw-text-lg tw-items-center tw-border-b tw-font-bold">
                {userInfo?.display_name}
              </div>
              <div style={{ height: "50%" }}>
                <div
                  className="tw-h-[50%] tw-flex tw-text-lg tw-items-center tw-cursor-pointer hover:tw-bg-gray-200"
                  onClick={handleShowFormProfile}
                >
                  Your profile
                </div>
                <div
                  className="tw-h-[50%] tw-flex tw-text-lg tw-items-center tw-cursor-pointer hover:tw-bg-gray-200"
                  onClick={handleShowFormSetting1}
                >
                  Setting
                </div>
              </div>
              <div
                className="tw-h-[25%] tw-flex tw-text-lg tw-items-center tw-cursor-pointer hover:tw-bg-gray-200 tw-border-t"
                onClick={handleShowFormLogOut}
              >
                Sign Out
              </div>
            </div>
          )}
          <Tab.Content>
            <Tab.Pane eventKey="first">
              <Chat />
            </Tab.Pane>
            <Tab.Pane eventKey="second">
              <Contact data={receiveFriendData} />
            </Tab.Pane>
            {/* <Tab.Pane eventKey="fourth">
              <div>form log out</div>
            </Tab.Pane> */}
          </Tab.Content>
        </Col>
      </div>
    </Tab.Container>
  );
};
function generateOptions(start, end) {
  const options = [];
  for (let i = start; i <= end; i++) {
    options.push(<option value={i}>{i}</option>);
  }
  return options;
}
export default SideBar;
