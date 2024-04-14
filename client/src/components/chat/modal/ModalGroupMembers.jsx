import { useEffect, useRef, useState } from "react";
import { Button, Modal } from "react-bootstrap";
import { BsThreeDots } from "react-icons/bs";
const ModalGroupMembers = ({ showModalMembers, toggleModalMembers, members }) => {
    const [showOptions, setShowOptions] = useState({});
    const [selectedOptionPosition, setSelectedOptionPosition] = useState({});

    const handleShowOptions = (index) => {
        setShowOptions(prevState => ({ ...prevState, [index]: !prevState[index] }));
    };

    const ref = useRef();

    const handleClickOutside = (event) => {
        if (ref.current && !ref.current.contains(event.target)) {
            setShowOptions({});
        }
    };

    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    // const calculateOptionPosition = (buttonRect, parentRect) => {
    //     const top = buttonRect.top - parentRect.top + buttonRect.height + 50;
    //     const left = buttonRect.left - parentRect.left + buttonRect.width + 60;
    //     return { top, left };
    // };

    return (
        <Modal show={showModalMembers} onHide={toggleModalMembers} centered>
            <Modal.Header closeButton>
                <Modal.Title>Member List</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <ul>
                    {members.map((member, index) => {
                        const isOptionVisible = showOptions[index];
                        return (
                            <li key={index} className="d-flex align-items-center tw-my-2">
                                <div className="tw-flex items-center">
                                    <img src={member.avatar.url} alt={member.name} className="tw-w-8 tw-h-8 tw-rounded-full tw-mr-2" />
                                    <span>{member.name}</span>
                                </div>
                                <BsThreeDots className="tw-ml-auto tw-cursor-pointer" onClick={() => handleShowOptions(index)} />
                                {isOptionVisible && (
                                    <div ref={ref} className="tooltip-content col-4 tw-w-3/5 tw-absolute tw-bg-white tw-border tw-border-gray-200 tw-rounded" style={{ height: '100px', overflowY: 'auto', ...selectedOptionPosition }}>
                                        <div className="tw-h-[50%] hover:tw-bg-gray-200">Cấp quyền</div>
                                        <div className="tw-h-[50%] hover:tw-bg-gray-200">Xóa khỏi nhóm</div>
                                    </div>
                                )}
                            </li>
                        );
                    })}
                </ul>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={toggleModalMembers}>
                    Close
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ModalGroupMembers;
