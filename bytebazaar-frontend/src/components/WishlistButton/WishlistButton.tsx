import { Button } from "react-bootstrap";
import ProductInterface from "../../interfaces/ProductInterface";
import React, { useState, useEffect } from "react";
// import { useWishlist } from "../../contexts/WishlistContext";
import { ConfigContext } from "../../reducers/GlobalConfig";
import ToastTemplate from "../ToastTemplate";
import wishlistService from "../../services/wishlistService";
import { Bounce, toast, ToastPosition } from "react-toastify";
import { useContext } from "react";
import { UserContext } from "../../reducers/UserContext";

interface WishlistButtonProps {
  product: ProductInterface;
  size?: "sm" | "lg";
  variant?: "outline" | "filled";
  showLabel?: boolean;
  className?: string;
  isInWishlist?: boolean;
  onToggle?: (isInWishlist: boolean) => void;
}

function WishlistButton({
  product,
  size = "sm",
  variant = "outline",
  showLabel = true,
  className,
  isInWishlist: initialIsInWishlist = false,
  onToggle,
}: WishlistButtonProps) {
  const [loader, setLoader] = useState(false);
  const [isInWishlist, setIsInWishlist] = useState(initialIsInWishlist);
  const { user, setUser } = useContext(UserContext);

  useEffect(() => {
    setIsInWishlist(initialIsInWishlist);
  }, [initialIsInWishlist]);

  const toastOptions = {
    position: "bottom-right" as ToastPosition,
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: false,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "light",
    transition: Bounce,
  };

  async function toggleWishlist() {
    setLoader(true);
    try {
      const result = await wishlistService.toggleWishlist(product._id);
      setIsInWishlist(result.isInWishlist);
      // onToggle?.(result.isInWishlist);
      if (setUser) {
        setUser((prev) => ({
          ...prev,
          wishlist: result.wishlist,
        }));
      }
      toast.success(
        <ToastTemplate
          message={
            result.isInWishlist ? "Added to Wishlist" : "Removed from Wishlist"
          }
        />,
        toastOptions,
      );
    } catch (error: any) {
      toast.error(
        <ToastTemplate
          message={error.message || "Sorry, Wishlist could not be updated!"}
        />,
        toastOptions,
      );
    } finally {
      setLoader(false);
    }
  }

  const buttonVariant = isInWishlist ? "danger" : "outline-danger";
  const icon = isInWishlist ? (
    <i className="bi bi-heart-fill mx-2"></i>
  ) : (
    <i className="bi bi-heart mx-2"></i>
  );
  const label = isInWishlist ? "Remove" : "Add to Wishlist";
  const title = isInWishlist ? "Remove from wishlist" : "Add to wishlist";

  return (
    <>
      <Button
        variant={buttonVariant}
        size={size}
        onClick={toggleWishlist}
        disabled={loader}
        title={title}
        className={` ${className}`}
        aria-label={title}
      >
        <>
          <span className="wishlist-icon">{icon}</span>
          {showLabel && <span className="wishlist-label ms-1">{label}</span>}
        </>
      </Button>
    </>
  );
}

export default WishlistButton;
