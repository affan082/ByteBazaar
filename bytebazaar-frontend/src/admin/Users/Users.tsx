import { useEffect, useState, useContext } from "react";
import {
  Table,
  Container,
  Button,
  Spinner,
  Modal,
  Form,
  Row,
  Col,
} from "react-bootstrap";
import axios from "axios";
import { ConfigContext } from "../../reducers/GlobalConfig.tsx";
import {
  UpdateUserProfile,
  UserInterface,
} from "../../reducers/AuthProvider.tsx";
import "./users.scss";

function AdminUsersPage() {
  const config = useContext(ConfigContext);
  const [users, setUsers] = useState<UserInterface[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedUser, setSelectedUser] = useState<UserInterface | null>();
  const [showUserDetail, setShowUserDetail] = useState<boolean>(false);
  const [showEditUserProfile, setShowEditUserProfile] =
    useState<boolean>(false);
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value, files } = e.target as any;
    setFormData({
      ...formData,
      [name]: files ? files[0] : value,
    });
  };
  const [formResponse, setFormResponse] = useState<{
    type: "success" | "error";
    message: string;
  }>();

  const [formData, setFormData] = useState<{ [key: string]: any }>({});

  useEffect(() => {
    axios
      .get(config.server.uri + "admin/user/all", { withCredentials: true })
      .then((res) => {
        setUsers(res.data.data || []);
      })
      .catch((err) => {
        console.error("Error fetching users:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [config.server.uri]);

  function isSeller(user: UserInterface) {
    return user.roles && user.roles.length > 0
      ? user.roles.map((r: any) => r.name).includes("seller")
      : false;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const frmData = new FormData();
    for (let key in formData) {
      if (formData[key] && formData[key].length > 0 && formData[key].item) {
        Array.from(formData[key]).forEach((file) => {
          frmData.append(key, file);
        });
      } else {
        frmData.append(key, formData[key]);
      }
    }

    // Add User ID because the user is Admin
    formData["_id"] = selectedUser?._id;

    UpdateUserProfile(formData)
      .then((res) => {
        setFormResponse({
          type: "success",
          message: res.data.message,
        });
      })
      .catch((err) => {
        setFormResponse({
          type: "error",
          message: err.message || "Failed to update profile",
        });
      });
  };

  function handleDeleteUser(id: string) {
    axios
      .delete(config.server.uri + "admin/user/delete/" + id, {
        withCredentials: true,
      })
      .then((_res) => {
        setUsers(users.filter((user: UserInterface) => user._id !== id));
      })
      .catch((err) => {
        console.error("Error deleting user:", err);
      });
  }

  return (
    <Container fluid className="users-listing">
      <Row className="mb-3">
        <Col>
          <h1 className="text-center text-warning">Users List</h1>
        </Col>
      </Row>
      {loading ? (
        <div
          className="d-flex justify-content-center align-items-center"
          style={{ minHeight: "200px" }}
        >
          <Spinner animation="border" variant="warning" />
        </div>
      ) : (
        <div className="user-list-wrapper">
          <div className="user-list-header">
            <span className="col name">Name</span>
            <span className="col email">Email</span>
            <span className="col role">Role</span>
            <span className="col status">Status</span>
            <span className="col joined">Joined</span>
            <span className="col actions">Actions</span>
          </div>
          <div className="user-list-body">
            {users.length > 0 ? (
              users.map((user) => (
                <div className="user-row" key={user._id}>
                  <span className="col name">{user.fullname}</span>
                  <span className="col email t-length">{user.email}</span>
                  <span className="col role">
                    {user.roles && user.roles.length > 0
                      ? user.roles.map((r: any) => r.name).join(", ")
                      : ""}
                  </span>
                  <span className="col status">{user.status ?? "Active"}</span>
                  <span className="col joined">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </span>
                  <span className="col actions">
                    <Button
                      variant="c-btn"
                      className="c-btn me-2"
                      onClick={() => {
                        setSelectedUser(user);
                        setShowUserDetail(true);
                      }}
                    >
                      View
                    </Button>
                    <Button
                      variant="c-btn"
                      className=" px-3 c-btn"
                      onClick={() => {
                        handleDeleteUser(user._id);
                      }}
                    >
                      Delete
                    </Button>
                  </span>
                </div>
              ))
            ) : (
              <p className="text-center no-users">No users found</p>
            )}
          </div>
        </div>
      )}

      <Modal
        show={showUserDetail}
        onHide={() => setShowUserDetail(false)}
        centered
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>User Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedUser ? (
            <Table bordered hover responsive>
              <tbody>
                <tr>
                  <th>ID</th>
                  <td>{selectedUser._id}</td>
                </tr>
                <tr>
                  <th>Name</th>
                  <td>{selectedUser.fullname}</td>
                </tr>
                <tr>
                  <th>Email</th>
                  <td>{selectedUser.email}</td>
                </tr>
                <tr>
                  <th>Roles</th>
                  <td>
                    {selectedUser.roles?.length
                      ? selectedUser.roles.map((r: any, i: number) => (
                          <span key={i} className="badge bg-success me-1">
                            {r.name}
                          </span>
                        ))
                      : "No roles"}
                  </td>
                </tr>
                <tr>
                  <th>Created At</th>
                  <td>{new Date(selectedUser.createdAt).toLocaleString()}</td>
                </tr>
              </tbody>
            </Table>
          ) : (
            <p>No user data available</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowUserDetail(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
      <Modal
        show={showEditUserProfile}
        onHide={() => {
          setShowEditUserProfile(false);
          setFormResponse({
            message: "",
            type: "success",
          });
        }}
        centered
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>User Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedUser ? (
            <div className="profile-settings">
              <h3 className="mb-4">Profile Settings</h3>
              <Form onSubmit={handleSubmit}>
                <Row>
                  <Col md={12}>
                    <Form.Group className="mb-3" controlId="fullname">
                      <Form.Label>Full Name</Form.Label>
                      <Form.Control
                        type="text"
                        name="fullname"
                        value={formData.fullname}
                        onChange={handleChange}
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3" controlId="phone">
                      <Form.Label>Phone</Form.Label>
                      <Form.Control
                        type="text"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3" controlId="dob">
                      <Form.Label>Date of Birth</Form.Label>
                      <Form.Control
                        type="date"
                        name="dob"
                        value={formData.dob}
                        onChange={handleChange}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3" controlId="gender">
                      <Form.Label>Gender</Form.Label>
                      <Form.Select
                        name="gender"
                        value={formData.gender}
                        onChange={handleChange}
                      >
                        <option value="">Select gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group className="mb-3" controlId="address">
                  <Form.Label>Address</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={2}
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="profileImage">
                  <Form.Label>Profile Image</Form.Label>
                  <Form.Control
                    type="file"
                    name="profileImage"
                    onChange={handleChange}
                    accept=".jpeg,.jpg,.png"
                  />
                </Form.Group>

                {isSeller(selectedUser) && (
                  <>
                    <h4 className="mt-4">Seller Information</h4>

                    <Form.Group className="mb-3" controlId="shopName">
                      <Form.Label>Shop Name</Form.Label>
                      <Form.Control
                        type="text"
                        name="shopName"
                        value={formData.shopName}
                        onChange={handleChange}
                      />
                    </Form.Group>

                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3" controlId="businessType">
                          <Form.Label>Business Type</Form.Label>
                          <Form.Select
                            name="businessType"
                            value={formData.businessType}
                            onChange={handleChange}
                          >
                            <option value="">Select</option>
                            <option value="individual">Individual</option>
                            <option value="sole_proprietorship">
                              Sole Proprietorship
                            </option>
                            <option value="company">Company</option>
                          </Form.Select>
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group
                          className="mb-3"
                          controlId="businessCategory"
                        >
                          <Form.Label>Business Category</Form.Label>
                          <Form.Control
                            type="text"
                            name="businessCategory"
                            value={formData.businessCategory}
                            onChange={handleChange}
                          />
                        </Form.Group>
                      </Col>
                    </Row>

                    <Form.Group className="mb-3" controlId="businessAddress">
                      <Form.Label>Business Address</Form.Label>
                      <Form.Control
                        type="text"
                        name="businessAddress"
                        value={formData.businessAddress}
                        onChange={handleChange}
                      />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="cnic">
                      <Form.Label>CNIC</Form.Label>
                      <Form.Control
                        type="text"
                        name="cnic"
                        value={formData.cnic}
                        onChange={handleChange}
                      />
                    </Form.Group>

                    <Row>
                      <Col md={6}>
                        <Form.Group
                          className="mb-3"
                          controlId="bankAccountTitle"
                        >
                          <Form.Label>Bank Account Title</Form.Label>
                          <Form.Control
                            type="text"
                            name="bankAccountTitle"
                            value={formData.bankAccountTitle}
                            onChange={handleChange}
                          />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group
                          className="mb-3"
                          controlId="bankAccountNumber"
                        >
                          <Form.Label>Bank Account Number</Form.Label>
                          <Form.Control
                            type="text"
                            name="bankAccountNumber"
                            value={formData.bankAccountNumber}
                            onChange={handleChange}
                          />
                        </Form.Group>
                      </Col>
                    </Row>

                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3" controlId="bankName">
                          <Form.Label>Bank Name</Form.Label>
                          <Form.Control
                            type="text"
                            name="bankName"
                            value={formData.bankName}
                            onChange={handleChange}
                          />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3" controlId="bankBranch">
                          <Form.Label>Bank Branch</Form.Label>
                          <Form.Control
                            type="text"
                            name="bankBranch"
                            value={formData.bankBranch}
                            onChange={handleChange}
                          />
                        </Form.Group>
                      </Col>
                    </Row>

                    <Form.Group className="mb-3" controlId="emergencyContact">
                      <Form.Label>Emergency Contact</Form.Label>
                      <Form.Control
                        type="text"
                        name="emergencyContact"
                        value={formData.emergencyContact}
                        onChange={handleChange}
                      />
                    </Form.Group>
                  </>
                )}

                {/* Password Change */}
                <h5 className="mt-4">Change Password</h5>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3" controlId="password">
                      <Form.Label>New Password</Form.Label>
                      <Form.Control
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3" controlId="confirmPassword">
                      <Form.Label>Confirm Password</Form.Label>
                      <Form.Control
                        type="password"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Button variant="primary" type="submit" className="mt-3">
                  Save Changes
                </Button>

                <div className="form-response-message mt-2">
                  <span
                    className={
                      formResponse?.type === "success"
                        ? "text-success"
                        : "text-danger"
                    }
                  >
                    {formResponse?.message}
                  </span>
                </div>
              </Form>
            </div>
          ) : (
            <p>No user data available</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => {
              setShowEditUserProfile(false);
              setFormResponse({
                message: "",
                type: "success",
              });
            }}
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default AdminUsersPage;
