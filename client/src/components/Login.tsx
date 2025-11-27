import React, { useRef } from "react";
import { Container, Form, Button } from "react-bootstrap";
import { v4 as uuidV4 } from "uuid";

type LoginProps = {
  onIdSubmit: (id: string) => void;
};

const Login: React.FC<LoginProps> = ({ onIdSubmit }) => {
  const idRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    onIdSubmit(idRef.current!.value);
  };

  const createNewId = () => {
    const newId = uuidV4();

    onIdSubmit(newId);
  };

  return (
    <Container
      className="align-items-center d-flex"
      style={{ height: "100vh" }}
    >
      <Form className="w-100" onSubmit={handleSubmit}>
        <Form.Group className="mb-3" controlId="formHorizontalEmail">
          <Form.Label>Enter your ID</Form.Label>

          <Form.Control
            ref={idRef}
            type="text"
            placeholder="User ID"
            required
          />
        </Form.Group>

        <Button type="submit" className="mr-2">
          Login
        </Button>

        <Button variant="secondary" onClick={createNewId}>
          Create a new ID
        </Button>
      </Form>
    </Container>
  );
};

export default Login;
