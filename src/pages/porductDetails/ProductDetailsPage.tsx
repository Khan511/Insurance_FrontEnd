import { useState, useEffect } from "react";
import { useGetProductDetailsQuery } from "@/services/InsuranceProductSlice";
import { useGetCurrenttUserQuery } from "@/services/UserApiSlice";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  Shield,
  Star,
  CheckCircle,
  Clock,
  MapPin,
  Users,
  DollarSign,
  ChevronRight,
  TrendingUp,
  FileText,
  Lock,
  Zap,
  ArrowRight,
  Home,
  Car,
  Heart,
  Globe,
  Award,
  ShieldCheck,
  Calculator,
  ShoppingCart,
  Phone,
  MessageCircle,
  ChevronDown,
} from "lucide-react";
import "./ProductDetailsPage.css";
import PremiumCalculator from "@/components/premiumcalculation/PremiumCaculator";

const ProductDetailsPage = () => {
  const navigate = useNavigate();
  const { policyId } = useParams();
  const [showCalculator, setShowCalculator] = useState(false);
  const [calculatedPremium, setCalculatedPremium] = useState<number | null>(
    null
  );
  const [activeTab, setActiveTab] = useState("overview");
  const [isSticky, setIsSticky] = useState(false);
  const { data: policyDetails, isLoading } = useGetProductDetailsQuery(
    Number(policyId)
  );
  const { data: currentUser } = useGetCurrenttUserQuery();

  // Handle scroll for sticky navigation
  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 300);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Get icon based on product type
  const getProductIcon = (type?: string) => {
    switch (type) {
      case "AUTO":
        return <Car className="w-6 h-6" />;
      case "LIFE":
        return <Heart className="w-6 h-6" />;
      case "PROPERTY":
        return <Home className="w-6 h-6" />;
      default:
        return <Shield className="w-6 h-6" />;
    }
  };

  // Get color based on product type
  const getProductColor = (type?: string) => {
    switch (type) {
      case "AUTO":
        return "from-blue-600 to-cyan-500";
      case "LIFE":
        return "from-emerald-600 to-teal-500";
      case "PROPERTY":
        return "from-amber-600 to-orange-500";
      default:
        return "from-indigo-600 to-purple-500";
    }
  };

  console.log("Policy Details : ", policyDetails);

  if (isLoading) {
    return (
      <div className="product-details-loading">
        <div className="loading-container">
          <div className="loading-animation">
            <div className="loading-spinner"></div>
            <Shield className="loading-icon" />
          </div>
          <div className="loading-text">
            <h3 className="loading-title">Loading Policy Details</h3>
            <p className="loading-description">
              Fetching comprehensive information about your selected insurance
              policy...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="product-details-page">
      {/* Background Effects */}
      <div className="product-background">
        <div className="bg-shape shape-1"></div>
        <div className="bg-shape shape-2"></div>
      </div>

      {/* Hero Section */}
      <section className="product-hero">
        <div className="container">
          <div className="hero-content">
            {/* Breadcrumb */}
            <div className="breadcrumb">
              <Link to="/all-products" className="breadcrumb-link">
                All Policies
              </Link>
              <ChevronRight className="w-4 h-4 text-gray-400" />
              <span className="breadcrumb-current">
                {policyDetails?.displayName}
              </span>
            </div>

            {/* Product Header */}
            <div className="product-header">
              <div className="product-icon-wrapper">
                <div
                  className={`product-icon ${getProductColor(
                    policyDetails?.productType
                  )}`}
                >
                  {getProductIcon(policyDetails?.productType)}
                </div>
                <div className="product-type-badge">
                  {policyDetails?.productType} Insurance
                </div>
              </div>

              <h1 className="product-title">{policyDetails?.displayName}</h1>

              <div className="product-rating">
                <div className="rating-stars">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="w-5 h-5 fill-current" />
                  ))}
                </div>
                <span className="rating-score">4.8</span>
                <span className="rating-count">(1,247 reviews)</span>
              </div>

              <p className="product-description">
                {policyDetails?.description}
              </p>
            </div>

            {/* Quick Stats */}
            <div className="quick-stats">
              <div className="stat-item">
                <div className="stat-icon">
                  <Clock className="w-5 h-5" />
                </div>
                <div className="stat-content">
                  <div className="stat-label">Processing Time</div>
                  <div className="stat-value">24-48 Hours</div>
                </div>
              </div>
              <div className="stat-item">
                <div className="stat-icon">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div className="stat-content">
                  <div className="stat-label">Coverage Level</div>
                  <div className="stat-value">Comprehensive</div>
                </div>
              </div>
              <div className="stat-item">
                <div className="stat-icon">
                  <Award className="w-5 h-5" />
                </div>
                <div className="stat-content">
                  <div className="stat-label">Customer Rating</div>
                  <div className="stat-value">Excellent</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sticky Navigation */}
      <nav className={`sticky-nav ${isSticky ? "sticky-nav-fixed" : ""}`}>
        <div className="container">
          <div className="sticky-nav-content">
            <div className="nav-title">{policyDetails?.displayName}</div>
            <div className="nav-tabs">
              <button
                className={`nav-tab ${
                  activeTab === "overview" ? "nav-tab-active" : ""
                }`}
                onClick={() => setActiveTab("overview")}
              >
                Overview
              </button>
              <button
                className={`nav-tab ${
                  activeTab === "coverage" ? "nav-tab-active" : ""
                }`}
                onClick={() => setActiveTab("coverage")}
              >
                Coverage Details
              </button>
              <button
                className={`nav-tab ${
                  activeTab === "benefits" ? "nav-tab-active" : ""
                }`}
                onClick={() => setActiveTab("benefits")}
              >
                Benefits
              </button>
              <button
                className={`nav-tab ${
                  activeTab === "calculator" ? "nav-tab-active" : ""
                }`}
                onClick={() => setActiveTab("calculator")}
              >
                Price Calculator
              </button>
            </div>
            <div className="nav-actions">
              {calculatedPremium && (
                <div className="calculated-price">
                  <DollarSign className="w-4 h-4" />
                  <span className="price-value">{calculatedPremium}</span>
                  <span className="price-period">/year</span>
                </div>
              )}
              <Link
                to={`/product-buy-form/${policyId}`}
                className="nav-buy-btn"
              >
                <ShoppingCart className="w-5 h-5" />
                <span>Buy Now</span>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="product-main">
        <div className="container">
          <div className="product-grid">
            {/* Left Column - Main Content */}
            <div className="product-content">
              {/* Overview Tab */}
              {activeTab === "overview" && (
                <div className="content-section">
                  <h2 className="section-title">Policy Overview</h2>

                  {/* Target Audience */}
                  {policyDetails?.targetAudience &&
                    policyDetails.targetAudience.length > 0 && (
                      <div className="info-card">
                        <div className="info-header">
                          <Users className="w-5 h-5" />
                          <h3 className="info-title">Target Audience</h3>
                        </div>
                        <div className="audience-tags">
                          {policyDetails.targetAudience.map(
                            (audience, index) => (
                              <span key={index} className="audience-tag">
                                {audience}
                              </span>
                            )
                          )}
                        </div>
                      </div>
                    )}

                  {/* Regions */}
                  {policyDetails?.regions &&
                    policyDetails.regions.length > 0 && (
                      <div className="info-card">
                        <div className="info-header">
                          <MapPin className="w-5 h-5" />
                          <h3 className="info-title">Available Regions</h3>
                        </div>
                        <div className="regions-grid">
                          {policyDetails.regions.map((region, index) => (
                            <div key={index} className="region-item">
                              <Globe className="w-4 h-4" />
                              <span>{region}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                  {/* Quick Features */}
                  <div className="info-card">
                    <div className="info-header">
                      <Zap className="w-5 h-5" />
                      <h3 className="info-title">Key Features</h3>
                    </div>
                    <div className="features-grid">
                      <div className="feature-item">
                        <CheckCircle className="w-5 h-5 text-green-500" />
                        <span>24/7 Customer Support</span>
                      </div>
                      <div className="feature-item">
                        <CheckCircle className="w-5 h-5 text-green-500" />
                        <span>Flexible Payment Options</span>
                      </div>
                      <div className="feature-item">
                        <CheckCircle className="w-5 h-5 text-green-500" />
                        <span>No Hidden Fees</span>
                      </div>
                      <div className="feature-item">
                        <CheckCircle className="w-5 h-5 text-green-500" />
                        <span>Digital Policy Management</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Coverage Tab */}
              {activeTab === "coverage" && policyDetails?.coverageDetails && (
                <div className="content-section">
                  <h2 className="section-title">Coverage Details</h2>

                  <div className="coverage-grid">
                    {policyDetails.coverageDetails.map((coverage, index) => (
                      <div key={index} className="coverage-card">
                        <div className="coverage-header">
                          <Shield className="w-5 h-5" />
                          <h3 className="coverage-title">
                            {coverage.coverageType}
                          </h3>
                        </div>
                        <p className="coverage-description">
                          {coverage.description}
                        </p>

                        <div className="coverage-details">
                          <div className="detail-item">
                            <span className="detail-label">
                              Coverage Limit:
                            </span>
                            <span className="detail-value">
                              {coverage.coverageLimit.amount.toLocaleString()}{" "}
                              {coverage.coverageLimit.currency}
                            </span>
                          </div>
                          <div className="detail-item">
                            <span className="detail-label">Deductible:</span>
                            <span className="detail-value">
                              {Number(coverage.deductible) || 0}{" "}
                              {coverage.coverageLimit.currency}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Benefits Tab */}
              {activeTab === "benefits" && (
                <div className="content-section">
                  <h2 className="section-title">Policy Benefits</h2>

                  <div className="benefits-grid">
                    <div className="benefit-card">
                      <div className="benefit-icon">
                        <FileText className="w-6 h-6" />
                      </div>
                      <h3 className="benefit-title">Comprehensive Coverage</h3>
                      <p className="benefit-description">
                        Extensive protection that covers a wide range of
                        scenarios and incidents
                      </p>
                    </div>
                    <div className="benefit-card">
                      <div className="benefit-icon">
                        <TrendingUp className="w-6 h-6" />
                      </div>
                      <h3 className="benefit-title">No-Claim Bonus</h3>
                      <p className="benefit-description">
                        Earn discounts on your premium for every claim-free year
                      </p>
                    </div>
                    <div className="benefit-card">
                      <div className="benefit-icon">
                        <Clock className="w-6 h-6" />
                      </div>
                      <h3 className="benefit-title">Fast Claims</h3>
                      <p className="benefit-description">
                        24/7 claims processing with dedicated support and quick
                        resolution
                      </p>
                    </div>
                    <div className="benefit-card">
                      <div className="benefit-icon">
                        <Globe className="w-6 h-6" />
                      </div>
                      <h3 className="benefit-title">Global Coverage</h3>
                      <p className="benefit-description">
                        Protection that extends worldwide, giving you peace of
                        mind wherever you go
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Calculator Tab */}
              {activeTab === "calculator" && (
                <div className="content-section">
                  <div className="calculator-header">
                    <div>
                      <p className="section-title">Premium Calculator</p>
                      <p className="section-subtitle">
                        Get an instant estimate of your insurance premium
                      </p>
                    </div>
                    <button
                      className="toggle-calculator-btn"
                      onClick={() => setShowCalculator(!showCalculator)}
                    >
                      <Calculator className="w-5 h-5" />
                      <span>
                        {showCalculator ? "Hide Calculator" : "Show Calculator"}
                      </span>
                      <ChevronDown
                        className={`w-4 h-4 transition-transform ${
                          showCalculator ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                  </div>

                  {showCalculator && policyDetails && (
                    <div className="calculator-container">
                      <PremiumCalculator
                        insuranceType={policyDetails.productType}
                        productId={policyDetails.id}
                        onPremiumCalculated={setCalculatedPremium}
                      />
                    </div>
                  )}

                  {calculatedPremium && (
                    <div className="premium-result">
                      <div className="result-header">
                        <div className="result-icon">
                          <DollarSign className="w-6 h-6" />
                        </div>
                        <div className="result-content">
                          <div className="result-label">
                            Estimated Annual Premium
                          </div>
                          <div className="result-value">
                            {calculatedPremium} DKK
                            <span className="result-period">/year</span>
                          </div>
                        </div>
                      </div>
                      <div className="result-actions">
                        <Link
                          to={`/product-buy-form/${policyId}`}
                          className="result-btn-primary"
                        >
                          <ShoppingCart className="w-5 h-5" />
                          <span>Proceed to Purchase</span>
                          <ArrowRight className="w-4 h-4" />
                        </Link>
                        <button
                          className="result-btn-secondary"
                          onClick={() => navigate("/contact")}
                        >
                          <Phone className="w-5 h-5" />
                          <span>Talk to Expert</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Right Column - Sidebar */}
            <div className="product-sidebar">
              {/* Price Card */}
              <div className="sidebar-card price-card">
                <div className="price-header">
                  {/* <div className="price-icon">
                    <DollarSign className="w-6 h-6" />
                  </div> */}
                  {/* <div className="price-info">
                    <div className="price-label">Starting from</div>
                    <div className="price-value">
                      {policyDetails?.basePremium?.amount?.toLocaleString() ||
                        "99"}
                      <span className="price-currency">
                        {" "}
                        {policyDetails?.basePremium?.currency || "DKK"}
                      </span>
                    </div>
                    <div className="price-period">per month</div>
                  </div> */}
                </div>

                {!currentUser?.data?.user && (
                  <div className="login-required">
                    <Lock className="w-4 h-4" />
                    <span>Login required to purchase this policy</span>
                  </div>
                )}

                <div className="price-actions">
                  <Link
                    to={`/product-buy-form/${policyId}`}
                    className={`buy-btn ${
                      !currentUser?.data?.user ? "buy-btn-disabled" : ""
                    }`}
                    onClick={(e) =>
                      !currentUser?.data?.user && e.preventDefault()
                    }
                  >
                    <ShoppingCart className="w-5 h-5" />
                    <span>
                      {currentUser?.data?.user
                        ? "Buy Policy Now"
                        : "Login to Purchase"}
                    </span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>

                <div className="price-features">
                  <div className="feature-item">
                    <CheckCircle className="w-4 h-4" />
                    <span>No medical exams required</span>
                  </div>
                  <div className="feature-item">
                    <CheckCircle className="w-4 h-4" />
                    <span>Cancel anytime</span>
                  </div>
                  <div className="feature-item">
                    <CheckCircle className="w-4 h-4" />
                    <span>30-day money back guarantee</span>
                  </div>
                </div>
              </div>

              {/* Support Card */}
              <div className="sidebar-card support-card">
                <div className="support-header">
                  <MessageCircle className="w-6 h-6" />
                  <h3 className="support-title">Need Help?</h3>
                </div>
                <p className="support-description">
                  Our insurance experts are here to answer your questions and
                  help you choose the right coverage.
                </p>
                <div className="support-actions">
                  <button
                    className="support-btn"
                    onClick={() => navigate("/contact")}
                  >
                    <Phone className="w-5 h-5" />
                    <span>Call Expert</span>
                  </button>
                  <button className="support-btn">
                    <MessageCircle className="w-5 h-5" />
                    <span>Live Chat</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* FAQ Section */}
      <section className="faq-section">
        <div className="container">
          <h2 className="section-title">Frequently Asked Questions</h2>
          <div className="faq-grid">
            <div className="faq-item">
              <h3 className="faq-question">
                What is covered under this policy?
              </h3>
              <p className="faq-answer">
                This policy provides comprehensive coverage including{" "}
                {policyDetails?.coverageDetails
                  ?.map((c) => c.coverageType)
                  .join(", ")}{" "}
                and more. Specific details are outlined in the coverage section.
              </p>
            </div>
            <div className="faq-item">
              <h3 className="faq-question">How quickly can I get coverage?</h3>
              <p className="faq-answer">
                Most policies are activated within 24-48 hours of approval.
                Instant coverage options may be available depending on your
                profile.
              </p>
            </div>
            <div className="faq-item">
              <h3 className="faq-question">Can I customize my coverage?</h3>
              <p className="faq-answer">
                Yes, you can customize your coverage limits and deductibles
                during the purchase process to fit your specific needs and
                budget.
              </p>
            </div>
            <div className="faq-item">
              <h3 className="faq-question">What is the claims process?</h3>
              <p className="faq-answer">
                You can file claims online, via our mobile app, or by calling
                our 24/7 claims hotline. Most claims are processed within 5-7
                business days.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Related Policies */}
      <section className="related-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Related Insurance Policies</h2>
            <Link to="/all-products" className="view-all-link">
              <span>View All Policies</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="related-cards">
            {/* These would be populated with actual related policies */}
            <div className="related-card">
              <div className="related-icon">
                {getProductIcon(policyDetails?.productType)}
              </div>
              <h3 className="related-title">
                Enhanced {policyDetails?.productType} Coverage
              </h3>
              <p className="related-description">
                Extended protection with higher limits and additional benefits
              </p>
              <div className="related-price">
                From <span className="price-value">149</span> DKK/month
              </div>
            </div>
            <div className="related-card">
              <div className="related-icon">
                <Shield className="w-6 h-6" />
              </div>
              <h3 className="related-title">Basic Protection Plan</h3>
              <p className="related-description">
                Affordable coverage for essential protection needs
              </p>
              <div className="related-price">
                From <span className="price-value">79</span> DKK/month
              </div>
            </div>
            <div className="related-card">
              <div className="related-icon">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="related-title">Premium Complete Plan</h3>
              <p className="related-description">
                All-inclusive coverage with premium benefits and services
              </p>
              <div className="related-price">
                From <span className="price-value">199</span> DKK/month
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ProductDetailsPage;
