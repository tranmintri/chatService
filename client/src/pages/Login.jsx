import { faMobileScreen, faLock } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { Col, Row, Form, Button } from "react-bootstrap";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import { useNavigate } from "react-router-dom";

const PhoneBox = () => {
  const [isButtonLoginDisabled, setButtonLoginDisabled] = useState(true);
  const [isPhoneNumber, setPhoneNumber] = useState("");
  const [isPassword, setPassword] = useState("");
  const [isCheckValid, setCheckValid] = useState("");
  const [isVisibleLoginWithMyPhone, setVisibleLoginWithMyPhone] =
    useState(true);

  useEffect(() => {
    if (isPhoneNumber.length === 0) {
      setButtonLoginDisabled(true);
      return;
    }
    if (isPassword.length === 0) {
      setButtonLoginDisabled(true);
      return;
    }
    setButtonLoginDisabled(false);
  });

  const navigate = useNavigate();
  function clickLogin() {
    if (isNaN(isPhoneNumber)) {
      setCheckValid("Số điện thoại chưa đúng định dạng");
      return;
    }
    if (isPhoneNumber.length !== 10) {
      setCheckValid("Số điện thoại chưa đúng định dạng");
      return;
    }

    navigate("/");
  }

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        padding: 40,
      }}
    >
      {/* Form Text Số điện thoại */}
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
            icon={faMobileScreen}
            style={{ fontSize: 20, marginRight: 10 }}
          />
        </div>
        <div style={{ display: "flex", flex: 1 }}>
          <Form.Control
            key="phoneNumber"
            type="text"
            placeholder="Số điện thoại"
            style={{ border: "none", with: "100%" }}
            value={isPhoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
          ></Form.Control>
        </div>
      </div>
      {/* Form Text Password */}
      <div
        className="mb-1"
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          flex: 1,
          width: "100%",
          borderBottom: "0.5px solid silver",
          paddingBottom: 2,
        }}
        hidden={!isVisibleLoginWithMyPhone}
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
            placeholder="Mật khẩu"
            style={{ border: "none", with: "100%" }}
            value={isPassword}
            onChange={(e) => setPassword(e.target.value)}
          ></Form.Control>
        </div>
      </div>
      <div className="mb-1" hidden={!isVisibleLoginWithMyPhone}>
        <a style={{ color: "red", fontSize: 13 }}>{isCheckValid}</a>
      </div>
      {/* Btn đăng nhập với mật khẩu */}
      <div style={{ paddingBottom: 10 }} hidden={!isVisibleLoginWithMyPhone}>
        <Button
          disabled={isButtonLoginDisabled}
          style={{ paddingRight: "50px", paddingLeft: "50px" }}
          onClick={clickLogin}
        >
          Đăng nhập với mật khẩu
        </Button>
      </div>
      {/* Đăng nhập bằng thiets bị di động */}
      <div style={{ paddingBottom: 10 }} hidden={!isVisibleLoginWithMyPhone}>
        <Button
          variant="light"
          style={{
            paddingRight: "20px",
            paddingLeft: "20px",
            border: "1px solid #cfcfcf",
          }}
          onClick={() => {
            setVisibleLoginWithMyPhone(false);
          }}
        >
          Đăng nhập bằng thiết bị di động
        </Button>
      </div>
      {/* Đăng ký */}
      <div hidden={!isVisibleLoginWithMyPhone}>
        <a
          href=""
          style={{ color: "", textDecoration: "none" }}
          onClick={() => {
            navigate("/register");
          }}
        >
          Tạo tài khoản
        </a>
      </div>
      {/* Quên mật khẩu */}
      <div hidden={!isVisibleLoginWithMyPhone}>
        <a
          href=""
          style={{ color: "black" }}
          onClick={() => {
            navigate("/forgotpassword");
          }}
        >
          Quên mật khẩu?
        </a>
      </div>

      {/* Phần đăng nhập bằng thiết bị di động */}
      {/* Btn đồng ý trong đăng nhập bằng thiết bị di động */}
      <div
        className="mb-1"
        style={{ color: "#afafaf", fontSize: 13, textAlign: "center" }}
        hidden={isVisibleLoginWithMyPhone}
      >
        Chúng tôi sẽ gửi một yêu cầu đăng nhập đến ứng dụng Zalo trên thiết bị
        của bạn.
      </div>
      <div style={{ paddingBottom: 10 }} hidden={isVisibleLoginWithMyPhone}>
        <Button
          style={{ paddingRight: "110px", paddingLeft: "110px" }}
          onClick={clickLogin}
        >
          Đồng ý
        </Button>
      </div>
      <div hidden={isVisibleLoginWithMyPhone}>
        <a
          href=""
          style={{ color: "black", textDecoration: "none" }}
          onClick={() => {
            setVisibleLoginWithMyPhone(true);
          }}
        >
          Quay lại
        </a>
      </div>
    </div>
  );
};

const Login = () => {
  return (
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
          <a style={{ textAlign: "center" }}>Đăng nhập tài khoản Zalo</a>
        </Row>
        <Row>
          <a style={{ textAlign: "center" }}>
            để kết nối với ứng dụng Zalo Web
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
              <Tabs
                defaultActiveKey="Phone"
                style={{ flex: 1 }}
                variant="underline"
                fill
              >
                <Tab
                  eventKey="QR"
                  title={<span style={{ color: "black" }}>Quét mã QR</span>}
                >
                  <div
                    style={{
                      height: "100%",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  ></div>
                </Tab>
                <Tab
                  eventKey="Phone"
                  title={
                    <span style={{ color: "black" }}>Với số điện thoại</span>
                  }
                >
                  <PhoneBox />
                </Tab>
              </Tabs>
            </div>
          </Col>
          <Col></Col>
        </Row>
      </div>
    </div>
  );
};
export default Login;
