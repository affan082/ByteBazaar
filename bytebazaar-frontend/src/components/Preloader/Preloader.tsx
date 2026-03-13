import { Spinner } from "react-bootstrap";
import "./preloader.scss";

function Preloader() {
  return (
    <div className="preloader d-flex justify-content-center align-items-center">
      <div className="text-center">
        <Spinner animation="border" role="status" variant="primary" />
        <p className="mt-3 text-muted">Loading, please wait...</p>
      </div>
    </div>
  );
}

export default Preloader;
