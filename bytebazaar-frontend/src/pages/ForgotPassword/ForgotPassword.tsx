import { useContext, useState } from "react";
import { Container, Form, Button, Alert, FormGroup } from "react-bootstrap";
import "./forgot-password.scss";
import { ServerResponse } from "../../reducers/AuthProvider.tsx";
import axios from "axios";
import { ConfigContext } from "../../reducers/GlobalConfig.tsx";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [recoveryCode, setRecoveryCode] = useState("");
  const [response, setResponse] = useState<ServerResponse>();
  const config = useContext(ConfigContext);
  const [formStep, setFormStep] = useState(0);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setloading] = useState(false);

  function handleEmailSubmit(e: any) {
    e.preventDefault();
    setloading(true);
    axios
      .post(
        config.server.uri + "forgot-password/",
        {
          email: email,
        },
        {
          withCredentials: true,
        },
      )
      .then((response) => {
        setResponse(response.data.message);
        setFormStep(1);
      })
      .catch((error) => {
        setEmailError(error.response?.data?.message || "Account not found.");
      })
      .finally(() => {
        setloading(false);
      });
  }

  function handleRecoveryCodeSubmit(e: any) {
    e.preventDefault();
    setloading(true);
    axios
      .post(
        config.server.uri + "verify-code/",
        {
          email: email,
          resetCode: recoveryCode,
        },
        {
          withCredentials: true,
        },
      )
      .then((response) => {
        setResponse(response.data.message);
        setFormStep(2);
      })
      .catch((error) => {
        setResponse(error.data.message);
      })
      .finally(() => {
        setloading(false);
      });
  }

  function handlePasswordReset(e: any) {
    e.preventDefault();
    setloading(true);
    axios
      .post(
        config.server.uri + "reset-password/",
        {
          email: email,
          password: newPassword,
        },
        {
          withCredentials: true,
        },
      )
      .then((response) => {
        setResponse(response.data.message);
        setTimeout(() => {
          window.location.href = "/signin";
        });
      })
      .catch((error) => {
        setResponse(error.data.message);
      })
      .finally(() => {
        setloading(false);
      });
  }

  return (
    <Container className={"page forgot-password-page section mt-5 mb-5 p-xl-5"}>
      <Container className={"form-wrapper p-5 shadow "}>
        <h2 className="text-center text-warning mb-4">Forgot Password</h2>
        {response?.message && (
          <Alert variant="success">{response.message}</Alert>
        )}
        {response?.status && <Alert variant="danger">{response.status}</Alert>}
        {formStep === 0 ? (
          <Form onSubmit={handleEmailSubmit}>
            <Form.Group controlId="formEmail" className="mb-3">
              <Form.Label className="mx-1">Email address</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setEmailError("");
                }}
                required
                disabled={loading}
                isInvalid={!!emailError}
              />
              <Form.Control.Feedback type="invalid">
                {emailError}
              </Form.Control.Feedback>
            </Form.Group>

            <Button variant="c-btn" type="submit" className="w-100 c-btn">
              {loading ? "Sending..." : "Send Code"}
            </Button>
          </Form>
        ) : formStep === 1 ? (
          <Form onSubmit={handleRecoveryCodeSubmit}>
            <Form.Group controlId="formEmail" className="mb-3">
              <Form.Label className="mx-1">Enter Recovery Code</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Recovery Code"
                value={recoveryCode}
                onChange={(e) => setRecoveryCode(e.target.value)}
                required
              />
            </Form.Group>

            <Button
              variant="c-btn"
              type="submit"
              className="w-100 c-btn"
              disabled={loading}
            >
              {loading ? "Sending..." : "Continue"}
            </Button>
          </Form>
        ) : formStep === 2 ? (
          <Form onSubmit={handlePasswordReset}>
            <Form.Group controlId="formEmail" className="mb-3">
              <Form.Label className="mx-1">Enter New Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </Form.Group>
            <Button
              variant="c-btn"
              type="submit"
              className="w-100 c-btn"
              disabled={loading}
            >
              Reset Password
            </Button>
          </Form>
        ) : (
          <></>
        )}
      </Container>
    </Container>
  );
}

export default ForgotPassword;
