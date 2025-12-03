import React, { useState, type FormEventHandler } from "react";
import { Button, Form, InputGroup } from "react-bootstrap";
import { useConversations } from "../contexts/ConversationsProvider";

const OpenConversation = () => {
  const [text, setText] = useState<string>("");

  const { sendMessage, selectedConversation } = useConversations();

  const handleSubmit = (e: FormEventHandler<HTMLFormElement>) => {
    e.preventDefault();

    sendMessage(selectedConversation);
  };

  return (
    <div className="d-flex flex-column flex-grow-1">
      <div className="flex-grow-1 overflow-auto"></div>

      <Form onSubmit={handleSubmit}>
        <Form.Group className="m-2">
          <InputGroup>
            <Form.Control
              as="textarea"
              required
              value={text}
              onChange={(e) => setText(e.target.value)}
              style={{ height: "75px", resize: "none" }}
            />

            {/* <InputGroup.Append> */}
            <Button type="submit">Send</Button>
            {/* </InputGroup.Append> */}
          </InputGroup>
        </Form.Group>
      </Form>
    </div>
  );
};

export default OpenConversation;
