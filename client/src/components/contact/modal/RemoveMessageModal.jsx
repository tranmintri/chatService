import axios from "axios";
import { useState } from "react";
import { Button, Form, ListGroup, Modal } from "react-bootstrap";
import { useStateProvider } from "../../../context/StateContext";
import { reducerCases } from "../../../context/constants";
import { useEffect } from "react";
import { toast } from "react-toastify";

const RemoveMessageModal = ({ showModal, handleCloseModal, shareMessage }) => {
    const [selectedOption, setSelectedOption] = useState(null);

    const handleRemove = () => {
        if (selectedOption === 0) {
            alert(`Remove message on 0`);
            return;
        }
        if (selectedOption === 1) {
            alert(`Remove message on 1`);
            return;
        }


        alert('Please select an option before removing.');

    }
    return (
        <Modal show={showModal} onHide={handleCloseModal} backdrop="static">
            <Modal.Header closeButton>
                <Modal.Title>Who do you want to remove this message on ?</Modal.Title>
            </Modal.Header>
            <Modal.Body style={{ background: '#abcedb' }}>
                <Form.Check
                    type="radio"
                    label={<strong>Remove with people</strong>}
                    name="removeOption"
                    id="removeWithPeople"
                    onChange={() => setSelectedOption(0)}
                />
                <p className="tw-ml-6">This option will remove the message for everyone in the conversation.</p>
                <Form.Check
                    type="radio"
                    label={<strong>Remove at your side</strong>}
                    name="removeOption"
                    id="removeAtYourSide"
                    onChange={() => setSelectedOption(1)}
                />
                <p className="tw-ml-6">This option will remove the message only for you.</p>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleCloseModal}>
                    Close
                </Button>
                <Button variant="primary" onClick={handleRemove}>
                    Remove
                </Button>
            </Modal.Footer>
        </Modal >
    )
}

export default RemoveMessageModal;
