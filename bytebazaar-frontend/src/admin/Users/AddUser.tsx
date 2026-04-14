import { useContext, useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Button,
  Alert,
} from "react-bootstrap";
import axios from "axios";
import { ConfigContext } from "../../reducers/GlobalConfig.tsx";
import config from "../../config/global-info.json";

interface Role {
  _id: string;
  name: string;
}

function AddUser() {
  const config = useContext(ConfigContext);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "administrator",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [roles, setRoles] = useState<Role[]>([]);

  useEffect(() => {
    axios
      .get(config.server.uri + config.server.api.get_roles)
      .then((res) => {
        const fetchedRoles = res.data.data || [];
        setRoles(fetchedRoles);

        // Default: assign buyer role
        const buyerRole = fetchedRoles.find((r: any) => r.name === "buyer");
        if (buyerRole) {
          setFormValues((prev) => ({ ...prev, roles: [buyerRole._id] }));
        }
      })
      .catch((err) => {
        console.error("Failed to fetch roles:", err);
      });
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  console.log("existing role", formData.role);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess("");
    setError("");

    axios
      .post(config.server.uri + "admin/user/add", formData, {
        withCredentials: true,
      })
      .then((res) => {
        setSuccess(res.data.message);
        setFormData({
          name: "",
          email: "",
          password: "",
          role: "user",
        });
      })
      .catch((err) => {
        setError(err.response?.data?.message || "Something went wrong.");
      });
  };

  return (
    <Container className="py-4">
      <Row className="justify-content-center">
        <Col md={6}>
          <Card className="p-4 shadow-sm">
            <h3 className="mb-3">Add New Administrator</h3>
            {success && <Alert variant="success">{success}</Alert>}
            {error && <Alert variant="danger">{error}</Alert>}

            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type="text"
                  name="fullname"
                  placeholder="Enter full name"
                  value={formData.fullname}
                  onChange={handleChange}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Username</Form.Label>
                <Form.Control
                  type="text"
                  name="username"
                  placeholder="Enter full name"
                  value={formData.username}
                  onChange={handleChange}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  placeholder="Enter email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  name="password"
                  placeholder="Enter password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </Form.Group>

              {/* {roles.length > 0 && (
                <Form.Group className="mb-3">
                  <Form.Label>Role</Form.Label>
                  <Form.Select
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                  >
                    {roles.map((r) => (
                      <option value={r._id}>{r.name}</option>
                    ))}
                  </Form.Select>
                </Form.Group>
              )} */}

              <Button
                type="submit"
                variant="c-btn"
                className="c-btn"
                disabled={loading}
              >
                {loading ? "Creating..." : "Create User"}
              </Button>
            </Form>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default AddUser;
