import { useCallback, useState, type FormEvent } from "react";
import { Button, Form, InputGroup } from "react-bootstrap";
import { useConversations } from "../contexts/ConversationsProvider";

const OpenConversation = () => {
  const [text, setText] = useState<string>("");

  const setRef = useCallback((node: HTMLDivElement | null) => {
    if (node) {
      node.scrollIntoView();
    }
  }, []);

  const { sendMessage, selectedConversation } = useConversations();

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    sendMessage(
      selectedConversation?.recipients.map((r) => r.id),
      text
    );

    setText("");
  };

  return (
    <div className="d-flex flex-column flex-grow-1">
      <div className="flex-grow-1 overflow-auto">
        <div className="d-flex flex-column align-items-start justify-content-end px-3">
          {selectedConversation?.messages.map((message, idx) => {
            const lastMessage =
              selectedConversation?.messages.length - 1 === idx;

            return (
              <div
                ref={lastMessage ? setRef : null}
                className={`my-1 d-flex flex-column ${
                  message.fromMe ? "align-self-end" : ""
                }`}
                key={idx}
              >
                <div
                  className={`rounded px-2 py-1 ${
                    message.fromMe ? "bg-primary text-white" : "border"
                  }`}
                >
                  {message?.text}
                </div>

                <div
                  className={`text-muted small ${
                    message.fromMe ? "text-right" : ""
                  }`}
                >
                  {message.fromMe ? "You" : message?.senderName}
                </div>
              </div>
            );
          })}
        </div>
      </div>

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
