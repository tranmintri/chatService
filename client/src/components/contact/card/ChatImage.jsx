import axios from "axios";
import { useState } from "react";
import { Button, Modal } from "react-bootstrap";
import { MdOutlineFileDownload, MdCloseFullscreen } from "react-icons/md";


const ChatImage = ({ imageUrl }) => {
    const [showModal, setShowModal] = useState(false);

    const handleCloseModal = () => {
        setShowModal(false);
    };

    const handleShowModal = () => {
        setShowModal(true);
    };

    const handleDownloadImage = () => {
        // Thực hiện tải xuống ảnh
        axios.get(imageUrl, { responseType: 'blob' })
            .then(response => {
                const url = window.URL.createObjectURL(new Blob([response.data]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', 'image.jpg');
                document.body.appendChild(link);
                link.click();
            });
    };
    return (
        <div>
            <img src={imageUrl} alt="Image" onClick={handleShowModal} className="tw-mt-1 tw-mr-1" />

            <Modal show={showModal} onHide={handleCloseModal} centered>
                <Modal.Header className="tw-flex tw-justify-between">
                    <Button variant="primary" onClick={handleDownloadImage} ><MdOutlineFileDownload /></Button>
                    <Button variant="danger " onClick={handleCloseModal}><MdCloseFullscreen /></Button>
                </Modal.Header>
                <img src={imageUrl} alt="Image" className="tw-w-auto tw-h-auto" />

            </Modal>
        </div>
    );
};

export default ChatImage;
