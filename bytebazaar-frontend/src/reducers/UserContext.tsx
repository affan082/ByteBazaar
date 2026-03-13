import { createContext } from "react";
import { UserInterface } from "./AuthProvider.tsx";

interface CreateUserContextType {
  user: Partial<UserInterface>;
  setUser: (user: Partial<UserInterface>) => void;
}

export const UserContext = createContext<Partial<CreateUserContextType>>({});
