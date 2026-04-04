import { useState, useEffect, useContext } from "react";
import { useSearchParams } from "react-router-dom";
import { Container, Card, Button, Row, Spinner } from "react-bootstrap";
import axios from "axios";
import { ConfigContext } from "../../reducers/GlobalConfig.tsx";
import "./payment-result.scss";
import cartService from "../../services/cartService.ts";

const App = () => {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const success = searchParams.get("success") === "true";
  const cancel = searchParams.get("canceled") === "true";
  const config = useContext(ConfigContext);

  const [paymentStatus, setPaymentStatus] = useState("Pending");
  const [error, setError] = useState("");
  const [transactionId, setTransactionId] = useState("");

  useEffect(() => {
    if (!sessionId) {
      setPaymentStatus("Failed");
      setError("The Session Id is Missing");
      return;
    } else {
      if (cancel) {
        axios
          .get(
            config.server.uri +
              config.server.api.payment_cancel +
              "?session_id=" +
              sessionId,
          )
          .then((res) => {
            console.log(res);
            setError(res.data.message || "Unknown Error");
          })
          .catch(() => {
            setError("Unknown Error");
          });

        setPaymentStatus("Failed");
      } else if (success) {
        axios
          .get(
            config.server.uri +
              config.server.api.payment_success +
              "?session_id=" +
              sessionId,
          )
          .then(async (res) => {
            setTransactionId(res.data.data.transaction_id);
            await cartService.clearCart();
            setPaymentStatus("Successful");
          })
          .catch((_err) => {
            setPaymentStatus("Failed");
          });
      } else {
        setError("Unknow Error");
        setPaymentStatus("Failed");
      }
    }
  }, [sessionId, config.server.uri]); // Dependencies to re-run effect if sessionId or API URI changes

  return (
    <>
      <div className="payment-container">
        <Container fluid className="p-3">
          <Row className="justify-content-center">
            <Card className="payment-card border-0">
              <Card.Body>
                {paymentStatus === "Pending" && (
                  <>
                    <div className="icon-pending mx-auto my-3">
                      <Spinner
                        animation="border"
                        role="status"
                        variant="warning"
                      >
                        <span className="visually-hidden">Loading...</span>
                      </Spinner>
                    </div>
                    <Card.Title
                      as="h2"
                      className="text-3xl font-weight-bold mb-2"
                    >
                      Processing Payment...
                    </Card.Title>
                    <Card.Text className="text-muted mb-4">
                      Please wait while we confirm your transaction.
                    </Card.Text>
                  </>
                )}
                {paymentStatus === "Successful" && (
                  <>
                    <svg
                      className="icon-success mx-auto my-3"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      ></path>
                    </svg>
                    <Card.Title
                      as="h2"
                      className="text-3xl font-weight-bold mb-2"
                    >
                      Payment Successful!
                    </Card.Title>
                    <Card.Text className="text-muted mb-2">
                      Your payment has been processed.
                    </Card.Text>
                    <Card.Text className="text-muted mb-4">
                      Transaction ID: <strong>{transactionId}</strong>
                    </Card.Text>
                    <Button
                      variant="success"
                      href={config.app.urls.root}
                      className="w-100 rounded-pill py-2"
                    >
                      Back to Home
                    </Button>
                  </>
                )}

                {paymentStatus === "Failed" && (
                  <>
                    <svg
                      className="icon-failed mx-auto my-3"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                      ></path>
                    </svg>
                    <Card.Title
                      as="h2"
                      className="text-3xl font-weight-bold mb-2"
                    >
                      Payment Failed.
                    </Card.Title>
                    <Card.Text className="text-muted mb-4">
                      There was an issue processing your payment. Please try
                      again or contact support.
                      <br />
                      {error ? (
                        <span className={"reason"}>
                          Reason: <strong>{error}</strong>
                        </span>
                      ) : (
                        <></>
                      )}
                    </Card.Text>
                    <Button
                      variant="info"
                      href={config.app.urls.root}
                      className="w-100 rounded-pill py-2"
                    >
                      Go Home
                    </Button>
                  </>
                )}
              </Card.Body>
            </Card>
          </Row>
        </Container>
      </div>
    </>
  );
};

export default App;
