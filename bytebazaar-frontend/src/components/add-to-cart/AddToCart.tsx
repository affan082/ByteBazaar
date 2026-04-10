import { Button } from "react-bootstrap";
import { Bounce, toast, ToastPosition } from "react-toastify";
import ProductInterface from "../../interfaces/ProductInterface.tsx";
import { useContext, useState } from "react";
import "./add-to-cart.scss";
import { ConfigContext } from "../../reducers/GlobalConfig.tsx";
import ToastTemplate from "../ToastTemplate.tsx";
import cartService from "../../services/cartService.ts";

interface AddToCartProps {
  product: ProductInterface;
  label?: string;
  className?: string;
  quantity?: number;
  disabled?: boolean;
  onCartUpdate?: () => void;
}

function AddToCart({
  label,
  className,
  product,
  quantity = 1,
  disabled = false,
}: AddToCartProps) {
  const config = useContext(ConfigContext);
  const [loader, setLoader] = useState(false);
  const [isInCart, setIsInCart] = useState(false);

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

  async function addToCart() {
    setLoader(true);
    try {
      await cartService.addToCart(product._id, quantity);
      toast.success(
        <ToastTemplate message={"Successfully Added to Cart"} type="cart" />,
        toastOptions,
      );
    } catch (error: any) {
      toast.error(
        <ToastTemplate
          message={error.message || "Sorry, Cart could not be updated!"}
        />,
        toastOptions,
      );
    } finally {
      setLoader(false);
    }
  }

  return (
    <>
      <div className={"product-add-to-cart-wrapper d-flex align-items-end"}>
        <Button
          className={"add-to-cart " + className}
          onClick={addToCart}
          aria-label={"Add to Cart"}
          type={"button"}
          id={"add-to-cart-btn-" + product?._id}
          variant={"secondary"}
          size={"sm"}
          disabled={disabled}
        >
          {label || "Add To Cart"}
        </Button>
        <span
          className={"add-to-cart-loader " + loader ? "loading" : ""}
        ></span>
      </div>
    </>
  );
}

export default AddToCart;
