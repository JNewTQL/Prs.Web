import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Layout from "./Layout";
import "./index.css";
import IndexPage from "./IndexPage";
import App from "./App";
import ErrorPage from "./ErrorPage";
import SignInPage from "./account/SignInPage";
import UserPage from "./users/UsersPage";
import UserCreatePage from "./users/UserCreatePage";
import UserEditPage from "./users/UserEditPage";
import VendorsPage from "./vendors/VendorsPage";
import VendorCreatePage from "./vendors/VendorCreatePage";
import VendorEditPage from "./vendors/VendorEditPage";
import ProductCreatePage from "./products/ProductCreatePage";
import ProductEditPage from "./products/ProductEditPage";
import ProductsPage from "./products/ProductsPage";
import RequestCreatePage from "./requests/RequestCreatePage";
import RequestEditPage from "./requests/RequestEditPage";
import RequestsPage from "./requests/RequestsPage";
import RequestDetailPage from "./requests/RequestDetailPage";
import RequestLineCreatePage from "./requestLines/RequestLineCreatePage";
import RequestLineEditPage from "./requestLines/RequestLineEditPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      { path: "signin", element: <SignInPage /> },
      {
        element: <Layout />,
        children: [
          { index: true, element: <IndexPage /> },
          { path: "users", element: <UserPage /> },
          { path: "users/create", element: <UserCreatePage /> },
          { path: "users/edit/:id", element: <UserEditPage /> },
          { path: "vendors", element: <VendorsPage /> },
          { path: "vendors/create", element: <VendorCreatePage /> },
          { path: "vendors/edit/:id", element: <VendorEditPage /> },
          { path: "products", element: <ProductsPage /> },
          { path: "products/create", element: <ProductCreatePage /> },
          { path: "products/edit/:id", element: <ProductEditPage /> },
          { path: "requests", element: <RequestsPage /> },
          { path: "requests/create", element: <RequestCreatePage /> },
          { path: "requests/edit/:id", element: <RequestEditPage /> },
          { path: "requests/detail/:id", element: <RequestDetailPage /> },
          { path: "requests/detail/:id/requestlines/create", element: <RequestLineCreatePage /> },
          { path: "requests/detail/:id/requestlines/edit/:lineId", element: <RequestLineEditPage /> },
        ],
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
);
