import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { CalendarIcon, ChevronDownIcon } from "lucide-react";
import { format } from "date-fns";
import { useEffect, useState } from "react";

import { Trash2 } from "lucide-react";
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@/components/ui/collapsible";

// Shadcn components
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Checkbox } from "@/components/ui/checkbox";
import { useGetProductDetailsQuery } from "@/services/InsuranceProductSlice";
import { useGetCurrenttUserQuery } from "@/services/UserApiSlice";
import { useParams } from "react-router";
import { useBuyPolicyMutation } from "@/services/InsurancePolicySlice";
import { Spinner } from "react-bootstrap";

const addressKeys = ["street", "city", "postalCode", "country"] as const;

// Form Schema with Customer entity
const idTypeOptions = [
  "PASSPORT",
  "DRIVERS_LICENSE",
  "NATIONAL_ID",
  "SSN",
  "TAX_ID",
  "RESIDENCE_PERMIT",
] as const;

const formSchema = z.object({
  vehicleValue: z.number().optional(), // For auto insurance
  drivingExperience: z.number().optional(), // For auto insurance
  healthCondition: z.string().optional(), // For life insurance
  propertyValue: z.number().optional(), // For home insurance
  propertyLocation: z.string().optional(),
  paymentFrequency: z.enum(["MONTHLY", "QUARTERLY", "ANNUAL"]),

  customer: z.object({
    userId: z.string(),

    governmentId: z.object({
      idType: z.enum(idTypeOptions, {
        required_error: "ID type is required",
      }),
      idNumber: z
        .string()
        .min(3, "ID number must be at least 3 characters")
        .max(50, "ID number must be less than 50 characters")
        .regex(/^[a-zA-Z0-9\-]+$/, "Invalid ID number format"),
      issuingCountry: z
        .string()
        .length(2, "Must be 2-letter country code")
        .or(z.string().length(3, "Must be 3-letter country code"))
        .transform((val) => val.toUpperCase()),
      expirationDate: z.date({
        required_error: "Expiration date is required",
      }),
    }),
    contactInfo: z.object({
      phone: z.string().min(1, "Phone number is required"),
      alternatePhone: z.string().optional(),
      primaryAddress: z.object({
        street: z.string().min(1, "Street is required"),
        city: z.string().min(1, "City is required"),
        // state: z.string().min(1, "State is required"),
        postalCode: z.string().min(1, "Postal code is required"),
        country: z.string().min(1, "Country is required"),
      }),
      billingAddress: z.object({
        street: z.string().min(1, "Street is required"),
        city: z.string().min(1, "City is required"),
        // state: z.string().min(1, "State is required"),
        postalCode: z.string().min(1, "Postal code is required"),
        country: z.string().min(1, "Country is required"),
      }),
    }),
  }),
  // policyId: z.string(),
  policyNumber: z.string(),
  // product: z.string().min(1, "Product is required"),
  coveragePeriod: z.object({
    effectiveDate: z.date({ required_error: "Effective date is required" }),
    expirationDate: z.date().optional(),
  }),
  premium: z
    .object({
      amount: z.string().optional(),
      currency: z.string().optional(),
    })
    .optional(),

  status: z.string().optional(),
  beneficiaries: z
    .array(
      z.object({
        name: z.string().min(1, "Name required"),
        relationship: z.string().min(1, "Relationship required"),
        dateOfBirth: z.date({ required_error: "Date of birth is required" }),
        // taxCountry: z.string().min(1, "Country required"),
        // taxIdentifier: z.string().min(1, "Tax ID required"),
      })
    )
    .optional(),
});

type FormValues = z.infer<typeof formSchema>;

