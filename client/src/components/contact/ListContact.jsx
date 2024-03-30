import { faUsers } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState, useEffect, useCallback } from "react";
import {
  Container,
  Form,
  FormControl,
  Button,
  Dropdown,
  DropdownButton,
  ListGroup,
} from "react-bootstrap";
import { GET_ALL_USER } from "../../router/ApiRoutes";
import axios from "axios";
import { useStateProvider } from "../../context/StateContext";
import GroupCard from "./card/GroupCard";

const ListContact = ({ data }) => {

  const [searchTerm, setSearchTerm] = useState("");
  const [friendList, setFriendList] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [{ userInfo, groups }] = useStateProvider();

  // const [letter, setLetter] = useState({});

  // const convertLetter = useCallback(() => {
  //   const usersGroupsByInitialLetter = {};
  //   if (friendList) {
  //     friendList.forEach((user) => {
  //       const initialLetter = user.displayName.charAt(0).toUpperCase();
  //       if (!usersGroupsByInitialLetter[initialLetter]) {
  //         usersGroupsByInitialLetter[initialLetter] = [];
  //       }
  //       usersGroupsByInitialLetter[initialLetter].push(user);
  //     });
  //   }

  //   setLetter(usersGroupsByInitialLetter);
  // }, [friendList]);

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const { data } = await axios.get(GET_ALL_USER + userInfo?.id);
  //       console.log(data);
  //       setFriendList(data.data?.friends);
  //     } catch (error) {
  //       console.error("Error fetching data:", error);
  //     }
  //   };

  //   fetchData();
  // }, [userInfo?.id]);

  // useEffect(() => {
  //   convertLetter();
  // }, [friendList, convertLetter]);

  const handleSearch = () => {
    const results = friendList.filter((friend) =>
      friend.displayName.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setSearchResults(results);
  };

  const handleFilterSelect = (selectedFilter) => {
    console.log(`Selected filter: ${selectedFilter}`);
  };

  return (
    <div className="px-3" style={{ backgroundColor: '#2b2d31', height: '100vh' }}>
      <div className="friend-list-header">
        <h2>
          <FontAwesomeIcon
            icon={faUsers}
            style={{ fontSize: "22px", marginRight: 12 }}
            color="white"
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
        <Button
          variant="outline-secondary"
          onClick={handleSearch}
          style={{ marginRight: "20px" }}
        >
          Search
        </Button>

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
      {searchResults.length > 0 && (
        <ListGroup className="mt-5">
          {searchResults.map((friend) => (
            <ListGroup.Item key={friend.id}>{friend.displayName}</ListGroup.Item>
          ))}
        </ListGroup>
      )}
      {/* {Object.entries(letter).map(([initialLetter, friendList]) => {
        return (
          <div key={Date.now() + initialLetter}>
            <div className='tw-pl-5 tw-py-5 tw-font-bold tw-text-2xl' >{initialLetter}</div>
            {groups.map(group => (
              {if(group.type == "private"){
                <FriendCard friend={group} key={group.chatId} />
              }}
            ))}
          </div>
        );
      })} */}
      {Array.isArray(groups) && groups.map((el) => {
        if (el.type === "private") {
          return <GroupCard chat={el} key={el.chatId} />;
        }
        return null;
      })}
    </div>
  );
};

export default ListContact;
