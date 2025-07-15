import { useGetPolicyDetailsQuery } from "@/services/InsurancePolicySlice";
import image from "../assets/image.png";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "../components/ui/resizable";
import { Link, useParams } from "react-router";
import { Spinner } from "react-bootstrap";
import { useGetCurrenttUserQuery } from "@/services/UserApiSlice";

const PolicyDetailsPage = () => {
  const { policyId } = useParams();
  const { data: policyDetails, isLoading } = useGetPolicyDetailsQuery(
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
        {!currentUser?.data?.user && (
          <p className="text-sm text-danger ">
            You have to be logged in in order buy policy.
          </p>
        )}
        <Link to="/customer-policy-form" className="btn btn-primary w-sm mt-0">
          Buy Policy
        </Link>
      </div>
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

export default PolicyDetailsPage;
