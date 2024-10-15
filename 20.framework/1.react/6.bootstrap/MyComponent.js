// MyComponent.js
// https://create-react-app.dev/docs/adding-bootstrap
// npm install react-bootstrap bootstrap

import React from 'react';
import { Container, Row, Col, Button, Badge, Alert } from 'react-bootstrap';

const MyComponent = () => {
  const handleButtonClick = () => {
    alert('Button Clicked!');
  };

  return (
    <Container className="mt-5">
      <Row>
        <Col>
          <Alert variant="info" className="text-center">
            <h1>React with Bootstrap</h1>
          </Alert>
        </Col>
      </Row>
      <Row className="mt-3">
        <Col md={{ span: 4, offset: 4 }}>
          <Button variant="primary" size="lg" onClick={handleButtonClick}>
            Click me
          </Button>
        </Col>
      </Row>
      <Row className="mt-3">
        <Col>
          <Badge variant="secondary">New</Badge>{' '}
          <Badge variant="success">Success</Badge>{' '}
          <Badge variant="danger">Danger</Badge>{' '}
          <Badge variant="warning">Warning</Badge>{' '}
        </Col>
      </Row>
    </Container>
  );
};

export default MyComponent;
