import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { UserContext } from "./UserContext.tsx";
import Forbidden from "../pages/Forbidden/Forbidden.tsx";

interface Props {
  allowedRoles: String[];
}

function ProtectedRoute({ allowedRoles }: Props) {
  const { user } = useContext(UserContext);

  if (!user) {
    // Not logged in → redirect to signin
    return <Navigate to="/signin" replace />;
  }

  // Role check
  const hasRole = user.roles?.some((role) =>
    allowedRoles.includes(typeof role === "string" ? role : role.name),
  );
  if (!hasRole) {
    return <Forbidden />;
  }

  return <Outlet />;
}

export default ProtectedRoute;
