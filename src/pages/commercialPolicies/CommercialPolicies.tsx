import { useState } from "react";
import InsuranceCardComponent from "@/components/card/InsuranceCardComponent";
import { useGetAllProductsQuery } from "@/services/InsuranceProductSlice";
import {
  Building,
  Shield,
  Search,
  TrendingUp,
  Users,
  Clock,
  Award,
  ChevronDown,
  Sparkles,
  Star,
  CheckCircle,
  BadgeCheck,
  Globe,
  BarChart3,
  Target,
  Building2,
  Truck,
  Warehouse,
  Factory,
  Store,
  Coffee,
  PhoneCall,
  DollarSign,
} from "lucide-react";
import "./CommercialPolicies.css";

// Define filter options for commercial policies
type FilterType = "ALL" | "AUTO" | "PROPERTY";
type SortOption = "recommended" | "coverage" | "price-low" | "price-high";

export const CommercialPolicies = () => {
  const { data: policies, isLoading, error } = useGetAllProductsQuery();
  const [activeFilter, setActiveFilter] = useState<FilterType>("ALL");

  const [sortBy, setSortBy] = useState<SortOption>("recommended");
  const [searchQuery, setSearchQuery] = useState("");

  // Filter and sort commercial policies
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
          policy.description
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          policy.targetAudience?.some((audience) =>
            audience.toLowerCase().includes(searchQuery.toLowerCase())
          )
      )
      .sort((a, b) => {
        switch (sortBy) {
          case "price-low":
            return (
              (a.calculationConfig?.basePremium?.amount || 0) -
              (b.calculationConfig?.basePremium?.amount || 0)
            );
          case "price-high":
            return (
              (b.calculationConfig?.basePremium?.amount || 0) -
              (a.calculationConfig?.basePremium?.amount || 0)
            );
          case "coverage":
            return (
              (b.coverageDetails?.length || 0) -
              (a.coverageDetails?.length || 0)
            );
          default:
            return 0;
        }
      }) || [];

  // Commercial statistics
  const commercialStats = [
    {
      icon: <Building className="w-5 h-5" />,
      value: "5K+",
      label: "Businesses Protected",
    },
    {
      icon: <DollarSign className="w-5 h-5" />,
      value: "$2B+",
      label: "Claims Paid",
    },
    {
      icon: <Clock className="w-5 h-5" />,
      value: "98%",
      label: "Satisfaction Rate",
    },
    {
      icon: <Globe className="w-5 h-5" />,
      value: "24/7",
      label: "Global Support",
    },
  ];

  // Commercial insurance types
  const commercialTypes = [
    {
      type: "ALL",
      label: "All Commercial",
      icon: <Building className="w-5 h-5" />,
      count: policies?.length || 0,
    },
    {
      type: "AUTO",
      label: "Commercial Auto",
      icon: <Truck className="w-5 h-5" />,
      count: policies?.filter((p) => p.productType === "AUTO").length || 0,
    },
    {
      type: "PROPERTY",
      label: "Commercial Property",
      icon: <Warehouse className="w-5 h-5" />,
      count: policies?.filter((p) => p.productType === "PROPERTY").length || 0,
    },
  ];

  // Commercial features
  const commercialFeatures = [
    {
      icon: <Building2 className="w-6 h-6" />,
      title: "Business Asset Protection",
      description:
        "Comprehensive coverage for buildings, equipment, and inventory",
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Employee Coverage",
      description: "Protect your team with workers' compensation and liability",
    },
    {
      icon: <BarChart3 className="w-6 h-6" />,
      title: "Business Interruption",
      description: "Coverage for lost income during unexpected closures",
    },
    {
      icon: <Globe className="w-6 h-6" />,
      title: "Global Coverage",
      description: "Protection that follows your business worldwide",
    },
  ];

  // Industry sectors (for display)
  const industrySectors = [
    "Retail & Hospitality",
    "Manufacturing",
    "Technology",
    "Healthcare",
    "Construction",
    "Professional Services",
    "Transportation",
    "Agriculture",
  ];

  if (isLoading) {
    return (
      <div className="commercial-loading">
        <div className="loading-container">
          <div className="loading-animation">
            <Building className="w-12 h-12 text-blue-600" />
            <div className="loading-dots">
              <div className="loading-dot"></div>
              <div className="loading-dot"></div>
              <div className="loading-dot"></div>
            </div>
          </div>
          <div className="loading-content">
            <h3 className="loading-title">Loading Commercial Policies</h3>
            <p className="loading-description">
              Preparing business insurance solutions for your enterprise...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="commercial-error">
        <div className="error-container">
          <div className="error-icon">
            <Building className="w-16 h-16 text-red-600" />
          </div>
          <h2 className="error-title">Unable to Load Commercial Policies</h2>
          <p className="error-description">
            We're experiencing difficulties loading business insurance options.
            Please try again or contact our commercial team for assistance.
          </p>
          <div className="error-actions">
            <button
              onClick={() => window.location.reload()}
              className="error-btn-primary"
            >
              Retry Loading
            </button>
            <button className="error-btn-secondary">
              <PhoneCall className="w-4 h-4" />
              Contact Commercial Team
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="commercial-policies-page">
      {/* Animated Background */}
      <div className="commercial-background">
        <div className="commercial-shape shape-1"></div>
        <div className="commercial-shape shape-2"></div>
        <div className="commercial-shape shape-3"></div>
      </div>

      {/* Hero Section */}
      <section className="commercial-hero">
        <div className="commercial-hero-overlay"></div>
        <div className="container">
          <div className="commercial-hero-content">
            {/* Badge */}
            <div className="commercial-badge-container">
              <span className="commercial-badge">
                <Sparkles className="w-4 h-4" />
                Business Protection
              </span>
            </div>

            {/* Main Title */}
            <h1 className="commercial-hero-title">
              Commercial
              <span className="commercial-gradient-text"> Insurance</span>
              <br />
              <span className="commercial-hero-subtitle">
                for Your Business
              </span>
            </h1>

            {/* Description */}
            <p className="commercial-hero-description">
              Comprehensive insurance solutions designed specifically for
              businesses. Protect your assets, employees, and operations with
              our tailored commercial coverage plans.
            </p>

            {/* Quick Stats */}
            <div className="commercial-stats">
              {commercialStats.map((stat, index) => (
                <div key={index} className="commercial-stat">
                  <div className="commercial-stat-icon">{stat.icon}</div>
                  <div className="commercial-stat-value">{stat.value}</div>
                  <div className="commercial-stat-label">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="commercial-main">
        <div className="container">
          {/* Industry Coverage */}
          <section className="commercial-industries">
            <h2 className="commercial-section-title">Industries We Serve</h2>
            <div className="industries-grid">
              {industrySectors.map((industry, index) => (
                <div key={index} className="industry-item">
                  <div className="industry-icon">
                    {index % 3 === 0 ? (
                      <Store className="w-5 h-5" />
                    ) : index % 3 === 1 ? (
                      <Factory className="w-5 h-5" />
                    ) : (
                      <Coffee className="w-5 h-5" />
                    )}
                  </div>
                  <span className="industry-name">{industry}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Advanced Filter Section */}
          <section className="commercial-filter-section">
            <div className="commercial-filter-header">
              <h2 className="commercial-section-title">
                Find Your Business Coverage
              </h2>
              <p className="commercial-filter-subtitle">
                Filter and compare commercial insurance policies
              </p>
            </div>

            <div className="commercial-filter-container">
              {/* Search Bar */}
              <div className="commercial-search">
                <Search className="commercial-search-icon" />
                <input
                  type="text"
                  placeholder="Search commercial policies, coverage, or industry..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="commercial-search-input"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="commercial-search-clear"
                  >
                    Clear
                  </button>
                )}
              </div>

              {/* Advanced Filters */}
              <div className="commercial-filter-grid">
                {/* Policy Type Filter */}
                <div className="filter-group">
                  <div className="filter-label">
                    <Shield className="w-4 h-4" />
                    <span>Policy Type</span>
                  </div>
                  <div className="type-filters">
                    {commercialTypes.map((type) => (
                      <button
                        key={type.type}
                        onClick={() => setActiveFilter(type.type as FilterType)}
                        className={`type-filter-btn ${
                          activeFilter === type.type
                            ? "type-filter-btn-active"
                            : ""
                        }`}
                      >
                        {type.icon}
                        <span>{type.label}</span>
                        {type.count > 0 && (
                          <span className="type-count">{type.count}</span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Sort Controls */}
              <div className="commercial-sort-controls">
                <div className="sort-group">
                  <span className="sort-label">Sort by:</span>
                  <div className="sort-select-wrapper">
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as SortOption)}
                      className="commercial-sort-select"
                    >
                      <option value="recommended">Recommended</option>
                      <option value="coverage">Most Coverage</option>
                      <option value="price-low">Price: Low to High</option>
                      <option value="price-high">Price: High to Low</option>
                    </select>
                    <ChevronDown className="sort-arrow" />
                  </div>
                </div>

                {/* Results Summary */}
                <div className="commercial-results-summary">
                  <span className="results-count">
                    <strong>{filteredPolicies.length}</strong> commercial
                    policies found
                  </span>
                  {searchQuery && (
                    <div className="search-tag">
                      Search: "{searchQuery}"
                      <button
                        onClick={() => setSearchQuery("")}
                        className="remove-search"
                      >
                        ×
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>

          {/* Policies Grid */}
          <section className="commercial-policies-grid">
            {filteredPolicies.length > 0 ? (
              <>
                <div className="policies-header">
                  <h2 className="commercial-section-title">
                    Available Commercial Policies
                  </h2>
                  <div className="popular-badge">
                    <Star className="w-4 h-4" />
                    <span>Business Recommended</span>
                  </div>
                </div>

                <div className="policy-count-banner">
                  <div className="banner-content">
                    <Target className="w-5 h-5" />
                    <span>
                      Showing <strong>{filteredPolicies.length}</strong>{" "}
                      tailored business solutions
                    </span>
                  </div>
                </div>

                <InsuranceCardComponent
                  policies={filteredPolicies}
                  columns={3}
                />
              </>
            ) : (
              <div className="commercial-no-results">
                <div className="no-results-icon">
                  <Building className="w-16 h-16 text-gray-400" />
                </div>
                <h3 className="no-results-title">
                  No Commercial Policies Found
                </h3>
                <p className="no-results-description">
                  We couldn't find commercial policies matching your criteria.
                  Try adjusting your filters or contact our commercial team for
                  custom business solutions.
                </p>
                <div className="no-results-actions">
                  <button
                    onClick={() => {
                      setSearchQuery("");
                      setActiveFilter("ALL");
                    }}
                    className="reset-filters-btn"
                  >
                    Reset All Filters
                  </button>
                  <button className="contact-team-btn">
                    <PhoneCall className="w-4 h-4" />
                    Contact Business Team
                  </button>
                </div>
              </div>
            )}
          </section>

          {/* Features Section */}
          <section className="commercial-features">
            <div className="commercial-features-header">
              <h2 className="commercial-section-title">
                Comprehensive Business Protection
              </h2>
              <p className="commercial-section-subtitle">
                Tailored insurance solutions for every aspect of your business
              </p>
            </div>

            <div className="commercial-features-grid">
              {commercialFeatures.map((feature, index) => (
                <div key={index} className="commercial-feature-card">
                  <div className="commercial-feature-icon">{feature.icon}</div>
                  <h3 className="commercial-feature-title">{feature.title}</h3>
                  <p className="commercial-feature-description">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Business CTA Section */}
          <section className="commercial-cta-section">
            <div className="commercial-cta-card">
              <div className="cta-pattern"></div>
              <div className="cta-content">
                <div className="cta-header">
                  <BadgeCheck className="w-10 h-10 text-white" />
                  <h2 className="cta-title">Need Custom Business Coverage?</h2>
                  <p className="cta-subtitle">
                    Our commercial insurance specialists can create a tailored
                    package for your unique business needs.
                  </p>
                </div>

                <div className="cta-features">
                  <div className="cta-feature">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                    <span>Custom Policy Design</span>
                  </div>
                  <div className="cta-feature">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                    <span>Risk Assessment</span>
                  </div>
                  <div className="cta-feature">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                    <span>24/7 Claims Support</span>
                  </div>
                </div>

                <div className="cta-actions">
                  <button className="cta-action-secondary">
                    <PhoneCall className="w-5 h-5" />
                    <span>Schedule Consultation</span>
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* Business Benefits */}
          <section className="commercial-benefits">
            <h2 className="commercial-section-title">
              Why Choose Our Commercial Insurance?
            </h2>
            <div className="benefits-grid">
              <div className="benefit-card">
                <div className="benefit-icon">
                  <TrendingUp className="w-6 h-6" />
                </div>
                <h3 className="benefit-title">Cost Savings</h3>
                <p className="benefit-description">
                  Competitive rates and bulk discounts for multiple policies
                </p>
              </div>
              <div className="benefit-card">
                <div className="benefit-icon">
                  <Clock className="w-6 h-6" />
                </div>
                <h3 className="benefit-title">Fast Claims</h3>
                <p className="benefit-description">
                  24/7 claims processing with dedicated business support
                </p>
              </div>
              <div className="benefit-card">
                <div className="benefit-icon">
                  <Globe className="w-6 h-6" />
                </div>
                <h3 className="benefit-title">Global Coverage</h3>
                <p className="benefit-description">
                  Protection that extends to your international operations
                </p>
              </div>
              <div className="benefit-card">
                <div className="benefit-icon">
                  <Award className="w-6 h-6" />
                </div>
                <h3 className="benefit-title">Industry Expertise</h3>
                <p className="benefit-description">
                  Specialized knowledge across multiple business sectors
                </p>
              </div>
            </div>
          </section>
        </div>
      </main>

      {/* Trust Footer */}
      <footer className="commercial-trust-footer">
        <div className="container">
          <div className="trust-footer-content">
            <div className="trust-title">Trusted by Businesses Worldwide</div>
            <div className="trust-stats">
              <div className="trust-stat">
                <div className="trust-stat-value">5,000+</div>
                <div className="trust-stat-label">Business Clients</div>
              </div>
              <div className="trust-stat">
                <div className="trust-stat-value">25+</div>
                <div className="trust-stat-label">Industries</div>
              </div>
              <div className="trust-stat">
                <div className="trust-stat-value">98%</div>
                <div className="trust-stat-label">Retention Rate</div>
              </div>
              <div className="trust-stat">
                <div className="trust-stat-value">ISO 27001</div>
                <div className="trust-stat-label">Certified</div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default CommercialPolicies;
