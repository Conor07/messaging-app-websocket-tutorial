import React, { useRef } from "react";
import { Modal, Form, Button } from "react-bootstrap";
import { useContacts } from "../contexts/ContactsProvider";

type NewContactModalProps = {
  closeModal: () => void;
};

const NewContactModal: React.FC<NewContactModalProps> = ({ closeModal }) => {
  const idRef = useRef<HTMLInputElement | null>(null);
  const nameRef = useRef<HTMLInputElement | null>(null);

  const { createContact } = useContacts();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!idRef.current || !nameRef.current) return;

    createContact(idRef.current.value, nameRef.current.value);

    closeModal();
  };

  return (
    <>
      <Modal.Header closeButton> Create Contact</Modal.Header>

      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group>
            <Form.Label>ID</Form.Label>

            <Form.Control type="text" ref={idRef} required />
          </Form.Group>

          <Form.Group>
            <Form.Label>Name</Form.Label>

            <Form.Control type="text" ref={nameRef} required />
          </Form.Group>

          <Button type="submit">Create</Button>
        </Form>
      </Modal.Body>
    </>
  );
};

export default NewContactModal;
