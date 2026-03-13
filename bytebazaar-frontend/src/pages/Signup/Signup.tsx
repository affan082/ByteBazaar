import "./signup.scss";
import {
  Container,
  Form,
  FormControl,
  FormGroup,
  FormLabel,
  Button,
  Row,
  Col,
  Spinner,
} from "react-bootstrap";
import { useContext, useEffect, useState } from "react";
import axios from "axios";

import config from "../../config/global-info.json";
import { UserSignup } from "../../reducers/AuthProvider";
import { UserContext } from "../../reducers/UserContext";

interface Role {
  _id: string;
  name: string;
}

interface ServerResponse {
  status: "success" | "error";
  message: string;
}

function Signup() {
  const [formValues, setFormValues] = useState<{ [key: string]: any }>({
    roles: [], // backend expects array of role IDs
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [loader, setLoader] = useState(false);
  const [response, setResponse] = useState<ServerResponse | null>(null);
  const { setUser } = useContext(UserContext);

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

  function updateValues(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  }

  function updateRole(roleName: string) {
    const selectedRole = roles.find((r) => r.name === roleName);
    if (selectedRole) {
      setFormValues((prev) => ({ ...prev, roles: [selectedRole._id] }));
    }
  }

  function validateForm() {
    const newErrors: { [key: string]: string } = {};

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const usernameRegex = /^[a-zA-Z0-9_]{5,}$/;
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

    if (!formValues.fullname) newErrors.fullname = "Full Name is required!";
    if (!formValues.username) newErrors.username = "Username is required!";
    else if (!usernameRegex.test(formValues.username))
      newErrors.username =
          "Username must be at least 5 characters and only letters, numbers, underscores";

    if (!formValues.email) newErrors.email = "Email is required!";
    else if (!emailRegex.test(formValues.email))
      newErrors.email = "Invalid email format!";

    if (!formValues.password) newErrors.password = "Password is required!";
    else if (!passwordRegex.test(formValues.password))
      newErrors.password =
          "Password must be 8+ chars, with uppercase, lowercase, and number";

    if (!formValues.retype_password)
      newErrors.retype_password = "Please retype password!";
    else if (formValues.password !== formValues.retype_password)
      newErrors.retype_password = "Passwords do not match!";

    // Validate seller-specific fields
    const roleName = roles.find((r) => r._id === formValues.roles?.[0])?.name;
    if (roleName === "seller") {
      if (!formValues.shopName)
        newErrors.shopName = "Shop Name is required for sellers!";
      if (!formValues.cnic) newErrors.cnic = "CNIC is required for sellers!";
      if (!formValues.bankAccountNumber)
        newErrors.bankAccountNumber = "Bank Account Number is required!";
    }

    return newErrors;
  }

  function handleSubmit(e: any) {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
    } else {
      setLoader(true);
      UserSignup({
        data: formValues,
        loaderMethod: setLoader,
        responseMethod: setResponse,
        setUser: setUser,
        redirect: "/",
      });
    }
  }

  // Figure out which role is selected
  const selectedRoleName =
      roles.find((r) => r._id === formValues.roles?.[0])?.name || "buyer";

  return (
      <Container className="page signup-page d-flex justify-content-center align-items-center p-5">
        <Form
            className="signup-form p-5 shadow"
            style={{ maxWidth: "700px", width: "100%", borderRadius: "1em" }}
            onSubmit={handleSubmit}
        >
          <h2 className="text-center mb-4">Create Your Account</h2>
          <div className="divider"></div>

          {/* Fullname + Username */}
          <Row>
            <FormGroup as={Col} className="mb-3">
              <FormLabel>Full Name</FormLabel>
              <FormControl
                  type="text"
                  name="fullname"
                  placeholder="Enter your full name"
                  value={formValues.fullname || ""}
                  onChange={updateValues}
                  isInvalid={!!errors.fullname}
              />
              <Form.Text className="text-danger">{errors.fullname}</Form.Text>
            </FormGroup>

            <FormGroup as={Col} className="mb-3">
              <FormLabel>Username</FormLabel>
              <FormControl
                  type="text"
                  name="username"
                  placeholder="Choose a username"
                  value={formValues.username || ""}
                  onChange={updateValues}
                  isInvalid={!!errors.username}
              />
              <Form.Text className="text-danger">{errors.username}</Form.Text>
            </FormGroup>
          </Row>

          {/* Email */}
          <FormGroup className="mb-3">
            <FormLabel>Email</FormLabel>
            <FormControl
                type="email"
                name="email"
                placeholder="Enter your email"
                value={formValues.email || ""}
                onChange={updateValues}
                isInvalid={!!errors.email}
            />
            <Form.Text className="text-danger">{errors.email}</Form.Text>
          </FormGroup>

          {/* Password + Retype */}
          <Row>
            <FormGroup as={Col} className="mb-3">
              <FormLabel>Password</FormLabel>
              <FormControl
                  type="password"
                  name="password"
                  placeholder="Enter password"
                  value={formValues.password || ""}
                  onChange={updateValues}
                  isInvalid={!!errors.password}
              />
              <Form.Text className="text-danger">{errors.password}</Form.Text>
            </FormGroup>

            <FormGroup as={Col} className="mb-3">
              <FormLabel>Retype Password</FormLabel>
              <FormControl
                  type="password"
                  name="retype_password"
                  placeholder="Retype password"
                  value={formValues.retype_password || ""}
                  onChange={updateValues}
                  isInvalid={!!errors.retype_password}
              />
              <Form.Text className="text-danger">
                {errors.retype_password}
              </Form.Text>
            </FormGroup>
          </Row>

          {/* Role Selection */}
          <FormGroup className="mb-3">
            <FormLabel>Register As</FormLabel>
            <div className="d-flex gap-3">
              <Form.Check
                  inline
                  type="radio"
                  label="Buyer"
                  name="role"
                  checked={selectedRoleName === "buyer"}
                  onChange={() => updateRole("buyer")}
              />
              <Form.Check
                  inline
                  type="radio"
                  label="Seller"
                  name="role"
                  checked={selectedRoleName === "seller"}
                  onChange={() => updateRole("seller")}
              />
            </div>
            <Form.Text className="text-danger">{errors.role}</Form.Text>
          </FormGroup>

          {/* Seller Specific Fields */}
          {selectedRoleName === "seller" && (
              <>
                <h5 className="mt-4">Seller Information</h5>
                <Row>
                  <FormGroup as={Col} className="mb-3">
                    <FormLabel>Shop Name</FormLabel>
                    <FormControl
                        type="text"
                        name="shopName"
                        placeholder="Your shop name"
                        value={formValues.shopName || ""}
                        onChange={updateValues}
                        isInvalid={!!errors.shopName}
                    />
                    <Form.Text className="text-danger">
                      {errors.shopName}
                    </Form.Text>
                  </FormGroup>

                  <FormGroup as={Col} className="mb-3">
                    <FormLabel>CNIC</FormLabel>
                    <FormControl
                        type="text"
                        name="cnic"
                        placeholder="e.g. 42101-1234567-8"
                        value={formValues.cnic || ""}
                        onChange={updateValues}
                        isInvalid={!!errors.cnic}
                    />
                    <Form.Text className="text-danger">{errors.cnic}</Form.Text>
                  </FormGroup>
                </Row>

                <Row>
                  <FormGroup as={Col} className="mb-3">
                    <FormLabel>Bank Account Number</FormLabel>
                    <FormControl
                        type="text"
                        name="bankAccountNumber"
                        placeholder="Enter bank account number"
                        value={formValues.bankAccountNumber || ""}
                        onChange={updateValues}
                        isInvalid={!!errors.bankAccountNumber}
                    />
                    <Form.Text className="text-danger">
                      {errors.bankAccountNumber}
                    </Form.Text>
                  </FormGroup>

                  <FormGroup as={Col} className="mb-3">
                    <FormLabel>Bank Name</FormLabel>
                    <FormControl
                        type="text"
                        name="bankName"
                        placeholder="Enter bank name"
                        value={formValues.bankName || ""}
                        onChange={updateValues}
                    />
                  </FormGroup>
                </Row>
              </>
          )}

          {/* Response Message */}
          <div className="message-container mb-2">
            {response && (
                <span className={`message ${response.status}`}>
              {response.message}
            </span>
            )}
          </div>

          {/* Submit Button */}
          <Button
              variant="primary"
              type="submit"
              className="btn-primary w-100 mb-3"
              disabled={loader}
          >
            {loader ? <Spinner size="sm" animation="border" /> : "Sign Up"}
          </Button>

          {/* Redirect to login */}
          <div className="text-center">
            Already have an account? <a href="/signin">Sign In</a>
          </div>
        </Form>
      </Container>
  );
}

export default Signup;
