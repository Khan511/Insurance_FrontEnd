// import "./PrivatePolicies.css";
import { useState } from "react";
import InsuranceCardComponent from "@/components/card/InsuranceCardComponent";
import { useGetAllProductsQuery } from "@/services/InsuranceProductSlice";
import {
  Shield,
  Filter,
  Search,
  TrendingUp,
  Users,
  Clock,
  Award,
  ChevronDown,
  Heart,
  Home,
  Car,
  Sparkles,
  Star,
  CheckCircle,
  BadgeCheck,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

// Define filter options
type FilterType = "ALL" | "AUTO" | "LIFE" | "PROPERTY";
type SortOption = "recommended" | "price-low" | "price-high" | "popular";

export const PrivatePolicies = () => {
  const navigate = useNavigate();
  const { data: policies, isLoading, error } = useGetAllProductsQuery();
  const [activeFilter, setActiveFilter] = useState<FilterType>("ALL");
  const [sortBy, setSortBy] = useState<SortOption>("recommended");
  const [searchQuery, setSearchQuery] = useState("");
  const [isFiltersVisible, setIsFiltersVisible] = useState(false);

  // Filter and sort policies
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
          case "popular":
            return b.id - a.id;
          default:
            return 0;
        }
      }) || [];

  // Statistics
  const stats = [
    {
      icon: <Shield className="w-5 h-5" />,
      value: filteredPolicies.length,
      label: "Available Plans",
    },
    {
      icon: <Users className="w-5 h-5" />,
      value: "10K+",
      label: "Happy Customers",
    },
    {
      icon: <Clock className="w-5 h-5" />,
      value: "24h",
      label: "Claim Response",
    },
    { icon: <Award className="w-5 h-5" />, value: "4.8/5", label: "Rating" },
  ];

  // Insurance types for filter
  const insuranceTypes = [
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

  // Why choose us features
  const features = [
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Comprehensive Coverage",
      description:
        "Extensive protection for all your needs with transparent terms",
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      title: "Best Value",
      description: "Competitive pricing with no hidden fees or charges",
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: "Instant Processing",
      description: "Quick approval and 24/7 claim support",
    },
    {
      icon: <Award className="w-6 h-6" />,
      title: "Award Winning",
      description: "Recognized for excellence in customer service",
    },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
            <Shield className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-6 h-6 text-blue-600" />
          </div>
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-700">
              Loading Policies
            </h3>
            <p className="text-gray-500 text-sm mt-1">
              Fetching the best insurance options for you...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="w-10 h-10 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Unable to Load Policies
          </h2>
          <p className="text-gray-600 mb-6">
            We're having trouble loading the insurance policies. Please check
            your connection and try again.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-linear-to-r from-blue-600 to-cyan-500 text-white font-medium rounded-xl hover:shadow-lg transition-all"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="private-policies-page">
      {/* Animated background */}
      <div className="background-animation">
        <div className="floating-shape shape-1"></div>
        <div className="floating-shape shape-2"></div>
        <div className="floating-shape shape-3"></div>
      </div>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-overlay"></div>
        <div className="container">
          <div className="hero-content">
            <div className="badge-container">
              <span className="flex border-amber-50 border rounded-full px-2 py-1 justify-center items-center gap-2 bg-blue-800">
                <Sparkles className="w-4 h-4" />
                <span>Premium Protection</span>
              </span>
            </div>
            <h1 className="hero-title">
              Private Insurance
              <span className="gradient-text"> Policies</span>
            </h1>
            <p className="hero-subtitle">
              Comprehensive protection plans tailored for individuals and
              families. Find the perfect coverage for your unique needs with
              transparent pricing and exceptional service.
            </p>

            {/* Stats */}
            <div className="stats-grid">
              {stats.map((stat, index) => (
                <div key={index} className="stat-card">
                  <div className="stat-icon">{stat.icon}</div>
                  <div className="stat-value">{stat.value}</div>
                  <div className="stat-label">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="main-content">
        <div className="container">
          {/* Features Section */}
          <section className="features-section">
            <h2 className="section-title">Why Choose Our Private Policies?</h2>
            <div className="features-grid">
              {features.map((feature, index) => (
                <div key={index} className="feature-card">
                  <div className="feature-icon-wrapper">{feature.icon}</div>
                  <h3 className="feature-title">{feature.title}</h3>
                  <p className="feature-description">{feature.description}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Search and Filter Section */}
          <section className="filter-section">
            <div className="filter-container">
              {/* Search Bar */}
              <div className="search-container">
                <Search className="search-icon" />
                <input
                  type="text"
                  placeholder="Search policies..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="search-input"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="clear-search"
                  >
                    Clear
                  </button>
                )}
              </div>

              {/* Filter Controls */}
              <div className="filter-controls">
                {/* Type Filter */}
                <div className="type-filter">
                  {insuranceTypes.map((type) => (
                    <button
                      key={type.type}
                      onClick={() => setActiveFilter(type.type as FilterType)}
                      className={`type-filter-btn ${
                        activeFilter === type.type
                          ? "type-filter-btn-active"
                          : ""
                      }`}
                    >
                      <span className="type-filter-icon">{type.icon}</span>
                      <span>{type.label}</span>
                      <span className="type-count">{type.count}</span>
                    </button>
                  ))}
                </div>

                {/* Sort Dropdown */}
                <div className="sort-container">
                  <span className="sort-label">Sort by:</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as SortOption)}
                    className="sort-select"
                  >
                    <option value="recommended">Recommended</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="popular">Most Popular</option>
                  </select>
                  <ChevronDown className="sort-arrow" />
                </div>

                {/* Mobile Filter Toggle */}
                <button
                  onClick={() => setIsFiltersVisible(!isFiltersVisible)}
                  className="mobile-filter-toggle"
                >
                  <Filter className="w-5 h-5" />
                  <span>Filters</span>
                </button>
              </div>

              {/* Results Summary */}
              <div className="results-summary">
                <span className="results-count">
                  Showing <strong>{filteredPolicies.length}</strong> of{" "}
                  <strong>{policies?.length}</strong> policies
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
          </section>

          {/* Policies Grid */}
          <section className="policies-section">
            {filteredPolicies.length > 0 ? (
              <>
                <div className="policies-header">
                  <h2 className="section-title">Available Insurance Plans</h2>
                  <div className="popular-badge">
                    <Star className="w-4 h-4" />
                    <span>Most Popular</span>
                  </div>
                </div>
                <InsuranceCardComponent
                  policies={filteredPolicies}
                  columns={3}
                />
              </>
            ) : (
              <div className="no-results">
                <div className="no-results-icon">
                  <Search className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="no-results-title">No Policies Found</h3>
                <p className="no-results-description">
                  We couldn't find any policies matching your search criteria.
                  Try adjusting your filters or search term.
                </p>
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setActiveFilter("ALL");
                  }}
                  className="reset-filters-btn"
                >
                  Reset All Filters
                </button>
              </div>
            )}
          </section>

          {/* CTA Section */}
          <section className="cta-section">
            <div className="cta-card">
              <div className="cta-content">
                <div className="cta-icon-wrapper">
                  <BadgeCheck className="w-8 h-8" />
                </div>
                <h2 className="cta-title">Need Help Choosing?</h2>
                <p className="cta-description">
                  Our insurance experts are here to help you find the perfect
                  coverage. Get personalized recommendations and instant quotes.
                </p>
                <div className="cta-buttons">
                  <button
                    onClick={() => navigate("/all-products")}
                    className="cta-btn-primary"
                  >
                    <span>Talk to Expert</span>
                    <ChevronDown className="w-4 h-4 rotate-90" />
                  </button>
                  <button className="cta-btn-secondary">Compare Plans</button>
                </div>
              </div>
              <div className="cta-pattern"></div>
            </div>
          </section>

          {/* FAQ Preview */}
          <section className="faq-preview">
            <h2 className="section-title">Common Questions</h2>
            <div className="faq-grid">
              {[
                {
                  question:
                    "What's the difference between private and commercial insurance?",
                  answer:
                    "Private insurance covers individuals and families, while commercial insurance is for businesses.",
                },
                {
                  question: "Can I customize my insurance coverage?",
                  answer:
                    "Yes, most policies offer customizable options to fit your specific needs.",
                },
                {
                  question: "How quickly can I get coverage?",
                  answer:
                    "Most policies can be activated within 24 hours of approval.",
                },
              ].map((faq, index) => (
                <div key={index} className="faq-item">
                  <h3 className="faq-question">{faq.question}</h3>
                  <p className="faq-answer">{faq.answer}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>

      {/* Trust Badges */}
      <section className="trust-section">
        <div className="container">
          <div className="trust-content">
            <div className="trust-title">Trusted By</div>
            <div className="trust-logos">
              {[
                "10K+ Families",
                "500+ Companies",
                "Award 2025",
                "4.8★ Rating",
              ].map((text, index) => (
                <div key={index} className="trust-logo">
                  <div className="trust-logo-icon">
                    <CheckCircle className="w-5 h-5" />
                  </div>
                  <span>{text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
