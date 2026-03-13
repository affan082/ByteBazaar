import global_config from "../config/global-info.json";
import { createContext } from "react";

const config = global_config;

export const ConfigContext = createContext(config);
