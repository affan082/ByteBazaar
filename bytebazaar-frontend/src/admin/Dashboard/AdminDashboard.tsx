import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import { UserContext } from "../../reducers/UserContext";
import { Button } from "react-bootstrap";
import "./admin-dashboard.css";

function AdminDashboard() {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);

  const isAdmin = user?.roles?.some(
    (role: any) => role.name === "administrator",
  );

  if (!user || !Object.keys(user).length || !isAdmin) {
    return (
      <div className="page admin-page container d-flex flex-column justify-content-center align-items-center py-5">
        <h2 className="mb-3">Unauthorized</h2>
        <p className="text-muted">
          You must be an administrator to access this page.
        </p>
        <Button
          variant="primary"
          className="mt-3"
          onClick={() => navigate("/")}
        >
          Go Home
        </Button>
      </div>
    );
  }

  return (
    <div className="page admin-page d-flex gap-4 content-box page-section">
      <div className={"page-section container-fluid d-flex"}>
        <aside className="admin-sidebar p-3 shadow-sm">
          <h5 className="mb-4">Admin Panel</h5>
          <ul className="nav flex-column gap-2">
            <li>
              <NavLink to="." end className="nav-link">
                <i className="bi bi-speedometer2 me-2"></i> Dashboard
              </NavLink>
            </li>
            <li>
              <NavLink to="/analytics" className="nav-link">
                <i className="bi bi-graph-up me-2"></i> Analytics
              </NavLink>
            </li>
            <li className={"submenu " + (userOpen ? "open" : "")}>
              <button
                className={
                  "nav-link d-flex justify-content-between align-items-center w-100"
                }
                onClick={() => setUserOpen(!userOpen)}
              >
                <span>
                  <i className="bi bi-people me-2"></i> Users
                </span>
                <i
                  className={`bi ${
                    userOpen ? "bi-chevron-up" : "bi-chevron-down"
                  }`}
                />
              </button>
              {userOpen && (
                <ul className="submenu-list ps-3 mt-2">
                  <li>
                    <NavLink to="users/add" className="nav-link small">
                      <i className="bi bi-plus-circle me-2"></i> Add Admin
                    </NavLink>
                  </li>
                  <li>
                    <NavLink to="users/all" className="nav-link small">
                      <i className="bi bi-list-ul me-2"></i> All Users
                    </NavLink>
                  </li>
                </ul>
              )}
            </li>
            <li>
              <NavLink to="products" className="nav-link">
                <i className="bi bi-box-seam me-2"></i> Manage Products
              </NavLink>
            </li>
            <li className="submenu">
              <button
                className="nav-link d-flex justify-content-between align-items-center w-100"
                onClick={() => setCategoriesOpen(!categoriesOpen)}
              >
                <span>
                  <i className="bi bi-tags me-2"></i> Categories
                </span>
                <i
                  className={`bi ${
                    categoriesOpen ? "bi-chevron-up" : "bi-chevron-down"
                  }`}
                />
              </button>
              {categoriesOpen && (
                <ul className="submenu-list ps-3 mt-2">
                  <li>
                    <NavLink to="category/add" className="nav-link small">
                      <i className="bi bi-plus-circle me-2"></i> Add Category
                    </NavLink>
                  </li>
                  <li>
                    <NavLink to="category/all" className="nav-link small">
                      <i className="bi bi-list-ul me-2"></i> All Categories
                    </NavLink>
                  </li>
                </ul>
              )}
            </li>
            <li>
              <NavLink to="orders" className="nav-link">
                <i className="bi bi-receipt-cutoff me-2"></i> Orders
              </NavLink>
            </li>
            <li>
              <NavLink to="logout" className="nav-link text-danger">
                Log Out
              </NavLink>
            </li>
          </ul>
        </aside>

        <main className="admin-content flex-grow-1 p-4  bg-white rounded">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AdminDashboard;
