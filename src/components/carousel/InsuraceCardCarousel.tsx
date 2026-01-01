import "./InsuraceCardcarousel.css";
import { Card } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Link } from "react-router-dom";
import Autoplay from "embla-carousel-autoplay";
import {
  CarFront,
  Home,
  Shield,
  ChevronRight,
  TrendingUp,
  CheckCircle,
  Users,
  Clock,
  Zap,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import type { CarouselApi } from "@/components/ui/carousel"; // Make sure this import is correct

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
  products: InsuraceProduct[];
}

// Helper function to get icon and color based on product type
const getProductTypeDetails = (type: ProductType) => {
  const details = {
    AUTO: {
      icon: <CarFront className="w-7 h-7" />,
      color: "from-blue-600 to-cyan-500",
      bgColor: "bg-gradient-to-br from-blue-600/10 to-cyan-500/10",
      borderColor: "border-blue-200",
      textColor: "text-blue-700",
      accentColor: "bg-blue-500",
    },
    LIFE: {
      icon: <Shield className="w-7 h-7" />,
      color: "from-emerald-600 to-teal-500",
      bgColor: "bg-gradient-to-br from-emerald-600/10 to-teal-500/10",
      borderColor: "border-emerald-200",
      textColor: "text-emerald-700",
      accentColor: "bg-emerald-500",
    },
    PROPERTY: {
      icon: <Home className="w-7 h-7" />,
      color: "from-amber-600 to-orange-500",
      bgColor: "bg-gradient-to-br from-amber-600/10 to-orange-500/10",
      borderColor: "border-amber-200",
      textColor: "text-amber-700",
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

// Generate 6 items (duplicate for infinite loop effect)
const createLoopingProducts = (products: InsuraceProduct[]) => {
  return [...products, ...products];
};

export function InsuranceCardCarousel({ products }: Props) {
  const [api, setApi] = useState<CarouselApi>();
  const [isHovering, setIsHovering] = useState<number | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const autoplayRef = useRef(
    Autoplay({ delay: 4000, stopOnInteraction: false })
  );

  const loopingProducts = createLoopingProducts(products);

  // Setup carousel API and event listeners
  useEffect(() => {
    if (!api) {
      return;
    }

    // Update current index when carousel slides
    const onSelect = () => {
      const currentSlide = api.selectedScrollSnap();
      setCurrentIndex(currentSlide % products.length);
    };

    // Set initial index
    setCurrentIndex(api.selectedScrollSnap() % products.length);

    // Add event listeners
    api.on("select", onSelect);
    api.on("scroll", onSelect);

    return () => {
      api.off("select", onSelect);
      api.off("scroll", onSelect);
    };
  }, [api, products.length]);

  // Handle navigation to specific slide
  const handleSlideChange = (index: number) => {
    if (api) {
      api.scrollTo(index);
    }
  };

  // Handle next slide
  const handleNext = () => {
    if (api) {
      api.scrollNext();
    }
  };

  return (
    <div className="relative w-full">
      {/* Animated background effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse-slow"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse-slow animation-delay-2000"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4">
        {/* Decorative top line */}
        <div className="absolute top-0 left-1/2 w-48 h-1 bg-linear-to-r from-transparent via-blue-400 to-transparent -translate-x-1/2"></div>

        {/* Carousel Progress Bar */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-4">
            <div className="text-left">
              <h2 className="text-3xl font-bold bg-linear-to-r from-gray-900 to-blue-800 bg-clip-text text-transparent">
                Featured Insurance Plans
              </h2>
              <p className="text-gray-600 mt-2">
                Browse our top-rated policies
              </p>
            </div>

            {/* Progress indicator */}
            <div className="flex items-center gap-4">
              <div className="text-sm font-medium text-gray-700">
                <span className="text-2xl font-bold text-blue-600">
                  {currentIndex + 1}
                </span>
                <span className="text-gray-400">/{products.length}</span>
              </div>
            </div>
          </div>

          {/* Progress bar */}
          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-linear-to-r from-blue-500 to-cyan-400 transition-all duration-500 ease-out"
              style={{
                width: `${((currentIndex + 1) / products.length) * 100}%`,
              }}
            ></div>
          </div>
        </div>

        <Carousel
          setApi={setApi}
          opts={{
            align: "start",
            loop: true,
            duration: 35,
          }}
          plugins={[autoplayRef.current]}
          className="w-full relative"
          onMouseEnter={() => autoplayRef.current?.stop()}
          onMouseLeave={() => autoplayRef.current?.play()}
        >
          {/* Background glow effect */}
          <div className="absolute inset-0 bg-linear-to-r from-transparent via-blue-500/5 to-transparent blur-3xl -z-10 animate-pulse"></div>

          <CarouselContent className="py-8 -ml-4">
            {loopingProducts.map((policy, index) => {
              const typeDetails = getProductTypeDetails(policy.productType);
              const isHovered = isHovering === policy.id;
              const isRealProduct = index < products.length;
              const actualIndex = index % products.length;
              const isActive = currentIndex === actualIndex - 1;

              return (
                <CarouselItem
                  key={`${policy.id}-${index}`}
                  className="pl-4 basis-full sm:basis-1/2 md:basis-1/3 "
                  onMouseEnter={() => setIsHovering(policy.id)}
                  onMouseLeave={() => setIsHovering(null)}
                >
                  <Link
                    to={`/products/${policy.id}`}
                    className="block h-full no-underline hover:no-underline focus:no-underline"
                  >
                    <div className="relative group h-full">
                      {/* Active slide indicator */}
                      {isActive && (
                        <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-20">
                          <div className="relative">
                            <div className="w-3 h-3 rounded-full bg-linear-to-r from-blue-500 to-cyan-400 animate-ping absolute"></div>
                            <div className="w-3 h-3 rounded-full bg-linear-to-r from-blue-500 to-cyan-400 relative"></div>
                          </div>
                        </div>
                      )}

                      {/* Advanced glow effect with animation */}
                      <div className="absolute -inset-0.5 rounded-3xl opacity-0 group-hover:opacity-100 transition-all duration-700">
                        <div
                          className={`absolute inset-0 rounded-3xl bg-linear-to-br ${typeDetails.color} blur-xl opacity-70 animate-gradient-shift`}
                        ></div>
                        <div className="absolute inset-0 rounded-3xl bg-linear-to-br from-white/90 via-transparent to-white/90 opacity-30"></div>
                      </div>

                      {/* Main card with 3D effect */}
                      <Card
                        className={`relative bg-white/97 backdrop-blur-md border ${
                          isActive ? "border-blue-300/50" : "border-white/80"
                        } rounded-3xl shadow-2xl shadow-gray-200/30 hover:shadow-3xl hover:shadow-blue-200/40 transition-all duration-500 overflow-hidden group-hover:scale-[1.02] group-hover:border-white/90 group-hover:-translate-y-1 h-full transform-gpu `}
                      >
                        {/* Active card indicator */}
                        {isActive && (
                          <div className="absolute top-0 left-0 right-0 h-1 bg-linear-to-r from-blue-500 to-cyan-400 z-20"></div>
                        )}

                        {/* Dynamic gradient overlay */}
                        <div
                          className={`absolute inset-0 bg-linear-to-br ${typeDetails.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}
                        ></div>

                        {/* Geometric pattern overlay */}
                        <div className="absolute inset-0 opacity-[0.02] group-hover:opacity-[0.04] transition-opacity duration-500">
                          <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(99,102,241,0.1)_1px,transparent_0)] bg-size-[40px_40px]"></div>
                          <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_48%,rgba(99,102,241,0.03)_50%,transparent_52%)] bg-size-[60px_60px]"></div>
                        </div>

                        {/* Card header with animated gradient */}
                        <div
                          className={`relative h-44 bg-linear-to-br ${typeDetails.color} p-6 overflow-hidden`}
                        >
                          {/* Animated floating elements */}
                          <div className="absolute inset-0 overflow-hidden">
                            <div className="absolute -top-20 -left-20 w-60 h-60 bg-white/10 rounded-full animate-float-slow"></div>
                            <div className="absolute top-10 -right-20 w-40 h-40 bg-white/5 rounded-full animate-float-delayed"></div>
                            <div className="absolute -bottom-20 left-1/3 w-32 h-32 bg-white/10 rounded-full animate-float-slowest"></div>
                          </div>

                          {/* Animated shine effect */}
                          <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>

                          {/* Product type badge with glass effect */}
                          <div className="relative z-10">
                            <div className="inline-flex items-center gap-4 px-5 py-3 rounded-2xl bg-white/20 backdrop-blur-md border border-white/40 shadow-lg w-fit">
                              <div
                                className={`p-2.5 rounded-xl bg-white/30 backdrop-blur-sm ${typeDetails.textColor} shadow-inner`}
                              >
                                <div className="relative">
                                  {typeDetails.icon}
                                  <div className="absolute -top-1 -right-1 w-2 h-2 bg-white/80 rounded-full animate-pulse"></div>
                                </div>
                              </div>
                              <div className="space-y-1">
                                <span className="font-bold text-xl text-white tracking-tight">
                                  {policy.productType}
                                </span>
                                {policy.basePremium && (
                                  <div className="flex items-center gap-1 ">
                                    <div className="w-2 h-2 bg-white/50 rounded-full animate-pulse"></div>
                                    <span className="text-white/95 text-sm font-medium">
                                      {formatCurrency(
                                        policy.basePremium.amount,
                                        policy.basePremium.currency
                                      )}
                                      <span className="text-white/70">
                                        /month
                                      </span>
                                    </span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Trending badge */}
                          <div className="absolute -bottom-5 right-6 z-10 mb-4">
                            <div className="relative px-4 py-2.5 rounded-full bg-white/95 backdrop-blur-sm shadow-xl border border-white/50">
                              <div className="flex items-center gap-2">
                                <div className="relative">
                                  <Zap className="w-4 h-4 text-amber-500 fill-amber-500/20" />
                                  <div className="absolute inset-0 bg-amber-500/20 blur-sm"></div>
                                </div>
                                <span className="text-sm font-bold text-gray-900 tracking-wide">
                                  Trending
                                </span>
                              </div>
                              <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full animate-ping"></div>
                            </div>
                          </div>
                        </div>

                        {/* Card content with improved spacing */}
                        <div className="p-4 pt-3 flex flex-col flex-1">
                          {/* Product title with gradient */}
                          <div className="mb-3">
                            <h3 className="text-2xl font-bold bg-linear-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent group-hover:from-gray-900 group-hover:to-gray-800 transition-all duration-300 leading-tight">
                              {policy.displayName}
                            </h3>
                            <div className="h-1 w-12 bg-linear-to-r from-blue-500 to-cyan-400 rounded-full mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                          </div>

                          {/* Description with line clamp */}
                          <p className="text-gray-600 text-sm leading-relaxed mb-3 grow line-clamp-3 group-hover:text-gray-700 transition-colors duration-300">
                            {policy.description}
                          </p>

                          {/* Key features with improved visual hierarchy */}
                          <div className="space-y-3 mb-2">
                            <div className="flex items-center gap-2">
                              <div className="flex items-center gap-2">
                                <div
                                  className={`w-2 h-2 rounded-full ${typeDetails.accentColor} animate-pulse`}
                                ></div>
                                <div
                                  className={`w-8 h-0.5 rounded-full ${typeDetails.accentColor}`}
                                ></div>
                              </div>
                              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                                Premium Features
                              </span>
                            </div>

                            <div className="space-y-2.5">
                              {policy.coverageDetails
                                ?.slice(0, 2)
                                .map((coverage, idx) => (
                                  <div
                                    key={idx}
                                    className="flex items-start gap-3 group/feature"
                                  >
                                    <div className="relative">
                                      <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 shrink-0 fill-green-500/20" />
                                      <div className="absolute inset-0 bg-green-500/10 blur-sm"></div>
                                    </div>
                                    <span className="text-sm text-gray-700 group-hover/feature:text-gray-900 transition-colors">
                                      {coverage.coverageType}
                                    </span>
                                  </div>
                                ))}

                              {/* Dynamic benefits based on product type */}
                              {policy.productType === "AUTO" && (
                                <div className="flex items-start gap-3 group/feature">
                                  <div className="relative">
                                    <Zap className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
                                  </div>
                                  <span className="text-sm text-gray-700 group-hover/feature:text-gray-900 transition-colors">
                                    24/7 AI-Powered Roadside Assistance
                                  </span>
                                </div>
                              )}

                              {policy.productType === "LIFE" && (
                                <div className="flex items-start gap-3 group/feature">
                                  <div className="relative">
                                    <Users className="w-4 h-4 text-blue-500 mt-0.5 shrink-0" />
                                  </div>
                                  <span className="text-sm text-gray-700 group-hover/feature:text-gray-900 transition-colors">
                                    Family & Digital Legacy Protection
                                  </span>
                                </div>
                              )}

                              {policy.productType === "PROPERTY" && (
                                <div className="flex items-start gap-3 group/feature">
                                  <div className="relative">
                                    <Shield className="w-4 h-4 text-purple-500 mt-0.5 shrink-0" />
                                  </div>
                                  <span className="text-sm text-gray-700 group-hover/feature:text-gray-900 transition-colors">
                                    Climate-Resilient Coverage
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Target audience with pills */}
                          {policy.targetAudience &&
                            policy.targetAudience.length > 0 && (
                              <div className="mt-2 pt-5 border-t border-gray-100/50 group-hover:border-gray-200/50 transition-colors">
                                <div className="flex flex-wrap gap-2">
                                  {policy.targetAudience
                                    .slice(0, 2)
                                    .map((audience, idx) => (
                                      <span
                                        key={idx}
                                        className="px-3 py-1.5 rounded-full text-xs font-semibold bg-linear-to-r from-gray-50 to-gray-100 text-gray-700 border border-gray-200/50 hover:border-gray-300 hover:from-gray-100 hover:to-gray-200 transition-all duration-300 group-hover:scale-105"
                                      >
                                        {audience}
                                      </span>
                                    ))}
                                  {policy.targetAudience.length > 2 && (
                                    <span className="px-3 py-1.5 rounded-full text-xs font-semibold bg-linear-to-r from-blue-50 to-blue-100 text-blue-700 border border-blue-200">
                                      +{policy.targetAudience.length - 2} more
                                    </span>
                                  )}
                                </div>
                              </div>
                            )}

                          {/* CTA section with improved interaction */}
                          <div className="mt-3 pt-4 border-t border-gray-100/50 group-hover:border-gray-200/50 transition-colors">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2 text-sm text-gray-500 group-hover:text-gray-600 transition-colors">
                                <Clock className="w-4 h-4" />
                                <span className="font-medium">
                                  Instant Quote
                                </span>
                              </div>

                              <div className="flex items-center gap-2">
                                <span
                                  className={`text-sm font-bold ${typeDetails.textColor} tracking-wide`}
                                >
                                  Explore Coverage
                                </span>
                                <div
                                  className={`relative p-1.5 rounded-lg bg-linear-to-br ${typeDetails.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
                                >
                                  <ChevronRight
                                    className={`w-4 h-4 text-white transition-transform duration-300 ${
                                      isHovered ? "translate-x-1" : ""
                                    }`}
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Interactive hover elements */}
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <div className="w-24 h-1 bg-linear-to-r from-transparent via-blue-500 to-transparent rounded-full blur-sm"></div>
                        </div>
                      </Card>

                      {/* Clone indicator for debugging */}
                      {!isRealProduct && (
                        <div className="absolute top-3 right-3 z-10">
                          <div className="px-2.5 py-1 text-xs font-medium bg-linear-to-r from-gray-900 to-gray-700 text-white rounded-lg shadow-lg">
                            Preview
                          </div>
                        </div>
                      )}
                    </div>
                  </Link>
                </CarouselItem>
              );
            })}
          </CarouselContent>

          {/* Enhanced navigation */}
          <div className="relative mt-10">
            {/* Dots indicator */}
            <div className="flex justify-center items-center gap-3 mb-8">
              {products.slice(0, Math.min(5, products.length)).map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSlideChange(idx)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    currentIndex === idx
                      ? "w-8 bg-linear-to-r from-blue-500 to-cyan-400"
                      : "bg-gray-300 hover:bg-gray-400"
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>

            {/* Navigation buttons with improved design */}
            <div className="flex justify-center gap-3 items-center">
              <CarouselPrevious className="static transform-none w-16 h-16  bg-white/95 backdrop-blur-lg border border-white/80 shadow-2xl hover:shadow-3xl hover:bg-white hover:border-blue-200 hover:scale-105 transition-all duration-300 group/prev" />
              <div className="flex items-center justify-center w-fit gap-2 px-4 py-2 rounded-full bg-white/90 backdrop-blur-sm border border-gray-200/50 shadow-lg">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-gray-700">
                  {currentIndex + 1} / {products.length}
                </span>
              </div>

              <CarouselNext
                onClick={handleNext}
                className="static flex justify-center items-center transform-none w-16 h-16 rounded-2xl bg-white/95 backdrop-blur-lg border border-white/80 shadow-2xl hover:shadow-3xl hover:bg-white hover:border-blue-200 hover:scale-105 transition-all duration-300 group/next"
              />
            </div>
          </div>
        </Carousel>
      </div>

      {/* Stats at bottom */}
      <div className="mt-12">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-3 gap-8">
            <div className="text-center p-6 rounded-2xl bg-linear-to-br from-white to-gray-50 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="text-3xl font-bold bg-linear-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent mb-2">
                {products.length}
              </div>
              <div className="text-sm text-gray-600 font-medium">
                Insurance Plans
              </div>
              <div className="mt-2 text-xs text-gray-500">
                Tailored for your needs
              </div>
            </div>

            <div className="text-center p-6 rounded-2xl bg-linear-to-br from-white to-gray-50 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Users className="w-5 h-5 text-emerald-500" />
                <div className="text-3xl font-bold bg-linear-to-r from-emerald-600 to-green-500 bg-clip-text text-transparent">
                  98%
                </div>
              </div>
              <div className="text-sm text-gray-600 font-medium">
                Satisfied Customers
              </div>
              <div className="mt-2 text-xs text-gray-500">
                Based on 15K+ reviews
              </div>
            </div>

            <div className="text-center p-6 rounded-2xl bg-linear-to-br from-white to-gray-50 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-center gap-2 mb-2">
                <TrendingUp className="w-5 h-5 text-amber-500" />
                <div className="text-3xl font-bold bg-linear-to-r from-amber-600 to-orange-500 bg-clip-text text-transparent">
                  24h
                </div>
              </div>
              <div className="text-sm text-gray-600 font-medium">
                Average Claim Time
              </div>
              <div className="mt-2 text-xs text-gray-500">
                Fast & efficient processing
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
