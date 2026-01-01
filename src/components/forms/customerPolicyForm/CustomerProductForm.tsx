import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  CalendarIcon,
  Plus,
  Shield,
  User,
  CreditCard,
  Heart,
  Smartphone,
  MapPin,
  Car,
  Home,
  AlertCircle,
} from "lucide-react";
import { format } from "date-fns";
import { useEffect, useState } from "react";

import { Trash2, X, Edit2, Save } from "lucide-react";

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
import { useParams } from "react-router-dom";
import { useBuyPolicyMutation } from "@/services/InsurancePolicySlice";
import { cn } from "@/lib/utils";
import { Alert, AlertDescription } from "@/components/ui/alert";

const addressKeys = ["street", "city", "postalCode", "country"] as const;

// Form Schema with Customer entity
const idTypeOptions = [
  "PASSPORT",
  "DRIVERS_LICENSE",
  "NATIONAL_ID",

  "RESIDENCE_PERMIT",
] as const;

const formSchema = z.object({
  vehicleValue: z.number().optional(),
  drivingExperience: z.number().optional(),
  healthCondition: z.string().optional(),
  propertyValue: z.number().optional(),
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
        postalCode: z.string().min(1, "Postal code is required"),
        country: z.string().min(1, "Country is required"),
      }),
      billingAddress: z.object({
        street: z.string().min(1, "Street is required"),
        city: z.string().min(1, "City is required"),
        postalCode: z.string().min(1, "Postal code is required"),
        country: z.string().min(1, "Country is required"),
      }),
    }),
  }),
  policyNumber: z.string(),
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
  const [activeSection, setActiveSection] = useState("personal");
  const [progress, setProgress] = useState(25);
  const [editingBeneficiary, setEditingBeneficiary] = useState<number | null>(
    null
  );
  const [newBeneficiary, setNewBeneficiary] = useState<boolean>(false);
  const [sectionErrors, setSectionErrors] = useState<string[]>([]);

  // Determine insurance type
  const insuranceType = policy?.productType;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
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
            postalCode: "",
            country: "",
          },
          billingAddress: {
            street: "",
            city: "",
            postalCode: "",
            country: "",
          },
        },
      },
      policyNumber: "",
      coveragePeriod: {
        effectiveDate: undefined,
      },
      premium: {
        amount: "0.00",
        currency: "DKK",
      },
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

  // useEffect(() => {
  //   const values = form.getValues();
  //   let filledFields = 0;
  //   let totalFields = 0;

  //   Object.entries(values).forEach(([key, value]) => {
  //     if (value && typeof value === "object") {
  //       Object.entries(value).forEach(([subKey, subValue]) => {
  //         totalFields++;
  //         if (subValue) filledFields++;
  //       });
  //     } else {
  //       totalFields++;
  //       if (value) filledFields++;
  //     }
  //   });

  //   const progressPercentage = (filledFields / totalFields) * 100;
  //   setProgress(Math.min(progressPercentage, 100));
  // }, [form.watch()]);

  const onSubmit = async (data: FormValues) => {
    console.log("Form submitted:", data);

    try {
      const effectiveDate = data.coveragePeriod.effectiveDate;
      const expirationDate = new Date(effectiveDate);
      expirationDate.setFullYear(expirationDate.getFullYear() + 1);

      const payload = {
        ...data,
        coveragePeriod: {
          effectiveDate: data.coveragePeriod.effectiveDate,
          expirationDate,
        },
        status: "DRAFT",
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
          dateOfBirth: beneficiary.dateOfBirth,
        })),
      };

      const customerData = {
        ...data.customer,
        userId: currentUser?.data?.user.userId,
        governmentId: {
          ...data.customer.governmentId,
          expirationDate: data.customer.governmentId.expirationDate,
        },
      };

      const result = await buyInsurance({
        ...payload,
        customer: customerData,
        productId,
      }).unwrap();

      console.log("Policy created successfully:", result);
      form.reset();
      setActiveSection("personal");
      setProgress(25);
    } catch (error) {
      console.log("Buying policy error: ", error);
    }
  };

  const handleBillingSyncChange = (checked: boolean) => {
    setSameAsPrimary(checked);
    if (checked) {
      const primaryAddress = form.getValues(
        "customer.contactInfo.primaryAddress"
      );
      form.setValue("customer.contactInfo.billingAddress", primaryAddress);
      form.clearErrors("customer.contactInfo.billingAddress");
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
    if (editingBeneficiary === index) {
      setEditingBeneficiary(null);
    }
  };

  const addBeneficiary = () => {
    const currentBeneficiaries = form.getValues("beneficiaries") || [];
    form.setValue("beneficiaries", [
      ...currentBeneficiaries,
      {
        name: "",
        relationship: "",
        dateOfBirth: new Date(),
      },
    ]);
    setEditingBeneficiary(currentBeneficiaries.length);
    setNewBeneficiary(true);
  };

  const saveBeneficiary = (index: number) => {
    // Trigger validation for this specific beneficiary
    form.trigger(`beneficiaries.${index}.name`);
    form.trigger(`beneficiaries.${index}.relationship`);
    form.trigger(`beneficiaries.${index}.dateOfBirth`);

    const beneficiaries = form.getValues("beneficiaries") || [];
    const beneficiary = beneficiaries[index];

    if (
      beneficiary.name &&
      beneficiary.relationship &&
      beneficiary.dateOfBirth
    ) {
      setEditingBeneficiary(null);
      setNewBeneficiary(false);
    }
  };

  // Function to validate current section before moving to next
  const validateAndMoveToNext = async (nextSection: string) => {
    setSectionErrors([]);

    let fieldsToValidate: string[] = [];
    let errors: string[] = [];

    switch (activeSection) {
      case "personal":
        fieldsToValidate = [
          "customer.governmentId.idType",
          "customer.governmentId.idNumber",
          "customer.governmentId.issuingCountry",
          "customer.governmentId.expirationDate",
        ];
        break;

      case "risk":
        if (insuranceType === "AUTO") {
          fieldsToValidate = [
            "vehicleValue",
            "drivingExperience",
            "paymentFrequency",
          ];
        } else if (insuranceType === "LIFE") {
          fieldsToValidate = ["healthCondition", "paymentFrequency"];
        } else if (insuranceType === "PROPERTY") {
          fieldsToValidate = [
            "propertyValue",
            "propertyLocation",
            "paymentFrequency",
          ];
        } else {
          fieldsToValidate = ["paymentFrequency"];
        }
        break;

      case "contact":
        fieldsToValidate = [
          "customer.contactInfo.phone",
          "customer.contactInfo.primaryAddress.street",
          "customer.contactInfo.primaryAddress.city",
          "customer.contactInfo.primaryAddress.postalCode",
          "customer.contactInfo.primaryAddress.country",
        ];

        if (!sameAsPrimary) {
          fieldsToValidate.push(
            "customer.contactInfo.billingAddress.street",
            "customer.contactInfo.billingAddress.city",
            "customer.contactInfo.billingAddress.postalCode",
            "customer.contactInfo.billingAddress.country"
          );
        }
        break;

      case "policy":
        fieldsToValidate = ["coveragePeriod.effectiveDate"];
        break;

      case "beneficiaries":
        if (policy?.productType === "LIFE") {
          const beneficiaries = form.getValues("beneficiaries") || [];
          if (beneficiaries.length === 0) {
            errors.push(
              "At least one beneficiary is required for life insurance"
            );
          } else {
            beneficiaries.forEach((_, index) => {
              fieldsToValidate.push(
                `beneficiaries.${index}.name`,
                `beneficiaries.${index}.relationship`,
                `beneficiaries.${index}.dateOfBirth`
              );
            });
          }
        }
        break;
    }

    // Validate all fields
    if (fieldsToValidate.length > 0) {
      const result = await form.trigger(fieldsToValidate as any);

      if (!result) {
        // Get specific errors for this section
        const formErrors = form.formState.errors;
        const sectionErrorFields = fieldsToValidate.filter((field) => {
          const fieldPath = field.split(".");
          let current: any = formErrors;
          for (const key of fieldPath) {
            if (current && current[key]) {
              current = current[key];
            } else {
              return false;
            }
          }
          return current && current.message;
        });

        if (sectionErrorFields.length > 0) {
          errors.push(
            `Please complete all required fields in the ${activeSection} section`
          );
        }
      }
    }

    if (errors.length > 0) {
      setSectionErrors(errors);

      // Scroll to top of form to show errors
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });

      return false;
    }

    // If no errors, move to next section
    setActiveSection(nextSection);
    return true;
  };

  const navigationSections = [
    {
      id: "personal",
      label: "Personal Info",
      icon: <User className="w-4 h-4" />,
    },
    {
      id: "risk",
      label: "Risk Assessment",
      icon:
        insuranceType === "AUTO" ? (
          <Car className="w-4 h-4" />
        ) : insuranceType === "LIFE" ? (
          <Heart className="w-4 h-4" />
        ) : (
          <Home className="w-4 h-4" />
        ),
    },
    {
      id: "contact",
      label: "Contact Details",
      icon: <Smartphone className="w-4 h-4" />,
    },
    {
      id: "policy",
      label: "Policy Details",
      icon: <Shield className="w-4 h-4" />,
    },
    ...(policy?.productType === "LIFE"
      ? [
          {
            id: "beneficiaries",
            label: "Beneficiaries",
            icon: <Heart className="w-4 h-4" />,
          },
        ]
      : []),
  ];

  // Add these section-specific completion check functions
  const isPersonalSectionComplete = () => {
    const values = form.getValues();
    return (
      values.customer.governmentId.idType &&
      values.customer.governmentId.idNumber &&
      values.customer.governmentId.issuingCountry &&
      values.customer.governmentId.expirationDate
    );
  };

  const isRiskSectionComplete = () => {
    const values = form.getValues();
    if (insuranceType === "AUTO") {
      return (
        values.vehicleValue &&
        values.drivingExperience &&
        values.paymentFrequency
      );
    } else if (insuranceType === "LIFE") {
      return values.healthCondition && values.paymentFrequency;
    } else if (insuranceType === "PROPERTY") {
      return (
        values.propertyValue &&
        values.propertyLocation &&
        values.paymentFrequency
      );
    }
    return !!values.paymentFrequency;
  };

  const isContactSectionComplete = () => {
    const values = form.getValues();
    const primaryComplete =
      values.customer.contactInfo.phone &&
      values.customer.contactInfo.primaryAddress.street &&
      values.customer.contactInfo.primaryAddress.city &&
      values.customer.contactInfo.primaryAddress.postalCode &&
      values.customer.contactInfo.primaryAddress.country;

    if (sameAsPrimary) {
      return primaryComplete;
    }

    const billingComplete =
      values.customer.contactInfo.billingAddress.street &&
      values.customer.contactInfo.billingAddress.city &&
      values.customer.contactInfo.billingAddress.postalCode &&
      values.customer.contactInfo.billingAddress.country;

    return primaryComplete && billingComplete;
  };

  const isPolicySectionComplete = () => {
    const values = form.getValues();
    return !!values.coveragePeriod.effectiveDate;
  };

  const isBeneficiariesSectionComplete = () => {
    const values = form.getValues();
    const beneficiaries = values.beneficiaries || [];
    if (policy?.productType !== "LIFE") return true; // Not required for non-life insurance

    if (beneficiaries.length === 0) return false;
    return beneficiaries.every(
      (b) => b.name && b.relationship && b.dateOfBirth
    );
  };

  // Function to check if current section is complete
  const isSectionComplete = () => {
    const values = form.getValues();

    switch (activeSection) {
      case "personal":
        return (
          values.customer.governmentId.idType &&
          values.customer.governmentId.idNumber &&
          values.customer.governmentId.issuingCountry &&
          values.customer.governmentId.expirationDate
        );

      case "risk":
        if (insuranceType === "AUTO") {
          return (
            values.vehicleValue &&
            values.drivingExperience &&
            values.paymentFrequency
          );
        } else if (insuranceType === "LIFE") {
          return values.healthCondition && values.paymentFrequency;
        } else if (insuranceType === "PROPERTY") {
          return (
            values.propertyValue &&
            values.propertyLocation &&
            values.paymentFrequency
          );
        }
        return !!values.paymentFrequency;

      case "contact":
        const primaryComplete =
          values.customer.contactInfo.phone &&
          values.customer.contactInfo.primaryAddress.street &&
          values.customer.contactInfo.primaryAddress.city &&
          values.customer.contactInfo.primaryAddress.postalCode &&
          values.customer.contactInfo.primaryAddress.country;

        if (sameAsPrimary) {
          return primaryComplete;
        }

        const billingComplete =
          values.customer.contactInfo.billingAddress.street &&
          values.customer.contactInfo.billingAddress.city &&
          values.customer.contactInfo.billingAddress.postalCode &&
          values.customer.contactInfo.billingAddress.country;

        return primaryComplete && billingComplete;

      case "policy":
        return !!values.coveragePeriod.effectiveDate;

      case "beneficiaries":
        const beneficiaries = values.beneficiaries || [];
        if (beneficiaries.length === 0) return false;
        return beneficiaries.every(
          (b) => b.name && b.relationship && b.dateOfBirth
        );

      default:
        return false;
    }
  };

  // Progress calculation
  useEffect(() => {
    let progressPercentage = 0;
    const sectionsCount = navigationSections.length;

    // Count completed sections
    const completedSections = [
      isPersonalSectionComplete(),
      isRiskSectionComplete(),
      isContactSectionComplete(),
      isPolicySectionComplete(),
      ...(policy?.productType === "LIFE"
        ? [isBeneficiariesSectionComplete()]
        : []),
    ].filter(Boolean).length;

    // Calculate progress based on completed sections
    progressPercentage = (completedSections / sectionsCount) * 100;
    setProgress(progressPercentage);
  }, [
    form.watch(),
    isPersonalSectionComplete(),
    isRiskSectionComplete(),
    isContactSectionComplete(),
    isPolicySectionComplete(),
    isBeneficiariesSectionComplete(),
    policy?.productType,
  ]);

  // Helper function to get status text for any section
  const getSectionStatus = (sectionId: string) => {
    switch (sectionId) {
      case "personal":
        return isPersonalSectionComplete() ? "✓ Complete" : "Required";
      case "risk":
        return isRiskSectionComplete() ? "✓ Complete" : "Required";
      case "contact":
        return isContactSectionComplete() ? "✓ Complete" : "Required";
      case "policy":
        return isPolicySectionComplete() ? "✓ Complete" : "Required";
      case "beneficiaries":
        return isBeneficiariesSectionComplete() ? "✓ Complete" : "Required";
      default:
        return "Required";
    }
  };

  // Helper function to get status color for any section
  const getSectionStatusColor = (sectionId: string) => {
    switch (sectionId) {
      case "personal":
        return isPersonalSectionComplete() ? "text-green-600" : "text-gray-400";
      case "risk":
        return isRiskSectionComplete() ? "text-green-600" : "text-gray-400";
      case "contact":
        return isContactSectionComplete() ? "text-green-600" : "text-gray-400";
      case "policy":
        return isPolicySectionComplete() ? "text-green-600" : "text-gray-400";
      case "beneficiaries":
        return isBeneficiariesSectionComplete()
          ? "text-green-600"
          : "text-gray-400";
      default:
        return "text-gray-400";
    }
  };
  if (isLoading)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-lg font-medium text-gray-700">
            Processing your policy...
          </p>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 bg-blue-500 rounded-2xl shadow-lg mb-4 animate-pulse">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text mb-2 animate-fade-in">
            {policy?.displayName}
          </h1>
          <p className="text-gray-600 animate-fade-in animation-delay-100">
            Complete your application in just a few minutes
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-10">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">
              Application Progress
            </span>
            <span className="text-sm font-bold text-blue-600">
              {Math.round(progress)}%
            </span>
          </div>
          <div className="h-3 bg-gray-200 rounded-full overflow-hidden relative">
            {/* Background bar - always gray */}
            <div className="absolute inset-0 bg-gray-200 rounded-full"></div>

            {/* Progress bar - colored part */}
            <div
              className="h-full bg-linear-to-r from-blue-500 to-indigo-600 rounded-full transition-all duration-500 ease-out relative z-10"
              style={{
                width: `${progress}%`,
                minWidth: "0.5rem", // Ensure it's visible even at 0%
              }}
            />
          </div>

          {/* Optional: Add a label showing completed sections */}
          <div className="text-xs text-gray-500 mt-1 text-center">
            {Math.round(progress) === 100
              ? "All sections completed!"
              : `${Math.round(
                  (progress / 100) * navigationSections.length
                )} of ${navigationSections.length} sections completed`}
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Navigation Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-8 transition-all duration-300 hover:shadow-xl">
              <h3 className="text-lg font-semibold text-gray-800 mb-6">
                Application Steps
              </h3>

              <nav className="space-y-2">
                {navigationSections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                      activeSection === section.id
                        ? "bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 text-blue-600 shadow-sm"
                        : "text-gray-600 hover:bg-gray-50 hover:translate-x-1"
                    }`}
                  >
                    <div
                      className={`p-2 rounded-lg transition-all duration-200 ${
                        activeSection === section.id
                          ? "bg-gradient-to-br from-blue-500 to-indigo-500 text-white shadow-sm"
                          : getSectionStatus(section.id).includes("Complete")
                          ? "bg-gradient-to-br from-green-500 to-emerald-500 text-white"
                          : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {section.icon}
                    </div>
                    <div className="flex flex-col items-start">
                      <span className="font-medium">{section.label}</span>
                      <span
                        className={`text-xs mt-1 ${getSectionStatusColor(
                          section.id
                        )}`}
                      >
                        {getSectionStatus(section.id)}
                      </span>
                    </div>
                  </button>
                ))}
              </nav>
              {/* Quick Info Card */}
              <div className="mt-8 p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-100 transition-all duration-300 hover:border-blue-200">
                <h4 className="font-semibold text-gray-800 mb-2">Need Help?</h4>
                <p className="text-sm text-gray-600 mb-3">
                  Our team is available 24/7 to assist you.
                </p>
                <div className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 transition-colors">
                  <Smartphone className="w-4 h-4" />
                  <span>+45 12 34 56 78</span>
                </div>
              </div>
            </div>
          </div>

          {/* Main Form Content */}
          <div className="lg:col-span-3">
            {/* Section Errors Alert */}
            {sectionErrors.length > 0 && (
              <Alert variant="destructive" className="mb-6 animate-fade-in">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  <ul className="list-disc list-inside space-y-1">
                    {sectionErrors.map((error, index) => (
                      <li key={index}>{error}</li>
                    ))}
                  </ul>
                </AlertDescription>
              </Alert>
            )}

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-8"
              >
                {/* Personal Information Section */}
                {activeSection === "personal" && (
                  <div className="bg-white rounded-2xl shadow-lg p-8 animate-fade-in">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-3">
                        <div className="p-3 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-xl">
                          <User className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                          <h2 className="text-2xl font-bold text-gray-800">
                            Personal Information
                          </h2>
                          <p className="text-gray-600">
                            Tell us about yourself and your identification
                          </p>
                        </div>
                      </div>
                      {/* {isSectionComplete() && (
                        <div className="flex items-center gap-2 text-sm text-green-600 bg-green-50 px-3 py-1 rounded-full">
                          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                          Ready to proceed
                        </div>
                      )} */}
                      {isPersonalSectionComplete() && (
                        <div className="flex items-center gap-2 text-sm text-green-600 bg-green-50 px-3 py-1 rounded-full">
                          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                          Ready to proceed
                        </div>
                      )}
                    </div>

                    <div className="space-y-8">
                      {/* Government ID Section */}
                      <div className="border-l-4 border-blue-500 pl-6">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">
                          Government ID
                        </h3>
                        <div className="grid md:grid-cols-2 gap-6">
                          <FormField
                            control={form.control}
                            name="customer.governmentId.idType"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-sm font-medium text-gray-700">
                                  ID Type{" "}
                                  <span className="text-red-500">*</span>
                                </FormLabel>
                                <Select
                                  onValueChange={field.onChange}
                                  value={field.value}
                                >
                                  <FormControl>
                                    <SelectTrigger className="h-12 bg-gray-50 border-gray-200 hover:bg-gray-100 transition-colors focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50">
                                      <SelectValue placeholder="Select ID type" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent className="animate-slide-down bg-white">
                                    {idTypeOptions.map((type) => (
                                      <SelectItem
                                        key={type}
                                        value={type}
                                        className="hover:bg-gray-50 transition-colors"
                                      >
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
                                <FormLabel className="text-sm font-medium text-gray-700">
                                  ID Number{" "}
                                  <span className="text-red-500">*</span>
                                </FormLabel>
                                <FormControl>
                                  <Input
                                    className="h-12 bg-gray-50 border-gray-200 hover:bg-gray-100 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-all duration-200"
                                    placeholder="Enter your ID number"
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
                                <FormLabel className="text-sm font-medium text-gray-700">
                                  Issuing Country{" "}
                                  <span className="text-red-500">*</span>
                                </FormLabel>
                                <FormControl>
                                  <Input
                                    className="h-12 bg-gray-50 border-gray-200 hover:bg-gray-100 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-all duration-200"
                                    placeholder="e.g., DK, US, GB"
                                    {...field}
                                    onChange={(e) =>
                                      field.onChange(
                                        e.target.value.toUpperCase()
                                      )
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
                              <FormItem className="flex flex-col bg-white">
                                <FormLabel className="text-sm font-medium text-gray-700">
                                  Expiration Date{" "}
                                  <span className="text-red-500">*</span>
                                </FormLabel>
                                <Popover>
                                  <PopoverTrigger asChild>
                                    <FormControl>
                                      <Button
                                        variant="outline"
                                        className="h-12 bg-gray-50 border-gray-200 hover:bg-gray-100 hover:text-gray-900 justify-start text-left font-normal transition-all duration-200 mt-0 "
                                      >
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
                                    className="w-auto p-0 animate-slide-down bg-white"
                                    align="start"
                                  >
                                    <Calendar
                                      mode="single"
                                      selected={field.value}
                                      onSelect={field.onChange}
                                      disabled={(date) => date < new Date()}
                                      className="rounded-lg border shadow-lg"
                                    />
                                  </PopoverContent>
                                </Popover>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end mt-8 pt-6 border-t border-gray-100">
                      <Button
                        type="button"
                        variant="default"
                        className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 shadow-lg hover:shadow-blue-200 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                        onClick={() => validateAndMoveToNext("risk")}
                        disabled={!isSectionComplete()}
                      >
                        Next: Risk Assessment
                      </Button>
                    </div>
                  </div>
                )}

                {/* Risk Assessment Section */}
                {activeSection === "risk" && insuranceType && (
                  <div className="bg-white rounded-2xl shadow-lg p-8 animate-fade-in">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-3">
                        <div className="p-3 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-xl">
                          {insuranceType === "AUTO" ? (
                            <Car className="w-6 h-6 text-emerald-600" />
                          ) : insuranceType === "LIFE" ? (
                            <Heart className="w-6 h-6 text-emerald-600" />
                          ) : (
                            <Home className="w-6 h-6 text-emerald-600" />
                          )}
                        </div>
                        <div>
                          <h2 className="text-2xl font-bold text-gray-800">
                            Risk Assessment
                          </h2>
                          <p className="text-gray-600">
                            Customize your coverage based on your needs
                          </p>
                        </div>
                      </div>
                      {/* In Risk Assessment Section */}
                      {isRiskSectionComplete() && (
                        <div className="flex items-center gap-2 text-sm text-green-600 bg-green-50 px-3 py-1 rounded-full">
                          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                          Ready to proceed
                        </div>
                      )}
                      {/* {isSectionComplete() && (
                        <div className="flex items-center gap-2 text-sm text-green-600 bg-green-50 px-3 py-1 rounded-full">
                          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                          Ready to proceed
                        </div>
                      )} */}
                    </div>

                    <div className="space-y-8">
                      {insuranceType === "AUTO" && (
                        <div className="grid md:grid-cols-2 gap-6">
                          <FormField
                            control={form.control}
                            name="vehicleValue"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-sm font-medium text-gray-700">
                                  Vehicle Value (DKK){" "}
                                  <span className="text-red-500">*</span>
                                </FormLabel>
                                <div className="relative">
                                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                                    kr
                                  </span>
                                  <Input
                                    type="number"
                                    className="h-12 bg-gray-50 border-gray-200 hover:bg-gray-100 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500 focus:ring-opacity-50 pl-10 transition-all duration-200"
                                    placeholder="200,000"
                                    {...field}
                                    onChange={(e) =>
                                      field.onChange(parseFloat(e.target.value))
                                    }
                                  />
                                </div>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="drivingExperience"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-sm font-medium text-gray-700">
                                  Driving Experience (Years){" "}
                                  <span className="text-red-500">*</span>
                                </FormLabel>
                                <FormControl>
                                  <Input
                                    type="number"
                                    className="h-12 bg-gray-50 border-gray-200 hover:bg-gray-100 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500 focus:ring-opacity-50 transition-all duration-200"
                                    placeholder="5"
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
                        <div className="grid md:grid-cols-2 gap-6">
                          <FormField
                            control={form.control}
                            name="healthCondition"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-sm font-medium text-gray-700">
                                  Health Condition{" "}
                                  <span className="text-red-500">*</span>
                                </FormLabel>
                                <Select
                                  onValueChange={field.onChange}
                                  value={field.value}
                                >
                                  <FormControl>
                                    <SelectTrigger className="h-12 bg-gray-50 border-gray-200 hover:bg-gray-100 transition-colors focus:ring-2 focus:ring-emerald-500 focus:ring-opacity-50">
                                      <SelectValue placeholder="Select health condition" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent className="animate-slide-down bg-white">
                                    <SelectItem
                                      value="EXCELLENT"
                                      className="hover:bg-gray-50 transition-colors"
                                    >
                                      Excellent
                                    </SelectItem>
                                    <SelectItem
                                      value="GOOD"
                                      className="hover:bg-gray-50 transition-colors"
                                    >
                                      Good
                                    </SelectItem>
                                    <SelectItem
                                      value="FAIR"
                                      className="hover:bg-gray-50 transition-colors"
                                    >
                                      Fair
                                    </SelectItem>
                                    <SelectItem
                                      value="POOR"
                                      className="hover:bg-gray-50 transition-colors"
                                    >
                                      Poor
                                    </SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      )}

                      {insuranceType === "PROPERTY" && (
                        <div className="grid md:grid-cols-2 gap-6">
                          <FormField
                            control={form.control}
                            name="propertyValue"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-sm font-medium text-gray-700">
                                  Property Value (DKK){" "}
                                  <span className="text-red-500">*</span>
                                </FormLabel>
                                <div className="relative">
                                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                                    kr
                                  </span>
                                  <Input
                                    type="number"
                                    className="h-12 bg-gray-50 border-gray-200 hover:bg-gray-100 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500 focus:ring-opacity-50 pl-10 transition-all duration-200"
                                    placeholder="2,500,000"
                                    {...field}
                                    onChange={(e) =>
                                      field.onChange(parseFloat(e.target.value))
                                    }
                                  />
                                </div>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="propertyLocation"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-sm font-medium text-gray-700">
                                  Property Location Risk{" "}
                                  <span className="text-red-500">*</span>
                                </FormLabel>
                                <Select
                                  onValueChange={field.onChange}
                                  value={field.value}
                                >
                                  <FormControl>
                                    <SelectTrigger className="h-12 bg-gray-50 border-gray-200 hover:bg-gray-100 transition-colors focus:ring-2 focus:ring-emerald-500 focus:ring-opacity-50">
                                      <SelectValue placeholder="Select location risk" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent className="animate-slide-down">
                                    <SelectItem
                                      value="LOW_RISK"
                                      className="hover:bg-gray-50 transition-colors"
                                    >
                                      Low Risk Area
                                    </SelectItem>
                                    <SelectItem
                                      value="MEDIUM_RISK"
                                      className="hover:bg-gray-50 transition-colors"
                                    >
                                      Medium Risk Area
                                    </SelectItem>
                                    <SelectItem
                                      value="HIGH_RISK"
                                      className="hover:bg-gray-50 transition-colors"
                                    >
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
                            <FormLabel className="text-sm font-medium text-gray-700">
                              Payment Frequency{" "}
                              <span className="text-red-500">*</span>
                            </FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              value={field.value}
                            >
                              <FormControl>
                                <SelectTrigger className="h-12 bg-gray-50 border-gray-200 hover:bg-gray-100 transition-colors focus:ring-2 focus:ring-emerald-500 focus:ring-opacity-50">
                                  <SelectValue placeholder="Select payment frequency" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent className="animate-slide-down bg-white">
                                <SelectItem
                                  value="MONTHLY"
                                  className="hover:bg-gray-50 transition-colors"
                                >
                                  Monthly
                                </SelectItem>
                                <SelectItem
                                  value="QUARTERLY"
                                  className="hover:bg-gray-50 transition-colors"
                                >
                                  Quarterly
                                </SelectItem>
                                <SelectItem
                                  value="ANNUAL"
                                  className="hover:bg-gray-50 transition-colors"
                                >
                                  Annual
                                </SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="flex justify-between mt-8 pt-6 border-t border-gray-100">
                      <Button
                        type="button"
                        variant="outline"
                        className="border-gray-300 hover:bg-gray-50 transition-all duration-200 hover:border-emerald-300"
                        onClick={() => setActiveSection("personal")}
                      >
                        Back
                      </Button>
                      <Button
                        type="button"
                        variant="default"
                        className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 shadow-lg hover:shadow-emerald-200 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                        onClick={() => validateAndMoveToNext("contact")}
                        disabled={!isSectionComplete()}
                      >
                        Next: Contact Details
                      </Button>
                    </div>
                  </div>
                )}

                {/* Contact Details Section */}
                {activeSection === "contact" && (
                  <div className="bg-white rounded-2xl shadow-lg p-8 animate-fade-in">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-3">
                        <div className="p-3 bg-gradient-to-br from-purple-100 to-pink-100 rounded-xl">
                          <Smartphone className="w-6 h-6 text-purple-600" />
                        </div>
                        <div>
                          <h2 className="text-2xl font-bold text-gray-800">
                            Contact Details
                          </h2>
                          <p className="text-gray-600">
                            How we can reach you and where to send documents
                          </p>
                        </div>
                      </div>
                      {isContactSectionComplete() && (
                        <div className="flex items-center gap-2 text-sm text-green-600 bg-green-50 px-3 py-1 rounded-full">
                          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                          Ready to proceed
                        </div>
                      )}
                      {/* {isSectionComplete() && (
                        <div className="flex items-center gap-2 text-sm text-green-600 bg-green-50 px-3 py-1 rounded-full">
                          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                          Ready to proceed
                        </div>
                      )} */}
                    </div>

                    <div className="space-y-8">
                      {/* Phone Numbers */}
                      <div className="grid md:grid-cols-2 gap-6">
                        <FormField
                          control={form.control}
                          name="customer.contactInfo.phone"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm font-medium text-gray-700">
                                Phone Number{" "}
                                <span className="text-red-500">*</span>
                              </FormLabel>
                              <FormControl>
                                <Input
                                  className="h-12 bg-gray-50 border-gray-200 hover:bg-gray-100 focus:border-purple-500 focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50 transition-all duration-200"
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
                              <FormLabel className="text-sm font-medium text-gray-700">
                                Alternate Phone (Optional)
                              </FormLabel>
                              <FormControl>
                                <Input
                                  className="h-12 bg-gray-50 border-gray-200 hover:bg-gray-100 focus:border-purple-500 focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50 transition-all duration-200"
                                  placeholder="+45 98 76 54 32"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      {/* Address Sections */}
                      <div className="space-y-8">
                        <div>
                          <div className="flex items-center gap-2 mb-4">
                            <MapPin className="w-5 h-5 text-purple-600" />
                            <h3 className="text-lg font-semibold text-gray-800">
                              Primary Address{" "}
                              <span className="text-red-500">*</span>
                            </h3>
                          </div>
                          <div className="grid md:grid-cols-2 gap-6">
                            {addressKeys.map((key) => (
                              <FormField
                                key={key}
                                control={form.control}
                                name={
                                  `customer.contactInfo.primaryAddress.${key}` as const
                                }
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel className="text-sm font-medium text-gray-700 capitalize">
                                      {key === "postalCode"
                                        ? "Postal Code"
                                        : key}{" "}
                                      <span className="text-red-500">*</span>
                                    </FormLabel>
                                    <FormControl>
                                      <Input
                                        className="h-12 bg-gray-50 border-gray-200 hover:bg-gray-100 focus:border-purple-500 focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50 transition-all duration-200"
                                        placeholder={
                                          key === "street"
                                            ? "Enter your street"
                                            : key === "city"
                                            ? "Enter your city"
                                            : key === "postalCode"
                                            ? "12345"
                                            : "e.g., Denmark"
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
                        <div>
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2">
                              <CreditCard className="w-5 h-5 text-purple-600" />
                              <h3 className="text-lg font-semibold text-gray-800">
                                Billing Address{" "}
                                {!sameAsPrimary && (
                                  <span className="text-red-500">*</span>
                                )}
                              </h3>
                            </div>
                            <div className="flex items-center gap-2">
                              <Checkbox
                                id="sameAsPrimary"
                                checked={sameAsPrimary}
                                onCheckedChange={handleBillingSyncChange}
                                className="data-[state=checked]:bg-purple-600 data-[state=checked]:border-purple-600 transition-colors"
                              />
                              <label
                                htmlFor="sameAsPrimary"
                                className="text-sm font-medium text-gray-700 cursor-pointer hover:text-purple-600 transition-colors"
                              >
                                Same as primary address
                              </label>
                            </div>
                          </div>

                          {!sameAsPrimary && (
                            <div className="grid md:grid-cols-2 gap-6">
                              {addressKeys.map((key) => (
                                <FormField
                                  key={key}
                                  control={form.control}
                                  name={
                                    `customer.contactInfo.billingAddress.${key}` as const
                                  }
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel className="text-sm font-medium text-gray-700 capitalize">
                                        {key === "postalCode"
                                          ? "Postal Code"
                                          : key}{" "}
                                        <span className="text-red-500">*</span>
                                      </FormLabel>
                                      <FormControl>
                                        <Input
                                          className="h-12 bg-gray-50 border-gray-200 hover:bg-gray-100 focus:border-purple-500 focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50 transition-all duration-200"
                                          placeholder={
                                            key === "street"
                                              ? "Enter billing street"
                                              : key === "city"
                                              ? "Enter billing city"
                                              : key === "postalCode"
                                              ? "12345"
                                              : "e.g., Denmark"
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
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-between mt-8 pt-6 border-t border-gray-100">
                      <Button
                        type="button"
                        variant="outline"
                        className="border-gray-300 hover:bg-gray-50 transition-all duration-200 hover:border-purple-300"
                        onClick={() => setActiveSection("risk")}
                      >
                        Back
                      </Button>
                      <Button
                        type="button"
                        variant="default"
                        className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 shadow-lg hover:shadow-purple-200 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                        onClick={() => validateAndMoveToNext("policy")}
                        disabled={!isSectionComplete()}
                      >
                        Next: Policy Details
                      </Button>
                    </div>
                  </div>
                )}

                {/* Policy Details Section */}
                {activeSection === "policy" && (
                  <div className="bg-white rounded-2xl shadow-lg p-8 animate-fade-in">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-3">
                        <div className="p-3 bg-gradient-to-br from-amber-100 to-orange-100 rounded-xl">
                          <Shield className="w-6 h-6 text-amber-600" />
                        </div>
                        <div>
                          <h2 className="text-2xl font-bold text-gray-800">
                            Policy Details
                          </h2>
                          <p className="text-gray-600">
                            Finalize your coverage and effective date
                          </p>
                        </div>
                      </div>
                      {isPolicySectionComplete() && (
                        <div className="flex items-center gap-2 text-sm text-green-600 bg-green-50 px-3 py-1 rounded-full">
                          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                          Ready to proceed
                        </div>
                      )}
                      {/* {isSectionComplete() && (
                        <div className="flex items-center gap-2 text-sm text-green-600 bg-green-50 px-3 py-1 rounded-full">
                          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                          Ready to proceed
                        </div>
                      )} */}
                    </div>

                    <div className="space-y-8">
                      <div className="grid md:grid-cols-2 gap-6">
                        <FormField
                          control={form.control}
                          name="policyNumber"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm font-medium text-gray-700">
                                Policy Number
                              </FormLabel>
                              <FormControl>
                                <Input
                                  className="h-12 bg-gray-50 border-gray-200 hover:bg-gray-100 focus:border-amber-500 focus:ring-2 focus:ring-amber-500 focus:ring-opacity-50 transition-all duration-200"
                                  value={policy?.policyNumber}
                                  readOnly
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="coveragePeriod.effectiveDate"
                          render={({ field }) => (
                            <FormItem className="flex flex-col">
                              <FormLabel className="text-sm font-medium text-gray-700">
                                Effective Date{" "}
                                <span className="text-red-500">*</span>
                              </FormLabel>
                              <Popover>
                                <PopoverTrigger asChild>
                                  <FormControl>
                                    <Button
                                      variant="outline"
                                      className="h-12 bg-gray-50 border-gray-200 hover:bg-gray-100 hover:text-gray-900 justify-start text-left font-normal transition-all duration-200 mt-0"
                                    >
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
                                  className="w-auto p-0 animate-slide-down bg-white"
                                  align="start"
                                >
                                  <Calendar
                                    mode="single"
                                    selected={field.value}
                                    onSelect={field.onChange}
                                    disabled={(date) => date < new Date()}
                                    initialFocus
                                    className="rounded-lg border shadow-lg"
                                  />
                                </PopoverContent>
                              </Popover>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      {/* Policy Summary Card */}
                      <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-6 transition-all duration-300 hover:border-amber-300 hover:shadow-sm">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">
                          Policy Summary
                        </h3>
                        <div className="space-y-3">
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600">Policy Type</span>
                            <span className="font-medium text-gray-800">
                              {policy?.productType} Insurance
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600">
                              Payment Frequency
                            </span>
                            <span className="font-medium text-gray-800">
                              {form.watch("paymentFrequency") || "Monthly"}
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600">
                              Coverage Start
                            </span>
                            <span className="font-medium text-gray-800">
                              {form.watch("coveragePeriod.effectiveDate")
                                ? format(
                                    form.watch("coveragePeriod.effectiveDate")!,
                                    "PPP"
                                  )
                                : "To be selected"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-between mt-8 pt-6 border-t border-gray-100">
                      <Button
                        type="button"
                        variant="outline"
                        className="border-gray-300 hover:bg-gray-50 transition-all duration-200 hover:border-amber-300"
                        onClick={() => setActiveSection("contact")}
                      >
                        Back
                      </Button>
                      {policy?.productType === "LIFE" ? (
                        <Button
                          type="button"
                          variant="default"
                          className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 shadow-lg hover:shadow-amber-200 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                          onClick={() => validateAndMoveToNext("beneficiaries")}
                          disabled={!isSectionComplete()}
                        >
                          Next: Beneficiaries
                        </Button>
                      ) : (
                        <Button
                          type="submit"
                          className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 shadow-lg hover:shadow-emerald-200 transition-all duration-300 px-8"
                          disabled={isLoading}
                        >
                          {isLoading ? (
                            <>
                              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                              Processing...
                            </>
                          ) : (
                            "Complete Purchase"
                          )}
                        </Button>
                      )}
                    </div>
                  </div>
                )}

                {/* Beneficiaries Section - FIXED */}
                {activeSection === "beneficiaries" &&
                  policy?.productType === "LIFE" && (
                    <div className="bg-white rounded-2xl shadow-lg p-8 animate-fade-in">
                      <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                          <div className="p-3 bg-gradient-to-br from-red-100 to-pink-100 rounded-xl">
                            <Heart className="w-6 h-6 text-red-600" />
                          </div>
                          <div>
                            <h2 className="text-2xl font-bold text-gray-800">
                              Beneficiaries
                            </h2>
                            <p className="text-gray-600">
                              Add people who will receive benefits
                            </p>
                          </div>
                        </div>
                        {isSectionComplete() && (
                          <div className="flex items-center gap-2 text-sm text-green-600 bg-green-50 px-3 py-1 rounded-full">
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                            Ready to proceed
                          </div>
                        )}
                      </div>

                      <div className="space-y-6">
                        {(form.watch("beneficiaries") || [])?.length === 0 ? (
                          <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-2xl hover:border-red-300 transition-all duration-300">
                            <Heart className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-gray-600 mb-2">
                              No beneficiaries added
                            </h3>
                            <p className="text-gray-500">
                              Add at least one beneficiary to continue
                            </p>
                          </div>
                        ) : (
                          <div className="space-y-4">
                            {(form.watch("beneficiaries") || [])?.map(
                              (beneficiary, index) => (
                                <div
                                  key={index}
                                  className={cn(
                                    "border rounded-xl p-6 transition-all duration-300",
                                    editingBeneficiary === index ||
                                      (newBeneficiary &&
                                        index ===
                                          (form.watch("beneficiaries")
                                            ?.length || 0) -
                                            1)
                                      ? "border-red-400 bg-gradient-to-br from-red-50 to-pink-50 shadow-sm"
                                      : "border-gray-200 hover:border-red-300 hover:shadow-sm"
                                  )}
                                >
                                  <div className="flex justify-between items-center mb-6">
                                    <h4 className="font-semibold text-lg text-gray-800">
                                      Beneficiary {index + 1}{" "}
                                      <span className="text-red-500">*</span>
                                    </h4>
                                    <div className="flex items-center gap-2">
                                      {editingBeneficiary === index ||
                                      (newBeneficiary &&
                                        index ===
                                          (form.watch("beneficiaries")
                                            ?.length || 0) -
                                            1) ? (
                                        <Button
                                          type="button"
                                          variant="default"
                                          size="sm"
                                          onClick={() => saveBeneficiary(index)}
                                          className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
                                        >
                                          <Save className="w-4 h-4 mr-2" />
                                          Save
                                        </Button>
                                      ) : (
                                        <Button
                                          type="button"
                                          variant="outline"
                                          size="sm"
                                          onClick={() =>
                                            setEditingBeneficiary(index)
                                          }
                                          className="border-gray-300 hover:border-red-400 hover:bg-red-50"
                                        >
                                          <Edit2 className="w-4 h-4 mr-2" />
                                          Edit
                                        </Button>
                                      )}
                                      <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => removeBeneficiary(index)}
                                        className="text-gray-400 hover:text-red-600 hover:bg-red-50"
                                      >
                                        <Trash2 className="w-4 h-4" />
                                      </Button>
                                    </div>
                                  </div>

                                  {editingBeneficiary === index ||
                                  (newBeneficiary &&
                                    index ===
                                      (form.watch("beneficiaries")?.length ||
                                        0) -
                                        1) ? (
                                    <div className="grid md:grid-cols-3 gap-6">
                                      <FormField
                                        control={form.control}
                                        name={`beneficiaries.${index}.name`}
                                        render={({ field }) => (
                                          <FormItem>
                                            <FormLabel className="text-sm font-medium text-gray-700">
                                              Full Name{" "}
                                              <span className="text-red-500">
                                                *
                                              </span>
                                            </FormLabel>
                                            <FormControl>
                                              <Input
                                                className="bg-white border-gray-300 focus:border-red-500 focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 transition-all duration-200"
                                                placeholder="John Doe"
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
                                            <FormLabel className="text-sm font-medium text-gray-700">
                                              Relationship{" "}
                                              <span className="text-red-500">
                                                *
                                              </span>
                                            </FormLabel>
                                            <Select
                                              onValueChange={field.onChange}
                                              value={field.value}
                                            >
                                              <FormControl>
                                                <SelectTrigger className="bg-white border-gray-300 focus:border-red-500 focus:ring-2 focus:ring-red-500 focus:ring-opacity-50">
                                                  <SelectValue placeholder="Select relationship" />
                                                </SelectTrigger>
                                              </FormControl>
                                              <SelectContent className="animate-slide-down">
                                                <SelectItem value="SPOUSE">
                                                  Spouse
                                                </SelectItem>
                                                <SelectItem value="CHILD">
                                                  Child
                                                </SelectItem>
                                                <SelectItem value="PARENT">
                                                  Parent
                                                </SelectItem>
                                                <SelectItem value="SIBLING">
                                                  Sibling
                                                </SelectItem>
                                                <SelectItem value="BUSINESS_PARTNER">
                                                  Business Partner
                                                </SelectItem>
                                                <SelectItem value="OTHER">
                                                  Other
                                                </SelectItem>
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
                                            <FormLabel className="text-sm font-medium text-gray-700">
                                              Date of Birth{" "}
                                              <span className="text-red-500">
                                                *
                                              </span>
                                            </FormLabel>
                                            <Popover>
                                              <PopoverTrigger asChild>
                                                <FormControl>
                                                  <Button
                                                    variant="outline"
                                                    className="bg-white border-gray-300 hover:bg-gray-50 hover:text-gray-900 justify-start text-left font-normal"
                                                  >
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
                                                className="w-auto p-0 animate-slide-down"
                                                align="start"
                                              >
                                                <Calendar
                                                  mode="single"
                                                  selected={field.value}
                                                  onSelect={field.onChange}
                                                  disabled={(date) =>
                                                    date > new Date() ||
                                                    date <
                                                      new Date("1900-01-01")
                                                  }
                                                  initialFocus
                                                />
                                              </PopoverContent>
                                            </Popover>
                                            <FormMessage />
                                          </FormItem>
                                        )}
                                      />
                                    </div>
                                  ) : (
                                    <div className="grid md:grid-cols-3 gap-4">
                                      <div>
                                        <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                                          Full Name{" "}
                                          <span className="text-red-500">
                                            *
                                          </span>
                                        </label>
                                        <p className="font-medium text-gray-800 mt-1">
                                          {beneficiary.name || "Not set"}
                                        </p>
                                      </div>
                                      <div>
                                        <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                                          Relationship{" "}
                                          <span className="text-red-500">
                                            *
                                          </span>
                                        </label>
                                        <p className="font-medium text-gray-800 capitalize mt-1">
                                          {beneficiary.relationship
                                            ?.toLowerCase()
                                            .replace("_", " ") || "Not set"}
                                        </p>
                                      </div>
                                      <div>
                                        <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                                          Date of Birth{" "}
                                          <span className="text-red-500">
                                            *
                                          </span>
                                        </label>
                                        <p className="font-medium text-gray-800 mt-1">
                                          {beneficiary.dateOfBirth
                                            ? format(
                                                beneficiary.dateOfBirth,
                                                "PPP"
                                              )
                                            : "Not set"}
                                        </p>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              )
                            )}
                          </div>
                        )}

                        <Button
                          type="button"
                          variant="outline"
                          className="w-full border-dashed border-2 border-gray-300 hover:border-red-400 hover:bg-red-50 text-red-600 h-14 transition-all duration-300 hover:scale-[1.02]"
                          onClick={addBeneficiary}
                        >
                          <Plus className="w-5 h-5 mr-2" />
                          Add Beneficiary
                        </Button>
                      </div>

                      <div className="flex justify-between mt-8 pt-6 border-t border-gray-100">
                        <Button
                          type="button"
                          variant="outline"
                          className="border-gray-300 hover:bg-gray-50 transition-all duration-200 hover:border-red-300"
                          onClick={() => setActiveSection("policy")}
                        >
                          Back
                        </Button>
                        <Button
                          type="submit"
                          className="bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 shadow-lg hover:shadow-red-200 transition-all duration-300 px-8 disabled:opacity-50 disabled:cursor-not-allowed"
                          disabled={isLoading || !isSectionComplete()}
                        >
                          {isLoading ? (
                            <>
                              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                              Processing...
                            </>
                          ) : (
                            "Complete Purchase"
                          )}
                        </Button>
                      </div>
                    </div>
                  )}
              </form>
            </Form>

            {/* Footer Note */}
            <div className="mt-8 text-center animate-fade-in animation-delay-300">
              <p className="text-sm text-gray-500">
                <span className="text-red-500">*</span> Required field. Your
                information is secured with 256-bit SSL encryption. By
                submitting, you agree to our{" "}
                <a
                  href="/terms"
                  className="text-blue-600 hover:text-blue-800 font-medium transition-colors"
                >
                  Terms of Service
                </a>{" "}
                and{" "}
                <a
                  href="/privacy"
                  className="text-blue-600 hover:text-blue-800 font-medium transition-colors"
                >
                  Privacy Policy
                </a>
                .
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
