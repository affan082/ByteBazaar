import {createContext} from "react";

export interface CategoryArchiveContextProps{
    availablePriceRange:[number, number];
}

export const CategoryArchiveContext = createContext<CategoryArchiveContextProps>({});