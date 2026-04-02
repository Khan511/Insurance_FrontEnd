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
import { Toaster } from "@/components/ui/sonner";
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

      {/* Toast notifications */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: "#363636",
            color: "#fff",
          },
          success: {
            duration: 3000,
            style: {
              background: "#22c55e",
            },
          },
          error: {
            duration: 5000,
            style: {
              background: "#ef4444",
            },
          },
        }}
      />
    </div>
  );
};

export default MainLayout;
