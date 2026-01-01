// components/layout/MainLayout.tsx
// import Footer from "@/components/footer/Footer";
// import Navbare from "@/components/navBar/Navebar";

// import { Outlet } from "react-router-dom";

// const MainLayout = () => {
//   return (
//     <div className="grid grid-rows-[auto_1fr_auto] min-h-screen">
//       <Navbare />
//       <main className="flex-grow">
//         <Outlet />
//       </main>
//       <Footer />
//     </div>
//   );
// };

// export default MainLayout;

// components/layout/MainLayout.tsx
import Footer from "@/components/footer/Footer";
import Navbare from "@/components/navBar/Navebar";
import ErrorBoundary from "@/components/error/ErrorBoundary";
import { Outlet } from "react-router-dom";

const MainLayout = () => {
  return (
    <div className="grid grid-rows-[auto_1fr_auto] min-h-screen">
      {/* Wrap Navbar with ErrorBoundary */}
      <ErrorBoundary>
        <Navbare />
      </ErrorBoundary>

      <main className="flex-grow">
        {/* Wrap main content with ErrorBoundary too */}
        <ErrorBoundary>
          <Outlet />
        </ErrorBoundary>
      </main>

      {/* Wrap Footer with ErrorBoundary */}
      <ErrorBoundary>
        <Footer />
      </ErrorBoundary>
    </div>
  );
};

export default MainLayout;
