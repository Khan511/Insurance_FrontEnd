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
import toast from "react-hot-toast";

import {
  useGetAllClaimsQuery,
  useApproveClaimMutation,
  useRejectClaimMutation,
  useMarkClaimAsPaidMutation,
  useUpdateClaimMutation,
} from "@/services/AdminSlice";

import {
  Edit,
  Eye,
  Search,
  FileText,
  MapPin,
  User,
  Calendar,
  Save,
  X,
  CheckCircle,
  XCircle,
  DollarSign,
  Clock,
  UserCircle,
  Building,
  AlertCircle,
  Filter,
  RefreshCw,
  FileCheck,
  FileX,
  Hourglass,
  ShieldAlert,
  CheckSquare,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useFileDownload } from "@/components/mypage/myClaims/useFileDownlaod";
import type { ClaimApiResponse } from "../claim/Types";
import { getTimeDifferenceInHours } from "@/utils/Utils";
import AdminClaimDetails from "./AdminClaimDetails";
import { Link } from "react-router-dom";

// Edit form type
type EditClaimForm = {
  status: string;
  claimId: string;
  incidentDetails: {
    description: string;
    claimAmount: string | null;
    policeReportNumber: string;
    location: {
      street: string;
      city: string;
      postalCode: string;
      country: string;
    };
    thirdPartyInvolved: boolean;
    thirdPartyDetails: {
      name: string;
      contactInfo: string;
      insuranceInfo: string;
    };
  };
};

// Modal types for specific actions
type ActionModalType = "approve" | "reject" | "pay" | "details" | "edit";

// Filter type
type ClaimFilter = {
  status: string;
  timeframe: string;
  amountRange: string;
  processingTime: string;
  claimType: string;
  hasDocuments: string;
  searchTerm: string;
};

