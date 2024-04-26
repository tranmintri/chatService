import { faUserGroup } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import {
  Button,
  Container,
  Dropdown,
  DropdownButton,
  Form,
  FormControl,
  ListGroup,
} from "react-bootstrap";
import { useStateProvider } from "../../context/StateContext";
import GroupCard from "./card/GroupCard";

const ListGroups = ({ data }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [groupList, setGroupList] = useState([]);
  const [{ userInfo, groups }] = useStateProvider();

  const [searchResults, setSearchResults] = useState([]);

  const handleSearch = () => {
    const results = groupList.filter((group) =>
      group.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setSearchResults(results);
  };

  const handleFilterSelect = (selectedFilter) => {
    // Xử lý sự kiện khi lựa chọn filter
    console.log(`Selected filter: ${selectedFilter}`);
  };
  return (
    <div className="px-3" style={{ backgroundColor: "white", height: "100vh" }}>
      <div className="group-list-header">
        <h2>
          {" "}
          <FontAwesomeIcon
            icon={faUserGroup}
            style={{ fontSize: "22px", marginRight: 12 }}
            color="black"
          />{" "}
          Group list
        </h2>
        <span>You can see your group list here</span>
      </div>
      <Form
        inline
        className="d-flex justify-content-center"
        style={{ marginTop: "20px" }}
      >
        <FormControl
          type="text"
          placeholder=" Find your groups..."
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
            Group Name (A-Z)
          </Dropdown.Item>
          <Dropdown.Item onClick={() => handleFilterSelect("Option 2")}>
            Group Name (Z-A)
          </Dropdown.Item>
        </DropdownButton>
      </Form>
      {Array.isArray(groups) &&
        groups.map((el) => {
          if (el.type === "public") {
            return <GroupCard chat={el} key={el.chatId} />;
          }
          return null;
        })}
    </div>
  );
};
export default ListGroups;
