import { createContext, Dispatch, SetStateAction } from "react";
import { UserInterface } from "./AuthProvider.tsx";

interface CreateUserContextType {
  user: Partial<UserInterface>;
  setUser: Dispatch<SetStateAction<Partial<UserInterface>>>;
}

export const UserContext = createContext<Partial<CreateUserContextType>>({});
