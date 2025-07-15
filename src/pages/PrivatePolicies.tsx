import InsuranceCardComponent from "@/components/card/InsuranceCardComponent";
import { useGetAllPoliciesQuery } from "@/services/InsurancePolicySlice";
import { Spinner } from "react-bootstrap";

export const PrivatePolicies = () => {
  const { data: policies, isLoading } = useGetAllPoliciesQuery();
  console.log(policies);

  if (isLoading)
    return (
      <div className="text-center mt-5">
        <Spinner />
      </div>
    );
  return (
    <div className="container my-5">
      <div>
        <p className="text-center text-4xl underline mb-5">Private Policies</p>
        <div>
          {/* <InsuranceCardComponent
            policies={policies?.filter(
              (policy) => policy?.category?.name === "Private"
            )}
          /> */}
          <InsuranceCardComponent policies={policies} />
        </div>
      </div>
    </div>
  );
};
