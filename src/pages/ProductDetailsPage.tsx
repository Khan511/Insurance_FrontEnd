import { useGetProductDetailsQuery } from "@/services/InsuranceProductSlice";
import image from "../assets/image.png";
import {
  ResizablePanel,
  ResizablePanelGroup,
} from "../components/ui/resizable";
import { Link, useParams } from "react-router";
import { Spinner } from "react-bootstrap";
import { useGetCurrenttUserQuery } from "@/services/UserApiSlice";
import { useState } from "react";
import PremiumCaculator from "@/components/premiumcalculation/PremiumCaculator";

const ProductDetailsPage = () => {
  const { policyId } = useParams();
  const [showCalculator, setShowCalculator] = useState(false);
  const [calculatedPremium, setCalculatedPremium] = useState<number | null>(
    null
  );
  const { data: policyDetails, isLoading } = useGetProductDetailsQuery(
    Number(policyId)
  );
  const { data: currentUser } = useGetCurrenttUserQuery();

  if (isLoading) {
    return (
      <div className="flex justify-center mt-5">
        <Spinner />
      </div>
    );
  }

  console.log("Policy Id: ", policyDetails);

  return (
    <div className="container bg-gray-200 min-h-screen ">
      <div className="max-w-xl py-5 px-5 ">
        <p className="text-3xl font-semibold">{policyDetails?.displayName} </p>
        <p className="my-5">{policyDetails?.description}</p>
        <div className="flex gap-3 ">
          Target Audience:
          {policyDetails?.targetAudience.map((policy, index) => {
            return <p key={index}>{policy}</p>;
          })}
        </div>
        <div className="flex gap-3 ">
          Regions:
          {policyDetails?.regions.map((reg, index) => {
            return <p key={index}>{reg}</p>;
          })}
        </div>
      </div>
      {!currentUser?.data?.user && (
        <p className="text-sm text-danger px-5">
          You have to be logged in in order buy policy.
        </p>
      )}
      <div className="flex  gap-2 px-5">
        <Link
          to={`/product-buy-form/${policyId}`}
          className="btn btn-primary w-sm mt-0"
        >
          Buy Policy
        </Link>
        <button
          className="btn btn-outline-primary"
          onClick={() => setShowCalculator(!showCalculator)}
        >
          {showCalculator ? "Hide Calculator" : "Calculate Your Price"}
        </button>
      </div>
      {calculatedPremium !== null && (
        <div>
          <h5>Estimated Premium</h5>
          <h4>{calculatedPremium.toFixed(2)}DKK/year</h4>
        </div>
      )}

      {showCalculator && policyDetails && (
        <PremiumCaculator
          productType={policyDetails.productType}
          calculationConfig={policyDetails.calculationConfig}
          basePremium={policyDetails.calculationConfig?.basePremium?.amount}
          onCalculate={setCalculatedPremium}
        />
      )}

      <ResizablePanelGroup
        direction="vertical"
        className="min-h-[600px]  rounded-lg border w-full"
      >
        <ResizablePanel defaultSize={75} className="">
          <div className="flex h-full items-center justify-center p-6">
            <img src={image} alt="" />
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};

export default ProductDetailsPage;
