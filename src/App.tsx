import { Route, Routes } from "react-router-dom";
import "./App.css";
import Navbare from "./components/Navebar";
import Home from "./components/Home";
import Footer from "./components/Footer";
import AllInsurances from "./components/insurances/All-Insurances";
import { CreateUser } from "./pages/CreateUserPage";
import LoginPage from "./pages/LoginPage";
import { ProtectedRoute } from "./components/protectedRoute/ProtectedRoute";
import { PrivatePolicies } from "./pages/PrivatePolicies";
import CommercialPolicies from "./pages/CommercialPolicies";
import PolicyDetailsPage from "./pages/PolicyDetailsPage";
import { CustomerPolicyForm } from "./components/forms/customerPolicyForm/CustomerPolicyForm";

// Now i got the insuranceProduct together with PremiumcalculationConfig. now i need to calculate the insurance price after user click on the "Calculate Your Price" button in the PolicyDetailsPage.
function App() {
  return (
    <div className="grid grid-rows-[auto_1fr_auto] min-h-screen">
      <Navbare />

      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/all-insurances" element={<AllInsurances />} />
          <Route path="/private-policies" element={<PrivatePolicies />} />
          <Route path="/commercial-policies" element={<CommercialPolicies />} />
          <Route path="/policies/:policyId" element={<PolicyDetailsPage />} />
          <Route path="/login" element={<LoginPage />} />

          <Route path="/create-user" element={<CreateUser />} />
          {/* Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route
              path="/customer-policy-form/:policyId"
              element={<CustomerPolicyForm />}
            />
          </Route>
        </Routes>
      </main>

      <Footer />
    </div>
  );
}
export default App;
