import { useState } from "react";
import { Link } from "react-router-dom";
import {
  CarFront,
  Home,
  Shield,
  ChevronRight,
  CheckCircle,
  Users,
  Clock,
  Sparkles,
  DollarSign,
  ArrowUpRight,
  BadgeCheck,
} from "lucide-react";
import "./InsuranceCardComponent.css";

export type MonetaryAmount = {
  amount: number;
  currency: string;
};

export type CoverageDetails = {
  coverageType: string;
  description: string;
  coverageLimit: MonetaryAmount;
  deductible: MonetaryAmount;
};

export type Category = {
  id: number;
  name: string;
  description: string;
};

export type PolicyPeriod = {
  effectiveDate: string;
  expirationDate: string;
};

export type ProductTranslation = {
  displayName: string;
  description: string;
};

export type ProductType = "AUTO" | "LIFE" | "PROPERTY";

export type InsuraceProduct = {
  id: number;
  productCode: string;
  displayName: string;
  description: string;
  productType: ProductType;
  basePremium?: MonetaryAmount;
  coverageDetails: CoverageDetails[];
  eligibilityRules: { [key: string]: string };
  targetAudience: string[];
  regions: string[];
  category: Category;
  validityPeriod: PolicyPeriod;
  allowedClaimTypes: string[];
  translation: { [locale: string]: ProductTranslation };
};

interface Props {
  policies?: InsuraceProduct[];
  columns?: 2 | 3 | 4; // Responsive column control
}

// Helper function to get icon and color based on product type
const getProductTypeDetails = (type: ProductType) => {
  const details = {
    AUTO: {
      icon: <CarFront className="w-6 h-6" />,
      gradient: "from-blue-600 via-cyan-500 to-blue-500",
      bgColor: "bg-gradient-to-br from-blue-600/10 to-cyan-500/10",
      borderColor: "border-blue-200/50",
      textColor: "text-blue-700",
      badgeColor: "bg-blue-100 text-blue-800",
      accentColor: "bg-blue-500",
    },
    LIFE: {
      icon: <Shield className="w-6 h-6" />,
      gradient: "from-emerald-600 via-teal-500 to-emerald-500",
      bgColor: "bg-gradient-to-br from-emerald-600/10 to-teal-500/10",
      borderColor: "border-emerald-200/50",
      textColor: "text-emerald-700",
      badgeColor: "bg-emerald-100 text-emerald-800",
      accentColor: "bg-emerald-500",
    },
    PROPERTY: {
      icon: <Home className="w-6 h-6" />,
      gradient: "from-amber-600 via-orange-500 to-amber-500",
      bgColor: "bg-gradient-to-br from-amber-600/10 to-orange-500/10",
      borderColor: "border-amber-200/50",
      textColor: "text-amber-700",
      badgeColor: "bg-amber-100 text-amber-800",
      accentColor: "bg-amber-500",
    },
  };
  return details[type];
};

