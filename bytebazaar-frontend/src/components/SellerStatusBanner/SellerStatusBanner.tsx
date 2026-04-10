import { Alert } from "react-bootstrap";
import "./SellerStatusBanner.scss";

interface SellerStatusBannerProps {
  status: "pending" | "verified" | "rejected";
}

function SellerStatusBanner({ status }: SellerStatusBannerProps) {
  if (status === "verified") return null;

  const config = {
    pending: {
      variant: "warning",
      icon: "⏳",
      title: "Account Pending Approval",
      message:
        "Your seller account is under review. You'll be able to upload products and manage orders once approved by an admin.",
    },
    rejected: {
      variant: "danger",
      icon: "❌",
      title: "Account Rejected",
      message:
        "Your seller application was not approved. Please contact support for more information.",
    },
  };

  const { variant, icon, title, message } = config[status];

  return (
    <Alert variant={variant} className="seller-status-banner mb-4">
      <div className="d-flex align-items-center gap-3">
        <span className="banner-icon" style={{ fontSize: "2rem" }}>
          {icon}
        </span>
        <div>
          <Alert.Heading className="mb-1">{title}</Alert.Heading>
          <p className="mb-0">{message}</p>
        </div>
      </div>
    </Alert>
  );
}

export default SellerStatusBanner;
