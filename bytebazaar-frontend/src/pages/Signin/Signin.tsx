import "bootstrap/dist/css/bootstrap.css";
import "../Signup/signup.scss";
import {
  Button,
  Col,
  Container,
  Form,
  FormControl,
  FormGroup,
  FormLabel,
  Row,
  Stack,
} from "react-bootstrap";
import { ServerResponse, UserSignIn } from "../../reducers/AuthProvider.tsx";
import { useContext, useState } from "react";
import { UserContext } from "../../reducers/UserContext.tsx";

function Signin() {
  const [formValues, setFormValues] = useState<{ [key: string]: any }>({});
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  // const config = useContext(ConfigContext);
  const [loader, setLoader] = useState(false);
  const [response, setResponse] = useState<ServerResponse>();
  const { setUser } = useContext(UserContext);

  function updateValues(e: any) {
    setFormValues({ ...formValues, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" }); // clear error on typing
  }

  function validateForm() {
    const newErrors: { [key: string]: string } = {};

    // const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    // const usernameRegex = /^[a-zA-Z0-9_]{5,}$/;
    // const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

    // Username
    if (!formValues.username) {
      newErrors.username = "Please provide a username!";
    }

    // // Password
    // if (!formValues.password) {
    //   newErrors.password = "Password is required!";
    // } else if (!passwordRegex.test(formValues.password)) {
    //   newErrors.password = "Password must be at least 8 characters and include at least 1 uppercase letter, 1 lowercase letter, and 1 number";
    // }

    return newErrors;
  }

  function handleSubmit(e: any) {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
    } else {
      // console.log("Form submitted:", formValues);
      setLoader(true);
      setResponse({ status: "success", message: "Signing in, Please Wait.2" });
      UserSignIn({
        data: formValues,
        loaderMethod: setLoader,
        responseMethod: setResponse,
        setUser: setUser,
        redirect: "/",
      });
    }
  }

  return (
    <Container className="page signup-page d-flex justify-content-center align-items-center p-5">
      <Form
        className="signup-form p-5 shadow"
        style={{ maxWidth: "600px", width: "100%", borderRadius: "1em" }}
        onSubmit={handleSubmit}
      >
        <h2 className="text-center mb-4">Sign In</h2>
        <div className="divider"></div>

        <Row>
          <Stack
            direction={"horizontal"}
            className={"align-items-center"}
            gap={2}
          >
            <FormGroup className="mb-3" as={Col}>
              <FormLabel>Username</FormLabel>
              <FormControl
                type="text"
                name="username"
                placeholder="Enter Username"
                value={formValues.username || ""}
                onChange={updateValues}
                isInvalid={!!errors.username}
              />
              <Form.Text className="text-danger">{errors.username}</Form.Text>
            </FormGroup>
            {/*<div className={"form-or mt-3"} style={{textAlign:"center"}}>OR</div>*/}
            {/*<FormGroup className="mb-3" as={Col}>*/}
            {/*  <FormLabel>Email</FormLabel>*/}
            {/*  <FormControl*/}
            {/*      type="text"*/}
            {/*      name="email"*/}
            {/*      placeholder="Enter your email"*/}
            {/*      value={formValues.email || ""}*/}
            {/*      onChange={updateValues}*/}
            {/*      isInvalid={!!errors.email}*/}
            {/*  />*/}
            {/*  <Form.Text className="text-danger">{errors.email}</Form.Text>*/}
            {/*</FormGroup>*/}
          </Stack>
        </Row>

        <Row>
          <FormGroup className="mb-3" as={Col}>
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
        </Row>

        <div className={"message-container"}>
          <span className={"message " + response?.status || ""}>
            {response?.message || ""}
          </span>
        </div>

        <div className="d-flex justify-content-between mb-3">
          <a href="/forgot-password">Forgot Password?</a>
          <a href={"/signup"}>Create an Account</a>
        </div>

        <Button
          variant="primary"
          type="submit"
          className="btn-primary w-100 mb-3 mt-3 p-2"
        >
          Sign In
        </Button>

        <div
          className={"form-loader"}
          style={{ visibility: loader ? "visible" : "hidden" }}
        ></div>
      </Form>
    </Container>
  );
}

export default Signin;
