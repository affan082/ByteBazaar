import axios from "axios";
import config from "../config/global-info.json";

export async function GetCategories(query: Object) {
  try {
    const cleanQuery = Object.fromEntries(
      Object.entries(query).filter(([_, v]) => v !== undefined && v !== null),
    );
    // console.log(query);
    const url =
      config.server.uri +
      "category/?" +
      new URLSearchParams(cleanQuery).toString();
    const response = await axios.get(url);
    return response.data.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
}
