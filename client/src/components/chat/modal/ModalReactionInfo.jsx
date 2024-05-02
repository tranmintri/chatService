import React, { useState, useEffect } from "react";
import { Modal, Button, Tab, Col, Nav } from "react-bootstrap";
import smileImg from "../../../assets/smile.png";
import sadImg from "../../../assets/sad.png";
import suppriseImg from "../../../assets/supprise.png";
import heartImg from "../../../assets/heart.png";
import likeImg from "../../../assets/like.png";
import angryImg from "../../../assets/angry.png";

const ModalReactionInfo = ({ showModalInfo, handleCloseModal }) => {
  const [activeTab, setActiveTab] = useState("all");
  const [reactionCounts, setReactionCounts] = useState({});
  const [reactionIcons, setReactionIcons] = useState({});

  const handleConfirm = () => {
    window.alert("info!");
  };

  const reactionsData = {
    all: ["Lê Thanh Hải", "Trần Minh Trí", "Phạm Xuân Cảnh", "Lê Thị Hoàng Linh", "Trần Thị Nhật Vy"],
    smile: ["Lê Thanh Hải", "Trần Minh Trí"],
    sad: ["Lê Thanh Hải", "Phạm Xuân Cảnh", "Lê Thị Hoàng Linh"],
    supprise: ["Trần Minh Trí", "Lê Thị Hoàng Linh", "Trần Thị Nhật Vy"],
    heart: ["Lê Thanh Hải", "Trần Minh Trí", "Trần Thị Nhật Vy"],
    like: ["Lê Thị Hoàng Linh", "Trần Thị Nhật Vy"],
    angry: ["Trần Minh Trí", "Lê Thị Hoàng Linh"],
  };

  useEffect(() => {
    const updateReactionData = () => {
      const newReactionCounts = {};
      const newReactionIcons = {};

      Object.keys(reactionsData).forEach((tabName) => {
        newReactionCounts[tabName] = {};
        newReactionIcons[tabName] = {};

        reactionsData[tabName].forEach((user) => {
          // Đếm số lượng reaction cho mỗi người dùng
          newReactionCounts[tabName][user] = newReactionCounts[tabName][user] ? newReactionCounts[tabName][user] + 1 : 1;
          // Thêm hình ảnh của reaction cho mỗi người dùng
          newReactionIcons[tabName][user] = [...(newReactionIcons[tabName][user] || []), getEmojiImage(tabName)];
        });
      });

      setReactionCounts(newReactionCounts);
      setReactionIcons(newReactionIcons);
    };

    updateReactionData();
  }, [reactionsData]);

  const getEmojiImage = (emoji) => {
    switch (emoji) {
      case "smile":
        return smileImg;
      case "sad":
        return sadImg;
      case "supprise":
        return suppriseImg;
      case "heart":
        return heartImg;
      case "like":
        return likeImg;
      case "angry":
        return angryImg;
      default:
        return null;
    }
  };

  return (
    <Modal
      show={showModalInfo}
      onHide={handleCloseModal}
      dialogClassName="modal-dialog-centered"
      className="tw-min-w-[50vh]"
    >
      <Modal.Header closeButton>
        <Modal.Title>
          <span className="tw-text-[20px] tw-min-w-[50vh]">Reaction</span>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className=" tw-min-w-[50vh]">
        <Tab.Container
          className="tw-flex"
          defaultActiveKey={"all"}
          activeKey={activeTab}
          onSelect={(selectedTab) => setActiveTab(selectedTab)}
        >
          <div className="tw-max-h-[50vh] tw-min-h-[50vh] tw-min-w-[50vh] tw-w-full tw-flex">
            <Col md={3} className="tw-border tw-h-full tw-min-h-[50vh]">
              <Nav>
                {Object.keys(reactionsData).map((tabName, index) => (
                  <Nav.Item className="tw-w-full" key={index}>
                    <Nav.Link
                      eventKey={tabName}
                      style={{
                        backgroundColor:
                          activeTab === tabName ? "#e5efff" : "transparent", color: 'black',
                        padding: 0,
                      }}
                    >
                      {tabName === "all" ? (
                        <div className="tw-flex tw-justify-between tw-px-3 tw-py-2">
                          <span>All</span>
                          <span style={{ marginLeft: 5 }}>{reactionCounts[tabName] ? Object.keys(reactionCounts[tabName]).length : 0}</span>
                        </div>
                      ) : (
                        <div className="tw-flex tw-justify-between tw-px-3 tw-py-2">
                          <img
                            src={getEmojiImage(tabName)}
                            alt={tabName}
                            style={{ width: 20, height: 20 }}
                          />
                          <span style={{ marginLeft: 5 }}>{reactionCounts[tabName] ? Object.keys(reactionCounts[tabName]).length : 0}</span>
                        </div>
                      )}
                    </Nav.Link>
                  </Nav.Item>
                ))}
              </Nav>
            </Col>
            <Col md={9} className="tw-border tw-h-full tw-min-h-[50vh]">
              <Tab.Content>
                {Object.keys(reactionsData).map((tabName, index) => (
                  <Tab.Pane key={index} eventKey={tabName}>
                    <ul>
                      {reactionsData[tabName].map((user, userIndex) => (
                        <div className="tw-flex tw-py-2 tw-justify-between" key={userIndex}>
                          <div className="tw-flex">
                            <img
                              src="https://firebasestorage.googleapis.com/v0/b/chatservice-d1f1c.appspot.com/o/avatars%2FavatarGroup.jpg?alt=media&token=cc85e7a4-6bbc-40d2-941c-313db77a2745"
                              alt="avatar"
                              style={{ width: 30, height: 30, marginRight: 15 }}
                            />
                            <span>{user}</span>
                          </div>
                          <div className="tw-flex tw-pr-2">
                            <div className="tw-flex">
                              {reactionIcons[tabName][user].map((icon, iconIndex) => (
                                <img
                                  key={iconIndex}
                                  src={icon}
                                  alt="reaction"
                                  style={{ width: 20, height: 20, marginLeft: 5 }}
                                />
                              ))}
                            </div>
                            <span style={{ marginLeft: 5 }}>{reactionCounts[tabName][user]}</span>
                          </div>

                        </div>
                      ))}
                    </ul>
                  </Tab.Pane>
                ))}
              </Tab.Content>
            </Col>
          </div>
        </Tab.Container>
      </Modal.Body>
    </Modal>
  );
};

export default ModalReactionInfo;
