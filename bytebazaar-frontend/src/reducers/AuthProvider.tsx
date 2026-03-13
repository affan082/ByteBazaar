import { ReactNode, useContext, useEffect, useState } from "react";
import { UserContext } from "./UserContext";
import { ConfigContext } from "./GlobalConfig";
import axios from "axios";
import config from "../config/global-info.json";
import { getCookie } from "../utils/utils.tsx";
// import { GetCurrentCart } from "./CartUtils.ts";
import { CartInterface } from "../interfaces/CartInterface.ts";
import { WishlistInterface } from "../interfaces/WishlistInterface.tsx";
// import {getCookie} from "../utils/utils.tsx";

// import {redirect} from "react-router-dom";

interface AuthProviderProps {
  children: ReactNode;
}

export interface UserInterface {
  _id: string;
  fullname: string;
  username: string;
  email: string;
  passwordHash: string;
  dob?: Date;
  gender?: string;
  address?: string;
  profileImageUrl?: string;
  createdAt?: string;
  cart: CartInterface[];
  wishlist: WishlistInterface[];
  phone: string;

  // Roles can be string ids or populated objects
  roles: (string | { _id: string; name: string })[];

  shopName?: string;
  businessType?: "individual" | "sole_proprietorship" | "company";
  businessCategory?: string;
  businessAddress?: string;

  cnic?: string;

  bankAccountTitle?: string;
  bankAccountNumber?: string;
  bankName?: string;
  bankBranch?: string;

  emergencyContact?: string;
  status?: "pending" | "verified" | "rejected";
}

const serverPath = config.server.uri;
const apis = config.server.api;

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const config = useContext(ConfigContext);
  // const storedUser = sessionStorage.getItem(config.user.stored_user_key);
  // const initialUser = storedUser
  //   ? JSON.parse(storedUser)
  //   : { username: "", userID: "" };

  const [user, setUser] = useState<Partial<UserInterface>>({});

  // useEffect(() => {
  //   sessionStorage.setItem(config.user.stored_user_key, JSON.stringify(user));
  // }, [user?._id]);

  // Get User Data Using The Secure Auth Cookie
  useEffect(() => {
    // console.log("user api", config.server.uri + config.server.api.user_data);

    axios
      .post(
        config.server.uri + config.server.api.user_data,
        {},
        {
          withCredentials: true,
        },
      )
      .then((res) => {
        console.log("hello world success");
        setUser(res.data.data);
        //   console.log(res.data.data);
      })
      .catch((_e) => {
        console.log("hello world fails");
        // TODO Show Signin Message if Automatic Signin Fails
        console.error(
          "The Automatic Signin was not success-full. Try Manually.",
        );
      });
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export default AuthProvider;

export const UserSignIn = ({
  data,
  loaderMethod,
  responseMethod,
  setUser,
  redirect,
}: UserSignUpProps) => {
  responseMethod = responseMethod ? responseMethod : () => {};
  setUser = setUser ? setUser : () => {};
  axios
    .post(config.server.uri + "signin", data, {
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
    })
    .then((response) => {
      loaderMethod ? loaderMethod(true) : "";
      responseMethod({
        status: "success",
        message: "Signin successfully." + redirect ? " Redirecting...." : "",
      });
      // const user = UpdateUserContextFromToken(setUser);
      redirect
        ? setTimeout(() => {
            window.location.href = redirect;
          }, 1000)
        : "";
      loaderMethod ? loaderMethod(false) : "";
    })
    .catch((err) => {
      loaderMethod ? loaderMethod(false) : "";
      const data = err?.response?.data;
      console.log("Error", data);
      if (Object.keys(data).length === 0) {
        responseMethod({
          status: "error",
          message: "Sorry, there was a problem signing in",
        });
        return;
      }

      responseMethod({ status: "error", message: data.message });

      // if(data.statusCode === 409){
      //   responseMethod({status:"error",message:data.details});
      // }
    });
};

// export interface UserSignUpProps{
//   data: {[key:string]:any};
//   loaderMethod?:Function|null;
//   responseMethod?:Function|null;
//   redirect?:string;
//   setUser?:Function|undefined;
// }

export interface ServerResponse {
  status: "success" | "error";
  message: string;
  data?: object | null | undefined;
}

interface UserSignUpProps {
  data: any;
  loaderMethod?: (loading: boolean) => void;
  // responseMethod?: (res: { status: string; message: string }) => void;
  responseMethod?: (res: ServerResponse) => void;
  setUser?: (user: any) => void;
  redirect?: string;
}

export const UserSignup = async ({
  data,
  loaderMethod = () => {},
  responseMethod = () => {},
  setUser = () => {},
  redirect,
}: UserSignUpProps) => {
  try {
    loaderMethod(true);

    const response = await axios.post(`${config.server.uri}signup`, data, {
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    });

    responseMethod({
      status: "success",
      message: `Signup successfully.${redirect ? " Redirecting..." : ""}`,
    });

    // Update user context from the returned token
    await UpdateUserContextFromToken(setUser);

    if (redirect) {
      setTimeout(() => {
        window.location.href = redirect;
      }, 1000);
    }
  } catch (err: any) {
    console.error("Signup error:", err);

    const data = err.response?.data;
    if (!data || Object.keys(data).length === 0) {
      responseMethod({
        status: "error",
        message: "Sorry, there was a problem signing up. Please try again.",
      });
    } else {
      responseMethod({
        status: "error",
        message: data.details || data.message || "Signup failed.",
      });
    }
  } finally {
    loaderMethod(false);
  }
};

interface UserLogoutProps {
  userMethod?: Function | undefined;
}

export function UserLogout({ userMethod = undefined }: UserLogoutProps) {
  if (userMethod) {
    userMethod(null);
  }

  axios
    .get(config.server.uri + "logout", {
      withCredentials: true,
    })
    .then(() => {
      window.location.reload();
      console.log("Logging Out");
    })
    .catch((err) => {
      console.error(err);
    });
}

export function GetUserDataFromCookie(): Partial<UserInterface> {
  let userCookie = getCookie("user_data");
  if (userCookie) {
    userCookie = userCookie.substring(2, userCookie.length);
    const userData = JSON.parse(userCookie);
    // console.log( userData);
    if (userData) {
      return userData;
    }
  }
  return {};
}

// export function ForgotPasswordResetEmail(email:string):ServerResponse{
//
//   return {};
// }

export function UpdateUserContextFromToken(
  setUser: Function,
): UserInterface | null {
  // const token = getCookie(config.keys.auth_token_key);
  // console.log(token,config.keys.auth_token_key,document.cookie);
  // console.log("Getting user data from token");
  let user = null;
  axios
    .post(
      config.server.uri + config.server.api.user_data,
      {},
      {
        withCredentials: true,
      },
    )
    .then((response) => {
      const data = response.data.data;
      setUser(data.user);
      user = data.user;
    })
    .catch((err) => {
      return Promise.reject(err);
    });
  return user;
}

export async function UpdateUserProfile(userData: any) {
  return axios
    .put(serverPath + apis.user_update, userData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      withCredentials: true,
    })
    .then((res) => {
      return res;
    })
    .catch((e) => {
      return e.message;
    });
}
