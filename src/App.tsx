import { Route, Routes } from "react-router-dom";
import "./App.css";
import "./index.css";
import Navbare from "./components/Navebar";
import Home from "./components/Home";
import Footer from "./components/Footer";
import AllInsurances from "./components/insurances/All-Insurances";
import { CreateUser } from "./pages/CreateUserPage";
import LoginPage from "./pages/LoginPage";
import { ProtectedRoute } from "./components/protectedRoute/ProtectedRoute";
import { PrivatePolicies } from "./pages/PrivatePolicies";
import CommercialPolicies from "./pages/CommercialPolicies";
import ProductDetailsPage from "./pages/ProductDetailsPage";
import { CustomerProductForm } from "./components/forms/customerPolicyForm/CustomerProductForm";
import MyPage from "./pages/MyPage";
import Claim from "./pages/claim/Claim";
import MyPoliciesDetails from "./components/mypage/myPolicies/MyPoliciesDetails";
import ClaimDetailsPage from "./components/mypage/myClaims/ClaimDetails";

// Working in myPage in my polices. Add beneficiary details
// Working in myPage in my Claim. Doceumtn attachemtn need some more properties

// INSURANCE YOUTUBE WEBSITE
// https://www.codewithmurad.com/2024/05/insurance-management-system-project.html

function App() {
  console.log("Appen");

  return (
    <div className="grid grid-rows-[auto_1fr_auto] min-h-screen">
      <Navbare />

      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/all-products" element={<AllInsurances />} />
          <Route path="/private-products" element={<PrivatePolicies />} />
          <Route path="/commercial-products" element={<CommercialPolicies />} />
          <Route path="/products/:policyId" element={<ProductDetailsPage />} />
          <Route path="/login" element={<LoginPage />} />

          <Route path="/create-user" element={<CreateUser />} />
          {/* Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route
              path="/product-buy-form/:productId"
              element={<CustomerProductForm />}
            />
            <Route path="/my-page" element={<MyPage />} />
            <Route
              path="/my-page/policy/:policyId"
              element={<MyPoliciesDetails />}
            />
            <Route path="/file-claim" element={<Claim />} />
            <Route
              path="/my-claims/:claimNumber"
              element={<ClaimDetailsPage />}
            />
          </Route>
        </Routes>
      </main>

      <Footer />
    </div>
  );
}
export default App;

// Need to set up Make Payment in My Policies + Evergency COntact+ Insurace Agent
