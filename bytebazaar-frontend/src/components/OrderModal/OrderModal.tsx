// import React from 'react';
import { Modal, Row, Col, Card, Button } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import "./ordermodel.scss";

let OrderModal = ({ showModal = false, handleClose = () => {} }) => {
  const { id } = useParams<{ id: string }>();

  return (
    <Modal show={showModal} onHide={handleClose} centered>
      <Modal.Header>
        <Button className="btn-close" onClick={handleClose} />
      </Modal.Header>
      <Modal.Body>
        <Row className="text-center">
          <Col sm={4} md={4} lg={4} >
            <Card>
              <h6>Order</h6>
              <p>{id || 'No ID Available'}</p>
            </Card>
          </Col>
          <Col  sm={4} md={4} lg={4}>
            <Card>
              <h6>Order_Name</h6>
              <p>v534hb</p>
            </Card>
          </Col>
          <Col sm={4}  md={4} lg={4} >
            <Card>
              <h6>Expected Date</h6>
              <p>11/04/2025</p>
            </Card>
          </Col>
        </Row>
      </Modal.Body>
    </Modal>
  );
};

export default OrderModal;

