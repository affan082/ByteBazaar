import { Link } from "react-router-dom";

function Forbidden() {
    return (
        <div className="d-flex flex-column align-items-center justify-content-center vh-100 text-center bg-light">
            <h1 className="display-3 text-danger fw-bold">403</h1>
            <h2 className="mb-3">Access Forbidden</h2>
            <p className="text-muted mb-4">
                You don’t have permission to view this page.
            </p>

            <div className="d-flex gap-3">
                <Link to="/" className="btn btn-primary">
                    Go Home
                </Link>
                <Link to="/signin" className="btn btn-outline-secondary">
                    Sign In
                </Link>
            </div>
        </div>
    );
}

export default Forbidden;
