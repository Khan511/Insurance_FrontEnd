import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import {
  User,
  Mail,
  Phone,
  Building,
  DollarSign,
  Shield,
  UserPlus,
  Save,
  Calendar,
} from "lucide-react";
import {
  employeeCreateSchema,
  employeeUpdateSchema,
  type EmployeeFormData,
  type EmployeeUpdateData,
} from "./employeeSchema";
import { useEffect, useState } from "react";
import { formatDateArrayForInput } from "@/utils/Utils";
import { toast } from "sonner";

interface EmployeeFormProps {
  onSubmit: (data: EmployeeFormData | EmployeeUpdateData) => void;
  isLoading?: boolean;
  initialData?: EmployeeFormData | EmployeeUpdateData;
  isEdit?: boolean;
}

export function EmployeeForm({
  onSubmit,
  isLoading = false,
  initialData,
  isEdit = false,
}: EmployeeFormProps) {
  const [submitting, setSubmitting] = useState(false);

  // Use different schema for edit vs create
  const schema = isEdit ? employeeUpdateSchema : employeeCreateSchema;

  // Helper function to prepare initial data with formatted dates
  const prepareInitialData = (data?: any): any => {
    if (!data) return undefined;

    const formattedData = {
      ...data,
      dateOfBirth: formatDateArrayForInput(data.dateOfBirth),
      terminationDate: formatDateArrayForInput(data.terminationDate),
    };

    // Remove password from initial data in edit mode
    if (isEdit) {
      delete formattedData.password;
    }

    return formattedData;
  };

  const form = useForm<EmployeeFormData | EmployeeUpdateData>({
    resolver: zodResolver(schema),
    defaultValues: prepareInitialData(initialData) || {
      email: "",
      name: {
        firstName: "",
        lastName: "",
      },
      dateOfBirth: "",
      terminationDate: "",
      department: "",
      jobTitle: "",
      salary: "",
      employmentType: "FULL_TIME",
      roleType: "AGENT",
      workContactInfo: {
        workPhone: "",
        workEmail: "",
        officeLocation: "",
      },
      emergencyContact: {
        name: "",
        relationship: "",
        phone: "",
        email: "",
      },
      // Only add password for create mode
      ...(isEdit ? {} : { password: "" }),
    },
  });

  // Reset form when initialData changes (for editing)
  useEffect(() => {
    console.log("Initial data received in EmployeeForm:", initialData);
    console.log(
      "Formatted dateOfBirth:",
      formatDateArrayForInput(initialData?.dateOfBirth)
    );
    console.log(
      "Formatted terminationDate:",
      formatDateArrayForInput(initialData?.terminationDate)
    );

    if (initialData) {
      const formattedData = prepareInitialData(initialData);
      console.log("Formatted data for form reset:", formattedData);
      form.reset(formattedData);
    }
  }, [initialData, form]);

  const handleSubmit = async (data: any) => {
    console.log("=== FORM SUBMIT STARTED ===");
    console.log("Form data being submitted:", data);
    console.log("isEdit mode:", isEdit);

    // Check if form is valid
    const isValid = await form.trigger();
    console.log("Form validation result:", isValid);

    if (!isValid) {
      const errors = form.formState.errors;
      console.log("Form validation errors:", errors);

      // Show error for each field
      Object.entries(errors).forEach(([key, error]) => {
        console.log(`${key}:`, error);
      });

      toast.error("Please fix form errors before submitting");
      return;
    }

    console.log("Calling onSubmit prop...");
    setSubmitting(true);
    try {
      // In edit mode, we should not send password at all
      if (isEdit) {
        // Remove any password field that might have been added
        delete data.password;
      }

      await onSubmit(data);
      console.log("=== FORM SUBMIT SUCCESS ===");
    } catch (error: any) {
      console.error("=== FORM SUBMIT ERROR ===");
      console.error("Error details:", error);
      toast.error(error?.message || "Failed to submit form");
    } finally {
      setSubmitting(false);
      console.log("=== FORM SUBMIT COMPLETED ===");
    }
  };

  // Helper function to format date as YYYY-MM-DD for min/max
  const formatDateForMinMax = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  // Get today's date for min/max calculations
  const today = new Date();
  const todayString = formatDateForMinMax(today);

  // Calculate yesterday for dateOfBirth (disable today and future)
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  const yesterdayString = formatDateForMinMax(yesterday);

  // For terminationDate: allow today and future in create mode
  // In edit mode, we should allow past dates if they already exist
  const getTerminationMinDate = () => {
    if (isEdit && initialData?.terminationDate) {
      // In edit mode, if there's already a termination date, don't restrict it
      return undefined;
    }
    // In create mode or when no termination date exists, disable past dates
    return todayString;
  };

  const terminationMinDate = getTerminationMinDate();

  const departments = [
    "Sales",
    "Claims",
    "Customer Service",
    "Underwriting",
    "IT",
    "Finance",
    "Human Resources",
    "Management",
    "Marketing",
  ];

  const jobTitles = [
    "Sales Agent",
    "Insurance Agent",
    "Broker",
    "Claims Manager",
    "Claims Adjuster",
    "Customer Support",
    "Underwriter",
    "Risk Assessor",
    "System Administrator",
    "HR Manager",
    "Finance Manager",
    "Marketing Specialist",
  ];

  const isFormSubmitting = isLoading || submitting;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Basic Info */}
          <Card className="lg:col-span-2">
            <CardContent className="pt-6">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Basic Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="name.firstName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>First Name *</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="First name"
                              {...field}
                              disabled={isFormSubmitting}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="name.lastName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Last Name *</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Last name"
                              {...field}
                              disabled={isFormSubmitting}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email *</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                              <Input
                                type="email"
                                placeholder="employee@company.com"
                                className="px-8"
                                {...field}
                                disabled={isFormSubmitting}
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    {/* Only show password field for create mode */}
                    {!isEdit && (
                      <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Password *</FormLabel>
                            <FormControl>
                              <Input
                                type="password"
                                placeholder="••••••••"
                                {...field}
                                disabled={isFormSubmitting}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <FormField
                      control={form.control}
                      name="dateOfBirth"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Date of Birth</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                              <Input
                                type="date"
                                className="px-8"
                                {...field}
                                value={field.value || ""}
                                max={yesterdayString}
                                title="Date of birth cannot be today or in the future"
                                disabled={isFormSubmitting}
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                          <p className="text-xs text-gray-500 mt-1">
                            Must be a past date (not today or future)
                          </p>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="terminationDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Termination Date</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                              <Input
                                type="date"
                                className="px-8"
                                {...field}
                                value={field.value || ""}
                                min={terminationMinDate}
                                title={
                                  isEdit
                                    ? "Termination date can be any date in edit mode"
                                    : "Termination date cannot be in the past"
                                }
                                disabled={isFormSubmitting}
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                          <p className="text-xs text-gray-500 mt-1">
                            {isEdit
                              ? "In edit mode, past termination dates are allowed"
                              : "Must be today or a future date"}
                          </p>
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Building className="h-5 w-5" />
                    Employment Details
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormField
                      control={form.control}
                      name="department"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Department *</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            disabled={isFormSubmitting}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select department" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="bg-white">
                              {departments.map((dept) => (
                                <SelectItem key={dept} value={dept}>
                                  {dept}
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
                      name="jobTitle"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Job Title *</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            disabled={isFormSubmitting}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select job title" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="bg-white">
                              {jobTitles.map((title) => (
                                <SelectItem key={title} value={title}>
                                  {title}
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
                      name="salary"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Salary *</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <DollarSign className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                              <Input
                                type="number"
                                step="0.01"
                                placeholder="50000"
                                className="px-7"
                                {...field}
                                disabled={isFormSubmitting}
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                    <FormField
                      control={form.control}
                      name="employmentType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Employment Type *</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            disabled={isFormSubmitting}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="bg-white">
                              <SelectItem value="FULL_TIME">
                                Full Time
                              </SelectItem>
                              <SelectItem value="PART_TIME">
                                Part Time
                              </SelectItem>
                              <SelectItem value="CONTRACT">Contract</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="roleType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Role *</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            disabled={isFormSubmitting}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select role" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="bg-white">
                              <SelectItem value="AGENT">Agent</SelectItem>
                              <SelectItem value="CLAIM_MANAGER">
                                Claim Manager
                              </SelectItem>
                              <SelectItem value="ADMIN">Admin</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Right Column - Contact & Emergency Info */}
          <div className="space-y-6">
            <Card>
              <CardContent className="pt-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Phone className="h-5 w-5" />
                  Work Contact
                </h3>
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="workContactInfo.workPhone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Work Phone</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="+45 41 77 12 34"
                            {...field}
                            value={field.value || ""}
                            disabled={isFormSubmitting}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="workContactInfo.workEmail"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Work Email</FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="john.d@company.com"
                            {...field}
                            value={field.value || ""}
                            disabled={isFormSubmitting}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="workContactInfo.officeLocation"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Office Location</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Floor 5, Building A"
                            {...field}
                            value={field.value || ""}
                            disabled={isFormSubmitting}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Emergency Contact
                </h3>
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="emergencyContact.name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Contact Name</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Contact name"
                            {...field}
                            value={field.value || ""}
                            disabled={isFormSubmitting}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="emergencyContact.relationship"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Relationship</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          disabled={isFormSubmitting}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select relationship" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="bg-white">
                            <SelectItem value="SPOUSE">Spouse</SelectItem>
                            <SelectItem value="PARENT">Parent</SelectItem>
                            <SelectItem value="SIBLING">Sibling</SelectItem>
                            <SelectItem value="FRIEND">Friend</SelectItem>
                            <SelectItem value="OTHER">Other</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="emergencyContact.phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Emergency Phone</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="+1 (555) 987-6543"
                            {...field}
                            value={field.value || ""}
                            disabled={isFormSubmitting}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="emergencyContact.email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Emergency Email</FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="contact@example.com"
                            {...field}
                            value={field.value || ""}
                            disabled={isFormSubmitting}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="flex justify-end space-x-4 pt-5 gap-2 border-t">
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              console.log("Reset button clicked");
              form.reset();
            }}
            disabled={isFormSubmitting}
            className="rounded"
          >
            Reset
          </Button>
          <Button
            type="submit"
            disabled={isFormSubmitting}
            className="text-white rounded bg-blue-600 hover:bg-blue-700"
          >
            {isFormSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                {isEdit ? "Updating..." : "Creating..."}
              </>
            ) : (
              <>
                {isEdit ? (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Update Employee
                  </>
                ) : (
                  <>
                    <UserPlus className="h-4 w-4 mr-2" />
                    Create Employee
                  </>
                )}
              </>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
