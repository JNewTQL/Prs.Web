import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Layout from "./Layout";
import "./index.css";
import IndexPage from "./IndexPage";
import App from "./App";
import ErrorPage from "./ErrorPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />, // outer wrapper — holds Context + Toaster
    errorElement: <ErrorPage />, // moved up here from the Layout route
    children: [
      // { path: "signin", element: <SignInPage /> }, // sibling of Layout → no shell
      {
        element: <Layout />,
        children: [
          { index: true, element: <IndexPage /> },
          // { path: "menuitems", element: <MenuItemsPage /> },
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
