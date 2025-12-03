import React from "react";
import { useContacts } from "../contexts/ContactsProvider";
import { ListGroup } from "react-bootstrap";

const Contacts: React.FC = () => {
  const { contacts } = useContacts();

  return (
    <ListGroup variant="flush">
      {contacts?.map((contact) => {
        return <ListGroup.Item key={contact.id}>{contact.name}</ListGroup.Item>;
      })}
    </ListGroup>
  );
};

export default Contacts;
