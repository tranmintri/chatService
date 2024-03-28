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
                    Chào mừng đến với <b>DRAFI PC!</b>{" "}
                </Container>
                <Container fluid style={{ marginTop: '20px', fontSize: '14px' }}>
                    Khám phá những tiện ích hỗ trợ làm việc và trò chuyện cùng
                    người thân, bạn bè được tối ưu hóa cho máy tính của bạn.
                </Container>
            </Container>
            <Container fluid style={{ height: '75%', paddingTop: '15px' }}>
                <Slick {...settings}>
                    <Container fluid className="h-100 w-100 text-center slick-slide">
                        <Image src={img1} alt="1" style={{ width: '40%', height: '40%', margin: '0 auto' }} />
                        <h4 style={{ color: '#805740', margin: '15px 0' }}>Nhắn tin nhiều hơn, soạn thảo ít hơn</h4>
                        <p style={{ fontSize: '14px' }}>
                            Sử dụng <b>Tin Nhắn Nhanh</b> để lưu trữ các tin nhắn
                            thường dùng và gửi nhanh trong hộp thoại bất kì
                        </p>
                    </Container>
                    <Container fluid className="h-100 w-100 text-center">
                        <Image src={img2} alt="2" style={{ width: '40%', height: '40%', margin: '0 auto' }} />
                        <h4 style={{ color: '#805740', margin: '15px 0' }}>Gọi nhóm và làm việc hiệu quả với Lazo Group Call</h4>
                        <p style={{ fontSize: '14px' }}>Trao đổi công việc mọi lúc mọi nơi</p>
                    </Container>
                    <Container fluid className="h-100 w-100 text-center">
                        <Image src={img3} alt="3" style={{ width: '40%', height: '40%', margin: '0 auto' }} />
                        <h4 style={{ color: '#805740', margin: '15px 0' }}>Trải nghiệm xuyên suốt</h4>
                        <p style={{ fontSize: '14px' }}>
                            Kết nối và giải quyết công việc trên mọi thiết bị với dữ
                            liệu luôn được đồng bộ
                        </p>
                    </Container>
                    <Container fluid className="h-100 w-100 text-center">
                        <Image src={img4} alt="4" style={{ width: '40%', height: '40%', margin: '0 auto' }} />
                        <h4 style={{ color: '#805740', margin: '15px 0' }}>Gửi file năng?</h4>
                        <p style={{ fontSize: '14px' }}>Đã có DRAFI PC "xử" hết</p>
                    </Container>
                    <Container fluid className="h-100 w-100 text-center">
                        <Image src={img5} alt="5" style={{ width: '40%', height: '40%', margin: '0 auto' }} />
                        <h4 style={{ color: '#805740', margin: '15px 0' }}>Chat nhóm với đồng nghiệp</h4>
                        <p style={{ fontSize: '14px' }}>Tiện lợi hơn, nhờ các công cụ chat trên máy tính</p>
                    </Container>
                    <Container fluid className="h-100 w-100 text-center">
                        <Image src={img6} alt="6" style={{ width: '40%', height: '40%', margin: '0 auto' }} />
                        <h4 style={{ color: '#805740', margin: '15px 0' }}>Giải quyết công việc hiệu quả hơn, lên đến 40%</h4>
                        <p style={{ fontSize: '14px' }}>Với DRAFI PC</p>
                    </Container>
                </Slick>
            </Container>
        </Container>
    )
}
export default EmptyChatScreen;