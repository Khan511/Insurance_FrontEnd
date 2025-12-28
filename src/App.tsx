// import { Route, Routes } from "react-router-dom";
// import "./App.css";
// import "./index.css";
// import Navbare from "./components/navBar/Navebar";

// import Footer from "./components/footer/Footer";
// import AllInsurances from "./components/insurances/All-Insurances";
// import { CreateUser } from "./pages/createuser/CreateUserPage";
// import LoginPage from "./pages/loginPage/LoginPage";
// import { ProtectedRoute } from "./components/protectedRoute/ProtectedRoute";
// import { PrivatePolicies } from "./pages/privatePolicies/PrivatePolicies";
// import CommercialPolicies from "./pages/commercialPolicies/CommercialPolicies";
// import ProductDetailsPage from "./pages/porductDetails/ProductDetailsPage";
// import { CustomerProductForm } from "./components/forms/customerPolicyForm/CustomerProductForm";
// import MyPage from "./pages/myPage/MyPage";
// import Claim from "./pages/claim/Claim";
// import MyPoliciesDetails from "./components/mypage/myPolicies/MyPoliciesDetails";
// import ClaimDetailsPage from "./components/mypage/myClaims/ClaimDetails";
// import InsuranceAdminDashboard from "./pages/admin/InsuranceAdminDashbord";
// import CustomerView from "./pages/admin/CustomerView";
// import CustomerEdit from "./pages/admin/EditCustomer";
// import AdminClaimDetails from "./pages/admin/AdminClaimDetails";
// import Home from "./components/home/Home";

// // Send verification mail
// // Need to set up Make   Insurace Agent
// // Role bassed access

// function App() {
//   console.log("Appen");

//   return (
//     <div className="grid grid-rows-[auto_1fr_auto] min-h-screen">
//       <Navbare />

//       <main className="flex-grow">
//         <Routes>
//           <Route path="/" element={<Home />} />
//           <Route path="/all-products" element={<AllInsurances />} />
//           <Route path="/private-products" element={<PrivatePolicies />} />
//           <Route path="/commercial-products" element={<CommercialPolicies />} />
//           <Route path="/products/:policyId" element={<ProductDetailsPage />} />
//           <Route path="/login" element={<LoginPage />} />

//           <Route path="/create-user" element={<CreateUser />} />
//           {/* Protected Routes */}
//           <Route element={<ProtectedRoute />}>
//             <Route path="admin/:tab?" element={<InsuranceAdminDashboard />} />
//             <Route
//               path="/admin/customers/:customerId"
//               element={<CustomerView />}
//             />
//             <Route
//               path="/admin/customers/:customerId/edit"
//               element={<CustomerEdit />}
//             />

//             <Route
//               path="/product-buy-form/:productId"
//               element={<CustomerProductForm />}
//             />
//             <Route path="/my-page/:tab" element={<MyPage />} />
//             <Route
//               path="/my-page/policies/:policyId/policiy-details"
//               element={<MyPoliciesDetails />}
//             />
//             <Route path="/file-claim" element={<Claim />} />
//             <Route
//               path="/my-claims/:claimNumber/claim-details"
//               element={<ClaimDetailsPage />}
//             />
//             <Route
//               path="/admin/claim-details/:claimId"
//               element={<AdminClaimDetails />}
//             />
//           </Route>
//         </Routes>
//       </main>

//       <Footer />
//     </div>
//   );
// }
// export default App;

import { lazy, Suspense } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import { ProtectedRoute } from "@/components/protectedRoute/ProtectedRoute";
import AdminClaimDetails from "./pages/admin/AdminClaimDetails";
import CustomerView from "./pages/admin/CustomerView";
import { PrivatePolicies } from "./pages/privatePolicies/PrivatePolicies";
import CommercialPolicies from "./pages/commercialPolicies/CommercialPolicies";
import ProductDetailsPage from "./pages/porductDetails/ProductDetailsPage";
import { CustomerProductForm } from "./components/forms/customerPolicyForm/CustomerProductForm";
import MyPage from "./pages/myPage/MyPage";
import MyPoliciesDetails from "./components/mypage/myPolicies/MyPoliciesDetails";
import Claim from "./pages/claim/Claim";
import ClaimDetailsPage from "./components/mypage/myClaims/ClaimDetails";
import { Spinner } from "./components/spinner/Spinner";
import { CreateUser } from "./pages/createuser/CreateUserPage";
import EditCustomer from "./pages/admin/EditCustomer";
import MainLayout from "./pages/mainLayout/MainLayout";
import ErrorBoundary from "./components/error/ErrorBoundary";

// Lazy load pages
const Home = lazy(() => import("@/components/home/Home"));
const AllInsurances = lazy(
  () => import("@/components/insurances/All-Insurances")
);
const LoginPage = lazy(() => import("@/pages/loginPage/LoginPage"));
const InsuranceAdminDashboard = lazy(
  () => import("@/pages/admin/InsuranceAdminDashbord")
);

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <ErrorBoundary>
        <Suspense fallback={<Spinner />}>
          <MainLayout />
        </Suspense>
      </ErrorBoundary>
    ),
    // errorElement: <ErrorBoundary />,
    children: [
      { index: true, element: <Home /> },
      { path: "all-products", element: <AllInsurances /> },
      { path: "private-products", element: <PrivatePolicies /> },
      { path: "commercial-products", element: <CommercialPolicies /> },
      { path: "products/:policyId", element: <ProductDetailsPage /> },
      { path: "login", element: <LoginPage /> },
      { path: "create-user", element: <CreateUser /> },

      // Admin routes
      {
        element: <ProtectedRoute />,
        // element: <ProtectedRoute allowedRoles={["admin"]} />,
        children: [
          { path: "admin/:tab?", element: <InsuranceAdminDashboard /> },
          { path: "admin/customers/:customerId", element: <CustomerView /> },
          {
            path: "admin/customers/:customerId/edit",
            element: <EditCustomer />,
          },
          {
            path: "admin/claim-details/:claimId",
            element: <AdminClaimDetails />,
          },
        ],
      },

      // Customer routes
      {
        // element: <ProtectedRoute allowedRoles={["customer"]} />,
        element: <ProtectedRoute />,
        children: [
          {
            path: "product-buy-form/:productId",
            element: <CustomerProductForm />,
          },
          { path: "my-page/:tab", element: <MyPage /> },
          {
            path: "my-page/policies/:policyId/policy-details",
            element: <MyPoliciesDetails />,
          },
          { path: "file-claim", element: <Claim /> },
          {
            path: "my-claims/:claimNumber/claim-details",
            element: <ClaimDetailsPage />,
          },
        ],
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
