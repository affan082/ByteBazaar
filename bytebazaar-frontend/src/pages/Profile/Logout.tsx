import { useNavigate } from "react-router-dom";
import axios from "axios";
import config from "../../config/global-info.json";
import { useContext } from "react";
import { UserContext } from "../../reducers/UserContext.tsx";

function Logout() {
  const navigate = useNavigate();
  const { user, setUser } = useContext(UserContext);

  async function handleLogout() {
    try {
      await axios.post(
        config.server.uri + "logout",
        {},
        { withCredentials: true },
      );

      if (setUser) {
        setUser({});
      }

      // Redirect to signin/home
      navigate("/");
    } catch (err) {
      console.error("Logout failed:", err);
      alert("Failed to log out. Please try again.");
    }
  }

  return (
    <div>
      <h3>Logout</h3>
      <p>Are you sure you want to log out?</p>
      <button className="btn btn-danger" onClick={handleLogout}>
        Yes, Log Out
      </button>
    </div>
  );
}

export default Logout;
