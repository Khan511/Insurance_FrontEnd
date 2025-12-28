import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  useGetAllPoliciesQuery,
  useUpdatePolicyMutation,
} from "@/services/AdminSlice";
import type { InsuracePolicy, Beneficiaries } from "@/services/ServiceTypes";
import { useGetCurrenttUserQuery } from "@/services/UserApiSlice";
import { formatDateTime } from "@/utils/Utils";
import {
  Edit,
  Filter,
  Search,
  Trash2,
  Calendar,
  DollarSign,
  RefreshCw,
  User,
  Home,
  Car,
  Shield,
  FileText,
  CreditCard,
  Users,
  Clock,
  AlertCircle,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { useState, useEffect } from "react";

// Filter type
type PolicyFilter = {
  status: string;
  productType: string;
  paymentFrequency: string;
  premiumRange: string;
  // region: string;
  validity: string;
  hasBeneficiaries: string;
  paymentStatus: string;
  searchTerm: string;
};

const AdminAllPolicies = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedPolicy, setSelectedPolicy] = useState<InsuracePolicy | null>(
    null
  );
  const [editFormData, setEditFormData] = useState({
    status: "",
    premium: "",
    paymentFrequency: "",
    effectiveDate: "",
    expirationDate: "",
    cancellationReason: "",
    // cancellationDate: "",
    statusChangeNotes: "",
  });
  const [beneficiaries, setBeneficiaries] = useState<Beneficiaries[]>([]);

  // Filter state
  const [filter, setFilter] = useState<PolicyFilter>({
    status: "all",
    productType: "all",
    paymentFrequency: "all",
    premiumRange: "all",
    // region: "all",
    validity: "all",
    hasBeneficiaries: "all",
    paymentStatus: "all",
    searchTerm: "",
  });

  const { data: allPolicies, refetch } = useGetAllPoliciesQuery();
  const { data: currentUser } = useGetCurrenttUserQuery();

  const [updatePolicy] = useUpdatePolicyMutation();

  const currentUserFullName =
    currentUser?.data.user.name.firstName +
    " " +
    currentUser?.data.user.name.lastName;

  // Get unique values for filters
  const uniqueProductTypes = Array.from(
    new Set(allPolicies?.map((policy) => policy.productType) || [])
  );
  // const uniqueRegions = Array.from(
  //   new Set(allPolicies?.flatMap((policy) => policy.regions || []) || [])
  // );
  const uniquePaymentFrequencies = Array.from(
    new Set(allPolicies?.map((policy) => policy.paymentFrequency) || [])
  );

  // Apply filters
  const filteredPolicies = allPolicies?.filter((policy) => {
    // Search filter
    if (
      filter.searchTerm &&
      !(
        policy.policyNumber
          .toLowerCase()
          .includes(filter.searchTerm.toLowerCase()) ||
        policy.policyHolderName
          .toLowerCase()
          .includes(filter.searchTerm.toLowerCase()) ||
        policy.policyHolderEmail
          ?.toLowerCase()
          .includes(filter.searchTerm.toLowerCase()) ||
        policy.displayName
          ?.toLowerCase()
          .includes(filter.searchTerm.toLowerCase())
      )
    ) {
      return false;
    }

    // Status filter
    if (filter.status !== "all" && policy.status !== filter.status) {
      return false;
    }

    // Product type filter
    if (
      filter.productType !== "all" &&
      policy.productType !== filter.productType
    ) {
      return false;
    }

    // Payment frequency filter
    if (
      filter.paymentFrequency !== "all" &&
      policy.paymentFrequency !== filter.paymentFrequency
    ) {
      return false;
    }

    // // Region filter
    // if (filter.region !== "all" && !policy.regions?.includes(filter.region)) {
    //   return false;
    // }

    // Beneficiaries filter
    if (filter.hasBeneficiaries !== "all") {
      const hasBeneficiaries =
        policy.beneficiaries && policy.beneficiaries.length > 0;
      if (filter.hasBeneficiaries === "with" && !hasBeneficiaries) return false;
      if (filter.hasBeneficiaries === "without" && hasBeneficiaries)
        return false;
    }

    // Premium range filter
    if (filter.premiumRange !== "all" && policy.premium) {
      const premium = Number(policy.premium);
      switch (filter.premiumRange) {
        case "under1000":
          if (premium >= 1000) return false;
          break;
        case "1000to5000":
          if (premium < 1000 || premium > 5000) return false;
          break;
        case "over5000":
          if (premium <= 5000) return false;
          break;
      }
    }

    // Validity filter
    if (filter.validity !== "all" && policy.validityPeriod) {
      const now = new Date();
      const effectiveDate = new Date(policy.validityPeriod.effectiveDate);
      const expirationDate = new Date(policy.validityPeriod.expirationDate);

      switch (filter.validity) {
        case "active":
          // Active policies should have ACTIVE status AND be within validity period
          if (
            policy.status !== "ACTIVE" ||
            now < effectiveDate ||
            now > expirationDate
          )
            return false;
          break;
        case "expired":
          // Expired policies have EXPIRED status OR are past expiration date
          if (policy.status !== "EXPIRED" && now <= expirationDate)
            return false;
          break;
        case "inactive":
          // Inactive policies have INACTIVE status OR haven't started yet
          if (policy.status !== "INACTIVE" && now >= effectiveDate)
            return false;
          break;
      }
    }

    // Payment status filter
    if (filter.paymentStatus !== "all" && policy.paymentSchedules) {
      const hasPending = policy.paymentSchedules.some(
        (schedule) => schedule.status === "PENDING"
      );
      const hasOverdue = policy.paymentSchedules.some(
        (schedule) => schedule.status === "OVERDUE"
      );
      const hasPaid = policy.paymentSchedules.some(
        (schedule) => schedule.status === "PAID"
      );

      switch (filter.paymentStatus) {
        case "pending":
          if (!hasPending) return false;
          break;
        case "overdue":
          if (!hasOverdue) return false;
          break;
        case "paid":
          if (!hasPaid) return false;
          break;
        case "allPaid":
          if (policy.paymentSchedules.some((s) => s.status !== "PAID"))
            return false;
          break;
      }
    }
    return true;
  });

  console.log(
    "Current User in Admin Policies: ",
    currentUser?.data.user.name.firstName
  );

  // Get status counts for badge display
  const getStatusCounts = () => {
    const counts: Record<string, number> = {
      all: allPolicies?.length || 0,
      ACTIVE: 0,
      EXPIRED: 0,
      PENDING: 0,
      INACTIVE: 0,

      CANCELLED: 0,
    };

    allPolicies?.forEach((policy) => {
      if (counts[policy.status] !== undefined) {
        counts[policy.status]++;
      }
    });

    return counts;
  };

  const statusCounts = getStatusCounts();

  // Reset all filters
  const resetFilters = () => {
    setFilter({
      status: "all",
      productType: "all",
      paymentFrequency: "all",
      premiumRange: "all",
      // region: "all",
      validity: "all",
      hasBeneficiaries: "all",
      paymentStatus: "all",
      searchTerm: "",
    });
    setSearchTerm("");
  };

  // Update search term in filter
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setFilter((prev) => ({ ...prev, searchTerm: searchTerm }));
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      ACTIVE: {
        color: "bg-green-100 text-green-800 border-green-200",
        label: "Active",
        icon: <CheckCircle className="h-3 w-3 mr-1" />,
      },
      PENDING: {
        color: "bg-yellow-100 text-yellow-800 border-yellow-200",
        label: "Pending",
        icon: <Clock className="h-3 w-3 mr-1" />,
      },
      INACTIVE: {
        color: "bg-red-100 text-red-800 border-red-200",
        label: "Inactive",
        icon: <XCircle className="h-3 w-3 mr-1" />,
      },
      EXPIRED: {
        color: "bg-gray-100 text-gray-800 border-gray-200",
        label: "Expired",
        icon: <AlertCircle className="h-3 w-3 mr-1" />,
      },
      CANCELLED: {
        color: "bg-gray-100 text-gray-800 border-gray-200",
        label: "Cancelled",
        icon: <AlertCircle className="h-3 w-3 mr-1" />,
      },
    };

    const config =
      statusConfig[status as keyof typeof statusConfig] || statusConfig.ACTIVE;
    return (
      <Badge
        variant="outline"
        className={`${config.color} flex items-center px-2 py-1`}
      >
        {config.icon}
        {config.label}
      </Badge>
    );
  };

  // Helper to format date from [year, month, day] array
  const formatDate = (dateString?: Date | string | null): string => {
    if (!dateString) return "Date not available";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Format date for input field (YYYY-MM-DD)
  const formatDateForInput = (dateString?: Date | string | null): string => {
    if (!dateString) return "";

    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  // Get next pending payment for a specific policy
  const getNextPendingPayment = (policy: InsuracePolicy) => {
    if (!policy.paymentSchedules) return null;

    return policy.paymentSchedules
      ?.filter((schedule) => schedule.status === "PENDING")
      .sort(
        (a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
      )[0];
  };

  // Open edit modal and populate form data
  const handleEditClick = (policy: InsuracePolicy) => {
    setSelectedPolicy(policy);

    setEditFormData({
      status: policy.status,
      premium: policy.premium.toString(),
      paymentFrequency: policy.paymentFrequency,
      effectiveDate: formatDateForInput(policy.validityPeriod?.effectiveDate),
      expirationDate: formatDateForInput(policy.validityPeriod?.expirationDate),
      cancellationReason: policy.cancellationReason,
      // cancellationDate: formatDateForInput(policy.cancellationDate),
      statusChangeNotes: policy.statusChangeNotes || "",
    });

    // Initialize beneficiaries from the policy
    setBeneficiaries(policy.beneficiaries || []);

    setIsEditModalOpen(true);
  };

  // Handle form input changes
  const handleInputChange = (field: string, value: string) => {
    setEditFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Handle beneficiary changes
  const handleBeneficiaryChange = (
    index: number,
    field: string,
    value: string
  ) => {
    const updatedBeneficiaries = [...beneficiaries];
    updatedBeneficiaries[index] = {
      ...updatedBeneficiaries[index],
      [field]: value,
    };
    setBeneficiaries(updatedBeneficiaries);
  };

  // Add new beneficiary
  const handleAddBeneficiary = () => {
    setBeneficiaries([
      ...beneficiaries,
      {
        name: "",
        relationship: "",
        dateOfBirth: "",
      },
    ]);
  };

  console.log("All policies in Admin policies", allPolicies);

  // Remove beneficiary
  const handleRemoveBeneficiary = (index: number) => {
    const updatedBeneficiaries = beneficiaries.filter((_, i) => i !== index);
    setBeneficiaries(updatedBeneficiaries);
  };

  // Validation before changing Status
  const validateStatusChange = (
    oldStatus: string,
    newStatus: string
  ): boolean => {
    const validTransitions: Record<string, string[]> = {
      ACTIVE: ["INACTIVE", "CANCELLED", "EXPIRED"],
      INACTIVE: ["ACTIVE", "CANCELLED", "EXPIRED"],
      PENDING: ["ACTIVE", "CANCELLED", "EXPIRED"],
      EXPIRED: ["CANCELLED"],
      // Once cancelled, cannot be changed
      CANCELLED: [],
    };
    return validTransitions[oldStatus]?.includes(newStatus) || false;
  };

  // Validate dates
  const validateDates = (
    effectiveDate: string,
    expirationDate: string
  ): string[] => {
    const errors: string[] = [];

    if (!effectiveDate || !expirationDate) return errors;

    const effDate = new Date(effectiveDate);
    const expDate = new Date(expirationDate);
    const today = new Date();

    // Compare dates only (ignore time)
    const effDateOnly = new Date(
      effDate.getFullYear(),
      effDate.getMonth(),
      effDate.getDate()
    );
    const expDateOnly = new Date(
      expDate.getFullYear(),
      expDate.getMonth(),
      expDate.getDate()
    );
    // const todayOnly = new Date(
    //   today.getFullYear(),
    //   today.getMonth(),
    //   today.getDate()
    // );

    if (effDateOnly > expDateOnly) {
      errors.push("Effective date must be before expiration date");
    }

    return errors;
  };

  // Save policy changes
  const handleSaveChanges = async () => {
    if (!selectedPolicy) return;

    // Validate status transition
    if (!validateStatusChange(selectedPolicy.status, editFormData.status)) {
      alert(
        `Invalid status change from ${selectedPolicy.status} to ${editFormData.status}`
      );
      return;
    }

    // Validate required fields for CANCELLED status
    if (
      editFormData.status === "CANCELLED" &&
      !editFormData.cancellationReason?.trim()
    ) {
      alert("Please provide a reason for cancelling the policy.");
      return;
    }

    // Validate statusChangeNotes when status changes
    if (
      selectedPolicy.status !== editFormData.status &&
      !editFormData.statusChangeNotes?.trim()
    ) {
      alert("Please provide notes for the status change.");
      return;
    }

    const dateErrors = validateDates(
      editFormData.effectiveDate,
      editFormData.expirationDate
    );
    if (dateErrors.length > 0) {
      alert(dateErrors.join("\n"));
      return;
    }

    //  Validate effective date for ACTIVE status
    if (editFormData.status === "ACTIVE") {
      const effectiveDate = new Date(editFormData.effectiveDate);
      const today = new Date();

      // Compare dates only (ignore time)
      const effectiveDateOnly = new Date(
        effectiveDate.getFullYear(),
        effectiveDate.getMonth(),
        effectiveDate.getDate()
      );
      const todayOnly = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate()
      );

      // If effective date is in the future
      if (effectiveDateOnly > todayOnly) {
        const userConfirmed = window.confirm(
          `The effective date (${editFormData.effectiveDate}) is in the future.\n\n` +
            `To activate the policy now, you need to set the effective date to today (${
              todayOnly.toISOString().split("T")[0]
            }) or earlier.\n\n` +
            `Do you want to change the effective date to today?`
        );

        if (userConfirmed) {
          // Update effective date to today
          const todayStr = todayOnly.toISOString().split("T")[0];
          setEditFormData((prev) => ({
            ...prev,
            effectiveDate: todayStr,
          }));

          // Continue with save after updating date
          await handleSaveChanges();
          return;
        } else {
          alert(
            "Policy cannot be activated with a future effective date. Please adjust the effective date."
          );
          return;
        }
      }
    }

    try {
      // If changing to CANCELLED, show confirmation
      if (
        editFormData.status === "CANCELLED" &&
        selectedPolicy.status !== "CANCELLED"
      ) {
        const confirmCancellation = window.confirm(
          "Are you sure you want to cancel this policy?\n\n" +
            "This will:\n" +
            "• Cancel all future payment schedules\n" +
            "• Mark any pending claims as CANCELLED\n" +
            "• Policy cannot be reactivated without admin approval\n\n" +
            "Proceed?"
        );

        if (!confirmCancellation) {
          return;
        }
      }

      // Prepare update data
      const updateData: any = {
        id: selectedPolicy.id,
        status: editFormData.status,
        premium: parseFloat(editFormData.premium).toFixed(2),
        paymentFrequency: editFormData.paymentFrequency,
        validityPeriod: {
          effectiveDate: editFormData.effectiveDate,
          expirationDate: editFormData.expirationDate,
        },
        statusChangeNotes: editFormData.statusChangeNotes,

        updatedBy: currentUserFullName,
      };

      // Add cancellation fields when status is CANCELLED
      if (editFormData.status === "CANCELLED") {
        updateData.cancellationReason = editFormData.cancellationReason;
        updateData.cancelledBy = currentUserFullName;
      } else if (
        selectedPolicy.status === "CANCELLED" &&
        editFormData.status !== "CANCELLED"
      ) {
        // If changing from CANCELLED to another status, clear cancellation fields
        updateData.cancellationDate = null;
        updateData.cancellationReason = null;
        updateData.cancelledBy = null;
      }

      // Only include beneficiaries if they exist and are valid
      const validatedBeneficiaries = beneficiaries.filter(
        (ben) => ben.name.trim() !== ""
      );
      if (validatedBeneficiaries.length > 0) {
        updateData.beneficiaries = validatedBeneficiaries;
      }

      // Call update API
      await updatePolicy(updateData).unwrap();

      // Close modal and reset state
      setIsEditModalOpen(false);
      setSelectedPolicy(null);
      setBeneficiaries([]);

      // Refresh the data
      refetch();
    } catch (error) {
      console.error("Failed to update policy:", error);
      alert("Failed to update policy. Please try again.");
    }
  };

  // Get product type icon
  const getProductTypeIcon = (type: string) => {
    const icons: Record<string, React.ReactNode> = {
      LIFE: <Shield className="h-4 w-4 text-blue-600" />,
      AUTO: <Car className="h-4 w-4 text-green-600" />,
      PROPERTY: <Home className="h-4 w-4 text-orange-600" />,
    };
    return icons[type] || <FileText className="h-4 w-4 text-gray-600" />;
  };

  // Get valid status transitions with descriptions
  const getValidStatusTransitions = (
    currentStatus: string
  ): Array<{ value: string; label: string; description: string }> => {
    const transitions: Record<
      string,
      Array<{ value: string; label: string; description: string }>
    > = {
      ACTIVE: [
        {
          value: "INACTIVE",
          label: "Inactive",
          description: "Pause coverage temporarily",
        },
        {
          value: "CANCELLED",
          label: "Cancelled",
          description: "Terminate policy permanently",
        },
        {
          value: "EXPIRED",
          label: "Expired",
          description: "Mark as naturally expired",
        },
      ],
      INACTIVE: [
        { value: "ACTIVE", label: "Active", description: "Activate coverage" },
        {
          value: "CANCELLED",
          label: "Cancelled",
          description: "Terminate policy",
        },
      ],
      PENDING: [
        { value: "ACTIVE", label: "Active", description: "Activate policy" },
        {
          value: "CANCELLED",
          label: "Cancelled",
          description: "Cancel before activation",
        },
      ],
      EXPIRED: [
        {
          value: "CANCELLED",
          label: "Cancelled",
          description: "Mark as cancelled (cannot expire further)",
        },
      ],
      CANCELLED: [],
    };

    return transitions[currentStatus] || [];
  };

  return (
    <div className="">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            Policies Management
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            Total Policies: {allPolicies?.length || 0} | Active:{" "}
            {allPolicies?.filter((p) => p.status === "ACTIVE").length || 0} |
            Pending:{" "}
            {allPolicies?.filter((p) => p.status === "PENDING").length || 0}
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            size="sm"
            onClick={resetFilters}
            className="flex items-center gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Reset Filters
          </Button>
        </div>
      </div>

      {/* Filter Section */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-2 top-1/5   w-4 text-gray-400" />
              <Input
                placeholder="Search policies by number, customer, or email..."
                className="px-4"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Status Filter */}
            <div className="w-full md:w-48">
              <Select
                value={filter.status}
                onValueChange={(value) =>
                  setFilter({ ...filter, status: value })
                }
              >
                <SelectTrigger className="w-full">
                  <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4" />
                    <SelectValue placeholder="Filter by status" />
                  </div>
                </SelectTrigger>
                <SelectContent className="">
                  <SelectItem value="all">
                    <div className="flex w-full gap-1">
                      <span>All Statuses</span>
                      <Badge variant="outline">{statusCounts.all}</Badge>
                    </div>
                  </SelectItem>
                  <SelectItem value="ACTIVE">
                    <div className="flex w-full gap-1">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span>Active</span>
                      </div>
                      <Badge variant="outline">{statusCounts.ACTIVE}</Badge>
                    </div>
                  </SelectItem>
                  <SelectItem value="PENDING">
                    <div className="flex w-full gap-1">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-yellow-600" />
                        <span>Pending</span>
                      </div>
                      <Badge variant="outline">{statusCounts.PENDING}</Badge>
                    </div>
                  </SelectItem>
                  <SelectItem value="INACTIVE">
                    <div className="flex w-full gap-1">
                      <div className="flex items-center gap-2">
                        <XCircle className="h-4 w-4 text-red-600" />
                        <span>Inactive</span>
                      </div>
                      <Badge variant="outline">{statusCounts.INACTIVE}</Badge>
                    </div>
                  </SelectItem>
                  <SelectItem value="EXPIRED">
                    <div className="flex w-full gap-1">
                      <div className="flex items-center gap-2">
                        <AlertCircle className="h-4 w-4 text-gray-600" />
                        <span>Expired</span>
                      </div>
                      <Badge variant="outline">{statusCounts.EXPIRED}</Badge>
                    </div>
                  </SelectItem>
                  <SelectItem value="CANCELLED">
                    <div className="flex w-full gap-1">
                      <div className="flex items-center gap-2">
                        <AlertCircle className="h-4 w-4 text-gray-600" />
                        <span>Cancelled</span>
                      </div>
                      <Badge variant="outline">{statusCounts.CANCELLED}</Badge>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Product Type Filter */}
            <div className="w-full md:w-48">
              <Select
                value={filter.productType}
                onValueChange={(value) =>
                  setFilter({ ...filter, productType: value })
                }
              >
                <SelectTrigger className="w-full">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    <SelectValue placeholder="Product Type" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Product Types</SelectItem>
                  {uniqueProductTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      <div className="flex items-center gap-2">
                        {getProductTypeIcon(type)}
                        {type}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Advanced Filters Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
            {/* Payment Frequency Filter */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                Payment Frequency
              </label>
              <Select
                value={filter.paymentFrequency}
                onValueChange={(value) =>
                  setFilter({ ...filter, paymentFrequency: value })
                }
              >
                <SelectTrigger>
                  <CreditCard className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Payment Frequency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Frequencies</SelectItem>
                  {uniquePaymentFrequencies.map((freq) => (
                    <SelectItem key={freq} value={freq}>
                      {freq}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Premium Range Filter */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                Premium Range
              </label>
              <Select
                value={filter.premiumRange}
                onValueChange={(value) =>
                  setFilter({ ...filter, premiumRange: value })
                }
              >
                <SelectTrigger>
                  <DollarSign className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Premium Amount" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Amounts</SelectItem>
                  <SelectItem value="under1000">Under 1,000 DKK</SelectItem>
                  <SelectItem value="1000to5000">1,000 - 5,000 DKK</SelectItem>
                  <SelectItem value="over5000">Over 5,000 DKK</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Region Filter */}
            {/* <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                Region
              </label>
              <Select
                value={filter.region}
                onValueChange={(value) =>
                  setFilter({ ...filter, region: value })
                }
              >
                <SelectTrigger>
                  <MapPin className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Select Region" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Regions</SelectItem>
                  {uniqueRegions.map((region) => (
                    <SelectItem key={region} value={region}>
                      {region}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div> */}

            {/* Validity Filter */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                Validity Period
              </label>
              <Select
                value={filter.validity}
                onValueChange={(value) =>
                  setFilter({ ...filter, validity: value })
                }
              >
                <SelectTrigger>
                  <Calendar className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Validity Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Policies</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="expired">Expired</SelectItem>
                  <SelectItem value="inactive">Inactive(Upcomming)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Additional Filters Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            {/* Beneficiaries Filter */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Beneficiaries
              </label>
              <div className="flex gap-2">
                <Button
                  variant={
                    filter.hasBeneficiaries === "all" ? "default" : "outline"
                  }
                  size="sm"
                  onClick={() =>
                    setFilter({ ...filter, hasBeneficiaries: "all" })
                  }
                >
                  All
                </Button>
                <Button
                  variant={
                    filter.hasBeneficiaries === "with" ? "default" : "outline"
                  }
                  size="sm"
                  onClick={() =>
                    setFilter({ ...filter, hasBeneficiaries: "with" })
                  }
                  className="flex items-center gap-2"
                >
                  <Users className="h-4 w-4" />
                  With Beneficiaries
                </Button>
                <Button
                  variant={
                    filter.hasBeneficiaries === "without"
                      ? "default"
                      : "outline"
                  }
                  size="sm"
                  onClick={() =>
                    setFilter({ ...filter, hasBeneficiaries: "without" })
                  }
                  className="flex items-center gap-2"
                >
                  <User className="h-4 w-4" />
                  Without Beneficiaries
                </Button>
              </div>
            </div>

            {/* Payment Status Filter */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Payment Status
              </label>
              <div className="flex gap-2">
                <Button
                  variant={
                    filter.paymentStatus === "all" ? "default" : "outline"
                  }
                  size="sm"
                  onClick={() => setFilter({ ...filter, paymentStatus: "all" })}
                >
                  All
                </Button>
                <Button
                  variant={
                    filter.paymentStatus === "pending" ? "default" : "outline"
                  }
                  size="sm"
                  onClick={() =>
                    setFilter({ ...filter, paymentStatus: "pending" })
                  }
                  className="flex items-center gap-2"
                >
                  <Clock className="h-4 w-4 text-yellow-600" />
                  Pending
                </Button>
                <Button
                  variant={
                    filter.paymentStatus === "overdue" ? "default" : "outline"
                  }
                  size="sm"
                  onClick={() =>
                    setFilter({ ...filter, paymentStatus: "overdue" })
                  }
                  className="flex items-center gap-2"
                >
                  <AlertCircle className="h-4 w-4 text-red-600" />
                  Overdue
                </Button>
              </div>
            </div>
          </div>

          {/* Active Filters Display */}
          {Object.values(filter).some(
            (value) => value !== "all" && value !== ""
          ) && (
            <div className="mt-4 p-3 bg-blue-50 rounded-md">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-medium text-blue-800">
                    Active Filters:
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={resetFilters}
                  className="text-blue-600 hover:text-blue-800"
                >
                  Clear All
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {filter.status !== "all" && (
                  <Badge variant="secondary" className="bg-blue-100">
                    Status: {filter.status}
                  </Badge>
                )}
                {filter.productType !== "all" && (
                  <Badge variant="secondary" className="bg-blue-100">
                    Type: {filter.productType}
                  </Badge>
                )}
                {filter.paymentFrequency !== "all" && (
                  <Badge variant="secondary" className="bg-blue-100">
                    Frequency: {filter.paymentFrequency}
                  </Badge>
                )}
                {filter.premiumRange !== "all" && (
                  <Badge variant="secondary" className="bg-blue-100">
                    Premium: {filter.premiumRange}
                  </Badge>
                )}
                {/* {filter.region !== "all" && (
                  <Badge variant="secondary" className="bg-blue-100">
                    Region: {filter.region}
                  </Badge>
                )} */}
                {filter.validity !== "all" && (
                  <Badge variant="secondary" className="bg-blue-100">
                    Validity: {filter.validity}
                  </Badge>
                )}
                {filter.hasBeneficiaries !== "all" && (
                  <Badge variant="secondary" className="bg-blue-100">
                    Beneficiaries:{" "}
                    {filter.hasBeneficiaries === "with" ? "With" : "Without"}
                  </Badge>
                )}
                {filter.paymentStatus !== "all" && (
                  <Badge variant="secondary" className="bg-blue-100">
                    Payment: {filter.paymentStatus}
                  </Badge>
                )}
                {filter.searchTerm && (
                  <Badge variant="secondary" className="bg-blue-100">
                    Search: "{filter.searchTerm}"
                  </Badge>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Results Summary */}
      <div className="mb-4 flex items-center justify-between">
        <div className="text-sm text-gray-600">
          Showing {filteredPolicies?.length || 0} of {allPolicies?.length || 0}{" "}
          policies
          {filteredPolicies?.length !== allPolicies?.length && " (filtered)"}
        </div>
        <div className="text-sm text-gray-500">
          Last updated:{" "}
          {new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-gray-50">
                  <th className="text-left p-4 font-medium">Policy Number</th>
                  <th className="text-left p-4 font-medium">Customer</th>
                  <th className="text-left p-3 font-medium">Product Type</th>
                  <th className="text-center p-4 font-medium">Status</th>
                  <th className="text-left p-4 font-medium">Total Premium</th>
                  <th className="text-left p-4 font-medium">Next Payment</th>
                  <th className="text-left p-4 font-medium">Start Date</th>
                  <th className="text-left p-4 font-medium">End Date</th>
                  <th className="text-left p-4 font-medium">Beneficiaries</th>
                  <th className="text-left p-4 font-medium">Created By</th>
                  <th className="text-left p-4 font-medium">Last Updated</th>
                  <th className="text-left p-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredPolicies?.map((policy) => {
                  const nextPayment = getNextPendingPayment(policy);

                  return (
                    <tr key={policy.id} className="border-b hover:bg-gray-50">
                      <td className="p-4 font-medium">{policy.policyNumber}</td>
                      <td className="p-4">
                        <div className="font-medium">
                          {policy.policyHolderName}
                        </div>
                        {policy.policyHolderEmail && (
                          <div className="text-sm text-gray-500">
                            {policy.policyHolderEmail}
                          </div>
                        )}
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          {getProductTypeIcon(policy.productType)}
                          {policy.productType}
                        </div>
                        {policy.displayName && (
                          <div className="text-xs text-gray-500 mt-1">
                            {policy.displayName}
                          </div>
                        )}
                      </td>
                      <td className="p-4 text-center">
                        {getStatusBadge(policy.status)}
                      </td>
                      <td className="flex flex-col p-4">
                        <span>
                          {policy.premium}/
                          <span className="text-gray-400 text-sm">
                            {policy.currency}
                          </span>
                        </span>
                      </td>

                      {/* Next Payment Column */}
                      <td className="p-4">
                        {nextPayment ? (
                          <div className="space-y-1">
                            <div className="font-medium">
                              {nextPayment.dueAmount} {policy.currency}
                            </div>
                            <div className="text-xs text-gray-500">
                              {policy.paymentFrequency}
                            </div>
                            <div className="text-xs text-gray-500">
                              Due: {formatDate(nextPayment.dueDate)}
                            </div>
                            {nextPayment.status && (
                              <Badge
                                variant="outline"
                                className={
                                  nextPayment.status === "OVERDUE"
                                    ? "text-red-500 border-red-200"
                                    : "text-green-500 border-green-200"
                                }
                              >
                                {nextPayment.status}
                              </Badge>
                            )}
                          </div>
                        ) : (
                          <span className="text-gray-400">
                            No pending payments
                          </span>
                        )}
                      </td>

                      <td className="p-4 text-sm">
                        {formatDate(policy.validityPeriod?.effectiveDate)}
                      </td>
                      <td className="p-4 text-sm">
                        {formatDate(policy.validityPeriod?.expirationDate)}
                      </td>
                      <td className="p-4">
                        {policy.beneficiaries &&
                        policy.beneficiaries.length > 0 ? (
                          <div className="space-y-1">
                            {policy.beneficiaries.map((bene, idx) => (
                              <div key={idx} className="text-sm">
                                <span className="font-medium">{bene.name}</span>
                                {bene.relationship && (
                                  <span className="text-gray-500">
                                    {" "}
                                    ({bene.relationship})
                                  </span>
                                )}
                                {bene.dateOfBirth && (
                                  <span className="text-gray-400 text-xs block">
                                    DOB: {formatDate(bene.dateOfBirth)}
                                  </span>
                                )}
                              </div>
                            ))}
                          </div>
                        ) : (
                          <span className="text-gray-400">—</span>
                        )}
                      </td>
                      <td className="p-4 text-sm">
                        {policy.createdBy || "System"}
                      </td>
                      <td className="p-4 text-sm">
                        {formatDateTime(policy.updatedAt)}
                      </td>
                      <td className="p-4">
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditClick(policy)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {filteredPolicies?.length === 0 && (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <FileText className="h-12 w-12 mx-auto" />
                </div>
                <p className="text-gray-500">No policies found</p>
                {searchTerm && (
                  <p className="text-sm text-gray-400 mt-1">
                    Try adjusting your search terms or filters
                  </p>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Edit Policy Modal */}
      {isEditModalOpen && selectedPolicy && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto p-6">
            <div className="space-y-6">
              <h2 className="text-xl font-semibold mb-4">
                Edit Policy: {selectedPolicy.policyNumber}
              </h2>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Left Column - Policy Details & Cancellation */}
                <div className="space-y-6">
                  {/* Policy Details Card */}
                  <div className="border rounded-lg p-4">
                    <h3 className="text-lg font-medium border-b pb-2 mb-4">
                      Policy Details
                    </h3>

                    {/* Policy Status with Dynamic Options */}
                    <div className="mb-4">
                      <label className="block text-sm font-medium mb-2">
                        Policy Status
                      </label>
                      <div className="space-y-2">
                        {/* Current Status Display */}
                        <div className="text-sm text-gray-500 mb-1">
                          Current:{" "}
                          <Badge variant="outline" className="ml-2">
                            {selectedPolicy.status}
                          </Badge>
                        </div>

                        {/* Status Dropdown */}
                        <select
                          value={editFormData.status}
                          onChange={(e) =>
                            handleInputChange("status", e.target.value)
                          }
                          className="w-full p-2 border rounded-md"
                          disabled={selectedPolicy.status === "CANCELLED"}
                        >
                          {/* Current status option */}
                          <option value={selectedPolicy.status}>
                            Keep as {selectedPolicy.status}
                          </option>

                          {/* Only show valid transitions */}
                          {getValidStatusTransitions(selectedPolicy.status).map(
                            (transition) => (
                              <option
                                key={transition.value}
                                value={transition.value}
                              >
                                Change to {transition.label}
                              </option>
                            )
                          )}
                        </select>

                        {/* Help text for valid transitions */}
                        {selectedPolicy.status !== "CANCELLED" && (
                          <div className="text-xs text-gray-500 mt-1">
                            Valid transitions:{" "}
                            {getValidStatusTransitions(selectedPolicy.status)
                              .map((t) => t.label)
                              .join(", ") || "None"}
                          </div>
                        )}

                        {/* Special warning for CANCELLED status */}
                        {selectedPolicy.status === "CANCELLED" && (
                          <div className="text-xs text-red-500 mt-1">
                            This policy is cancelled and cannot be reactivated.
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Status Change Notes (ALWAYS SHOWN) */}
                    <div className="mb-4">
                      <label className="block text-sm font-medium mb-2">
                        Status Change Notes
                      </label>
                      <textarea
                        value={editFormData.statusChangeNotes || ""}
                        onChange={(e) =>
                          handleInputChange("statusChangeNotes", e.target.value)
                        }
                        className="w-full p-2 border rounded-md text-sm"
                        placeholder="Notes about this status change"
                        rows={2}
                      />
                    </div>

                    {/* Premium Amount */}
                    <div className="mb-4">
                      <label className="block text-sm font-medium mb-2">
                        Premium Amount
                      </label>
                      <Input
                        type="number"
                        value={editFormData.premium}
                        onChange={(e) =>
                          handleInputChange("premium", e.target.value)
                        }
                        className="w-full"
                      />
                    </div>

                    {/* Payment Frequency */}
                    <div className="mb-4">
                      <label className="block text-sm font-medium mb-2">
                        Payment Frequency
                      </label>
                      <select
                        value={editFormData.paymentFrequency}
                        onChange={(e) =>
                          handleInputChange("paymentFrequency", e.target.value)
                        }
                        className="w-full p-2 border rounded-md"
                      >
                        <option value="MONTHLY">Monthly</option>
                        <option value="QUARTERLY">Quarterly</option>
                        <option value="ANNUAL">Annual</option>
                      </select>
                    </div>

                    {/* Coverage Period */}
                    <div className="space-y-3">
                      <label className="block text-sm font-medium">
                        Coverage Period
                      </label>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs text-gray-500 mb-1">
                            Effective Date
                          </label>
                          <Input
                            type="date"
                            value={editFormData.effectiveDate}
                            onChange={(e) =>
                              handleInputChange("effectiveDate", e.target.value)
                            }
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-500 mb-1">
                            Expiration Date
                          </label>
                          <Input
                            type="date"
                            value={editFormData.expirationDate}
                            onChange={(e) =>
                              handleInputChange(
                                "expirationDate",
                                e.target.value
                              )
                            }
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Cancellation Fields (conditional) */}
                  {editFormData.status === "CANCELLED" && (
                    <div className="border rounded-lg p-4 bg-red-50">
                      <h3 className="text-lg font-medium text-red-700 border-b pb-2 mb-4">
                        Cancellation Details
                      </h3>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-red-700 mb-2">
                            Cancellation Reason (Required)
                          </label>
                          <textarea
                            value={editFormData.cancellationReason || ""}
                            onChange={(e) =>
                              handleInputChange(
                                "cancellationReason",
                                e.target.value
                              )
                            }
                            className="w-full p-2 border rounded-md text-sm border-red-300"
                            placeholder="Enter reason for cancellation"
                            rows={3}
                            required
                          />
                        </div>
                        {/* <div>
                          <label className="block text-sm font-medium text-red-700 mb-2">
                            Cancellation Date
                          </label>
                          <Input
                            type="date"
                            value={
                              editFormData.cancellationDate ||
                              formatDateForInput(new Date())
                            }
                            onChange={(e) =>
                              handleInputChange(
                                "cancellationDate",
                                e.target.value
                              )
                            }
                            className="w-full border-red-300"
                          />
                        </div> */}
                      </div>
                    </div>
                  )}
                </div>

                {/* Right Column - Audit Trail & Beneficiaries */}
                <div className="space-y-6">
                  {/* Audit Trail Section */}
                  <div className="border rounded-lg p-4 bg-gray-50">
                    <h3 className="text-lg font-medium border-b pb-2 mb-4">
                      Audit Trail
                    </h3>

                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between py-1 border-b">
                        <span className="text-gray-600">Created By:</span>
                        <span className="font-medium">
                          {selectedPolicy.createdBy || "System"}
                        </span>
                      </div>
                      <div className="flex justify-between py-1 border-b">
                        <span className="text-gray-600">Created At:</span>
                        <span>{formatDateTime(selectedPolicy.createdAt)}</span>
                      </div>
                      <div className="flex justify-between py-1 border-b">
                        <span className="text-gray-600">Last Updated By:</span>
                        <span className="font-medium">
                          {selectedPolicy.updatedBy || "—"}
                        </span>
                      </div>
                      <div className="flex justify-between py-1 border-b">
                        <span className="text-gray-600">Last Updated At:</span>
                        <span>{formatDateTime(selectedPolicy.updatedAt)}</span>
                      </div>

                      {/* Cancellation audit info */}
                      {selectedPolicy.cancelledBy && (
                        <>
                          <div className="flex justify-between py-1 border-b">
                            <span className="text-gray-600">Cancelled By:</span>
                            <span className="font-medium text-red-600">
                              {selectedPolicy.cancelledBy}
                            </span>
                          </div>
                          <div className="flex justify-between py-1">
                            <span className="text-gray-600">
                              Cancellation Date:
                            </span>
                            <span className="text-red-600">
                              {formatDateTime(selectedPolicy.cancellationDate)}
                            </span>
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Beneficiaries Section */}
                  <div className="border rounded-lg p-4">
                    <div className="flex justify-between items-center border-b pb-4 mb-4">
                      <h3 className="text-lg font-medium">Beneficiaries</h3>
                      <button
                        type="button"
                        onClick={handleAddBeneficiary}
                        className="flex items-center gap-1 px-3 py-1 bg-black text-white text-sm rounded"
                      >
                        Add Beneficiary
                      </button>
                    </div>

                    <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
                      {beneficiaries.length > 0 ? (
                        beneficiaries.map((beneficiary, index) => (
                          <div
                            key={index}
                            className="border rounded-lg p-3 space-y-2"
                          >
                            <div className="flex justify-between items-start">
                              <h4 className="font-medium text-sm">
                                Beneficiary {index + 1}
                              </h4>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => handleRemoveBeneficiary(index)}
                                className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>

                            <div className="space-y-2">
                              <div>
                                <label className="block text-xs text-gray-500 mb-1">
                                  Full Name
                                </label>
                                <Input
                                  value={beneficiary.name}
                                  onChange={(e) =>
                                    handleBeneficiaryChange(
                                      index,
                                      "name",
                                      e.target.value
                                    )
                                  }
                                  placeholder="Enter full name"
                                  className="w-full text-sm"
                                />
                              </div>

                              <div>
                                <label className="block text-xs text-gray-500 mb-1">
                                  Relationship
                                </label>
                                <select
                                  value={beneficiary.relationship || ""}
                                  onChange={(e) =>
                                    handleBeneficiaryChange(
                                      index,
                                      "relationship",
                                      e.target.value
                                    )
                                  }
                                  className="w-full p-2 border rounded-md text-sm"
                                >
                                  <option value="">Select Relationship</option>
                                  <option value="SPOUSE">Spouse</option>
                                  <option value="CHILD">Child</option>
                                  <option value="PARENT">Parent</option>
                                  <option value="SIBLING">Sibling</option>
                                  <option value="OTHER">Other</option>
                                </select>
                              </div>

                              <div>
                                <label className="block text-xs text-gray-500 mb-1">
                                  Date of Birth
                                </label>
                                <Input
                                  type="date"
                                  value={
                                    beneficiary.dateOfBirth
                                      ? formatDateForInput(
                                          beneficiary.dateOfBirth
                                        )
                                      : ""
                                  }
                                  onChange={(e) =>
                                    handleBeneficiaryChange(
                                      index,
                                      "dateOfBirth",
                                      e.target.value
                                    )
                                  }
                                  className="w-full text-sm"
                                />
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-8 text-gray-500">
                          <p className="text-sm">No beneficiaries added</p>
                          <p className="text-xs mt-1">
                            Click "Add Beneficiary" to add one
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer buttons */}
              <div className="flex justify-end gap-3 pt-6 border-t">
                <button
                  className="px-4 py-2 border rounded-md hover:bg-gray-50"
                  onClick={() => setIsEditModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveChanges}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminAllPolicies;
