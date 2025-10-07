import { Card, CardGroup, Spinner } from "react-bootstrap";
import callCenter2 from "../../assets/What-is-a-Call-Whisper.jpg";
import callCenter3 from "../../assets/all-insurances2.jpg";
import { IoStar } from "react-icons/io5";
import { useGetAllProductsQuery } from "@/services/InsuranceProductSlice";
import InsuranceCardComponent from "../card/InsuranceCardComponent";

const AllInsurances = () => {
  const { data: policies, isLoading } = useGetAllProductsQuery();
  console.log("All Products: " + policies);

  if (isLoading)
    return (
      <div className=" flex justify-center items-center ext-center mt-5 mx-auto">
        <Spinner />
      </div>
    );

  return (
    <div className="container mb-5 ">
      <CardGroup className="gap-4 rounded  " style={{ marginTop: "60px" }}>
        <Card
          className="border-0"
          style={{
            cursor: "pointer",
          }}
        >
          <Card.Img variant="top" src={callCenter2} />
        </Card>
        <Card
          className="border-0 p-0"
          style={{
            cursor: "pointer",
          }}
        >
          <Card.Body className="mt-5">
            <Card.Title className="fw-bold mb-5" style={{ fontSize: "34px" }}>
              All of our insurance policies
            </Card.Title>
            <p>
              4,4 / 5 <span>{<IoStar />}</span> Trustpilot
            </p>
            <Card.Text
              className=""
              style={{
                fontSize: "20px",
              }}
            >
              We insure everything that matters to you. With more than 200 years
              of experience, we know what it takes and are ready to help when
              you need it. We are ready to process your case as quickly as
              possible.
            </Card.Text>
          </Card.Body>
        </Card>
      </CardGroup>

      <div className="" style={{ marginTop: "8rem" }}>
        <div className="d-flex flex-col justify-content-center mb-3">
          <p className="text-center text-3xl font-semibold">
            OUR CUSTOMER FAVAUORITS
          </p>
          <InsuranceCardComponent policies={policies} />
        </div>
      </div>
      <CardGroup className="gap-4 rounded" style={{ marginTop: "60px" }}>
        <Card
          className="border-0"
          style={{
            cursor: "pointer",
          }}
        >
          <Card.Img variant="top" src={callCenter3} />
        </Card>
        <Card
          className="border-0 p-0"
          style={{
            cursor: "pointer",
          }}
        >
          <Card.Body className="mt-5">
            <Card.Title className="fw-bold mb-5" style={{ fontSize: "34px" }}>
              Didn't find what you were looking for?
            </Card.Title>
            <Card.Text
              className=""
              style={{
                fontSize: "20px",
              }}
            >
              Are you looking for something specific, or do you have questions
              about our insurances? We're ready to help you over the phone.
            </Card.Text>
          </Card.Body>
        </Card>
      </CardGroup>
    </div>
  );
};

export default AllInsurances;
