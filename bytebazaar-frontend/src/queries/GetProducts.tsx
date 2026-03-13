import config from "../config/global-info.json";
import axios from "axios";

export async function GetProducts(query: object) {
  try {
    const response = await axios.post(config.server.uri + "products/", query, {
      withCredentials: true,
    });

    if (!response.status) {
      throw new Error(
        "There was an issue connecting with the server. " + response.status
      );
    }

    // Some Additional Fields will be added to the product for ease
    // console.log(response.data);
    response.data.data.forEach((product: any) => {
      product.featureImage =
        config.server.uri + (product.featureImage || "placholder_image.svg");
      product.gallery?.map((image: string) => {
        image = config.server.uri + (image || "placholder_image.svg");
      });
      // product.featureImage = config.server.uri + "placholder_image.svg";
      product.url = config.app.urls.product + (product.slug || "#");
    });

    // console.log(response.data);
    return response.data.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
// export async function GetProducts(query: object) {
//   try {
//     const url = config.server.uri+"products/?"+new URLSearchParams(query).toString();
//     const response = await axios.get(url);
//     console.log(url);
//
//     if (!response.status) {
//       throw new Error(
//           "There was an issue connecting with the server. " + response.status
//       );
//     }
//     // Some Additional Fields will be added to the product for ease
//     response.data.forEach((product: any) => {
//       product.featureImage = config.server.uri + (product.featureImage || "placholder_image.svg");
//       product.gallery?.map((image:string)=>{
//         image = config.server.uri + (image || "placholder_image.svg");
//       })
//       // product.featureImage = config.server.uri + "placholder_image.svg";
//       product.url = config.app.product_single_path + product._id;
//     });
//
//     // console.log(response.data);
//     return response.data;
//   } catch (error) {
//     console.error(error);
//     throw error;
//   }
// }