const AdminAllClaims = () => {
  const [isUpdating, setIsUpdating] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const { downloadFile, activeKey } = useFileDownload();
  const [selectedClaim, setSelectedClaim] = useState<ClaimApiResponse | null>(
    null
  );
  const [activeModal, setActiveModal] = useState<ActionModalType | null>(null);
  const [editForm, setEditForm] = useState<EditClaimForm | null>(null);

  // Filter state
  const [filter, setFilter] = useState<ClaimFilter>({
    status: "all",
    timeframe: "all",
    amountRange: "all",
    processingTime: "all",
    claimType: "all",
    hasDocuments: "all",
    searchTerm: "",
  });

  // Action form states
  const [approveAmount, setApproveAmount] = useState<string>("");
  const [rejectionReason, setRejectionReason] = useState<string>("");
  const [actionNotes, setActionNotes] = useState<string>("");

  const {
    data: allClaimsResponse,
    refetch,
    isLoading,
    fulfilledTimeStamp,
  } = useGetAllClaimsQuery({
    sortBy: "submissiondate",
    sortDirection: "DESC",
  });

  const [updateClaim] = useUpdateClaimMutation();
  const [approveClaim, { isLoading: isApproving }] = useApproveClaimMutation();
  const [rejectClaim, { isLoading: isRejecting }] = useRejectClaimMutation();
  const [markClaimAsPaid, { isLoading: isPaying }] =
    useMarkClaimAsPaidMutation();

  // Correctly access the claims array from the response
  const allClaims: ClaimApiResponse[] = allClaimsResponse || [];

  // Get unique claim types for filter
  const uniqueClaimTypes = Array.from(
    new Set(allClaims.map((claim) => claim.claimType))
  );

  // Apply filters
  const filteredClaims = allClaims?.filter((claim) => {
    // Search filter (unchanged)
    if (
      filter.searchTerm &&
      !(
        claim.claimNumber
          .toLowerCase()
          .includes(filter.searchTerm.toLowerCase()) ||
        claim.policyNumber
          .toLowerCase()
          .includes(filter.searchTerm.toLowerCase()) ||
        claim.incidentDetails.type
          .toLowerCase()
          .includes(filter.searchTerm.toLowerCase()) ||
        claim.customerName
          ?.toLowerCase()
          .includes(filter.searchTerm.toLowerCase()) ||
        claim.customerEmail
          ?.toLowerCase()
          .includes(filter.searchTerm.toLowerCase())
      )
    ) {
      return false;
    }

    // Status filter (unchanged)
    if (filter.status !== "all" && claim.status !== filter.status) {
      return false;
    }

    // Claim type filter (unchanged)
    if (filter.claimType !== "all" && claim.claimType !== filter.claimType) {
      return false;
    }

    // Documents filter (unchanged)
    if (filter.hasDocuments !== "all") {
      const hasDocs = claim.documents.length > 0;
      if (filter.hasDocuments === "with" && !hasDocs) return false;
      if (filter.hasDocuments === "without" && hasDocs) return false;
    }

    // Processing time filter (unchanged)
    if (filter.processingTime !== "all" && claim.processingDays !== null) {
      const days = claim.processingDays;
      switch (filter.processingTime) {
        case "under7":
          if (days > 7) return false;
          break;
        case "7to14":
          if (days < 7 || days > 14) return false;
          break;
        case "over14":
          if (days <= 14) return false;
          break;
        case "notStarted":
          if (days > 0) return false;
          break;
      }
    }

    // AMOUNT RANGE FILTER - FIXED VERSION
    if (filter.amountRange !== "all") {
      // Determine which amount to use for filtering
      let amountToCheck: number | null = null;

      // For approved/rejected/paid/closed claims, use approvedAmount if available
      if (["APPROVED", "REJECTED", "PAID", "CLOSED"].includes(claim.status)) {
        if (
          claim.approvedAmount !== null &&
          claim.approvedAmount !== undefined
        ) {
          amountToCheck = claim.approvedAmount;
        }
      }

      // If no approvedAmount or not applicable status, use claimed amount
      if (
        amountToCheck === null &&
        claim.incidentDetails.claimAmount !== null
      ) {
        amountToCheck = Number(claim.incidentDetails.claimAmount);
      }

      // Apply the filter if we have an amount
      if (amountToCheck !== null) {
        switch (filter.amountRange) {
          case "under1000":
            if (amountToCheck >= 1000) return false;
            break;
          case "1000to5000":
            if (amountToCheck < 1000 || amountToCheck > 5000) return false;
            break;
          case "over5000":
            if (amountToCheck <= 5000) return false;
            break;
        }
      }
    }

    // Timeframe filter
    if (filter.timeframe !== "all" && claim.submissionDate) {
      const hoursDiff = getTimeDifferenceInHours(claim.submissionDate);

      switch (filter.timeframe) {
        case "today":
          if (hoursDiff > 24) return false;
          break;
        case "week":
          if (hoursDiff > 168) return false; // 7 * 24
          break;
        case "month":
          if (hoursDiff > 720) return false; // 30 * 24
          break;
        case "quarter":
          if (hoursDiff > 2160) return false; // 90 * 24
          break;
      }
    }

    return true;
  });

  const getLastUpdatedTime = () => {
    if (fulfilledTimeStamp) {
      return new Date(fulfilledTimeStamp).toLocaleTimeString();
    }
    return "Never";
  };

  // Get status counts for badge display
  const getStatusCounts = () => {
    const counts: Record<string, number> = {
      all: allClaims.length,
      PENDING: 0,
      APPROVED: 0,
      REJECTED: 0,
      UNDER_REVIEW: 0,
      PAUSED: 0,
      PAID: 0,
      CLOSED: 0,
    };

    allClaims.forEach((claim) => {
      if (counts[claim.status] !== undefined) {
        counts[claim.status]++;
      }
    });

    return counts;
  };

  const statusCounts = getStatusCounts();

  // Reset all filters
  const resetFilters = () => {
    setFilter({
      status: "all",
      timeframe: "all",
      amountRange: "all",
      processingTime: "all",
      claimType: "all",
      hasDocuments: "all",
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

  console.log("Selected Claim: ", selectedClaim);

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      PENDING: {
        color: "bg-yellow-100 text-yellow-800 border-yellow-200",
        label: "Pending",
        icon: <Clock className="h-3 w-3 mr-1" />,
      },
      APPROVED: {
        color: "bg-green-100 text-green-800 border-green-200",
        label: "Approved",
        icon: <CheckCircle className="h-3 w-3 mr-1" />,
      },
      REJECTED: {
        color: "bg-red-100 text-red-800 border-red-200",
        label: "Rejected",
        icon: <XCircle className="h-3 w-3 mr-1" />,
      },
      UNDER_REVIEW: {
        color: "bg-blue-100 text-blue-800 border-blue-200",
        label: "Under Review",
        icon: <Eye className="h-3 w-3 mr-1" />,
      },
      PAUSED: {
        color: "bg-purple-100 text-purple-800 border-purple-200",
        label: "Paused",
        icon: <AlertCircle className="h-3 w-3 mr-1" />,
      },
      PAID: {
        color: "bg-emerald-100 text-emerald-800 border-emerald-200",
        label: "Paid",
        icon: <DollarSign className="h-3 w-3 mr-1" />,
      },
      CLOSED: {
        color: "bg-gray-100 text-gray-800 border-gray-200",
        label: "Closed",
        icon: <CheckCircle className="h-3 w-3 mr-1" />,
      },
      WITHDRAWN: {
        color: "bg-slate-100 text-slate-800 border-slate-200",
        label: "Withdrawn",
        icon: <X className="h-3 w-3 mr-1" />,
      },
      CANCELLED: {
        color: "bg-orange-100 text-orange-800 border-orange-200",
        label: "Cancelled",
        icon: <XCircle className="h-3 w-3 mr-1" />,
      },
    };

    const config =
      statusConfig[status as keyof typeof statusConfig] || statusConfig.PENDING;
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

  const handleDownload = (fileKey: string | null, fileName: string) => {
    if (fileKey) {
      downloadFile(fileKey, fileName);
    }
  };

  const getClaimTypeBadge = (claimType: string) => {
    const typeConfig = {
      HOME_DAMAGE: {
        color: "bg-orange-100 text-orange-800",
        label: "Home Damage",
      },
      FIRE: {
        color: "bg-red-100 text-red-800",
        label: "Fire",
      },
      THEFT: {
        color: "bg-gray-100 text-gray-800",
        label: "Theft",
      },
      WATER_DAMAGE: {
        color: "bg-cyan-100 text-cyan-800",
        label: "Water Damage",
      },
      AUTOMOBILE_COLLISION: {
        color: "bg-blue-100 text-blue-800",
        label: "Auto Collision",
      },
      HEALTH_HOSPITALIZATION: {
        color: "bg-purple-100 text-purple-800",
        label: "Health",
      },
    };

    const config = typeConfig[claimType as keyof typeof typeConfig] || {
      color: "bg-gray-100 text-gray-800",
      label: claimType.replace(/_/g, " "),
    };

    return (
      <Badge variant="secondary" className={config.color}>
        {config.label}
      </Badge>
    );
  };

  type DateTuple = [number, number, number, number?, number?];

  function formatDate(dateInput: string | DateTuple, locale = "en-GB"): string {
    let date: Date;

    if (typeof dateInput === "string") {
      date = new Date(dateInput);
    } else {
      // Handle DateTuple case
      const [y, m, d, h = 0, min = 0] = dateInput;
      date = new Date(y, m - 1, d, h, min);
    }

    return date.toLocaleDateString(locale, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }

  const formatCurrency = (amount: number | null | undefined) => {
    if (amount === null || amount === undefined) return "Not specified";
    return new Intl.NumberFormat("da-DK", {
      style: "currency",
      currency: "DKK",
    }).format(amount);
  };

  const handleViewClaim = (claim: ClaimApiResponse) => {
    setSelectedClaim(claim);
    setActiveModal("details");
  };

  const handleEditClaim = (claim: ClaimApiResponse) => {
    setSelectedClaim(claim);
    setEditForm({
      status: claim.status,
      claimId: claim.claimNumber,
      incidentDetails: {
        description: claim.incidentDetails.description,
        claimAmount: claim.incidentDetails.claimAmount?.toString() || null,
        policeReportNumber: claim.incidentDetails.policeReportNumber || "",
        location: { ...claim.incidentDetails.location },
        thirdPartyInvolved: claim.incidentDetails.thirdPartyInvolved,
        thirdPartyDetails: claim.incidentDetails.thirdPartyInvolved
          ? { ...claim.incidentDetails.thirdPartyDetails }
          : { name: "", contactInfo: "", insuranceInfo: "" },
      },
    });
    setActiveModal("edit");
  };

  const handleActionModal = (
    claim: ClaimApiResponse,
    action: ActionModalType
  ) => {
    setSelectedClaim(claim);
    setActiveModal(action);

    // Reset form values
    if (action === "approve") {
      setApproveAmount("");
    } else if (action === "reject") {
      setRejectionReason("");
    }
  };

  const handleApproveClaim = async () => {
    if (!selectedClaim || !approveAmount) return;

    try {
      await approveClaim({
        claimId: selectedClaim.id,
        approvedAmount: parseFloat(approveAmount),
        notes: actionNotes,
      }).unwrap();

      refetch();
      setActiveModal(null);
      setApproveAmount("");
      setActionNotes("");
    } catch (error) {
      console.error("Failed to approve claim:", error);
    }
  };

  const handleRejectClaim = async () => {
    if (!selectedClaim || !rejectionReason.trim()) return;

    try {
      await rejectClaim({
        claimId: selectedClaim.id,
        rejectionReason,
        notes: actionNotes,
      }).unwrap();

      refetch();
      setActiveModal(null);
      setRejectionReason("");
      setActionNotes("");
    } catch (error) {
      console.error("Failed to reject claim:", error);
    }
  };

  const handleMarkAsPaid = async () => {
    if (!selectedClaim) return;

    try {
      await markClaimAsPaid({
        claimId: selectedClaim.id,
        notes: actionNotes,
      }).unwrap();

      refetch();
      setActiveModal(null);
      setActionNotes("");
    } catch (error) {
      console.error("Failed to mark claim as paid:", error);
    }
  };

  console.log("All Claims:", allClaimsResponse);

  const handleSaveClaim = async () => {
    if (!selectedClaim || !editForm) return;

    // Basic validation
    if (!editForm.incidentDetails.description.trim()) {
      alert("Incident description is required");
      return;
    }

    if (
      !editForm.incidentDetails.location.street.trim() ||
      !editForm.incidentDetails.location.city.trim() ||
      !editForm.incidentDetails.location.postalCode.trim() ||
      !editForm.incidentDetails.location.country.trim()
    ) {
      alert("Complete location details are required");
      return;
    }

    // If third party is involved, validate their details
    if (
      editForm.incidentDetails.thirdPartyInvolved &&
      (!editForm.incidentDetails.thirdPartyDetails.name.trim() ||
        !editForm.incidentDetails.thirdPartyDetails.contactInfo.trim())
    ) {
      alert("Third party name and contact information are required");
      return;
    }

    setIsUpdating(true);

    try {
      const updateData = {
        claimId: selectedClaim.claimNumber,
        status: editForm.status,
        policyNumber: selectedClaim.policyNumber,
        incidentDetails: {
          description: editForm.incidentDetails.description,
          claimAmount: editForm.incidentDetails.claimAmount
            ? parseFloat(editForm.incidentDetails.claimAmount)
            : undefined,
          policeReportNumber:
            editForm.incidentDetails.policeReportNumber || undefined,
          location: {
            street: editForm.incidentDetails.location.street,
            city: editForm.incidentDetails.location.city,
            postalCode: editForm.incidentDetails.location.postalCode,
            country: editForm.incidentDetails.location.country,
          },
          thirdPartyInvolved: editForm.incidentDetails.thirdPartyInvolved,
          thirdPartyDetails: editForm.incidentDetails.thirdPartyInvolved
            ? {
                name: editForm.incidentDetails.thirdPartyDetails.name || "",
                contactInfo:
                  editForm.incidentDetails.thirdPartyDetails.contactInfo || "",
                insuranceInfo:
                  editForm.incidentDetails.thirdPartyDetails.insuranceInfo ||
                  "",
              }
            : undefined,
        },
      };

      await updateClaim({ updates: updateData }).unwrap();

      toast.success("Claim updated successfully!");
      refetch();
      setActiveModal(null);
      setEditForm(null);
    } catch (error) {
      console.error("Failed to update claim:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  const getProcessingTimeColor = (days: number | null) => {
    if (days === null) return "text-gray-500";
    if (days <= 7) return "text-green-600";
    if (days <= 14) return "text-yellow-600";
    return "text-red-600";
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading claims...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-2">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            Claims Management
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            Total Claims: {allClaims.length} | Open:{" "}
            {allClaims.filter((c) => c.isOpen).length} | Processed:{" "}
            {allClaims.filter((c) => c.isProcessed).length}
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
      <Card className="mb-4">
        <CardContent className="p-2">
          <div className="flex flex-col md:flex-row md:items-center gap-3">
            {/* Search */}
            <div className="relative flex-1 flex items-center ">
              <Search className="absolute left-2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search claims by ID, policy, customer, or type..."
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
                <SelectContent>
                  <SelectItem value="all">
                    <div className="flex justify-between w-full gap-1">
                      <span>All Statuses</span>
                      <Badge variant="outline">{statusCounts.all}</Badge>
                    </div>
                  </SelectItem>
                  <SelectItem value="PENDING">
                    <div className="flex justify-between w-full gap-1">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-yellow-600" />
                        <span>Pending</span>
                      </div>
                      <Badge variant="outline">{statusCounts.PENDING}</Badge>
                    </div>
                  </SelectItem>
                  <SelectItem value="UNDER_REVIEW">
                    <div className="flex justify-between w-full gap-1">
                      <div className="flex items-center gap-2">
                        <Eye className="h-4 w-4 text-blue-600" />
                        <span>Under Review</span>
                      </div>
                      <Badge variant="outline">
                        {statusCounts.UNDER_REVIEW}
                      </Badge>
                    </div>
                  </SelectItem>
                  <SelectItem value="UNDER_INVESTIGATION">
                    <div className="flex justify-between w-full gap-1">
                      <div className="flex items-center gap-2">
                        <ShieldAlert className="h-4 w-4 text-purple-600" />
                        <span>Investigation</span>
                      </div>
                      <Badge variant="outline">
                        {statusCounts.UNDER_INVESTIGATION}
                      </Badge>
                    </div>
                  </SelectItem>
                  <SelectItem value="APPROVED">
                    <div className="flex justify-between w-full gap-1">
                      <div className="flex items-center gap-2">
                        <CheckSquare className="h-4 w-4 text-green-600" />
                        <span>Approved</span>
                      </div>
                      <Badge variant="outline">{statusCounts.APPROVED}</Badge>
                    </div>
                  </SelectItem>
                  <SelectItem value="REJECTED">
                    <div className="flex justify-between w-full gap-1">
                      <div className="flex items-center gap-2">
                        <FileX className="h-4 w-4 text-red-600" />
                        <span>Rejected</span>
                      </div>
                      <Badge variant="outline">{statusCounts.REJECTED}</Badge>
                    </div>
                  </SelectItem>
                  <SelectItem value="PAID">
                    <div className="flex justify-between w-full gap-1">
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4 text-emerald-600" />
                        <span>Paid</span>
                      </div>
                      <Badge variant="outline">{statusCounts.PAID}</Badge>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Claim Type Filter */}
            <div className="w-full md:w-60">
              <Select
                value={filter.claimType}
                onValueChange={(value) =>
                  setFilter({ ...filter, claimType: value })
                }
              >
                <SelectTrigger className="w-full">
                  <div className="flex items-center gap-2 w-full">
                    <FileText className="h-4 w-4" />
                    <SelectValue placeholder="Claim Type" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Claim Types</SelectItem>
                  {uniqueClaimTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type.replace(/_/g, " ")}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Advanced Filters Row */}
          <div className="grid grid-cols-1 md:grid-cols-6  mt-4">
            {/* Timeframe Filter */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                Timeframe
              </label>
              <Select
                value={filter.timeframe}
                onValueChange={(value) =>
                  setFilter({ ...filter, timeframe: value })
                }
              >
                <SelectTrigger>
                  <Calendar className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Submission Time" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Time</SelectItem>
                  <SelectItem value="today">Last 24 Hours</SelectItem>
                  <SelectItem value="week">Last 7 Days</SelectItem>
                  <SelectItem value="month">Last 30 Days</SelectItem>
                  <SelectItem value="quarter">Last 90 Days</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Amount Range Filter */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                Claim Amount
              </label>
              <Select
                value={filter.amountRange}
                onValueChange={(value) =>
                  setFilter({ ...filter, amountRange: value })
                }
              >
                <SelectTrigger>
                  <DollarSign className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Amount Range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Amounts</SelectItem>
                  <SelectItem value="under1000">Under 1,000 DKK</SelectItem>
                  <SelectItem value="1000to5000">1,000 - 5,000 DKK</SelectItem>
                  <SelectItem value="over5000">Over 5,000 DKK</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Processing Time Filter */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                Processing Time
              </label>
              <Select
                value={filter.processingTime}
                onValueChange={(value) =>
                  setFilter({ ...filter, processingTime: value })
                }
              >
                <SelectTrigger>
                  <Hourglass className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Processing Time" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="notStarted">
                    Not Started (0 days)
                  </SelectItem>
                  <SelectItem value="under7">Under 7 Days</SelectItem>
                  <SelectItem value="7to14">7-14 Days</SelectItem>
                  <SelectItem value="over14">Over 14 Days</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Documents Filter */}
          <div className="mt-4">
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              Documents
            </label>
            <div className="flex gap-2 ">
              <Button
                variant={filter.hasDocuments === "all" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilter({ ...filter, hasDocuments: "all" })}
              >
                All
              </Button>
              <Button
                variant={filter.hasDocuments === "with" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilter({ ...filter, hasDocuments: "with" })}
                className="flex items-center gap-2"
              >
                <FileCheck className="h-4 w-4" />
                With Documents
              </Button>
              <Button
                variant={
                  filter.hasDocuments === "without" ? "default" : "outline"
                }
                size="sm"
                onClick={() =>
                  setFilter({ ...filter, hasDocuments: "without" })
                }
                className="flex items-center gap-2"
              >
                <FileX className="h-4 w-4" />
                Without Documents
              </Button>
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
                    Status: {filter.status.replace(/_/g, " ")}
                  </Badge>
                )}
                {filter.timeframe !== "all" && (
                  <Badge variant="secondary" className="bg-blue-100">
                    Timeframe: {filter.timeframe}
                  </Badge>
                )}
                {filter.amountRange !== "all" && (
                  <Badge variant="secondary" className="bg-blue-100">
                    Amount: {filter.amountRange}
                  </Badge>
                )}
                {filter.processingTime !== "all" && (
                  <Badge variant="secondary" className="bg-blue-100">
                    Processing: {filter.processingTime}
                  </Badge>
                )}
                {filter.claimType !== "all" && (
                  <Badge variant="secondary" className="bg-blue-100">
                    Type: {filter.claimType.replace(/_/g, " ")}
                  </Badge>
                )}
                {filter.hasDocuments !== "all" && (
                  <Badge variant="secondary" className="bg-blue-100">
                    Documents:{" "}
                    {filter.hasDocuments === "with" ? "With" : "Without"}
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
      <div className="mb-2 flex items-center justify-between">
        <div className="text-sm text-gray-600">
          Showing {filteredClaims?.length || 0} of {allClaims.length} claims
          {filteredClaims?.length !== allClaims.length && " (filtered)"}
        </div>
        <div className="text-sm text-gray-500">
          Last updated: {getLastUpdatedTime()}
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-gray-50">
                  <th className="text-left p-4 font-medium">Claim ID</th>
                  <th className="text-left p-4 font-medium">Policy/Customer</th>
                  <th className="text-left p-4 font-medium">Type</th>
                  <th className="text-left p-4 font-medium">Dates</th>
                  <th className="text-left p-4 font-medium">Amounts</th>
                  <th className="text-left p-4 font-medium">Processing</th>
                  <th className="text-left p-4 font-medium">Status</th>
                  <th className="text-left p-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredClaims?.map((claim) => (
                  <tr key={claim.id} className="border-b hover:bg-gray-50">
                    <td className="p-4">
                      <div className="font-mono text-sm">
                        {claim.claimNumber}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        #{claim.id}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="font-medium">{claim.policyNumber}</div>
                      {claim.customerName && (
                        <div className="text-sm text-gray-600 flex items-center gap-1 mt-1">
                          <UserCircle className="h-3 w-3" />
                          {claim.customerName}
                        </div>
                      )}
                    </td>
                    <td className="p-4">
                      <div className="mb-1">
                        {getClaimTypeBadge(claim.claimType)}
                      </div>
                      {claim.productName && (
                        <div className="text-xs text-gray-500 flex items-center gap-1">
                          <Building className="h-3 w-3" />
                          {claim.productName}
                        </div>
                      )}
                    </td>
                    <td className="p-4">
                      <div className="space-y-1 text-sm">
                        <div>
                          <span className="text-gray-500">Submitted: </span>
                          <p>{formatDate(claim.submissionDate)}</p>
                        </div>
                        {claim.approvedDate && claim.approvedAmount && (
                          <div>
                            <span className="text-gray-500">Approved: </span>
                            <p>{formatDate(claim.approvedDate)}</p>
                          </div>
                        )}
                        {claim.paidDate && (
                          <div>
                            <span className="text-gray-500">Paid: </span>
                            <p>{formatDate(claim.paidDate)}</p>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="space-y-1">
                        <div className="font-medium">
                          {claim.approvedAmount !== null &&
                          claim.approvedAmount !== undefined ? (
                            <div className="text-sm text-green-600">
                              Approved:{" "}
                              <p>{formatCurrency(claim.approvedAmount)}</p>
                            </div>
                          ) : claim.incidentDetails.claimAmount !== null &&
                            claim.incidentDetails.claimAmount !== undefined ? (
                            <div className="text-sm ">
                              Claimed:{" "}
                              <p>
                                {formatCurrency(
                                  Number(claim.incidentDetails.claimAmount)
                                )}
                              </p>
                            </div>
                          ) : (
                            "Not specified"
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="space-y-1">
                        <div
                          className={`font-medium ${getProcessingTimeColor(
                            claim.processingDays
                          )}`}
                        >
                          {claim.processingDays !== null
                            ? `${claim.processingDays} days`
                            : "N/A"}
                        </div>
                        {claim.processedBy && (
                          <div className="text-xs text-gray-500">
                            By: {claim.processedBy}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="p-4">{getStatusBadge(claim.status)}</td>
                    <td className="p-4">
                      <div className="flex flex-col gap-2">
                        <Link
                          to={`/admin/claim-details/${claim?.id}`}
                          className="w-full flex  justify-center items-center border p-1 rounded"
                        >
                          <Eye className="h-3 w-3 mr-2" />
                          View
                        </Link>
                        {claim.status !== "REJECTED" &&
                          claim.status !== "PAID" &&
                          claim.status !== "PAUSED" &&
                          claim.status !== "CANCELLED" && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEditClaim(claim)}
                              className="w-full justify-start text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                            >
                              <Edit className="h-3 w-3 mr-2" />
                              Edit
                            </Button>
                          )}
                        {/* Action buttons based on allowed transitions */}
                        {claim.canBeApproved && claim.status !== "APPROVED" && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleActionModal(claim, "approve")}
                            className="w-full justify-start text-green-600 hover:text-green-700 hover:bg-green-50"
                          >
                            <CheckCircle className="h-3 w-3 mr-2" />
                            Approve
                          </Button>
                        )}

                        {claim.canBeRejected && claim.canBeApproved && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleActionModal(claim, "reject")}
                            className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <XCircle className="h-3 w-3 mr-2" />
                            Reject
                          </Button>
                        )}

                        {claim.canBePaid && claim.status !== "PAID" && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleActionModal(claim, "pay")}
                            className="w-full justify-start text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                          >
                            <DollarSign className="h-3 w-3 mr-2" />
                            Mark Paid
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredClaims?.length === 0 && (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <FileText className="h-12 w-12 mx-auto" />
                </div>
                <p className="text-gray-500">No claims found</p>
                {searchTerm && (
                  <p className="text-sm text-gray-400 mt-1">
                    Try adjusting your search terms
                  </p>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Custom View Modal */}
      <Link to={`/admin/claim-details/${selectedClaim?.id}`}>
        {<AdminClaimDetails />}
      </Link>

      {/* Custom Edit Modal */}
      {activeModal === "edit" && editForm && selectedClaim && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                  <Edit className="h-6 w-6 text-blue-600" />
                  Edit Claim Details
                </h2>
                <p className="text-gray-600 mt-1">
                  Edit claim {selectedClaim.claimNumber} information
                </p>
              </div>
              <button
                onClick={() => {
                  setActiveModal(null);
                  setEditForm(null);
                }}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="space-y-6">
                {/* Basic Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <label className="block text-sm font-medium text-gray-700">
                      Claim Status
                    </label>
                    {selectedClaim.status === "APPROVED" ||
                    selectedClaim.status === "REJECTED" ? (
                      <select
                        value={editForm.status}
                        disabled={["APPROVED", "REJECTED"].includes(
                          editForm.status
                        )}
                        className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          ["APPROVED", "REJECTED"].includes(editForm.status)
                            ? "bg-gray-100 cursor-not-allowed"
                            : ""
                        }`}
                      >
                        <option value="APPROVED">Approved</option>
                        <option value="REJECTED">Rejected</option>
                      </select>
                    ) : (
                      <select
                        value={editForm.status}
                        onChange={(e) =>
                          setEditForm({ ...editForm, status: e.target.value })
                        }
                        disabled={["APPROVED", "REJECTED"].includes(
                          editForm.status
                        )}
                        className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          ["APPROVED", "REJECTED"].includes(editForm.status)
                            ? "bg-gray-100 cursor-not-allowed"
                            : ""
                        }`}
                      >
                        <option value="PENDING">Pending</option>
                        <option value="UNDER_REVIEW">Under Review</option>
                      </select>
                    )}
                    {["APPROVED", "REJECTED"].includes(editForm.status) && (
                      <p className="text-xs text-gray-500">
                        Status cannot be changed once approved or rejected.
                      </p>
                    )}
                  </div>

                  <div className="space-y-3">
                    <label className="block text-sm font-medium text-gray-700">
                      Claim Amount (DKK)
                    </label>
                    <input
                      type="number"
                      value={editForm.incidentDetails.claimAmount || ""}
                      onChange={(e) =>
                        setEditForm({
                          ...editForm,
                          incidentDetails: {
                            ...editForm.incidentDetails,
                            claimAmount: e.target.value,
                          },
                        })
                      }
                      placeholder="Enter amount"
                      min="0"
                      step="0.01"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                {/* Incident Description */}
                <div className="space-y-3">
                  <label className="block text-sm font-medium text-gray-700">
                    Incident Description
                  </label>
                  <textarea
                    value={editForm.incidentDetails.description}
                    onChange={(e) =>
                      setEditForm({
                        ...editForm,
                        incidentDetails: {
                          ...editForm.incidentDetails,
                          description: e.target.value,
                        },
                      })
                    }
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Police Report */}
                <div className="space-y-3">
                  <label className="block text-sm font-medium text-gray-700">
                    Police Report Number
                  </label>
                  <input
                    value={editForm.incidentDetails.policeReportNumber}
                    onChange={(e) =>
                      setEditForm({
                        ...editForm,
                        incidentDetails: {
                          ...editForm.incidentDetails,
                          policeReportNumber: e.target.value,
                        },
                      })
                    }
                    placeholder="Enter police report number if applicable"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Location Information */}
                <div className="border-t pt-6 space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Location Details
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <label className="block text-sm font-medium text-gray-700">
                        Street
                      </label>
                      <input
                        value={editForm.incidentDetails.location.street}
                        onChange={(e) =>
                          setEditForm({
                            ...editForm,
                            incidentDetails: {
                              ...editForm.incidentDetails,
                              location: {
                                ...editForm.incidentDetails.location,
                                street: e.target.value,
                              },
                            },
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div className="space-y-3">
                      <label className="block text-sm font-medium text-gray-700">
                        City
                      </label>
                      <input
                        value={editForm.incidentDetails.location.city}
                        onChange={(e) =>
                          setEditForm({
                            ...editForm,
                            incidentDetails: {
                              ...editForm.incidentDetails,
                              location: {
                                ...editForm.incidentDetails.location,
                                city: e.target.value,
                              },
                            },
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div className="space-y-3">
                      <label className="block text-sm font-medium text-gray-700">
                        Postal Code
                      </label>
                      <input
                        value={editForm.incidentDetails.location.postalCode}
                        onChange={(e) =>
                          setEditForm({
                            ...editForm,
                            incidentDetails: {
                              ...editForm.incidentDetails,
                              location: {
                                ...editForm.incidentDetails.location,
                                postalCode: e.target.value,
                              },
                            },
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div className="space-y-3">
                      <label className="block text-sm font-medium text-gray-700">
                        Country
                      </label>
                      <input
                        value={editForm.incidentDetails.location.country}
                        onChange={(e) =>
                          setEditForm({
                            ...editForm,
                            incidentDetails: {
                              ...editForm.incidentDetails,
                              location: {
                                ...editForm.incidentDetails.location,
                                country: e.target.value,
                              },
                            },
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Third Party Information */}
                <div className="border-t pt-6 space-y-4">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="thirdPartyInvolved"
                      checked={editForm.incidentDetails.thirdPartyInvolved}
                      onChange={(e) =>
                        setEditForm({
                          ...editForm,
                          incidentDetails: {
                            ...editForm.incidentDetails,
                            thirdPartyInvolved: e.target.checked,
                          },
                        })
                      }
                      className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <label
                      htmlFor="thirdPartyInvolved"
                      className="text-sm font-medium text-gray-700"
                    >
                      Third Party Involved
                    </label>
                  </div>

                  {editForm.incidentDetails.thirdPartyInvolved && (
                    <div className="bg-gray-50 p-6 rounded-lg space-y-4">
                      <h4 className="font-medium text-gray-900">
                        Third Party Details
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-3">
                          <label className="block text-sm font-medium text-gray-700">
                            Name
                          </label>
                          <input
                            value={
                              editForm.incidentDetails.thirdPartyDetails.name
                            }
                            onChange={(e) =>
                              setEditForm({
                                ...editForm,
                                incidentDetails: {
                                  ...editForm.incidentDetails,
                                  thirdPartyDetails: {
                                    ...editForm.incidentDetails
                                      .thirdPartyDetails,
                                    name: e.target.value,
                                  },
                                },
                              })
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        <div className="space-y-3">
                          <label className="block text-sm font-medium text-gray-700">
                            Contact Info
                          </label>
                          <input
                            value={
                              editForm.incidentDetails.thirdPartyDetails
                                .contactInfo
                            }
                            onChange={(e) =>
                              setEditForm({
                                ...editForm,
                                incidentDetails: {
                                  ...editForm.incidentDetails,
                                  thirdPartyDetails: {
                                    ...editForm.incidentDetails
                                      .thirdPartyDetails,
                                    contactInfo: e.target.value,
                                  },
                                },
                              })
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        <div className="space-y-3 md:col-span-2">
                          <label className="block text-sm font-medium text-gray-700">
                            Insurance Information
                          </label>
                          <textarea
                            value={
                              editForm.incidentDetails.thirdPartyDetails
                                .insuranceInfo
                            }
                            onChange={(e) =>
                              setEditForm({
                                ...editForm,
                                incidentDetails: {
                                  ...editForm.incidentDetails,
                                  thirdPartyDetails: {
                                    ...editForm.incidentDetails
                                      .thirdPartyDetails,
                                    insuranceInfo: e.target.value,
                                  },
                                },
                              })
                            }
                            rows={3}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="border-t p-6">
              <div className="flex justify-end gap-3">
                <Button
                  variant="outline"
                  onClick={() => {
                    setActiveModal(null);
                    setEditForm(null);
                  }}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSaveClaim}
                  disabled={isUpdating}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  {isUpdating ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Saving...
                    </div>
                  ) : (
                    <>
                      <Save className="h-5 w-5 mr-2" />
                      Save Changes
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Approve Claim Modal */}
      {activeModal === "approve" && selectedClaim && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md flex flex-col">
            <div className="flex items-center justify-between p-6 border-b">
              <div>
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  Approve Claim
                </h2>
                <p className="text-gray-600 text-sm mt-1">
                  Approve claim {selectedClaim.claimNumber} for processing
                </p>
              </div>
              <button
                onClick={() => {
                  setActiveModal(null);
                  setApproveAmount("");
                  setActionNotes("");
                }}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition"
                disabled={isApproving}
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              {selectedClaim && (
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700 block mb-1">
                        Claimed Amount
                      </label>
                      <div className="text-lg font-semibold">
                        {formatCurrency(
                          Number(selectedClaim.incidentDetails.claimAmount)
                        )}
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700 block mb-1">
                        Processing Days
                      </label>
                      <div>
                        <span
                          className={`font-semibold ${getProcessingTimeColor(
                            selectedClaim.processingDays
                          )}`}
                        >
                          {selectedClaim.processingDays !== null
                            ? `${selectedClaim.processingDays} days`
                            : "N/A"}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label
                      htmlFor="approveAmount"
                      className="text-sm font-medium text-gray-700 block"
                    >
                      Approved Amount *
                    </label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <input
                        id="approveAmount"
                        type="number"
                        className="w-full pl-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                        value={approveAmount}
                        onChange={(e) => setApproveAmount(e.target.value)}
                        placeholder="Enter approved amount"
                        min="0"
                        step="0.01"
                        disabled={isApproving}
                      />
                    </div>
                    {approveAmount && (
                      <div className="text-sm text-gray-500">
                        {new Intl.NumberFormat("da-DK", {
                          style: "currency",
                          currency: "DKK",
                        }).format(parseFloat(approveAmount))}
                      </div>
                    )}
                  </div>

                  <div className="space-y-3">
                    <label
                      htmlFor="actionNotes"
                      className="text-sm font-medium text-gray-700 block"
                    >
                      Approval Notes
                    </label>
                    <textarea
                      id="actionNotes"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                      value={actionNotes}
                      onChange={(e) => setActionNotes(e.target.value)}
                      placeholder="Add any notes about this approval..."
                      rows={3}
                      disabled={isApproving}
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="border-t p-6">
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => {
                    setActiveModal(null);
                    setApproveAmount("");
                    setActionNotes("");
                  }}
                  disabled={isApproving}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
                <button
                  onClick={handleApproveClaim}
                  disabled={
                    isApproving ||
                    !approveAmount ||
                    parseFloat(approveAmount) <= 0
                  }
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isApproving ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Approving...
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Approve Claim
                    </div>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Custom Reject Modal */}
      {activeModal === "reject" && selectedClaim && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b">
              <div>
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <XCircle className="h-5 w-5 text-red-600" />
                  Reject Claim
                </h2>
                <p className="text-gray-600 text-sm mt-1">
                  Reject claim {selectedClaim.claimNumber}
                </p>
              </div>
              <button
                onClick={() => {
                  setActiveModal(null);
                  setRejectionReason("");
                  setActionNotes("");
                }}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition"
                disabled={isRejecting}
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
              {selectedClaim && (
                <div className="space-y-6">
                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-center gap-2 text-red-700 mb-2">
                      <AlertCircle className="h-4 w-4" />
                      <span className="text-sm font-medium">
                        This action cannot be undone
                      </span>
                    </div>
                    <p className="text-sm text-red-600">
                      The customer will be notified about the rejection.
                    </p>
                  </div>

                  <div className="space-y-3">
                    <label
                      htmlFor="rejectionReason"
                      className="text-sm font-medium text-gray-700 block"
                    >
                      Rejection Reason *
                    </label>
                    <textarea
                      id="rejectionReason"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                      value={rejectionReason}
                      onChange={(e) => setRejectionReason(e.target.value)}
                      placeholder="Explain why this claim is being rejected..."
                      rows={3}
                      required
                      disabled={isRejecting}
                    />
                    <p className="text-xs text-gray-500">
                      This reason will be visible to the customer.
                    </p>
                  </div>

                  <div className="space-y-3">
                    <label
                      htmlFor="actionNotes"
                      className="text-sm font-medium text-gray-700 block"
                    >
                      Internal Notes (Optional)
                    </label>
                    <textarea
                      id="actionNotes"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                      value={actionNotes}
                      onChange={(e) => setActionNotes(e.target.value)}
                      placeholder="Add internal notes for record keeping..."
                      rows={2}
                      disabled={isRejecting}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="border-t p-6">
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => {
                    setActiveModal(null);
                    setRejectionReason("");
                    setActionNotes("");
                  }}
                  disabled={isRejecting}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
                <button
                  onClick={handleRejectClaim}
                  disabled={isRejecting || !rejectionReason.trim()}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isRejecting ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Rejecting...
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <XCircle className="h-4 w-4 mr-2" />
                      Reject Claim
                    </div>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Custom Mark as Paid Modal */}
      {activeModal === "pay" && selectedClaim && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b">
              <div>
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-emerald-600" />
                  Mark Claim as Paid
                </h2>
                <p className="text-gray-600 text-sm mt-1">
                  Confirm payment for claim {selectedClaim.claimNumber}
                </p>
              </div>
              <button
                onClick={() => {
                  setActiveModal(null);
                  setActionNotes("");
                }}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition"
                disabled={isPaying}
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
              {selectedClaim && (
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700 block mb-1">
                        Approved Amount
                      </label>
                      <div className="text-lg font-semibold text-green-600">
                        {formatCurrency(selectedClaim.approvedAmount)}
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700 block mb-1">
                        Claimed Amount
                      </label>
                      <div className="text-sm">
                        {formatCurrency(
                          Number(selectedClaim.incidentDetails.claimAmount)
                        )}
                      </div>
                    </div>
                  </div>
                  {selectedClaim.approvedAmount !==
                    selectedClaim.incidentDetails.claimAmount && (
                    <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <div className="flex items-center gap-2 text-yellow-700 mb-2">
                        <AlertCircle className="h-4 w-4" />
                        <span className="text-sm font-medium">
                          Amount Adjusted
                        </span>
                      </div>
                      <p className="text-sm text-yellow-600">
                        Approved amount differs from claimed amount by{" "}
                        {formatCurrency(
                          (selectedClaim.approvedAmount || 0) -
                            (Number(
                              selectedClaim.incidentDetails.claimAmount
                            ) || 0)
                        )}
                      </p>
                    </div>
                  )}

                  <div className="space-y-3">
                    <label
                      htmlFor="actionNotes"
                      className="text-sm font-medium text-gray-700 block"
                    >
                      Payment Notes (Optional)
                    </label>
                    <textarea
                      id="actionNotes"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      value={actionNotes}
                      onChange={(e) => setActionNotes(e.target.value)}
                      placeholder="Add payment reference, method, or other notes..."
                      rows={3}
                      disabled={isPaying}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="border-t p-6">
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => {
                    setActiveModal(null);
                    setActionNotes("");
                  }}
                  disabled={isPaying}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
                <button
                  onClick={handleMarkAsPaid}
                  disabled={isPaying}
                  className="px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isPaying ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Processing...
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <DollarSign className="h-4 w-4 mr-2" />
                      Mark as Paid
                    </div>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminAllClaims;
