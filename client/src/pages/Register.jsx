import { faLock, faEnvelope } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { Col, Row, Form, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const Box = () => {
  const navigate = useNavigate();
  const [isHoTen, setHoTen] = useState("");
  const [isSoDienThoai, setSoDienThoai] = useState("");
  const [isNgaySinh, setNgaySinh] = useState("");
  const [isGioiTinh, setGioiTinh] = useState("male");
  const [isNextStep, setNextStep] = useState(true);
  const [isVerificationOnForm, setVerificationOnForm] = useState("");
  const [isCheckVailidHoTen, setCheckValidHoTen] = useState("");
  const [isCheckValidPhone, setCheckValidPhone] = useState("");
  const [isNewPassword, setNewPassword] = useState("");
  const [isConfirmNewPassword, setConfirmNewPassword] = useState("");
  const [isCheckValidNewPassword, setCheckValidNewPassWord] = useState("");
  const [isCheckValidConfirmNewPassword, setCheckValidConfirmNewPassWord] =
    useState("");

  const regex = /^[a-zA-Z\s]+$/;

  function CheckValid() {
    if (isHoTen.length === 0) {
      setCheckValidHoTen("Họ tên không được để trống");
      return;
    }
    if (!regex.test(isHoTen)) {
      setCheckValidHoTen("Họ tên chỉ chứa chữ cái và khoảng trắng");
      return;
    }
    setCheckValidHoTen("");
    if (isNaN(isSoDienThoai)) {
      setCheckValidPhone("Số điện thoại chỉ chứa chữ số");
      return;
    }
    if (!isSoDienThoai.startsWith("0")) {
      setCheckValidPhone("Số điện thoại phải bắt đầu bằng số 0");
      return;
    }
    if (isSoDienThoai.length !== 10) {
      setCheckValidPhone("Số điện thoại phải có 10 số");
      return;
    }
    setCheckValidPhone("");
    setNextStep(false);
  }

  const handleGenderChange = (event) => {
    setGioiTinh(event.target.value);
  };

  function CheckNewPassword() {
    if (isNewPassword.length === 0) {
      setCheckValidNewPassWord("Không được để trống");
      return;
    }
    if (isNewPassword.length < 6) {
      setCheckValidNewPassWord("Mật khẩu phải có 6 kí tự trở lên");
      return;
    }
    setCheckValidNewPassWord("");
    if (isNewPassword !== isConfirmNewPassword) {
      setCheckValidConfirmNewPassWord("Xác nhận mật khẩu không giống");
      return;
    }
    setCheckValidConfirmNewPassWord("");
    navigate("/login");
  }

  return (
    <div>
      <div
        hidden={!isNextStep}
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          padding: 40,
        }}
      >
        <div
          className="mb-4"
          style={{ fontSize: 15, textAlign: "center", fontWeight: "bold" }}
        >
          Sign up for an account
        </div>
        {/* Họ và tên */}
        <div
          className="mb-3"
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            flex: 1,
            width: "100%",
            borderBottom: "0.5px solid silver",
            paddingBottom: 2,
          }}
        >
          <div style={{ display: "flex", flex: 1 }}>
            <Form.Control
              type="text"
              placeholder="Họ và tên"
              style={{ border: "none", with: "100%" }}
              value={isHoTen}
              onChange={(e) => setHoTen(e.target.value)}
            ></Form.Control>
          </div>
        </div>
        <div className="mb-1">
          <a style={{ color: "red", fontSize: 13 }}>{isCheckVailidHoTen}</a>
        </div>
        {/* Số điện thoại */}
        <div
          className="mb-3"
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            flex: 1,
            width: "100%",
            borderBottom: "0.5px solid silver",
            paddingBottom: 2,
          }}
        >
          <div style={{ display: "flex", flex: 1 }}>
            <Form.Control
              type="text"
              placeholder="Số điện thoại"
              style={{ border: "none", with: "100%" }}
              value={isSoDienThoai}
              onChange={(e) => setSoDienThoai(e.target.value)}
            ></Form.Control>
          </div>
        </div>
        <div className="mb-1">
          <a style={{ color: "red", fontSize: 13 }}>{isCheckValidPhone}</a>
        </div>
        {/* Ngày sinh */}
        <div
          className="mb-3"
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            flex: 1,
            width: "100%",
            borderBottom: "0.5px solid silver",
            paddingBottom: 2,
          }}
        >
          <div style={{ display: "flex", flex: 1 }}>
            <Form.Control
              type="text"
              placeholder="Ngày sinh"
              style={{ border: "none", with: "100%" }}
              // value={isSoDienThoai}
              // onChange={(e) =>setSoDienThoai(e.target.value)}
            ></Form.Control>
          </div>
        </div>
        {/* Giới tính */}
        <div
          className="mb-4"
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            flex: 1,
            width: "100%",
            borderBottom: "0.5px solid silver",
            paddingBottom: 2,
          }}
        >
          <div style={{ display: "flex", flex: 1 }}>
            <Form>
              <Form.Group>
                <div>
                  <Form.Label>Giới tính:</Form.Label>
                </div>
                <Form.Check inline>
                  <Form.Check.Input
                    type="radio"
                    name="gender"
                    value="male"
                    checked={isGioiTinh === "male"}
                    onChange={handleGenderChange}
                  />
                  <Form.Check.Label>Nam</Form.Check.Label>
                </Form.Check>
                <Form.Check inline>
                  <Form.Check.Input
                    type="radio"
                    name="gender"
                    value="female"
                    checked={isGioiTinh === "female"}
                    onChange={handleGenderChange}
                  />
                  <Form.Check.Label>Nữ</Form.Check.Label>
                </Form.Check>
              </Form.Group>
            </Form>
          </div>
        </div>
        {/* Btn Xác nhận */}
        <div style={{ paddingBottom: 15 }}>
          <Button
            style={{ paddingRight: "110px", paddingLeft: "110px" }}
            onClick={CheckValid}
          >
            Xác nhận
          </Button>
        </div>
      </div>
      <div hidden={!isNextStep} style={{ display: "flex" }}>
        <a
          href=""
          style={{ color: "black", textDecoration: "none" }}
          onClick={() => {
            navigate("/login");
          }}
        >
          &lt;&lt;Back to login
        </a>
      </div>
      <div
        hidden={isNextStep}
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          padding: 40,
        }}
      >
        <div
          className="mb-4"
          style={{ fontSize: 15, textAlign: "center", fontWeight: "bold" }}
        >
          Sign up for an account
        </div>
        {/* Nhập mã xác nhận */}
        <div
          className="mb-3"
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            flex: 1,
            width: "100%",
            borderBottom: "0.5px solid silver",
            paddingBottom: 2,
          }}
        >
          <div>
            <FontAwesomeIcon
              icon={faEnvelope}
              style={{ fontSize: 20, marginRight: 10 }}
            />
          </div>
          <div style={{ display: "flex", flex: 1 }}>
            <Form.Control
              type="text"
              placeholder="Mã xác nhận"
              style={{ border: "none", with: "100%" }}
              value={isVerificationOnForm}
              onChange={(e) => setVerificationOnForm(e.target.value)}
            ></Form.Control>
          </div>
        </div>
        <div
          className="mb-1"
          style={{ color: "#afafaf", fontSize: 13, textAlign: "center" }}
        >
          We'll send a confirmation code via your phone number
        </div>
        {/* Nhập mật khẩu mới */}
        <div
          className="mb-3"
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            flex: 1,
            width: "100%",
            borderBottom: "0.5px solid silver",
            paddingBottom: 2,
          }}
        >
          <div>
            <FontAwesomeIcon
              icon={faLock}
              style={{ fontSize: 20, marginRight: 10 }}
            />
          </div>
          <div style={{ display: "flex", flex: 1 }}>
            <Form.Control
              type="password"
              placeholder="Mật khẩu mới"
              style={{ border: "none", with: "100%" }}
              value={isNewPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            ></Form.Control>
          </div>
        </div>
        <div className="mb-1">
          <a style={{ color: "red", fontSize: 13 }}>
            {isCheckValidNewPassword}
          </a>
        </div>
        {/* Xác nhận mật khẩu mới */}
        <div
          className="mb-3"
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            flex: 1,
            width: "100%",
            borderBottom: "0.5px solid silver",
            paddingBottom: 2,
          }}
        >
          <div>
            <FontAwesomeIcon
              icon={faLock}
              style={{ fontSize: 20, marginRight: 10 }}
            />
          </div>
          <div style={{ display: "flex", flex: 1 }}>
            <Form.Control
              type="password"
              placeholder="Xác nhận mật khẩu mới"
              style={{ border: "none", with: "100%" }}
              value={isConfirmNewPassword}
              onChange={(e) => setConfirmNewPassword(e.target.value)}
            ></Form.Control>
          </div>
        </div>
        <div className="mb-1">
          <a style={{ color: "red", fontSize: 13 }}>
            {isCheckValidConfirmNewPassword}
          </a>
        </div>
        {/* Btn Đăng ký */}
        <div style={{ paddingBottom: 15 }}>
          <Button
            style={{ paddingRight: "110px", paddingLeft: "110px" }}
            onClick={CheckNewPassword}
          >
            Register
          </Button>
        </div>
      </div>
      <div hidden={isNextStep} style={{ display: "flex" }}>
        <a
          href=""
          style={{ color: "black", textDecoration: "none" }}
          onClick={() => {
            setNextStep(true);
          }}
        >
          &lt;&lt;Back
        </a>
      </div>
    </div>
  );
};

const Register = () => {
  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          height: "100vh",
          backgroundColor: "#aad6ff",
        }}
      >
        <div
          style={{
            justifyContent: "center",
            alignItems: "center",
            width: "500px",
            marginTop: "5%",
          }}
        >
          <Row>
            <a
              style={{
                fontSize: 50,
                fontWeight: "bold",
                color: "#0e6af6",
                textAlign: "center",
              }}
            >
              ZALO
            </a>
          </Row>
          <Row>
            <a style={{ textAlign: "center" }}>Register Zalo account</a>
          </Row>
          <Row>
            <a style={{ textAlign: "center" }}>
              to connect to Zalo Web application
            </a>
          </Row>
          <Row style={{ marginTop: 10 }}>
            <Col></Col>
            <Col
              xs={9}
              style={{
                display: "flex",
                with: "100%",
                backgroundColor: "white",
                paddingTop: 10,
                paddingBottom: 20,
              }}
            >
              <div style={{ flex: 1 }}>
                <Box></Box>
              </div>
            </Col>
            <Col></Col>
          </Row>
        </div>
      </div>
    </div>
  );
};

export default Register;
