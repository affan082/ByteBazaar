import { Stack } from "react-bootstrap";
import { useContext } from "react";
import { ConfigContext } from "../reducers/GlobalConfig.tsx";

interface ToastInterface {
  message: String;
}
function ToastTemplate({ message }: ToastInterface) {
  const config = useContext(ConfigContext);
  return (
    <Stack className={"toast-template"}>
      <h6 className={"toast-message"}>{message}</h6>
      {/* <a href={config.app.urls.cart} className={"cart-popup-cart-link"}>View Cart</a> */}
    </Stack>
  );
}

export default ToastTemplate;
