// components/layout/MainLayout.tsx
import Footer from "@/components/footer/Footer";
import Navbare from "@/components/navBar/Navebar";

import { Outlet } from "react-router-dom";

const MainLayout = () => {
  return (
    <div className="grid grid-rows-[auto_1fr_auto] min-h-screen">
      <Navbare />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;
