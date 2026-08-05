import Header from "./Header";
import AppNav from "./AppNav";
import { Outlet } from "react-router-dom";

function Layout() {
  return (
    <>
      <Header />
      <main className="d-flex">
        <AppNav />
        <Outlet />
      </main>
    </>
  );
}
export default Layout;
