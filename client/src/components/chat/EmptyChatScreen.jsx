import { Container } from "react-bootstrap";
import anh from "../../assets/empty_screen.png"
import img1 from "../../assets/owl_1.png";
import img2 from "../../assets/owl_2.jpg";
import img3 from "../../assets/owl_3.jpg";
import img4 from "../../assets/owl_4.png";
import img5 from "../../assets/owl_5.jpg";
import img6 from "../../assets/owl_6.jpg";
import Slick from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Image } from 'react-bootstrap';

const EmptyChatScreen = () => {
    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1
    };
    return (
        <Container fluid className="tw-h-screen tw-w-full">
            <Container fluid className="text-center" style={{ height: '25%', margin: '0 auto' }}>
                <Container fluid className="font-weight-normal" style={{ paddingTop: '60px', fontSize: '20px' }}>
                    Welcome to <b>DRAFI PC!</b>{" "}
                </Container>
                <Container fluid style={{ marginTop: '20px', fontSize: '14px' }}>
                    Discover utilities to help work and chat with relatives and friends optimized for your computer.
                </Container>
            </Container>
            <Container fluid style={{ height: '75%', paddingTop: '15px' }}>
                <Slick {...settings}>
                    <Container fluid className="h-100 w-100 text-center slick-slide">
                        <Image src={img1} alt="1" style={{ width: '40%', height: '40%', margin: '0 auto' }} />
                        <h4 style={{ color: '#805740', margin: '15px 0' }}>Text more, edit less</h4>
                        <p style={{ fontSize: '14px' }}>
                            Use <b>Instant Messages</b> to archive messages
                            Common and quick send in any dialog box
                        </p>
                    </Container>
                    <Container fluid className="h-100 w-100 text-center">
                        <Image src={img2} alt="2" style={{ width: '40%', height: '40%', margin: '0 auto' }} />
                        <h4 style={{ color: '#805740', margin: '15px 0' }}>Call your team and be productive with Lazo Group Call</h4>
                        <p style={{ fontSize: '14px' }}>Exchange work anytime, anywhere</p>
                    </Container>
                    <Container fluid className="h-100 w-100 text-center">
                        <Image src={img3} alt="3" style={{ width: '40%', height: '40%', margin: '0 auto' }} />
                        <h4 style={{ color: '#805740', margin: '15px 0' }}>Seamless experience</h4>
                        <p style={{ fontSize: '14px' }}>
                            Connect and get things done on any device with data always in sync
                        </p>
                    </Container>
                    <Container fluid className="h-100 w-100 text-center">
                        <Image src={img4} alt="4" style={{ width: '40%', height: '40%', margin: '0 auto' }} />
                        <h4 style={{ color: '#805740', margin: '15px 0' }}>Gửi file năng?</h4>
                        <p style={{ fontSize: '14px' }}>Đã có DRAFI PC "xử" hết</p>
                    </Container>
                    <Container fluid className="h-100 w-100 text-center">
                        <Image src={img5} alt="5" style={{ width: '40%', height: '40%', margin: '0 auto' }} />
                        <h4 style={{ color: '#805740', margin: '15px 0' }}>Group chat with colleagues</h4>
                        <p style={{ fontSize: '14px' }}>More convenient, thanks to chat tools on your computer</p>
                    </Container>
                    <Container fluid className="h-100 w-100 text-center">
                        <Image src={img6} alt="6" style={{ width: '40%', height: '40%', margin: '0 auto' }} />
                        <h4 style={{ color: '#805740', margin: '15px 0' }}>Solve tasks more efficiently, up to 40%</h4>
                        <p style={{ fontSize: '14px' }}>With DRAFI PC</p>
                    </Container>
                </Slick>
            </Container>
        </Container>
    )
}
export default EmptyChatScreen;