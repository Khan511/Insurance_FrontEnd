import InsuranceCardComponent from "@/components/card/InsuranceCardComponent";
import { useGetAllProductsQuery } from "@/services/InsuranceProductSlice";
import { Spinner } from "react-bootstrap";

export const PrivatePolicies = () => {
  const { data: policies, isLoading } = useGetAllProductsQuery();
  console.log(policies);

  if (isLoading)
    return (
      <div className=" flex justify-center items-center ext-center mt-5 mx-auto">
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
