import { Outlet, NavLink, useNavigate } from "react-router-dom";
import "./profile.scss";
import { useContext, useState } from "react";
import { UserContext } from "../../reducers/UserContext.tsx";
import { Button } from "react-bootstrap";

function ProfileLayout() {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  const isSeller = user?.roles?.some((role: any) => role.name === "seller");
  const isBuyer = user?.roles?.some((role: any) => role.name === "buyer");
  const isAdmin = user?.roles?.some((role: any) => role.name === "admin");

  // Track expanded submenus
  const [openMenus, setOpenMenus] = useState<{ [key: string]: boolean }>({});

  const toggleMenu = (menu: string) => {
    setOpenMenus((prev) => ({ ...prev, [menu]: !prev[menu] }));
  };

  // If user is not logged in → show Sign In message
  if (!user || !Object.keys(user).length) {
    return (
      <div className="page profile-page container d-flex flex-column justify-content-center align-items-center py-5">
        <h2 className="mb-3">You are not signed in</h2>
        <p className="text-muted">
          Please sign in to access your profile dashboard.
        </p>
        <Button
          variant="primary"
          className="mt-3"
          onClick={() => navigate("/signin")}
        >
          Sign In
        </Button>
      </div>
    );
  }

  // If user exists → show dashboard layout
  return (
    <div className="page profile-page container d-flex gap-4 py-5">
      <aside className="profile-sidebar p-3 shadow-sm">
        <h5 className="mb-4">Account Main</h5>
        <ul className="nav flex-column gap-2">
          <li>
            <NavLink to="." end className="nav-link">
              My Profile
            </NavLink>
          </li>

          {/* Buyer Submenu */}
          {isBuyer && (
            <>
              <li>
                <NavLink to="my-orders" className="nav-link">
                  My Orders
                </NavLink>
              </li>
              {/*<li>*/}
              {/*    <NavLink to="orders/history" className="nav-link">Orders History</NavLink>*/}
              {/*</li>*/}
              {/*<li>*/}
              {/*    <NavLink to="wishlist" className="nav-link">My Wishlist</NavLink>*/}
              {/*</li>*/}
            </>
          )}

          {/* Seller Submenu */}
          {isSeller && (
            <li>
              <li>
                <NavLink to={"/dashboard/analytics"} className="nav-link">
                  Analytics
                </NavLink>
              </li>
              <li>
                <NavLink to={"/dashboard/orders"} className="nav-link">
                  Orders
                </NavLink>
              </li>
              {/* <li>
                <NavLink to={"/dashboard/customers"} className="nav-link">
                  Customers
                </NavLink>
              </li> */}
              <div
                className="submenu-header d-flex align-items-center justify-content-between nav-link"
                onClick={() => toggleMenu("product")}
                style={{ cursor: "pointer" }}
              >
                <span>Products</span>
                <i
                  className={`bi ${
                    openMenus["seller"] ? "bi-chevron-down" : "bi-chevron-right"
                  }`}
                ></i>
              </div>
              {openMenus["product"] && (
                <ul className="nav flex-column ms-3 mt-2">
                  <li>
                    <NavLink to={"product/all"} className="nav-link">
                      All Products
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to={"product/add"}
                      className="nav-link"
                      onClick={window.location.reload}
                    >
                      Add New
                    </NavLink>
                  </li>
                </ul>
              )}
            </li>
          )}

          {/* Transactions & Settings */}
          {/*<li>*/}
          {/*    <NavLink to="transactions" className="nav-link">Transactions</NavLink>*/}
          {/*</li>*/}
          <li>
            <NavLink to="settings" className="nav-link">
              Profile Settings
            </NavLink>
          </li>
          <li>
            <NavLink to="logout" className="nav-link text-danger">
              Log Out
            </NavLink>
          </li>
        </ul>
      </aside>

      <main className="profile-content flex-grow-1 p-4 shadow-sm bg-white rounded">
        <Outlet />
      </main>
    </div>
  );
}

export default ProfileLayout;
