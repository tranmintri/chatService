import React, { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { FaPen } from 'react-icons/fa6';

const ModalGroupInfo = ({ showModalInfo, toggleModalInfo, chat }) => {
    const handleConfirm = () => {
        window.alert("dooir teen thanhf coong!")
    }
    return (
        <Modal show={showModalInfo} onHide={toggleModalInfo} dialogClassName="modal-dialog-centered">
            <Modal.Header closeButton>
                <Modal.Title ><span className='tw-text-[20px]'>Change group name</span></Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className='tw-flex tw-justify-center'>
                    <img src={`https://lh3.googleusercontent.com/a/ACg8ocK1LMjQE59_kT4mNFmgxs6CmqzZ24lqR2bJ4jHjgB6yiW4=s96-c`} className="tw-w-24 tw-h-24 tw-rounded-full" alt="Group Avatar" />
                    <FaPen className="tw-cursor-pointer" size={13} />
                </div>
                <div className='tw-flex tw-justify-center'>
                    <span className='text-center tw-text-[18px] tw-font-bold'>{chat.name}</span>
                </div>
                <div className='tw-flex tw-justify-center'>
                    <span className='text-center tw-text-[15px]'>Are you sure you want to rename the group, when confirming the new group name will be visible to all members.</span>
                </div>
                <div className='tw-flex tw-justify-center'>
                    <input type="text" placeholder="Enter new group name" size={45} className='tw-border tw-px-2 tw-py-1 tw-rounded' />
                </div>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={toggleModalInfo}>
                    Close
                </Button>
                <Button variant="primary" onClick={handleConfirm}>
                    Confirm
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

export default ModalGroupInfo;