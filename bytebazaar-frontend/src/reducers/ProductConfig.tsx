import product_config from "../admin/Config/ProductConfig.json";
import {createContext} from "react";

const productConfig = product_config;

export const ProductConfigContext = createContext(productConfig);