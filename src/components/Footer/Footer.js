import React from "react";

import {
  Button,
  Container,
  Row,
  Col,
} from "reactstrap";

export default function Footer() {
  return (
    <footer className="footer" style={{ marginTop: '30vh' }}>
      <Container>
        <Row>
          <Col md="3">
            <h1 className="title">KAL</h1>
          </Col>
          <Col md="6"></Col>
          <Col md="3" style={{ display: 'flex', alignItems: 'center' }}>
            <div className="btn-wrapper profile">
              <Button
                className="btn-icon btn-neutral btn-round btn-simple"
                color="default"
                href="https://twitter.com/klayafterlife"
                target="_blank"
              >
                <i className="fab fa-twitter" />
              </Button>
            </div>
          </Col>
        </Row>
      </Container>
    </footer>
  );
}
