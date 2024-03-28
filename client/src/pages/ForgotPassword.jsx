import { faMobileScreen, faLock, faEnvelope } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { Col, Row, Form, Button } from "react-bootstrap";
import {useNavigate} from 'react-router-dom'



const Box = () =>{
    const navigate = useNavigate();

    const [isPhoneNumber, setPhoneNumber] = useState("");
    const [isNewPassword, setNewPassword] = useState("");
    const [isConfirmNewPassword, setConfirmNewPassword] = useState("");
    const [isVerificationOnForm, setVerificationOnForm] =useState("");
    const [isNextStep, setNextStep] = useState(true);
    const [isCheckValidPhone, setCheckValidPhone] =useState("");
    const [isCheckValidNewPassword, setCheckValidNewPassWord] = useState("");
    const [isCheckValidConfirmNewPassword, setCheckValidConfirmNewPassWord] = useState("");

    function CheckValidPhone(){
        if(isPhoneNumber.length === 0){
            setCheckValidPhone("Không được để trống")
            return;
        }
        if(!isPhoneNumber.startsWith('0')){
            setCheckValidPhone("Số điện thoại phải bắt đầu bằng số 0")
            return
        }
        if(isPhoneNumber.length !== 10){
            setCheckValidPhone("Số điện thoại phải có 10 số")
            return
        }
        setCheckValidPhone("");
        setNextStep(false);
    }
    function CheckNewPassword(){
        if(isNewPassword.length===0){
            setCheckValidNewPassWord("Không được để trống");
            return;
        }
        if(isNewPassword.length < 6){
            setCheckValidNewPassWord("Mật khẩu phải có 6 kí tự trở lên")
            return
        }
        setCheckValidNewPassWord("");
        if(isNewPassword !== isConfirmNewPassword){
            setCheckValidConfirmNewPassWord("Xác nhận mật khẩu không giống")
            return;
        }
        setCheckValidConfirmNewPassWord("");
        navigate('/login')
    }

    return(
        <div>
            {/* Nhập số điện thoại */}
            <div 
                hidden={!isNextStep}
                style={{display:'flex',justifyContent:'center', alignItems:'center', flexDirection:'column', padding:40}}
            >     
                <div
                    className="mb-4"
                    style={{ fontSize:15, textAlign:'center'}}
                >
                    Nhập số điện thoại của bạn
                </div>
                <div className="mb-3" style={{display:'flex',flexDirection:'row', alignItems:'center', flex:1, width:'100%', borderBottom:'0.5px solid silver', paddingBottom:2}}>
                    <div>
                        <FontAwesomeIcon icon={faMobileScreen} style={{fontSize:20, marginRight:10}}/>

                    </div>
                    <div style={{display:'flex', flex:1}}>
                        <Form.Control
                            type='text'
                            placeholder="Số điện thoại"
                            style={{border:'none', with:'100%'}}
                            value={isPhoneNumber}
                            onChange={(e) =>setPhoneNumber(e.target.value)}
                        ></Form.Control>
                    </div>
                </div>
                <div 
                    className="mb-1"
                >
                    <a
                        style={{color:'red', fontSize:13}}
                    >{isCheckValidPhone}</a>
                </div>
                <div
                    style={{paddingBottom:15}}
                >
                    <Button
                        style={{paddingRight:'110px', paddingLeft:'110px',}}
                        onClick={CheckValidPhone}
                    >
                        Tiếp tục
                    </Button>
                </div>
            </div>
            <div
                hidden={isNextStep}
                style={{display:'flex',justifyContent:'center', alignItems:'center', flexDirection:'column', padding:40}}
            >
                <div
                    className="mb-4"
                    style={{ fontSize:15, textAlign:'center'}}
                >
                    Thay đổi mật khẩu
                </div>
                {/* Nhập mã xác nhận */}
                <div className="mb-3" style={{display:'flex',flexDirection:'row', alignItems:'center', flex:1, width:'100%', borderBottom:'0.5px solid silver', paddingBottom:2}}>
                    <div>
                        <FontAwesomeIcon icon={faEnvelope} style={{fontSize:20, marginRight:10}}/>

                    </div>
                    <div style={{display:'flex', flex:1}}>
                        <Form.Control
                            type='text'
                            placeholder="Mã xác nhận"
                            style={{border:'none', with:'100%'}}
                            value={isVerificationOnForm}
                            onChange={(e) =>setVerificationOnForm(e.target.value)}
                        ></Form.Control>
                    </div>
                </div>
                <div
                    className="mb-1"
                    style={{color:'#afafaf', fontSize:13, textAlign:'center'}}
                >
                    Chúng tôi sẽ gửi mã xác nhận qua số điện thoại của bạn
                </div>
                {/* Nhập mật khẩu mới */}
                <div className="mb-3" style={{display:'flex',flexDirection:'row', alignItems:'center', flex:1, width:'100%', borderBottom:'0.5px solid silver', paddingBottom:2}}>
                    <div>
                        <FontAwesomeIcon icon={faLock} style={{fontSize:20, marginRight:10}}/>

                    </div>
                    <div style={{display:'flex', flex:1}}>
                        <Form.Control
                            type='password'
                            placeholder="Mật khẩu mới"
                            style={{border:'none', with:'100%'}}
                            value={isNewPassword}
                            onChange={(e) =>setNewPassword(e.target.value)}
                        ></Form.Control>
                    </div>
                </div>
                <div 
                    className="mb-1"
                >
                    <a
                        style={{color:'red', fontSize:13}}
                    >{isCheckValidNewPassword}</a>
                </div>
                {/* Xác nhận mật khẩu mới */}
                <div className="mb-3" style={{display:'flex',flexDirection:'row', alignItems:'center', flex:1, width:'100%', borderBottom:'0.5px solid silver', paddingBottom:2}}>
                    <div>
                        <FontAwesomeIcon icon={faLock} style={{fontSize:20, marginRight:10}}/>

                    </div>
                    <div style={{display:'flex', flex:1}}>
                        <Form.Control
                            type='password'
                            placeholder="Xác nhận mật khẩu mới"
                            style={{border:'none', with:'100%'}}
                            value={isConfirmNewPassword}
                            onChange={(e) =>setConfirmNewPassword(e.target.value)}
                        ></Form.Control>
                    </div>
                </div>
                <div 
                    className="mb-1"
                >
                    <a
                        style={{color:'red', fontSize:13}}
                    >{isCheckValidConfirmNewPassword}</a>
                </div>
                <div
                    style={{paddingBottom:15}}
                >
                    <Button
                        style={{paddingRight:'110px', paddingLeft:'110px',}}
                        onClick={CheckNewPassword}
                    >
                        Xác nhận
                    </Button>
                </div>
            </div>
            <div 
                hidden={isNextStep}
                style={{display:'flex'}}
            >
                <a
                    href="" style={{color:'black', textDecoration:'none'}}
                    onClick={()=>{setNextStep(true)}}
                >
                    &lt;&lt;Quay lại</a>
            </div>
            <div 
                hidden={!isNextStep}
                style={{display:'flex'}}
            >
                <a
                    href="" style={{color:'black', textDecoration:'none'}}
                    onClick={()=>{navigate('/login')}}
                >
                    &lt;&lt;Quay về đăng nhập</a>
            </div>
        </div>
    )
}

const ForgotPassword = () => {
    return (
        <div
            style={{display: 'flex', justifyContent: 'center', height: '100vh' , backgroundColor:'#aad6ff',}}
        >
            <div style={{ justifyContent: 'center', alignItems: 'center', width:'500px', marginTop:'5%'}}>
                <Row >
                    <a style={{fontSize: 50, fontWeight:'bold', color: '#0e6af6', textAlign:'center'}}>
                        ZALO
                    </a>
                </Row>
                <Row >
                    <a style={{textAlign:'center'}}>
                        Khôi phục mật khẩu Zalo
                    </a>
                </Row>
                <Row>
                    <a style={{textAlign:'center'}}>
                        để kết nối với ứng dụng Zalo Web
                    </a>
                </Row>
                <Row style={{marginTop:10}}>
                    <Col></Col>
                    <Col
                        xs={9}
                        style={{display:'flex', with:'100%', backgroundColor:'white', paddingTop:10, paddingBottom:20}}
                    >
                        <div style={{flex:1}}>
                            <Box></Box>
                        </div>
                    </Col>
                    <Col></Col>
                </Row>
            </div>
        </div>
    )
}

export default ForgotPassword
