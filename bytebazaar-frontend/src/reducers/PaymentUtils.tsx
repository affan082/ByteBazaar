import { CartInterface } from "../interfaces/CartInterface.ts";
import global_config from "../config/global-info.json";
import axios from "axios";
import { toast } from "react-toastify";
import ToastTemplate from "../components/ToastTemplate.tsx";
// import {defaultToastOptions} from "./NotificationManager.tsx";
const config = global_config;

export async function HandlePayment(cart: CartInterface[]) {
  const payment_url = config.server.uri + config.server.api.payment;
  const product_list: any = [];

  if (!cart || !cart.length) {
    return undefined;
  }

  cart.forEach((item) => {
    product_list.push({
      purchase_id: item.product.paymentGateways[0].purchase_id,
      _id: item.product._id,
      seller: item.product.seller,
      quantity: item.quantity,
    });
  });

  return axios
    .post(
      payment_url,
      {
        products: product_list,
      },
      {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      },
    )
    .then((response) => {
      const data = response.data.data;
      if (data.redirect_url) {
        window.location.href = data.redirect_url;
      }
    })
    .catch((error) => {
      console.log(error);
      toast.error(<ToastTemplate message={error.response.data.message} />, {
        autoClose: 4000,
        position: "bottom-left",
      });
      return error;
    });
}
