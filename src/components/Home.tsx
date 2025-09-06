import image from "../assets/143235.jpg";
import callCenter from "../assets/5-Reasons-to-Work-in-a-Call-Center-.png";
import callCenter2 from "../assets/What-is-a-Call-Whisper.jpg";
import "../App.css";
import { Card, CardGroup } from "react-bootstrap";
import { useGetCurrenttUserQuery } from "@/services/UserApiSlice";
import { useGetAllProductsQuery } from "@/services/InsuranceProductSlice";
import { InsuranceCardCarousel } from "./carousel/InsuraceCardCarousel";

const Home = () => {
  const { data: currentUser } = useGetCurrenttUserQuery();
  const { data: products } = useGetAllProductsQuery();

  console.log("Home Policies", products);

  return (
    <div className="d-flex flex-column">
      {/* Hero Section */}
      <div
        className="position-relative w-100 hero-container"
        style={{
          height: "calc(100vh - 64px)",
          minHeight: "500px",
          backgroundImage: `url(${image})`,
          backgroundSize: "contain",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundColor: "lightblue",
        }}
      >
        {/* Centered text */}
        <div
          className="h-100 d-flex align-items-center justify-content-center text-center px-3"
          style={{ maxWidth: "1400px" }}
        >
          <h1
            className="fw-bold text-white"
            style={{
              fontSize: "clamp(1.5rem, 4vw, 3rem)",
              maxWidth: "75%",
              textShadow: "2px 2px 4px rgba(0,0,0,0.8)",
            }}
          >
            Your peace of mind is our priority — simple, reliable insurance for
            every stage of life.
          </h1>
        </div>
      </div>
      {/* Main Content Area */}
      <div className="container mt-5">
        {/* Insurance Categories */}
        <div
          className="p-5 rounded d-flex justify-content-between align-items-center"
          style={{ boxShadow: "2px 2px 4px rgba(0,0,0,0.8)" }}
        >
          {products && <InsuranceCardCarousel products={products} />}
        </div>
        {/* Cards Section */}
        <CardGroup className="gap-4 mt-5">
          <Card
            className="border card-link"
            style={{
              boxShadow: "2px 2px 4px rgba(0,0,0,0.8)",
              cursor: "pointer",
            }}
          >
            <Card.Img variant="top" src={callCenter} />
            <Card.Body className="mt-5">
              <Card.Title>Contact Us</Card.Title>
              <Card.Text>
                We are here if you have questions or need help with your
                insurance.
              </Card.Text>
            </Card.Body>
          </Card>
          <Card
            style={{
              boxShadow: "2px 2px 4px rgba(0,0,0,0.8)",
              cursor: "pointer",
            }}
            className="card-link"
          >
            <Card.Img variant="top" src={callCenter2} />
            <Card.Body className="mt-5">
              <Card.Title>Report Damage</Card.Title>
              <Card.Text>
                We are ready to process your case as quickly as possible.
              </Card.Text>
            </Card.Body>
          </Card>
        </CardGroup>
        {/* Benefits Card */}
        <div className="my-5 d-flex justify-content-center align-items-center">
          <Card
            className="p-4 w-75 card-link"
            style={{ backgroundColor: "blue" }}
          >
            <div className="d-flex">
              <div className="w-50 d-flex align-items-center text-white">
                <Card.Title className="mb-0 h4">Your Benefits</Card.Title>
              </div>
              <div className="w-50">
                <Card.Body className="p-0 text-white">
                  There are many advantages to becoming a customer with us. You
                  get discounts at private hospitals, access to online doctors,
                  and many other perks.
                </Card.Body>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Home;
