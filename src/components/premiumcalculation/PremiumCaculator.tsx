import {
  FormField,
  FormItem,
  FormMessage,
  FormControl,
  FormLabel,
  Form,
} from "../ui/form";
import { Input } from "../ui/input";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insuranceFormSchema, type InsuranceFormData } from "./schema";
import { useState } from "react";
import {
  useCalculatePremiumMutation,
  type PremiumCalculationResponse,
} from "@/services/InsurancePolicySlice";
import { PremiumCaculationForm } from "./PremiumCalculationForm";

interface PremiumCalculatorProps {
  insuranceType: "AUTO" | "LIFE" | "PROPERTY";
  productId: number;
}

const PremiumCalculator: React.FC<PremiumCalculatorProps> = ({
  insuranceType,
  productId,
}) => {
  const [calculatedPremium, setCalculatedPremium] =
    useState<PremiumCalculationResponse | null>(null);
  const [calculationError, setCalculationError] = useState<string | null>(null);

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
    console.log("Form data:", data);
    setCalculationError(null);
    setCalculatedPremium(null);
    // Handle form submission

    try {
      // Prepare risk factors based on insurace type
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

      console.log("Sending risk factors:", riskFactors);

      const result = await calculatePremium({
        productId,
        riskFactors,
        paymentFrequency: data.paymentFrequency,
      }).unwrap();

      setCalculatedPremium(result);
      console.log("Premium calculation result:", result);
    } catch (error) {
      console.error("Premium calculation failed:", error);
      setCalculationError(
        "Failed to calculate premium. Please check your inputs."
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

  // const renderInputs = () => {
  //   switch (insuranceType) {
  //     case "AUTO":
  //       return (
  //         <div className="grid grid-cols-1 gap-6 mb-3">
  //           <FormField
  //             control={form.control}
  //             name="vehicleValue"
  //             render={({ field }) => (
  //               <FormItem>
  //                 <FormLabel>Vehicle Value (DKK)</FormLabel>
  //                 <FormControl>
  //                   <Input
  //                     type="number"
  //                     className="bg-white"
  //                     placeholder="e.g., 200000"
  //                     {...field}
  //                     onChange={(e) =>
  //                       field.onChange(parseFloat(e.target.value))
  //                     }
  //                   />
  //                 </FormControl>
  //                 <FormMessage />
  //               </FormItem>
  //             )}
  //           />
  //           <FormField
  //             control={form.control}
  //             name="drivingExperience"
  //             render={({ field }) => (
  //               <FormItem>
  //                 <FormLabel>Driving Experience (Years)</FormLabel>
  //                 <FormControl>
  //                   <Input
  //                     type="number"
  //                     className="bg-white"
  //                     placeholder="e.g., 5"
  //                     {...field}
  //                     onChange={(e) => field.onChange(parseInt(e.target.value))}
  //                   />
  //                 </FormControl>
  //                 <FormMessage />
  //               </FormItem>
  //             )}
  //           />
  //         </div>
  //       );

  //     case "LIFE":
  //       return (
  //         <div className="grid grid-cols-1 gap-6 mb-6">
  //           <FormField
  //             control={form.control}
  //             name="healthCondition"
  //             render={({ field }) => (
  //               <FormItem className="w-full">
  //                 <FormLabel>Health Condition</FormLabel>
  //                 <Select onValueChange={field.onChange} value={field.value}>
  //                   <FormControl>
  //                     <SelectTrigger className="bg-white w-full min-w-[200px]">
  //                       <SelectValue placeholder="Select health condition" />
  //                     </SelectTrigger>
  //                   </FormControl>
  //                   <SelectContent>
  //                     <SelectItem className="p-2" value="EXCELLENT">
  //                       Excellent
  //                     </SelectItem>
  //                     <SelectItem className="p-2" value="GOOD">
  //                       Good
  //                     </SelectItem>
  //                     <SelectItem className="p-2" value="FAIR">
  //                       Fair
  //                     </SelectItem>
  //                     <SelectItem className="p-2" value="POOR">
  //                       Poor
  //                     </SelectItem>
  //                   </SelectContent>
  //                 </Select>
  //                 <FormMessage />
  //               </FormItem>
  //             )}
  //           />
  //         </div>
  //       );

  //     case "PROPERTY":
  //       return (
  //         <div className="grid grid-cols-1 gap-6 mb-6">
  //           <FormField
  //             control={form.control}
  //             name="propertyValue"
  //             render={({ field }) => (
  //               <FormItem>
  //                 <FormLabel>Property Value (DKK)</FormLabel>
  //                 <FormControl>
  //                   <Input
  //                     type="number"
  //                     className="bg-white"
  //                     placeholder="e.g., 2500000"
  //                     {...field}
  //                     onChange={(e) =>
  //                       field.onChange(parseFloat(e.target.value))
  //                     }
  //                   />
  //                 </FormControl>
  //                 <FormMessage />
  //               </FormItem>
  //             )}
  //           />
  //           <FormField
  //             control={form.control}
  //             name="propertyLocation"
  //             render={({ field }) => (
  //               <FormItem className="w-full">
  //                 <FormLabel>Property Location</FormLabel>
  //                 <Select onValueChange={field.onChange} value={field.value}>
  //                   <FormControl>
  //                     <SelectTrigger className="bg-white w-full min-w-[200px]">
  //                       <SelectValue placeholder="Select location risk" />
  //                     </SelectTrigger>
  //                   </FormControl>
  //                   <SelectContent className="w-[var(--radix-select-trigger-width)] max-w-[400px]">
  //                     <SelectItem className="p-2" value="LOW_RISK">
  //                       Low Risk Area
  //                     </SelectItem>
  //                     <SelectItem className="p-2" value="MEDIUM_RISK">
  //                       Medium Risk Area
  //                     </SelectItem>
  //                     <SelectItem className="p-2" value="HIGH_RISK">
  //                       High Risk Area
  //                     </SelectItem>
  //                   </SelectContent>
  //                 </Select>
  //                 <FormMessage />
  //               </FormItem>
  //             )}
  //           />
  //         </div>
  //       );

  //     default:
  //       return null;
  //   }
  // };

  return (
    <div className=" mt-4 border rounded bg-gray-200 p-3">
      <p className="text-center text-2xl font-semibold">
        Calculate Your Premium
      </p>

      {/* Wrap with FormProvider */}
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="max-w-2xl mx-auto bg-gray-200 p-3 border rounded-2xl  shadow-2xl"
        >
          {/* Hidden insurance type field */}
          <input
            type="hidden"
            {...form.register("insuranceType")}
            value={insuranceType}
          />

          {/* Risk Factors Section */}
          {insuranceType && (
            <PremiumCaculationForm form={form} insuranceType={insuranceType} />
          )}

          <div className="flex flex-col items-center mt-4 space-y-4">
            <button
              type="submit"
              className="btn btn-secondary mb-2"
              disabled={isCalculating}
            >
              {isCalculating ? "Calculating..." : "See your price"}
            </button>

            {calculatedPremium !== null && (
              <div className="text-center p-4 bg-green-100 rounded-lg border border-green-200 w-full">
                <h4 className="font-semibold text-green-800">
                  Calculated Premium
                </h4>
                <p className="text-lg font-bold text-green-900">
                  {calculatedPremium.installmentAmount.toFixed(2)}{" "}
                  {calculatedPremium.currency}{" "}
                  <span className="text-sm text-green-700 font-normal">
                    {getFrequencyDisplay(calculatedPremium.paymentFrequency)}
                  </span>
                </p>
                <p className="text-sm text-green-700">
                  {/* {getFrequencyDisplay(calculatedPremium.paymentFrequency)} */}
                </p>
                <p className="text-xs text-gray-600 mt-2">
                  Total annual: {calculatedPremium.amount.toFixed(2)}{" "}
                  {calculatedPremium.currency}
                </p>
              </div>
            )}
          </div>
        </form>
      </Form>
    </div>
  );
};

export default PremiumCalculator;
