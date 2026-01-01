import "./Home.css";
import { useState, useEffect } from "react";
import { Card, Container, Row, Col, Badge } from "react-bootstrap";
import {
  ArrowRight,
  ShieldCheck,
  Phone,
  FileText,
  Clock,
  Users,
  TrendingUp,
  ChevronRight,
  Star,
  Award,
  Headphones,
} from "lucide-react";
import { useGetAllProductsQuery } from "@/services/InsuranceProductSlice";
import { InsuranceCardCarousel } from "../../components/carousel/InsuraceCardCarousel";
import { Link } from "react-router-dom";
import { HomeHeroSection } from "./HomeHeroSection";

const Home = () => {
  const { data: products } = useGetAllProductsQuery();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const features = [
    {
      icon: <Clock size={24} />,
      title: "24/7 Support",
      desc: "Always here when you need us",
    },
    {
      icon: <ShieldCheck size={24} />,
      title: "Secure & Reliable",
      desc: "Bank-level security",
    },
    {
      icon: <TrendingUp size={24} />,
      title: "Best Rates",
      desc: "Competitive pricing",
    },
    {
      icon: <Users size={24} />,
      title: "10M+ Customers",
      desc: "Trusted worldwide",
    },
  ];

  console.log("Home page products: ", products);

  const stats = [
    { value: "98%", label: "Customer Satisfaction" },
    { value: "24h", label: "Average Claim Processing" },
    { value: "50+", label: "Insurance Products" },
    { value: "15", label: "Years of Experience" },
  ];

  return (
    <div className="home-page">
      {/* Modern Hero Section with Gradient */}
      <section className={`hero-section ${isVisible ? "fade-in" : ""}`}>
        <HomeHeroSection />
      </section>

      {/* Products Carousel Section */}
      <section className="products-section py-5 bg-light">
        <Container>
          <Row className="align-items-center mb-5">
            <Col lg={8}>
              <h2 className="display-5 fw-bold mb-2">
                Tailored Protection Plans
              </h2>
              <p className="lead text-muted">
                Find the perfect coverage for your unique needs
              </p>
            </Col>
            <Col lg={4} className="text-lg-end flex justify-end ">
              <Link
                to="all-products"
                className="rounded-pill border p-3 bg-accent btn-glow flex justify-center items-center w-fit"
              >
                <span>View All Plans</span> <ChevronRight size={20} />
              </Link>
            </Col>
          </Row>

          {products && (
            <div className="mb-5">
              <InsuranceCardCarousel products={products} />
            </div>
          )}
        </Container>
      </section>

      {/* Features Section */}
      <section className="features-section py-5">
        <Container>
          <Row className="text-center mb-5">
            <Col>
              <h2 className="display-5 fw-bold mb-3">Why Choose Us</h2>
              <p className="text-muted lead">
                Experience insurance made simple, modern, and human
              </p>
            </Col>
          </Row>

          <Row className="g-4">
            {features.map((feature, index) => (
              <Col key={index} md={6} lg={3}>
                <div className="feature-card p-4 rounded-4 h-100">
                  <div className="feature-icon mb-3">{feature.icon}</div>
                  <h5 className="fw-bold mb-2">{feature.title}</h5>
                  <p className="text-muted mb-0">{feature.desc}</p>
                </div>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* CTA Cards Section */}
      <section className="cta-section py-5">
        <Container>
          <Row className="g-4">
            <Col lg={6}>
              <Card className="cta-card border-0 rounded-4 overflow-hidden h-100">
                <div className="cta-card-content px-5 py-3 flex flex-col justify-end h-full gap-4">
                  <div className="mb-4">
                    <Phone size={40} className="text-primary mb-3" />
                    <h3 className="fw-bold mb-3">Need Help? We're Here</h3>
                    <p className="text-white mb-4">
                      Our dedicated team is ready to assist you with any
                      questions or concerns about your insurance coverage.
                    </p>
                  </div>
                  <Link
                    to="all-products"
                    className="rounded-pill p-3 flex justify-center items-center w-fit bg-blue-500 text-white btn-glow"
                  >
                    <span>Contact Support</span>{" "}
                    <ArrowRight size={20} className="ms-2" />
                  </Link>
                </div>
              </Card>
            </Col>

            <Col lg={6}>
              <Card className="cta-card border-0 rounded-4 overflow-hidden bg-dark text-white h-100">
                <div className="cta-card-content px-5 py-3 flex flex-col justify-end  h-full gap-4">
                  <div className="mb-4">
                    <FileText size={40} className="text-warning mb-3" />
                    <h3 className="fw-bold text-gray-500 mb-3">
                      File a Claim Easily
                    </h3>
                    <p className="text-white mb-4">
                      Report damage or file a claim in minutes. We process cases
                      quickly and keep you informed every step of the way.
                    </p>
                  </div>
                  <Link
                    to="file-claim"
                    className="rounded-pill px-4 flex border justify-center items-center w-fit p-3 btn-glow text-white"
                  >
                    <span className=""> Report Damage </span>
                    <ArrowRight size={20} className="ms-2" />
                  </Link>
                </div>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Benefits Section */}
      <section className="benefits-section py-5">
        <Container>
          <Card className="border-0 rounded-5 overflow-hidden benefits-card">
            <Row className="g-0">
              <Col lg={6} className="benefits-visual">
                <div className="benefits-overlay p-5 h-100 d-flex flex-column justify-content-center">
                  <Badge
                    bg="light"
                    text="dark"
                    className="mb-3 px-3 py-2 rounded-pill align-self-start"
                  >
                    Exclusive Benefits
                  </Badge>
                  <h2 className="display-5 fw-bold text-white mb-4">
                    Unlock Premium Perks
                  </h2>
                  <p className="lead text-light mb-0">
                    Enjoy exclusive advantages that go beyond standard coverage
                  </p>
                </div>
              </Col>

              <Col lg={6} className="p-5">
                <div className="benefits-list text-white">
                  <div className="benefit-item d-flex mb-4">
                    <div className="benefit-icon me-3">
                      <ShieldCheck size={24} className="text-primary" />
                    </div>
                    <div>
                      <h5 className="fw-bold mb-1">Hospital Discounts</h5>
                      <p className=" mb-0">
                        Save up to 30% at partner private hospitals
                      </p>
                    </div>
                  </div>

                  <div className="benefit-item d-flex mb-4">
                    <div className="benefit-icon me-3">
                      <Phone size={24} className="text-success" />
                    </div>
                    <div>
                      <h5 className="fw-bold mb-1">Virtual Doctor Access</h5>
                      <p className=" mb-0">
                        24/7 online consultations with certified physicians
                      </p>
                    </div>
                  </div>

                  <div className="benefit-item d-flex mb-4">
                    <div className="benefit-icon me-3">
                      <Users size={24} className="text-warning" />
                    </div>
                    <div>
                      <h5 className="fw-bold mb-1">Family Coverage</h5>
                      <p className=" mb-0">
                        Protect your entire family under one plan
                      </p>
                    </div>
                  </div>
                  <div className="benefit-item d-flex">
                    <div className="benefit-icon me-3">
                      <TrendingUp size={24} className="text-info" />
                    </div>
                    <div>
                      <h5 className="fw-bold mb-1">No-Claim Bonus</h5>
                      <p className=" mb-0">
                        Earn discounts for every claim-free year
                      </p>
                    </div>
                  </div>
                </div>
              </Col>
            </Row>
          </Card>
        </Container>
      </section>

      {/* Footer CTA */}
      <section className="footer-cta py-5 bg-dark">
        <Container>
          <Row className="text-center">
            <Col>
              <h2 className="display-6 fw-bold text-white mb-3">
                Ready to Get Protected?
              </h2>
              <p className="text-light mb-4">
                Join thousands of satisfied customers who trust us with their
                protection needs
              </p>
              <div className="w-full flex justify-center">
                <Link
                  to="all-products"
                  className="rounded-pill px-5 py-3 broder flex justify-center items-center w-fit border bg-white btn-glow"
                >
                  <span> Start Your Journey </span>
                  <ArrowRight size={20} className="ms-2" />
                </Link>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    </div>
  );
};

export default Home;
