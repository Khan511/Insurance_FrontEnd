import { Form } from "../ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insuranceFormSchema, type InsuranceFormData } from "./schema";
import { useState } from "react";
import { useCalculatePremiumMutation } from "@/services/InsurancePolicySlice";
import { PremiumCaculationForm } from "./PremiumCalculationForm";
import type { PremiumCalculationResponse } from "@/services/ServiceTypes";
import {
  Calculator,
  DollarSign,
  TrendingUp,
  Shield,
  Clock,
  AlertCircle,
  CheckCircle,
  Sparkles,
  Loader2,
} from "lucide-react";

interface PremiumCalculatorProps {
  insuranceType: "AUTO" | "LIFE" | "PROPERTY";
  productId: number;
  onPremiumCalculated?: (premiumAmount: number) => void; // Changed to accept number instead of object
}

const PremiumCalculator: React.FC<PremiumCalculatorProps> = ({
  insuranceType,
  productId,
  onPremiumCalculated,
}) => {
  const [calculatedPremium, setCalculatedPremium] =
    useState<PremiumCalculationResponse | null>(null);
  const [calculationError, setCalculationError] = useState<string | null>(null);
  const [showBreakdown, setShowBreakdown] = useState(false);

  // RTK Query mutation for premium calculation
  const [calculatePremium, { isLoading: isCalculating }] =
    useCalculatePremiumMutation();

  const form = useForm<InsuranceFormData>({
    resolver: zodResolver(insuranceFormSchema),
    defaultValues: {
      insuranceType,
      paymentFrequency: "MONTHLY",
      // Conditional defaults based on insurance type
      ...(insuranceType === "AUTO" && {
        vehicleValue: 0,
        drivingExperience: 0,
      }),
      ...(insuranceType === "LIFE" && {
        healthCondition: "GOOD",
      }),
      ...(insuranceType === "PROPERTY" && {
        propertyValue: 0,
        propertyLocation: "MEDIUM_RISK",
      }),
    },
  });

  const onSubmit = async (data: InsuranceFormData) => {
    setCalculationError(null);
    setCalculatedPremium(null);
    setShowBreakdown(false);

    try {
      // Prepare risk factors based on insurance type
      let riskFactors: Record<string, any> = {};

      switch (data.insuranceType) {
        case "AUTO":
          riskFactors = {
            vehicleValue: data.vehicleValue,
            drivingExperience: data.drivingExperience,
          };
          break;
        case "LIFE":
          riskFactors = {
            healthCondition: data.healthCondition,
          };
          break;
        case "PROPERTY":
          riskFactors = {
            propertyValue: data.propertyValue,
            propertyLocation: data.propertyLocation,
          };
          break;
        default:
          console.log(`Unhandled insurance Type: ${data}`);
      }

      console.log("riskFactors", riskFactors);

      const result = await calculatePremium({
        productId,
        riskFactors,
        paymentFrequency: data.paymentFrequency,
      }).unwrap();

      setCalculatedPremium(result);

      // Pass only the amount (number) to parent component to maintain compatibility
      onPremiumCalculated?.(result.amount);

      console.log("Premium calculation result:", result);
    } catch (error) {
      console.error("Premium calculation failed:", error);
      setCalculationError(
        "Failed to calculate premium. Please check your inputs and try again."
      );
    }
  };

  // Helper function to format frequency display
  const getFrequencyDisplay = (frequency: string) => {
    switch (frequency) {
      case "MONTHLY":
        return "/month";
      case "QUARTERLY":
        return "/quarter";
      case "ANNUAL":
        return "/year";
      default:
        return "";
    }
  };

  // Get insurance type color
  const getInsuranceTypeColor = () => {
    switch (insuranceType) {
      case "AUTO":
        return "from-blue-500 to-cyan-400";
      case "LIFE":
        return "from-emerald-500 to-teal-400";
      case "PROPERTY":
        return "from-amber-500 to-orange-400";
      default:
        return "from-indigo-500 to-purple-400";
    }
  };

  // Get insurance type icon
  const getInsuranceIcon = () => {
    switch (insuranceType) {
      case "AUTO":
        return "🚗";
      case "LIFE":
        return "❤️";
      case "PROPERTY":
        return "🏠";
      default:
        return "🛡️";
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
      {/* Calculator Header */}
      <div
        className={`bg-linear-to-r ${getInsuranceTypeColor()} text-white p-6`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Calculator className="w-8 h-8 text-white" />
              <span className="absolute -top-2 -right-2 text-2xl">
                {getInsuranceIcon()}
              </span>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white mb-1">
                Premium Calculator
              </h2>
              <p className="text-blue-400 text-sm">
                Get your personalized insurance quote in seconds
              </p>
            </div>
          </div>
          <Sparkles className="w-6 h-6 text-yellow-200" />
        </div>
      </div>

      {/* Calculator Body */}
      <div className="p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Hidden insurance type field */}
            <input
              type="hidden"
              {...form.register("insuranceType")}
              value={insuranceType}
            />

            {/* Quick Info Cards */}
            <div className="grid grid-cols-3 gap-3 mb-6">
              <div className="bg-linear-to-br from-gray-50 to-white border border-gray-200 rounded-lg p-3 flex items-center space-x-3">
                <Clock className="w-5 h-5 text-blue-500" />
                <div>
                  <p className="text-xs text-gray-500 font-medium">
                    Instant Quote
                  </p>
                  <p className="text-sm font-semibold text-gray-800">
                    30 seconds
                  </p>
                </div>
              </div>
              <div className="bg-linear-to-br from-gray-50 to-white border border-gray-200 rounded-lg p-3 flex items-center space-x-3">
                <Shield className="w-5 h-5 text-green-500" />
                <div>
                  <p className="text-xs text-gray-500 font-medium">
                    No Commitment
                  </p>
                  <p className="text-sm font-semibold text-gray-800">
                    Free estimate
                  </p>
                </div>
              </div>
              <div className="bg-linear-to-br from-gray-50 to-white border border-gray-200 rounded-lg p-3 flex items-center space-x-3">
                <TrendingUp className="w-5 h-5 text-purple-500" />
                <div>
                  <p className="text-xs text-gray-500 font-medium">
                    Best Price
                  </p>
                  <p className="text-sm font-semibold text-gray-800">
                    Guaranteed
                  </p>
                </div>
              </div>
            </div>

            {/* Risk Factors Section */}
            {insuranceType && (
              <div className="mb-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 bg-linear-to-r from-blue-50 to-indigo-50 rounded-lg flex items-center justify-center text-blue-600">
                    <Shield className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">
                      Your Details
                    </h3>
                    <p className="text-sm text-gray-500">
                      Provide your information for an accurate quote
                    </p>
                  </div>
                </div>
                <div className="bg-linear-to-br from-gray-50 to-white border border-gray-200 rounded-xl p-5">
                  <PremiumCaculationForm
                    form={form}
                    insuranceType={insuranceType}
                  />
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isCalculating}
              className="w-full bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700  font-semibold py-4 px-6 rounded-xl flex items-center justify-center space-x-2 transition-all duration-300 transform hover:-translate-y-0.5 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none text-white gap-1"
              style={{ boxShadow: "0 4px 14px rgba(59, 130, 246, 0.25)" }}
            >
              {isCalculating ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Calculating...
                </>
              ) : (
                <>
                  <Calculator className="w-5 h-5" />
                  Calculate My Premium
                </>
              )}
            </button>

            {/* Error Message */}
            {calculationError && (
              <div className="bg-linear-to-r from-red-50 to-orange-50 border border-red-200 rounded-xl p-4 flex items-center space-x-3 text-red-700">
                <AlertCircle className="w-5 h-5" />
                <span>{calculationError}</span>
              </div>
            )}

            {/* Premium Result - Only show this INSIDE the calculator, not in parent */}
            {calculatedPremium && (
              <div className="bg-linear-to-br from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-6 mt-6">
                <div className="flex items-start space-x-4 mb-4">
                  <div className="w-12 h-12 bg-linear-to-r from-green-100 to-emerald-100 rounded-xl flex items-center justify-center text-green-600">
                    <DollarSign className="w-8 h-8" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-500 mb-1">
                      Your Estimated Premium
                    </p>
                    <div className="flex items-baseline space-x-2 mb-1">
                      <span className="text-4xl font-bold text-gray-900">
                        {calculatedPremium.installmentAmount.toFixed(2)}
                      </span>
                      <span className="text-2xl font-semibold text-gray-700">
                        {calculatedPremium.currency}
                      </span>
                      <span className="text-lg font-medium text-gray-500">
                        {getFrequencyDisplay(
                          calculatedPremium.paymentFrequency
                        )}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-500">
                        Annual total:
                      </span>
                      <span className="text-base font-semibold text-gray-700">
                        {calculatedPremium.amount.toFixed(2)}{" "}
                        {calculatedPremium.currency}
                      </span>
                    </div>
                  </div>
                  <div className="bg-linear-to-r from-green-500 to-emerald-500 text-white text-xs font-medium px-3 py-1.5 rounded-full flex items-center space-x-1.5">
                    <CheckCircle className="w-5 h-5" />
                    <span>Instant Quote</span>
                  </div>
                </div>

                {/* Breakdown Toggle */}
                <button
                  type="button"
                  onClick={() => setShowBreakdown(!showBreakdown)}
                  className="w-full text-center text-sm text-blue-600 font-medium py-2 flex items-center justify-center space-x-2 hover:text-blue-700 transition-colors duration-200"
                >
                  <span>View calculation breakdown</span>
                  <svg
                    className={`w-4 h-4 transition-transform ${
                      showBreakdown ? "rotate-180" : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                {/* Breakdown Details */}
                {showBreakdown && (
                  <div className="bg-white border border-gray-200 rounded-xl p-5 mt-4">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-lg font-semibold text-gray-800">
                        Premium Breakdown
                      </h4>
                      <span className="text-xs font-mono text-gray-500 bg-gray-100 px-2 py-1 rounded">
                        Formula: {calculatedPremium.formulaUsed}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-linear-to-br from-gray-50 to-white border border-gray-100 rounded-lg p-3">
                        <span className="block text-xs font-medium text-gray-500 mb-1">
                          Monthly Installment
                        </span>
                        <span className="block text-sm font-semibold text-gray-800">
                          {calculatedPremium.installmentAmount.toFixed(2)}{" "}
                          {calculatedPremium.currency}
                        </span>
                      </div>
                      <div className="bg-linear-to-br from-gray-50 to-white border border-gray-100 rounded-lg p-3">
                        <span className="block text-xs font-medium text-gray-500 mb-1">
                          Annual Premium
                        </span>
                        <span className="block text-sm font-semibold text-gray-800">
                          {calculatedPremium.amount.toFixed(2)}{" "}
                          {calculatedPremium.currency}
                        </span>
                      </div>
                      <div className="bg-linear-to-br from-gray-50 to-white border border-gray-100 rounded-lg p-3">
                        <span className="block text-xs font-medium text-gray-500 mb-1">
                          Payment Frequency
                        </span>
                        <span className="block text-sm font-semibold text-gray-800">
                          {calculatedPremium.paymentFrequency.charAt(0) +
                            calculatedPremium.paymentFrequency
                              .slice(1)
                              .toLowerCase()}
                        </span>
                      </div>
                      <div className="bg-linear-to-br from-gray-50 to-white border border-gray-100 rounded-lg p-3">
                        <span className="block text-xs font-medium text-gray-500 mb-1">
                          Currency
                        </span>
                        <span className="block text-sm font-semibold text-gray-800">
                          {calculatedPremium.currency}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Call to Action */}
                <div className="mt-6 pt-6 border-t border-green-200">
                  <p className="text-center text-sm text-gray-600 mb-4">
                    Ready to get covered? This quote is valid for the next 30
                    days.
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      className="font-semibold py-3 px-4 rounded-xl flex items-center justify-center space-x-2 transition-all duration-300 hover:shadow-lg border bg-white border-gray-300"
                      onClick={() => {
                        window.location.href = `/product-buy-form/${productId}`;
                      }}
                    >
                      <DollarSign className="w-5 h-5" />
                      <span>Purchase Policy</span>
                    </button>

                    <button
                      type="button"
                      className="bg-white border border-gray-300 text-gray-700 font-semibold py-3 px-4 rounded-xl  transition-all duration-300 hover:shadow-lg"
                      onClick={() => {
                        // Reset form
                        form.reset();
                        setCalculatedPremium(null);
                        setShowBreakdown(false);
                      }}
                    >
                      <span>Calculate Again</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </form>
        </Form>
      </div>

      {/* Trust Badges */}
      {!calculatedPremium && (
        <div className="flex items-center justify-center space-x-6 py-4 border-t border-gray-200">
          <div className="flex items-center space-x-2 text-xs text-gray-500">
            <Shield className="w-4 h-4 text-green-500" />
            <span>Secure & Private</span>
          </div>
          <div className="flex items-center space-x-2 text-xs text-gray-500">
            <Clock className="w-4 h-4 text-blue-500" />
            <span>No Credit Check</span>
          </div>
          <div className="flex items-center space-x-2 text-xs text-gray-500">
            <CheckCircle className="w-4 h-4 text-purple-500" />
            <span>No Obligation</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default PremiumCalculator;
