import avatar from "../assets/2Q.png";
import React, { useEffect, useState } from "react";
import { Container, Row, Col, Image, Button, Form } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen } from "@fortawesome/free-solid-svg-icons";
import Avatar from "react-avatar";
import { useGetUser } from "../apis/useGetUser";

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [birthdate, setBirthdate] = useState("");
  const [gender, setGender] = useState("male");
  const [phone, setPhone] = useState("");

  const { user } = useGetUser();

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSaveClick = () => {
    setIsEditing(false);
    // Thực hiện lưu thông tin người dùng vào cơ sở dữ liệu hoặc các xử lý khác ở đây
  };
  const handleCancelClick = () => {
    setIsEditing(false);
  };

  return (
    <Container className="mt-5 d-flex align-items-center justify-content-center mx-auto">
      <Col md={6} className="text-center">
        <Image src={avatar} roundedCircle fluid />
      </Col>
      <Col md={6}>
        <div className="d-flex align-items-center">
          <h2 className="mr-3">Le Thanh Hai</h2>
          {isEditing ? (
            <>
              <Button
                className="ml-3"
                variant="primary"
                onClick={handleSaveClick}
              >
                Save Profile
              </Button>
              <Button
                variant="secondary"
                className="ml-3"
                onClick={handleCancelClick}
              >
                Cancel
              </Button>
            </>
          ) : (
            <Button className="ml-3" variant="link" onClick={handleEditClick}>
              <FontAwesomeIcon icon={faPen} style={{ fontSize: "20px" }} />
            </Button>
          )}
        </div>
        <Form>
          <Form.Group controlId="formBasicName" className="mb-3">
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Le Thanh Hai"
              disabled={!isEditing}
            />
          </Form.Group>
          <Form.Group controlId="formBasicGender" className="mb-3">
            <Form.Label>Gender</Form.Label>
            <div>
              <Form.Check
                type="radio"
                label="Male"
                name="gender"
                id="male"
                onChange={() => setGender("male")}
                checked={gender === "male"}
                disabled={!isEditing}
              />
              <Form.Check
                type="radio"
                label="Female"
                name="gender"
                id="female"
                onChange={() => setGender("female")}
                checked={gender === "female"}
                disabled={!isEditing}
              />
            </div>
          </Form.Group>
          <Form.Group controlId="formBasicEmail" className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              placeholder="user@example.com"
              disabled={!isEditing}
            />
          </Form.Group>
          <Form.Group controlId="formBasicPhone" className="mb-3">
            <Form.Label>Phone</Form.Label>
            <Form.Control
              type="tel"
              placeholder="Enter your phone number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              disabled={!isEditing}
            />
          </Form.Group>
          <Form.Group controlId="formBasicBirthdate" className="mb-3">
            <Form.Label>Birthdate</Form.Label>
            <Form.Control
              type="date"
              value={birthdate}
              onChange={(e) => setBirthdate(e.target.value)}
              disabled={!isEditing}
            />
          </Form.Group>
          <Form.Group controlId="formBasicLocation" className="mb-3">
            <Form.Label>Location</Form.Label>
            <Form.Control
              type="text"
              placeholder="City, Country"
              disabled={!isEditing}
            />
          </Form.Group>
        </Form>
      </Col>
    </Container>
  );
};
export default Profile;
