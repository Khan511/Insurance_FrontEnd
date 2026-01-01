import type { UseFormReturn } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormMessage,
  FormControl,
  FormLabel,
} from "../ui/form";
import { Input } from "../ui/input";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { InsuranceFormData } from "./schema";

interface PremiumCalculationFormProps {
  form: UseFormReturn<InsuranceFormData>;
  insuranceType: "AUTO" | "LIFE" | "PROPERTY";
}

export const PremiumCaculationForm = ({
  form,
  insuranceType,
}: PremiumCalculationFormProps) => {
  // Render dynamic risk factor fields based on insurance type
  let riskFactorFields;

  switch (insuranceType) {
    case "AUTO":
      riskFactorFields = (
        <div className="grid grid-cols-1 gap-6 mb-3">
          <FormField
            control={form.control}
            name="vehicleValue"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Vehicle Value (DKK)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    className="bg-white"
                    placeholder="e.g., 200000"
                    {...field}
                    onChange={(e) => field.onChange(parseFloat(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="drivingExperience"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Driving Experience (Years)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    className="bg-white"
                    placeholder="e.g., 5"
                    {...field}
                    onChange={(e) =>
                      field.onChange(parseInt(e.target.value, 10))
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      );
      break;

    case "LIFE":
      riskFactorFields = (
        <div className="grid grid-cols-1 gap-6 mb-6">
          <FormField
            control={form.control}
            name="healthCondition"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Health Condition</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger className="bg-white w-full min-w-[200px]">
                      <SelectValue placeholder="Select health condition" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="bg-white">
                    <SelectItem className="p-2" value="EXCELLENT">
                      Excellent
                    </SelectItem>
                    <SelectItem className="p-2" value="GOOD">
                      Good
                    </SelectItem>
                    <SelectItem className="p-2" value="FAIR">
                      Fair
                    </SelectItem>
                    <SelectItem className="p-2" value="POOR">
                      Poor
                    </SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      );
      break;

    case "PROPERTY":
      riskFactorFields = (
        <div className="grid grid-cols-1 gap-6 mb-6">
          <FormField
            control={form.control}
            name="propertyValue"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Property Value (DKK)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    className="bg-white"
                    placeholder="e.g., 2500000"
                    {...field}
                    onChange={(e) => field.onChange(parseFloat(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="propertyLocation"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Property Location</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger className="bg-white w-full min-w-[200px]">
                      <SelectValue placeholder="Select location risk" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="w-[var(--radix-select-trigger-width)] max-w-[400px] bg-white">
                    <SelectItem className="p-2" value="LOW_RISK">
                      Low Risk Area
                    </SelectItem>
                    <SelectItem className="p-2" value="MEDIUM_RISK">
                      Medium Risk Area
                    </SelectItem>
                    <SelectItem className="p-2" value="HIGH_RISK">
                      High Risk Area
                    </SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      );
      break;

    default:
      riskFactorFields = null;
  }

  // Now return both dynamic fields AND the common section
  return (
    <div>
      {/* Common Section: Payment Frequency */}
      <div>
        <p className="text-xl font-semibold underline mb-4 text-center text-blue-500">
          Risk Factors
        </p>
        {/* Dynamic Risk Factors */}
        {riskFactorFields}

        <FormField
          control={form.control}
          name="paymentFrequency"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Payment Frequency</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger className="bg-white w-full min-w-[200px]">
                    <SelectValue placeholder="Select payment frequency" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="w-(--radix-select-trigger-width) max-w-[400px] bg-white">
                  <SelectItem className="p-2" value="MONTHLY">
                    Monthly
                  </SelectItem>
                  <SelectItem className="p-2" value="QUARTERLY">
                    Quarterly
                  </SelectItem>
                  <SelectItem className="p-2" value="ANNUAL">
                    Annual
                  </SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};
