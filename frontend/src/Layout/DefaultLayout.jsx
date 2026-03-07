import { Outlet } from "react-router-dom";
import MyHeader from "../Components/MacroComponents/MyHeader";
import MyFooter from "../Components/MacroComponents/MyFooter";
export default function DefaultLayout({setDrawerOpen}) {
  return (
    <>
      <MyHeader setDrawerOpen={setDrawerOpen} />
      <main>
        <Outlet />
      </main>
    <MyFooter />
    </>
  );
}
