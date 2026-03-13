import { Spinner } from "react-bootstrap";

const SpinnerComponent = () => {
    return (
        
            <Spinner
              animation="border"
              role="status"
              className="mx-auto mt-5 d-flex justify-content-center"
              style={{ width: "50px", height: "50px" }}
            >
              <span className="visually-hidden">Loading...</span>
            </Spinner>
    );
};

export default SpinnerComponent;