// Format currency
const formatCurrency = (amount: number, currency: string) => {
  return new Intl.NumberFormat("da-DK", {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

const InsuranceCardComponent = ({ policies = [], columns = 3 }: Props) => {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  const gridColumns = {
    2: "grid-cols-1 sm:grid-cols-2",
    3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
  };

  return (
    <div className="insurance-cards-container">
      {/* Animated background effect */}
      <div className="background-effects">
        <div className="effect-blob blob-1"></div>
        <div className="effect-blob blob-2"></div>
        <div className="effect-blob blob-3"></div>
      </div>

      <div className={`cards-grid ${gridColumns[columns]}`}>
        {policies.map((policy) => {
          const typeDetails = getProductTypeDetails(policy.productType);
          const isHovered = hoveredCard === policy.id;

          return (
            <Link
              key={policy.id}
              to={`/products/${policy.id}`}
              className="card-link-wrapper"
              onMouseEnter={() => setHoveredCard(policy.id)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              {/* Outer glow effect */}
              <div
                className={`card-glow ${
                  isHovered ? "card-glow-active" : ""
                } ${typeDetails.gradient.replace(
                  "from-",
                  "glow-gradient-from-"
                )}`}
              ></div>

              {/* Main card */}
              <div className="modern-card">
                {/* Card header with gradient */}
                <div
                  className={`card-header ${typeDetails.gradient.replace(
                    "from-",
                    "bg-gradient-to-br from-"
                  )}`}
                >
                  {/* Header pattern */}
                  <div className="header-pattern"></div>

                  <div className="card-header-content">
                    {/* Icon and product type */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="card-icon-wrapper">
                          {typeDetails.icon}
                        </div>
                        <div>
                          <div className="card-category-badge">
                            {policy.productType}
                          </div>
                          {policy.basePremium && (
                            <div className="card-premium">
                              <DollarSign className="w-4 h-4" />
                              <span className="font-bold">
                                {formatCurrency(
                                  policy.basePremium.amount,
                                  policy.basePremium.currency
                                )}
                              </span>
                              <span className="opacity-90">/month</span>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <Sparkles className="w-5 h-5 text-white/80" />
                        <span className="text-sm text-white/80">Popular</span>
                      </div>
                    </div>

                    {/* Policy title */}
                    <h3 className="card-title">{policy.displayName}</h3>
                  </div>

                  {/* Floating arrow on hover */}
                  <div
                    className={`floating-arrow ${
                      isHovered ? "floating-arrow-visible" : ""
                    }`}
                  >
                    <ArrowUpRight className="w-5 h-5" />
                  </div>
                </div>

                {/* Card body */}
                <div className="card-body">
                  {/* Description */}
                  <p className="card-description">{policy.description}</p>

                  {/* Quick features */}
                  <div className="card-features">
                    <div className="flex items-center gap-2 mb-3">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-sm font-medium text-gray-700">
                        Key Coverage:
                      </span>
                    </div>
                    <div className="features-grid">
                      {policy.coverageDetails
                        ?.slice(0, 2)
                        .map((coverage, idx) => (
                          <div key={idx} className="feature-item">
                            <div className="feature-dot"></div>
                            <span className="feature-text">
                              {coverage.coverageType}
                            </span>
                          </div>
                        ))}
                    </div>
                  </div>

                  {/* Target audience */}
                  {policy.targetAudience &&
                    policy.targetAudience.length > 0 && (
                      <div className="audience-section">
                        <div className="flex items-center gap-2 mb-2">
                          <Users className="w-4 h-4 text-gray-500" />
                          <span className="text-sm font-medium text-gray-600">
                            Ideal For:
                          </span>
                        </div>
                        <div className="audience-tags">
                          {policy.targetAudience
                            .slice(0, 2)
                            .map((audience, idx) => (
                              <span key={idx} className="audience-tag">
                                {audience}
                              </span>
                            ))}
                          {policy.targetAudience.length > 2 && (
                            <span className="audience-tag-more">
                              +{policy.targetAudience.length - 2} more
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                  {/* Additional info */}
                  <div className="additional-info">
                    <div className="info-item">
                      <Clock className="w-4 h-4" />
                      <span className="info-text">Instant Quote</span>
                    </div>
                    <div className="info-item">
                      <BadgeCheck className="w-4 h-4" />
                      <span className="info-text">
                        {policy.allowedClaimTypes?.length || 3} Claim Types
                      </span>
                    </div>
                  </div>
                </div>

                {/* Card footer */}
                <div className="card-footer">
                  <div
                    className={`view-details-btn ${typeDetails.textColor} ${
                      isHovered ? "view-details-btn-hovered" : ""
                    }`}
                  >
                    <span>View Details</span>
                    <ChevronRight
                      className={`view-details-icon ${
                        isHovered ? "view-details-icon-hovered" : ""
                      }`}
                    />
                  </div>
                </div>

                {/* Hover overlay */}
                <div
                  className={`card-hover-overlay ${typeDetails.gradient.replace(
                    "from-",
                    "hover-gradient-from-"
                  )} ${isHovered ? "card-hover-overlay-visible" : ""}`}
                ></div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Empty state */}
      {policies.length === 0 && (
        <div className="empty-state">
          <div className="empty-state-icon">
            <Shield className="w-12 h-12 text-gray-400" />
          </div>
          <h3 className="empty-state-title">No Insurance Policies Found</h3>
          <p className="empty-state-description">
            Check back soon for available insurance plans
          </p>
        </div>
      )}
    </div>
  );
};

export default InsuranceCardComponent;
