import React, { useState, useEffect } from "react";
import { Modal, Button, Tab, Col, Nav } from "react-bootstrap";
import smileImg from "../../../assets/smile.png";
import sadImg from "../../../assets/sad.png";
import suppriseImg from "../../../assets/supprise.png";
import heartImg from "../../../assets/heart.png";
import likeImg from "../../../assets/like.png";
import angryImg from "../../../assets/angry.png";
import { useStateProvider } from "../../../context/StateContext";
import axios from "axios";
import { GET_ALL_USER } from "../../../router/ApiRoutes";

const ModalReactionInfo = ({
  showModalInfo,
  handleCloseModal,
  reactionInfo,
}) => {
  const [{ reactionList }] = useStateProvider();
  const [userByType, setUserByType] = useState([]);
  const [active, setActive] = useState(-2);
  const uniqueTypeCounts = {};

  // Duyệt qua danh sách reactionList để lọc và đếm số lượng phản ứng cho mỗi loại type không trùng lặp
  reactionInfo.forEach((reaction) => {
    const { type } = reaction;
    uniqueTypeCounts[type] = (uniqueTypeCounts[type] || 0) + 1;
  });

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

  const getAllUserByType = async (type, index) => {
    // Lọc các phản ứng theo type
    console.log(index);
    setActive(index);
    if (type == "All") {
      try {
        const response = await axios.get(GET_ALL_USER);
        // Lọc danh sách người dùng từ response.data.data theo senderId của filteredReactions
        const filteredUsers = response.data.data.filter((user) =>
          reactionInfo.some((reaction) => reaction.senderId === user.id)
        );
        console.log(filteredUsers);
        setUserByType(filteredUsers);
      } catch (error) {
        console.error("Error fetching user list:", error);
      }
    } else {
      const filteredReactions = reactionInfo.filter(
        (reaction) => reaction.type === type
      );
      try {
        const response = await axios.get(GET_ALL_USER);
        // Lọc danh sách người dùng từ response.data.data theo senderId của filteredReactions
        const filteredUsers = response.data.data.filter((user) =>
          filteredReactions.some((reaction) => reaction.senderId === user.id)
        );
        console.log(filteredUsers);
        setUserByType(filteredUsers);
      } catch (error) {
        console.error("Error fetching user list:", error);
      }
    }
  };
  const filterTypeByUserId = (userId) => {
    return reactionInfo.filter((reaction) => reaction.senderId == userId);
  };

  return (
    <div style={{ backgroundColor: "rgba(184, 162, 162, 0.5)" }}>
      <Modal
        show={showModalInfo}
        onHide={handleCloseModal}
        className="tw-min-w-[50vh]"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>
            <span className="tw-text-[20px] tw-min-w-[50vh]">Reaction</span>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="tw-min-w-[50vh] tw-min-h-[50vh] tw-max-h-[60vh] tw-border-2 ">
          <div className="tw-flex tw-h-full tw-w-full tw-border-2 tw-border-gray-300">
            <div className="tw-w-3/12 tw-min-h-[50vh] tw-bg-gray-200 tw-max-h-[50vh] tw-border-r-2 tw-border-gray-300">
              <div
                className={`tw-px-3 tw-py-2 tw-border-b-2 tw-border-gray-100 hover:tw-bg-gray-300 ${
                  active === -1 ? "tw-bg-gray-300" : "tw-bg-gray-200"
                } `}
                onClick={() => getAllUserByType("All", -1)}
              >
                <span>All</span>
              </div>
              <div>
                {Object.keys(uniqueTypeCounts).map((type, index) => (
                  <div
                    className={`tw-flex tw-justify-between tw-px-3 tw-py-2 tw-border-b-2 tw-border-gray-100 ${
                      active == index ? "tw-bg-gray-300" : "tw-bg-gray-200"
                    } hover:tw-bg-gray-300`}
                    key={index}
                    onClick={() => getAllUserByType(type, index)}
                  >
                    <img
                      src={getEmojiImage(type)}
                      alt={type}
                      style={{ width: 20, height: 20 }}
                    />
                    <span className="tw-ml-5 tw-text-sm ">
                      {uniqueTypeCounts[type] ? uniqueTypeCounts[type] : 0}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <div className="tw-w-9/12  tw-h-full tw-min-h-[50vh] tw-max-h-[50vh] ">
              {userByType.map((user, userIndex) => (
                <div
                  className="tw-flex tw-py-2 tw-justify-start tw-items-center tw-border-b-2"
                  key={userIndex}
                >
                  <div className="tw-flex tw-w-full tw-justify-start tw-items-center tw-pl-3">
                    <div className="tw-w-2/12 tw-mr-5">
                      <img
                        src={user.profilePicture}
                        alt="avatar"
                        className="tw-w-12 "
                      />
                    </div>
                    <div className="tw-w-7/12 ">
                      <span>{user.display_name}</span>
                    </div>
                    <div className="tw-w-2/12 tw-flex tw-justify-end tw-items-center tw-mr-3">
                      {filterTypeByUserId(user.id).map((reaction, index) => (
                        <img
                          key={index}
                          src={getEmojiImage(reaction.type)}
                          alt={reaction.type}
                          style={{ width: 20, height: 20 }}
                        />
                      ))}
                    </div>
                    <div className="tw-w-1/12">
                      {filterTypeByUserId(user.id).length}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default ModalReactionInfo;