export function CustomerProductForm() {
  const { productId } = useParams();
  const { data: policy } = useGetProductDetailsQuery(Number(productId));
  const { data: currentUser } = useGetCurrenttUserQuery();
  const [sameAsPrimary, setSameAsPrimary] = useState(false);
  const [buyInsurance, { isLoading }] = useBuyPolicyMutation();

  // Determine insurance type
  const insuranceType = policy?.productType;

  console.log("Policy ", policy);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      // Risk factors
      vehicleValue: undefined,
      drivingExperience: undefined,
      healthCondition: undefined,
      propertyValue: undefined,
      propertyLocation: undefined,
      paymentFrequency: "MONTHLY",

      customer: {
        userId: "",

        governmentId: {
          idType: undefined,
          idNumber: "",
          issuingCountry: "",
          expirationDate: undefined,
        },
        contactInfo: {
          phone: "",
          alternatePhone: "",
          primaryAddress: {
            street: "",
            city: "",
            // state: "",
            postalCode: "",
            country: "",
          },
          billingAddress: {
            street: "",
            city: "",
            // state: "",
            postalCode: "",
            country: "",
          },
        },
      },
      // policyId: "",
      policyNumber: "",
      // product: "",
      coveragePeriod: {
        effectiveDate: undefined,
        // expirationDate: undefined,
      },
      premium: {
        amount: "0.00",
        currency: "DKK",
      },
      // status: "DRAFT",
      beneficiaries: [],
    },
  });

  useEffect(() => {
    if (sameAsPrimary) {
      const primaryAddress = form.getValues(
        "customer.contactInfo.primaryAddress"
      );

      form.setValue("customer.contactInfo.billingAddress", primaryAddress);
      form.clearErrors("customer.contactInfo.billingAddress");
    }
  }, [sameAsPrimary, form]);

  const onSubmit = async (data: FormValues) => {
    console.log("Form submitted:", data);

    try {
      // Calculate expiration date: 1 year from effective date
      const effectiveDate = data.coveragePeriod.effectiveDate;
      const expirationDate = new Date(effectiveDate);
      expirationDate.setFullYear(expirationDate.getFullYear() + 1);

      // Prepare payload
      const payload = {
        ...data,
        // userId: currentUser?.data?.user.userId,
        coveragePeriod: {
          effectiveDate: data.coveragePeriod.effectiveDate,
          expirationDate, // Calculated expiration date
        },
        status: "DRAFT",
        // Add risk factors based on insurance type
        ...(insuranceType === "AUTO" && {
          vehicleValue: data.vehicleValue,
          drivingExperience: data.drivingExperience,
        }),
        ...(insuranceType === "LIFE" && {
          healthCondition: data.healthCondition,
        }),
        ...(insuranceType === "PROPERTY" && {
          propertyValue: data.propertyValue,
          propertyLocation: data.propertyLocation,
        }),

        beneficiaries: (data?.beneficiaries || [])?.map((beneficiary) => ({
          ...beneficiary,

          // Convert dates to ISO strings for backend
          dateOfBirth: beneficiary.dateOfBirth,
        })),
      };

      // Convert dates to ISO strings
      const customerData = {
        ...data.customer,
        userId: currentUser?.data?.user.userId,
        // dateOfBirth: data.customer.dateOfBirth,
        // dateOfBirth: data.customer.dateOfBirth.toISOString(),
        governmentId: {
          ...data.customer.governmentId,
          expirationDate: data.customer.governmentId.expirationDate,
          // data.customer.governmentId.expirationDate.toISOString(),
        },
      };

      // Submit to backend
      const result = await buyInsurance({
        ...payload,
        customer: customerData,
        productId,
      }).unwrap();

      console.log(result);

      // Handle success
      console.log("Policy created successfully:", result);

      // Reset form after successful submission
      form.reset();
    } catch (error) {
      console.log("Buying policy error: ", error);
    }
  };

  // Handle billing address sync
  const handleBillingSyncChange = (checked: boolean) => {
    setSameAsPrimary(checked);
    if (checked) {
      const primaryAddress = form.getValues(
        "customer.contactInfo.primaryAddress"
      );
      form.setValue("customer.contactInfo.billingAddress", primaryAddress);

      // Clear billing address errors
      form.clearErrors("customer.contactInfo.billingAddress");

      // Trigger validation for billing fields
      addressKeys.forEach((key) => {
        form.trigger(`customer.contactInfo.billingAddress.${key}` as any);
      });
    }
  };

  const removeBeneficiary = (index: number) => {
    const beneficiaries = form.getValues("beneficiaries") || [];
    form.setValue(
      "beneficiaries",
      beneficiaries?.filter((_, i) => i !== index)
    );
  };

  if (isLoading)
    return (
      <div className=" flex justify-center items-center ext-center mt-5 mx-auto">
        <Spinner />
      </div>
    );

  return (
    <div className="  p-3 max-w-5xl m-auto my-5 rounded-2xl shadow-2xl">
      {/* {insuranceType && (
        <PremiumCaculator
          insuranceType={insuranceType}
          productId={Number(productId)}
        />
      )} */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 p-6">
          <p className="text-xl font-semibold underline mb-4 text-center text-blue-500">
            Customer Information
          </p>

          {/* Customer Information */}
          {/* Risk Factors Section - Conditionally shown based on insurance type */}
          {insuranceType && (
            <div>
              <p className="text-xl font-semibold underline mb-4 text-center text-blue-500">
                Risk Factors
              </p>
              {insuranceType === "AUTO" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
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
                            onChange={(e) =>
                              field.onChange(parseFloat(e.target.value))
                            }
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
                              field.onChange(parseInt(e.target.value))
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}
              {insuranceType === "LIFE" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <FormField
                    control={form.control}
                    name="healthCondition"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Health Condition</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <FormControl className="bg-white">
                            <SelectTrigger>
                              <SelectValue placeholder="Select health condition" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="EXCELLENT">Excellent</SelectItem>
                            <SelectItem value="GOOD">Good</SelectItem>
                            <SelectItem value="FAIR">Fair</SelectItem>
                            <SelectItem value="POOR">Poor</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}
              {insuranceType === "PROPERTY" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
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
                            onChange={(e) =>
                              field.onChange(parseFloat(e.target.value))
                            }
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
                      <FormItem>
                        <FormLabel>Property Location</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <FormControl className="bg-white">
                            <SelectTrigger>
                              <SelectValue placeholder="Select location risk" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="LOW_RISK">
                              Low Risk Area
                            </SelectItem>
                            <SelectItem value="MEDIUM_RISK">
                              Medium Risk Area
                            </SelectItem>
                            <SelectItem value="HIGH_RISK">
                              High Risk Area
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}

              <FormField
                control={form.control}
                name="paymentFrequency"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Payment Frequency</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl className="bg-white">
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
                  </FormItem>
                )}
              />
            </div>
          )}

          <div>
            {/* <Separator className="max-w-40 bg-black  m-auto mt-4" /> */}
            {/* Policy Information */}
            <div className="my-5 ">
              <p className="text-xl font-semibold underline mb-4 text-center text-blue-500">
                Policy Information
              </p>

              {/* Product */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <FormField
                  control={form.control}
                  name="policyNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Policy Number</FormLabel>
                      <FormControl>
                        <Input
                          className="bg-white"
                          placeholder="Product ID or Name"
                          {...field}
                          readOnly
                          value={policy?.policyNumber}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Coverage Period */}
                {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4"> */}
                <FormField
                  control={form.control}
                  name="coveragePeriod.effectiveDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col ">
                      <FormLabel>Effective Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl className="bg-white">
                            <Button variant="outline">
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) => date < new Date()}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            {/* Government ID */}
            <div className="my-5">
              <p className="text-xl font-semibold underline mb-4 text-center text-blue-500  ">
                Government ID
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="customer.governmentId.idType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>ID Type</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl className="bg-white w-full">
                          <SelectTrigger>
                            <SelectValue placeholder="Select ID type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {idTypeOptions.map((type) => (
                            <SelectItem key={type} value={type}>
                              {type.replace(/_/g, " ")}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="customer.governmentId.idNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>ID Number</FormLabel>
                      <FormControl>
                        <Input
                          className="bg-white"
                          placeholder="ID Number"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="customer.governmentId.issuingCountry"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Issuing Country</FormLabel>
                      <FormControl>
                        <Input
                          className="bg-white"
                          placeholder="e.g., US, DK"
                          {...field}
                          onChange={(e) =>
                            field.onChange(e.target.value.toUpperCase())
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="customer.governmentId.expirationDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Expiration Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl className="bg-white">
                            <Button variant="outline">
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) => date < new Date()}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Contact Information */}
            <div className="mb-6">
              <p className="text-xl font-semibold underline mb-4 text-center text-blue-500">
                Contact Information
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <FormField
                  control={form.control}
                  name="customer.contactInfo.phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone</FormLabel>
                      <FormControl>
                        <Input
                          className="bg-white"
                          placeholder="+45 12 34 56 78"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="customer.contactInfo.alternatePhone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Alternate Phone</FormLabel>
                      <FormControl>
                        <Input
                          className="bg-white"
                          placeholder="+45 98 76 54 32"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* <Separator className="max-w-40 bg-black  m-auto mt-4" /> */}

              {/* Primary Address */}
              <div className="my-5">
                <p className="text-md font-semibold  mb-4 text-center text-black">
                  Primary Address
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {addressKeys.map((key) => (
                    <FormField
                      key={key}
                      control={form.control}
                      name={
                        `customer.contactInfo.primaryAddress.${key}` as const
                      } // Type-cast here
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            {key.charAt(0).toUpperCase() + key.slice(1)}
                          </FormLabel>
                          <FormControl>
                            <Input
                              className="bg-white"
                              placeholder={
                                key === "street"
                                  ? "street"
                                  : key === "city"
                                  ? "city"
                                  : // : key === "state"
                                  // ? "state"
                                  key === "postalCode"
                                  ? "12345"
                                  : key === "country"
                                  ? "e.g., Denmark"
                                  : ""
                              }
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  ))}
                </div>
              </div>

              {/* Billing Address */}
              <div className="mb-4">
                <div className="flex items-center mb-4 gap-1.5 text-green-700">
                  <Checkbox
                    id="sameAsPrimary"
                    checked={sameAsPrimary}
                    onCheckedChange={handleBillingSyncChange}
                  />
                  <label
                    htmlFor="sameAsPrimary"
                    className="ml-2 text-sm font-medium leading-none"
                  >
                    Same as primary address
                  </label>
                </div>

                {/* Billing Address */}
                {!sameAsPrimary && (
                  <div>
                    <p className="text-md font-semibold   mb-4 text-center text-black">
                      Billing Address
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {addressKeys.map((key) => (
                        <FormField
                          key={key}
                          control={form.control}
                          name={
                            `customer.contactInfo.billingAddress.${key}` as const
                          } // Type-cast here
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>
                                {key.charAt(0).toUpperCase() + key.slice(1)}
                              </FormLabel>
                              <FormControl>
                                <Input
                                  className="bg-white"
                                  placeholder={
                                    key === "street"
                                      ? "street"
                                      : key === "city"
                                      ? "city"
                                      : // : key === "state"
                                      // ? "state"
                                      key === "postalCode"
                                      ? "12345"
                                      : key === "country"
                                      ? "e.g., Denmark"
                                      : ""
                                  }
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Beneficiaries */}
          {policy?.productType === "LIFE" && (
            <div>
              <div className="flex justify-between items-center">
                <p className="text-xl font-semibold underline mb-4 w-full text-center text-blue-500">
                  Beneficiaries
                </p>
              </div>

              {(form.watch("beneficiaries") || [])?.length === 0 && (
                <div className="text-gray-500 text-center py-4">
                  No beneficiaries added yet
                </div>
              )}
              {(form.watch("beneficiaries") || [])?.map(
                (beneficiary, index) => (
                  <Collapsible
                    key={index}
                    className="mb-4 border rounded-lg p-4"
                  >
                    <div className="flex justify-between items-center">
                      <div className="flex-grow">
                        {" "}
                        {/* Add this wrapper */}
                        <CollapsibleTrigger asChild>
                          <Button
                            variant="ghost"
                            className="w-full justify-between"
                          >
                            <div className="text-left">
                              <h4 className="font-medium">
                                {beneficiary.name || `Beneficiary ${index + 1}`}
                              </h4>
                              {beneficiary.relationship && (
                                <span className="text-sm text-gray-500 capitalize">
                                  {beneficiary.relationship
                                    .toLowerCase()
                                    .replace("_", " ")}
                                </span>
                              )}
                            </div>
                            <ChevronDownIcon className="h-4 w-4" />
                          </Button>
                        </CollapsibleTrigger>
                      </div>

                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        onClick={() => removeBeneficiary(index)}
                        className="ml-4 flex-shrink-0 border" // Add flex-shrink-0
                      >
                        <Trash2 className="h-4 w-4 text-red-500 " />
                      </Button>
                    </div>

                    <CollapsibleContent className="pt-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <FormField
                          control={form.control}
                          name={`beneficiaries.${index}.name`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Full Name</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Thomas Pedersen"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name={`beneficiaries.${index}.relationship`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Relationship</FormLabel>
                              <Select
                                onValueChange={field.onChange}
                                value={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select relationship" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="SPOUSE">Spouse</SelectItem>
                                  <SelectItem value="CHILD">Child</SelectItem>
                                  <SelectItem value="PARENT">Parent</SelectItem>
                                  <SelectItem value="SIBLING">
                                    Sibling
                                  </SelectItem>
                                  <SelectItem value="BUSINESS_PARTNER">
                                    Business Partner
                                  </SelectItem>
                                  <SelectItem value="OTHER">Other</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name={`beneficiaries.${index}.dateOfBirth`}
                          render={({ field }) => (
                            <FormItem className="flex flex-col">
                              <FormLabel>Date of birth</FormLabel>
                              <Popover>
                                <PopoverTrigger asChild>
                                  <FormControl>
                                    <Button variant="outline">
                                      {field.value ? (
                                        format(field.value, "PPP")
                                      ) : (
                                        <span>Pick a date</span>
                                      )}
                                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                    </Button>
                                  </FormControl>
                                </PopoverTrigger>
                                <PopoverContent
                                  className="w-auto p-0"
                                  align="start"
                                >
                                  <Calendar
                                    mode="single"
                                    selected={field.value}
                                    onSelect={field.onChange}
                                    disabled={(date) =>
                                      date > new Date() ||
                                      date < new Date("1900-01-01")
                                    }
                                    initialFocus
                                  />
                                </PopoverContent>
                              </Popover>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        {/* <FormField
                          control={form.control}
                          name={`beneficiaries.${index}.taxCountry`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Country</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="e.g., DK, SE, NO"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name={`beneficiaries.${index}.taxIdentifier`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Tax ID</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Tax identifier"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        /> */}
                      </div>
                    </CollapsibleContent>
                  </Collapsible>
                )
              )}
              <Button
                type="button"
                variant="secondary"
                className="text-white"
                onClick={() => {
                  const currentBeneficiaries =
                    form.getValues("beneficiaries") || [];
                  form.setValue("beneficiaries", [
                    ...currentBeneficiaries,
                    // ...form.watch("beneficiaries"),
                    {
                      name: "",
                      relationship: "",
                      dateOfBirth: new Date(),
                      // taxCountry: "",
                      // taxIdentifier: "",
                    },
                  ]);
                }}
              >
                Add Beneficiary
              </Button>
            </div>
          )}
          <div className=" w-full flex justify-end mt-4">
            <Button type="submit" className="w-full md:w-auto  text-white">
              Buy Policy
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
