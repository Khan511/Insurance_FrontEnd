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
import ContactPage from "./pages/contact/Contact";

// Lazy load pages
const Home = lazy(() => import("@/pages/home/Home"));
const AllInsurances = lazy(() => import("@/pages/insurances/All-Insurances"));
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
      { path: "/all-products", element: <AllInsurances /> },
      { path: "/contact", element: <ContactPage /> },
      {
        path: "/private-products",
        element: <PrivatePolicies />,
      },
      { path: "/commercial-products", element: <CommercialPolicies /> },
      { path: "/products/:policyId", element: <ProductDetailsPage /> },
      { path: "/login", element: <LoginPage /> },
      { path: "/create-user", element: <CreateUser /> },

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
