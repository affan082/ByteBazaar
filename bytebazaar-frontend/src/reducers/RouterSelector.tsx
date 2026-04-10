import { useContext, useEffect, useState } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import PageWrapper from "../components/PageWrapper/PageWrapper.tsx";
import Home from "../pages/Home/Home.tsx";
import NotFound from "../pages/NotFound/NotFound.tsx";
import Delivery from "../pages/Delivery/Delivery.tsx";
import Faqs from "../pages/Faqs/Faqs.tsx";
import LegalNotice from "../pages/LegalNotice/LegalNotice.tsx";
import Aboutus from "../pages/Aboutus/Aboutus.tsx";
import Payment from "../pages/Payment/Payment.tsx";
import ContactUs from "../pages/Contactus/Contactus.tsx";
import Signup from "../pages/Signup/Signup.tsx";
import Signin from "../pages/Signin/Signin.tsx";
import CategoryArchive from "../pages/Category Archive/CategoryArchive.tsx";
import Wishlist from "../pages/Wishlist/Wishlist.tsx";
import Cart from "../pages/Cart/Cart.tsx";
import PaymentResult from "../pages/PaymentResult/PaymentResult.tsx";
import SingleProductTemplate from "../components/SingleProductTemplate/SingleProductTemplate.tsx";
import Forbidden from "../pages/Forbidden/Forbidden.tsx";
import ProtectedRoute from "./ProtectedRoute.tsx";
import ProfileLayout from "../pages/Profile/Dashboard.tsx";
import ProfileInfo from "../pages/Profile/ProfileInfo.tsx";
import MyOrders from "../pages/Profile/MyOrders.tsx";
import ProfileSettings from "../pages/Profile/ProfileSettings.tsx";
import Logout from "../pages/Profile/Logout.tsx";
import Customers from "../pages/Profile/Seller/Customers.tsx";
import AddProduct from "../admin/Products/AddProduct.tsx";
import Products from "../admin/Products/Products.tsx";
import OrdersSeller from "../pages/Profile/Seller/OrdersSeller.tsx";
import AddCategory from "../admin/Category/AddCategory.tsx";
import Categories from "../admin/Category/Categories.tsx";
import AdminDashboard from "../admin/Dashboard/AdminDashboard.tsx";
import { UserContext } from "./UserContext.tsx";
import SellerDashboard from "../pages/Profile/SellerDashboard.tsx";
import AdminUsersPage from "../admin/Users/Users.tsx";
import Preloader from "../components/Preloader/Preloader.tsx";
import AddUser from "../admin/Users/AddUser.tsx";
import AdminProductListing from "../admin/Products/AdminProductListing.tsx";
import AdminOrderListing from "../admin/AdminOrderListing.tsx";
import ForgotPassword from "../pages/ForgotPassword/ForgotPassword.tsx";
import Analytics from "../admin/Analytics/Analytics.tsx";
import PendingSellers from "../pages/Profile/Seller/PendingSellers.tsx";

export default function RouterSelector() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <PageWrapper _children={<Home />} />,
      errorElement: <PageWrapper _children={<NotFound />} />,
    },
    {
      path: "/delivery",
      element: <PageWrapper _children={<Delivery />} />,
    },
    {
      path: "/FAQs",
      element: <PageWrapper _children={<Faqs />} />,
    },
    {
      path: "/legal-notice",
      element: <PageWrapper _children={<LegalNotice />} />,
    },
    {
      path: "/about-us",
      element: <PageWrapper _children={<Aboutus />} />,
    },
    {
      path: "/payment",
      element: <PageWrapper _children={<Payment />} />,
    },
    {
      path: "/contact-us",
      element: <PageWrapper _children={<ContactUs />} />,
    },
    {
      path: "/signup",
      element: <PageWrapper _children={<Signup />} />,
    },
    {
      path: "/signin",
      element: <PageWrapper _children={<Signin />}></PageWrapper>,
    },
    {
      path: "/category/:categorySlug",
      element: <PageWrapper _children={<CategoryArchive />} />,
    },
    {
      path: "/wishlist",
      element: <PageWrapper _children={<Wishlist />} />,
    },
    {
      path: "/cart",
      element: <PageWrapper _children={<Cart />} />,
    },
    {
      path: "/payment-completed",
      element: <PaymentResult />,
    },
    {
      path: "/product/:slug",
      element: <PageWrapper _children={<SingleProductTemplate />} />,
    },
    {
      path: "/forbidden",
      element: <Forbidden />,
    },
    {
      path: "/shop/:slug?",
      element: <PageWrapper _children={<CategoryArchive />} />,
    },
    {
      path: "/forgot-password",
      element: <PageWrapper _children={<ForgotPassword />} />,
    },
    {
      path: "/dashboard",
      element: <PageWrapper _children={<ProfileLayout />} />,
      children: [
        { index: true, element: <ProfileInfo /> },
        {
          path: "analytics",
          element: <SellerDashboard />,
        },
        {
          path: "my-orders",
          element: <MyOrders />,
        },
        {
          path: "wishlist",
          element: <Wishlist />,
        },
        {
          path: "settings",
          element: <ProfileSettings />,
        },
        {
          path: "logout",
          element: <Logout />,
        },
        {
          path: "customers",
          element: <Customers />,
        },
        {
          path: "product",
          element: <ProtectedRoute allowedRoles={["seller"]} />,
          children: [
            {
              path: "add",
              element: <AddProduct />,
            },
            {
              path: "all",
              element: <Products />,
            },
            {
              path: ":productId",
              element: <AddProduct />,
            },
          ],
        },
        {
          path: "orders",
          element: <OrdersSeller />,
        },
        {
          path: "category",
          children: [
            {
              path: "add",
              element: <AddCategory />,
            },
            {
              path: "all",
              element: <Categories />,
            },
            {
              path: ":categoryId",
              element: <AddCategory />,
            },
          ],
        },
      ],
    },
  ]);
  const adminRouter = createBrowserRouter([
    {
      path: "/",
      element: <AdminDashboard />,
      errorElement: <NotFound />,
      children: [
        {
          index: true,
          element: <ProfileInfo />,
        },
        {
          path: "/analytics",
          element: <Analytics />,
        },
        {
          path: "sellers",
          element: <PendingSellers />,
        },
        {
          path: "category/all",
          element: <Categories />,
        },
        {
          path: "category/add",
          element: <AddCategory />,
        },
        {
          path: "logout",
          element: <Logout />,
        },
        {
          path: "users/all",
          element: <AdminUsersPage />,
        },

        {
          path: "users/add",
          element: <AddUser />,
        },
        {
          path: "products",
          element: <AdminProductListing />,
        },
        {
          path: "orders",
          element: <AdminOrderListing />,
        },
      ],
    },
  ]);

  const { user } = useContext(UserContext);
  const [appRoute, setAppRoute] = useState<any | null>(router);

  useEffect(() => {
    if (user && Object.keys(user).length > 0) {
      const isAdmin = user.roles?.some((r) =>
        typeof r === "string"
          ? r === "administrator"
          : r.name === "administrator",
      );
      setAppRoute(isAdmin ? adminRouter : router);
    } else {
      setAppRoute(router);
    }
  }, [user]);

  return appRoute !== null ? (
    <RouterProvider router={appRoute} />
  ) : (
    <Preloader />
  );
}
