// // import React from 'react'
// interface ButtonProp {
//   title: string;
//   iconURL: string;
//   href: string;
//   classes: string;
//   iconIsRight: boolean;
//   handler?: () => {};
// }

// function Button({
//   title = "",
//   iconURL = "",
//   href = "",
//   classes = "",
//   iconIsRight = true,
//   handler,
// }: ButtonProp) {
//   return (
//     <div className={`button-container p-2 ` + classes}>
//       <a href={href} className="btn" onClick={handler}>
//         <img
//           src={iconURL}
//           className={iconIsRight ? "icon-right " : "icon-left " + "mx-2 "}
//         />
//         <span>{title}</span>
//       </a>
//     </div>
//   );
// }

// export default Button;
