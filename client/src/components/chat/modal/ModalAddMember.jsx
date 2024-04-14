import { Button, Form, Modal } from "react-bootstrap";

const ModalAddMember = ({ showModalAddMember, handleCloseModalAddMember }) => {
    return (
        <Modal show={showModalAddMember} onHide={handleCloseModalAddMember} centered>
            <Modal.Header closeButton>
                <Modal.Title style={{ fontSize: '20px' }}>Add new members into group</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group controlId="formAddMembers" className="mb-3">
                        <Form.Control type="text" placeholder="Enter phone or name to add members into group" />
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleCloseModalAddMember}>
                    Cancel
                </Button>
                <Button variant="primary">
                    Add
                </Button>
            </Modal.Footer>
        </Modal>
    )
}
export default ModalAddMember;