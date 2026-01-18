import { useState, useEffect } from "react";
import {
  Shield,
  Star,
  TrendingUp,
  Users,
  Clock,
  Award,
  ChevronRight,
  Search,
  Sparkles,
  BadgeCheck,
  Heart,
  Home,
  Car,
  Globe,
  Phone,
  MessageCircle,
  Zap,
  ShieldCheck,
} from "lucide-react";
import { useGetAllProductsQuery } from "@/services/InsuranceProductSlice";
import InsuranceCardComponent from "@/components/card/InsuranceCardComponent";
// import "./AllInsurances.css";

const AllInsurances = () => {
  const { data: policies, isLoading } = useGetAllProductsQuery();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("ALL");
  const [isStatsVisible, setIsStatsVisible] = useState(false);

  useEffect(() => {
    setIsStatsVisible(true);
  }, []);

  // Insurance categories
  const categories = [
    {
      type: "ALL",
      label: "All Policies",
      icon: <Shield className="w-5 h-5" />,
      count: policies?.length || 0,
    },
    {
      type: "AUTO",
      label: "Auto Insurance",
      icon: <Car className="w-5 h-5" />,
      count: policies?.filter((p) => p.productType === "AUTO").length || 0,
    },
    {
      type: "LIFE",
      label: "Life Insurance",
      icon: <Heart className="w-5 h-5" />,
      count: policies?.filter((p) => p.productType === "LIFE").length || 0,
    },
    {
      type: "PROPERTY",
      label: "Property Insurance",
      icon: <Home className="w-5 h-5" />,
      count: policies?.filter((p) => p.productType === "PROPERTY").length || 0,
    },
  ];

  // Filtered policies
  const filteredPolicies =
    policies
      ?.filter((policy) => {
        if (activeFilter === "ALL") return true;
        return policy.productType === activeFilter;
      })
      .filter(
        (policy) =>
          policy.displayName
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          policy.description.toLowerCase().includes(searchQuery.toLowerCase())
      ) || [];

  // Stats data
  const stats = [
    {
      icon: <Shield className="w-6 h-6" />,
      value: "200+",
      label: "Years Experience",
      sublabel: "Since 1820",
    },
    {
      icon: <Users className="w-6 h-6" />,
      value: "2M+",
      label: "Customers",
      sublabel: "Trusted worldwide",
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      value: "4.4/5",
      label: "Trustpilot",
      sublabel: "Excellent rating",
    },
    {
      icon: <Award className="w-6 h-6" />,
      value: "50+",
      label: "Insurance Types",
      sublabel: "Comprehensive coverage",
    },
  ];

  // Benefits
  const benefits = [
    {
      icon: <ShieldCheck className="w-6 h-6" />,
      title: "Comprehensive Protection",
      description:
        "Coverage for everything that matters to you and your family",
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: "Fast Claims Processing",
      description:
        "Quick resolution with dedicated support when you need it most",
    },
    {
      icon: <Globe className="w-6 h-6" />,
      title: "Global Coverage",
      description: "Protection that follows you wherever life takes you",
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Instant Quotes",
      description: "Get personalized quotes in minutes, not days",
    },
  ];

  if (isLoading) {
    return (
      <div className="all-insurances-loading">
        <div className="loading-content">
          <div className="loading-animation">
            <div className="loading-spinner"></div>
            <Shield className="loading-icon" />
          </div>
          <h3 className="loading-title">Loading All Insurance Policies</h3>
          <p className="loading-description">
            Gathering comprehensive coverage options for you...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="all-insurances-page">
      {/* Background Effects */}
      <div className="page-background">
        <div className="bg-shape shape-1"></div>
        <div className="bg-shape shape-2"></div>
        <div className="bg-shape shape-3"></div>
      </div>

      {/* Hero Section */}
      <section className="all-insurances-hero">
        <div className="container">
          <div className="hero-content">
            {/* Badge */}
            <div className="hero-badge">
              <Sparkles className="w-4 h-4" />
              <span>Comprehensive Protection</span>
            </div>

            {/* Title */}
            <h1 className="hero-title">
              All Our
              <span className="gradient-text"> Insurance</span> Policies
            </h1>

            {/* Rating */}
            <div className="hero-rating">
              <div className="rating-stars">
                {[1, 2, 3, 4].map((i) => (
                  <Star key={i} className="w-5 h-5 fill-current" />
                ))}
                <Star className="w-5 h-5 fill-current half-star" />
              </div>
              <div className="rating-info">
                <span className="rating-score">4.4 / 5</span>
                <span className="rating-source">Trustpilot</span>
              </div>
            </div>

            {/* Description */}
            <p className="hero-description">
              We insure everything that matters to you. With more than 200 years
              of experience, we know what it takes and are ready to help when
              you need it. We are ready to process your case as quickly as
              possible.
            </p>
          </div>
        </div>
        <div className="container">
          <div
            className={`stats-grid  ${isStatsVisible ? "stats-visible" : ""}`}
          >
            {stats.map((stat, index) => (
              <div key={index} className="stat-card">
                <div className="stat-icon-wrapper">{stat.icon}</div>
                <div className="stat-content">
                  <div className="stat-value">{stat.value}</div>
                  <div className="stat-label">{stat.label}</div>
                  <div className="stat-sublabel">{stat.sublabel}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Filter Section */}
      <section className="filter-section">
        <div className="container">
          <div className="filter-header">
            <div>
              <h2 className="section-title">Browse All Insurance Policies</h2>
              <p className="section-subtitle">
                Explore our comprehensive range of insurance solutions
              </p>
            </div>
            <div className="results-count">
              Showing <strong>{filteredPolicies.length}</strong> of{" "}
              <strong>{policies?.length}</strong> policies
            </div>
          </div>

          {/* Category Filters */}
          <div className="category-filters">
            {categories.map((category) => (
              <button
                key={category.type}
                onClick={() => setActiveFilter(category.type)}
                className={`category-filter-btn ${
                  activeFilter === category.type
                    ? "category-filter-btn-active"
                    : ""
                }`}
              >
                <span className="category-icon">{category.icon}</span>
                <span className="category-label">{category.label}</span>
                {category.count > 0 && (
                  <span className="category-count">{category.count}</span>
                )}
              </button>
            ))}
          </div>
          {/* Search Bar */}
          <div className="hero-search">
            <Search className="search-icon" />
            <input
              type="text"
              placeholder="Search insurance policies..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
          </div>
          {searchQuery && (
            <div className="search-results-info">
              <span>Search results for: "{searchQuery}"</span>
              <button
                onClick={() => setSearchQuery("")}
                className="clear-search-btn"
              >
                Clear search
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Policies Grid */}
      <section className="policies-section">
        <div className="container">
          {filteredPolicies.length > 0 ? (
            <>
              <div className="policies-header">
                <h3 className="policies-title">
                  {activeFilter === "ALL"
                    ? "All Insurance Policies"
                    : `${activeFilter} Insurance Policies`}
                </h3>
                <div className="popular-tag">
                  <TrendingUp className="w-4 h-4" />
                  <span>Customer Favorites</span>
                </div>
              </div>

              <InsuranceCardComponent policies={filteredPolicies} columns={3} />
            </>
          ) : (
            <div className="no-results">
              <div className="no-results-icon">
                <Search className="w-12 h-12" />
              </div>
              <h3 className="no-results-title">No Policies Found</h3>
              <p className="no-results-description">
                We couldn't find any policies matching your search. Try
                adjusting your search terms or browse all categories.
              </p>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setActiveFilter("ALL");
                }}
                className="browse-all-btn"
              >
                Browse All Policies
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Benefits Section */}
      <section className="benefits-section">
        <div className="container ">
          <div className="section-header">
            <h2 className="section-title">Why Choose Our Insurance?</h2>
            <p className="section-subtitle">
              Experience, reliability, and comprehensive coverage for all your
              needs
            </p>
          </div>

          <div className="benefits-grid">
            {benefits.map((benefit, index) => (
              <div key={index} className="benefit-card">
                <div className="benefit-icon-wrapper">{benefit.icon}</div>
                <h3 className="benefit-title">{benefit.title}</h3>
                <p className="benefit-description">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* Trust Section */}
      <section className="trust-section">
        <div className="container">
          <div className="trust-content">
            <div className="trust-header">
              <BadgeCheck className="w-6 h-6" />
              <h3 className="trust-title">Trusted & Reliable</h3>
            </div>
            <div className="trust-grid">
              <div className="trust-item">
                <div className="trust-icon">
                  <Shield className="w-5 h-5" />
                </div>
                <div className="trust-info">
                  <div className="trust-value">ISO 27001</div>
                  <div className="trust-label">Certified Security</div>
                </div>
              </div>
              <div className="trust-item">
                <div className="trust-icon">
                  <Award className="w-5 h-5" />
                </div>
                <div className="trust-info">
                  <div className="trust-value">Best Insurance</div>
                  <div className="trust-label">2025 Award Winner</div>
                </div>
              </div>
              <div className="trust-item">
                <div className="trust-icon">
                  <Globe className="w-5 h-5" />
                </div>
                <div className="trust-info">
                  <div className="trust-value">24 Countries</div>
                  <div className="trust-label">Global Presence</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-card">
            <div className="cta-content">
              <div className="cta-icon-wrapper">
                <MessageCircle className="w-8 h-8" />
              </div>
              <h2 className="cta-title">
                Didn't find what you were looking for?
              </h2>
              <p className="cta-description">
                Are you looking for something specific, or do you have questions
                about our insurances? We're ready to help you over the phone,
                chat, or email with personalized advice.
              </p>
              <div className="cta-buttons">
                <button className="cta-btn-primary">
                  <Phone className="w-5 h-5" />
                  <span>Call Our Experts</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
                <button className="cta-btn-secondary">
                  <MessageCircle className="w-5 h-5" />
                  <span>Live Chat Support</span>
                </button>
              </div>
            </div>
            <div className="cta-pattern"></div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AllInsurances;
