import React, { useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import { useContacts, type Contact } from "../contexts/ContactsProvider";
import { useConversations } from "../contexts/ConversationsProvider";

type NewConversationModalProps = {
  closeModal: () => void;
};

const NewConversationModal: React.FC<NewConversationModalProps> = ({
  closeModal,
}) => {
  const [selectedContactIds, setSelectedContactIds] = useState<string[]>([]);

  const { contacts } = useContacts();

  const { createConversation } = useConversations();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    createConversation(selectedContactIds);

    closeModal();
  };

  const handleCheckboxChange = (contactId: string) => {
    setSelectedContactIds((prevSelectedContactIds) => {
      if (prevSelectedContactIds.includes(contactId)) {
        return prevSelectedContactIds.filter((prevId) => {
          return contactId !== prevId;
        });
      } else {
        return [...prevSelectedContactIds, contactId];
      }
    });
  };

  return (
    <>
      <Modal.Header closeButton> Create Conversation</Modal.Header>

      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          {contacts?.map((contact, idx) => (
            <Form.Group key={idx}>
              <Form.Check
                type="checkbox"
                value={selectedContactIds.includes(contact.id)}
                label={contact.name}
                onChange={() => handleCheckboxChange(contact.id)}
              />
            </Form.Group>
          ))}

          <Button type="submit">Create</Button>
        </Form>
      </Modal.Body>
    </>
  );
};

export default NewConversationModal;
