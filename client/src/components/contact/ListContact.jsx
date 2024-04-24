import { faUsers } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState, useEffect, useCallback } from "react";
import {
  Form,
  FormControl,
  DropdownButton,
  Dropdown,
  ListGroup,
} from "react-bootstrap";
import { GET_ALL_USER } from "../../router/ApiRoutes";
import axios from "axios";
import { useStateProvider } from "../../context/StateContext";
import { MdDelete } from "react-icons/md";
import { Modal, Button } from "react-bootstrap";

const ListContact = ({ data }) => {
  const [searchResults, setSearchResults] = useState([]);
  const [{ userInfo }] = useStateProvider();
  const [friends, setFriends] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [modalShow, setModalShow] = useState(false);
  const [currentFriendId, setCurrentFriendId] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      const { data } = await axios.get(GET_ALL_USER);
      const userData = data.data.find((user) => user.id === userInfo.id);
      setFriends(userData?.friends);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }, [userInfo.id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    // Filter friends based on search term
    const results = friends?.filter((friend) =>
      friend.displayName.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setSearchResults(results);
  }, [searchTerm, friends]);

  const handleDelete = (id) => {
    setCurrentFriendId(id);
    setModalShow(true);
  };

  const confirmDelete = async () => {
    await DeleteFriend(currentFriendId);
    console.log(currentFriendId);
    setModalShow(false);
  };

  const DeleteFriend = async (id) => {
    try {
      const response = await axios.post(
        GET_ALL_USER + "delete/" + userInfo.id,
        { data: { id } }
      );
      console.log(response);
      fetchData(); // Fetch data again after deleting a friend
    } catch (error) {
      console.log(error);
    }
  };
  const handleFilterSelect = (option) => {
    let sortedResults;
    switch (option) {
      case "Option 1":
        sortedResults = [...searchResults].sort((a, b) =>
          a.displayName.localeCompare(b.displayName)
        );
        break;
      case "Option 2":
        sortedResults = [...searchResults].sort((a, b) =>
          b.displayName.localeCompare(a.displayName)
        );
        break;
      default:
        sortedResults = searchResults;
    }
    setSearchResults(sortedResults);
  };
  return (
    <div className="px-3" style={{ backgroundColor: "white", height: "100vh" }}>
      <div className="friend-list-header">
        <h2>
          <FontAwesomeIcon
            icon={faUsers}
            style={{ fontSize: "22px", marginRight: 12 }}
            color="black"
          />
          Friends list
        </h2>
        <span>You can see your friends list here</span>
      </div>
      <Form
        inline
        className="d-flex justify-content-center"
        style={{ marginTop: "20px" }}
      >
        <FormControl
          type="text"
          placeholder=" Find your friends..."
          className="mr-sm-2"
          style={{ width: "50%", marginRight: "10px" }}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <DropdownButton
          id="filter-dropdown"
          title="Sort by"
          variant="secondary"
          className="filter-az"
        >
          <Dropdown.Item onClick={() => handleFilterSelect("Option 1")}>
            Name (A-Z)
          </Dropdown.Item>
          <Dropdown.Item onClick={() => handleFilterSelect("Option 2")}>
            Name (Z-A)
          </Dropdown.Item>
        </DropdownButton>
      </Form>
      <ListGroup className="mt-5">
        {searchResults?.map((friend, index) => (
          <div
            key={index}
            className="tw-flex tw-items-center tw-w-full tw-border-b-2 hover:tw-bg-slate-100 tw-p-2 tw-text-black"
          >
            <div>
              <img
                src={friend.profilePicture}
                className="tw-w-14"
                alt={friend.displayName}
              />
            </div>
            <div className="tw-flex-1 tw-ml-10">
              <span className="tw-font-semibold tw-text-xl">
                {friend.displayName}
              </span>
            </div>
            <button onClick={() => handleDelete(friend.id)}>
              <MdDelete className="tw-text-2xl tw-flex tw-items-end" />
            </button>
          </div>
        ))}
      </ListGroup>
      <Modal show={modalShow} onHide={() => setModalShow(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete this friend?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setModalShow(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={confirmDelete}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ListContact;
