import { useState, useEffect } from "react";
import { Card, Button, Container, Row, Col, Badge } from "react-bootstrap";
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
import { InsuranceCardCarousel } from "../carousel/InsuraceCardCarousel";
import "./Home.css";

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
        <div className="hero-gradient">
          <Container className="hero-container">
            <Row className="align-items-center min-vh-100 py-5">
              <Col lg={6} className="hero-content">
                <Badge
                  bg="light"
                  text="dark"
                  className="mb-3 px-3 py-2 rounded-pill"
                >
                  <Award size={16} className="me-2" />
                  Trusted by 2M+ Families
                </Badge>

                <h1 className="hero-title display-3 fw-bold mb-4">
                  Protection for
                  <span className="text-gradient"> Life's</span>
                  <br />
                  Uncertain Moments
                </h1>

                <p className="hero-subtitle lead mb-4">
                  Simple, transparent insurance that adapts to your life. Get
                  covered in minutes, protected for years.
                </p>

                <div className="d-flex flex-wrap gap-3 mb-5">
                  <Button
                    variant="primary"
                    size="lg"
                    className="px-4 py-3 rounded-pill btn-glow"
                  >
                    Get Free Quote <ArrowRight size={20} className="ms-2" />
                  </Button>
                  <Button
                    variant="outline-light"
                    size="lg"
                    className="px-4 py-3 rounded-pill"
                  >
                    <Headphones size={20} className="me-2" />
                    Talk to Expert
                  </Button>
                </div>

                <div className="d-flex align-items-center">
                  <div className="d-flex me-4">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star key={i} size={20} fill="#FFD700" className="me-1" />
                    ))}
                  </div>
                  <span className="text-light">4.9/5 from 15,000+ reviews</span>
                </div>
              </Col>

              <Col lg={6}>
                <div className="hero-visual">
                  <div className="floating-card card-1">
                    <ShieldCheck size={32} className="text-primary mb-3" />
                    <h6>Health Insurance</h6>
                    <small>From $29/month</small>
                  </div>
                  <div className="floating-card card-2">
                    <ShieldCheck size={32} className="text-success mb-3" />
                    <h6>Auto Insurance</h6>
                    <small>From $49/month</small>
                  </div>
                  <div className="floating-card card-3">
                    <ShieldCheck size={32} className="text-warning mb-3" />
                    <h6>Home Insurance</h6>
                    <small>From $39/month</small>
                  </div>
                </div>
              </Col>
            </Row>
          </Container>
        </div>

        {/* Stats Bar */}
        <div className="stats-bar">
          <Container>
            <Row className="g-4">
              {stats.map((stat, index) => (
                <Col key={index} xs={6} md={3}>
                  <div className="stat-item text-center">
                    <div className="stat-value">{stat.value}</div>
                    <div className="stat-label">{stat.label}</div>
                  </div>
                </Col>
              ))}
            </Row>
          </Container>
        </div>
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
            <Col lg={4} className="text-lg-end">
              <Button variant="outline-primary" className="rounded-pill">
                View All Plans <ChevronRight size={20} />
              </Button>
            </Col>
          </Row>

          {products && (
            <div className="mb-5">
              <InsuranceCardCarousel products={products} />
            </div>
          )}
        </Container>
      </section>

      {/* CTA Cards Section */}
      <section className="cta-section py-5">
        <Container>
          <Row className="g-4">
            <Col lg={6}>
              <Card className="cta-card border-0 rounded-4 overflow-hidden h-100">
                <div className="cta-card-content p-5">
                  <div className="mb-4">
                    <Phone size={40} className="text-primary mb-3" />
                    <h3 className="fw-bold mb-3">Need Help? We're Here</h3>
                    <p className="text-muted mb-4">
                      Our dedicated team is ready to assist you with any
                      questions or concerns about your insurance coverage.
                    </p>
                  </div>
                  <Button
                    variant="primary"
                    size="lg"
                    className="rounded-pill px-4"
                  >
                    Contact Support <ArrowRight size={20} className="ms-2" />
                  </Button>
                </div>
              </Card>
            </Col>

            <Col lg={6}>
              <Card className="cta-card border-0 rounded-4 overflow-hidden h-100 bg-dark text-white">
                <div className="cta-card-content p-5">
                  <div className="mb-4">
                    <FileText size={40} className="text-warning mb-3" />
                    <h3 className="fw-bold mb-3">File a Claim Easily</h3>
                    <p className="text-light mb-4">
                      Report damage or file a claim in minutes. We process cases
                      quickly and keep you informed every step of the way.
                    </p>
                  </div>
                  <Button
                    variant="light"
                    size="lg"
                    className="rounded-pill px-4"
                  >
                    Report Damage <ArrowRight size={20} className="ms-2" />
                  </Button>
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
                <div className="benefits-list">
                  <div className="benefit-item d-flex mb-4">
                    <div className="benefit-icon me-3">
                      <ShieldCheck size={24} className="text-primary" />
                    </div>
                    <div>
                      <h5 className="fw-bold mb-1">Hospital Discounts</h5>
                      <p className="text-muted mb-0">
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
                      <p className="text-muted mb-0">
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
                      <p className="text-muted mb-0">
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
                      <p className="text-muted mb-0">
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
              <Button
                variant="light"
                size="lg"
                className="rounded-pill px-5 py-3"
              >
                Start Your Journey <ArrowRight size={20} className="ms-2" />
              </Button>
            </Col>
          </Row>
        </Container>
      </section>
    </div>
  );
};

export default Home;

// ADD THIS TO ABOVE CODE:

{
  /* <section className="actions-section">
  <div className="container-narrow">
    <div className="cards-grid">
      <article className="modern-card" tabIndex="0">
        <div className="card-icon contact-icon" aria-hidden="true">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
            <path
              d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"
              stroke="currentColor"
              strokeWidth="2"
            />
          </svg>
        </div>
        <h3>Contact Us</h3>
        <p>
          Questions? Our experts are ready to help you 24/7 with personalized
          support.
        </p>
        <span className="card-link-text">Get in touch →</span>
      </article>

      <article className="modern-card" tabIndex="0">
        <div className="card-icon report-icon" aria-hidden="true">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
            <path
              d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"
              stroke="currentColor"
              strokeWidth="2"
            />
            <polyline
              points="14 2 14 8 20 8"
              stroke="currentColor"
              strokeWidth="2"
            />
            <line
              x1="16"
              y1="13"
              x2="8"
              y2="13"
              stroke="currentColor"
              strokeWidth="2"
            />
            <line
              x1="16"
              y1="17"
              x2="8"
              y2="17"
              stroke="currentColor"
              strokeWidth="2"
            />
          </svg>
        </div>
        <h3>Report Damage</h3>
        <p>
          Fast, hassle-free claims processing. We're here when you need us most.
        </p>
        <span className="card-link-text">File a claim →</span>
      </article>
    </div>
  </div>
</section>; */
}
