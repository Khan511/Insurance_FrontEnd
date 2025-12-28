import InsuranceCardComponent from "@/components/card/InsuranceCardComponent";
import { useGetAllProductsQuery } from "@/services/InsuranceProductSlice";
import { Spinner } from "react-bootstrap";

const CommercialPolicies = () => {
  const { data: policies, isLoading } = useGetAllProductsQuery();
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
        <p className="text-center text-4xl mb-5 underline">
          Commercial Policies
        </p>
        <div>
          {/* <InsuranceCardComponent
            policies={policies?.filter(
              (policy) => policy?.category?.name === "Commercial"
            )}
          /> */}

          <InsuranceCardComponent policies={policies} />
        </div>
      </div>
    </div>
  );
};

export default CommercialPolicies;
