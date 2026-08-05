import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Layout from "./Layout";
import "./index.css";
import IndexPage from "./IndexPage";
import App from "./App";
import ErrorPage from "./ErrorPage";
import SignInPage from "./account/SignInPage";
import UserPage from "./users/UserPage";
import UserCreatePage from "./users/UserCreatePage";
import UserEditPage from "./users/UserEditPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />, // outer wrapper — holds Context + Toaster
    errorElement: <ErrorPage />, // moved up here from the Layout route
    children: [
      { path: "signin", element: <SignInPage /> },
      {
        element: <Layout />,
        children: [
          { index: true, element: <IndexPage /> },
          { path: "signin", element: <SignInPage /> },
          { path: "users", element: <UserPage /> },
          { path: "users/create", element: <UserCreatePage /> },
          { path: "users/edit/:id", element: <UserEditPage /> },
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
