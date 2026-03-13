import { useContext } from "react";
import { UserContext } from "../../reducers/UserContext.tsx";
import { Button, Row, Col, Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { ConfigContext } from "../../reducers/GlobalConfig.tsx";
import "./profile_info.scss";

function ProfileInfo() {
  const { user } = useContext(UserContext);
  const config = useContext(ConfigContext);
  const navigate = useNavigate();

  if (!user) {
    return (
      <div className="profile-info-empty text-center py-5">
        <i
          className="bi bi-person-circle"
          style={{ fontSize: "4rem", color: "var(--clr-text-light)" }}
        ></i>
        <h2 className="mt-3">My Profile</h2>
        <p className="text-muted">You are not signed in.</p>
        <Button
          variant="primary"
          className="mt-3"
          onClick={() => navigate("/signin")}
        >
          Sign In
        </Button>
      </div>
    );
  }
  const isSeller = user.roles?.some((r: any) => r.name === "seller");
  const isBuyer = user.roles?.some((r: any) => r.name === "buyer");

  return (
    <div className="profile-info-page">
      {/* <h1 className="page-title text-warning text-center mb-4">My Profile</h1> */}

      <Card className="profile-header-card mb-4">
        <Card.Body>
          <Row>
            <Col md={3} className="text-center">
              <div className="profile-avatar-wrapper">
                {user.profileImageUrl ? (
                  <img
                    src={config.server.uri + user.profileImageUrl}
                    alt="profile"
                    className="profile-avatar"
                  />
                ) : (
                  <div className="profile-avatar-placeholder">
                    {user.fullname?.charAt(0).toUpperCase() || "U"}
                  </div>
                )}
              </div>
              <h4 className="mt-3 mb-1">{user.fullname || "Unknown User"}</h4>
              <div className="user-roles">
                {user.roles?.map((role: any, idx: number) => (
                  <span key={idx} className="role-badge">
                    {role.name || role}
                  </span>
                ))}
              </div>
            </Col>

            <Col md={9}>
              <div className="profile-details">
                <Row className="mb-3">
                  <Col md={6}>
                    <div className="detail-item">
                      <i className="bi bi-envelope me-2"></i>
                      <div>
                        <label>Email</label>
                        <p>{user.email || "N/A"}</p>
                      </div>
                    </div>
                  </Col>
                  <Col md={6}>
                    <div className="detail-item">
                      <i className="bi bi-telephone me-2"></i>
                      <div>
                        <label>Phone</label>
                        <p>{user.phone || "N/A"}</p>
                      </div>
                    </div>
                  </Col>
                </Row>

                <Row className="mb-3">
                  <Col md={6}>
                    <div className="detail-item">
                      <i className="bi bi-calendar me-2"></i>
                      <div>
                        <label>Date of Birth</label>
                        <p>
                          {user.dob
                            ? new Date(user.dob).toLocaleDateString()
                            : "N/A"}
                        </p>
                      </div>
                    </div>
                  </Col>
                  <Col md={6}>
                    <div className="detail-item">
                      <i className="bi bi-gender-ambiguous me-2"></i>
                      <div>
                        <label>Gender</label>
                        <p>{user.gender || "N/A"}</p>
                      </div>
                    </div>
                  </Col>
                </Row>
                <Row>
                  <Col md={12}>
                    <div className="detail-item">
                      <i className="bi bi-geo-alt me-2"></i>
                      <div>
                        <label>Address</label>
                        <p>{user.address || "N/A"}</p>
                      </div>
                    </div>
                  </Col>
                </Row>
              </div>
            </Col>
          </Row>
        </Card.Body>
      </Card>
      {isSeller && (
        <Card className="seller-info-card mb-4">
          <Card.Body>
            <div className="card-header-custom mb-3">
              <i className="bi bi-shop me-2"></i>
              <h5>Seller Information</h5>
            </div>
            <Row>
              <Col md={12}>
                <div className="detail-item">
                  <i className="bi bi-building me-2"></i>
                  <div>
                    <label>Shop Name</label>
                    <p>{user.sellerProfile?.shopName || "N/A"}</p>
                  </div>
                </div>
              </Col>
            </Row>
            <Row className="mt-3">
              <Col md={12}>
                <div className="detail-item">
                  <i className="bi bi-card-text me-2"></i>
                  <div>
                    <label>Seller ID</label>
                    <p className="text-monospace">{user._id}</p>
                  </div>
                </div>
              </Col>
            </Row>
          </Card.Body>
        </Card>
      )}
    </div>
  );
}

export default ProfileInfo;
