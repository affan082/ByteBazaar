import { useEffect, useState } from "react";
import axios from "axios";
import {
  Container,
  Spinner,
  Button,
  Row,
  Col,
  Badge,
  Modal,
} from "react-bootstrap";
import config from "../../config/global-info.json";
import "./PendingSellers.scss";

// interface User {
//   _id: string;
//   fullname: string;
//   email: string;
//   username: string;
//   createdAt: string;
// }

interface SellerProfile {
  shopName: string;
  cnic: string;
  bankAccountNumber: string;
  bankName: string;
  status: "pending" | "verified" | "rejected";
}

interface SellerData {
  _id: string;
  fullname: string;
  email: string;
  username: string;
  createdAt: string;
  sellerProfile: SellerProfile;
}

function PendingSellers() {
  const [sellers, setSellers] = useState<SellerData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedSeller, setSelectedSeller] = useState<SellerData | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchSellers();
  }, []);

  const fetchSellers = () => {
    setLoading(true);
    axios
      .get(config.server.uri + "admin/seller/status", {
        withCredentials: true,
      })
      .then((res) => {
        setSellers((res.data.data || []).reverse());
        setLoading(false);
      })
      .catch((err) => {
        setError("Failed to fetch sellers");
        setLoading(false);
      });
  };

  const handleStatusChange = async (
    sellerId: string,
    newStatus: "verified" | "rejected",
  ) => {
    try {
      await axios.put(
        config.server.uri + "admin/seller/status",
        { sellerId, status: newStatus },
        { withCredentials: true },
      );

      fetchSellers();
      setShowModal(false);
    } catch (err) {
      alert("Failed to update seller status");
    }
  };

  const viewDetails = (seller: SellerData) => {
    setSelectedSeller(seller);
    setShowModal(true);
  };

  const getStatusBadge = (status: string) => {
    const variants: { [key: string]: string } = {
      pending: "warning",
      verified: "success",
      rejected: "danger",
    };
    return (
      <Badge bg={variants[status] || "secondary"}>{status.toUpperCase()}</Badge>
    );
  };

  return (
    <Container className="py-4 sellers-listing">
      <Row className="mb-3">
        <Col>
          <h1 className="text-center text-warning">Sellers List</h1>
        </Col>
      </Row>

      {loading && (
        <div
          className="d-flex justify-content-center align-items-center"
          style={{ minHeight: "200px" }}
        >
          <Spinner animation="border" variant="warning" />
        </div>
      )}

      {!loading && sellers.length === 0 && (
        <p className="text-center no-sellers">No sellers found</p>
      )}

      {!loading && sellers.length > 0 && (
        <div className="seller-list-wrapper">
          <div className="seller-list-header">
            <span className="col shop">Shop Name</span>
            <span className="col owner">Owner</span>
            <span className="col status">Status</span>
            <span className="col registered">Registered</span>
            <span className="col action">Action</span>
          </div>
          <div className="seller-list-body">
            {sellers.map((seller) => (
              <div className="seller-row" key={seller._id}>
                <span className="col shop">
                  {seller.sellerProfile?.shopName || "N/A"}
                </span>
                <span className="col owner">{seller.fullname}</span>
                <span className="col status">
                  {getStatusBadge(seller.sellerProfile?.status || "pending")}
                </span>
                <span className="col registered">
                  {new Date(seller.createdAt).toLocaleDateString()}
                </span>
                <span className="col action">
                  <Button
                    size="sm"
                    variant="c-btn"
                    className="c-btn"
                    onClick={() => viewDetails(seller)}
                  >
                    View Details
                  </Button>
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Seller Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedSeller && (
            <>
              <h5>Personal Information</h5>
              <p>
                <strong>Full Name:</strong> {selectedSeller.fullname}
              </p>
              <p>
                <strong>Email:</strong> {selectedSeller.email}
              </p>
              <p>
                <strong>Username:</strong> {selectedSeller.username}
              </p>
              <hr />
              <h5>Business Information</h5>
              <p>
                <strong>Shop Name:</strong>{" "}
                {selectedSeller.sellerProfile?.shopName}
              </p>
              <p>
                <strong>CNIC:</strong> {selectedSeller.sellerProfile?.cnic}
              </p>
              <p>
                <strong>Bank Name:</strong>{" "}
                {selectedSeller.sellerProfile?.bankName || "N/A"}
              </p>
              <p>
                <strong>Bank Account:</strong>{" "}
                {selectedSeller.sellerProfile?.bankAccountNumber}
              </p>
              <hr />
              <h5>Current Status</h5>
              <p>
                {getStatusBadge(
                  selectedSeller.sellerProfile?.status || "pending",
                )}
              </p>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="c-btn"
            className="c-btn"
            onClick={() => setShowModal(false)}
          >
            Close
          </Button>
          {selectedSeller?.sellerProfile?.status === "pending" && (
            <>
              <Button
                variant="danger"
                onClick={() =>
                  handleStatusChange(selectedSeller._id, "rejected")
                }
              >
                Reject
              </Button>
              <Button
                variant="success"
                onClick={() =>
                  handleStatusChange(selectedSeller._id, "verified")
                }
              >
                Approve
              </Button>
            </>
          )}
          {selectedSeller?.sellerProfile?.status === "rejected" && (
            <Button
              variant="success"
              onClick={() => handleStatusChange(selectedSeller._id, "verified")}
            >
              Approve
            </Button>
          )}
          {selectedSeller?.sellerProfile?.status === "verified" && (
            <Button
              variant="danger"
              onClick={() => handleStatusChange(selectedSeller._id, "rejected")}
            >
              Revoke Approval
            </Button>
          )}
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default PendingSellers;
