import { Calendar } from "lucide-react";
import { type UseFormReturn } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import type { InsuranceFormData } from "./schema";

interface PremiumCalculationFormProps {
  form: UseFormReturn<InsuranceFormData>;
  insuranceType: "AUTO" | "LIFE" | "PROPERTY";
}

export const PremiumCalculationForm: React.FC<PremiumCalculationFormProps> = ({
  form,
  insuranceType,
}) => {
  const [age, setAge] = useState<number | null>(null);

  // Calculate age when date of birth changes
  const handleDateChange = (date: Date | undefined) => {
    if (date) {
      const dobString = format(date, "yyyy-MM-dd");
      form.setValue("dateOfBirth", dobString, { shouldValidate: true });

      // Calculate and display age
      const today = new Date();
      let calculatedAge = today.getFullYear() - date.getFullYear();
      const monthDiff = today.getMonth() - date.getMonth();

      if (
        monthDiff < 0 ||
        (monthDiff === 0 && today.getDate() < date.getDate())
      ) {
        calculatedAge--;
      }

      setAge(calculatedAge);
    } else {
      form.setValue("dateOfBirth", "", { shouldValidate: true });
      setAge(null);
    }
  };

  // Get date from form
  const formDate = form.watch("dateOfBirth");
  const selectedDate = formDate ? new Date(formDate) : undefined;

  // Calculate date ranges based on insurance type
  const getDateRange = () => {
    const today = new Date();
    let maxDate: Date;
    let minDate: Date;

    if (insuranceType === "AUTO") {
      // AUTO: Age 18-85
      maxDate = new Date(
        today.getFullYear() - 18,
        today.getMonth(),
        today.getDate(),
      );
      minDate = new Date(
        today.getFullYear() - 85,
        today.getMonth(),
        today.getDate(),
      );
    } else if (insuranceType === "LIFE") {
      // LIFE: Age 18-70
      maxDate = new Date(
        today.getFullYear() - 18,
        today.getMonth(),
        today.getDate(),
      );
      minDate = new Date(
        today.getFullYear() - 70,
        today.getMonth(),
        today.getDate(),
      );
    } else {
      // PROPERTY: Age 18-100 (optional)
      maxDate = new Date(
        today.getFullYear() - 18,
        today.getMonth(),
        today.getDate(),
      );
      minDate = new Date(
        today.getFullYear() - 100,
        today.getMonth(),
        today.getDate(),
      );
    }

    return { minDate, maxDate };
  };

  const { minDate, maxDate } = getDateRange();

  return (
    <div className="space-y-4">
      {/* Date of Birth Field - Required for AUTO and LIFE, optional for PROPERTY */}
      {(insuranceType === "AUTO" || insuranceType === "LIFE") && (
        <FormField
          control={form.control}
          name="dateOfBirth"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel className="flex items-center">
                <Calendar className="w-4 h-4 mr-2" />
                Date of Birth
                {age !== null && (
                  <span className="ml-2 text-sm font-medium text-gray-600">
                    (Age: {age})
                  </span>
                )}
              </FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full pl-3 text-left font-normal",
                        !selectedDate && "text-muted-foreground",
                      )}
                    >
                      {selectedDate ? (
                        format(selectedDate, "PPP")
                      ) : (
                        <span>Select your date of birth</span>
                      )}
                      <Calendar className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <CalendarComponent
                    mode="single"
                    selected={selectedDate}
                    onSelect={handleDateChange}
                    disabled={(date) => date > maxDate || date < minDate}
                    defaultMonth={
                      insuranceType === "AUTO"
                        ? new Date(new Date().getFullYear() - 40, 0)
                        : insuranceType === "LIFE"
                          ? new Date(new Date().getFullYear() - 45, 0)
                          : new Date(new Date().getFullYear() - 30, 0)
                    }
                    className="pointer-events-auto"
                    captionLayout="dropdown"
                    fromYear={minDate.getFullYear()}
                    toYear={maxDate.getFullYear()}
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
              <p className="text-xs text-gray-500 mt-1">
                {insuranceType === "AUTO"
                  ? "Age must be between 18-85 years for auto insurance"
                  : "Age must be between 18-70 years for life insurance"}
              </p>
            </FormItem>
          )}
        />
      )}

      {/* Conditional fields based on insurance type */}
      {insuranceType === "AUTO" && (
        <>
          <FormField
            control={form.control}
            name="vehicleValue"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Vehicle Value (USD)</FormLabel>
                <FormControl>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                      $
                    </span>
                    <Input
                      type="number"
                      placeholder="Enter vehicle value"
                      className="pl-8"
                      value={field.value || ""}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </div>
                </FormControl>
                <FormMessage />
                <p className="text-xs text-gray-500">
                  Minimum $1,000, maximum $1,000,000
                </p>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="drivingExperience"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Years of Driving Experience</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Enter years of experience"
                    value={field.value || ""}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
                <p className="text-xs text-gray-500">
                  New drivers (0-2 years) may have higher premiums
                </p>
              </FormItem>
            )}
          />
        </>
      )}

      {insuranceType === "LIFE" && (
        <FormField
          control={form.control}
          name="healthCondition"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Health Condition</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
                value={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select health condition" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="EXCELLENT">
                    Excellent (No health issues)
                  </SelectItem>
                  <SelectItem value="GOOD">
                    Good (Minor issues controlled)
                  </SelectItem>
                  <SelectItem value="FAIR">
                    Fair (Some health concerns)
                  </SelectItem>
                  <SelectItem value="POOR">
                    Poor (Major health conditions)
                  </SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
              <div className="text-xs text-gray-500 space-y-1 mt-1">
                <p>• Excellent: No health issues, non-smoker</p>
                <p>• Good: Minor issues well-controlled</p>
                <p>• Fair: Some ongoing health concerns</p>
                <p>• Poor: Major conditions or smoker</p>
              </div>
            </FormItem>
          )}
        />
      )}

      {insuranceType === "PROPERTY" && (
        <>
          {/* Optional Date of Birth for Property Insurance */}
          <FormField
            control={form.control}
            name="dateOfBirth"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel className="flex items-center">
                  <Calendar className="w-4 h-4 mr-2" />
                  Date of Birth (Optional)
                  {age !== null && (
                    <span className="ml-2 text-sm font-medium text-gray-600">
                      (Age: {age})
                    </span>
                  )}
                </FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !selectedDate && "text-muted-foreground",
                        )}
                      >
                        {selectedDate ? (
                          format(selectedDate, "PPP")
                        ) : (
                          <span>Select date of birth (optional)</span>
                        )}
                        <Calendar className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <CalendarComponent
                      mode="single"
                      selected={selectedDate}
                      onSelect={handleDateChange}
                      disabled={(date) => date > maxDate || date < minDate}
                      defaultMonth={new Date(new Date().getFullYear() - 30, 0)}
                      className="pointer-events-auto"
                      captionLayout="dropdown"
                      fromYear={minDate.getFullYear()}
                      toYear={maxDate.getFullYear()}
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
                <p className="text-xs text-gray-500 mt-1">
                  Optional: Provide for more accurate quote (Age must be 18-100)
                </p>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="propertyValue"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Property Value (USD)</FormLabel>
                <FormControl>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                      $
                    </span>
                    <Input
                      type="number"
                      placeholder="Enter property value"
                      className="pl-8"
                      value={field.value || ""}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </div>
                </FormControl>
                <FormMessage />
                <p className="text-xs text-gray-500">
                  Minimum $10,000, maximum $10,000,000
                </p>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="propertyLocation"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Property Location Risk</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  value={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select location risk" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="LOW_RISK">
                      Low Risk (Safe area, low crime)
                    </SelectItem>
                    <SelectItem value="MEDIUM_RISK">
                      Medium Risk (Average area)
                    </SelectItem>
                    <SelectItem value="HIGH_RISK">
                      High Risk (High crime/flood zone)
                    </SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
                <div className="text-xs text-gray-500 space-y-1 mt-1">
                  <p>
                    • Low: Urban/suburban, low crime, good emergency services
                  </p>
                  <p>• Medium: Average urban area, moderate risk</p>
                  <p>• High: High crime rate, flood-prone, remote location</p>
                </div>
              </FormItem>
            )}
          />
        </>
      )}

      {/* Payment Frequency Field - REQUIRED FOR ALL INSURANCE TYPES */}
      <FormField
        control={form.control}
        name="paymentFrequency"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Payment Frequency</FormLabel>
            <Select
              onValueChange={field.onChange}
              defaultValue={field.value}
              value={field.value}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select payment frequency" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="MONTHLY">Monthly</SelectItem>
                <SelectItem value="QUARTERLY">Quarterly</SelectItem>
                <SelectItem value="ANNUAL">Annual</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
            <div className="text-xs text-gray-500 space-y-1 mt-1">
              <p>• Monthly: Pay every month (12 installments per year)</p>
              <p>• Quarterly: Pay every 3 months (4 installments per year)</p>
              <p>• Annual: Pay once per year</p>
            </div>
          </FormItem>
        )}
      />
    </div>
  );
};
