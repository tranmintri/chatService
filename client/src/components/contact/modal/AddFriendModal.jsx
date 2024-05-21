import React, { useState } from "react";
import { Modal, Button, Form, Dropdown, DropdownButton } from "react-bootstrap";
import AddFriendCard from "../card/AddFriendCard";
import { useStateProvider } from "../../../context/StateContext";
import { GET_ALL_USER } from "../../../router/ApiRoutes";
import axios from "axios";

const AddFriendModal = ({
  showModal,
  handleCloseModal,
  userList,
  setFriendList,
  sendFriendDataToSidebar,
}) => {
  const [{ userInfo }] = useStateProvider();
  const [selectedCountryCode, setSelectedCountryCode] = useState("+84");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [searchResults, setSearchResults] = useState(null);

  const handlePhoneNumberChange = (event) => {
    setPhoneNumber(event.target.value);
  };

  const handleSearch = async () => {
    try {
      const { data } = await axios.get(GET_ALL_USER);
      const results = data.data.filter(
        (user) => user.phone === phoneNumber && user.id !== userInfo?.id
      );

      if (results.length > 0) {
        setSearchResults(results[0]);
      } else {
        setSearchResults(null);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleEnterPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
      e.preventDefault();
    }
  };

  const handleModalClose = () => {
    setPhoneNumber("");
    setSelectedCountryCode("+84");
    setSearchResults(null);
    handleCloseModal();
  };

  const countryCodes = [
    { code: "+1", country: "United States" },
    { code: "+1", country: "Canada" },
    // Add more country codes if needed
  ];

  const handleSelectCountryCode = (code) => {
    setSelectedCountryCode(code);
  };

  // Function to send friend data to Sidebar
  const handleSendFriendDataToSidebar = (friendData) => {
    // Pass friendData to the Sidebar component
    sendFriendDataToSidebar(friendData);
  };

  return (
    <Modal show={showModal} onHide={handleCloseModal} centered>
      <Modal.Header closeButton>
        <Modal.Title style={{ fontSize: "20px" }}>
          Send friend request
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group controlId="formFriendName">
            <Form.Label>Enter phone number:</Form.Label>
            <div className="input-group">
              <Button
                // id="dropdown-area-code"
                title={selectedCountryCode}
                className="mr-2 tw-text-white"
              >
                {selectedCountryCode}
              </Button>
              <Form.Control
                type="text"
                placeholder="Enter phone number"
                value={phoneNumber}
                onChange={handlePhoneNumberChange}
                onKeyPress={handleEnterPress}
              />
            </div>
          </Form.Group>

          {searchResults ? (
            <AddFriendCard
              searchResults={searchResults}
              handleCloseModal={handleModalClose}
              setFriendList={setFriendList}
              sendFriendDataToModal={handleSendFriendDataToSidebar} // Pass callback function
            />
          ) : (
            <div>No result</div>
          )}
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleModalClose}>
          Close
        </Button>
        <Button variant="primary" onClick={handleSearch}>
          Search
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AddFriendModal;
