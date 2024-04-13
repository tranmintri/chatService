import { Button, Modal } from "react-bootstrap";
import { BsThreeDots } from "react-icons/bs";

const ModalGroupMembers = ({ showModalMembers, toggleModalMembers, members }) => {
    const handleShowPropertiesMembers = () => {
        window.alert("banj muoons kick thanwgf nayf har?")
    }
    return (
        <Modal show={showModalMembers} onHide={toggleModalMembers} centered>
            <Modal.Header closeButton>
                <Modal.Title>Member List</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <ul>
                    {members.map((member, index) => (
                        <li key={index} className="d-flex align-items-center tw-my-2">
                            <div className="tw-flex items-center">
                                <img src={member.avatar} alt={member.name} className="tw-w-8 tw-h-8 tw-rounded-full tw-mr-2" />
                                <span>{member.name}</span>
                            </div>
                            <BsThreeDots className="tw-ml-auto tw-cursor-pointer" onClick={handleShowPropertiesMembers} />
                        </li>
                    ))}
                </ul>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={toggleModalMembers}>
                    Close
                </Button>
            </Modal.Footer>
        </Modal>
    )
}
export default ModalGroupMembers;