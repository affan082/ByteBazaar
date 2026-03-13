// import { useEffect, useState } from "react";
// import { GetCurrentCart } from "../../../reducers/CartUtils.ts";

// function CartIcon() {
//   //TODO: Make the count update as soon as the product is added to cart.
//   const [cartItemCount, setCartItemCount] = useState(0);
//   useEffect(() => {
//     GetCurrentCart().then((_res) => {
//       setCartItemCount(_res.length);
//     });
//   });

//   return (
//     <a className="cart-cont header-icon" href="/cart">
//       <i className="bi bi-cart mx-2 "></i>
//       <span>Cart</span>
//       <span
//         className="count cart-count"
//         style={{ position: "absolute", top: "0", left: "40%" }}
//       >
//         {cartItemCount}
//       </span>
//     </a>
//   );
// }

// export default CartIcon;
