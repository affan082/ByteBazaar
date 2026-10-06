import config from "../config/global-info.json";
import axios from "axios";

export async function GetProducts(query: object) {
  try {
    const response = await axios.post(config.server.uri + "products/", query, {
      withCredentials: true,
    });

    if (!response.status) {
      throw new Error(
        "There was an issue connecting with the server. " + response.status,
      );
    }

    // Some Additional Fields will be added to the product for ease
    // console.log(response.data);
    response.data.data.forEach((product: any) => {
      if (product.featureImage) {
        product.featureImage = product.featureImage.startsWith("http")
          ? product.featureImage
          : config.server.uri + product.featureImage;
      } else {
        product.featureImage = config.server.uri + "placholder_image.svg";
      }

      if (Array.isArray(product.gallery)) {
        product.gallery = product.gallery.map((image: string) => {
          if (!image) return config.server.uri + "placholder_image.svg";
          return image.startsWith("http") ? image : config.server.uri + image;
        });
      }

      product.url = config.app.urls.product + (product.slug || "#");
    });

    // console.log(response.data);
    return response.data.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
